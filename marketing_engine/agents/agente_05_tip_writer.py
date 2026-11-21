"""Agente 05 · Especialista en Retención y Acción Rápida: tips para src/content/tips/."""

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

SYSTEM_PROMPT = f"""Sos el Especialista en Retención y Acción Rápida del estudio. Escribís los 'tips': guías cortas para la persona que acaba de vivir una emergencia procesal \
(le llegó una cédula, la despidieron, chocó, la obra social le negó un tratamiento, no le cumplen una sentencia) y necesita saber qué hacer en las PRIMERAS 48 HORAS. \
Se leen en un minuto y empujan a la acción correcta.

ESTRUCTURA OBLIGATORIA ({L['tip_palabras_min']} a {L['tip_palabras_max']} palabras en total, contando el bloque de chequeo que se inserta, de unas 90 palabras; tu texto propio ronda las 150 a 280; mirá los tips existentes: son ágiles y concretos)
1. Dos o tres oraciones iniciales con la escena que vive la persona y por qué lo que haga en las próximas horas pesa. Sin definiciones.
2. `## Qué hacer primero`: lista numerada de 4 a 6 pasos, en orden de urgencia, cada uno una acción concreta y verificable (guardar, pedir por escrito, no firmar, fotografiar, ir a tal lugar). \
CADA ÍTEM SEPARADO POR UNA LÍNEA EN BLANCO.
3. En el PRIMER TERCIO, en su propia línea entre secciones, el marcador exacto {MARCADOR_CHEQUEO}: el sistema lo reemplaza por el bloque 'Chequeo rápido' (3 preguntas) del Estratega de Oferta.
4. Un dato clave `!! ` con el error más caro o el plazo que más importa (máximo 2 en el tip).
5. `## Cuánto tiempo tenés` (o título equivalente): el plazo REAL y verificado, desde cuándo corre y qué se pierde si pasa. Si el Radar no verificó un plazo, no inventes uno: decí que los plazos son cortos y que conviene consultar cuanto antes.
6. Cierre con enlace a [contanos tu caso](/evaluacion) y, si existe nota pilar, un enlace a esa nota con texto descriptivo.

REGLAS DEL TIP
- Voseo rioplatense directo ('guardá', 'no firmes', 'pedí', 'contanos'). Verbos de acción al principio de cada paso.
- Cero teoría que no cambie lo que la persona hace hoy. Una norma se cita solo si se necesita para actuar y está VERIFICADA por el Radar.
- Prohibido prometer resultados, garantizar nada o minimizar el riesgo. Honestidad: si algo no se puede revertir, decilo.
- Los tips NO llevan FAQ ni titulo_seo ni copete: dejalos vacíos. Los 3 ítems de `resumen` son órdenes cortas y claras, SIN dos puntos, SIN ' #', SIN comillas y sin símbolos al comienzo.
- Enlazá solo a rutas de la lista disponible. Siempre un enlace a /evaluacion.
- Sin comillas rectas dobles dentro del título ni la descripción.

{bloque_formato_md()}

{bloque_marca()}

{bloque_etica()}

{REGLA_DATOS_EXTERNOS}"""


def redactar_tip(state: MarketingState) -> dict:
    from ..tools import repo_tools as R

    brief, intel, offer, inv = state["brief"], state["intel"], state["offer"], state["inventario"]
    previo = state.get("borrador")
    feedback = state.get("instrucciones_pendientes", "")
    revision = state.get("fallos", 0)
    area = R.obtener_area(inv, brief.area_slug)
    sug = R.enlaces_internos(inv, area, f"{brief.tema} {brief.keyword_principal}", limite=6) if area else []
    enlaces = "\n".join(f"- {e['ruta']} · {e['titulo']}" for e in sug) + "\n- /evaluacion · Contanos tu caso"
    pilar = next((i for i in inv.blog if i.slug == brief.nota_pilar), None)

    bloque_revision = ""
    if previo and feedback:
        bloque_revision = f"""
REVISIÓN Nº {revision} DE 3. El Auditor RECHAZÓ el borrador anterior. Corregí exactamente lo que pide y completá 'cambios_realizados'.

INSTRUCCIONES DEL AUDITOR:
{feedback}

BORRADOR ANTERIOR (cuerpo):
{previo.cuerpo_md}
"""
    elif state.get("historial_auditorias"):
        bloque_revision = f"\nERRORES YA SEÑALADOS (no los repitas):\n{historial_fallos(state['historial_auditorias'])}\n"

    prompt = f"""ORDEN DE TRABAJO (CMO)
- Tema: {brief.tema} · Área: {brief.area_slug} · Categoría: {brief.materia}
- Ángulo: {brief.angulo}
- Situación de emergencia: {brief.intencion_busqueda}
- Plazo clave (solo si el Radar lo verificó): {brief.plazo_clave or 'no informado'}

PAQUETE DE OFERTA
- Titular: {offer.titulo}
- descripcion: {offer.descripcion}
- Respuesta directa (usala como primera oración, adaptada a voseo si hace falta): {offer.respuesta_directa}
- Cierre sugerido: {offer.cta_final_md}

NOTA PILAR (para el enlace de cierre): {pilar.ruta + ' · ' + pilar.titulo if pilar else 'no hay'}

INTELIGENCIA DEL RADAR
{resumen_intel(intel)}

RUTAS INTERNAS DISPONIBLES
{enlaces}
{bloque_revision}
Escribí el tip completo. Dejá titulo_seo, copete y faq vacíos. Incluí el marcador {MARCADOR_CHEQUEO} en el primer tercio."""
    r = get_llm().estructurado(
        system=SYSTEM_PROMPT, prompt=prompt, schema=RedaccionLLM, modelo=C.settings().modelo_redaccion, temperatura=0.6
    )
    borrador = a_borrador(r, brief, offer, inv.fecha, revision, inv)
    return {
        "borrador": borrador,
        "bitacora": [f"Redactor Tip: {'revisión ' + str(revision) if previo and feedback else 'borrador inicial'} → {borrador.slug} ({len(borrador.cuerpo_md.split())} palabras)."],
    }
