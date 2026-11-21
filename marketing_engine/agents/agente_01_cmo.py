"""Agente 01 · CMO y Orquestador.

Primer y último eslabón de la cadena de mando: decide QUÉ se publica hoy (brief
estratégico) y resuelve los casos que el Auditor no logra destrabar tras las
revisiones permitidas (escalamiento).
"""

from __future__ import annotations

from datetime import date

from .. import config as C
from ..llm import LLMError, get_llm
from ..state import Brief, DecisionEscalamiento, MarketingState
from ..tools import repo_tools as R
from ._comun import REGLA_DATOS_EXTERNOS, bloque_etica, bloque_inventario, bloque_marca, historial_fallos

SYSTEM_PROMPT = f"""Sos el CMO (Chief Marketing Officer) y orquestador del departamento de marketing digital de un estudio jurídico argentino. \
Reportás al socio titular. Dirigís a seis especialistas: Radar de Inteligencia, Estrategia de Oferta, Redactor de Blog, Redactor de Tips, \
Auditor de Calidad y Ética, y Publicador. Tu trabajo es decidir con criterio de negocio, no escribir.

MISIÓN
Hacer crecer, sin presupuesto publicitario y en 90 días, la captación orgánica de consultas (formulario /evaluacion y WhatsApp) para un estudio \
de La Plata, mediante SEO, GEO (visibilidad en respuestas de buscadores con IA) y contenido útil. El indicador que importa es consultas calificadas, \
no visitas.

CÓMO DECIDÍS QUÉ PUBLICAR HOY
1. Prioridad por cobertura: dentro del formato que toca, elegí el área con MENOS contenido existente y MAYOR potencial de conversión inmediata. \
Potencial alto = plazo fatal o urgencia real (prescripción, caducidad, medida cautelar, primeras 48 horas), problema costoso para la persona y \
intención de contratar (no de informarse por curiosidad). Ejemplos de alto potencial: sucesión con inmuebles, defensa penal urgente tras una citación, \
amparos contra IOMA o por pensiones ANDIS, despido y ART, estafas bancarias.
2. Un tema = una intención de búsqueda. Si algo del inventario ya responde esa intención, NO la repitas: cambiá el ángulo (otra etapa del problema, otro \
actor, otro organismo, otra consecuencia) o elegí otro tema. La canibalización de keywords es un error grave.
3. El tema se redacta como lo busca una persona angustiada en Google ('qué hago si...', 'cuánto tarda...', 'me llegó una cédula de...'), no como un título académico.
4. Respetá la fase del plan de 90 días (te la paso en el pedido): Fase 1 pilares y tips de emergencia; Fase 2 long-tail y preguntas reales; Fase 3 autoridad, novedades y conversión.
5. Los tips son guías de acción en las primeras 48 horas y deben apuntar (nota_pilar) a una nota del blog existente de la misma área; si no hay ninguna, elegí un tema \
que sea candidato a pilar en blog y no un tip.
6. Solo podés usar áreas, materias y categorías de la lista que te paso. No inventes rutas ni slugs: en enlaces_internos y nota_pilar usá únicamente rutas del inventario.

QUÉ ENTREGÁS
Un brief estratégico en JSON que cumpla el esquema indicado. Cada campo es una orden para otro agente: keyword_principal exacta, intencion_busqueda concreta, \
plazo_clave SOLO si existe un plazo legal real y conocido (si no estás seguro, dejalo vacío: el Radar lo verificará), angulo diferencial explícito, y en 'evitar' \
lo que ya existe y no debe repetirse.

{bloque_marca()}

{bloque_etica()}

{REGLA_DATOS_EXTERNOS}"""


class CMOError(RuntimeError):
    pass


# --------------------------------------------------------------------------
# Plan de 90 días
# --------------------------------------------------------------------------


def dia_del_plan(hoy: date) -> int:
    return (hoy - date.fromisoformat(C.PLAN_90_DIAS["inicio"])).days + 1


