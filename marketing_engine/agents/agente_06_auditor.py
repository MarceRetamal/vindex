"""Agente 06 · Gatekeeper de Calidad, SEO y Ética (Ley 5177 PBA).

Auditoría BLOQUEANTE en dos capas:

1. Capa determinista (Python, sin red): schema contra _PLANTILLA.txt y contra el
   conversor real, YAML estricto, build en sandbox, patrones éticos prohibidos,
   citas de fallos no verificadas, posición del chequeo, respuesta directa,
   canibalización y enlaces.
2. Capa de criterio (LLM): verificación jurídica con Google Search Grounding y
   evaluación ética, SEO/GEO y de conversión, con instrucciones exactas.

Un contenido se aprueba solo si NO tiene hallazgos bloqueantes ni mayores y todos
los puntajes alcanzan el umbral. Nada se aprueba por cansancio.
"""

from __future__ import annotations

import re

from .. import config as C
from ..llm import get_llm
from ..state import AuditReport, Hallazgo_Auditoria, MarketingState, Puntajes
from ..tools import repo_tools as R
from ._comun import MARCADOR_CHEQUEO, REGLA_DATOS_EXTERNOS, bloque_etica, bloque_marca, citas_permitidas, resumen_intel
from pydantic import BaseModel, Field

L = C.LIMITES

SYSTEM_PROMPT = f"""Sos el Gatekeeper de Calidad del departamento de marketing de un estudio jurídico de La Plata: auditor jurídico, de ética profesional, de SEO/GEO y de conversión. \
Nada se publica sin tu aprobación. Sos implacable, concreto y justo: no rechazás por gusto ni aprobás por cansancio. Cada hallazgo trae la ubicación exacta, el problema y \
una INSTRUCCIÓN EXACTA que el redactor pueda ejecutar sin preguntar (qué frase reemplazar y por cuál, qué dato agregar, qué eliminar).

CRITERIOS (puntuá cada uno de 0 a 10)
1. ÉTICA (Ley 5177 de la Provincia de Buenos Aires y normas de ética del Colegio de Abogados): cero promesas ni garantías de resultado, explícitas o implícitas ('vas a recuperar...', 'te corresponde seguro', 'es un caso ganado'); \
cero cifras de éxito, testimonios ni casos identificables; cero captación indebida (gratuidad, descuentos, escasez, cupos); cero publicidad de honorarios o de cuota litis; cero denigración; cero comparaciones laudatorias; \
urgencia solo si el plazo es real y verificado; el miedo no reemplaza a la información; aviso de que cada caso depende de sus circunstancias. Puntaje 9 o 10 solo si no hay NINGÚN riesgo ético. \
Distinguí entre afirmar un derecho ('la ley establece que...') y prometer un resultado ('usted va a cobrar...'): lo primero es legítimo.
2. PRECISIÓN JURÍDICA (derecho argentino vigente a la fecha de hoy, con foco en la Provincia de Buenos Aires): normas, artículos, plazos de prescripción y caducidad, organismos y trámites correctos y actuales; \
nada derogado ni desactualizado; fallos citados solo si figuran como VERIFICADOS en el informe del Radar; ninguna carátula, número de expediente ni cita textual inventados; correcta distinción entre regla legal, criterio \
jurisprudencial y práctica administrativa; afirmaciones sobre lo discutido formuladas como discutidas. Todo lo que no puedas confirmar con tu búsqueda es un hallazgo.
3. SCHEMA: cumplimiento exacto de _PLANTILLA.txt y del conversor del sitio (ya se midió de forma determinista; vos juzgás solo lo que una máquina no ve: coherencia entre título, descripción, resumen y cuerpo).
4. SEO/GEO: respuesta directa al comienzo (primeros {L['respuesta_directa_max']} caracteres, autosuficiente y citable); keyword principal en título, primer párrafo y algún subtítulo sin sobreoptimizar; intención de búsqueda resuelta; \
estructura escaneable; FAQ útil y que replica el cuerpo; enlaces internos con ancla descriptiva; frescura (fecha de la normativa considerada); superioridad frente a lo que rankea (cubre las brechas detectadas por el Radar).
5. CONVERSIÓN ANTI-SCROLL: el titular detiene al lector con algo específico y verdadero; el chequeo rápido está en el primer tercio y se entiende en un minuto; hay un camino claro y sin fricción a /evaluacion y a WhatsApp; \
la reversión de riesgo usada es la permitida; el tono transmite criterio, no urgencia fabricada.

REGLAS DE AUDITORÍA
- Severidad: 'bloqueante' (viola ética, afirma derecho falso o no verificado, rompe el schema o el build), 'mayor' (debilita seriamente precisión, SEO o conversión), 'menor' (mejora opcional).
- Todo puntaje por debajo del umbral ({', '.join(f'{k} ≥ {v}' for k, v in C.UMBRALES_AUDITORIA.items())}) requiere AL MENOS un hallazgo que explique cómo subirlo.
- No repitas hallazgos que la capa determinista ya detectó (te los paso). Sí agregá los que ella no puede ver.
- Verificá con la herramienta de búsqueda; si una afirmación no se puede confirmar, no la des por correcta.

{bloque_etica()}

{bloque_marca()}

{REGLA_DATOS_EXTERNOS}"""


