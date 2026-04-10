'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[1200px] items-center px-5 py-24 md:px-8 md:py-32">
      <div className="max-w-3xl space-y-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)] md:text-xs">
          Error de ejecución
        </p>

        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl">
          Ocurrió un problema inesperado en esta sección.
        </h1>

        <p className="max-w-2xl text-[15px] leading-7 text-[var(--text-secondary)] md:text-lg md:leading-8">
          La interfaz no pudo renderizar correctamente este segmento. Podés
          reintentar o volver al inicio.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex whitespace-nowrap items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-[var(--bg)] transition-all duration-300 hover:bg-[var(--accent-hover)]"
          >
            Reintentar
          </button>

          <Link
            href="/"
            className="inline-flex whitespace-nowrap items-center justify-center rounded-lg border border-[var(--border)] px-5 py-3.5 text-sm font-semibold text-[var(--text-primary)] transition-all duration-300 hover:border-white/10 hover:bg-[var(--surface-1)]"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}