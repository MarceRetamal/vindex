"""Capa de acceso al modelo. Todos los agentes pasan por acá.

Dos operaciones:

* `texto(...)`: generación libre; con `grounded=True` activa Google Search
  Grounding (herramienta `google_search` de google-genai) y devuelve las fuentes
  realmente consultadas por el buscador (`grounding_metadata`).
* `estructurado(...)`: devuelve un modelo Pydantic validado. Se pide JSON como
  texto con el JSON Schema en el prompt y se valida acá, con reintentos que le
  devuelven al modelo el error de validación. No se usa `response_schema`
  porque Gemini no permite combinarlo con herramientas de búsqueda y porque su
  conversor de esquemas rechaza ciertos constructos de Pydantic.

Patrón para información en tiempo real: primero `texto(grounded=True)` y después
`estructurado(...)` sobre ese texto (dos pasos, sin mezclar herramienta y JSON).
"""

from __future__ import annotations

import json
import re
import time
from dataclasses import dataclass, field
from typing import Protocol, TypeVar

from pydantic import BaseModel, ValidationError

from .config import Settings, settings
from .state import Fuente

T = TypeVar("T", bound=BaseModel)


@dataclass
class TextoGrounded:
    texto: str
    fuentes: list[Fuente] = field(default_factory=list)
    consultas: list[str] = field(default_factory=list)


class LLM(Protocol):
    def texto(
        self, *, system: str, prompt: str, grounded: bool = False, modelo: str | None = None, temperatura: float = 0.7
    ) -> TextoGrounded: ...

    def estructurado(
        self, *, system: str, prompt: str, schema: type[T], modelo: str | None = None, temperatura: float = 0.4
    ) -> T: ...


class LLMError(RuntimeError):
    pass


def extraer_json(texto: str) -> str:
    """Quita cercas ```json y texto alrededor del primer objeto JSON."""
    limpio = texto.strip()
    limpio = re.sub(r"^```(?:json)?\s*|\s*```$", "", limpio, flags=re.IGNORECASE)
    inicio, fin = limpio.find("{"), limpio.rfind("}")
    if inicio != -1 and fin > inicio:
        return limpio[inicio : fin + 1]
    return limpio


class GeminiLLM:
    def __init__(self, cfg: Settings):
        if not cfg.gemini_api_key:
            raise LLMError(
                "Falta GEMINI_API_KEY. Copiá marketing_engine/.env.example a marketing_engine/.env y completala, "
                "o corré con MARKETING_ENGINE_MOCK=1 para probar sin red."
            )
        from google import genai  # import diferido: el mock no lo necesita

        self._cfg = cfg
        self._genai = genai
        self._types = genai.types
        self._client = genai.Client(api_key=cfg.gemini_api_key)

    # -- utilidades ---------------------------------------------------------

    def _reintentar(self, fn):
        ultimo: Exception | None = None
        for intento in range(self._cfg.reintentos_llm):
            try:
                return fn()
            except Exception as exc:  # noqa: BLE001 - se filtra por código HTTP abajo
                codigo = getattr(exc, "code", None) or getattr(exc, "status_code", None)
                transitorio = codigo in (408, 429, 500, 502, 503, 504) or "timed out" in str(exc).lower()
                if not transitorio:
                    raise
                ultimo = exc
                time.sleep(min(2**intento * 2, 30))
        raise LLMError(f"El modelo no respondió tras {self._cfg.reintentos_llm} intentos: {ultimo}")

    def _fuentes(self, respuesta) -> tuple[list[Fuente], list[str]]:
        fuentes: list[Fuente] = []
        consultas: list[str] = []
        vistos: set[str] = set()
        for cand in getattr(respuesta, "candidates", None) or []:
            meta = getattr(cand, "grounding_metadata", None)
            if not meta:
                continue
            consultas.extend(getattr(meta, "web_search_queries", None) or [])
            for chunk in getattr(meta, "grounding_chunks", None) or []:
                web = getattr(chunk, "web", None)
                if not web:
                    continue
                uri = getattr(web, "uri", "") or ""
                if uri in vistos:
                    continue
                vistos.add(uri)
                dominio = (getattr(web, "domain", "") or getattr(web, "title", "") or "").lower()
                fuentes.append(Fuente(titulo=getattr(web, "title", "") or "", uri=uri, dominio=dominio))
        return fuentes, consultas

    # -- API ----------------------------------------------------------------

    def texto(self, *, system, prompt, grounded=False, modelo=None, temperatura=0.7) -> TextoGrounded:
        t = self._types
        config = t.GenerateContentConfig(
            system_instruction=system,
            temperature=temperatura,
            tools=[t.Tool(google_search=t.GoogleSearch())] if grounded else None,
        )
        resp = self._reintentar(
            lambda: self._client.models.generate_content(
                model=modelo or self._cfg.modelo_estrategia, contents=prompt, config=config
            )
        )
        fuentes, consultas = self._fuentes(resp) if grounded else ([], [])
        return TextoGrounded(texto=(resp.text or "").strip(), fuentes=fuentes, consultas=consultas)

    def estructurado(self, *, system, prompt, schema, modelo=None, temperatura=0.4):
        t = self._types
        esquema = json.dumps(schema.model_json_schema(), ensure_ascii=False)
        base = (
            f"{prompt}\n\nRespondé ÚNICAMENTE con un objeto JSON válido (sin texto adicional, sin cercas de código) "
            f"que cumpla este JSON Schema:\n{esquema}"
        )
        config = t.GenerateContentConfig(
            system_instruction=system, temperature=temperatura, response_mime_type="application/json"
        )
        error_previo = ""
        for _ in range(3):
            contenido = base if not error_previo else f"{base}\n\nTu respuesta anterior no validó: {error_previo}\nCorregila."
            resp = self._reintentar(
                lambda c=contenido: self._client.models.generate_content(
                    model=modelo or self._cfg.modelo_estrategia, contents=c, config=config
                )
            )
            try:
                return schema.model_validate_json(extraer_json(resp.text or ""))
            except ValidationError as exc:
                error_previo = str(exc)[:1500]
        raise LLMError(f"El modelo no produjo un {schema.__name__} válido: {error_previo}")


_instancia: LLM | None = None


def get_llm() -> LLM:
    """Devuelve el cliente de modelo (Gemini real o simulado según el entorno)."""
    global _instancia
    if _instancia is None:
        cfg = settings()
        if cfg.mock:
            from .mock_llm import MockLLM

            _instancia = MockLLM()
        else:
            _instancia = GeminiLLM(cfg)
    return _instancia


def set_llm(llm: LLM | None) -> None:
    """Inyecta un cliente (tests)."""
    global _instancia
    _instancia = llm
