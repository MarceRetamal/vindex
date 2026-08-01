import type { Heading } from '@/lib/blog'

type Props = { headings: Heading[] }

// Cumple dos funciones a la vez: le muestra al lector, antes de leer una
// sola palabra, cuánto hay y de qué se trata cada parte (baja la ansiedad
// de "no sé cuánto falta"), y le permite saltar directo a la sección que
// le urge sin tener que escanear todo el texto.

export function TableOfContentsDesktop({ headings }: Props) {
  if (headings.length < 2) return null

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28">
        <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
          En esta nota
        </p>
        <nav className="vindex-toc border-l border-[var(--border-subtle)]">
          {headings.map((h, i) => (
            <a key={h.id} href={`#${h.id}`}>
              <span className="vindex-toc-num">{String(i + 1).padStart(2, '0')}</span>
              {h.texto}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export function TableOfContentsMobile({ headings }: Props) {
  if (headings.length < 2) return null

  return (
    <details className="vindex-toc-mobile lg:hidden">
      <summary>
        <span>En esta nota</span>
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <nav>
        {headings.map((h, i) => (
          <a key={h.id} href={`#${h.id}`}>
            <span className="vindex-toc-num">{String(i + 1).padStart(2, '0')}</span>
            {h.texto}
          </a>
        ))}
      </nav>
    </details>
  )
}
