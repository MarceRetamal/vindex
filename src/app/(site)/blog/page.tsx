import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Card } from '@/components/ui/Card'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'
import { formatearFecha, obtenerNotas } from '@/lib/blog'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: 'Blog Jurídico — Guías legales claras',
  description:
    'Guías sobre derecho penal, sucesiones, familia, consumidor y discapacidad en La Plata y la Provincia de Buenos Aires, escritas por un abogado matriculado. Sin jerga innecesaria.',
  path: '/blog',
})

export default function BlogPage() {
  const notas = obtenerNotas()

  return (
    <PageShell>
      <PageIntro
        eyebrow="Blog Jurídico VINDEX"
        title="Respuestas claras a problemas legales reales."
        description="Guías escritas por un abogado matriculado sobre las situaciones que más consultas generan en La Plata y la Provincia de Buenos Aires. Información general para orientarse antes de decidir."
      />

      <div className="mt-16 md:mt-24">
        <StaggerFadeIn stagger={0.1}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notas.map((nota) => (
              <Card
                key={nota.slug}
                eyebrow={`${nota.materia} · ${formatearFecha(nota.fecha)}`}
                title={nota.titulo}
                description={nota.copete}
                footer={
                  <Link
                    href={`/blog/${nota.slug}`}
                    className="text-[14px] font-semibold text-(--accent) underline-offset-4 hover:underline"
                  >
                    Leer la guía completa
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