class _HallazgoLLM(BaseModel):
    criterio: str
    severidad: str
    ubicacion: str = ""
    problema: str
    instruccion_exacta: str


class _AuditoriaLLM(BaseModel):
    etica: int = Field(ge=0, le=10)
    precision_juridica: int = Field(ge=0, le=10)
    seo_geo: int = Field(ge=0, le=10)
    conversion: int = Field(ge=0, le=10)
    hallazgos: list[_HallazgoLLM] = Field(default_factory=list)
    resumen: str = ""


# --------------------------------------------------------------------------
# Capa determinista
# --------------------------------------------------------------------------


def _norm(t: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"\*+", "", t)).strip().lower()


def _capa_determinista(state: MarketingState) -> tuple[list[Hallazgo_Auditoria], bool | None]:
    b, inv, intel, offer, brief = state["borrador"], state["inventario"], state["intel"], state["offer"], state["brief"]
    H: list[Hallazgo_Auditoria] = []

    def add(criterio, sev, ubic, prob, instr):
        H.append(Hallazgo_Auditoria(criterio=criterio, severidad=sev, ubicacion=ubic, problema=prob, instruccion_exacta=instr))

    # --- schema, YAML y conversor ------------------------------------------
    for p in R.validar_yaml(b.archivo_md) + R.validar_borrador(b, inv):
        add("schema", "bloqueante" if p.nivel == "error" else "menor", p.campo, p.mensaje, p.arreglo or "Corregilo según _PLANTILLA.txt.")

    # --- build real en sandbox ---------------------------------------------
    build = R.compilar_en_sandbox(b)
    if not build.ok:
        detalle = "; ".join(build.problemas) or build.log[-300:]
        add("schema", "bloqueante", "build", f"scripts/build-content.mjs no compila la pieza: {detalle}", "Corregí el markdown para que compile sin advertencias.")

    # --- ética: patrones --------------------------------------------------
    campos = {
        "título": b.titulo, "titulo_seo": b.titulo_seo, "descripción": b.descripcion, "copete": b.copete,
        "resumen": " ".join(b.resumen), "faq": " ".join(f"{f.pregunta} {f.respuesta}" for f in b.faq), "cuerpo": b.cuerpo_md,
    }
    vistos = set()
    for donde, texto in campos.items():
        for frag, motivo, _pat in R.detectar_promesas(texto):
            if (donde, frag) in vistos:
                continue
            vistos.add((donde, frag))
            add("etica", "bloqueante", donde, f"{motivo}: «…{frag}…»", f"Eliminá o reformulá ese fragmento para que no implique {motivo}; informá el derecho sin prometer ni inducir.")
    if not re.search(r"depende de (sus|cada|las|sus propias) circunstancias|cada caso (es distinto|depende|tiene)|según las circunstancias|depende del caso", b.cuerpo_md, re.I):
        add("etica", "mayor", "cierre", "Falta el aviso de que cada caso depende de sus circunstancias.", "Agregá al cierre: 'Cada caso depende de sus circunstancias; esta nota es informativa y no reemplaza una consulta.'")

    # --- precisión: citas no verificadas -----------------------------------
    sospechosas = R.detectar_citas_no_verificadas(b.cuerpo_md + " " + campos["faq"], citas_permitidas(intel))
    for s in sospechosas[:5]:
        add("precision_juridica", "bloqueante", "cuerpo", f"Cita de fallo o expediente que el Radar no verificó: «{s}»", "Eliminá la cita o reemplazala por una explicación general del criterio sin carátula ni número.")

    # --- SEO/GEO --------------------------------------------------------------
    cuerpo = b.cuerpo_md.strip()
    primer_parrafo = re.split(r"\n{2,}", cuerpo, maxsplit=1)[0]
    if b.formato == "blog":
        rd = _norm(offer.respuesta_directa)
        if rd and not _norm(primer_parrafo).startswith(rd[: min(len(rd), 60)]):
            add("seo_geo", "mayor", "primer párrafo", "El cuerpo no abre con la respuesta directa del Estratega de Oferta.", f"Empezá el primer párrafo, literal, con: «{offer.respuesta_directa}»")
        if len(offer.respuesta_directa) > L["respuesta_directa_max"]:
            add("seo_geo", "mayor", "respuesta directa", f"La respuesta directa mide {len(offer.respuesta_directa)} caracteres.", f"Acortala a {L['respuesta_directa_max']} o menos.")
    kw = brief.keyword_principal
    if kw and R.similitud(kw, b.titulo) < 0.5 and R.similitud(kw, b.titulo_seo or b.titulo) < 0.5:
        add("seo_geo", "mayor", "título", f"El título no contiene la keyword principal «{kw}».", "Reescribí el título para que incluya la keyword principal de forma natural, sin perder el gancho.")
    if kw and R.similitud(kw, primer_parrafo) < 0.34:
        add("seo_geo", "menor", "primer párrafo", f"El primer párrafo casi no menciona «{kw}».", "Incluí la keyword principal de forma natural en el primer párrafo.")
    for it, s in R.detectar_canibalizacion(f"{b.titulo} {kw}", inv, b.formato):
        if s >= 0.85:
            add("seo_geo", "mayor", "tema", f"Canibaliza {it.ruta} (solapamiento {s}).", "Cambiá el ángulo y la keyword principal para que responda otra intención de búsqueda, o enlazá a la nota existente en lugar de repetirla.")
            break

    # --- conversión -------------------------------------------------------------
    encabezado = offer.bloque_diagnostico_md.split("\n", 1)[0].strip()
    idx = cuerpo.find(encabezado) if encabezado else -1
    if idx < 0:
        add("conversion", "bloqueante", "cuerpo", "Falta el bloque de diagnóstico rápido (chequeo de viabilidad).", f"Dejá el marcador {MARCADOR_CHEQUEO} en su propia línea entre las dos primeras secciones.")
    else:
        pos = idx / max(1, len(cuerpo))
        limite = L["checklist_posicion_max"] if b.formato == "blog" else L["checklist_posicion_max_tip"]
        if pos > limite:
            add("conversion", "mayor", "chequeo rápido", f"El chequeo empieza al {pos:.0%} del texto (máx. {limite:.0%}).", "Subí el bloque: debe quedar tras la primera sección, dentro del primer tercio.")
    if "https://wa.me/" not in cuerpo:
        add("conversion", "mayor", "cuerpo", "Falta el enlace a WhatsApp.", "El bloque de chequeo debe incluir el enlace a WhatsApp (se inserta automáticamente: no lo borres).")

    return H, build.ok


