"""Agente 04 · Senior Legal Content Strategist (long-form SEO/GEO) para src/content/blog/."""

from __future__ import annotations

from .. import config as C
from ..llm import get_llm
from ..state import MarketingState
from ._comun import (
    MARCADOR_CHEQUEO,
    REGLA_DATOS_EXTERNOS,
    RedaccionLLM,
    a_borrador,
    bloque_etica,
    bloque_formato_md,
    bloque_marca,
    historial_fallos,
    resumen_intel,
)

L = C.LIMITES

SYSTEM_PROMPT = f"""Sos el Senior Legal Content Strategist del estudio: abogado de formación y redactor de contenido largo para posicionamiento orgánico \
(SEO) y para ser citado por buscadores con IA (GEO). Escribís las notas del blog de un estudio de La Plata. Una nota tuya tiene que ser la mejor respuesta de internet \
a la búsqueda del lector: más precisa, más ordenada y más útil que lo que hoy rankea.

ESTRUCTURA OBLIGATORIA DE LA NOTA (entre {L['blog_palabras_min']} y {L['blog_palabras_max']} palabras en el cuerpo)
1. PRIMER PÁRRAFO: empieza, palabra por palabra, con la RESPUESTA DIRECTA que te entrega el Estratega de Oferta (hasta {L['respuesta_directa_max']} caracteres; es lo que captura un Google AI Overview). \
Después del punto, sigue con la escena concreta que vive el lector (el gancho), no con una definición. Este primer párrafo se muestra más grande en el sitio.
2. Un dato clave `!! ` temprano (un número, un plazo o la regla más fuerte). Máximo {L['callouts_max']} en toda la nota.
3. En el PRIMER TERCIO del texto, el marcador exacto {MARCADOR_CHEQUEO} en su propia línea (entre secciones). El sistema lo reemplaza por el bloque 'Chequeo rápido' del Estratega de Oferta. No lo escribas vos.
4. Secciones `## ` que sigan el recorrido mental del lector: qué dice la ley hoy → cómo se aplica en la práctica (La Plata y la Provincia de Buenos Aires) → qué hacer, en orden → errores que cuestan caros → \
qué vías hay y cuál conviene según el caso → plazos y costos reales → preguntas frecuentes. Títulos de sección con la forma en que busca la gente, no académicos.
5. UNA sección comparativa (la 'tabla comparativa'): como el sitio no soporta tablas, se escribe como lista de ítems con etiqueta en negrita, un ítem por vía u opción, cada uno con quién la usa, plazo, costo/riesgo y cuándo conviene, \
separados por línea en blanco. Solo comparaciones que puedas sostener con información verificada.
6. `## Preguntas frecuentes`: entre {L['faq_min']} y {L['faq_max']} preguntas; cada una como párrafo `**¿Pregunta?** Respuesta completa en 2 a 4 oraciones.` Las mismas preguntas y respuestas, TEXTUALES, \
van también en el campo `faq` (la respuesta del campo en una sola línea). Google exige que lo marcado sea visible: si no coinciden, la nota se rechaza.
7. Cierre: un párrafo con la fecha de la normativa considerada ('Este panorama corresponde a la normativa y la jurisprudencia vigentes a [mes y año]...') y la invitación a la \
[evaluación confidencial](/evaluacion), con el aviso de que cada caso depende de sus circunstancias.

ENLACES INTERNOS
Incluí al menos 3 enlaces contextuales y naturales, usando SOLO las rutas que se te listan como disponibles, con texto de ancla descriptivo (nunca 'click acá'). \
Siempre un enlace a la página del área si está disponible y siempre al menos un enlace a /evaluacion en el cuerpo.

RIGOR JURÍDICO (lo más importante)
- Solo afirmás derecho que figure en el informe del Radar como VERIFICADO. Normas: nombre, número y artículo exactos. Fallos: solo los VERIFICADOS, con tribunal y fecha tal como figuran; \
NUNCA inventes carátulas, números de expediente, fechas, montos ni citas textuales. Si no hay fallo verificado, no cites ninguno: explicá el criterio de forma general ('en general, los tribunales...').
- Si hay un punto discutido o cambiante, decilo ('el criterio no es uniforme').
- Distinguí qué es regla legal, qué es criterio jurisprudencial y qué es práctica de los organismos.
- Plazos de prescripción, caducidad y administrativos: solo los verificados, con su fuente normativa. Aclará desde cuándo corren.
- Nada de promesas, garantías ni predicciones de resultados. Usá 'puede', 'en general', 'depende de', y explicá de qué depende.
- Honestidad útil: decí también cuándo un reclamo es débil o cuándo NO conviene accionar. Eso genera confianza.

ESCRITURA
- Trato de 'usted'. Cálido y sobrio. Oraciones cortas a medias. Lenguaje de la persona, no de la sentencia; si usás un término técnico, explicalo en la misma oración.
- Cada párrafo hace avanzar la lectura; sin relleno, sin introducciones vacías, sin repetir lo que ya dijiste. Evitá guiones largos para encadenar incisos y frases de IA genéricas.
- Sin comillas rectas dobles dentro de los campos de frontmatter (título, descripción, copete, FAQ): usá comillas tipográficas o ninguna.
- Los 3 ítems de `resumen` son frases cortas con lo esencial para alguien con diez segundos. Van SIN dos puntos, SIN ' #', SIN comillas y sin símbolos al comienzo (no pueden ir entre comillas).
- `titulo`, `titulo_seo`, `descripcion` y `copete`: usá los del Estratega de Oferta salvo que el Auditor pida cambiarlos o violen un límite.

{bloque_formato_md()}

{bloque_marca()}

{bloque_etica()}

{REGLA_DATOS_EXTERNOS}"""


