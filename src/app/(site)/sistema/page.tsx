import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Sistema VINDEX',
  description:
    'Método de intervención jurídica: Lectura técnica, Evaluación táctica, Diseño y Ejecución.',
})

const phases = [
  {
    num: '01',
    title: 'Lectura Técnica (Desarme del Conflicto)',
    description:
      'Revisión forense de hechos, documentación y encuadre normativo. Antes de cualquier movimiento jurídico, identificamos la estructura real del conflicto, las contingencias patrimoniales y procesales, y los factores críticos de riesgo ocultos de la contraparte.',
    mitigations: ['Control de contingencias procesales', 'Evitación de confesiones implícitas', 'Cuantificación real del pasivo'],
  },
  {
    num: '02',
    title: 'Evaluación de Viabilidad y Riesgos',
    description:
      'Determinación técnica de líneas posibles de actuación. Mapeamos escenarios de negociación rápida, desgaste estructural o litigio frontal. Proyectamos costos, tiempos judiciales reales y la relación costo-beneficio de la ofensiva o defensiva.',
    mitigations: ['Cálculo de probabilidad de éxito', 'Presupuesto de guerra procesal', 'Proyección de medidas cautelares'],
  },
  {
    num: '03',
    title: 'Arquitectura de Intervención (Estrategia)',
    description:
      'Construcción de la posición jurídica. No hacemos cartas documento o demandas aisladas, construimos muros de contención procesal y vías de ataque con fundamento irrebatible. Cada pieza documental responde a una lógica superior de conjunto.',
    mitigations: ['Estructuración de pruebas blindadas', 'Definición del foro de competencia asimétrica', 'Inibición de movimientos rivales'],
  },
  {
    num: '04',
    title: 'Ejecución Disciplinada Táctica',
    description:
      'Acción jurídica sostenida con dirección, seguimiento y consistencia estructural sin margen para la improvisación o la distracción procesal. Respondemos con presión focalizada para forzar negociaciones favorables o sentencias expeditivas.',
    mitigations: ['Presión extrajudicial documentada', 'Control agresivo de plazos probatorios', 'Ataque y defensa en estrados'],
  },
]

export default function SistemaPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Arquitectura del Sistema VINDEX"
        title="Intervención Estratégica. Fases de ejecución crítica."
        description="El método no busca impresionar. Busca comprender, evaluar y actuar con precisión quirúrgica donde el margen de error es cero. Los movimientos aislados pierden juicios; la planificación sistemática domina escenarios."
      />

      <div className="mt-16 md:mt-24 relative">
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-[var(--border-strong)] via-[var(--border-strong)] to-transparent md:left-[35px]" />
        
        <StaggerFadeIn delay={0.1} stagger={0.2}>
          <div className="flex flex-col gap-12 md:gap-20">
            {phases.map((phase) => (
              <div key={phase.num} className="relative pl-16 md:pl-24">
                <div className="absolute left-0 top-1 Flex items-center justify-center h-12 w-12 md:h-[72px] md:w-[72px] rounded-full border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-[var(--shadow-float)] font-mono text-sm md:text-xl font-bold text-[var(--accent)] flex">
                  {phase.num}
                </div>
                
                <div className="space-y-4 md:space-y-6 pt-1 md:pt-4">
                  <h2 className="text-xl md:text-3xl font-bold text-white tracking-tight">{phase.title}</h2>
                  <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] md:text-lg max-w-3xl">
                    {phase.description}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    {phase.mitigations.map((mit, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border-subtle)] bg-white/[0.01]">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                        <span className="text-sm font-medium text-[var(--text-primary)]">{mit}</span>
                      </div>
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
          title="El sistema se adapta al conflicto, la contundencia permanece."
          description="Una evaluación técnica preliminar permite determinar qué fase de estructuración requiere su caso específico antes de avanzar."
        />
      </div>
    </PageShell>
  )
}