import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Card } from '@/components/ui/Card'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Dirección del Estudio',
  description:
    'Dr. Marcelo F. Retamal — abogado matriculado CALP, La Plata. Trayectoria, matrícula y jurisdicciones de actuación.',
  path: '/direccion',
})

const credentials = {
  fullName: 'Dr. Marcelo Fabián Retamal',
  barNumber: 'Tomo LXVI, Folio 263 — Colegio de Abogados de La Plata (CALP)',
  university: 'Universidad Nacional de La Plata (UNLP)',
  photoSrc: '/marcelo-retamal.jpg', // ← reemplazar cuando subas la foto definitiva
}

const appointments = [
  { jurisdiction: 'Ensenada', role: 'Defensor / asesor sistema DEAS' },
  { jurisdiction: 'Berisso', role: 'Defensor / asesor sistema DEAS' },
  { jurisdiction: 'Punta Indio', role: 'Defensor / asesor de oficio sistema DEAS' },
  { jurisdiction: 'Magdalena', role: 'Defensor / asesor de oficio sistema DEAS' },
  { jurisdiction: 'Coronel Brandsen', role: 'Defensor / asesor de oficio sistema DEAS' },
]

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

      <div className="mt-16 md:mt-24 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
        <FadeIn>
          <div className="rounded-[20px] border border-[var(--border-strong)] overflow-hidden bg-[var(--surface-1)]">
            <img
              src={credentials.photoSrc}
              alt={credentials.fullName}
              className="w-full aspect-[4/5] object-cover grayscale-[15%] contrast-[1.05]"
            />
            <div className="p-6 space-y-1">
              <p className="text-white font-bold text-lg">{credentials.fullName}</p>
              <p className="text-[var(--text-secondary)] text-sm">Abogado — {credentials.barNumber}</p>
              <p className="text-[var(--text-secondary)] text-sm">{credentials.university}</p>
            </div>
          </div>
        </FadeIn>

        <StaggerFadeIn delay={0.1}>
          <div className="space-y-8">
            <div>
              <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4">
                Nombramientos judiciales
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {appointments.map((a) => (
                  <Card key={a.jurisdiction} title={a.jurisdiction} description={a.role} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-4">
                Áreas de actuación
              </h3>
              <p className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
                {areasOfPractice.join(' · ')}
              </p>
            </div>
          </div>
        </StaggerFadeIn>
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