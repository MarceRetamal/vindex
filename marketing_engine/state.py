"""Estado compartido que fluye entre los departamentos del motor.

El grafo de LangGraph usa `MarketingState` (TypedDict). Cada departamento
devuelve solo las claves que modifica; los modelos Pydantic de este módulo son
los contratos entre agentes: lo que un agente produce es exactamente lo que el
siguiente espera, validado.
"""

from __future__ import annotations

import operator
from typing import Annotated, Literal, Optional, TypedDict

from pydantic import BaseModel, Field

Formato = Literal["blog", "tip"]
Modo = Literal["auto", "blog", "tip"]
Severidad = Literal["bloqueante", "mayor", "menor"]
EstadoFinal = Literal["en_curso", "publicado", "dry_run_ok", "abortado"]


# --------------------------------------------------------------------------
# Inventario del repositorio
# --------------------------------------------------------------------------


class ItemContenido(BaseModel):
    tipo: Formato
    slug: str
    ruta: str  # /blog/<slug> o /tips/<slug>
    titulo: str
    descripcion: str = ""
    materia: str = ""  # materia (blog) o categoría (tip)
    fecha: str = ""
    palabras: int = 0
    nota_pilar: str = ""
    tokens: list[str] = Field(default_factory=list)  # para detectar canibalización


class AreaInfo(BaseModel):
    slug: str
    nombre: str
    materia: str
    categoria_tips: str = ""  # vacío si no existe categoría de tips para el área
    href: str
    titulo_seo: str = ""
    tags: list[str] = Field(default_factory=list)
    situaciones: list[str] = Field(default_factory=list)
    faqs: list[str] = Field(default_factory=list)
    tiene_pagina_propia: bool = True


class CoberturaArea(BaseModel):
    area: AreaInfo
    notas_blog: int = 0
    tips: int = 0
    ultima_publicacion: str = ""
    dias_sin_publicar: Optional[int] = None
    peso_conversion: int = 3
    puntaje_prioridad: float = 0.0


class Inventario(BaseModel):
    fecha: str
    site_url: str
    whatsapp: str
    areas: list[AreaInfo]
    blog: list[ItemContenido]
    tips: list[ItemContenido]
    categorias_tips: list[str]
    materias_validas: list[str]
    llms_txt_urls: list[str]
    cobertura: list[CoberturaArea]


# --------------------------------------------------------------------------
# Agente 01 · CMO
# --------------------------------------------------------------------------


class Brief(BaseModel):
    """Brief estratégico diario. Es la orden de trabajo para todo el departamento."""

    formato: Formato
    area_slug: str
    materia: str  # materia (blog) o categoría de tips
    tema: str = Field(description="Tema concreto de la pieza, con la búsqueda que hace el lector")
    angulo: str = Field(description="Ángulo diferencial frente a lo que ya existe en el sitio y en la competencia")
    keyword_principal: str
    keywords_secundarias: list[str] = Field(default_factory=list)
    intencion_busqueda: str = Field(description="Qué necesita resolver quien busca esto, y con qué urgencia")
    plazo_clave: str = Field(default="", description="Plazo o vencimiento real asociado al tema, si existe")
    nota_pilar: str = Field(default="", description="Solo tips: slug de la nota del blog que desarrolla el tema")
    enlaces_internos: list[str] = Field(default_factory=list, description="Rutas internas existentes sugeridas")
    justificacion: str
    dia_plan: int = 0
    fase: str = ""
    evitar: list[str] = Field(default_factory=list, description="Qué no repetir para no canibalizar")


# --------------------------------------------------------------------------
# Agente 02 · Radar de inteligencia
# --------------------------------------------------------------------------


class Fuente(BaseModel):
    titulo: str = ""
    uri: str = ""
    dominio: str = ""


class Hallazgo(BaseModel):
    tipo: Literal["norma", "fallo", "organismo", "otro"] = "otro"
    descripcion: str
    vigencia_o_fecha: str = ""
    fuente_dominio: str = ""
    verificado: bool = False  # True solo si el dominio coincide con una fuente realmente consultada


class IntelReport(BaseModel):
    resumen_ejecutivo: str
    normas: list[Hallazgo] = Field(default_factory=list)
    fallos: list[Hallazgo] = Field(default_factory=list)
    cambios_organismos: list[Hallazgo] = Field(default_factory=list)
    preguntas_usuarios: list[str] = Field(default_factory=list)
    brechas_competencia: list[str] = Field(default_factory=list)
    keywords_principales: list[str] = Field(default_factory=list)
    keywords_long_tail: list[str] = Field(default_factory=list)
    riesgos_desactualizacion: list[str] = Field(default_factory=list)
    fuentes: list[Fuente] = Field(default_factory=list)
    consultas_realizadas: list[str] = Field(default_factory=list)


# --------------------------------------------------------------------------
# Agente 03 · Oferta y CRO
# --------------------------------------------------------------------------


