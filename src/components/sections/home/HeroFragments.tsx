'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { heroFragments } from '@/content/design-slots'

/**
 * Fragmentos de vidrio alrededor de la V del hero, como si se fuera
 * leyendo un expediente mientras la V se arma. Si heroFragments está
 * vacío no se renderiza nada — el hero se ve completo solo con la V.
 */
export function HeroFragments() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const items = gsap.utils.toArray<HTMLElement>('.hero-fragment')
      if (reduceMotion) {
        gsap.set(items, { opacity: 1, y: 0 })
        return
      }
      gsap.fromTo(
        items,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.35,
          delay: 0.6,
        }
      )
    },
    { scope: containerRef }
  )

  if (heroFragments.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 hidden md:block"
    >
      {heroFragments.slice(0, 6).map((fragment, i) => {
        const position = FRAGMENT_POSITIONS[i % FRAGMENT_POSITIONS.length]
        return (
          <div
            key={fragment}
            className={`hero-fragment absolute max-w-[220px] rounded-[10px] border border-[var(--vindex-silver)]/20 bg-white/[0.03] px-3.5 py-2.5 text-[12px] leading-snug text-[var(--text-secondary)] backdrop-blur-[8px] ${position}`}
          >
            {fragment}
          </div>
        )
      })}
    </div>
  )
}

const FRAGMENT_POSITIONS = [
  'left-[2%] top-[12%]',
  'right-[0%] top-[28%]',
  'left-[0%] bottom-[22%]',
  'right-[4%] bottom-[10%]',
  'left-[10%] top-[48%]',
  'right-[10%] top-[6%]',
]