def fase_del_plan(dia: int) -> dict:
    fases = C.PLAN_90_DIAS["fases"]
    if dia < 1:
        return {**fases[0], "nombre": "Pre-lanzamiento (se aplica la Fase 1)"}
    for f in fases:
        if f["dias"][0] <= dia <= f["dias"][1]:
            return f
    return {**fases[-1], "nombre": "Mantenimiento posterior al día 90 (criterio de la Fase 3)"}


def formato_del_dia(hoy: date) -> str | None:
    cad = C.PLAN_90_DIAS["cadencia_semanal"]
    valor = (cad[hoy.weekday()] if hoy.weekday() < len(cad) else "").strip()
    return valor if valor in ("blog", "tip") else None


# --------------------------------------------------------------------------
# Brief
# --------------------------------------------------------------------------


def _candidatas(inv, formato: str, area_slug: str | None):
    if area_slug:
        c = [x for x in inv.cobertura if x.area.slug == area_slug]
        if not c:
            validos = ", ".join(a.slug for a in inv.areas)
            raise CMOError(f"Área desconocida: {area_slug!r}. Áreas válidas: {validos}")
        return c
    cands = [x for x in inv.cobertura if formato == "blog" or x.area.categoria_tips]
    return cands[:4]


def _tabla_cobertura(cands) -> str:
    filas = ["área (slug) | materia | notas blog | tips | días sin publicar | peso conversión (1-5) | prioridad"]
    for c in cands:
        filas.append(
            f"{c.area.slug} | {c.area.materia} | {c.notas_blog} | {c.tips if c.area.categoria_tips else 'n/a (sin categoría de tips)'} "
            f"| {c.dias_sin_publicar if c.dias_sin_publicar is not None else 'nunca'} | {c.peso_conversion} | {c.puntaje_prioridad}"
        )
    return "\n".join(filas)


def _brief_por_llm(state: MarketingState, inv, formato: str, cands, fase, dia, extra: str = "") -> Brief:
    area_txt = []
    for c in cands:
        a = c.area
        existentes = [i for i in inv.blog + inv.tips if i.materia in {a.materia, a.categoria_tips}]
        area_txt.append(
            f"## {a.slug} ({a.nombre})\n"
            f"Situaciones típicas del área (de areas.ts): {', '.join(a.situaciones) or 'n/d'}\n"
            f"FAQs que ya responde la página del área: {'; '.join(a.faqs) or 'n/d'}\n"
            f"Contenido existente: {'; '.join(i.titulo for i in existentes) or 'ninguno'}"
        )
    tema = state.get("tema", "")
    pilares = [f"{i.ruta} ({i.materia}): {i.titulo}" for i in inv.blog]
    prompt = f"""FECHA: {inv.fecha} · Día {dia} del plan de 90 días · {fase['nombre']}
Objetivo de la fase: {fase['objetivo']}
Foco: {fase['foco']}

FORMATO QUE TOCA HOY: {formato}
{('TEMA PEDIDO POR EL SOCIO (respetalo y afinalo, cambiando el ángulo si ya existe algo parecido): ' + tema) if tema else 'Elegí vos el tema.'}

COBERTURA (ordenada por prioridad):
{_tabla_cobertura(cands)}

ÁREAS CANDIDATAS:
{chr(10).join(area_txt)}

NOTAS DEL BLOG DISPONIBLES COMO PILAR PARA TIPS:
{chr(10).join(pilares)}

{bloque_inventario(inv)}

CATEGORÍAS DE TIPS VÁLIDAS: {', '.join(inv.categorias_tips)}
{extra}
Devolvé el brief. En 'materia' poné la materia del área (blog) o la categoría de tips (tip)."""
    return get_llm().estructurado(
        system=SYSTEM_PROMPT, prompt=prompt, schema=Brief, modelo=C.settings().modelo_estrategia, temperatura=0.5
    )


