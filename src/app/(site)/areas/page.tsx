import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Áreas de Intervención Judicial',
  description: 'Estructuras de defensa, arbitraje y litigio para escenarios patrimonialmente críticos.',
  path: '/areas',   // ← agregar
})

const areas = [
  {
    category: 'Litigio Civil y Comercial',
    subTitle: 'Defensa y Ejecución Integral',
    description:
      'Intervención en disputas contractuales complejas, ejecución de garantías, embargos y levantamientos cautelares. Estructuramos la demanda o la resistencia con precisión probatoria, asumiendo la dirección total de la controversia hasta la sentencia o el acuerdo judicial forzado.',
    tags: ['Ejecuciones', 'Incumplimientos', 'Daños Patrimoniales'],
  },
  {
    category: 'Conflicto Societario',
    subTitle: 'Control y Disolución',
    description:
      'Lectura de posiciones accionarias, administración fraudulenta y remoción de directores. Protegemos al socio minoritario del abuso legal, o blindamos la gestión mayoritaria frente a embates extorsivos, preparando el terreno para escisiones corporativas seguras.',
    tags: ['Remoción Directiva', 'Rendición de Cuentas', 'Blindaje'],
  },
  {
    category: 'Estructuración Sucesoria',
    subTitle: 'Intervención Patrimonial',
    description:
      'El patrimonio hereditario es una zona de guerra latente. No gestionamos meros trámites, bloqueamos la dilapidación de bienes, auditamos inventarios ocultos y forzamos particiones equitativas enfrentando la colusión entre herederos hostiles.',
    tags: ['Fraude Hereditario', 'Partición', 'Inventario'],
  },
  {
    category: 'Arbitraje y Fricción Privada',
    subTitle: 'Extracción de Valor Rápida',
    description:
      'Negociaciones al borde de la judicialización. Desarmamos estrategias de coerción de la contraparte aislando los riesgos financieros. Construimos acuerdos asimétricos validados ante notario para finiquitar la disputa de raíz, bloqueando vías de reclamo futuro.',
    tags: ['Negociación Asimétrica', 'Arbitraje', 'Cláusulas Penales'],
  },
]

export default function AreasPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Áreas de Práctica Exponencial"
        title="Escenarios de alta fricción. Resoluciones contundentes."
        description="VINDEX no es una clínica generalista. Solo intervenimos en disputas donde el impacto patrimonial, societario o estructural exige técnica incisiva, control férreo del riesgo y una asimetría táctica a nuestro favor."
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
          description="Una evaluación preliminar del caso blindará sus movimientos futuros, evitando que su posición de negociación sea destruida antes del primer cara a cara."
        />
      </div>
    </PageShell>
  )
}
