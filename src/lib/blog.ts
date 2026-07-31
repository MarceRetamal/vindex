import fs from 'node:fs'
import path from 'node:path'
import { countWords, renderArticle, type Heading } from '@/lib/markdown'

// Todas las notas del blog viven en src/content/blog como archivos .md.
// Para publicar una nota nueva alcanza con crear un archivo ahí: el listado,
// la página de la nota y el sitemap se arman solos a partir de esa carpeta.

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'blog')

export type Nota = {
  slug: string
  titulo: string
  descripcion: string
  copete: string
  materia: string
  fecha: string
  actualizado: string
  minutos: number
  resumen: string[]
  borrador: boolean
}

export type NotaCompleta = Nota & { html: string; headings: Heading[] }

function parseFrontmatter(fileContent: string): {
  datos: Record<string, string>
  resumen: string[]
  cuerpo: string
} {
  const normalized = fileContent.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n')
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)

  if (!match) return { datos: {}, resumen: [], cuerpo: normalized.trim() }

  const lines = match[1].split('\n')
  const datos: Record<string, string> = {}
  const resumen: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Campo "resumen:" seguido de líneas "- punto" indentadas: la única
    // excepción de varias líneas dentro del encabezado.
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
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      datos[pair[1].trim().toLowerCase()] = value
    }
    i += 1
  }

  return { datos, resumen, cuerpo: match[2].trim() }
}

function leerArchivo(fileName: string): NotaCompleta | null {
  const slug = fileName.replace(/\.md$/, '')
  const fileContent = fs.readFileSync(path.join(CONTENT_DIR, fileName), 'utf8')
  const { datos, resumen, cuerpo } = parseFrontmatter(fileContent)

  if (!datos.titulo || !cuerpo) return null

  const fecha = datos.fecha || new Date().toISOString().slice(0, 10)
  const { html, headings } = renderArticle(cuerpo)

  return {
    slug,
    titulo: datos.titulo,
    descripcion: datos.descripcion || datos.copete || '',
    copete: datos.copete || datos.descripcion || '',
    materia: datos.materia || 'General',
    fecha,
    actualizado: datos.actualizado || fecha,
    minutos: Math.max(1, Math.round(countWords(cuerpo) / 170)),
    resumen,
    borrador: String(datos.borrador || '').toLowerCase() === 'si',
    html,
    headings,
  }
}

function leerTodas(): NotaCompleta[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map(leerArchivo)
    .filter((n): n is NotaCompleta => n !== null)
    .filter((n) => !n.borrador)
    .sort((a, b) => (a.fecha === b.fecha ? a.titulo.localeCompare(b.titulo) : b.fecha.localeCompare(a.fecha)))
}

export function obtenerNotas(): Nota[] {
  return leerTodas().map(({ html: _html, headings: _headings, ...resto }) => resto)
}

export function obtenerNota(slug: string): NotaCompleta | undefined {
  return leerTodas().find((n) => n.slug === slug)
}

export function formatearFecha(iso: string): string {
  return new Date(`${iso}T12:00:00-03:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
