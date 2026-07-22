import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { FadeIn } from '@/components/motion/FadeIn'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Dirección del Estudio',
  description:
    'Dr. Marcelo F. Retamal — abogado matriculado CALP, La Plata. Trayectoria y áreas de actuación.',
  path: '/direccion',
})

const credentials = {
  fullName: 'Dr. Marcelo Fabián Retamal',
  barNumber: 'Tomo LXVI, Folio 263 — Colegio de Abogados de La Plata (CALP)',
  university: 'Universidad Nacional de La Plata (UNLP)',
  photoSrc: '/marcelo-retamal.jpg',
}

const areasOfPractice = [
  'Derecho de Familia',
  'Derecho Laboral',
  'Derecho Penal',
  'Daños y Perjuicios',
  'Derecho Administrativo',
  'Derecho Ambiental',
]

export default function DireccionPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Dirección del Estudio"
        title="Quién responde por cada caso."
        description="VINDEX LEGAL no es una firma anónima: cada caso es evaluado y dirigido por el Dr. Marcelo F. Retamal, abogado matriculado en el Colegio de Abogados de La Plata."
      />

      <div className="mt-16 md:mt-24">
        <FadeIn>
          <div className="flex flex-col items-center gap-6 rounded-[20px] border border-[var(--border-strong)] bg-[var(--surface-1)] p-6 text-center sm:flex-row sm:items-center sm:text-left md:p-8">
            <img
              src={credentials.photoSrc}
              alt={credentials.fullName}
              className="h-28 w-28 shrink-0 rounded-full border border-[var(--border-strong)] object-cover object-top grayscale-[10%] contrast-[1.05] md:h-36 md:w-36"
            />
            <div className="space-y-1.5">
              <p className="text-xl font-bold text-white md:text-2xl">{credentials.fullName}</p>
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--accent)]">
                Abogado
              </p>
              <p className="text-[14px] text-[var(--text-secondary)]">{credentials.barNumber}</p>
              <p className="text-[14px] text-[var(--text-secondary)]">{credentials.university}</p>
            </div>
          </div>
        </FadeIn>

        <div className="mt-14">
          <h3 className="mb-5 text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
            Áreas de actuación
          </h3>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap gap-2">
              {areasOfPractice.map((area) => (
                <span
                  key={area}
                  className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--text-muted)]"
                >
                  {area}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="mt-20 md:mt-32">
        <PageCta
          title="Un caso mal dirigido no se corrige con una mejor estrategia después."
          description="Se decide ahora, con quién lo confía."
          buttonHref="/evaluacion"
          buttonLabel="Solicitar Evaluación del Caso"
        />
      </div>
    </PageShell>
  )
}