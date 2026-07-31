import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Card } from '@/components/ui/Card'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'

const items = [
  {
    title: 'Profundidad analítica',
    description:
      'No se trabaja sobre apariencia del caso, sino sobre la estructura real del conflicto y sus consecuencias.',
  },
  {
    title: 'Claridad estructural',
    description:
      'Cada decisión debe encajar en una lógica de conjunto. Sin estructura, la actuación pierde fuerza.',
  },
  {
    title: 'Presión procesal inteligente',
    description:
      'La intervención no se mide por volumen de acciones, sino por la capacidad de alterar la posición de la contraparte.',
  },
  {
    title: 'Coherencia estratégica',
    description:
      'La ventaja no está en moverse mucho. Está en moverse con dirección, timing y consistencia.',
  },
]

export function Differential() {
  return (
    <Section variant="soft">
      <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-10">
        <FadeIn>
          <div className="space-y-3 md:space-y-4">
            <Eyebrow>Diferencial</Eyebrow>

            <h2 className="max-w-xl text-2xl font-extrabold leading-tight sm:text-3xl md:text-5xl">
              La diferencia no está en actuar. Está en cómo se construye la
              posición jurídica.
            </h2>

            <p className="max-w-lg text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base md:leading-8">
              Cuando el conflicto es serio, la técnica aislada no alcanza. Hace
              falta una arquitectura de intervención.
            </p>
          </div>
        </FadeIn>

        <StaggerFadeIn delay={0.12}>
          <div className="grid gap-4 sm:grid-cols-2 md:gap-5">
            {items.map((item) => (
              <Card
                key={item.title}
                title={item.title}
                description={item.description}
                className="bg-[var(--bg)]"
              />
            ))}
          </div>
        </StaggerFadeIn>
      </div>
    </Section>
  )
}