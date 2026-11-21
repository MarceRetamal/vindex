"""Herramientas de acceso al repositorio.

Tres responsabilidades:

1. LEER el inventario (blog, tips, áreas, llms.txt) para evitar canibalización de
   keywords y proponer enlaces internos.
2. VALIDAR de forma estricta el .md (frontmatter YAML + las reglas reales del
   conversor `scripts/markdown.mjs`) y COMPILAR con `scripts/build-content.mjs`
   en un sandbox temporal, de modo que nada toca el repo hasta publicar.
3. ESCRIBIR (solo el publicador): .md, portada SVG y `public/llms.txt`.

Las reglas del conversor markdown se verificaron leyendo `scripts/markdown.mjs`:
solo soporta `##`, párrafos, listas (cada ítem separado por línea en blanco),
`!!` (dato clave), `>` (cita), **negrita**, *cursiva* y enlaces. NO soporta
tablas, `###`, imágenes, reglas horizontales ni listas anidadas.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
import unicodedata
from dataclasses import dataclass, field
from datetime import date
from pathlib import Path

import yaml

from .. import config as C
from ..state import (
    AreaInfo,
    Borrador,
    CoberturaArea,
    Inventario,
    ItemContenido,
)

# ==========================================================================
# 1. Lectura de datos del sitio
# ==========================================================================


def _leer(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def leer_site() -> tuple[str, str]:
    """(SITE_URL, whatsapp) desde src/data/site.ts, con respaldo en config."""
    ts = _leer(C.SITE_TS)
    url = re.search(r"SITE_URL\s*=\s*'([^']+)'", ts)
    wa = re.search(r"whatsapp:\s*'(\d+)'", ts)
    return (url.group(1) if url else C.SITE_URL_FALLBACK, wa.group(1) if wa else C.WHATSAPP_FALLBACK)


_STR = r"'((?:[^'\\]|\\.)*)'"


def _campo(nombre: str, chunk: str) -> str:
    m = re.search(rf"\b{nombre}:\s*{_STR}", chunk)
    return m.group(1).replace("\\'", "'") if m else ""


def leer_areas() -> list[AreaInfo]:
    """Áreas de areas.ts + los servicios con página propia (penal, sucesiones) + áreas extra de config."""
    ts = _leer(C.AREAS_TS)
    areas: list[AreaInfo] = []

    bloque = re.search(r"export const AREAS: Area\[\] = \[(.*?)\n\]\n", ts, re.S)
    if bloque:
        for chunk in re.split(r"\n  \{\n(?=    slug:)", "\n" + bloque.group(1)):
            slug = _campo("slug", chunk)
            if not slug:
                continue
            sit = re.search(r"situaciones:\s*\[(.*?)\n    \],\n    pasos:", chunk, re.S)
            faqs = re.search(r"faqs:\s*\[(.*)", chunk, re.S)
            tags = re.search(r"tags:\s*\[(.*?)\]", chunk, re.S)
            areas.append(
                AreaInfo(
                    slug=slug,
                    nombre=_campo("nombre", chunk),
                    materia=_campo("materia", chunk),
                    categoria_tips=_campo("categoriaTips", chunk),
                    href=f"/{slug}",
                    titulo_seo=_campo("titleSeo", chunk),
                    tags=[t.replace("\\'", "'") for t in re.findall(_STR, tags.group(1))] if tags else [],
                    situaciones=[s.replace("\\'", "'") for s in re.findall(rf"title:\s*{_STR}", sit.group(1))] if sit else [],
                    faqs=[q.replace("\\'", "'") for q in re.findall(rf"\bq:\s*{_STR}", faqs.group(1))] if faqs else [],
                )
            )

    # Servicios con página propia que no están en AREAS (Penal y Sucesiones).
    por_materia = dict(
        (m.group(1), (m.group(2), m.group(3)))
        for m in re.finditer(r"\n  (\w+):\s*\{\s*href:\s*'([^']+)',\s*titulo:\s*'((?:[^'\\]|\\.)*)'", ts)
    )
    for materia, (href, titulo) in por_materia.items():
        slug = href.strip("/")
        if materia in {a.materia for a in areas} or any(a.slug == slug for a in areas):
            continue
        areas.append(AreaInfo(slug=slug, nombre=titulo, materia=materia, categoria_tips="", href=href))

    for extra in C.AREAS_EXTRA:
        if not any(a.slug == extra["slug"] for a in areas):
            areas.append(
                AreaInfo(
                    slug=extra["slug"],
                    nombre=extra["nombre"],
                    materia=extra["materia"],
                    categoria_tips=extra["categoria_tips"],
                    href=extra["href"],
                    tiene_pagina_propia=False,
                )
            )
    return areas


def leer_categorias_tips() -> list[str]:
    """Categorías que el sitio realmente muestra en /tips (CATEGORIAS_TIPS en src/lib/tips.ts)."""
    ts = _leer(C.TIPS_TS)
    bloque = re.search(r"CATEGORIAS_TIPS\s*=\s*\[(.*?)\]\s*as const", ts, re.S)
    return re.findall(r"nombre:\s*'([^']+)'", bloque.group(1)) if bloque else []


def rutas_validas(areas: list[AreaInfo], blog: list[ItemContenido], tips: list[ItemContenido]) -> set[str]:
    """Rutas internas a las que se puede enlazar sin romper el sitio."""
    rutas = {"/"}
    pagina = C.REPO_ROOT / "src" / "app" / "(site)"
    if pagina.exists():
        for d in pagina.iterdir():
            if d.is_dir() and not d.name.startswith(("[", "(", "_")):
                rutas.add(f"/{d.name}")
    rutas.update(a.href for a in areas if a.tiene_pagina_propia)
    rutas.update(i.ruta for i in blog + tips)
    return rutas


# ==========================================================================
# 2. Parser de frontmatter: réplica de scripts/build-content.mjs
# ==========================================================================


def _quitar_comillas(texto: str) -> str:
    v = texto.strip()
    if len(v) >= 2 and ((v[0] == '"' and v[-1] == '"') or (v[0] == "'" and v[-1] == "'")):
        return v[1:-1]
    return v


def parsear_frontmatter(contenido: str) -> dict:
    """Misma lógica que `parseFrontmatter` del build. Devuelve datos, resumen, faq, cuerpo, ok."""
    norm = contenido.lstrip("﻿").replace("\r\n", "\n")
    m = re.match(r"^---\n([\s\S]*?)\n---\n?([\s\S]*)$", norm)
    if not m:
        return {"ok": False, "datos": {}, "resumen": [], "faq": [], "cuerpo": norm.strip(), "crudo": ""}
    lineas = m.group(1).split("\n")
    datos: dict[str, str] = {}
    resumen: list[str] = []
    faq: list[dict] = []
    i = 0
    while i < len(lineas):
        linea = lineas[i]
        if re.match(r"^resumen:\s*$", linea):
            i += 1
            while i < len(lineas):
                it = re.match(r"^\s*-\s+(.*)$", lineas[i])
                if not it:
                    break
                resumen.append(it.group(1).strip())
                i += 1
            continue
        if re.match(r"^faq:\s*$", linea):
            i += 1
            while i < len(lineas):
                ini = re.match(r"^\s*-\s+pregunta\s*:\s*(.*)$", lineas[i])
                if not ini:
                    break
                item = {"pregunta": _quitar_comillas(ini.group(1)), "respuesta": ""}
                i += 1
                if i < len(lineas):
                    r = re.match(r"^\s+respuesta\s*:\s*(.*)$", lineas[i])
                    if r:
                        item["respuesta"] = _quitar_comillas(r.group(1))
                        i += 1
                if item["pregunta"] and item["respuesta"]:
                    faq.append(item)
            continue
        par = re.match(r"^([a-zA-ZáéíóúñÁÉÍÓÚÑ_]+)\s*:\s*(.*)$", linea)
        if par:
            datos[par.group(1).strip().lower()] = _quitar_comillas(par.group(2))
        i += 1
    return {"ok": True, "datos": datos, "resumen": resumen, "faq": faq, "cuerpo": m.group(2).strip(), "crudo": m.group(1)}


# ==========================================================================
# 3. Inventario y canibalización
# ==========================================================================

_STOP = set(
    "a al algo ante con contra cual cuando de del desde donde el ella ellos en entre es esta este esto la las le les lo los me mi "
    "mis mas muy no nos o para pero por que se si sin sobre su sus te tu tus un una uno y ya como hay ser son fue fui ha han "
    "hacer hace qué cómo cuándo cuánto cuánta cuántos dónde puedo puede tengo tiene tienen quiero guia guía".split()
)


def tokens(texto: str) -> list[str]:
    plano = unicodedata.normalize("NFD", texto.lower())
    plano = "".join(c for c in plano if unicodedata.category(c) != "Mn")
    out = []
    for t in re.findall(r"[a-z0-9]+", plano):
        if t in _STOP or len(t) < 3:
            continue
        if len(t) > 4 and t.endswith("es"):
            t = t[:-2]
        elif len(t) > 3 and t.endswith("s"):
            t = t[:-1]
        out.append(t)
    return out


def similitud(a: str, b: str) -> float:
    """Coeficiente de solapamiento: |A∩B| / min(|A|,|B|). Detecta que un texto corto ya está cubierto por uno largo."""
    ta, tb = set(tokens(a)), set(tokens(b))
    inter = len(ta & tb)
    if inter < 3:
        return 0.0
    return inter / min(len(ta), len(tb))


def _leer_carpeta(directorio: Path, tipo: str) -> list[ItemContenido]:
    items: list[ItemContenido] = []
    if not directorio.exists():
        return items
    for archivo in sorted(directorio.glob("*.md")):
        fm = parsear_frontmatter(archivo.read_text(encoding="utf-8"))
        d = fm["datos"]
        if not d.get("titulo"):
            continue
        slug = archivo.stem
        base = " ".join([d["titulo"], d.get("descripcion", ""), slug.replace("-", " ")])
        items.append(
            ItemContenido(
                tipo=tipo,  # type: ignore[arg-type]
                slug=slug,
                ruta=f"/{'blog' if tipo == 'blog' else 'tips'}/{slug}",
                titulo=d["titulo"],
                descripcion=d.get("descripcion", ""),
                materia=d.get("materia") or d.get("categoria", ""),
                fecha=d.get("fecha", ""),
                palabras=len(fm["cuerpo"].split()),
                nota_pilar=d.get("nota_pilar", ""),
                tokens=sorted(set(tokens(base))),
            )
        )
    return items


def leer_urls_llms() -> list[str]:
    return re.findall(r"\]\((https?://[^)\s]+)\)", _leer(C.LLMS_TXT))


def leer_inventario() -> Inventario:
    site_url, wa = leer_site()
    areas = leer_areas()
    blog = _leer_carpeta(C.BLOG_DIR, "blog")
    tips = _leer_carpeta(C.TIPS_DIR, "tip")
    hoy = C.hoy()

    cobertura: list[CoberturaArea] = []
    pesos = C.PLAN_90_DIAS["peso_conversion"]
    for a in areas:
        nb = [i for i in blog if i.materia == a.materia]
        nt = [i for i in tips if a.categoria_tips and i.materia == a.categoria_tips]
        fechas = sorted(i.fecha for i in nb + nt if i.fecha)
        ultima = fechas[-1] if fechas else ""
        dias = (hoy - date.fromisoformat(ultima)).days if ultima else None
        peso = int(pesos.get(a.slug, 3))
        # Prioridad: más peso comercial, menos contenido y más tiempo sin publicar => más prioridad.
        recencia = 1 + min(dias if dias is not None else 90, 90) / 90
        prioridad = round(peso * (1 / (1 + len(nb) + 0.5 * len(nt))) * recencia, 3)
        cobertura.append(
            CoberturaArea(
                area=a,
                notas_blog=len(nb),
                tips=len(nt),
                ultima_publicacion=ultima,
                dias_sin_publicar=dias,
                peso_conversion=peso,
                puntaje_prioridad=prioridad,
            )
        )
    cobertura.sort(key=lambda c: c.puntaje_prioridad, reverse=True)

    categorias = leer_categorias_tips()
    materias = sorted({a.materia for a in areas} | set(C.MATERIAS_EXTRA_VALIDAS) | {i.materia for i in blog if i.materia})
    return Inventario(
        fecha=hoy.isoformat(),
        site_url=site_url,
        whatsapp=wa,
        areas=areas,
        blog=blog,
        tips=tips,
        categorias_tips=categorias,
        materias_validas=materias,
        llms_txt_urls=leer_urls_llms(),
        cobertura=cobertura,
    )


def obtener_area(inv: Inventario, slug: str) -> AreaInfo | None:
    return next((a for a in inv.areas if a.slug == slug), None)


def detectar_canibalizacion(texto: str, inv: Inventario, formato: str | None = None) -> list[tuple[ItemContenido, float]]:
    """Contenido existente demasiado parecido al texto (tema + keyword). Ordenado de mayor a menor similitud."""
    candidatos = inv.blog + inv.tips if formato is None else (inv.blog if formato == "blog" else inv.tips)
    res = []
    for it in candidatos:
        base = f"{it.titulo} {it.descripcion} {it.slug.replace('-', ' ')}"
        s = similitud(texto, base)
        if s >= C.UMBRAL_CANIBALIZACION:
            res.append((it, round(s, 2)))
    return sorted(res, key=lambda x: x[1], reverse=True)


def enlaces_internos(inv: Inventario, area: AreaInfo, texto: str, limite: int = 6) -> list[dict]:
    """Enlaces internos recomendados: página del área + notas/tips de la misma materia o muy afines al tema."""
    cand: list[tuple[float, dict]] = []
    if area.tiene_pagina_propia:
        cand.append((9.0, {"ruta": area.href, "titulo": area.titulo_seo or area.nombre, "tipo": "area"}))
    for it in inv.blog + inv.tips:
        afin = similitud(texto, f"{it.titulo} {it.descripcion}")
        misma = it.materia in {area.materia, area.categoria_tips}
        score = afin + (0.35 if misma else 0)
        # Sin umbral: si el área tiene poco contenido, igual se ofrecen los más afines para poder enlazar.
        cand.append((score, {"ruta": it.ruta, "titulo": it.titulo, "tipo": it.tipo}))
    cand.sort(key=lambda x: x[0], reverse=True)
    return [c[1] for c in cand[:limite]]


# ==========================================================================
# 4. Armado y validación del .md
# ==========================================================================


def sanear_escalar(texto: str) -> str:
    """Un valor entre comillas dobles del frontmatter: sin saltos de línea y sin comillas rectas internas.

    El build no procesa escapes (`\\"` se vería con la barra) y YAML estricto no admite comillas
    rectas sin escapar, así que se usan comillas tipográficas.
    """
    t = re.sub(r"\s+", " ", texto).strip()
    t = re.sub(r'"([^"]*)"', r"“\1”", t)
    return t.replace('"', "”")


def armar_markdown(b: Borrador) -> str:
    """Arma el .md final con el formato EXACTO de _PLANTILLA.txt. El modelo nunca escribe el YAML."""
    q = sanear_escalar
    lineas = ["---", f'titulo: "{q(b.titulo)}"']
    if b.formato == "blog":
        lineas += [
            f'titulo_seo: "{q(b.titulo_seo)}"',
            f'descripcion: "{q(b.descripcion)}"',
            f'copete: "{q(b.copete)}"',
            f'materia: "{q(b.materia)}"',
        ]
    else:
        lineas += [f'descripcion: "{q(b.descripcion)}"', f'categoria: "{q(b.materia)}"']
    lineas += [f'fecha: "{b.fecha}"', f'actualizado: "{b.actualizado or b.fecha}"']
    if b.formato == "tip" and b.nota_pilar:
        lineas.append(f'nota_pilar: "{q(b.nota_pilar)}"')
    lineas.append('borrador: "no"')
    lineas.append("resumen:")
    lineas += [f"  - {re.sub(chr(10), ' ', r).strip()}" for r in b.resumen]
    if b.formato == "blog" and b.faq:
        lineas.append("faq:")
        for f in b.faq:
            lineas.append(f'  - pregunta: "{q(f.pregunta)}"')
            lineas.append(f'    respuesta: "{q(f.respuesta)}"')
    lineas.append("---")
    cuerpo = re.sub(r"\n{3,}", "\n\n", b.cuerpo_md.strip().replace("\r\n", "\n"))
    return "\n".join(lineas) + "\n\n" + cuerpo + "\n"


@dataclass
class Problema:
    nivel: str  # "error" | "aviso"
    campo: str
    mensaje: str
    arreglo: str = ""


SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
FECHA_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)\s]+)\)")


def _plano(t: str) -> str:
    t = re.sub(r"\*+", "", t)
    return re.sub(r"\s+", " ", t).strip().lower()


def validar_borrador(b: Borrador, inv: Inventario) -> list[Problema]:
    """Validación estricta de schema y de compatibilidad con el conversor. Determinista y sin red."""
    L = C.LIMITES
    p: list[Problema] = []
    err = lambda campo, msg, fix="": p.append(Problema("error", campo, msg, fix))  # noqa: E731
    avi = lambda campo, msg, fix="": p.append(Problema("aviso", campo, msg, fix))  # noqa: E731

    es_blog = b.formato == "blog"
    carpeta = C.BLOG_DIR if es_blog else C.TIPS_DIR
    existentes = {i.slug for i in (inv.blog if es_blog else inv.tips)}

    # --- slug --------------------------------------------------------------
    if not SLUG_RE.match(b.slug):
        err("slug", f"Slug inválido: {b.slug!r}", "Minúsculas, sin acentos, solo letras, números y guiones simples.")
    if len(b.slug) > 80:
        err("slug", f"Slug demasiado largo ({len(b.slug)}).", "Máximo 80 caracteres.")
    if b.slug in existentes or (carpeta / f"{b.slug}.md").exists():
        err("slug", f"Ya existe {b.slug}.md.", "Elegí un slug distinto: el publicador nunca sobrescribe contenido.")

    # --- fechas ------------------------------------------------------------
    for campo in ("fecha", "actualizado"):
        v = getattr(b, campo) or (b.fecha if campo == "actualizado" else "")
        if not FECHA_RE.match(v):
            err(campo, f"{campo} debe ser AAAA-MM-DD (llegó {v!r}).")

    # --- campos y límites --------------------------------------------------
    if not b.titulo.strip():
        err("titulo", "Falta el título.")
    if len(b.titulo) > L["titulo_max"]:
        err("titulo", f"Título de {len(b.titulo)} caracteres (máx. {L['titulo_max']}).", "Acortalo sin perder la búsqueda principal.")
    if not b.descripcion.strip():
        err("descripcion", "Falta la descripción.")
    if es_blog:
        if not b.titulo_seo.strip() or len(b.titulo_seo) > L["titulo_seo_max"]:
            err("titulo_seo", f"titulo_seo vacío o de más de {L['titulo_seo_max']} caracteres ({len(b.titulo_seo)}).")
        if len(b.descripcion) > L["descripcion_max"]:
            err("descripcion", f"Descripción de {len(b.descripcion)} caracteres (máx. {L['descripcion_max']}).")
        if not b.copete.strip():
            err("copete", "Falta el copete (aparece en la tarjeta del listado).")
        if b.materia not in inv.materias_validas:
            err("materia", f"Materia {b.materia!r} no válida.", f"Usá una de: {', '.join(inv.materias_validas)}.")
    else:
        if len(b.descripcion) > L["descripcion_max"] + 25:
            avi("descripcion", f"Descripción larga ({len(b.descripcion)}).")
        if b.materia not in inv.categorias_tips:
            err(
                "categoria",
                f"Categoría de tip {b.materia!r} inexistente en CATEGORIAS_TIPS ({', '.join(inv.categorias_tips)}).",
                "El tip no aparecería en el listado de /tips. Usá una categoría existente.",
            )
        if b.nota_pilar and b.nota_pilar not in {i.slug for i in inv.blog}:
            err("nota_pilar", f"nota_pilar {b.nota_pilar!r} no existe en src/content/blog.", "Usá un slug existente o dejalo vacío.")

    # --- resumen -----------------------------------------------------------
    if len(b.resumen) != L["resumen_items"]:
        err("resumen", f"El resumen debe tener exactamente {L['resumen_items']} ítems (tiene {len(b.resumen)}).")
    for r in b.resumen:
        if re.search(r":\s", r) or " #" in r or re.match(r"^[\-?*&!%@`'\"\[\]{}>|]", r):
            err(
                "resumen",
                f"Ítem de resumen no compatible con YAML plano: {r[:60]!r}",
                "Sin dos puntos seguidos de espacio, sin ' #' y sin comillas ni símbolos al inicio. "
                "Los ítems van sin comillas porque el sitio no las quita.",
            )
        if len(r) > 220:
            avi("resumen", "Ítem de resumen de más de 220 caracteres.")

    # --- faq ---------------------------------------------------------------
    if es_blog:
        if not (L["faq_min"] <= len(b.faq) <= L["faq_max"]):
            err("faq", f"El blog debe traer entre {L['faq_min']} y {L['faq_max']} preguntas frecuentes (trae {len(b.faq)}).")
        cuerpo_plano = _plano(b.cuerpo_md)
        for f in b.faq:
            if not f.pregunta.strip() or not f.respuesta.strip():
                err("faq", "Pregunta frecuente incompleta.")
            if _plano(f.pregunta) not in cuerpo_plano:
                err(
                    "faq",
                    f"La pregunta {f.pregunta[:60]!r} no aparece en el cuerpo.",
                    "Google exige que el FAQ marcado sea visible: repetí cada pregunta y su respuesta en '## Preguntas frecuentes'.",
                )
            elif _plano(f.respuesta)[:50] not in cuerpo_plano:
                err("faq", f"La respuesta de {f.pregunta[:50]!r} no aparece en el cuerpo.", "Repetila textual en el cuerpo.")
    elif b.faq:
        avi("faq", "Los tips no procesan FAQ: se ignora.")

    # --- cuerpo: subconjunto de markdown soportado --------------------------
    cuerpo = b.cuerpo_md.replace("\r\n", "\n").strip()
    if not cuerpo:
        err("cuerpo", "Cuerpo vacío.")
        return p
    palabras = len(cuerpo.split())
    lo, hi = (L["blog_palabras_min"], L["blog_palabras_max"]) if es_blog else (L["tip_palabras_min"], L["tip_palabras_max"])
    if not lo <= palabras <= hi:
        err("cuerpo", f"{palabras} palabras; el {b.formato} debe tener entre {lo} y {hi}.", "Ajustá la extensión sin relleno.")

    bloques = [x.strip() for x in re.split(r"\n{2,}", cuerpo) if x.strip()]
    n_callouts = 0
    n_h2 = 0
    for blq in bloques:
        primera = blq.split("\n", 1)[0]
        if re.match(r"^#{1}\s", blq) or re.match(r"^#{3,}\s", blq):
            err("cuerpo", f"Encabezado no soportado: {primera[:50]!r}", "El conversor solo soporta '## '. Sin # ni ###.")
        if blq.startswith("## "):
            n_h2 += 1
            if "\n" in blq:
                err("cuerpo", f"El subtítulo {primera[:50]!r} debe estar solo en su bloque.", "Dejá una línea en blanco debajo del '##'.")
            continue
        if blq.startswith("!!"):
            n_callouts += 1
            continue
        if re.match(r"^[-*][ \t]+", blq) or re.match(r"^\d+\.[ \t]+", blq):
            if re.search(r"\n\s*(?:[-*]|\d+\.)[ \t]+", blq):
                err(
                    "cuerpo",
                    f"Lista con ítems pegados ({primera[:40]!r}…): el conversor los fusiona en un solo ítem.",
                    "Separá cada ítem de la lista con una línea en blanco.",
                )
            continue
        if re.search(r"^\|.*\|", blq, re.M) or re.search(r"^\s*\|?\s*:?-{3,}:?\s*\|", blq, re.M):
            err("cuerpo", "Tabla markdown detectada: el conversor no la soporta y se vería como texto plano.", "Reemplazala por una lista (cada ítem con **etiqueta:** descripción), separada por líneas en blanco.")
        if re.match(r"^(-{3,}|\*{3,}|_{3,})$", blq):
            err("cuerpo", "Regla horizontal no soportada.", "Eliminala.")
        if "![" in blq:
            err("cuerpo", "Imágenes en el cuerpo no soportadas.", "Eliminalas: la portada se genera aparte.")
        if re.search(r"</?[a-zA-Z][^>]*>", blq):
            err("cuerpo", "HTML en el cuerpo: el conversor lo escapa.", "Eliminá las etiquetas.")
        if "\n" in blq and re.search(r"\n\s*(?:[-*]|\d+\.)[ \t]+", blq):
            err("cuerpo", "Lista pegada a un párrafo sin línea en blanco.", "Dejá una línea en blanco antes de la lista.")
    if n_h2 < (4 if es_blog else 2):
        err("cuerpo", f"Pocos subtítulos '##' ({n_h2}).", "El blog necesita al menos 4 secciones y el tip al menos 2.")
    if n_callouts > L["callouts_max"]:
        err("cuerpo", f"{n_callouts} datos clave '!!' (máx. {L['callouts_max']}).", "Dejá solo los más fuertes.")
    if cuerpo.count("**") % 2:
        err("cuerpo", "Negritas '**' sin cerrar.")
    for etiqueta, destino in LINK_RE.findall(cuerpo):
        if not (destino.startswith("/") or destino.startswith("https://")):
            err("cuerpo", f"Enlace con destino no válido: {destino!r}", "Rutas internas con '/' o URLs https.")
    rutas = rutas_validas(inv.areas, inv.blog, inv.tips)
    internos = [d for _e, d in LINK_RE.findall(cuerpo) if d.startswith("/")]
    for d in internos:
        ruta = d.split("#")[0].split("?")[0].rstrip("/") or "/"
        if ruta not in rutas:
            err("cuerpo", f"Enlace interno roto: {d}", "Enlazá solo a páginas que existan en el sitio.")
    if "/evaluacion" not in internos:
        err("cuerpo", "Falta el enlace a /evaluacion.", "Todo contenido debe llevar al formulario de evaluación.")
    if es_blog and len({d for d in internos if d.startswith(("/blog/", "/tips/"))}) < 2 and (len(inv.blog) + len(inv.tips)) >= 4:
        err("cuerpo", "Menos de 2 enlaces internos a notas o tips.", "Sumá enlaces contextuales a contenido existente afín.")
    if cuerpo.count("—") > L["guiones_largos_max"]:
        avi("cuerpo", f"{cuerpo.count('—')} guiones largos.", "Reemplazalos por comas, dos puntos u oraciones separadas.")

    if re.search(r'(?<![\w“"])"[^"]{1,80}"(?![\w])', b.titulo + b.descripcion):
        avi("titulo", "Comillas rectas en título o descripción: se convierten en tipográficas.")
    return p


def detectar_promesas(texto: str) -> list[tuple[str, str, str]]:
    """Patrones éticos prohibidos. Devuelve (fragmento, motivo, patrón)."""
    sin_telegrama = re.sub(r"telegrama[s]? (gratuito|gratis)", "telegrama", texto, flags=re.I)
    out = []
    for patron, motivo in C.PATRONES_PROHIBIDOS:
        for m in re.finditer(patron, sin_telegrama, flags=re.I):
            ini = max(0, m.start() - 30)
            out.append((sin_telegrama[ini : m.end() + 30].replace("\n", " "), motivo, patron))
    return out


def detectar_citas_no_verificadas(texto: str, permitidas: list[str]) -> list[str]:
    """Carátulas y expedientes que no figuren en el informe de inteligencia (anti-invención de fallos)."""
    patrones = [
        r"\b[A-ZÁÉÍÓÚ][\wáéíóúñ.]+(?: [A-ZÁÉÍÓÚ][\wáéíóúñ.]+)* (?:c|s)/ [A-ZÁÉÍÓÚ][\wáéíóúñ./ ]+",
        r"\b(?:expte|expediente|causa|autos)\.? (?:n[°º.]?|nro\.?|número)?\s*\d[\d./-]{3,}",
        r"\bIPP\s*(?:n[°º.]?)?\s*\d[\d./-]{3,}",
    ]
    base = _plano(" ".join(permitidas))
    hallados = []
    for pat in patrones:
        for m in re.finditer(pat, texto):
            frag = m.group(0).strip()
            if _plano(frag) not in base:
                hallados.append(frag)
    return hallados


# ==========================================================================
# 5. YAML estricto
# ==========================================================================


def validar_yaml(md: str) -> list[Problema]:
    """Parseo YAML real (PyYAML) del frontmatter, además de la réplica del parser del sitio."""
    p: list[Problema] = []
    fm = parsear_frontmatter(md)
    if not fm["ok"]:
        return [Problema("error", "frontmatter", "No se encontró el bloque ---...--- al inicio del archivo.")]
    try:
        data = yaml.safe_load(fm["crudo"])
    except yaml.YAMLError as exc:
        return [Problema("error", "frontmatter", f"YAML inválido: {str(exc)[:200]}", "Corregí comillas y dos puntos.")]
    if not isinstance(data, dict):
        return [Problema("error", "frontmatter", "El frontmatter no es un mapa YAML.")]
    for k in ("fecha", "actualizado"):
        if k in data and not isinstance(data[k], str):
            p.append(Problema("error", k, f"{k} se interpretó como {type(data[k]).__name__}: debe ir entre comillas."))
    if str(data.get("borrador", "")).lower() != "no":
        p.append(Problema("error", "borrador", 'borrador debe ser "no" para publicar.'))
    res = data.get("resumen")
    if not isinstance(res, list) or not all(isinstance(x, str) for x in res):
        p.append(Problema("error", "resumen", "El resumen debe ser una lista de textos."))
    elif fm["resumen"] != res:
        p.append(Problema("error", "resumen", "El YAML y el parser del sitio leen el resumen distinto.", "Revisá símbolos especiales."))
    return p


# ==========================================================================
# 6. Compilación: sandbox y repo real
# ==========================================================================


@dataclass
class ResultadoBuild:
    ok: bool
    log: str = ""
    item: dict = field(default_factory=dict)
    problemas: list[str] = field(default_factory=list)


def _node() -> str | None:
    return shutil.which("node")


def _correr_build(raiz: Path, slug: str, formato: str, esperado: dict | None) -> ResultadoBuild:
    node = _node()
    if not node:
        return ResultadoBuild(False, "node no está instalado: no se puede validar el build.", problemas=["node no disponible"])
    proc = subprocess.run(
        [node, str(raiz / "scripts" / "build-content.mjs")], cwd=raiz, capture_output=True, text=True, timeout=120
    )
    log = (proc.stdout + proc.stderr).strip()
    res = ResultadoBuild(proc.returncode == 0, log)
    if proc.returncode != 0:
        res.problemas.append(f"build-content terminó con código {proc.returncode}")
        return res
    salida = raiz / "src" / "content" / ("blog.generated.json" if formato == "blog" else "tips.generated.json")
    try:
        items = json.loads(salida.read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        res.ok = False
        res.problemas.append(f"No se pudo leer {salida.name}: {exc}")
        return res
    item = next((i for i in items if i.get("slug") == slug), None)
    if item is None:
        res.ok = False
        res.problemas.append("El build omitió la pieza (falta título o cuerpo, o quedó como borrador).")
        return res
    res.item = item
    for linea in log.splitlines():
        if "[build-content]" in linea and slug in linea and "apunta a la nota" in linea:
            res.problemas.append(linea.strip())
        if "incompleta" in linea:
            res.problemas.append(linea.strip())
    esperado = esperado or {}
    html = item.get("html", "")
    if len(item.get("resumen", [])) != 3:
        res.problemas.append(f"El sitio leyó {len(item.get('resumen', []))} ítems de resumen (esperaba 3).")
    if formato == "blog" and len(item.get("faq", [])) != esperado.get("faq", 0):
        res.problemas.append(f"El sitio leyó {len(item.get('faq', []))} FAQ (esperaba {esperado.get('faq', 0)}).")
    if "](" in html or "<p>|" in html or "<p>###" in html or "<p>## " in html:
        res.problemas.append("Quedó markdown sin convertir en el HTML (enlace, tabla o encabezado).")
    if re.search(r"<li>[^<]*\n[-*\d]", html):
        res.problemas.append("Hay ítems de lista fusionados en el HTML.")
    if esperado.get("h2") is not None:
        # Los tips no exponen `headings` en su JSON: se cuentan los <h2> del HTML.
        generados = len(item["headings"]) if "headings" in item else html.count("<h2 ")
        if generados != esperado["h2"]:
            res.problemas.append(f"El sitio generó {generados} subtítulos (esperaba {esperado['h2']}).")
    if formato == "blog" and not item.get("imagen"):
        res.problemas.append("La nota no tiene portada (falta public/covers/<slug>.svg).")
    res.ok = not res.problemas
    return res


def compilar_en_sandbox(b: Borrador) -> ResultadoBuild:
    """Copia scripts + contenido a un directorio temporal, agrega la pieza y corre el build real.

    No toca el repositorio: sirve tanto para --dry-run como para auditar antes de publicar.
    """
    with tempfile.TemporaryDirectory(prefix="vindex-sandbox-") as tmp:
        raiz = Path(tmp)
        shutil.copytree(C.REPO_ROOT / "scripts", raiz / "scripts")
        for sub, origen in (("blog", C.BLOG_DIR), ("tips", C.TIPS_DIR)):
            destino = raiz / "src" / "content" / sub
            destino.mkdir(parents=True)
            for f in origen.glob("*.md"):
                shutil.copy2(f, destino / f.name)
        portadas = raiz / "public" / "covers"
        portadas.mkdir(parents=True)
        for f in C.COVERS_DIR.glob("*"):
            (portadas / f.name).touch()
        carpeta = raiz / "src" / "content" / ("blog" if b.formato == "blog" else "tips")
        (carpeta / f"{b.slug}.md").write_text(b.archivo_md, encoding="utf-8")
        if b.formato == "blog":
            (portadas / f"{b.slug}.svg").write_text(generar_portada_svg(b.slug, b.materia, b.titulo), encoding="utf-8")
        h2 = len(re.findall(r"^## ", b.cuerpo_md, re.M))
        return _correr_build(raiz, b.slug, b.formato, {"faq": len(b.faq) if b.formato == "blog" else 0, "h2": h2})


def compilar_repo(b: Borrador, completo: bool = False) -> ResultadoBuild:
    """Build real sobre el repositorio (genera los .generated.json, que git ignora)."""
    esperado = {"faq": len(b.faq) if b.formato == "blog" else 0, "h2": len(re.findall(r"^## ", b.cuerpo_md, re.M))}
    res = _correr_build(C.REPO_ROOT, b.slug, b.formato, esperado)
    if res.ok and completo:
        if not (C.REPO_ROOT / "node_modules").exists():
            res.log += "\n[aviso] FULL_BUILD pedido pero no hay node_modules: se omite `npm run build`."
        else:
            proc = subprocess.run(["npm", "run", "build"], cwd=C.REPO_ROOT, capture_output=True, text=True, timeout=1500)
            res.log += "\n" + (proc.stdout + proc.stderr)[-2500:]
            if proc.returncode != 0:
                res.ok = False
                res.problemas.append("`npm run build` falló.")
    return res


# ==========================================================================
# 7. Portada SVG (mismo sistema visual que public/covers/*.svg)
# ==========================================================================

_ARO = 'fill="none" stroke="#C9CED6" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"'
_ORO = 'fill="none" stroke="#E5C158" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"'

_MOTIVOS = {
    "Laboral": f'<g {_ARO}><rect x="420" y="150" width="200" height="340" rx="12"/><circle cx="580" cy="325" r="9" fill="#C9CED6"/><path d="M690 320h210M860 278l42 42-42 42" stroke="#E5C158"/></g>',
    "ART": f'<g {_ARO}><path d="M430 360a170 170 0 0 1 340 0z"/><rect x="395" y="360" width="410" height="44" rx="14"/><path d="M600 190v170"/><path d="M880 270v110M825 325h110" stroke="#E5C158"/></g>',
    "Penal": f'<g {_ARO}><rect x="440" y="140" width="270" height="350" rx="20"/><path d="M485 215h180M485 265h180M485 315h120"/><circle cx="775" cy="420" r="80" stroke="#E5C158"/><path d="M775 368v52l36 24" stroke="#E5C158"/></g>',
    "Familia": f'<g {_ARO}><rect x="440" y="160" width="270" height="310" rx="20"/><path d="M440 235H710M510 135v50M640 135v50"/><path d="M490 290h30M565 290h30M640 290h30M490 350h30M565 350h30M640 350h30M490 410h30M565 410h30"/><circle cx="770" cy="430" r="62" stroke="#E5C158"/><circle cx="770" cy="430" r="43" stroke="#E5C158" stroke-opacity="0.45"/></g>',
    "Sucesiones": f'<g {_ARO}><circle cx="600" cy="180" r="36"/><path d="M600 216v60M600 276H430v40M600 276v40M600 276H770v40"/><circle cx="430" cy="350" r="32"/><circle cx="600" cy="350" r="32" stroke="#E5C158"/><circle cx="770" cy="350" r="32"/><path d="M430 382v50M770 382v50"/><circle cx="430" cy="460" r="26"/><circle cx="770" cy="460" r="26"/></g>',
    "Discapacidad": f'<g {_ARO}><path d="M600 130l150 52v112c0 110-62 170-150 200-88-30-150-90-150-200V182z" stroke="#E5C158"/><path d="M535 305l48 48 90-102" stroke="#E5C158"/><rect x="800" y="250" width="150" height="200" rx="14"/><path d="M830 300h90M830 340h90M830 380h60"/></g>',
    "Tránsito": f'<g {_ARO}><path d="M400 330l35-65c6-11 17-18 30-18h110c13 0 24 7 30 18l35 65"/><rect x="355" y="330" width="330" height="65" rx="16"/><circle cx="430" cy="415" r="32"/><circle cx="610" cy="415" r="32"/><circle cx="430" cy="415" r="10" fill="#C9CED6"/><circle cx="610" cy="415" r="10" fill="#C9CED6"/></g><g {_ORO}><path d="M806 338v-40a38 38 0 0 1 76 0v40"/><rect x="778" y="338" width="132" height="110" rx="18"/></g>',
    "Consumidor": f'<g {_ARO}><rect x="430" y="130" width="200" height="360" rx="32"/><path d="M500 165h60"/><circle cx="530" cy="455" r="10"/><path d="M770 190l115 40v88c0 82-50 128-115 150-65-22-115-68-115-150v-88z" stroke="#E5C158"/><path d="M715 330l38 38 76-86" stroke="#E5C158"/></g>',
}
_MOTIVO_DEFECTO = _MOTIVOS["Penal"]


def generar_portada_svg(slug: str, materia: str, titulo: str) -> str:
    """Portada 1200x630 con el sistema visual de las existentes (fondo oscuro, trazo plata y oro)."""
    etiqueta = re.sub(r"[<>&\"]", "", (titulo.split(":")[0] if len(titulo) > 60 else titulo))[:60]
    motivo = _MOTIVOS.get(materia, _MOTIVO_DEFECTO)
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" role="img" aria-label="' + etiqueta + '">\n'
        "<defs>\n"
        '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#101622"/><stop offset="1" stop-color="#07090C"/></linearGradient>\n'
        '<radialGradient id="glow" cx="75%" cy="25%" r="60%"><stop offset="0" stop-color="#E5C158" stop-opacity="0.25"/><stop offset="1" stop-color="#E5C158" stop-opacity="0"/></radialGradient>\n'
        '<pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="#C9CED6" stroke-opacity="0.06"/></pattern>\n'
        "</defs>\n"
        '<rect width="1200" height="630" fill="url(#bg)"/>\n'
        '<rect width="1200" height="630" fill="url(#grid)"/>\n'
        '<rect width="1200" height="630" fill="url(#glow)"/>\n'
        f"{motivo}\n"
        '<text x="64" y="574" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="700" letter-spacing="8" '
        'fill="#C9CED6" fill-opacity="0.55">VINDEX LEGAL</text>\n'
        "</svg>\n"
    )


# ==========================================================================
# 8. llms.txt
# ==========================================================================

SECCION_LLMS = "## Guías y tips recientes"


def actualizar_llms(texto: str, entradas: list[tuple[str, str, str]]) -> tuple[str, bool]:
    """Agrega entradas (titulo, url, descripcion) a `## Guías y tips recientes` de forma idempotente.

    La sección se crea antes de `## Aclaración` si no existe. Las más nuevas van arriba.
    Devuelve (texto_nuevo, hubo_cambios).
    """
    nuevas = [e for e in entradas if f"]({e[1]})" not in texto]
    if not nuevas:
        return texto, False
    lineas = [f"- [{t.replace(chr(91), '(').replace(chr(93), ')')}]({u}): {d.strip().rstrip('.')}." for t, u, d in nuevas]
    if SECCION_LLMS in texto:
        return texto.replace(SECCION_LLMS + "\n\n", SECCION_LLMS + "\n\n" + "\n".join(lineas) + "\n", 1), True
    bloque = SECCION_LLMS + "\n\n" + "\n".join(lineas) + "\n\n"
    if "## Aclaración" in texto:
        return texto.replace("## Aclaración", bloque + "## Aclaración", 1), True
    return texto.rstrip("\n") + "\n\n" + bloque.rstrip("\n") + "\n", True


# ==========================================================================
# 9. Escritura (solo la usa el publicador)
# ==========================================================================


def escribir_pieza(b: Borrador) -> list[Path]:
    carpeta = C.BLOG_DIR if b.formato == "blog" else C.TIPS_DIR
    destino = carpeta / f"{b.slug}.md"
    if destino.exists():
        raise FileExistsError(f"{destino} ya existe: el motor nunca sobrescribe contenido.")
    destino.write_text(b.archivo_md, encoding="utf-8")
    escritos = [destino]
    if b.formato == "blog":
        portada = C.COVERS_DIR / f"{b.slug}.svg"
        if not portada.exists():
            portada.write_text(generar_portada_svg(b.slug, b.materia, b.titulo), encoding="utf-8")
            escritos.append(portada)
    return escritos
