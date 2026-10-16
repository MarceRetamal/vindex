import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/Eyebrow'

/**
 * Pantalla de estado a página completa (404, error inesperado). Va dentro
 * del <main> del sitio, por eso es un <div>. `actions` recibe botones
 * (<Button>), y siempre conviene incluir una salida al inicio.
 */
export function StatusPage({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string
  title: string
  description: ReactNode
  actions: ReactNode
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[1200px] items-center px-5 py-24 md:px-8 md:py-32">
      <div className="max-w-3xl space-y-6">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl">{title}</h1>
        <p className="max-w-2xl text-[15px] leading-7 text-[var(--text-secondary)] md:text-lg md:leading-8">{description}</p>
        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:gap-4">{actions}</div>
      </div>
    </div>
  )
}
