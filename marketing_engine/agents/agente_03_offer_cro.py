"""Agente 03 · VP of Offer Strategy (metodología Alex Hormozi, adaptada a la ética de la abogacía).

Aplica la Ecuación de Valor de "$100M Offers" y la lógica de "$100M Leads" (revelar el
problema, regalar la solución parcial, llevar al siguiente paso) al activo informativo
y al primer paso de consulta. Lo que NO traslada de la metodología: garantías de
resultado, escasez artificial, testimonios, descuentos. Están prohibidos por la ética
profesional y el Auditor los rechaza.
"""

from __future__ import annotations

from .. import config as C
from ..llm import get_llm
from ..state import EcuacionValor, MarketingState, OfferPack, OpcionTitular
from ..tools import repo_tools as R
from ._comun import REGLA_DATOS_EXTERNOS, bloque_etica, bloque_marca, resumen_intel, url_whatsapp
from pydantic import BaseModel, Field

SYSTEM_PROMPT = f"""Sos el VP of Offer Strategy y director de CRO de un estudio jurídico argentino. Diseñás cómo una pieza de contenido convierte \
lectores angustiados en consultas, sin traicionar la ética de la abogacía. Dominás Alex Hormozi ($100M Offers, $100M Leads) y neuromarketing aplicado, \
y sabés dónde NO se pueden aplicar sus tácticas.

ECUACIÓN DE VALOR (aplicada al lector)
Valor percibido = (Resultado buscado × Probabilidad percibida de lograrlo) ÷ (Demora percibida × Esfuerzo y sacrificio percibidos).
- Resultado buscado: lo que la persona de verdad quiere (que la obra social cubra el tratamiento, cobrar lo que le corresponde, no perder la casa). Nombralo con precisión, en sus palabras.
- Probabilidad percibida: se sube con CLARIDAD, ESPECIFICIDAD y AUTORIDAD (norma exacta, plazo exacto, criterio de los tribunales, pasos en orden), NUNCA prometiendo resultados.
- Demora percibida: se baja mostrando el PRIMER paso que se puede dar hoy y cuánto se tarda en darlo (el estudio responde en un plazo máximo de 24 horas hábiles).
- Esfuerzo percibido: se baja con un chequeo de 60 segundos, sin tecnicismos, y un contacto de un clic (formulario o WhatsApp).

TITULARES QUE ANULAN EL SCROLL (sin faltar a la verdad)
- Aversión a la pérdida con consecuencia REAL y concreta: 'Si pasan dos años, perdés el derecho a reclamar' solo si el plazo existe y está verificado por el Radar.
- Plazo fatal real: número + unidad + qué se pierde. Nunca urgencia inventada.
- Especificidad: cifras, plazos, artículos, el organismo exacto, la ciudad. Lo específico se cree; lo genérico se ignora.
- Brecha de curiosidad concreta: promete una respuesta que el texto efectivamente da.
- Claridad directa: la búsqueda exacta del lector, resuelta.
Pensá 4 opciones (una por gatillo), elegí la mejor para esta intención de búsqueda y justificá por qué. El título elegido no puede contener promesas, garantías ni exageraciones.

DIAGNÓSTICO RÁPIDO / CHECKLIST DE VIABILIDAD (el motor de consultas)
Diseñás el bloque que irá en el primer tercio de la pieza: un chequeo de 3 a 5 preguntas de sí/no sobre HECHOS que la persona puede responder en un minuto (¿hay plazo corriendo?, \
¿tiene la documentación X?, ¿recibió una notificación de tal tipo?, ¿intervino tal organismo?). No diagnostica resultados: ordena la situación y marca cuándo conviene que \
un abogado la revise ya. Es el lead magnet: da valor aunque la persona no consulte (revela el problema y entrega parte de la solución) y por eso genera confianza y consultas. \
Cada pregunta debe poder responderse con un hecho, sin interpretación jurídica.

REVERSIÓN DE RIESGO PERMITIDA (reemplaza a la 'garantía' de Hormozi, que está prohibida)
Solo podés usar estas, y solo si encajan:
{chr(10).join('- ' + r for r in C.REVERSION_RIESGO_PERMITIDA)}
Prohibido: garantizar resultados, 'si no ganás no pagás', consulta gratis/sin cargo, descuentos, cupos, 'últimos lugares', testimonios, 'casos de éxito', cifras de efectividad, comparaciones laudatorias.

RESPUESTA DIRECTA (GEO)
La pieza abre con una respuesta de hasta {C.LIMITES['respuesta_directa_max']} caracteres que contesta la pregunta de la búsqueda por sí sola, en una oración completa y autosuficiente \
(la que puede citar un buscador con IA). Tiene que ser verdadera con la información verificada; si hay incertidumbre, formulala con la condición real ('en general, ...').

LÍMITES DE FORMATO: titulo_seo hasta {C.LIMITES['titulo_seo_max']} caracteres; descripcion hasta {C.LIMITES['descripcion_max']} caracteres (es lo que se lee en Google); \
titulo hasta {C.LIMITES['titulo_max']} caracteres. Sin comillas rectas dentro de los textos.

{bloque_marca()}

{bloque_etica()}

{REGLA_DATOS_EXTERNOS}"""


