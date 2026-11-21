"""Agente 02 · Head of Market Intelligence y SEO/GEO 2026-2027.

Usa Google Search Grounding (google-genai) para trabajar con información en tiempo
real. Regla de oro: un hallazgo solo es "verificado" si el buscador realmente
consultó una fuente de ese dominio. Lo demás queda marcado como no verificado y
el redactor tiene prohibido citarlo como hecho.
"""

from __future__ import annotations

from .. import config as C
from ..llm import LLMError, get_llm
from ..state import Fuente, IntelReport, MarketingState
from ._comun import REGLA_DATOS_EXTERNOS, bloque_inventario, bloque_marca

SYSTEM_PROMPT = f"""Sos el Head of Market Intelligence y estratega SEO/GEO de un estudio jurídico argentino con sede en La Plata. \
Tu trabajo es entregar inteligencia VERIFICADA para que el equipo escriba contenido jurídico exacto y posicionable en 2026-2027.

QUÉ INVESTIGÁS (siempre con la herramienta de búsqueda, nunca de memoria)
A. NORMATIVA VIGENTE A LA FECHA: leyes, decretos, resoluciones, acordadas y reformas que afectan el tema (Código Civil y Comercial, LCT, Ley 24.557 y sus reformas, \
Ley 27.742, CPP bonaerense Ley 11.922, Ley 12.008, Ley 13.951, normas del BCRA, resoluciones de ANDIS, IOMA, SRT, etc.). Para cada norma: número, artículo si es clave, \
estado de vigencia hoy y si hubo cambios recientes. Prioridad de fuentes: InfoLeg, SAIJ, Boletín Oficial de la Nación y de la Provincia, sitios oficiales de organismos, \
CSJN, SCBA, JUBA, PJN.
B. JURISPRUDENCIA RECIENTE: fallos de la CSJN, de la SCBA y de tribunales de La Plata y de la Provincia de Buenos Aires. Para cada fallo: tribunal, fecha y qué decidió. \
Si no podés confirmar un fallo en una fuente, NO lo incluyas: jamás inventes carátulas, números de expediente, fechas ni citas textuales.
C. CAMBIOS EN ORGANISMOS: ANDIS, IOMA, ANSES, ARCA, BCRA, SRT, comisiones médicas, mesas de entradas, plazos administrativos, formularios nuevos, trámites digitalizados.
D. DEMANDA REAL: cómo busca la gente en Argentina (preguntas tipo 'People also ask', autocompletado, foros, redes, consultas a organismos). Frases literales y variantes de long-tail.
E. COMPETENCIA: qué páginas ocupan hoy los primeros resultados de esa búsqueda (estudios, portales de noticias, organismos), qué cubren y, sobre todo, qué NO cubren \
(plazos concretos, pasos en orden, comparación de vías, qué hacer en las primeras 48 horas, cifras actualizadas, particularidades de La Plata y la Provincia).
F. OPORTUNIDAD GEO: qué pregunta exacta y qué respuesta de una o dos oraciones podría citar un buscador con IA, y qué datos estructurados la respaldan.

REGLAS DE VERACIDAD
- Cada hecho lleva su fuente (dominio). Si dos fuentes se contradicen, decilo y marcá el riesgo.
- Diferenciá lo vigente de lo derogado, suspendido por cautelar o en trámite parlamentario. Si hay duda sobre la vigencia, es un riesgo de desactualización: listalo.
- No trates como fuente a otros estudios de abogados para afirmar derecho: solo sirven para medir competencia.
- Datos del usuario o del estudio: no los uses ni los envíes en las búsquedas; buscá solo conceptos jurídicos y de mercado.

{bloque_marca()}

{REGLA_DATOS_EXTERNOS}"""

SYSTEM_ESTRUCTURA = f"""Sos un analista que convierte un informe de investigación en un JSON estricto. No agregás información nueva: solo ordenás lo que dice el informe. \
Si algo del informe no tiene fuente clara, dejá fuente_dominio vacío. Los fallos van SOLO si el informe da tribunal y fecha. {REGLA_DATOS_EXTERNOS}"""


def _dominios(fuentes: list[Fuente]) -> set[str]:
    out = set()
    for f in fuentes:
        for d in (f.dominio, f.titulo):
            d = (d or "").lower().replace("www.", "")
            if d:
                out.add(d)
    return out


