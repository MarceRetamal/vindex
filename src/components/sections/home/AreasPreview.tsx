import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'

const areas = [
  {
    title: 'Conflictos patrimoniales complejos',
    description:
      'Escenarios donde el impacto económico, societario o estructural exige lectura fina y estrategia sostenida.',
  },
  {
    title: 'Litigios civiles y comerciales',
    description:
      'Intervención en disputas donde la técnica y la consistencia táctica condicionan el resultado.',
  },
  {
    title: 'Escenarios de alta fricción jurídica',
    description:
      'Conflictos con presión cruzada, posiciones enfrentadas y margen reducido para errores de enfoque.',
  },
  {
    title: 'Estrategia preventiva y defensiva',
    description:
      'Diseño de posición antes de que la exposición jurídica crezca o se consolide en contra.',
  },
]

export function AreasPreview() {
  return (
    <Section id="areas">
      <div className="space-y-5 md:space-y-6">
        <FadeIn>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
            <div className="max-w-3xl space-y-3 md:space-y-4">
              <Eyebrow>Áreas de intervención</Eyebrow>

              <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-5xl">
                Actuación jurídica para escenarios donde la complejidad exige
                estructura, capacidad técnica y dirección estratégica.
              </h2>

              <p className="text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base md:text-lg md:leading-8">
                VINDEX no se presenta como una práctica generalista. La lógica de
                intervención responde a conflictos donde la lectura técnica modifica
                el valor del resultado.
              </p>
            </div>

            <div>
              <Button href="/areas" variant="secondary">
                Explorar áreas
              </Button>
            </div>
          </div>
        </FadeIn>

        <StaggerFadeIn delay={0.12}>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {areas.map((area) => (
              <Card
                key={area.title}
                title={area.title}
                description={area.description}
              />
            ))}
          </div>
        </StaggerFadeIn>
      </div>
    </Section>
  )
}