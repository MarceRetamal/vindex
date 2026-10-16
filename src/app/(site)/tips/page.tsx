import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { CATEGORIAS_TIPS, obtenerTips } from '@/lib/tips'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Card } from '@/components/ui/Card'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'
import { EmptyState } from '@/components/ui/EmptyState'
import { SectionTitle } from '@/components/ui/SectionTitle'

export const dynamic = 'force-static'

export const metadata: Metadata = buildMetadata({
  title: 'Tips jurídicos para el día a día',
  description:
    'Respuestas cortas sobre amparos de salud, IOMA, discapacidad, familia, accidentes de tránsito, despidos y ART. Leé el tip en un minuto.',
  path: '/tips',
})

export default function TipsPage() {
  const tips = obtenerTips()
  const categorias = CATEGORIAS_TIPS.filter((c) => tips.some((t) => t.categoria === c.nombre))

  return (
    <PageShell>
      <Breadcrumbs items={[{ name: 'Tips jurídicos' }]} />

      <PageIntro
        eyebrow="Tips jurídicos"
        title="Lo que conviene saber antes de que pase."
        description="Respuestas cortas para situaciones de todos los días. Cada tip se lee en un minuto."
      />

      <FadeIn delay={0.1}>
        <div className="mt-8 flex flex-wrap gap-2.5">
          {categorias.map((c) => (
            <a key={c.ancla} href={`#${c.ancla}`} data-glass className="glass glass-chip">
              {c.nombre}
            </a>
          ))}
        </div>
      </FadeIn>

      {categorias.length === 0 ? (
        <div className="mt-16">
          <EmptyState
            title="Todavía no hay tips publicados."
            description="Mientras tanto, podés contarnos tu caso y te respondemos en un plazo máximo de 24 horas hábiles."
          />
        </div>
      ) : null}

      {categorias.map((c) => {
        const items = tips.filter((t) => t.categoria === c.nombre)
        return (
          <section key={c.ancla} id={c.ancla} className="mt-16 scroll-mt-28 md:mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <SectionTitle>
                {c.nombre}
              </SectionTitle>
              <Link
                href={c.areaHref}
                className="text-[13px] font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
              >
                Ver el área<span className="sr-only"> de {c.nombre}</span> <span aria-hidden="true">→</span>
              </Link>
            </div>
            <StaggerFadeIn stagger={0.08}>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {items.map((t) => (
                  <Card
                    key={t.slug}
                    eyebrow={`${t.minutos} min`}
                    title={t.titulo}
                    description={t.descripcion}
                    footer={
                      <Link
                        href={`/tips/${t.slug}`}
                        className="text-[14px] font-semibold text-(--accent) underline-offset-4 hover:underline"
                      >
                        Leer el tip<span className="sr-only">: {t.titulo}</span>
                      </Link>
                    }
                  />
                ))}
              </div>
            </StaggerFadeIn>
          </section>
        )
      })}

      <div className="mt-20 md:mt-32">
        <PageCta
          eyebrow="Evaluación confidencial"
          title="¿Tu situación es una de estas?"
          description="Contanos qué pasó y te decimos qué podés hacer. Te respondemos en un plazo máximo de 24 horas hábiles."
          buttonHref="/evaluacion"
          buttonLabel="Contar mi caso"
        />
      </div>
    </PageShell>
  )
}
