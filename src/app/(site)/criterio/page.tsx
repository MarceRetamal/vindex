import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Criterio Institucional',
  description:
    'La diferencia no está en reaccionar. Está en posicionarse con autoridad y leer mejor el conflicto.',
})

const principles = [
  {
    num: 'I.',
    title: 'Lectura Pericial, No Emocional',
    description:
      'La primera ventaja estructural en un conflicto judicializado no surge de la agresión escrita ni del volumen de actuaciones procesales, sino de una comprensión puramente matemática del encuadre legal. Despejamos el ruido emocional y destilamos el conflicto a contingencias, pasivos, probabilidades y tiempos judiciales medibles.',
  },
  {
    num: 'II.',
    title: 'Ingeniería Inversa del Conflicto',
    description:
      'Comenzamos visualizando the "worst-case scenario" (el peor escenario posible) para el cliente y para la contraparte judicial. A partir del resultado final dictado por la jurisprudencia imperante, estructuramos paso a paso cada carta documento, notificación y demanda de forma inversa para forzar ese resultado natural.',
  },
  {
    num: 'III.',
    title: 'Presión Táctica Controlada',
    description:
      'La presión no significa enviar la mayor cantidad de papeles al tribunal. Presionar en nuestro criterio significa cerrar las válvulas de escape argumentales del adversario. Es acorralar mediante pruebas irrefutables e intimidación puramente intelectual. Nunca amenazamos; notificamos consecuencias inevitables.',
  },
  {
    num: 'IV.',
    title: 'Destrucción de la Improvisación',
    description:
      'Una carta documento enviada en un estado de nerviosismo detona las defensas futuras de manera irreparable. Cuando el escenario compromete patrimonio o reputación, una decisión táctica errática al inicio del intercambio no puede revertirse ni con la mejor estrategia probatoria posterior.',
  },
]

export default function CriterioPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Manifiesto Estratégico VINDEX"
        title="La diferencia no está en reaccionar. Está en leer el conflicto."
        description="Nuestro criterio operativo parte de un axioma brutal: cuando el patrimonio real está bajo amenaza, la mera improvisación penaliza de igual forma a la desidia. Construimos estructuras de asedio legal con timing de precisión."
      />

      <div className="mt-16 md:mt-24">
        <StaggerFadeIn delay={0.1} stagger={0.15}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
            {principles.map((item) => (
              <div key={item.num} className="border-t border-[var(--border-strong)] pt-8">
                <span className="block font-mono text-lg font-bold text-[var(--accent)] mb-4">{item.num}</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight leading-tight">{item.title}</h2>
                <p className="text-[15.5px] leading-relaxed text-[var(--text-secondary)] md:text-[17px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </StaggerFadeIn>
      </div>

      <div className="mt-20 md:mt-32 p-8 md:p-12 border border-[var(--border-strong)] rounded-2xl bg-[var(--bg-elevated)] shadow-2xl relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
         <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Evaluamos antes del primer escrito.</h3>
              <p className="text-[var(--text-secondary)] m-0">No acepte defensas genéricas de modelos descargados de internet. Su caso requiere análisis de fondo.</p>
            </div>
            <a href="/evaluacion" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-[var(--accent)] text-[var(--bg-deep)] px-8 py-3.5 font-bold transition-all hover:bg-[var(--accent-bright)] hover:scale-[1.02]">
              Someter caso a Auditoría
            </a>
         </div>
      </div>
    </PageShell>
  )
}                                                                    