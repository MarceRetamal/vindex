"""LLM simulado para probar el grafo completo sin red ni API key.

`MARKETING_ENGINE_MOCK=1` (o `--mock`). Genera contenido de prueba que cumple el
schema y el conversor del sitio, pero NO es contenido jurídico real: por eso el
modo simulado solo corre con --dry-run (main.py lo exige).

`MOCK_FORCE_REJECTIONS=N` hace que el Auditor rechace las primeras N auditorías,
para probar el bucle de revisión (N=1..3) y el escalamiento al CMO (N=4 o más).
"""

from __future__ import annotations

import os
import re

from .llm import TextoGrounded
from .state import Fuente

_BANCO = [
    "Esta oración pertenece al contenido simulado y existe solo para comprobar el formato, el enlazado interno y la compilación del sitio.",
    "El motor valida la estructura del archivo antes de publicar y rechaza cualquier pieza que no compile con el conversor de markdown del repositorio.",
    "Ningún dato de este texto es jurídico ni verificado, de modo que no debe publicarse bajo ninguna circunstancia fuera de una prueba.",
    "La auditoría revisa que el texto no prometa resultados, que respete las normas de ética profesional y que los enlaces apunten a páginas existentes.",
    "Cada sección se escribe para que el lector avance hacia el siguiente paso concreto sin perder tiempo en definiciones innecesarias.",
    "Los plazos, las normas y los fallos reales los aporta el Radar con fuentes verificadas, y el redactor solo puede usar lo que figura como verificado.",
    "El primer tercio del texto incluye un chequeo rápido que ordena la situación de la persona y la invita a contar su caso de forma confidencial.",
    "Si la auditoría rechaza una pieza, el redactor recibe instrucciones exactas y corrige solo lo señalado antes de volver a presentarla.",
]


def _parrafos(n_parrafos: int, offset: int = 0) -> str:
    out = []
    for i in range(n_parrafos):
        out.append(" ".join(_BANCO[(offset + i + k) % len(_BANCO)] for k in range(4)))
    return "\n\n".join(out)


def _tomar(patron: str, texto: str, defecto: str = "") -> str:
    m = re.search(patron, texto)
    return m.group(1).strip() if m else defecto


