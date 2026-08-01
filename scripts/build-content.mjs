// Este script corre UNA SOLA VEZ, antes de cada build (ver package.json),
// en un Node.js normal que sí tiene acceso al disco. Lee todas las notas de
// src/content/blog/*.md, las procesa por completo (fecha, resumen, HTML,
// índice de subtítulos) y guarda el resultado en un único archivo:
//
//     src/content/blog.generated.json
//
// Next.js importa ese JSON como si fuera código — no como un archivo que
// hay que leer en el momento. Así el sitio funciona igual en cualquier
// lugar donde se lo despliegue, sin depender de que ese entorno tenga
// acceso a un disco (Cloudflare Workers no lo tiene).
//
// No hace falta tocar este archivo para publicar una nota nueva: se
// ejecuta solo, automáticamente, en cada "npm run build" / "npm run dev".

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { countWords, renderArticle } from './markdown.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content', 'blog')
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'content', 'blog.generated.json')

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

function generar() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.warn(`[build-content] No existe ${CONTENT_DIR}; se genera un blog vacío.`)
    fs.writeFileSync(OUTPUT_FILE, '[]\n', 'utf8')
    return
  }

  const archivos = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'))
  const notas = []

  for (const fileName of archivos) {
    const slug = fileName.replace(/\.md$/, '')
    const fileContent = fs.readFileSync(path.join(CONTENT_DIR, fileName), 'utf8')
    const { datos, resumen, cuerpo } = parseFrontmatter(fileContent)

    if (!datos.titulo || !cuerpo) {
      console.warn(`[build-content] Se omite ${fileName}: falta título o cuerpo.`)
      continue
    }

    const esBorrador = String(datos.borrador || '').toLowerCase() === 'si'
    if (esBorrador) continue

    const fecha = datos.fecha || new Date().toISOString().slice(0, 10)
    const { html, headings } = renderArticle(cuerpo)

    notas.push({
      slug,
      titulo: datos.titulo,
      descripcion: datos.descripcion || datos.copete || '',
      copete: datos.copete || datos.descripcion || '',
      materia: datos.materia || 'General',
      fecha,
      actualizado: datos.actualizado || fecha,
      minutos: Math.max(1, Math.round(countWords(cuerpo) / 170)),
      resumen,
      html,
      headings,
    })
  }

  notas.sort((a, b) => (a.fecha === b.fecha ? a.titulo.localeCompare(b.titulo) : b.fecha.localeCompare(a.fecha)))

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(notas, null, 2) + '\n', 'utf8')
  console.log(`[build-content] ${notas.length} nota(s) generada(s) en src/content/blog.generated.json`)
}

generar()
