/**
 * "Saltar al contenido": primer elemento enfocable de cada página. Invisible
 * hasta que se navega con teclado; evita recorrer todo el menú en cada página.
 */
export function SkipLink({ href = '#contenido' }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--bg-deep)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110]"
    >
      Saltar al contenido
    </a>
  )
}
