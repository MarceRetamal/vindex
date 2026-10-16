import Link from 'next/link'
import { AREAS } from '@/data/areas'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'

// Las cuatro áreas principales (la quinta, amparos, está en Situaciones y en /areas).
const principales = ['derecho-de-familia', 'accidentes-de-transito', 'derecho-laboral', 'accidentes-laborales-art']
const areas = principales
  .map((slug) => AREAS.find((a) => a.slug === slug))
  .filter((a): a is (typeof AREAS)[number] => Boolean(a))

function AreaCard({ slug, title, description }: { slug: string; title: string; description: string }) {
  return (
    <Link href={`/${slug}`} className="block h-full">
      <Card
        title={title}
        description={description}
        footer={<span className="text-[13px] font-semibold text-[var(--accent-bright)]">Ver más →</span>}
      />
    </Link>
  )
}

export function AreasPreview() {
  if (areas.length < 4) return null

  return (
    <Section id="areas">
      <div className="space-y-5 md:space-y-6">
        <FadeIn>
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
            <div className="max-w-3xl space-y-3 md:space-y-4">
              <Eyebrow>Áreas de trabajo</Eyebrow>

              <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-5xl">
                Casos que resolvemos todos los días.
              </h2>
            </div>

            <div>
              <Button href="/areas" variant="secondary">
                Ver todas las áreas
              </Button>
            </div>
          </div>
        </FadeIn>

        <StaggerFadeIn delay={0.12}>
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            {areas.map((a) => (
              <AreaCard key={a.slug} slug={a.slug} title={a.cardTitle} description={a.cardText} />
            ))}
          </div>
        </StaggerFadeIn>
      </div>
    </Section>
  )
}
