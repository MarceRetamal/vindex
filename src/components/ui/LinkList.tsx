import Link from 'next/link'
import type { ReactNode } from 'react'

export type LinkListItem = { href: string; texto: string; /** Texto chico al lado del enlace (ej.: la fecha). */ extra?: ReactNode }

// Lista de enlaces subrayados que se usa en los bloques de "contenido
// relacionado" (notas, tips y páginas de área).
export function LinkList({ items, className }: { items: LinkListItem[]; className: string }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="text-[15px] font-medium text-[var(--text-primary)] underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
          >
            {item.texto}
          </Link>
          {item.extra}
        </li>
      ))}
    </ul>
  )
}
