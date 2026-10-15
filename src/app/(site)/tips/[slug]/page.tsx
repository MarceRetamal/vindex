import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/metadata'
import { CATEGORIAS_TIPS, obtenerTip, obtenerTips } from '@/lib/tips'
import { formatearFecha, obtenerNota } from '@/lib/blog'
import { FadeIn } from '@/components/motion/FadeIn'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PageCta } from '@/components/ui/PageCta'
import { PageShell } from '@/components/ui/PageShell'

const baseUrl = 'https://vindexlegal.com.ar'

export const dynamic = 'force-static'
export const dynamicParams = false

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return obtenerTips().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tip = obtenerTip(slug)
  if (!tip) return buildMetadata({ title: 'Tip no encontrado', description: '', path: '/tips' })

  return buildMetadata({
    title: tip.titulo,
    description: tip.descripcion,
    path: `/tips/${tip.slug}`,
    type: 'article',
    publishedTime: `${tip.fecha}T12:00:00-03:00`,
    modifiedTime: `${tip.actualizado}T12:00:00-03:00`,
  })
}

export default async function TipPage({ params }: Props) {
  const { slug } = await params
  const tip = obtenerTip(slug)
  if (!tip) notFound()

  const categoria = CATEGORIAS_TIPS.find((c) => c.nombre === tip.categoria)
  const notaPilar = tip.notaPilar ? obtenerNota(tip.notaPilar) : undefined
  const relacionados = obtenerTips()
    .filter((t) => t.slug !== tip.slug)
    .sort((a, b) => Number(b.categoria === tip.categoria) - Number(a.categoria === tip.categoria))
    .slice(0, 3)

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: tip.titulo,
            description: tip.descripcion,
            articleSection: tip.categoria,
            datePublished: tip.fecha,
            dateModified: tip.actualizado,
            inLanguage: 'es-AR',
            image: `${baseUrl}/og-image.jpg`,
            mainEntityOfPage: `${baseUrl}/tips/${tip.slug}`,
            author: {
              '@type': 'Person',
              name: 'Marcelo Fabián Retamal',
              jobTitle: 'Abogado',
              url: `${baseUrl}/direccion`,
            },
            publisher: { '@type': 'LegalService', '@id': `${baseUrl}/#estudio`, name: 'VINDEX LEGAL', url: baseUrl },
          }),
        }}
      />

      <Breadcrumbs
        items={[
          { name: 'Tips', href: '/tips' },
          ...(categoria ? [{ name: tip.categoria, href: `/tips#${categoria.ancla}` }] : []),
          { name: tip.titulo },
        ]}
      />

      <FadeIn>
        <div className="max-w-3xl">
          <div className="mb-5">
            <Eyebrow>{tip.categoria}</Eyebrow>
          </div>
          <h1 className="text-balance text-[1.9rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl">
            {tip.titulo}
          </h1>
          <p className="mt-5 text-[13px] font-medium text-[var(--text-muted)]">
            Lectura: {tip.minutos} min · Actualizado el {formatearFecha(tip.actualizado)}
          </p>
        </div>
      </FadeIn>

      {tip.resumen.length > 0 ? (
        <FadeIn delay={0.05}>
          <div className="vindex-resumen mt-8 max-w-3xl">
            <p className="vindex-resumen-eyebrow">Lo clave</p>
            <ul>
              {tip.resumen.map((punto, i) => (
                <li key={i}>{punto}</li>
              ))}
            </ul>
          </div>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.1}>
        <div
          className="vindex-article-body mt-10 max-w-3xl
            [&>p:first-child]:text-[18px] [&>p:first-child]:leading-[1.7] [&>p:first-child]:text-[var(--text-primary)] md:[&>p:first-child]:text-[20px]
            [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:flex [&_h2]:items-center [&_h2]:text-[1.3rem] [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-white md:[&_h2]:text-[1.5rem]
            [&_p]:mt-4 [&_p]:text-[15.5px] [&_p]:leading-relaxed [&_p]:text-[var(--text-secondary)] md:[&_p]:text-[17px]
            [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
            [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
            [&_li]:text-[15.5px] [&_li]:leading-relaxed [&_li]:text-[var(--text-secondary)] md:[&_li]:text-[17px]
            [&_strong]:font-semibold [&_strong]:text-white
            [&_a]:font-medium [&_a]:text-[var(--accent)] [&_a]:underline-offset-4 hover:[&_a]:underline"
          dangerouslySetInnerHTML={{ __html: tip.html }}
        />
      </FadeIn>

      {notaPilar ? (
        <FadeIn>
          <Link
            href={`/blog/${notaPilar.slug}`}
            className="glass glass-lift mt-12 block max-w-3xl rounded-[24px] p-5 md:p-6"
          >
            <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)]">
              Guía completa
            </span>
            <span className="mt-2 block text-lg font-bold text-white">{notaPilar.titulo}</span>
          </Link>
        </FadeIn>
      ) : null}

      {categoria ? (
        <FadeIn>
          <Link
            href={categoria.areaHref}
            className={`glass glass-lift ${notaPilar ? 'mt-4' : 'mt-12'} block max-w-3xl rounded-[24px] p-5 md:p-6`}
          >
            <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)]">
              Área relacionada
            </span>
            <span className="mt-2 block text-lg font-bold text-white">Ver cómo trabajamos en {tip.categoria}</span>
          </Link>
        </FadeIn>
      ) : null}

      {relacionados.length > 0 ? (
        <FadeIn>
          <aside className="mt-10 max-w-3xl" aria-label="Más tips">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)]">Seguir leyendo</p>
            <ul className="mt-3 space-y-2">
              {relacionados.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/tips/${t.slug}`}
                    className="text-[15px] font-medium text-[var(--text-primary)] underline decoration-white/20 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
                  >
                    {t.titulo}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </FadeIn>
      ) : null}

      <FadeIn>
        <p className="mt-8 max-w-3xl text-[12.5px] leading-relaxed text-[var(--text-muted)]">
          Este tip es informativo y no constituye asesoramiento jurídico ni genera relación profesional. La normativa
          puede cambiar y cada caso depende de sus circunstancias. Ante una situación concreta, consultá con un
          abogado matriculado.
        </p>
      </FadeIn>

      <div className="mt-16 md:mt-24">
        <PageCta
          eyebrow="Evaluación confidencial"
          title="¿Estás pasando por esto?"
          description="Contanos qué pasó y te decimos qué podés hacer. Te respondemos en un plazo máximo de 24 horas hábiles."
          buttonHref="/evaluacion"
          buttonLabel="Contar mi caso"
        />
      </div>
    </PageShell>
  )
}
