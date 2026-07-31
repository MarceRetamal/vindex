import { FadeIn } from '@/components/motion/FadeIn'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'

export function Positioning() {
  return (
    <Section variant="soft" id="posicionamiento">
      <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-10">
        <FadeIn>
          <div className="space-y-3 md:space-y-4">
            <Eyebrow>Posicionamiento</Eyebrow>

            <h2 className="max-w-xl text-2xl font-extrabold leading-tight sm:text-3xl md:text-5xl">
              No intervenimos en cualquier conflicto. Intervenimos donde la
              improvisación cuesta caro.
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="space-y-5 md:space-y-6">
            <p className="max-w-2xl text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base md:text-lg md:leading-8">
              VINDEX actúa en escenarios jurídicos que exigen lectura estructural,
              evaluación rigurosa y capacidad real de intervención. Cuando el
              conflicto involucra riesgo, exposición o complejidad, la estrategia
              deja de ser opcional.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 md:gap-4">
              <div className="rounded-[16px] border border-[var(--border)] bg-black/10 p-4 md:p-5">
                <p className="text-sm font-semibold text-white">Selectividad</p>
                <p className="mt-2 text-[15px] leading-6 text-[var(--text-secondary)] md:text-sm">
                  No todo caso requiere una arquitectura estratégica. Los que sí la
                  requieren no admiten improvisación.
                </p>
              </div>

              <div className="rounded-[16px] border border-[var(--border)] bg-black/10 p-4 md:p-5">
                <p className="text-sm font-semibold text-white">Precisión</p>
                <p className="mt-2 text-[15px] leading-6 text-[var(--text-secondary)] md:text-sm">
                  La lectura técnica correcta del escenario modifica viabilidad,
                  presión y margen de negociación.
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  )
}