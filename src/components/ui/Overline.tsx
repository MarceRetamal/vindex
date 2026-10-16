import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Rótulo chico en mayúsculas plateadas que encabeza un bloque
 * ("Guía completa", "Sobre el autor", "Otras áreas").
 *
 * Diferencia con <Eyebrow>: Eyebrow es el rótulo de una página o sección
 * (crece en escritorio). Overline acompaña bloques internos y mantiene su
 * tamaño salvo que se agregue `md:text-xs` en `className`.
 *
 * `as="span"` lo vuelve usable dentro de enlaces y otros elementos en línea.
 */
export function Overline({
  children,
  className,
  as: Tag = 'p',
}: {
  children: ReactNode
  className?: string
  as?: 'p' | 'span'
}) {
  return (
    <Tag className={cn('text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)]', className)}>
      {children}
    </Tag>
  )
}
