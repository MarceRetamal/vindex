'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { FadeIn } from '@/components/motion/FadeIn'
import { StaggerFadeIn } from '@/components/motion/StaggerFadeIn'
import { HeroVisual } from '@/components/sections/home/HeroVisual'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Section } from '@/components/ui/Section'

const attributes = [
  'Análisis técnico',
  'Diseño estratégico',
  'Intervención procesal',
]

export function Hero() {
  const visualWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!visualWrapperRef.current) return

      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2

      const moveX = (e.clientX - centerX) / 120
      const moveY = (e.clientY - centerY) / 120

      visualWrapperRef.current.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <Section className="pt-12 sm:pt-16 md:pt-28">
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <FadeIn>
          <div className="space-y-5 md:space-y-7">
            <Eyebrow>Intervención jurídica de alta precisión</Eyebrow>

            <h1 className="max-w-[14ch] text-[2rem] font-extrabold leading-[1.05] sm:text-4xl md:text-6xl lg:text-7xl">
              Estrategia jurídica para conflictos complejos
            </h1>

            <p className="max-w-2xl text-[15px] leading-7 text-[var(--text-secondary)] sm:text-base md:text-lg md:leading-8">
              VINDEX LEGAL estructura análisis, evaluación e intervención para escenarios
              jurídicos en La Plata y en toda la Provincia de Buenos Aires, donde
              la claridad técnica, la lectura profunda del conflicto y la
              superioridad estratégica modifican el resultado.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 pt-1">
              <Button href="/evaluacion">Solicitar evaluación jurídica</Button>
              <Button href="/sistema" variant="secondary">
                Conocer el sistema
              </Button>
            </div>

            <StaggerFadeIn delay={0.1} stagger={0.08}>
              <ul className="grid gap-3 pt-2 text-sm text-[var(--text-secondary)] sm:grid-cols-3">
                {attributes.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-[var(--border)] bg-white/[0.02] px-4 py-3"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </StaggerFadeIn>

            <FadeIn delay={0.2}>
              <div className="pt-4">
                <p className="mb-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Acceso directo según su situación
                </p>
                <div className="flex flex-wrap gap-2.5">
                  <Link
                    href="/penal-urgente"
                    className="rounded-full border border-[var(--border-strong)] bg-white/[0.02] px-4 py-2 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/50 hover:text-white"
                  >
                    Denuncia o causa penal
                  </Link>
                  <Link
                    href="/sucesiones"
                    className="rounded-full border border-[var(--border-strong)] bg-white/[0.02] px-4 py-2 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/50 hover:text-white"
                  >
                    Sucesión
                  </Link>
                  <Link
                    href="/evaluacion"
                    className="rounded-full border border-[var(--border-strong)] bg-white/[0.02] px-4 py-2 text-[13px] font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/50 hover:text-white"
                  >
                    Otro conflicto
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </FadeIn>

        <div className="w-full mt-8 md:mt-0">
          <FadeIn delay={0.15}>
            <div
              ref={visualWrapperRef}
              className="transition-transform duration-500 ease-out will-change-transform"
            >
              <HeroVisual />
            </div>
          </FadeIn>
        </div>
      </div>
    </Section>
  )
}