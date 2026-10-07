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

function AreaCard({ slug, title, description, className }: { slug: string; title: string; description: string; className?: string }) {
  return (
    <Link href={`/${slug}`} className="block h-full">
      <Card
        title={title}
        description={description}
        className={className}
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
          <div className="grid gap-4 md:gap-5 md:grid-cols-[1.3fr_1fr] md:[grid-template-areas:'big_s1'_'big_s2'_'big_s3']">
            <div className="md:[grid-area:big]">
              <AreaCard slug={areas[0].slug} title={areas[0].cardTitle} description={areas[0].cardText} className="md:[&_h3]:text-3xl" />
            </div>
            <div className="md:[grid-area:s1]">
              <AreaCard slug={areas[1].slug} title={areas[1].cardTitle} description={areas[1].cardText} />
            </div>
            <div className="md:[grid-area:s2]">
              <AreaCard slug={areas[2].slug} title={areas[2].cardTitle} description={areas[2].cardText} />
            </div>
            <div className="md:[grid-area:s3]">
              <AreaCard slug={areas[3].slug} title={areas[3].cardTitle} description={areas[3].cardText} />
            </div>
          </div>
        </StaggerFadeIn>
      </div>
    </Section>
  )
}
