import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Título de bloque dentro de una página ("Qué hacer primero", "Preguntas
 * frecuentes"). Es un h2 por defecto: respetá el orden h1 → h2 → h3 y usá
 * `as="h3"` solo si el bloque está dentro de otro que ya tiene su h2.
 */
export function SectionTitle({
  children,
  className,
  as: Tag = 'h2',
}: {
  children: ReactNode
  className?: string
  as?: 'h2' | 'h3'
}) {
  return (
    <Tag className={cn('text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]', className)}>
      {children}
    </Tag>
  )
}
