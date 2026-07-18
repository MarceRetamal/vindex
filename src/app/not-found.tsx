import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-[1200px] items-center px-5 py-24 md:px-8 md:py-32">
      <div className="max-w-3xl space-y-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)] md:text-xs">
          Error 404
        </p>

        <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-6xl">
          La página solicitada no existe o no está disponible.
        </h1>

        <p className="max-w-2xl text-[15px] leading-7 text-[var(--text-secondary)] md:text-lg md:leading-8">
          El recurso que intentaste abrir no forma parte de la estructura actual
          de VINDEX LEGAL o fue desplazado dentro del sistema.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex whitespace-nowrap items-center justify-center rounded-lg bg-[var(--accent)] px-5 py-3.5 text-sm font-semibold text-[var(--bg)] transition-all duration-300 hover:bg-[var(--accent-hover)]"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  )
}