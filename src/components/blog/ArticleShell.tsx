import type { ReactNode } from 'react'
import Link from 'next/link'
import { FadeIn } from '@/components/motion/FadeIn'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PageCta } from '@/components/ui/PageCta'
import { PageShell } from '@/components/ui/PageShell'
import type { Article } from '@/data/articles'

const baseUrl = 'https://vindexlegal.com.ar'

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00-03:00`).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

type ArticleShellProps = {
  article: Article
  children: ReactNode
}

export function ArticleShell({ article, children }: ArticleShellProps) {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: article.title,
            description: article.description,
            datePublished: article.datePublished,
            dateModified: article.dateModified,
            inLanguage: 'es-AR',
            mainEntityOfPage: `${baseUrl}/blog/${article.slug}`,
            author: {
              '@type': 'Person',
              name: 'Marcelo Fabián Retamal',
              jobTitle: 'Abogado',
              url: `${baseUrl}/direccion`,
            },
            publisher: {
              '@type': 'LegalService',
              name: 'VINDEX LEGAL',
              url: baseUrl,
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Blog', item: `${baseUrl}/blog` },
              { '@type': 'ListItem', position: 2, name: article.title, item: `${baseUrl}/blog/${article.slug}` },
            ],
          }),
        }}
      />

      <FadeIn>
        <div className="max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2">
            <Link
              href="/blog"
              className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] transition-colors hover:text-white"
            >
              ← Blog
            </Link>
            <Eyebrow>{article.pillarLabel}</Eyebrow>
          </div>

          <h1 className="text-[1.9rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl text-balance">
            {article.title}
          </h1>

          <p className="mt-5 text-[13px] font-medium text-[var(--text-muted)]">
            Por <span className="text-[var(--text-secondary)]">Marcelo Fabián Retamal</span> · Abogado, matrícula CALP
            · {formatDate(article.datePublished)} · Lectura: {article.readingMinutes} min
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div
          className="mt-10 max-w-3xl md:mt-14
            [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[1.45rem] [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-white md:[&_h2]:text-3xl
            [&_p]:mt-4 [&_p]:text-[15.5px] [&_p]:leading-relaxed [&_p]:text-[var(--text-secondary)] md:[&_p]:text-[17px]
            [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
            [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
            [&_li]:text-[15.5px] [&_li]:leading-relaxed [&_li]:text-[var(--text-secondary)] md:[&_li]:text-[17px]
            [&_strong]:font-semibold [&_strong]:text-white
            [&_a]:font-medium [&_a]:text-[var(--accent)] [&_a]:underline-offset-4 hover:[&_a]:underline"
        >
          {children}
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mt-14 max-w-3xl rounded-[16px] border border-[var(--border)] bg-[var(--surface-1)] p-6 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Sobre el autor</p>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            <strong className="font-semibold text-white">Marcelo Fabián Retamal</strong> es abogado (UNLP), matriculado
            en el Colegio de Abogados de La Plata (T° LXVI, F° 263) y director de VINDEX LEGAL. Ejerce en La Plata y en
            toda la Provincia de Buenos Aires.{' '}
            <Link href="/direccion" className="font-medium text-[var(--accent)] underline-offset-4 hover:underline">
              Conocer la dirección del estudio →
            </Link>
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <p className="mt-8 max-w-3xl text-[12.5px] leading-relaxed text-[var(--text-muted)]">
          Este artículo tiene fines exclusivamente informativos y de divulgación general. No constituye asesoramiento
          jurídico ni genera relación profesional. La normativa y los valores mencionados corresponden a la fecha de
          última actualización y pueden variar. Ante un caso concreto, consulte con un abogado matriculado.
        </p>
      </FadeIn>

      <div className="mt-16 md:mt-24">
        <PageCta
          eyebrow="Evaluación confidencial"
          title="¿Su situación se parece a lo que acaba de leer?"
          description="Una evaluación preliminar del caso, confidencial y sin compromiso, permite saber en qué posición está antes de tomar cualquier decisión."
          buttonHref="/evaluacion"
          buttonLabel="Solicitar Evaluación del Caso"
        />
      </div>
    </PageShell>
  )
}