def _verificado(dominio: str, permitidos: set[str]) -> bool:
    d = (dominio or "").lower().replace("www.", "").strip()
    if not d:
        return False
    return any(d == p or d.endswith("." + p) or p.endswith("." + d) or d in p for p in permitidos)


def investigar(state: MarketingState) -> dict:
    llm = get_llm()
    cfg = C.settings()
    brief, inv = state["brief"], state["inventario"]
    contexto = f"""FECHA DE HOY: {inv.fecha}. Trabajá con el derecho vigente a esa fecha.
TEMA: {brief.tema}
KEYWORD PRINCIPAL: {brief.keyword_principal}
ÁNGULO DEFINIDO POR EL CMO: {brief.angulo}
INTENCIÓN DE BÚSQUEDA: {brief.intencion_busqueda}
PLAZO QUE EL CMO CREE RELEVANTE (verificalo): {brief.plazo_clave or 'no informado'}
MATERIA: {brief.materia} · JURISDICCIÓN: {C.MARCA['jurisdiccion']}
"""
    # Pasada 1: derecho, jurisprudencia y organismos.
    p1 = f"""{contexto}
Investigá los puntos A, B y C. Entregá un informe en prosa ordenada con subtítulos 'NORMAS', 'FALLOS', 'ORGANISMOS' y 'RIESGOS DE DESACTUALIZACIÓN'. \
En cada ítem escribí el dominio de la fuente entre paréntesis. Indicá explícitamente qué NO pudiste verificar."""
    # Pasada 2: demanda, competencia y GEO.
    p2 = f"""{contexto}
{bloque_inventario(inv, brief, 30)}

Investigá los puntos D, E y F. Entregá un informe con subtítulos 'PREGUNTAS REALES', 'BRECHAS DE LA COMPETENCIA', 'KEYWORDS' (principales y long-tail) y 'OPORTUNIDAD GEO'. \
Las brechas deben ser accionables para redactar una nota mejor que la que hoy rankea."""

    try:
        t1 = llm.texto(system=SYSTEM_PROMPT, prompt=p1, grounded=True, modelo=cfg.modelo_estrategia, temperatura=0.2)
        t2 = llm.texto(system=SYSTEM_PROMPT, prompt=p2, grounded=True, modelo=cfg.modelo_estrategia, temperatura=0.3)
    except LLMError as exc:
        # Modo conservador: sin inteligencia verificada, el redactor no puede citar nada.
        intel = IntelReport(
            resumen_ejecutivo="El Radar no pudo consultar fuentes en esta ejecución.",
            riesgos_desactualizacion=[f"Sin fuentes verificadas ({exc}): no citar fallos, cifras ni plazos."],
        )
        return {"intel": intel, "bitacora": [f"Radar: FALLÓ la búsqueda ({exc}). Modo conservador: nada verificado."]}

    fuentes = list({f.uri: f for f in t1.fuentes + t2.fuentes}.values())
    consultas = list(dict.fromkeys(t1.consultas + t2.consultas))
    permitidos = _dominios(fuentes)

    prompt_est = f"""INFORME 1 (derecho y organismos):
{t1.texto}

INFORME 2 (demanda y competencia):
{t2.texto}

DOMINIOS EFECTIVAMENTE CONSULTADOS POR EL BUSCADOR: {', '.join(sorted(permitidos)) or '(ninguno)'}

Convertí todo en el JSON del esquema. En 'verificado' poné siempre false: lo determina el sistema."""
    intel = llm.estructurado(system=SYSTEM_ESTRUCTURA, prompt=prompt_est, schema=IntelReport, modelo=cfg.modelo_rapido, temperatura=0.1)

    # Verificación determinista: solo cuenta si el dominio fue realmente consultado.
    for h in intel.normas + intel.fallos + intel.cambios_organismos:
        h.verificado = _verificado(h.fuente_dominio, permitidos)
    intel.fuentes = fuentes
    intel.consultas_realizadas = consultas
    if not fuentes:
        intel.riesgos_desactualizacion.append("El buscador no devolvió fuentes: todo queda como no verificado.")

    nv = sum(not h.verificado for h in intel.normas + intel.fallos + intel.cambios_organismos)
    return {
        "intel": intel,
        "bitacora": [
            f"Radar: {len(consultas)} búsquedas, {len(fuentes)} fuentes; {len(intel.normas)} normas, {len(intel.fallos)} fallos, "
            f"{len(intel.preguntas_usuarios)} preguntas reales, {len(intel.brechas_competencia)} brechas ({nv} hallazgos sin verificar)."
        ],
    }
