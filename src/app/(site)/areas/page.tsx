import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata } from '@/lib/metadata'
import { AREAS, OTROS_SERVICIOS } from '@/data/areas'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Áreas de trabajo en La Plata',
  description:
    'Familia, accidentes de tránsito, laboral, ART, amparos de salud y discapacidad, penal y sucesiones en La Plata y la Provincia de Buenos Aires.',
  path: '/areas',
})

const filas = [
  ...AREAS.map((a) => ({
    href: `/${a.slug}`,
    categoria: a.nombre,
    titulo: a.cardTitle,
    texto: a.cardText,
    tags: a.tags,
  })),
  ...OTROS_SERVICIOS.map((s) => ({
    href: s.href,
    categoria: s.titulo,
    titulo: s.titulo,
    texto: s.texto,
    tags: [] as string[],
  })),
]

export default function AreasPage() {
  return (
    <PageShell>
      <Breadcrumbs items={[{ name: 'Áreas' }]} />

      <PageIntro
        eyebrow="Áreas de trabajo"
        title="Eligí tu situación y te contamos cómo la abordamos."
        description="Trabajamos con personas y familias en La Plata y en toda la Provincia de Buenos Aires."
      />

      <div className="mt-16 md:mt-24">
        <StaggerFadeIn delay={0.1} stagger={0.1}>
          <div className="glass grid gap-px overflow-hidden rounded-[32px] bg-white/10">
            {filas.map((fila) => (
              <Link
                key={fila.href}
                href={fila.href}
                className="grid gap-6 bg-[var(--bg-main)]/55 p-8 backdrop-blur-xl transition-colors duration-500 hover:bg-white/[0.06] md:grid-cols-[1fr_2fr] md:p-12"
              >
                <div>
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--vindex-silver)]">
                    {fila.categoria}
                  </p>
                  <h2 className="text-xl font-bold leading-tight text-white md:text-2xl">{fila.titulo}</h2>
                </div>

                <div>
                  <p className="mb-5 text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-[16px]">{fila.texto}</p>
                  {fila.tags.length > 0 ? (
                    <div className="mb-5 flex flex-wrap gap-2">
                      {fila.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <span className="text-[13px] font-semibold text-[var(--accent-bright)]">Ver más →</span>
                </div>
              </Link>
            ))}
          </div>
        </StaggerFadeIn>
      </div>

      <div className="mt-24 md:mt-32">
        <PageCta
          eyebrow="Evaluación confidencial"
          title="¿No sabés en qué área entra tu caso?"
          description="Contanos qué pasó y te decimos qué podés hacer. Te respondemos en un plazo máximo de 24 horas hábiles."
          buttonHref="/evaluacion"
          buttonLabel="Contar mi caso"
        />
      </div>
    </PageShell>
  )
}
