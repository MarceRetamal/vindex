// Conversor de Markdown a HTML, escrito a medida para el blog de VINDEX.
// No usa librerías externas: menos dependencias, menos cosas que se rompan.
//
// Sintaxis soportada en los archivos .md de src/content/blog:
//   ## Título de sección        -> subtítulo (numerado y con ancla automática)
//   Texto separado por          -> párrafos
//   una línea en blanco
//   - item                      -> lista con viñetas
//   1. item                     -> lista numerada
//   > texto                     -> cita de un fallo o norma (se destaca en un recuadro)
//   !! texto                    -> dato clave (se destaca en un recuadro con acento dorado)
//   **negrita**                 -> negrita
//   *cursiva*                   -> cursiva
//   [texto](/ruta)              -> enlace

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inline(text: string): string {
  let out = escapeHtml(text)

  // Enlaces: [texto](destino)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, href: string) => {
    const safeHref = href.trim()
    const isExternal = /^https?:\/\//i.test(safeHref)
    const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${safeHref}"${attrs}>${label.trim()}</a>`
  })

  // Negrita y cursiva
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')

  return out
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
}

// Ícono minimalista para el recuadro de "dato clave" — un asterisco geométrico,
// dibujado a mano en SVG, nada de emojis ni de librerías de íconos.
const CALLOUT_ICON =
  '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<path d="M10 2v16M3.5 5.5l13 9M16.5 5.5l-13 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
  '</svg>'

type Block =
  | { kind: 'h2'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ul' | 'ol'; items: string[] }
  | { kind: 'quote'; text: string }
  | { kind: 'callout'; text: string }

export type Heading = { id: string; texto: string }

export function renderArticle(markdown: string): { html: string; headings: Heading[] } {
  const rawBlocks = markdown
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)

  const blocks: Block[] = []

  for (const raw of rawBlocks) {
    const bulletMatch = raw.match(/^[-*][ \t]+([\s\S]*)$/)
    const numberMatch = raw.match(/^\d+\.[ \t]+([\s\S]*)$/)
    const quoteMatch = raw.match(/^>[ \t]?([\s\S]*)$/)
    const calloutMatch = raw.match(/^!!\s*([\s\S]*)$/)
    const previous = blocks[blocks.length - 1]

    if (raw.startsWith('## ')) {
      blocks.push({ kind: 'h2', text: raw.slice(3).trim() })
      continue
    }

    if (calloutMatch) {
      blocks.push({ kind: 'callout', text: calloutMatch[1].trim() })
      continue
    }

    if (quoteMatch) {
      blocks.push({ kind: 'quote', text: quoteMatch[1].trim() })
      continue
    }

    if (bulletMatch) {
      const item = bulletMatch[1].trim()
      if (previous && previous.kind === 'ul') previous.items.push(item)
      else blocks.push({ kind: 'ul', items: [item] })
      continue
    }

    if (numberMatch) {
      const item = numberMatch[1].trim()
      if (previous && previous.kind === 'ol') previous.items.push(item)
      else blocks.push({ kind: 'ol', items: [item] })
      continue
    }

    blocks.push({ kind: 'p', text: raw.replace(/\n/g, ' ') })
  }

  const headings: Heading[] = []
  const usedIds = new Set<string>()
  let sectionNumber = 0

  const html = blocks
    .map((block) => {
      switch (block.kind) {
        case 'h2': {
          sectionNumber += 1
          let id = slugify(block.text) || `seccion-${sectionNumber}`
          while (usedIds.has(id)) id = `${id}-${sectionNumber}`
          usedIds.add(id)
          headings.push({ id, texto: block.text })
          const badge = String(sectionNumber).padStart(2, '0')
          return `<h2 id="${id}"><span class="vindex-h2-badge" aria-hidden="true">${badge}</span>${inline(block.text)}</h2>`
        }
        case 'ul':
          return `<ul>${block.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`
        case 'ol':
          return `<ol>${block.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ol>`
        case 'quote':
          return `<blockquote class="vindex-blockquote">${inline(block.text)}</blockquote>`
        case 'callout':
          return `<div class="vindex-callout">${CALLOUT_ICON}<p>${inline(block.text)}</p></div>`
        default:
          return `<p>${inline(block.text)}</p>`
      }
    })
    .join('\n')

  return { html, headings }
}

export function countWords(markdown: string): number {
  return markdown.split(/\s+/).filter(Boolean).length
}
