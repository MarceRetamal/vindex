"""CLI del motor de marketing de Vindex Legal.

Se ejecuta desde la RAÍZ del repositorio:

    python -m marketing_engine.main --mode auto --dry-run
    python -m marketing_engine.main --mode blog --area sucesiones --topic "cuánto tarda una sucesión con inmuebles"
    python -m marketing_engine.main --mode tip  --area derecho-laboral --topic "me despidieron por WhatsApp"

Códigos de salida: 0 = publicado o simulación aprobada · 1 = abortado sin publicar · 2 = error de ejecución.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import traceback
from datetime import datetime

from . import config as C


def _parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="marketing_engine",
        description="Departamento de marketing multiagente de Vindex Legal (LangGraph + Gemini con Google Search Grounding).",
    )
    p.add_argument("--mode", choices=["auto", "blog", "tip"], default="auto",
                   help="auto: el CMO decide según el plan de 90 días · blog/tip: formato forzado (requiere --area)")
    p.add_argument("--area", help="Slug del área (ver --list-areas)")
    p.add_argument("--topic", help="Tema de la pieza. Si falta, el CMO lo elige")
    p.add_argument("--dry-run", action="store_true",
                   help="Corre todo el flujo y la auditoría SIN modificar el repo (vista previa en marketing_engine/.runs/)")
    p.add_argument("--ignore-cadence", action="store_true", help="En modo auto, publica aunque hoy no toque según la cadencia")
    p.add_argument("--branch", help="Rama donde commitear (pisa GIT_BRANCH)")
    p.add_argument("--push", action="store_true", help="Hace push de la rama tras commitear (pisa GIT_PUSH)")
    p.add_argument("--mock", action="store_true", help="LLM simulado, sin red ni API key (solo con --dry-run)")
    p.add_argument("--list-models", action="store_true", help="Lista los modelos Gemini que tu clave puede usar, y termina")
    p.add_argument("--list-areas", action="store_true", help="Muestra las áreas válidas y la cobertura actual, y termina")
    p.add_argument("-q", "--quiet", action="store_true", help="No imprime la bitácora en vivo")
    return p


def _listar_areas() -> int:
    from .tools import repo_tools as R

    inv = R.leer_inventario()
    dia = None
    from .agents.agente_01_cmo import dia_del_plan, fase_del_plan, formato_del_dia

    dia = dia_del_plan(C.hoy())
    print(f"Fecha: {inv.fecha} · día {dia} del plan · {fase_del_plan(dia)['nombre']} · hoy toca: {formato_del_dia(C.hoy()) or 'descanso'}")
    print(f"Contenido: {len(inv.blog)} notas, {len(inv.tips)} tips. Categorías de tips: {', '.join(inv.categorias_tips)}\n")
    print(f"{'slug':34} {'materia':12} {'blog':>4} {'tips':>4} {'días':>5} {'peso':>4} {'prioridad':>9}")
    for c in inv.cobertura:
        tips = str(c.tips) if c.area.categoria_tips else "n/a"
        dias = "-" if c.dias_sin_publicar is None else str(c.dias_sin_publicar)
        print(f"{c.area.slug:34} {c.area.materia:12} {c.notas_blog:>4} {tips:>4} {dias:>5} {c.peso_conversion:>4} {c.puntaje_prioridad:>9}")
    return 0


def _guardar_corrida(run_id: str, estado: dict) -> None:
    carpeta = C.RUNS_DIR / run_id
    carpeta.mkdir(parents=True, exist_ok=True)

    def volcar(o):
        if hasattr(o, "model_dump"):
            return o.model_dump(mode="json")
        if isinstance(o, dict):
            return {k: volcar(v) for k, v in o.items() if k != "inventario"}
        if isinstance(o, list):
            return [volcar(x) for x in o]
        return o

    (carpeta / "resultado.json").write_text(json.dumps(volcar(estado), ensure_ascii=False, indent=2), encoding="utf-8")
    (carpeta / "bitacora.txt").write_text("\n".join(estado.get("bitacora", [])) + "\n", encoding="utf-8")
    if estado.get("borrador"):
        (carpeta / "borrador.md").write_text(estado["borrador"].archivo_md, encoding="utf-8")


def main(argv: list[str] | None = None) -> int:
    args = _parser().parse_args(argv)

    if args.mock:
        os.environ["MARKETING_ENGINE_MOCK"] = "1"
    if args.branch:
        os.environ["GIT_BRANCH"] = args.branch
    if args.push:
        os.environ["GIT_PUSH"] = "true"
    cfg = C.settings()

    if args.list_areas:
        return _listar_areas()
    if args.list_models:
        if not cfg.gemini_api_key:
            print("error: falta GEMINI_API_KEY en marketing_engine/.env", file=sys.stderr)
            return 2
        from google import genai

        cliente = genai.Client(api_key=cfg.gemini_api_key)
        for m in cliente.models.list():
            acciones = getattr(m, "supported_actions", None) or []
            if "generateContent" in acciones:
                print((m.name or "").replace("models/", ""))
        print(f"\nEn uso: estrategia={cfg.modelo_estrategia} · redacción={cfg.modelo_redaccion} · auditoría={cfg.modelo_auditoria} · rápido={cfg.modelo_rapido}")
        return 0

    if args.mode in ("blog", "tip") and not args.area:
        print("error: --mode blog/tip requiere --area <slug> (ver --list-areas)", file=sys.stderr)
        return 2
    if cfg.mock and not args.dry_run:
        print("error: el LLM simulado solo puede usarse con --dry-run (genera contenido de prueba, nunca publicable).", file=sys.stderr)
        return 2
    if not cfg.mock and not cfg.gemini_api_key:
        print("error: falta GEMINI_API_KEY. Copiá marketing_engine/.env.example a marketing_engine/.env o usá --mock --dry-run.", file=sys.stderr)
        return 2

    from .graph import construir_grafo

    run_id = datetime.now(C.TZ).strftime("%Y%m%d-%H%M%S")
    inicial = {
        "modo": args.mode, "area_slug": args.area or "", "tema": args.topic or "", "dry_run": args.dry_run,
        "run_id": run_id, "ignorar_cadencia": args.ignore_cadence, "fallos": 0, "escalaciones": 0,
        "historial_auditorias": [], "bitacora": [], "estado": "en_curso",
    }
    print(f"▶ Vindex Marketing Engine · ejecución {run_id} · modo {args.mode}{' · DRY-RUN' if args.dry_run else ''}{' · MOCK' if cfg.mock else ''}")

    final: dict = dict(inicial)
    impresas = 0
    try:
        grafo = construir_grafo()
        for estado in grafo.stream(inicial, config={"recursion_limit": 80}, stream_mode="values"):
            final = estado
            bit = estado.get("bitacora", [])
            if not args.quiet:
                for linea in bit[impresas:]:
                    print("  " + linea)
            impresas = len(bit)
    except Exception as exc:  # noqa: BLE001
        final["bitacora"] = final.get("bitacora", []) + [f"ERROR: {type(exc).__name__}: {exc}"]
        _guardar_corrida(run_id, final)
        print(f"\n✖ Error de ejecución: {type(exc).__name__}: {exc}", file=sys.stderr)
        if os.environ.get("MARKETING_DEBUG"):
            traceback.print_exc()
        print(f"  Estado parcial guardado en marketing_engine/.runs/{run_id}/", file=sys.stderr)
        return 2

    _guardar_corrida(run_id, final)
    estado_final = final.get("estado", "en_curso")
    pub = final.get("publicacion")
    print()
    if estado_final == "publicado" and pub:
        print(f"✔ PUBLICADO · commit {pub.commit_sha[:8]} en {pub.rama} · archivos: {', '.join(pub.archivos)}")
        for n in pub.notas:
            print(f"  · {n}")
        return 0
    if estado_final == "dry_run_ok" and pub:
        b = final["borrador"]
        print(f"✔ DRY-RUN OK · «{b.titulo}» aprobado por el Auditor (intento {final['auditoria'].intento}) · build sandbox {'OK' if pub.build_ok else 'CON PROBLEMAS'}")
        print(f"  Vista previa: marketing_engine/.runs/{run_id}/preview/  ·  bitácora y estado: marketing_engine/.runs/{run_id}/")
        for n in pub.notas:
            print(f"  · {n}")
        return 0
    print(f"■ ABORTADO sin publicar: {final.get('motivo_final', 'sin motivo')}")
    print(f"  Detalle: marketing_engine/.runs/{run_id}/")
    return 1


if __name__ == "__main__":
    sys.exit(main())
