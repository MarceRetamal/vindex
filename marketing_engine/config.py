"""Configuración centralizada del motor de marketing de Vindex Legal.

Todo lo que cambia según el entorno (claves, modelos, git) sale de variables de
entorno. Todo lo que es decisión de marca o de estrategia vive acá, en un solo
lugar, para que los agentes, el auditor y el publicador usen las mismas reglas.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

from dotenv import load_dotenv

# --------------------------------------------------------------------------
# Rutas del repositorio (nada se escribe fuera de estas carpetas)
# --------------------------------------------------------------------------

ENGINE_DIR = Path(__file__).resolve().parent
REPO_ROOT = ENGINE_DIR.parent

load_dotenv(ENGINE_DIR / ".env")

BLOG_DIR = REPO_ROOT / "src" / "content" / "blog"
TIPS_DIR = REPO_ROOT / "src" / "content" / "tips"
COVERS_DIR = REPO_ROOT / "public" / "covers"
LLMS_TXT = REPO_ROOT / "public" / "llms.txt"
AREAS_TS = REPO_ROOT / "src" / "data" / "areas.ts"
SITE_TS = REPO_ROOT / "src" / "data" / "site.ts"
TIPS_TS = REPO_ROOT / "src" / "lib" / "tips.ts"
BUILD_SCRIPT = REPO_ROOT / "scripts" / "build-content.mjs"
MARKDOWN_SCRIPT = REPO_ROOT / "scripts" / "markdown.mjs"
TEMPLATE_BLOG = BLOG_DIR / "_PLANTILLA.txt"
RUNS_DIR = ENGINE_DIR / ".runs"  # ignorado por git; único lugar donde escribe --dry-run

TZ = ZoneInfo("America/Argentina/Buenos_Aires")


def hoy() -> date:
    """Fecha de hoy en Argentina. `MARKETING_TODAY=YYYY-MM-DD` la fuerza (tests)."""
    forzada = os.environ.get("MARKETING_TODAY", "").strip()
    if forzada:
        return date.fromisoformat(forzada)
    return datetime.now(TZ).date()


# --------------------------------------------------------------------------
# Ajustes de entorno
# --------------------------------------------------------------------------


def _bool(nombre: str, defecto: bool = False) -> bool:
    return os.environ.get(nombre, str(defecto)).strip().lower() in {"1", "true", "si", "sí", "yes"}


@dataclass(frozen=True)
class Settings:
    gemini_api_key: str = field(default_factory=lambda: os.environ.get("GEMINI_API_KEY", "").strip())
    # Modelos: se pueden cambiar por variable de entorno sin tocar código.
    modelo_estrategia: str = field(default_factory=lambda: os.environ.get("MODEL_STRATEGY", "gemini-2.5-pro"))
    modelo_redaccion: str = field(default_factory=lambda: os.environ.get("MODEL_WRITER", "gemini-2.5-pro"))
    modelo_auditoria: str = field(default_factory=lambda: os.environ.get("MODEL_AUDITOR", "gemini-2.5-pro"))
    modelo_rapido: str = field(default_factory=lambda: os.environ.get("MODEL_FAST", "gemini-2.5-flash"))
    # LLM simulado, sin red ni clave. Sirve para probar el grafo completo.
    mock: bool = field(default_factory=lambda: _bool("MARKETING_ENGINE_MOCK"))
    max_revisiones: int = field(default_factory=lambda: int(os.environ.get("MAX_REVISIONES", "3")))
    max_escalaciones: int = field(default_factory=lambda: int(os.environ.get("MAX_ESCALACIONES", "1")))
    # Git: si GIT_BRANCH está definido, el publicador commitea en esa rama (la crea si falta).
    git_branch: str = field(default_factory=lambda: os.environ.get("GIT_BRANCH", "").strip())
    git_push: bool = field(default_factory=lambda: _bool("GIT_PUSH"))
    git_remote: str = field(default_factory=lambda: os.environ.get("GIT_REMOTE", "origin"))
    # Corre `npm run build` completo (lento, requiere node_modules) además de build-content.
    full_build: bool = field(default_factory=lambda: _bool("FULL_BUILD"))
    reintentos_llm: int = field(default_factory=lambda: int(os.environ.get("LLM_RETRIES", "4")))


def settings() -> Settings:
    return Settings()


# --------------------------------------------------------------------------
# Marca Vindex y jurisdicción
# --------------------------------------------------------------------------

SITE_URL_FALLBACK = "https://vindexlegal.com.ar"
WHATSAPP_FALLBACK = "5491141743745"

MARCA = {
    "nombre": "VINDEX LEGAL",
    "abogado": "Dr. Marcelo F. Retamal",
    "jurisdiccion": "La Plata y Provincia de Buenos Aires, Argentina",
    "fueros": "Familia, Civil y Comercial, Laboral, Penal, Contencioso Administrativo, Paz Letrada",
    "publico": "personas y familias que atraviesan un problema legal concreto y urgente",
    "cta_principal": "/evaluacion",
    "cta_texto": "Contanos tu caso",
    "respuesta_estudio": "en un plazo máximo de 24 horas hábiles",
}

# Voz según el formato. Surge de la auditoría de src/content: el blog trata de
# "usted"; los tips usan voseo rioplatense (guardá, contanos, tenés).
VOZ = {
    "blog": "Trato de 'usted' (formal y cercano). Ejemplos del repo: 'Si fue víctima de...', 'No firme nada que no entienda'. No usar voseo en el blog.",
    "tip": "Voseo rioplatense directo. Ejemplos del repo: 'Guardá los recibos', 'No firmes renuncias', 'Contanos qué pasó'.",
}

# Materias aceptadas en `materia:` del blog. Salen de areas.ts + las que el blog ya usa.
MATERIAS_EXTRA_VALIDAS = ["Penal", "Sucesiones", "Consumidor", "Responsabilidad del Estado"]

# Áreas que no tienen página propia en areas.ts pero sí contenido en el blog.
AREAS_EXTRA = [
    {
        "slug": "consumidor-estafas-bancarias",
        "nombre": "Consumidor: estafas virtuales y bancos",
        "materia": "Consumidor",
        "categoria_tips": "",  # no existe en CATEGORIAS_TIPS: solo blog
        "href": "/evaluacion",
    },
]

# --------------------------------------------------------------------------
# Límites de formato (surgen de _PLANTILLA.txt y de los artículos existentes)
# --------------------------------------------------------------------------

LIMITES = {
    "titulo_seo_max": 47,
    "descripcion_max": 155,
    "titulo_max": 125,
    "respuesta_directa_max": 150,
    "resumen_items": 3,
    "blog_palabras_min": 1000,
    "blog_palabras_max": 1900,
    "tip_palabras_min": 220,
    "tip_palabras_max": 420,
    "callouts_max": 3,
    "faq_min": 3,
    "faq_max": 6,
    "checklist_posicion_max": 0.36,  # blog: el bloque de diagnóstico empieza en el primer tercio
    "checklist_posicion_max_tip": 0.5,  # tips: textos muy cortos, el bloque pesa más del tercio
    "guiones_largos_max": 2,
}

# --------------------------------------------------------------------------
# Ética profesional: Ley 5177 (PBA) y normas del Colegio de Abogados.
# Se codifican como PRINCIPIOS y patrones. No se citan números de artículo:
# [CITA A VERIFICAR: art. de la Ley 5177 y del Código de Ética del CALP sobre
# publicidad, captación de clientela y promesa de resultados]. Marcelo debe
# contrastar esta lista con el texto vigente.
# --------------------------------------------------------------------------

PRINCIPIOS_ETICOS = [
    "Ninguna promesa ni garantía de resultado judicial, ni explícita ni implícita.",
    "Ninguna cifra de éxito, tasa de casos ganados ni 'casos de éxito'.",
    "Sin testimonios de clientes ni casos reales identificables (secreto profesional).",
    "Sin captación indebida: nada de ofrecer gratuidad, descuentos, promociones ni escasez artificial.",
    "Sin publicidad de honorarios ni de pactos de cuota litis como gancho.",
    "Sin denigrar a colegas, a la magistratura ni a empresas u organismos con hechos no probados.",
    "Sin comparaciones laudatorias ('el mejor estudio', 'líderes', 'número uno').",
    "Los plazos y las normas se informan con exactitud; el miedo no puede sustituir a la información.",
    "Se aclara que el contenido es informativo y que cada caso depende de sus circunstancias.",
    "Los fallos solo se citan si fueron verificados en fuente oficial; jamás se inventan carátulas ni fechas.",
]

# (patrón, explicación). Búsqueda case-insensitive sobre el cuerpo y el frontmatter.
PATRONES_PROHIBIDOS: list[tuple[str, str]] = [
    (r"\bgarantiz\w*", "promesa o garantía de resultado"),
    (r"\bgarant[ií]a de (éxito|resultado|cobro|victoria)", "promesa o garantía de resultado"),
    (r"\bresultado (asegurado|garantizado)\b", "promesa de resultado"),
    (r"\béxito (asegurado|garantizado|seguro)\b", "promesa de resultado"),
    (r"\b100 ?% (seguro|efectiv\w+|de éxito|garantizado)", "promesa de resultado"),
    (r"\b(vamos a|va a|vas a|van a|iremos a)\s+(ganar|ganarlo|ganarle)\b", "promesa de ganar el caso"),
    (r"\bgan(amos|aremos) (el|su|tu|tus|los|todos)\b", "promesa o jactancia de resultado"),
    (r"\bhemos ganado\b|\bcasos? de [ée]xito\b|\bcasos? ganados?\b", "jactancia de resultados anteriores"),
    (r"\b\d{2,3} ?% de (éxito|casos ganados|efectividad)", "cifra de éxito"),
    (r"\bno (pag[aá]s|paga|pagás|pagues) si no gan", "publicidad de cuota litis / riesgo trasladado"),
    (r"\b(cobramos|cobra|cobrás) (solo|solamente|únicamente) si (gan|cobr)", "publicidad de cuota litis"),
    (r"\bconsulta (gratis|gratuita|sin (cargo|costo))\b", "ofrecimiento de gratuidad como captación"),
    (r"\b(asesoramiento|primera consulta|evaluaci[oó]n) (gratis|gratuit\w+|sin (cargo|costo))\b", "ofrecimiento de gratuidad como captación"),
    (r"\b(descuento|promoci[oó]n|oferta limitada|[úu]ltimos (lugares|cupos)|cupos? limitados?|por tiempo limitado)\b", "escasez o promoción artificial"),
    (r"\bhonorarios (bajos|reducidos|accesibles|económicos|módicos)\b", "publicidad de honorarios"),
    (r"\b(el|la) mejor (estudio|abogado|abogada)\b|\blos mejores abogados\b|\bl[ií]deres? en\b|\bn[úu]mero (uno|1)\b", "comparación laudatoria"),
    (r"\botros abogados (te|le|les) (mienten|enga[ñn]an|estafan)", "denigración de colegas"),
    (r"\bnuestros clientes (dicen|opinan|cuentan|recomiendan)", "testimonios de clientes"),
    (r"\bsin ning[úu]n riesgo\b|\bsin riesgos?\b", "promesa de ausencia de riesgo"),
]

# Reversión de riesgo permitida: solo lo que el sitio ya afirma o lo que es
# verdadero por naturaleza (secreto profesional, honestidad del análisis).
REVERSION_RIESGO_PERMITIDA = [
    "Tu consulta es confidencial y está protegida por el secreto profesional (dato del sitio, /evaluacion).",
    "Respondemos en un plazo máximo de 24 horas hábiles (dato del sitio, /evaluacion).",
    "Te decimos con franqueza si tu caso tiene viabilidad, y también si no la tiene.",
    "Nada de lo que leés acá reemplaza una consulta: cada caso depende de sus circunstancias.",
    "Contar tu caso no te obliga a nada: la decisión de iniciar un reclamo es siempre tuya.",
]

AVISO_INFORMATIVO = (
    "Este contenido es informativo y no constituye asesoramiento jurídico ni genera relación profesional. "
    "Cada caso depende de sus circunstancias."
)

# --------------------------------------------------------------------------
# Plan de escalamiento orgánico de 90 días (sin presupuesto publicitario)
# --------------------------------------------------------------------------

PLAN_90_DIAS = {
    "inicio": os.environ.get("PLAN_START_DATE", "2026-11-23"),
    "duracion_dias": 90,
    # Cadencia semanal (0 = lunes). Se ajusta con PLAN_CADENCE="blog,tip,tip,blog,tip,,".
    "cadencia_semanal": (os.environ.get("PLAN_CADENCE", "blog,tip,tip,blog,tip,,").split(",")),
    "fases": [
        {
            "nombre": "Fase 1 · Fundación e indexación",
            "dias": (1, 30),
            "objetivo": "Cubrir la intención de búsqueda de mayor urgencia y conversión en cada área con notas pilares, "
            "y sembrar tips de acción en las primeras 48 horas que enlacen a esas notas.",
            "foco": "Una nota pilar por área con menos cobertura; tips de emergencia procesal enlazados a su pilar.",
        },
        {
            "nombre": "Fase 2 · Cobertura de long-tail y clusters",
            "dias": (31, 60),
            "objetivo": "Ampliar cada área con consultas específicas (long-tail, 'qué hago si...', 'cuánto tarda', 'cuánto cuesta') "
            "y capturar respuestas de buscadores con IA con respuesta directa y FAQ.",
            "foco": "Preguntas reales de usuarios y brechas de la competencia detectadas por el Radar; enlazado interno denso.",
        },
        {
            "nombre": "Fase 3 · Autoridad y conversión",
            "dias": (61, 90),
            "objetivo": "Consolidar autoridad temática en las áreas con más tracción, cubrir novedades normativas y fallos recientes "
            "de La Plata/PBA y reforzar los puntos de conversión hacia /evaluacion y WhatsApp.",
            "foco": "Novedades normativas 2026-2027, fallos locales verificados, notas comparativas y de decisión.",
        },
    ],
    # Potencial de conversión inmediata (1-5): urgencia del plazo + valor del caso + intención de contratar.
    # Es juicio profesional de estrategia, no un dato medido. Ajustar con Search Console.
    "peso_conversion": {
        "amparos-salud-discapacidad": 5,
        "penal-urgente": 5,
        "accidentes-laborales-art": 5,
        "derecho-laboral": 5,
        "sucesiones": 4,
        "derecho-de-familia": 4,
        "accidentes-de-transito": 4,
        "consumidor-estafas-bancarias": 4,
    },
    "kpis": [
        "Páginas indexadas y consultas en Search Console",
        "Clics y posiciones medias por área",
        "Envíos del formulario /evaluacion y clics a WhatsApp (GA4)",
        "Citaciones en respuestas de buscadores con IA",
    ],
}

# Puntajes mínimos (0-10) que el Auditor exige para aprobar cada criterio.
UMBRALES_AUDITORIA = {"etica": 9, "precision_juridica": 8, "estructura": 9, "seo_geo": 7, "conversion": 7}

# Umbral de solapamiento de tokens para considerar canibalización.
UMBRAL_CANIBALIZACION = 0.6