# --------------------------------------------------------------------------
# Capa de criterio (LLM + grounding)
# --------------------------------------------------------------------------


def _capa_llm(state: MarketingState, previos: list[Hallazgo_Auditoria]) -> _AuditoriaLLM:
    b, intel, brief, inv = state["borrador"], state["intel"], state["brief"], state["inventario"]
    llm, cfg = get_llm(), C.settings()

    verif = llm.texto(
        system=SYSTEM_PROMPT,
        prompt=f"""FECHA DE HOY: {inv.fecha}. Verificá con la herramienta de búsqueda la exactitud y la vigencia, en el derecho argentino (foco Provincia de Buenos Aires),
de cada afirmación jurídica verificable del texto: normas y artículos, plazos de prescripción o caducidad, organismos, trámites, montos y fallos.
Listá cada una con su estado: CONFIRMADA, NO CONFIRMADA, INCORRECTA o DESACTUALIZADA, con la fuente (dominio) y la corrección si corresponde.

TEXTO A VERIFICAR:
TÍTULO: {b.titulo}
{b.cuerpo_md}""",
        grounded=True,
        modelo=cfg.modelo_auditoria,
        temperatura=0.1,
    )
    ya = "\n".join(f"- [{h.criterio}/{h.severidad}] {h.problema}" for h in previos) or "(ninguno)"
    prompt = f"""FECHA DE HOY: {inv.fecha}
BRIEF: {brief.formato} · {brief.area_slug} · tema «{brief.tema}» · keyword «{brief.keyword_principal}» · intención: {brief.intencion_busqueda}

INTELIGENCIA VERIFICADA DEL RADAR:
{resumen_intel(intel)}

RESULTADO DE TU VERIFICACIÓN CON BÚSQUEDA:
{verif.texto}
(dominios consultados: {', '.join(f.dominio for f in verif.fuentes) or 'ninguno'})

HALLAZGOS QUE LA CAPA DETERMINISTA YA DETECTÓ (no los repitas):
{ya}

PIEZA A AUDITAR ({b.formato})
Frontmatter: titulo={b.titulo!r}; titulo_seo={b.titulo_seo!r}; descripcion={b.descripcion!r}; copete={b.copete!r}; materia/categoría={b.materia!r}
Resumen: {b.resumen!r}
FAQ: {[f.model_dump() for f in b.faq]!r}

CUERPO:
{b.cuerpo_md}

Devolvé puntajes (0-10) de etica, precision_juridica, seo_geo y conversion, y los hallazgos NUEVOS con criterio ∈ [etica, precision_juridica, seo_geo, conversion, schema] y \
severidad ∈ [bloqueante, mayor, menor]."""
    return llm.estructurado(system=SYSTEM_PROMPT, prompt=prompt, schema=_AuditoriaLLM, modelo=cfg.modelo_auditoria, temperatura=0.2)


