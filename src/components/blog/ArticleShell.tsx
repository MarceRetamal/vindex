import Link from 'next/link'
import { CATEGORIA_TIP_POR_MATERIA, SERVICIO_POR_MATERIA } from '@/data/areas'
import { FadeIn } from '@/components/motion/FadeIn'
import { Cover } from '@/components/blog/Cover'
import { TrackedLink } from '@/components/analytics/TrackedLink'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { PageCta } from '@/components/ui/PageCta'
import { PageShell } from '@/components/ui/PageShell'
import { LinkList } from '@/components/ui/LinkList'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { TableOfContentsDesktop, TableOfContentsMobile } from '@/components/blog/TableOfContents'
import { formatearFecha, obtenerNotas, type NotaCompleta } from '@/lib/blog'
import { obtenerTips } from '@/lib/tips'
import { articleSchema } from '@/lib/schema'
import { SITE_URL } from '@/data/site'
import { JsonLd } from '@/components/seo/JsonLd'

function notasRelacionadas(nota: NotaCompleta) {
  const otras = obtenerNotas().filter((n) => n.slug !== nota.slug)
  const mismaMateria = otras.filter((n) => n.materia === nota.materia)
  const resto = otras.filter((n) => n.materia !== nota.materia)
  return [...mismaMateria, ...resto].slice(0, 3)
}

function tipsRelacionados(nota: NotaCompleta) {
  const categoria = CATEGORIA_TIP_POR_MATERIA[nota.materia]
  if (!categoria) return []
  return obtenerTips()
    .filter((t) => t.categoria === categoria)
    .slice(0, 3)
}

export function ArticleShell({ nota }: { nota: NotaCompleta }) {
  const servicio = SERVICIO_POR_MATERIA[nota.materia]
  const tips = tipsRelacionados(nota)
  const relacionadas = notasRelacionadas(nota)
  const urlNota = `${SITE_URL}/blog/${nota.slug}`

  return (
    <PageShell>
      <ReadingProgress />

      <JsonLd
        data={articleSchema({
          titulo: nota.titulo,
          descripcion: nota.descripcion,
          fecha: nota.fecha,
          actualizado: nota.actualizado,
          url: urlNota,
        })}
      />

      <Breadcrumbs
        items={[
          { name: 'Blog', href: '/blog' },
          ...(servicio ? [{ name: nota.materia, href: servicio.href }] : []),
          { name: nota.titulo },
        ]}
      />

      <FadeIn>
        <div className="max-w-3xl">
          <div className="mb-5">
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

      {nota.imagen ? (
        <FadeIn delay={0.04}>
          <div className="mt-8 max-w-3xl overflow-hidden rounded-[24px] border border-white/10">
            <Cover src={nota.imagen} />
          </div>
        </FadeIn>
      ) : null}

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
        <div className="mt-10 flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-3">
          <TrackedLink
            href={`https://wa.me/?text=${encodeURIComponent(`${nota.titulo} ${urlNota}`)}`}
            evento="share"
            params={{ method: 'whatsapp', content_type: 'nota', item_id: nota.slug }}
            external
            className="text-[14px] font-semibold text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Compartir por WhatsApp
          </TrackedLink>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="mt-10 max-w-3xl glass rounded-[28px] p-6 md:p-8">
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

      {servicio || tips.length > 0 || relacionadas.length > 0 ? (
        <FadeIn>
          <aside className="mt-10 max-w-3xl space-y-8" aria-label="Contenido relacionado">
            {servicio ? (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)]">
                  Servicio relacionado
                </p>
                <Link href={servicio.href} className="glass glass-lift mt-3 block rounded-[24px] p-5 md:p-6">
                  <span className="block text-lg font-bold text-white">{servicio.titulo}</span>
                  <span className="mt-1 block text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    {servicio.texto}
                  </span>
                </Link>
              </div>
            ) : null}

            {tips.length > 0 ? (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)]">
                  Tips rápidos sobre este tema
                </p>
                <LinkList className="mt-3 space-y-2" items={tips.map((t) => ({ href: `/tips/${t.slug}`, texto: t.titulo }))} />
              </div>
            ) : null}

            {relacionadas.length > 0 ? (
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)]">
                  Lecturas relacionadas
                </p>
                <LinkList
                  className="mt-3 space-y-2"
                  items={relacionadas.map((n) => ({ href: `/blog/${n.slug}`, texto: n.titulo }))}
                />
              </div>
            ) : null}
          </aside>
        </FadeIn>
      ) : null}

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
          title="¿Tu situación se parece a lo que acabás de leer?"
          description="Contanos qué pasó y te decimos qué podés hacer. Te respondemos en un plazo máximo de 24 horas hábiles."
          buttonHref="/evaluacion"
          buttonLabel="Contar mi caso"
        />
      </div>
    </PageShell>
  )
}
