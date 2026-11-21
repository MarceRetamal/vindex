"""Grafo de LangGraph: la cadena de mando del departamento.

    CMO ─► Radar ─► Oferta/CRO ─┬─► Redactor Blog ─┐
              ▲                  └─► Redactor Tip ──┤
              │                                     ▼
              │                                 AUDITOR ──► aprobado ──► Publicador ─► FIN
              │                                     │
              │                       rechazado y fallos ≤ 3 ──► vuelve al redactor
              │                                     │
              │                       fallos > 3 ──► CMO (escalamiento)
              └───────── reformular ◄───────────────┘            └─► abortar ─► FIN
"""

from __future__ import annotations

from langgraph.graph import END, START, StateGraph

from . import config as C
from .agents import agente_01_cmo as cmo
from .agents import agente_02_intel_radar as radar
from .agents import agente_03_offer_cro as oferta
from .agents import agente_04_blog_writer as blog
from .agents import agente_05_tip_writer as tip
from .agents import agente_06_auditor as auditor
from .agents import agente_07_publisher as publisher
from .state import MarketingState


# --------------------------------------------------------------------------
# Enrutadores
# --------------------------------------------------------------------------


def tras_cmo(state: MarketingState) -> str:
    return END if state.get("estado") == "abortado" else "radar"


def hacia_redactor(state: MarketingState) -> str:
    return "redactor_tip" if state["brief"].formato == "tip" else "redactor_blog"


def tras_auditoria(state: MarketingState) -> str:
    """Aprobado → publicar. Rechazado → revisión (hasta max_revisiones) o escalamiento al CMO."""
    if state["auditoria"].aprobado:
        return "publicador"
    if state.get("fallos", 0) <= C.settings().max_revisiones:
        return hacia_redactor(state)
    return "escalamiento"


def tras_escalamiento(state: MarketingState) -> str:
    return END if state.get("estado") == "abortado" else "oferta"


# --------------------------------------------------------------------------
# Construcción
# --------------------------------------------------------------------------


def construir_grafo():
    g = StateGraph(MarketingState)
    g.add_node("cmo", cmo.emitir_brief)
    g.add_node("radar", radar.investigar)
    g.add_node("oferta", oferta.disenar_oferta)
    g.add_node("redactor_blog", blog.redactar_blog)
    g.add_node("redactor_tip", tip.redactar_tip)
    g.add_node("auditor", auditor.auditar)
    g.add_node("publicador", publisher.publicar)
    g.add_node("escalamiento", cmo.escalar)

    g.add_edge(START, "cmo")
    g.add_conditional_edges("cmo", tras_cmo, {"radar": "radar", END: END})
    g.add_edge("radar", "oferta")
    g.add_conditional_edges("oferta", hacia_redactor, {"redactor_blog": "redactor_blog", "redactor_tip": "redactor_tip"})
    g.add_edge("redactor_blog", "auditor")
    g.add_edge("redactor_tip", "auditor")
    g.add_conditional_edges(
        "auditor",
        tras_auditoria,
        {"publicador": "publicador", "redactor_blog": "redactor_blog", "redactor_tip": "redactor_tip", "escalamiento": "escalamiento"},
    )
    g.add_conditional_edges("escalamiento", tras_escalamiento, {"oferta": "oferta", END: END})
    g.add_edge("publicador", END)
    return g.compile()
