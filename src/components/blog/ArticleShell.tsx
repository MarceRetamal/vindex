import Link from 'next/link'
import { FadeIn } from '@/components/motion/FadeIn'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PageCta } from '@/components/ui/PageCta'
import { PageShell } from '@/components/ui/PageShell'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { TableOfContentsDesktop, TableOfContentsMobile } from '@/components/blog/TableOfContents'
import { formatearFecha, type NotaCompleta } from '@/lib/blog'

const baseUrl = 'https://vindexlegal.com.ar'

export function ArticleShell({ nota }: { nota: NotaCompleta }) {
  return (
    <PageShell>
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: nota.titulo,
            description: nota.descripcion,
            datePublished: nota.fecha,
            dateModified: nota.actualizado,
            inLanguage: 'es-AR',
            mainEntityOfPage: `${baseUrl}/blog/${nota.slug}`,
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
              { '@type': 'ListItem', position: 2, name: nota.titulo, item: `${baseUrl}/blog/${nota.slug}` },
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
              Volver al blog
            </Link>
            <Eyebrow>{nota.materia}</Eyebrow>
          </div>

          <h1 className="text-[1.9rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl text-balance">
            {nota.titulo}
          </h1>

          <p className="mt-5 text-[13px] font-medium text-[var(--text-muted)]">
            Por <span className="text-[var(--text-secondary)]">Marcelo Fabián Retamal</span> · Abogado, matrícula CALP
            · {formatearFecha(nota.fecha)} · Lectura: {nota.minutos} min
          </p>
        </div>
      </FadeIn>

      {nota.resumen.length > 0 ? (
        <FadeIn delay={0.05}>
          <div className="vindex-resumen mt-8 max-w-3xl">
            <p className="vindex-resumen-eyebrow">En síntesis</p>
            <ul>
              {nota.resumen.map((punto, i) => (
                <li key={i}>{punto}</li>
              ))}
            </ul>
          </div>
        </FadeIn>
      ) : null}

      <FadeIn delay={0.08}>
        <div className="mt-8 max-w-3xl lg:hidden">
          <TableOfContentsMobile headings={nota.headings} />
        </div>
      </FadeIn>

      <div className="mt-10 grid grid-cols-1 gap-12 md:mt-14 lg:grid-cols-[1fr_220px] lg:gap-16">
        <FadeIn delay={0.1}>
          <div
            className="vindex-article-body max-w-3xl
              [&>p:first-child]:text-[18px] [&>p:first-child]:leading-[1.7] [&>p:first-child]:text-[var(--text-primary)] md:[&>p:first-child]:text-[20px]
              [&_h2]:mt-14 [&_h2]:mb-5 [&_h2]:flex [&_h2]:items-center [&_h2]:text-[1.4rem] [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-white md:[&_h2]:mt-16 md:[&_h2]:text-[1.65rem]
              [&_p]:mt-4 [&_p]:text-[15.5px] [&_p]:leading-relaxed [&_p]:text-[var(--text-secondary)] md:[&_p]:text-[17px]
              [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
              [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
              [&_li]:text-[15.5px] [&_li]:leading-relaxed [&_li]:text-[var(--text-secondary)] md:[&_li]:text-[17px]
              [&_strong]:font-semibold [&_strong]:text-white
              [&_a]:font-medium [&_a]:text-[var(--accent)] [&_a]:underline-offset-4 hover:[&_a]:underline"
            dangerouslySetInnerHTML={{ __html: nota.html }}
          />
        </FadeIn>

        <TableOfContentsDesktop headings={nota.headings} />
      </div>

      <FadeIn>
        <div className="mt-14 max-w-3xl rounded-[16px] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)]">Sobre el autor</p>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">
            <strong className="font-semibold text-white">Marcelo Fabián Retamal</strong> es abogado (UNLP), matriculado
            en el Colegio de Abogados de La Plata (T° LXVI, F° 263) y director de VINDEX LEGAL. Ejerce en La Plata y en
            toda la Provincia de Buenos Aires.{' '}
            <Link href="/direccion" className="font-medium text-[var(--accent)] underline-offset-4 hover:underline">
              Conocer la dirección del estudio
            </Link>
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <p className="mt-8 max-w-3xl text-[12.5px] leading-relaxed text-[var(--text-muted)]">
          Este artículo tiene fines exclusivamente informativos y de divulgación general. No constituye asesoramiento
          jurídico ni genera relación profesional. La normativa, la jurisprudencia y los valores mencionados
          corresponden a la fecha de última actualización y pueden variar. Ante un caso concreto, consulte con un
          abogado matriculado.
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
