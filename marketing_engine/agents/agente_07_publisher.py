"""Agente 07 · Growth Engineer y DevOps.

Publica lo que el Auditor aprobó: guarda el .md y la portada, actualiza public/llms.txt
para los motores generativos, valida el build real del repo y prepara el commit con
GitPython. Si algo falla después de escribir, revierte todo: el repo nunca queda a medias.

En --dry-run no toca el repositorio: deja la vista previa en marketing_engine/.runs/<run_id>/preview/.
"""

from __future__ import annotations

import time
from pathlib import Path

from .. import config as C
from ..state import MarketingState, PublishResult
from ..tools import repo_tools as R


def _rel(p: Path) -> str:
    return p.relative_to(C.REPO_ROOT).as_posix()


def _entrada_llms(b, site_url: str) -> tuple[str, str, str]:
    seccion = "blog" if b.formato == "blog" else "tips"
    prefijo = "" if b.formato == "blog" else "Tip: "
    return (prefijo + b.titulo, f"{site_url}/{seccion}/{b.slug}", b.descripcion)


def _preparar_rama(repo, nombre: str, res: PublishResult) -> None:
    if not nombre:
        res.rama = "(rama actual)" if repo.head.is_detached else repo.active_branch.name
        return
    if nombre in [h.name for h in repo.heads]:
        repo.heads[nombre].checkout()
    else:
        repo.create_head(nombre).checkout()
        res.notas.append(f"Rama {nombre} creada desde HEAD.")
    res.rama = nombre


def _vista_previa(state: MarketingState, b, inv, res: PublishResult) -> PublishResult:
    destino = C.RUNS_DIR / state.get("run_id", "manual") / "preview"
    carpeta = destino / "src" / "content" / ("blog" if b.formato == "blog" else "tips")
    carpeta.mkdir(parents=True, exist_ok=True)
    md = carpeta / f"{b.slug}.md"
    md.write_text(b.archivo_md, encoding="utf-8")
    archivos = [md]
    if b.formato == "blog":
        cov = destino / "public" / "covers" / f"{b.slug}.svg"
        cov.parent.mkdir(parents=True, exist_ok=True)
        cov.write_text(R.generar_portada_svg(b.slug, b.materia, b.titulo), encoding="utf-8")
        archivos.append(cov)
    nuevo, cambio = R.actualizar_llms(C.LLMS_TXT.read_text(encoding="utf-8"), [_entrada_llms(b, inv.site_url)])
    llms = destino / "public" / "llms.txt"
    llms.parent.mkdir(parents=True, exist_ok=True)
    llms.write_text(nuevo, encoding="utf-8")
    archivos.append(llms)

    build = R.compilar_en_sandbox(b)
    res.archivos = [str(a.relative_to(C.ENGINE_DIR)) for a in archivos]
    res.llms_txt_actualizado = cambio
    res.build_ok = build.ok
    res.build_log = build.log[-1200:]
    res.notas.append("DRY-RUN: ningún archivo del repositorio fue modificado. Vista previa en marketing_engine/" + str(destino.relative_to(C.ENGINE_DIR)))
    if not build.ok:
        res.notas.append("Build del sandbox con problemas: " + "; ".join(build.problemas))
    return res


def publicar(state: MarketingState) -> dict:
    cfg = C.settings()
    b, inv, auditoria = state["borrador"], state["inventario"], state.get("auditoria")
    dry = bool(state.get("dry_run"))
    res = PublishResult(dry_run=dry)

    if not auditoria or not auditoria.aprobado:
        raise RuntimeError("El publicador recibió contenido sin aprobación del Auditor: no se publica.")

    if dry:
        _vista_previa(state, b, inv, res)
        return {"publicacion": res, "estado": "dry_run_ok", "motivo_final": "Flujo completo aprobado en modo simulación.",
                "bitacora": [f"Publicador: DRY-RUN OK → {b.slug} (build sandbox {'OK' if res.build_ok else 'CON PROBLEMAS'}); repo intacto."]}

    import git

    repo = git.Repo(C.REPO_ROOT)
    if repo.head.is_valid() and repo.index.diff("HEAD"):
        raise RuntimeError("Hay cambios ya preparados (staged) en el repo ajenos al motor. Commitealos o descartalos y reintentá.")
    _preparar_rama(repo, cfg.git_branch, res)

    llms_original = C.LLMS_TXT.read_text(encoding="utf-8")
    escritos: list[Path] = []
    try:
        escritos = R.escribir_pieza(b)
        nuevo, cambio = R.actualizar_llms(llms_original, [_entrada_llms(b, inv.site_url)])
        if cambio:
            C.LLMS_TXT.write_text(nuevo, encoding="utf-8")
            escritos.append(C.LLMS_TXT)
        res.llms_txt_actualizado = cambio

        build = R.compilar_repo(b, completo=cfg.full_build)
        res.build_ok, res.build_log = build.ok, build.log[-1500:]
        if not build.ok:
            raise RuntimeError("La validación de build falló: " + "; ".join(build.problemas))
    except Exception:
        # Reversión total: el repo queda como estaba.
        for f in escritos:
            if f == C.LLMS_TXT:
                C.LLMS_TXT.write_text(llms_original, encoding="utf-8")
            elif f.exists():
                f.unlink()
        raise

    rels = [_rel(f) for f in escritos]
    repo.index.add(rels)
    try:
        repo.config_reader().get_value("user", "name")
        actor = None
    except Exception:  # noqa: BLE001 - sin identidad configurada
        actor = git.Actor("Marketing Engine", "marketing-engine@localhost")
    tipo = "nota de blog" if b.formato == "blog" else "tip"
    p = auditoria.puntajes
    mensaje = (
        f"Contenido: {tipo} «{b.titulo[:90]}»\n\n"
        f"Área: {state['brief'].area_slug} · keyword: {state['brief'].keyword_principal}\n"
        f"Auditoría aprobada en el intento {auditoria.intento} "
        f"(ética {p.etica}, precisión {p.precision_juridica}, schema {p.estructura}, SEO/GEO {p.seo_geo}, conversión {p.conversion}).\n"
        f"Generado por marketing_engine · ejecución {state.get('run_id', '')}. Revisar antes de mergear a main."
    )
    commit = repo.index.commit(mensaje, author=actor, committer=actor) if actor else repo.index.commit(mensaje)
    res.commit_sha, res.archivos = commit.hexsha, rels

    if cfg.git_push:
        rama = res.rama if res.rama != "(rama actual)" else repo.active_branch.name
        for intento in range(4):
            try:
                info = repo.remote(cfg.git_remote).push(refspec=f"{rama}:{rama}")
                if any(i.flags & i.ERROR for i in info):
                    raise RuntimeError(info[0].summary)
                res.pushed = True
                break
            except Exception as exc:  # noqa: BLE001
                if intento == 3:
                    res.notas.append(f"Push fallido tras 4 intentos ({exc}). El commit quedó local.")
                else:
                    time.sleep(2 ** (intento + 1))
    else:
        res.notas.append("Commit listo y SIN push (GIT_PUSH=false / sin --push). Para desplegar: push y merge a main (Workers Builds corre `npm run build:cloudflare`).")

    return {
        "publicacion": res, "estado": "publicado", "motivo_final": "Publicado y commiteado.",
        "bitacora": [f"Publicador: {len(rels)} archivo(s) escritos, build OK, commit {commit.hexsha[:8]} en {res.rama}{' (push OK)' if res.pushed else ''}."],
    }