class OpcionTitular(BaseModel):
    titulo: str
    gatillo: Literal["aversion_a_la_perdida", "plazo_real", "curiosidad_concreta", "claridad_directa"]


class EcuacionValor(BaseModel):
    """Ecuación de Valor de Hormozi aplicada al lector (no a una promesa de resultado)."""

    resultado_buscado: str  # el sueño: qué quiere resolver la persona
    probabilidad_percibida: str  # cómo aumentamos su confianza sin prometer resultados (claridad, fuentes, criterios)
    demora_percibida: str  # cómo acortamos el tiempo hasta el primer paso concreto
    esfuerzo_percibido: str  # cómo reducimos el esfuerzo de dar ese primer paso


class OfferPack(BaseModel):
    titulo: str
    opciones_titular: list[OpcionTitular] = Field(default_factory=list)
    titulo_seo: str
    descripcion: str
    copete: str = ""
    respuesta_directa: str = Field(description="Respuesta de hasta 150 caracteres con la que abre la pieza")
    bloque_diagnostico_md: str = Field(description="Markdown completo del bloque 'Chequeo rápido' (## + intro + lista + CTA)")
    callouts_sugeridos: list[str] = Field(default_factory=list)
    cta_final_md: str = ""
    ecuacion_valor: EcuacionValor
    reversion_riesgo_usada: list[str] = Field(default_factory=list)
    notas_eticas: str = ""


# --------------------------------------------------------------------------
# Agentes 04 y 05 · Redactores
# --------------------------------------------------------------------------


class PreguntaFrecuente(BaseModel):
    pregunta: str
    respuesta: str


class Borrador(BaseModel):
    """Salida estructurada del redactor. Python arma el .md: el modelo nunca escribe el YAML."""

    formato: Formato
    slug: str
    titulo: str
    titulo_seo: str = ""  # solo blog
    descripcion: str
    copete: str = ""  # solo blog
    materia: str = ""  # blog: materia; tip: categoría
    resumen: list[str]
    faq: list[PreguntaFrecuente] = Field(default_factory=list)  # solo blog
    nota_pilar: str = ""  # solo tip
    cuerpo_md: str
    cambios_realizados: str = ""  # en revisiones: qué se corrigió
    fecha: str = ""
    actualizado: str = ""
    archivo_md: str = ""  # contenido completo del .md, armado por repo_tools.armar_markdown


# --------------------------------------------------------------------------
# Agente 06 · Auditor
# --------------------------------------------------------------------------


class Hallazgo_Auditoria(BaseModel):
    criterio: Literal["etica", "precision_juridica", "schema", "seo_geo", "conversion"]
    severidad: Severidad
    ubicacion: str = ""
    problema: str
    instruccion_exacta: str


class Puntajes(BaseModel):
    etica: int = 0
    precision_juridica: int = 0
    estructura: int = 0  # cumplimiento del schema de _PLANTILLA.txt
    seo_geo: int = 0
    conversion: int = 0


class AuditReport(BaseModel):
    aprobado: bool
    intento: int = 1
    puntajes: Puntajes = Field(default_factory=Puntajes)
    hallazgos: list[Hallazgo_Auditoria] = Field(default_factory=list)
    instrucciones_redactor: str = ""
    build_sandbox_ok: Optional[bool] = None
    resumen: str = ""


# --------------------------------------------------------------------------
# Agente 07 · Publicador
# --------------------------------------------------------------------------


class PublishResult(BaseModel):
    dry_run: bool
    archivos: list[str] = Field(default_factory=list)
    llms_txt_actualizado: bool = False
    build_ok: bool = False
    build_log: str = ""
    rama: str = ""
    commit_sha: str = ""
    pushed: bool = False
    notas: list[str] = Field(default_factory=list)


class DecisionEscalamiento(BaseModel):
    decision: Literal["reformular", "abortar"]
    nuevo_angulo: str = ""
    nuevo_tema: str = ""
    motivo: str


# --------------------------------------------------------------------------
# Estado del grafo
# --------------------------------------------------------------------------


class MarketingState(TypedDict, total=False):
    # Entrada (CLI)
    modo: Modo
    area_slug: str
    tema: str
    dry_run: bool
    run_id: str
    ignorar_cadencia: bool

    # Contexto
    inventario: Inventario

    # Productos de cada departamento
    brief: Brief
    intel: IntelReport
    offer: OfferPack
    borrador: Borrador
    auditoria: AuditReport

    # Control del bucle de calidad
    fallos: int  # auditorías rechazadas en la ronda actual
    escalaciones: int  # veces que el CMO tuvo que reformular
    historial_auditorias: Annotated[list[AuditReport], operator.add]
    instrucciones_pendientes: str  # feedback del auditor para el redactor

    # Resultado
    publicacion: PublishResult
    estado: EstadoFinal
    motivo_final: str
    bitacora: Annotated[list[str], operator.add]