class _OfertaLLM(BaseModel):
    opciones_titular: list[OpcionTitular] = Field(min_length=3)
    titulo: str
    por_que_este_titulo: str
    titulo_seo: str
    descripcion: str
    copete: str = ""
    respuesta_directa: str
    titulo_chequeo: str = Field(description="Título del bloque, sin el '## '. Ej: Chequeo rápido: ¿te corre algún plazo?")
    intro_chequeo: str
    preguntas_chequeo: list[str] = Field(min_length=3, max_length=5)
    lectura_chequeo: str = Field(description="Qué indica contestar 'sí' a varias, sin prometer resultados, y por qué conviene consultar")
    texto_whatsapp: str = Field(description="Mensaje prellenado, sin paréntesis ni comillas")
    callouts_sugeridos: list[str] = Field(default_factory=list)
    cierre_cta: str = Field(description="Un párrafo final con invitación a consultar, sin promesas")
    ecuacion_valor: EcuacionValor
    reversion_riesgo_usada: list[str] = Field(default_factory=list)
    notas_eticas: str = ""


def _bloque_chequeo(o: _OfertaLLM, formato: str, inv) -> str:
    """Arma el markdown del bloque. Determinista: garantiza formato válido y CTA correctos."""
    wa = url_whatsapp(inv.whatsapp, o.texto_whatsapp.replace("(", "").replace(")", ""))
    n = 3 if formato == "tip" else 5
    preguntas = o.preguntas_chequeo[:n]
    items = "\n\n".join(f"{i}. {q.strip()}" for i, q in enumerate(preguntas, 1))
    respuesta = C.MARCA["respuesta_estudio"]
    if formato == "blog":
        cta = (
            f"{o.lectura_chequeo.strip()} Puede [contarnos su caso en la evaluación confidencial](/evaluacion) "
            f"o [escribirnos por WhatsApp]({wa}): respondemos {respuesta} y lo que cuente queda protegido por el secreto profesional."
        )
    else:
        cta = (
            f"{o.lectura_chequeo.strip()} [Contanos tu caso](/evaluacion) o [escribinos por WhatsApp]({wa}): "
            f"respondemos {respuesta} y tu consulta es confidencial."
        )
    return f"## {o.titulo_chequeo.strip()}\n\n{o.intro_chequeo.strip()}\n\n{items}\n\n{cta}"


def disenar_oferta(state: MarketingState) -> dict:
    brief, intel, inv = state["brief"], state["intel"], state["inventario"]
    hist = state.get("historial_auditorias", [])
    es_blog = brief.formato == "blog"
    previos = ""
    if hist:
        from ._comun import historial_fallos

        previos = f"\nERRORES YA SEÑALADOS POR EL AUDITOR EN INTENTOS ANTERIORES (no los repitas):\n{historial_fallos(hist)}\n"

    prompt = f"""BRIEF DEL CMO
- Formato: {brief.formato} · Área: {brief.area_slug} · Materia/categoría: {brief.materia}
- Tema: {brief.tema}
- Ángulo: {brief.angulo}
- Keyword principal: {brief.keyword_principal} · Secundarias: {', '.join(brief.keywords_secundarias)}
- Intención de búsqueda: {brief.intencion_busqueda}
- Plazo clave (solo usable si el Radar lo verificó): {brief.plazo_clave or 'no informado'}

INTELIGENCIA VERIFICADA POR EL RADAR
{resumen_intel(intel)}
{previos}
ENTREGÁ el paquete de oferta. Recordá: el bloque de chequeo tendrá {'5' if es_blog else '3'} preguntas como máximo y va en el primer tercio de la pieza. \
{'El texto lleva trato de usted.' if es_blog else 'El texto lleva voseo (tips).'} \
Cualquier plazo o consecuencia que menciones en el titular tiene que estar respaldado por un hallazgo VERIFICADO; si no, usá el gatillo de claridad o de curiosidad concreta."""
    o = get_llm().estructurado(system=SYSTEM_PROMPT, prompt=prompt, schema=_OfertaLLM, modelo=C.settings().modelo_estrategia, temperatura=0.6)

    # Control determinista de los textos que van a Google y a la tarjeta.
    if len(o.titulo_seo) > C.LIMITES["titulo_seo_max"]:
        o.titulo_seo = o.titulo_seo[: C.LIMITES["titulo_seo_max"]].rsplit(" ", 1)[0].rstrip(",;:")
    if len(o.descripcion) > C.LIMITES["descripcion_max"]:
        o.descripcion = o.descripcion[: C.LIMITES["descripcion_max"] - 1].rsplit(" ", 1)[0].rstrip(",;:") + "."
    if len(o.respuesta_directa) > C.LIMITES["respuesta_directa_max"]:
        o.respuesta_directa = o.respuesta_directa[: C.LIMITES["respuesta_directa_max"]].rsplit(" ", 1)[0].rstrip(",;:") + "."

    pack = OfferPack(
        titulo=o.titulo,
        opciones_titular=o.opciones_titular,
        titulo_seo=o.titulo_seo,
        descripcion=o.descripcion,
        copete=o.copete,
        respuesta_directa=o.respuesta_directa,
        bloque_diagnostico_md=_bloque_chequeo(o, brief.formato, inv),
        callouts_sugeridos=o.callouts_sugeridos,
        cta_final_md=o.cierre_cta,
        ecuacion_valor=o.ecuacion_valor,
        reversion_riesgo_usada=o.reversion_riesgo_usada,
        notas_eticas=o.notas_eticas,
    )
    # Autocontrol ético del propio agente: si el titular o el bloque violan patrones, se avisa en bitácora
    # (el Auditor igual los rechaza; acá se deja traza temprana).
    prom = R.detectar_promesas(" ".join([pack.titulo, pack.descripcion, pack.respuesta_directa, pack.bloque_diagnostico_md]))
    aviso = f" ⚠ {len(prom)} patrón(es) éticos dudosos: {prom[0][1]}" if prom else ""
    return {"offer": pack, "bitacora": [f"Oferta/CRO: titular «{pack.titulo}» ({len(pack.opciones_titular)} opciones evaluadas).{aviso}"]}
