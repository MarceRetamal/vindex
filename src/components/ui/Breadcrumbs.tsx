import Link from 'next/link'

const baseUrl = 'https://vindexlegal.com.ar'

export type Crumb = { name: string; href?: string }

// Migas de pan visibles + datos estructurados (BreadcrumbList) para Google.
// "Inicio" se agrega solo. El último elemento es la página actual (sin enlace).
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const todas: Crumb[] = [{ name: 'Inicio', href: '/' }, ...items]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: todas.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${baseUrl}${c.href === '/' ? '' : c.href}` } : {}),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Migas de pan" className="mb-6 md:mb-8">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] md:text-xs">
          {todas.map((c, i) => {
            const esUltima = i === todas.length - 1
            return (
              <li key={`${c.name}-${i}`} className="flex items-center gap-2">
                {c.href && !esUltima ? (
                  <Link href={c.href} className="transition-colors hover:text-white">
                    {c.name}
                  </Link>
                ) : (
                  <span
                    aria-current={esUltima ? 'page' : undefined}
                    className="inline-block max-w-[34ch] truncate align-bottom text-[var(--text-secondary)] sm:max-w-[56ch]"
                  >
                    {c.name}
                  </span>
                )}
                {!esUltima ? (
                  <span aria-hidden className="text-[var(--vindex-silver-deep)]">
                    ›
                  </span>
                ) : null}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
