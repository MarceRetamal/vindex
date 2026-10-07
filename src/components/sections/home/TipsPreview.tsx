import Link from 'next/link'
import { obtenerTips, type Tip } from '@/lib/tips'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'

// Tips que se muestran en la home, en este orden. Si un slug no existe se omite.
const DESTACADOS = [
  'obra-social-o-prepaga-niega-tratamiento-amparo',
  'sentencia-de-amparo-no-se-cumple',
  'no-me-pasan-la-cuota-alimentaria',
]

export function TipsPreview() {
  const todos = obtenerTips()
  const tips = DESTACADOS.map((slug) => todos.find((t) => t.slug === slug)).filter((t): t is Tip => Boolean(t))

  if (tips.length === 0) return null

  return (
    <Section variant="soft" id="tips">
      <div className="space-y-8 md:space-y-10">
        <FadeIn>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
            <div className="max-w-2xl space-y-3 md:space-y-4">
              <Eyebrow>Tips jurídicos</Eyebrow>
              <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">
                Lo que conviene saber, en un minuto.
              </h2>
            </div>
            <div>
              <Button href="/tips" variant="secondary">
                Ver todos los tips
              </Button>
            </div>
          </div>
        </FadeIn>

        <StaggerFadeIn stagger={0.1}>
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {tips.map((t) => (
              <Card
                key={t.slug}
                eyebrow={`${t.categoria} · ${t.minutos} min`}
                title={t.titulo}
                description={t.descripcion}
                footer={
                  <Link
                    href={`/tips/${t.slug}`}
                    className="text-[14px] font-semibold text-(--accent) underline-offset-4 hover:underline"
                  >
                    Leer el tip
                  </Link>
                }
              />
            ))}
          </div>
        </StaggerFadeIn>
      </div>
    </Section>
  )
}
