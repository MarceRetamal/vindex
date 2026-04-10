import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { EvaluationForm } from '@/components/forms/EvaluationForm'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Card } from '@/components/ui/Card'
import { PageBlock } from '@/components/ui/PageBlock'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Evaluación jurídica',
  description:
    'Revisión preliminar de admisibilidad y encuadre del conflicto.',
})

const steps = [
  {
    eyebrow: '01',
    title: 'Recepción inicial',
    description:
      'Se ordena el encuadre básico del caso, su estado actual y la existencia de mediación, intimaciones o plazos urgentes.',
  },
  {
    eyebrow: '02',
    title: 'Revisión técnica',
    description:
      'Se analiza la admisibilidad de la consulta y si el escenario admite una intervención estratégica.',
  },
  {
    eyebrow: '03',
    title: 'Posicionamiento',
    description:
      'Si corresponde avanzar, se estipula la arquitectura de intervención legal y la proyección del conflicto.',
  },
]

export default function EvaluacionPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Evaluación jurídica"
        title="El primer paso no es actuar. Es ordenar el escenario táctico."
        description="VINDEX procesa este intake preliminar asegurando confidencialidad absoluta para determinar vías de asedio legal o contención defensiva."
      />

      <div className="mt-16 md:mt-24 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] items-start">
        <StaggerFadeIn>
          <div className="grid gap-6">
            <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-2">Protocolo Inicial</h3>
            {steps.map((step) => (
              <Card
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
                Requerimiento Crítico
              </p>
              <p className="text-[14px] leading-relaxed text-[var(--text-secondary)]">
                Todo campo del formulario es auditable. La veracidad en la descripción del "Statu Quo" define la precisión de nuestra arquitectura probatoria. Sea sintético pero directo.
              </p>
            </div>
            <EvaluationForm />
          </div>
        </FadeIn>
      </div>
    </PageShell>
  )
}