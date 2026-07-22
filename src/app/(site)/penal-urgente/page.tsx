import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Card } from '@/components/ui/Card'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Abogado Penal Urgente en La Plata',
  description:
    'Defensa penal ante denuncias, medidas cautelares y citaciones urgentes en toda la Provincia de Buenos Aires. Evaluación confidencial en menos de 24 hs hábiles.',
  path: '/penal-urgente',
})

const scenarios = [
  {
    eyebrow: '01',
    title: 'Recibió una notificación o citación',
    description:
      'IPP iniciada, citación a prestar declaración, medida cautelar notificada. El primer movimiento después de enterarse define la posición de todo lo que sigue.',
  },
  {
    eyebrow: '02',
    title: 'Lo denunciaron y considera que es infundado',
    description:
      'Una denuncia falsa o exagerada no se resuelve sola ni se resuelve rápido. Se resuelve con encuadre técnico del expediente desde el primer escrito.',
  },
  {
    eyebrow: '03',
    title: 'Está en el marco de un proceso de violencia de género',
    description:
      'Asistencia técnica en la instancia penal y en las medidas de protección conexas, con el mismo estándar de rigor procesal que cualquier otra causa.',
  },
  {
    eyebrow: '04',
    title: 'Lo denunciaron por estafa o incumplimiento',
    description:
      'La frontera entre un conflicto civil y una imputación penal no siempre es clara para quien la recibe. Definirla primero cambia toda la estrategia.',
  },
]

const caseTags = ['Denuncias penales', 'Denuncias falsas', 'Violencia de género', 'Amenazas', 'Estafas']

const faqs = [
  {
    q: '¿Qué hago si me llegó una notificación de una IPP?',
    a: 'No responda ni se presente sin asesoramiento previo, incluso si considera que la situación es simple de explicar. El encuadre técnico del expediente en las primeras horas condiciona las etapas siguientes.',
  },
  {
    q: '¿Puedo hablar con la otra parte para resolverlo directamente?',
    a: 'En general no es recomendable una vez que hay una causa iniciada. Cualquier comunicación puede ser incorporada al expediente y usarse en un sentido no previsto.',
  },
  {
    q: '¿Una denuncia falsa se cae sola con el tiempo?',
    a: 'No necesariamente. Una denuncia sin fundamento puede avanzar igual si no se ataca su admisibilidad y su prueba de forma técnica y a tiempo.',
  },
  {
    q: '¿Atienden causas fuera de La Plata?',
    a: 'Sí. La matrícula de abogado en el Colegio de Abogados de La Plata habilita actuación en toda la Provincia de Buenos Aires, no solo en el Departamento Judicial de La Plata.',
  },
]

export default function PenalUrgentePage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <PageIntro
        eyebrow="Defensa Penal — Denuncias y Medidas Urgentes"
        title="Lo urgente no es explicar lo que pasó. Es ordenar lo que sigue."
        description="VINDEX LEGAL interviene en causas penales en toda la Provincia de Buenos Aires, con base en La Plata. Evaluación confidencial del expediente, sin costo, en menos de 24 hs hábiles."
      />

      <div className="mt-16 md:mt-24">
        <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6">
          Situaciones que atendemos
        </h3>
        <StaggerFadeIn stagger={0.1}>
          <div className="grid gap-6 sm:grid-cols-2">
            {scenarios.map((s) => (
              <Card key={s.title} eyebrow={s.eyebrow} title={s.title} description={s.description} />
            ))}
          </div>
        </StaggerFadeIn>
      </div>

      <FadeIn>
        <div className="mt-14 flex flex-wrap gap-2">
          {caseTags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </FadeIn>

      <div className="mt-20 md:mt-28">
        <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6">
          Preguntas frecuentes
        </h3>
        <StaggerFadeIn stagger={0.08}>
          <div className="grid gap-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-[16px] border border-[var(--border)] bg-[var(--surface-1)] p-6 open:border-white/10"
              >
                <summary className="cursor-pointer list-none font-bold text-white text-[16px] flex justify-between items-center gap-4">
                  {f.q}
                  <span className="text-[var(--accent)] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">{f.a}</p>
              </details>
            ))}
          </div>
        </StaggerFadeIn>
      </div>

      <div className="mt-20 md:mt-32">
        <PageCta
          eyebrow="Evaluación confidencial"
          title="Cada hora que pasa sin encuadre técnico es una hora que juega para la otra parte."
          description="La consulta inicial es confidencial y no lo compromete a nada hasta contar con un dictamen de viabilidad."
          buttonHref="/evaluacion"
          buttonLabel="Solicitar Evaluación del Caso"
        />
      </div>
    </PageShell>
  )
}