class MockLLM:
    def __init__(self) -> None:
        self._auditorias = 0
        self._forzados = int(os.environ.get("MOCK_FORCE_REJECTIONS", "0") or 0)

    # -- generación libre ----------------------------------------------------
    def texto(self, *, system, prompt, grounded=False, modelo=None, temperatura=0.7) -> TextoGrounded:
        fuentes = [Fuente(titulo="infoleg.gob.ar", uri="https://mock.local/infoleg", dominio="infoleg.gob.ar")] if grounded else []
        return TextoGrounded(texto="[MOCK] Informe simulado de investigación.", fuentes=fuentes, consultas=["consulta simulada"] if grounded else [])

    # -- estructurada -----------------------------------------------------------
    def estructurado(self, *, system, prompt, schema, modelo=None, temperatura=0.4):
        nombre = schema.__name__
        datos = getattr(self, f"_{nombre.lstrip(chr(95))}")(prompt)
        return schema.model_validate(datos)

    def _Brief(self, prompt: str) -> dict:
        formato = _tomar(r"FORMATO QUE TOCA HOY:\s*(\w+)", prompt, "blog")
        slug = _tomar(r"## ([a-z0-9-]+) \(", prompt, "derecho-laboral")
        fila = re.search(rf"^{re.escape(slug)} \| ([^|]+) \|", prompt, re.M)
        materia = fila.group(1).strip() if fila else "Laboral"
        tema = _tomar(r"TEMA PEDIDO POR EL SOCIO[^:]*:\s*(.+)", prompt) or f"qué hacer ante una situación típica de {materia}"
        pilar = _tomar(r"/blog/([a-z0-9-]+) \(", prompt, "")
        if formato == "tip":
            cat = re.search(r"CATEGORÍAS DE TIPS VÁLIDAS: (.+)", prompt)
            materia = materia if (cat and materia in cat.group(1)) else (cat.group(1).split(",")[0].strip() if cat else materia)
        return {
            "formato": formato, "area_slug": slug, "materia": materia, "tema": tema,
            "angulo": "Guía práctica y ordenada, centrada en el primer paso concreto",
            "keyword_principal": tema.lower(), "keywords_secundarias": ["prueba simulada"],
            "intencion_busqueda": "Resolver una situación urgente y concreta", "plazo_clave": "",
            "nota_pilar": pilar, "enlaces_internos": [], "justificacion": "Brief simulado.", "evitar": [],
        }

    def _DecisionEscalamiento(self, prompt: str) -> dict:
        return {"decision": "reformular", "nuevo_angulo": "Enfoque más prudente, sin promesas", "nuevo_tema": "", "motivo": "Simulado."}

    def _IntelReport(self, prompt: str) -> dict:
        return {
            "resumen_ejecutivo": "Informe simulado.",
            "normas": [{"tipo": "norma", "descripcion": "Norma simulada de prueba", "vigencia_o_fecha": "vigente", "fuente_dominio": "infoleg.gob.ar", "verificado": False}],
            "fallos": [], "cambios_organismos": [],
            "preguntas_usuarios": ["¿Pregunta simulada 1?", "¿Pregunta simulada 2?"],
            "brechas_competencia": ["Falta explicar los pasos en orden"],
            "keywords_principales": ["prueba simulada"], "keywords_long_tail": ["qué hacer en prueba simulada"],
            "riesgos_desactualizacion": ["Todo el contenido es simulado."],
        }

    def _OfertaLLM(self, prompt: str) -> dict:
        formato = _tomar(r"Formato:\s*(\w+)", prompt, "blog")
        tema = _tomar(r"- Tema:\s*(.+)", prompt, "tema de prueba")
        tema = tema.split("\n")[0].strip()
        voz = "su" if formato == "blog" else "tu"
        titulo = f"Simulado: {tema}"[:110]
        return {
            "opciones_titular": [
                {"titulo": f"Opción A: {tema}", "gatillo": "claridad_directa"},
                {"titulo": f"Opción B: {tema}", "gatillo": "curiosidad_concreta"},
                {"titulo": f"Opción C: {tema}", "gatillo": "plazo_real"},
            ],
            "titulo": titulo, "por_que_este_titulo": "Simulado.",
            "titulo_seo": f"Simulado: {tema}"[:46], "descripcion": f"Contenido simulado de prueba sobre {tema}."[:150],
            "copete": "Contenido simulado de prueba para validar el motor.",
            "respuesta_directa": f"Texto simulado de prueba sobre {tema}: no es contenido jurídico real."[:148],
            "titulo_chequeo": "Chequeo rápido: ¿conviene que revisemos el caso?",
            "intro_chequeo": "Respondé sí o no, en un minuto, con lo que ya tenés a mano." if formato == "tip" else "Responda sí o no, en un minuto, con lo que ya tiene a mano.",
            "preguntas_chequeo": [
                f"¿Recibió o recibiste alguna notificación o intimación por escrito sobre {tema}?",
                "¿Tenés la documentación básica a mano?" if formato == "tip" else "¿Tiene la documentación básica a mano?",
                "¿Hay una fecha límite que ya esté corriendo?",
                "¿Intervino algún organismo o empresa?", "¿Firmó algo sin leerlo con calma?",
            ],
            "lectura_chequeo": f"Si respondió que sí a más de una, conviene que un abogado revise {voz} situación cuanto antes." if formato == "blog" else "Si respondiste que sí a más de una, conviene que un abogado revise tu situación cuanto antes.",
            "texto_whatsapp": "Hola, leí una nota de vindexlegal.com.ar y quiero consultar mi caso.",
            "callouts_sugeridos": ["Dato de prueba."], "cierre_cta": "Cierre simulado.",
            "ecuacion_valor": {"resultado_buscado": "r", "probabilidad_percibida": "p", "demora_percibida": "d", "esfuerzo_percibido": "e"},
            "reversion_riesgo_usada": [C_REV], "notas_eticas": "Simulado.",
        }

    def _RedaccionLLM(self, prompt: str) -> dict:
        es_tip = "Escribí el tip completo" in prompt
        tema = _tomar(r"- Tema:\s*(.+?) ·", prompt, "tema de prueba")
        titular = _tomar(r"- Titular(?: elegido)?:\s*(.+)", prompt, f"Simulado: {tema}")
        rd = _tomar(r"RESPUESTA DIRECTA[^:]*:\s*(.+)", prompt) or _tomar(r"Respuesta directa[^:]*:\s*(.+)", prompt, "Texto simulado.")
        rutas = re.findall(r"^- (/(?:blog|tips)/[a-z0-9-]+) ·", prompt, re.M)
        area = re.findall(r"^- (/(?!blog|tips|evaluacion)[a-z0-9-]+) ·", prompt, re.M)
        enl = [f"[contenido relacionado {i}]({r})" for i, r in enumerate(rutas[:3], 1)]
        area_l = f"[la página del área]({area[0]})" if area else "[nuestras áreas](/areas)"
        base = {"slug": "simulado-" + re.sub(r"[^a-z0-9]+", "-", tema.lower()).strip("-")[:50],
                "titulo": titular, "descripcion": f"Contenido simulado de prueba sobre {tema}."[:150],
                "resumen": ["Contenido simulado para probar el motor", "Cumple el formato del sitio", "No es contenido jurídico real"],
                "cambios_realizados": "Simulado."}
        if es_tip:
            cuerpo = (
                f"{rd} Lo que hagas en las primeras horas pesa, y este texto simulado solo sirve para probar el motor.\n\n"
                "## Qué hacer primero\n\n[[CHEQUEO_RAPIDO]]\n\n"
                "1. Guardá toda la documentación que tengas a mano y ordenala por fecha.\n\n"
                "2. Pedí por escrito cualquier respuesta que te hayan dado de manera verbal.\n\n"
                "3. No firmes nada sin leerlo con calma ni sin consultar.\n\n"
                "4. Anotá fechas, nombres y lugares mientras todavía los recordás bien.\n\n"
                "5. Sacá fotos de todo lo que pueda servir como prueba más adelante.\n\n"
                "!! Dato de prueba: este texto es simulado y no contiene información jurídica real.\n\n"
                "## Cuánto tiempo tenés\n\n"
                "Los plazos suelen ser cortos y dependen de cada caso, por eso conviene consultar cuanto antes. Cada caso depende de sus circunstancias.\n\n"
                f"Si estás en esta situación, [contanos tu caso](/evaluacion). Podés ver también {enl[0] if enl else '[más contenido](/tips)'}. {area_l[0].upper() + area_l[1:]} reúne más información.\n"
            )
            return {**base, "cuerpo_md": cuerpo}
        faq = [{"pregunta": f"¿Pregunta simulada {i} sobre {tema}?", "respuesta": f"Respuesta simulada {i}: este texto sirve solo para probar el formato del sitio y la auditoría."} for i in range(1, 4)]
        secciones = ["Qué dice la regla hoy", "Cómo se aplica en la práctica", "Qué hacer, en orden", "Errores que cuestan caros", "Qué vías hay y cuál conviene", "Plazos y costos reales"]
        partes = [f"{rd} {_BANCO[0]}\n\n!! Dato clave de prueba: este texto es simulado.", f"## {secciones[0]}\n\n{_parrafos(2, 0)} Para ampliar, vea {enl[0] if enl else '[más contenido](/blog)'}.", MARCADOR]
        for i, s in enumerate(secciones[1:], 1):
            extra = f" Más en {enl[i % len(enl)]}." if enl and i == 2 else ""
            if s.startswith("Qué vías"):
                partes.append(f"## {s}\n\n**Vía uno:** pensada para casos simples; plazo corto; menor riesgo.\n\n**Vía dos:** pensada para casos con conflicto; plazo mayor; requiere más prueba.\n\n{_parrafos(2, i)}")
            else:
                partes.append(f"## {s}\n\n{_parrafos(2, i)}{extra} Consulte {area_l} para ver el panorama general.")
        faq_md = "\n\n".join(f"**{f['pregunta']}** {f['respuesta']}" for f in faq)
        partes.append(f"## Preguntas frecuentes\n\n{faq_md}")
        partes.append("## Cierre\n\nEste panorama simulado corresponde a una prueba del motor. Cada caso depende de sus circunstancias. Si desea consultar, puede usar la [evaluación confidencial](/evaluacion).")
        return {**base, "titulo_seo": f"Simulado: {tema}"[:46], "copete": "Contenido simulado de prueba para validar el motor.", "faq": faq, "cuerpo_md": "\n\n".join(partes) + "\n"}

    def _AuditoriaLLM(self, prompt: str) -> dict:
        self._auditorias += 1
        if self._auditorias <= self._forzados:
            return {
                "etica": 9, "precision_juridica": 9, "seo_geo": 8, "conversion": 8, "resumen": "Rechazo forzado por MOCK_FORCE_REJECTIONS.",
                "hallazgos": [{"criterio": "seo_geo", "severidad": "mayor", "ubicacion": "general", "problema": f"Rechazo simulado nº {self._auditorias}.", "instruccion_exacta": "Reescribí el primer párrafo."}],
            }
        return {"etica": 10, "precision_juridica": 9, "seo_geo": 9, "conversion": 9, "hallazgos": [], "resumen": "Aprobado (simulado)."}


MARCADOR = "[[CHEQUEO_RAPIDO]]"
C_REV = "Tu consulta es confidencial y está protegida por el secreto profesional (dato del sitio, /evaluacion)."
