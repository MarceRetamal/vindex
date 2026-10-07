// Este script corre UNA SOLA VEZ, antes de cada build (ver package.json),
// en un Node.js normal que sí tiene acceso al disco. Lee las notas del blog
// (src/content/blog/*.md) y los tips jurídicos (src/content/tips/*.md), los
// procesa por completo (fecha, resumen, HTML, índice de subtítulos) y guarda
// el resultado en dos archivos:
//
//     src/content/blog.generated.json
//     src/content/tips.generated.json
//
// Next.js importa esos JSON como si fueran código — no como archivos que
// hay que leer en el momento. Así el sitio funciona igual en cualquier
// lugar donde se lo despliegue, sin depender de que ese entorno tenga
// acceso a un disco (Cloudflare Workers no lo tiene).
//
// PORTADAS: si existe un archivo public/covers/<slug-de-la-nota>.<ext>
// (webp, avif, jpg, jpeg, png o svg), la nota lo usa solo como portada.
// Si subís después una imagen .webp o .jpg con el mismo nombre, reemplaza
// automáticamente a la versión .svg.
//
// No hace falta tocar este archivo para publicar una nota o un tip nuevo:
// se ejecuta solo, automáticamente, en cada "npm run build" / "npm run dev".

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { countWords, renderArticle } from './markdown.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.join(__dirname, '..')
const BLOG_DIR = path.join(RAIZ, 'src', 'content', 'blog')
const TIPS_DIR = path.join(RAIZ, 'src', 'content', 'tips')
const BLOG_OUT = path.join(RAIZ, 'src', 'content', 'blog.generated.json')
const TIPS_OUT = path.join(RAIZ, 'src', 'content', 'tips.generated.json')
const PORTADAS_DIR = path.join(RAIZ, 'public', 'covers')
const EXTENSIONES_PORTADA = ['webp', 'avif', 'jpg', 'jpeg', 'png', 'svg']

function parseFrontmatter(fileContent) {
  const normalized = fileContent.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) return { datos: {}, resumen: [], cuerpo: normalized.trim() }

  const lines = match[1].split('\n')
  const datos = {}
  const resumen = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (/^resumen:\s*$/.test(line)) {
      i += 1
      while (i < lines.length) {
        const item = lines[i].match(/^\s*-\s+(.*)$/)
        if (!item) break
        resumen.push(item[1].trim())
        i += 1
      }
      continue
    }
    const pair = line.match(/^([a-zA-ZáéíóúñÁÉÍÓÚÑ_]+)\s*:\s*(.*)$/)
    if (pair) {
      let value = pair[2].trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      datos[pair[1].trim().toLowerCase()] = value
    }
    i += 1
  }

  return { datos, resumen, cuerpo: match[2].trim() }
}

function buscarPortada(slug) {
  for (const ext of EXTENSIONES_PORTADA) {
    if (fs.existsSync(path.join(PORTADAS_DIR, `${slug}.${ext}`))) return `/covers/${slug}.${ext}`
  }
  return ''
}

// Lee todos los .md de una carpeta y devuelve solo los publicables.
function leerCarpeta(dir, etiqueta) {
  if (!fs.existsSync(dir)) {
    console.warn(`[build-content] No existe ${dir}; se genera una lista vacía de ${etiqueta}.`)
    return []
  }

  const archivos = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const items = []

  for (const fileName of archivos) {
    const slug = fileName.replace(/\.md$/, '')
    const fileContent = fs.readFileSync(path.join(dir, fileName), 'utf8')
    const { datos, resumen, cuerpo } = parseFrontmatter(fileContent)

    if (!datos.titulo || !cuerpo) {
      console.warn(`[build-content] Se omite ${fileName}: falta título o cuerpo.`)
      continue
    }

    const esBorrador = String(datos.borrador || '').toLowerCase() === 'si'
    if (esBorrador) continue

    const fecha = datos.fecha || new Date().toISOString().slice(0, 10)
    const { html, headings } = renderArticle(cuerpo)

    items.push({ slug, datos, resumen, cuerpo, fecha, html, headings })
  }

  items.sort((a, b) => {
    if (a.fecha === b.fecha) return a.datos.titulo.localeCompare(b.datos.titulo)
    return b.fecha.localeCompare(a.fecha)
  })

  return items
}

function generar() {
  // ---- BLOG ----
  const notas = leerCarpeta(BLOG_DIR, 'notas').map(({ slug, datos, resumen, cuerpo, fecha, html, headings }) => ({
    slug,
    titulo: datos.titulo,
    tituloSeo: datos.titulo_seo || '',
    descripcion: datos.descripcion || datos.copete || '',
    copete: datos.copete || datos.descripcion || '',
    materia: datos.materia || 'General',
    fecha,
    actualizado: datos.actualizado || fecha,
    minutos: Math.max(1, Math.round(countWords(cuerpo) / 170)),
    imagen: buscarPortada(slug),
    resumen,
    html,
    headings,
  }))

  fs.writeFileSync(BLOG_OUT, JSON.stringify(notas, null, 2) + '\n', 'utf8')
  console.log(`[build-content] ${notas.length} nota(s) generada(s) en src/content/blog.generated.json`)

  // ---- TIPS ----
  const tips = leerCarpeta(TIPS_DIR, 'tips').map(({ slug, datos, resumen, cuerpo, fecha, html }) => ({
    slug,
    titulo: datos.titulo,
    descripcion: datos.descripcion || '',
    categoria: datos.categoria || 'General',
    fecha,
    actualizado: datos.actualizado || fecha,
    minutos: Math.max(1, Math.round(countWords(cuerpo) / 170)),
    resumen,
    html,
  }))

  fs.writeFileSync(TIPS_OUT, JSON.stringify(tips, null, 2) + '\n', 'utf8')
  console.log(`[build-content] ${tips.length} tip(s) generado(s) en src/content/tips.generated.json`)
}

generar()
