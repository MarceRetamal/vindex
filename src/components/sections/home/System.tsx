'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const phases = [
  {
    eyebrow: '01 — Análisis inicial',
    title: 'Lectura técnica del conflicto',
    description:
      'Revisión de hechos, documentación, encuadre normativo y configuración real del escenario.',
  },
  {
    eyebrow: '02 — Evaluación jurídica',
    title: 'Viabilidad, riesgos y escenarios',
    description:
      'Determinación de líneas posibles de actuación, puntos de tensión, costos y riesgos estratégicos.',
  },
  {
    eyebrow: '03 — Diseño estratégico',
    title: 'Arquitectura de intervención',
    description:
      'Construcción de una posición jurídica orientada a control, presión y resultado.',
  },
  {
    eyebrow: '04 — Intervención',
    title: 'Ejecución con coherencia táctica',
    description:
      'Acción jurídica sostenida con dirección, seguimiento y consistencia estructural.',
  },
]

export function System() {
  const gridRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<SVGLineElement>(null)

  // Único momento scroll-linked del home: la línea de plata que conecta
  // las 4 fases se dibuja a medida que la sección entra en viewport.
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion || !railRef.current) return

      gsap.set(railRef.current, { strokeDasharray: 100, strokeDashoffset: 100 })
      gsap.to(railRef.current, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 75%',
          end: 'bottom 55%',
          scrub: true,
        },
      })
    },
    { scope: gridRef }
  )

  return (
    <Section id="sistema">
      <div className="space-y-5 md:space-y-6">
        <FadeIn>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8">
            <div className="max-w-3xl space-y-3 md:space-y-4">
              <Eyebrow>El sistema VINDEX</Eyebrow>

              <h2 className="max-w-[16ch] text-2xl font-extrabold leading-tight sm:text-3xl md:max-w-[14ch] md:text-5xl">
                Cada conflicto requiere una lectura propia. Por eso la intervención
                se estructura en fases.
              </h2>

              <p className="max-w-[62ch] text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base md:text-lg md:leading-8">
                El método no busca impresionar. Busca comprender, evaluar y actuar
                con precisión donde el margen de error es bajo.
              </p>
            </div>

            <div>
              <Button href="/sistema" variant="secondary">
                Ver el sistema completo
              </Button>
            </div>
          </div>
        </FadeIn>

        <StaggerFadeIn delay={0.12}>
          <div ref={gridRef} className="relative">
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-6 hidden h-px w-full lg:block"
              preserveAspectRatio="none"
              viewBox="0 0 100 1"
            >
              <line
                ref={railRef}
                x1="0"
                y1="0.5"
                x2="100"
                y2="0.5"
                pathLength={100}
                stroke="var(--vindex-silver)"
                strokeWidth="0.6"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {phases.map((phase) => (
                <Card
                  key={phase.eyebrow}
                  eyebrow={phase.eyebrow}
                  title={phase.title}
                  description={phase.description}
                />
              ))}
            </div>
          </div>
        </StaggerFadeIn>
      </div>
    </Section>
  )
}