# --------------------------------------------------------------------------
# Nodo del grafo
# --------------------------------------------------------------------------

_ORDEN = {"bloqueante": 0, "mayor": 1, "menor": 2}


def _instrucciones(hallazgos: list[Hallazgo_Auditoria]) -> str:
    lineas = []
    for i, h in enumerate(sorted(hallazgos, key=lambda h: _ORDEN[h.severidad]), 1):
        if h.severidad == "menor":
            continue
        lineas.append(f"{i}. [{h.severidad.upper()} · {h.criterio}] {h.ubicacion or 'general'}: {h.problema}\n   → {h.instruccion_exacta}")
    return "\n".join(lineas)


def auditar(state: MarketingState) -> dict:
    intento = state.get("fallos", 0) + 1
    det, build_ok = _capa_determinista(state)
    bloqueos_det = [h for h in det if h.severidad == "bloqueante"]

    llm_out = _capa_llm(state, det)
    sev_ok = {"bloqueante", "mayor", "menor"}
    crit_ok = {"etica", "precision_juridica", "schema", "seo_geo", "conversion"}
    nuevos = [
        Hallazgo_Auditoria(
            criterio=h.criterio if h.criterio in crit_ok else "seo_geo",  # type: ignore[arg-type]
            severidad=h.severidad if h.severidad in sev_ok else "mayor",  # type: ignore[arg-type]
            ubicacion=h.ubicacion, problema=h.problema, instruccion_exacta=h.instruccion_exacta,
        )
        for h in llm_out.hallazgos
    ]
    hallazgos = det + nuevos

    errores_schema = sum(1 for h in det if h.criterio == "schema" and h.severidad == "bloqueante")
    punt = Puntajes(
        etica=min(llm_out.etica, 4) if any(h.criterio == "etica" and h.severidad == "bloqueante" for h in hallazgos) else llm_out.etica,
        precision_juridica=min(llm_out.precision_juridica, 5) if any(h.criterio == "precision_juridica" and h.severidad == "bloqueante" for h in hallazgos) else llm_out.precision_juridica,
        estructura=max(0, 10 - 3 * errores_schema),
        seo_geo=llm_out.seo_geo,
        conversion=min(llm_out.conversion, 5) if any(h.criterio == "conversion" and h.severidad == "bloqueante" for h in hallazgos) else llm_out.conversion,
    )

    # Puntaje bajo sin explicación: se exige explicación igual.
    for crit, minimo in C.UMBRALES_AUDITORIA.items():
        valor = getattr(punt, crit)
        if valor < minimo and not any((h.criterio == ("schema" if crit == "estructura" else crit)) and h.severidad != "menor" for h in hallazgos):
            hallazgos.append(
                Hallazgo_Auditoria(
                    criterio=("schema" if crit == "estructura" else crit),  # type: ignore[arg-type]
                    severidad="mayor", ubicacion="general",
                    problema=f"Puntaje de {crit} {valor}/10, por debajo del mínimo {minimo}.",
                    instruccion_exacta=f"Revisá la pieza en términos de {crit} y elevá la calidad hasta cumplir el estándar. {llm_out.resumen}",
                )
            )

    graves = [h for h in hallazgos if h.severidad in ("bloqueante", "mayor")]
    bajo_umbral = [c for c, m in C.UMBRALES_AUDITORIA.items() if getattr(punt, c) < m]
    aprobado = not graves and not bajo_umbral and not bloqueos_det

    informe = AuditReport(
        aprobado=aprobado, intento=intento, puntajes=punt, hallazgos=hallazgos,
        instrucciones_redactor="" if aprobado else _instrucciones(hallazgos),
        build_sandbox_ok=build_ok, resumen=llm_out.resumen,
    )
    veredicto = "APROBADO" if aprobado else f"RECHAZADO ({len(graves)} graves)"
    base = {
        "auditoria": informe,
        "historial_auditorias": [informe],
        "bitacora": [
            f"Auditor (intento {intento}): {veredicto} · ética {punt.etica} · precisión {punt.precision_juridica} · schema {punt.estructura} · SEO/GEO {punt.seo_geo} · conversión {punt.conversion}."
        ],
    }
    if aprobado:
        return {**base, "instrucciones_pendientes": ""}
    return {**base, "fallos": state.get("fallos", 0) + 1, "instrucciones_pendientes": informe.instrucciones_redactor}
