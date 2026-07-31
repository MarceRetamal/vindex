import Link from 'next/link'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'

const situations = [
  {
    href: '/penal-urgente',
    title: 'Recibió una notificación o una denuncia penal',
    description:
      'Defensa penal urgente en toda la Provincia de Buenos Aires: denuncias, amenazas, violencia de género, estafas.',
  },
  {
    href: '/sucesiones',
    title: 'Hay una sucesión sin resolver, con o sin conflicto entre herederos',
    description:
      'Relevamiento patrimonial y partición ordenada, incluso cuando el acuerdo entre herederos no aparece solo.',
  },
]

export function FrequentSituations() {
  return (
    <Section variant="surface" id="situaciones">
      <div className="space-y-8 md:space-y-10">
        <FadeIn>
          <div className="max-w-2xl space-y-3 md:space-y-4">
            <Eyebrow>Puntos de entrada directos</Eyebrow>
            <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
              Si su situación es una de estas, empiece por acá.
            </h2>
          </div>
        </FadeIn>

        <StaggerFadeIn stagger={0.1}>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {situations.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group block rounded-[20px] border border-[var(--border)] bg-[var(--surface-1)] p-6 transition-all duration-300 hover:-translate-y-[2px] hover:border-[var(--accent)]/40 md:p-8"
              >
                <h3 className="text-xl font-bold text-white leading-tight md:text-2xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)] md:text-base">
                  {s.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent)] transition-transform group-hover:translate-x-1">
                  Ver cómo intervenimos →
                </span>
              </Link>
            ))}
          </div>
        </StaggerFadeIn>
      </div>
    </Section>
  )
}