import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Card } from '@/components/ui/Card'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Abogado en Sucesiones en La Plata',
  description:
    'Sucesiones simples y particiones con herederos en desacuerdo en La Plata y provincia de Buenos Aires. Relevamiento patrimonial y partición ordenada.',
  path: '/sucesiones',
})

const situations = [
  {
    eyebrow: '01',
    title: 'Sucesión sin conflicto entre herederos',
    description:
      'Hay acuerdo entre las partes pero el trámite no arranca. Ordenamos el relevamiento de bienes y llevamos el expediente de punta a punta.',
  },
  {
    eyebrow: '02',
    title: 'Un heredero no colabora o dilata',
    description:
      'Alcanza con que uno de los herederos no responda o no firme para que el proceso quede trabado indefinidamente. Hay herramientas procesales para destrabarlo.',
  },
  {
    eyebrow: '03',
    title: 'Desacuerdo sobre cómo dividir los bienes',
    description:
      'La partición es el momento donde más conflictos innecesarios aparecen. Un criterio técnico sobre la masa hereditaria evita que la disputa se alargue por percepciones, no por derecho.',
  },
  {
    eyebrow: '04',
    title: 'Bienes sin escriturar o con administración informal',
    description:
      'Inmuebles no escriturados a nombre del causante, cuentas sin rendir, bienes usados por un solo heredero sin acuerdo. Se regulariza antes de que se vuelva litigioso.',
  },
]

const faqs = [
  {
    q: '¿Hay un plazo para iniciar la sucesión?',
    a: 'No hay un plazo perentorio para iniciarla, pero cuanto más tiempo pasa, más difícil es reconstruir la documentación y más probable es que aparezcan desacuerdos entre herederos sobre el uso de los bienes en el ínterin.',
  },
  {
    q: '¿Se puede vender un bien antes de terminar la sucesión?',
    a: 'En general no, hasta tanto se inscriba la declaratoria de herederos y se defina la titularidad. Vender antes de tiempo suele generar los conflictos más difíciles de resolver después.',
  },
  {
    q: '¿Qué pasa si un heredero no quiere firmar ni presentarse?',
    a: 'El proceso no queda condicionado a la voluntad de un solo heredero. Existen vías procesales para avanzar igual, según el caso.',
  },
  {
    q: '¿Una sucesión sin conflicto es más barata o más rápida con un estudio grande o uno chico?',
    a: 'No depende del tamaño del estudio, depende de que alguien lleve el expediente activamente. La demora habitual en sucesiones simples no es judicial, es de gestión.',
  },
]

export default function SucesionesPage() {
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
        eyebrow="Sucesiones — La Plata y Provincia de Buenos Aires"
        title="El patrimonio parado no se cuida solo. Se devalúa, o se disputa."
        description="VINDEX LEGAL lleva sucesiones simples de punta a punta y particiones donde los herederos no logran un acuerdo. Relevamiento patrimonial y evaluación confidencial del caso."
      />

      <div className="mt-16 md:mt-24">
        <h3 className="text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)] mb-6">
          Situaciones que atendemos
        </h3>
        <StaggerFadeIn stagger={0.1}>
          <div className="grid gap-6 sm:grid-cols-2">
            {situations.map((s) => (
              <Card key={s.title} eyebrow={s.eyebrow} title={s.title} description={s.description} />
            ))}
          </div>
        </StaggerFadeIn>
      </div>

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
          title="Cada mes que pasa sin resolver, el desacuerdo se vuelve más difícil de destrabar."
          description="La consulta inicial es confidencial y no lo compromete a nada hasta contar con un dictamen de viabilidad."
          buttonHref="/evaluacion"
          buttonLabel="Solicitar Evaluación del Caso"
        />
      </div>
    </PageShell>
  )
}