def _brief_de_respaldo(inv, formato: str, cands) -> Brief:
    """Sin LLM: toma la primera situación de areas.ts que no canibalice nada."""
    for c in cands:
        for s in c.area.situaciones or [c.area.nombre]:
            if not R.detectar_canibalizacion(s, inv, formato):
                return Brief(
                    formato=formato,  # type: ignore[arg-type]
                    area_slug=c.area.slug,
                    materia=c.area.materia if formato == "blog" else c.area.categoria_tips,
                    tema=s,
                    angulo="Guía práctica orientada a la acción inmediata",
                    keyword_principal=s.lower(),
                    intencion_busqueda="Resolver una situación concreta y urgente",
                    justificacion="Brief de respaldo determinista (el modelo no estuvo disponible).",
                )
    raise CMOError("No se encontró un tema sin canibalización en las áreas candidatas.")


def emitir_brief(state: MarketingState) -> dict:
    """Nodo del grafo: audita el repo, decide y emite el brief del día."""
    inv = R.leer_inventario()
    hoy = C.hoy()
    dia = dia_del_plan(hoy)
    fase = fase_del_plan(dia)
    modo = state.get("modo", "auto")
    bit = [f"CMO: inventario leído ({len(inv.blog)} notas, {len(inv.tips)} tips, {len(inv.areas)} áreas). Día {dia} del plan, {fase['nombre']}."]

    if modo == "auto":
        formato = formato_del_dia(hoy)
        if formato is None and not state.get("ignorar_cadencia"):
            return {
                "inventario": inv,
                "estado": "abortado",
                "motivo_final": f"Hoy ({hoy.isoformat()}) no hay publicación planificada en la cadencia semanal. Usá --ignore-cadence para forzar.",
                "bitacora": bit + ["CMO: día sin publicación según la cadencia."],
            }
        formato = formato or "blog"
        area_slug = state.get("area_slug") or None
    else:
        formato = modo
        area_slug = state.get("area_slug")
        if not area_slug:
            raise CMOError("Los modos blog y tip requieren --area <slug>.")

    cands = _candidatas(inv, formato, area_slug)
    if formato == "tip" and not cands[0].area.categoria_tips:
        raise CMOError(
            f"El área {cands[0].area.slug!r} no tiene categoría en CATEGORIAS_TIPS (src/lib/tips.ts): "
            "un tip no aparecería en /tips. Publicá una nota de blog o agregá la categoría en el sitio."
        )

    try:
        brief = _brief_por_llm(state, inv, formato, cands, fase, dia)
        choques = R.detectar_canibalizacion(f"{brief.tema} {brief.keyword_principal}", inv, formato)
        if choques:
            lista = "; ".join(f"{i.ruta} (similitud {s})" for i, s in choques[:3])
            bit.append(f"CMO: el tema canibaliza {lista}. Pido otro ángulo.")
            brief = _brief_por_llm(
                state, inv, formato, cands, fase, dia,
                extra=f"\nATENCIÓN: tu propuesta anterior ('{brief.tema}') canibaliza: {lista}. Elegí OTRA intención de búsqueda o un ángulo claramente distinto.\n",
            )
    except LLMError as exc:
        if C.settings().gemini_api_key or C.settings().mock:
            bit.append(f"CMO: el modelo falló ({exc}); uso brief de respaldo.")
            brief = _brief_de_respaldo(inv, formato, cands)
        else:
            raise

    # --- normalización determinista del brief -------------------------------
    area = R.obtener_area(inv, brief.area_slug) or cands[0].area
    if area_slug and area.slug != area_slug:
        area = cands[0].area
    brief.area_slug = area.slug
    brief.formato = formato  # type: ignore[assignment]
    brief.materia = area.materia if formato == "blog" else area.categoria_tips
    brief.dia_plan, brief.fase = dia, fase["nombre"]
    if state.get("tema") and not brief.tema:
        brief.tema = state["tema"]

    rutas_blog = {i.slug: i for i in inv.blog}
    if formato == "tip":
        if brief.nota_pilar not in rutas_blog:
            propios = [i for i in inv.blog if i.materia == area.materia]
            mejor = max(propios, key=lambda i: R.similitud(brief.tema, i.titulo + " " + i.descripcion), default=None)
            brief.nota_pilar = mejor.slug if mejor else ""
    else:
        brief.nota_pilar = ""
    sug = R.enlaces_internos(inv, area, f"{brief.tema} {brief.keyword_principal}")
    brief.enlaces_internos = list(dict.fromkeys([e["ruta"] for e in sug] + [x for x in brief.enlaces_internos if x in R.rutas_validas(inv.areas, inv.blog, inv.tips)]))
    bit.append(f"CMO: brief emitido → {formato} · {area.slug} · «{brief.tema}» · kw «{brief.keyword_principal}».")
    return {"inventario": inv, "brief": brief, "fallos": 0, "escalaciones": state.get("escalaciones", 0), "bitacora": bit}


