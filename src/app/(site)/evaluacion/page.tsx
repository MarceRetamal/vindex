import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { EvaluationForm } from '@/components/forms/EvaluationForm'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Card } from '@/components/ui/Card'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Contanos tu caso | Consulta jurídica en La Plata',
  description:
    'Contanos qué pasó y te decimos qué podés hacer. Consulta confidencial con respuesta en un plazo máximo de 24 horas hábiles. La Plata y provincia.',
  path: '/evaluacion',
})

const steps = [
  {
    eyebrow: '01',
    title: 'Nos contás tu caso',
    description: 'Con tus palabras, sin tecnicismos. Alcanza con lo básico.',
  },
  {
    eyebrow: '02',
    title: 'Lo revisamos',
    description: 'Vemos qué opciones tenés, qué plazos corren y qué documentación conviene reunir.',
  },
  {
    eyebrow: '03',
    title: 'Te llamamos',
    description: 'En un plazo máximo de 24 horas hábiles te explicamos cómo seguir.',
  },
]

export default function EvaluacionPage() {
  return (
    <PageShell>
      <Breadcrumbs items={[{ name: 'Contanos tu caso' }]} />

      <PageIntro
        eyebrow="Consulta jurídica"
        title="Contanos qué pasó. Te decimos qué podés hacer."
        description="Tu consulta es confidencial. Respondemos en un plazo máximo de 24 horas hábiles."
      />

      <div className="mt-16 md:mt-24 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-start">
        <StaggerFadeIn>
          <div className="grid gap-6">
            <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-2">
              Cómo sigue
            </h3>
            {steps.map((step) => (
              <Card
                as="h2"
                key={step.title}
                eyebrow={step.eyebrow}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </StaggerFadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-5">
            <div className="rounded-[20px] border border-[var(--accent)]/10 bg-[var(--accent)]/5 p-6 mb-6">
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--accent-bright)] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                Confidencialidad
              </p>
              <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                Lo que contás está protegido por el secreto profesional. Cuanto más claro sea lo que pasó, mejor
                podemos orientarte.
              </p>
            </div>
            <EvaluationForm />
          </div>
        </FadeIn>
      </div>
    </PageShell>
  )
}
