import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/metadata'
import { AREAS, obtenerArea } from '@/data/areas'
import { obtenerNotas, formatearFecha } from '@/lib/blog'
import { obtenerTips } from '@/lib/tips'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'
import { LinkList } from '@/components/ui/LinkList'
import { FaqList } from '@/components/ui/FaqList'
import { JsonLd } from '@/components/seo/JsonLd'
import { faqSchema, serviceSchema } from '@/lib/schema'
import { SITE_URL } from '@/data/site'
import { Overline } from '@/components/ui/Overline'
import { SectionTitle } from '@/components/ui/SectionTitle'

// Una página por área (familia, tránsito, laboral, ART, amparos). Los datos
// salen de src/data/areas.ts. Cualquier otra dirección da 404.
export const dynamic = 'force-static'
export const dynamicParams = false

type Props = { params: Promise<{ area: string }> }

export function generateStaticParams() {
  return AREAS.map((a) => ({ area: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { area } = await params
  const data = obtenerArea(area)
  if (!data) return buildMetadata({ title: 'Página no encontrada', description: '', path: '/' })

  return buildMetadata({
    title: data.titleSeo,
    description: data.description,
    path: `/${data.slug}`,
  })
}

export default async function AreaPage({ params }: Props) {
  const { area } = await params
  const data = obtenerArea(area)
  if (!data) notFound()

  const tips = obtenerTips()
    .filter((t) => t.categoria === data.categoriaTips)
    .slice(0, 4)
  const notas = obtenerNotas()
    .filter((n) => n.materia === data.materia)
    .slice(0, 3)
  const otrasAreas = AREAS.filter((a) => a.slug !== data.slug)
  const preguntas = data.faqs.map((f) => ({ pregunta: f.q, respuesta: f.a }))

  return (
    <PageShell>
      <JsonLd data={faqSchema(preguntas)} />
      <JsonLd
        data={serviceSchema({
          nombre: data.h1,
          tipo: data.nombre,
          descripcion: data.description,
          url: `${SITE_URL}/${data.slug}`,
        })}
      />

      <Breadcrumbs items={[{ name: 'Áreas', href: '/areas' }, { name: data.nombre }]} />

      <PageIntro eyebrow={data.eyebrow} title={data.h1} description={data.intro} />

      <FadeIn delay={0.1}>
        <div className="mt-8">
          <Button href="/evaluacion">Contar mi caso</Button>
        </div>
      </FadeIn>

      <div className="mt-16 md:mt-24">
        <SectionTitle className="mb-6">
          ¿Te pasó algo de esto?
        </SectionTitle>
        <StaggerFadeIn stagger={0.1}>
          <div className="grid gap-6 sm:grid-cols-2">
            {data.situaciones.map((s, i) => (
              <Card key={s.title} eyebrow={`0${i + 1}`} title={s.title} description={s.description} />
            ))}
          </div>
        </StaggerFadeIn>
      </div>

      <FadeIn>
        <div className="mt-14 flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <span key={tag} className="glass rounded-full px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
              {tag}
            </span>
          ))}
        </div>
      </FadeIn>

      <div className="mt-20 md:mt-28">
        <SectionTitle className="mb-6">
          Qué hacer primero
        </SectionTitle>
        <StaggerFadeIn stagger={0.1}>
          <div className="grid gap-6 md:grid-cols-3">
            {data.pasos.map((p, i) => (
              <Card key={p.title} eyebrow={`Paso ${i + 1}`} title={p.title} description={p.description} />
            ))}
          </div>
        </StaggerFadeIn>
      </div>

      <div className="mt-20 md:mt-28">
        <SectionTitle className="mb-6">
          Preguntas frecuentes
        </SectionTitle>
        <StaggerFadeIn stagger={0.08}>
          <FaqList items={preguntas} />
        </StaggerFadeIn>
      </div>

      {tips.length > 0 || notas.length > 0 ? (
        <div className="mt-20 grid gap-10 md:mt-28 md:grid-cols-2">
          {tips.length > 0 ? (
            <FadeIn>
              <Overline>
                Tips para tu caso
              </Overline>
              <LinkList className="mt-4 space-y-3" items={tips.map((t) => ({ href: `/tips/${t.slug}`, texto: t.titulo }))} />
            </FadeIn>
          ) : null}

          {notas.length > 0 ? (
            <FadeIn delay={0.05}>
              <Overline>
                Guías para leer
              </Overline>
              <LinkList
                className="mt-4 space-y-3"
                items={notas.map((n) => ({
                  href: `/blog/${n.slug}`,
                  texto: n.titulo,
                  extra: <span className="ml-2 text-[12px] text-[var(--text-muted)]">{formatearFecha(n.fecha)}</span>,
                }))}
              />
            </FadeIn>
          ) : null}
        </div>
      ) : null}

      <FadeIn>
        <div className="mt-16">
          <Overline>Otras áreas</Overline>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {otrasAreas.map((a) => (
              <Link key={a.slug} href={`/${a.slug}`} data-glass className="glass glass-chip">
                {a.nombre}
              </Link>
            ))}
            <Link href="/penal-urgente" data-glass className="glass glass-chip">
              Defensa penal
            </Link>
            <Link href="/sucesiones" data-glass className="glass glass-chip">
              Sucesiones
            </Link>
          </div>
        </div>
      </FadeIn>

      <FadeIn>
        <p className="mt-10 max-w-3xl text-[12.5px] leading-relaxed text-[var(--text-muted)]">
          Esta página es informativa y no constituye asesoramiento jurídico ni genera relación profesional. Cada caso
          depende de sus circunstancias y de la normativa vigente.
        </p>
      </FadeIn>

      <div className="mt-16 md:mt-24">
        <PageCta
          eyebrow="Evaluación confidencial"
          title="Contanos qué pasó y te decimos qué podés hacer."
          description="Te respondemos en un plazo máximo de 24 horas hábiles. Tu consulta es confidencial."
          buttonHref="/evaluacion"
          buttonLabel="Contar mi caso"
        />
      </div>
    </PageShell>
  )
}
