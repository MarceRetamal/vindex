import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const TONOS = {
  error: { caja: 'bg-red-500/10 border border-red-500/20', texto: 'text-red-400 font-medium', role: 'alert' },
  info: { caja: 'border border-[var(--accent-mute)] bg-[var(--accent-mute)]/10', texto: 'text-[var(--text-secondary)]', role: 'status' },
} as const

/**
 * Mensaje en línea. `error` usa role="alert" (los lectores de pantalla lo leen
 * en cuanto aparece); `info` usa role="status" (se lee sin interrumpir).
 * Renderizalo solo cuando hay mensaje, para que el anuncio se dispare.
 */
export function Alert({
  tone = 'error',
  title,
  children,
  className,
}: {
  tone?: keyof typeof TONOS
  title?: ReactNode
  children: ReactNode
  className?: string
}) {
  const t = TONOS[tone]
  return (
    <div role={t.role} className={cn('rounded-[10px] p-4', t.caja, className)}>
      {title ? <p className="mb-1 text-[14px] font-semibold text-[var(--accent-bright)]">{title}</p> : null}
      <div className={cn('text-[14px]', t.texto)}>{children}</div>
    </div>
  )
}