# --------------------------------------------------------------------------
# Escalamiento
# --------------------------------------------------------------------------


def escalar(state: MarketingState) -> dict:
    """Nodo del grafo: el Auditor rechazó más de `max_revisiones` veces. El CMO decide si reformular o abortar."""
    cfg = C.settings()
    brief = state["brief"]
    esc = state.get("escalaciones", 0)
    hist = state.get("historial_auditorias", [])
    bit = [f"CMO: ESCALAMIENTO recibido tras {state.get('fallos', 0)} auditorías rechazadas (escalación {esc + 1}/{cfg.max_escalaciones})."]

    if esc >= cfg.max_escalaciones:
        return {
            "estado": "abortado",
            "motivo_final": "El contenido no superó la auditoría tras las revisiones y la reformulación del CMO. Revisión humana necesaria.",
            "bitacora": bit + ["CMO: se agotó el presupuesto de escalaciones; se aborta sin publicar."],
        }

    prompt = f"""El Auditor rechazó {state.get('fallos', 0)} veces el borrador del brief siguiente.

BRIEF: formato={brief.formato}, área={brief.area_slug}, tema='{brief.tema}', ángulo='{brief.angulo}', keyword='{brief.keyword_principal}'.

HALLAZGOS GRAVES REPETIDOS:
{historial_fallos(hist, 12)}

Decidí:
- 'reformular': si el problema está en el planteo (tema demasiado riesgoso, ángulo que obliga a prometer resultados, falta de fuentes verificables). Dá nuevo_tema y nuevo_angulo concretos que eviten el problema.
- 'abortar': si el tema no puede tratarse con seguridad ética o jurídica con la información verificada disponible.
Elegí 'reformular' solo si el nuevo planteo realmente evita lo que falló."""
    try:
        d = get_llm().estructurado(
            system=SYSTEM_PROMPT, prompt=prompt, schema=DecisionEscalamiento, modelo=cfg.modelo_estrategia, temperatura=0.3
        )
    except LLMError as exc:
        d = DecisionEscalamiento(decision="abortar", motivo=f"El modelo no pudo decidir el escalamiento: {exc}")

    if d.decision == "abortar":
        return {"estado": "abortado", "motivo_final": d.motivo, "bitacora": bit + [f"CMO: decide ABORTAR. {d.motivo}"]}

    nuevo = brief.model_copy(update={"tema": d.nuevo_tema or brief.tema, "angulo": d.nuevo_angulo or brief.angulo})
    return {
        "brief": nuevo,
        "fallos": 0,
        "escalaciones": esc + 1,
        "instrucciones_pendientes": "",
        "bitacora": bit + [f"CMO: decide REFORMULAR → nuevo tema «{nuevo.tema}». {d.motivo}"],
    }