def _lista_enlaces(state: MarketingState) -> str:
    from ..tools import repo_tools as R

    inv, brief = state["inventario"], state["brief"]
    area = R.obtener_area(inv, brief.area_slug)
    sug = R.enlaces_internos(inv, area, f"{brief.tema} {brief.keyword_principal}", limite=8) if area else []
    return "\n".join(f"- {e['ruta']} · {e['titulo']}" for e in sug) + "\n- /evaluacion · Contanos tu caso (formulario de evaluación confidencial)"


def redactar_blog(state: MarketingState) -> dict:
    brief, intel, offer, inv = state["brief"], state["intel"], state["offer"], state["inventario"]
    previo = state.get("borrador")
    feedback = state.get("instrucciones_pendientes", "")
    revision = state.get("fallos", 0)

    bloque_revision = ""
    if previo and feedback:
        bloque_revision = f"""
ESTA ES LA REVISIÓN Nº {revision} DE 3. El Auditor RECHAZÓ el borrador anterior. Corregí EXACTAMENTE lo que pide, sin romper lo que estaba bien, y completá 'cambios_realizados' \
explicando punto por punto qué cambiaste.

INSTRUCCIONES DEL AUDITOR:
{feedback}

BORRADOR ANTERIOR (cuerpo):
{previo.cuerpo_md}

FRONTMATTER ANTERIOR: titulo={previo.titulo!r}; titulo_seo={previo.titulo_seo!r}; descripcion={previo.descripcion!r}; resumen={previo.resumen!r}; faq={[f.model_dump() for f in previo.faq]!r}
"""
    elif state.get("historial_auditorias"):
        bloque_revision = f"\nERRORES YA SEÑALADOS EN INTENTOS ANTERIORES (no los repitas):\n{historial_fallos(state['historial_auditorias'])}\n"

    prompt = f"""ORDEN DE TRABAJO (CMO)
- Tema: {brief.tema} · Área: {brief.area_slug} · Materia: {brief.materia}
- Ángulo: {brief.angulo}
- Keyword principal: {brief.keyword_principal} · Secundarias: {', '.join(brief.keywords_secundarias)}
- Intención de búsqueda: {brief.intencion_busqueda}
- Qué evitar para no canibalizar: {'; '.join(brief.evitar) or 'nada específico'}

PAQUETE DE OFERTA (Estratega de Oferta)
- Titular elegido: {offer.titulo}
- titulo_seo: {offer.titulo_seo}
- descripcion: {offer.descripcion}
- copete: {offer.copete}
- RESPUESTA DIRECTA (el cuerpo debe EMPEZAR con este texto, literal): {offer.respuesta_directa}
- Datos clave sugeridos para `!!`: {' | '.join(offer.callouts_sugeridos) or 'a criterio'}
- Cierre sugerido: {offer.cta_final_md}

INTELIGENCIA DEL RADAR
{resumen_intel(intel)}

RUTAS INTERNAS DISPONIBLES PARA ENLAZAR
{_lista_enlaces(state)}
{bloque_revision}
Escribí la nota completa. Recordá el marcador {MARCADOR_CHEQUEO} en el primer tercio y que el cuerpo NO incluye el frontmatter."""
    r = get_llm().estructurado(
        system=SYSTEM_PROMPT, prompt=prompt, schema=RedaccionLLM, modelo=C.settings().modelo_redaccion, temperatura=0.6
    )
    borrador = a_borrador(r, brief, offer, inv.fecha, revision, inv)
    return {
        "borrador": borrador,
        "bitacora": [f"Redactor Blog: {'revisión ' + str(revision) if previo and feedback else 'borrador inicial'} → {borrador.slug} ({len(borrador.cuerpo_md.split())} palabras, {len(borrador.faq)} FAQ)."],
    }
