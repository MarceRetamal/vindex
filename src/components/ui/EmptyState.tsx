import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { Overline } from '@/components/ui/Overline'

/**
 * Estado vacío: lo que se muestra cuando un listado no tiene elementos
 * (por ejemplo, si todas las notas quedan en borrador). Siempre ofrece una
 * salida, para que la persona no quede en una página sin acciones.
 */
export function EmptyState({
  overline,
  title,
  description,
  action,
}: {
  overline?: string
  title: string
  description?: ReactNode
  /** Botón de salida. Por defecto, el formulario de consulta. */
  action?: { href: string; label: string } | null
}) {
  const accion = action === undefined ? { href: '/evaluacion', label: 'Contar mi caso' } : action

  return (
    <div data-glass className="glass rounded-[24px] p-6 md:p-10" role="status">
      {overline ? <Overline className="mb-3 md:text-xs">{overline}</Overline> : null}
      <p className="text-xl font-bold leading-tight text-white md:text-2xl">{title}</p>
      {description ? (
        <p className="mt-3 max-w-[60ch] text-[15px] leading-7 text-[var(--text-secondary)] md:text-base">{description}</p>
      ) : null}
      {accion ? (
        <div className="mt-6">
          <Button href={accion.href}>{accion.label}</Button>
        </div>
      ) : null}
    </div>
  )
}
