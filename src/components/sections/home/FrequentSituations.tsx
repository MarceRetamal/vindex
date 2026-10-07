import Link from 'next/link'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'

const situations = [
  {
    href: '/tips/no-me-pasan-la-cuota-alimentaria',
    title: 'No me pasan la cuota alimentaria',
    description: 'Qué hacer cuando hay deuda o todavía no hay cuota fijada.',
  },
  {
    href: '/blog/no-me-dejan-ver-a-mis-hijos-impedimento-contacto',
    title: 'No me dejan ver a mis hijos',
    description: 'Las vías legales cuando cortan el contacto.',
  },
  {
    href: '/tips/me-despidieron-que-hacer-primero',
    title: 'Me despidieron',
    description: 'Lo primero que conviene hacer, y qué no firmar.',
  },
  {
    href: '/tips/choque-con-lesiones-primeras-48-horas',
    title: 'Tuve un choque con lesiones',
    description: 'Qué guardar y qué hacer en las primeras 48 horas.',
  },
  {
    href: '/tips/accidente-de-trabajo-art-que-hacer-primero',
    title: 'Me accidenté trabajando',
    description: 'Pasos con la ART y documentación que conviene reunir.',
  },
  {
    href: '/tips/obra-social-o-prepaga-niega-tratamiento-amparo',
    title: 'Mi obra social, prepaga o IOMA me niega un tratamiento',
    description: 'Cómo reclamar y cuándo conviene un amparo.',
  },
]

export function FrequentSituations() {
  return (
    <Section variant="surface" id="situaciones">
      <div className="space-y-8 md:space-y-10">
        <FadeIn>
          <div className="max-w-2xl space-y-3 md:space-y-4">
            <Eyebrow>Situaciones frecuentes</Eyebrow>
            <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
              Si te pasó algo de esto, empezá por acá.
            </h2>
          </div>
        </FadeIn>

        <StaggerFadeIn stagger={0.08}>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
            {situations.map((s) => (
              <Link
                data-glass
                key={s.href}
                href={s.href}
                className="glass glass-lift group block rounded-[28px] p-6 md:p-8"
              >
                <h3 className="text-xl font-bold leading-tight text-white md:text-2xl">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)] md:text-base">
                  {s.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--accent-bright)] transition-transform group-hover:translate-x-1">
                  Leer →
                </span>
              </Link>
            ))}
          </div>
        </StaggerFadeIn>
      </div>
    </Section>
  )
}
