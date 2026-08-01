// Copia funcional de src/lib/markdown.ts, en JavaScript plano y sin tipos,
// para que el script de generación (scripts/build-content.mjs) la pueda
// ejecutar directamente con Node, sin pasar por el compilador de TypeScript.
//
// Si el día de mañana cambia la sintaxis del blog (##, !!, >, etc.), el
// cambio se hace acá Y en src/lib/markdown.ts (que ya no corre en el
// servidor, pero se deja documentado ahí para referencia).

function escapeHtml(input) {
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inline(text) {
  let out = escapeHtml(text)
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, href) => {
    const safeHref = href.trim()
    const isExternal = /^https?:\/\//i.test(safeHref)
    const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${safeHref}"${attrs}>${label.trim()}</a>`
  })
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  return out
}

export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-+|-+$)/g, '')
}

const CALLOUT_ICON =
  '<svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
  '<path d="M10 2v16M3.5 5.5l13 9M16.5 5.5l-13 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
  '</svg>'

export function renderArticle(markdown) {
  const rawBlocks = markdown
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)

  const blocks = []

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

  const headings = []
  const usedIds = new Set()
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

export function countWords(markdown) {
  return markdown.split(/\s+/).filter(Boolean).length
}
