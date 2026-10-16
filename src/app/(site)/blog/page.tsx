import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Cover } from '@/components/blog/Cover'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Card } from '@/components/ui/Card'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatearFecha, obtenerNotas } from '@/lib/blog'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: 'Blog Jurídico — Guías legales claras',
  description:
    'Guías sobre familia, laboral, accidentes, discapacidad, penal y sucesiones en La Plata y la Provincia de Buenos Aires, escritas por un abogado matriculado.',
  path: '/blog',
})

export default function BlogPage() {
  const notas = obtenerNotas()

  return (
    <PageShell>
      <Breadcrumbs items={[{ name: 'Blog' }]} />

      <PageIntro
        eyebrow="Blog jurídico"
        title="Respuestas claras a problemas legales reales."
        description="Guías escritas por un abogado matriculado sobre las situaciones que más consultas generan. Información general para orientarte antes de decidir."
      />

      <div className="mt-16 md:mt-24">
        {notas.length === 0 ? (
          <EmptyState
            title="Estamos preparando las primeras guías."
            description="Mientras tanto, podés contarnos tu caso y te respondemos en un plazo máximo de 24 horas hábiles."
          />
        ) : (
          <StaggerFadeIn stagger={0.1}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {notas.map((nota) => (
                <Card
                  key={nota.slug}
                  as="h2"
                  media={nota.imagen ? <Cover src={nota.imagen} /> : undefined}
                  eyebrow={`${nota.materia} · ${formatearFecha(nota.fecha)}`}
                  title={nota.titulo}
                  description={nota.copete}
                  footer={
                    <Link
                      href={`/blog/${nota.slug}`}
                      className="text-[14px] font-semibold text-(--accent) underline-offset-4 hover:underline"
                    >
                      Leer la guía completa<span className="sr-only">: {nota.titulo}</span>
                    </Link>
                  }
                />
              ))}
            </div>
          </StaggerFadeIn>
        )}
      </div>

      <div className="mt-20 md:mt-32">
        <PageCta
          title="Leer orienta. Una consulta resuelve."
          description="Si tu situación necesita algo más que información general, contanos tu caso y te decimos qué podés hacer."
          buttonHref="/evaluacion"
          buttonLabel="Contar mi caso"
        />
      </div>
    </PageShell>
  )
}
