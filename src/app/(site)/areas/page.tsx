import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Áreas de Intervención Judicial',
  description: 'Estructuras de defensa, negociación y litigio para escenarios patrimonialmente críticos.',
  path: '/areas',
})

const areas = [
  {
    category: 'Litigio Civil y Comercial',
    subTitle: 'Defensa y Ejecución Integral',
    description:
      'Intervención en disputas contractuales complejas, ejecución de garantías, embargos y levantamientos cautelares. Estructuramos la demanda o la defensa con precisión probatoria, asumiendo la dirección total de la controversia hasta la sentencia o el acuerdo homologado judicialmente.',
    tags: ['Ejecuciones', 'Incumplimientos', 'Daños Patrimoniales'],
  },
  {
    category: 'Conflicto Societario',
    subTitle: 'Control y Disolución',
    description:
      'Lectura de posiciones accionarias, administración irregular y remoción de directores. Protegemos al socio minoritario frente al abuso de la posición de control, o defendemos la gestión mayoritaria frente a reclamos infundados, preparando el terreno para escisiones corporativas ordenadas y seguras.',
    tags: ['Remoción Directiva', 'Rendición de Cuentas', 'Blindaje Societario'],
  },
  {
    category: 'Estructuración Sucesoria',
    subTitle: 'Intervención Patrimonial',
    description:
      'El patrimonio hereditario concentra los conflictos familiares más sensibles y de mayor riesgo económico. No gestionamos meros trámites: prevenimos la dilapidación de bienes, auditamos inventarios incompletos y promovemos particiones equitativas, incluso cuando otros herederos obstruyen, dilatan o actúan de manera coordinada en perjuicio de nuestro cliente.',
    tags: ['Fraude Hereditario', 'Partición', 'Inventario'],
  },
  {
    category: 'Negociación y Arbitraje',
    subTitle: 'Resolución Anticipada del Conflicto',
    description:
      'Negociaciones al borde de la judicialización. Neutralizamos presiones indebidas de la contraparte y aislamos los riesgos financieros del escenario. Construimos acuerdos sólidos, con la instrumentación y el respaldo documental adecuados, que cierran la disputa de raíz y previenen reclamos futuros.',
    tags: ['Negociación Estratégica', 'Arbitraje', 'Cláusulas Penales'],
  },
]

export default function AreasPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Áreas de Práctica Exponencial"
        title="Escenarios de alta fricción. Resoluciones contundentes."
        description="VINDEX no es una clínica generalista. Solo intervenimos en disputas donde el impacto patrimonial, societario o estructural exige técnica rigurosa, control estricto del riesgo y planificación estratégica de cada movimiento."
      />
      
      <div className="mt-16 md:mt-24">
        <StaggerFadeIn delay={0.1} stagger={0.1}>
          <div className="grid gap-px bg-[var(--border-strong)] rounded-2xl overflow-hidden border border-[var(--border-strong)]">
            {areas.map((area, index) => (
              <div key={index} className="bg-[var(--bg)] grid md:grid-cols-[1fr_2fr] gap-6 p-8 md:p-12 hover:bg-[var(--bg-elevated)] transition-colors duration-300">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-3">
                    {area.category}
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                    {area.subTitle}
                  </h3>
                </div>
                
                <div>
                  <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-[16px] mb-6">
                    {area.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {area.tags.map((tag, tIndex) => (
                      <span key={tIndex} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </StaggerFadeIn>
      </div>

      <div className="mt-24 md:mt-32">
        <PageCta
          title="No dilapide recursos en enfoques genéricos."
          description="Una evaluación preliminar del caso ordena sus movimientos futuros y protege su posición de negociación desde el primer intercambio."
        />
      </div>
    </PageShell>
  )
}
