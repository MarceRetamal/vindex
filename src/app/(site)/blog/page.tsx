import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Card } from '@/components/ui/Card'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'
import { articles } from '@/data/articles'

export const metadata: Metadata = buildMetadata({
  title: 'Blog Jurídico — Guías legales claras',
  description:
    'Guías sobre derecho penal, sucesiones y derecho laboral en La Plata y la Provincia de Buenos Aires, escritas por un abogado matriculado. Sin jerga innecesaria.',
  path: '/blog',
})

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00-03:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function BlogPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Blog Jurídico VINDEX"
        title="Respuestas claras a problemas legales reales."
        description="Guías escritas por un abogado matriculado sobre las situaciones que más consultas generan en La Plata y la Provincia de Buenos Aires: causas penales, sucesiones y conflictos laborales. Información general para orientarse antes de decidir."
      />

      <div className="mt-16 md:mt-24">
        <StaggerFadeIn stagger={0.1}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Card
                key={a.slug}
                eyebrow={`${a.pillarLabel} · ${formatDate(a.datePublished)}`}
                title={a.title}
                description={a.excerpt}
                footer={
                  <Link
                    href={`/blog/${a.slug}`}
                    className="text-[14px] font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
                  >
                    Leer la guía completa →
                  </Link>
                }
              />
            ))}
          </div>
        </StaggerFadeIn>
      </div>

      <div className="mt-20 md:mt-32">
        <PageCta
          title="Leer orienta. Un dictamen resuelve."
          description="Si su situación requiere más que información general, una evaluación preliminar confidencial define el encuadre real de su caso."
        />
      </div>
    </PageShell>
  )
}
