import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/metadata'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { PageCta } from '@/components/ui/PageCta'
import { PageIntro } from '@/components/ui/PageIntro'
import { PageShell } from '@/components/ui/PageShell'

export const metadata: Metadata = buildMetadata({
  title: 'Criterio Institucional',
  description: 'La diferencia no está en reaccionar. Está en posicionarse con autoridad y leer mejor el conflicto.',
  path: '/criterio',
})

const principles = [
  {
    num: 'I.',
    title: 'Lectura Pericial, No Emocional',
    description:
      'La primera ventaja estructural en un conflicto judicializado no surge de la agresión escrita ni del volumen de actuaciones procesales, sino de una comprensión puramente técnica del encuadre legal. Despejamos el ruido emocional y destilamos el conflicto a contingencias, pasivos, probabilidades y tiempos judiciales medibles.',
  },
  {
    num: 'II.',
    title: 'Ingeniería Inversa del Conflicto',
    description:
      'Comenzamos visualizando el peor escenario posible para el cliente y para la contraparte. A partir del resultado más probable según la jurisprudencia imperante, estructuramos paso a paso cada carta documento, notificación y demanda de forma inversa, para conducir el caso hacia ese desenlace desde el primer movimiento.',
  },
  {
    num: 'III.',
    title: 'Presión Táctica Controlada',
    description:
      'La presión no significa enviar la mayor cantidad de papeles al tribunal. Presionar, en nuestro criterio, significa cerrar las vías de escape argumentales de la contraparte con prueba sólida y fundamentos jurídicos precisos. Nunca amenazamos: notificamos consecuencias jurídicas previsibles.',
  },
  {
    num: 'IV.',
    title: 'Cero Improvisación',
    description:
      'Una carta documento enviada en un estado de nerviosismo compromete las defensas futuras de manera difícil de reparar. Cuando el escenario involucra patrimonio o reputación, una decisión errática al inicio del intercambio condiciona toda la estrategia probatoria posterior.',
  },
]

export default function CriterioPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Manifiesto Estratégico VINDEX"
        title="La diferencia no está en reaccionar. Está en leer el conflicto."
        description="Nuestro criterio operativo parte de un principio simple: cuando el patrimonio real está en riesgo, la improvisación cuesta tan caro como la desidia. Construimos la estrategia de presión procesal legítima con timing de precisión."
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
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Un primer escrito improvisado no se corrige después.</h3>
              <p className="text-[var(--text-secondary)] m-0">Se decide antes de escribir, no durante.</p>
            </div>
            <a href="/evaluacion" className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-[var(--accent)] text-[var(--bg-deep)] px-8 py-3.5 font-bold transition-all hover:bg-[var(--accent-bright)] hover:scale-[1.02]">
                Solicitar Evaluación del Caso
            </a>
         </div>
      </div>
    </PageShell>
  )
}
