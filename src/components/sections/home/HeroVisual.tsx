'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    if (!containerRef.current) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const tl = gsap.timeline({ delay: 0.2 })

    // Architectural drawing effect
    tl.from('.v-line', {
      scaleY: 0,
      transformOrigin: 'top',
      duration: 1.5,
      ease: 'power3.inOut',
      stagger: 0.1
    }, 0)

    tl.from('.h-line', {
      scaleX: 0,
      transformOrigin: 'left',
      duration: 1.5,
      ease: 'power3.inOut',
      stagger: 0.1
    }, 0.2)

    tl.from('.hero-circle', {
      scale: 0.8,
      opacity: 0,
      duration: 2,
      ease: 'power2.out',
      stagger: 0.2
    }, 0.4)

    tl.from('.hero-card', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, 1.2)

  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="relative w-full max-w-sm mx-auto md:max-w-none">
      <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-[24px] border border-[var(--border-strong)] bg-[var(--bg-elevated)] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        
        {/* Architectural Grid Lines */}
        <div className="h-line absolute top-1/4 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />
        <div className="h-line absolute top-3/4 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--border-strong)] to-transparent" />
        <div className="v-line absolute left-1/4 inset-y-0 w-px bg-gradient-to-b from-transparent via-[var(--border-strong)] to-transparent" />
        <div className="v-line absolute left-3/4 inset-y-0 w-px bg-gradient-to-b from-transparent via-[var(--border-strong)] to-transparent" />

        {/* Central Focus Rings */}
        <div className="hero-circle absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.08]" />
        <div className="hero-circle absolute left-1/2 top-1/2 h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--accent)]/30 backdrop-blur-sm" />

        {/* Intersection Markers */}
        <div className="v-line absolute left-1/2 top-[10%] h-[80%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--accent-bright)] to-transparent opacity-60" />
        <div className="h-line absolute bottom-[40%] left-1/2 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-60" />

        {/* Floating Strategic Card */}
        <div className="hero-card absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10 rounded-[16px] border border-[var(--border-strong)] bg-[var(--bg-surface)]/80 p-5 md:p-6 backdrop-blur-xl shadow-[var(--shadow-float)]">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-[var(--accent)] shadow-[var(--shadow-glow)]"></span>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              Marco Táctico
            </p>
          </div>
          <p className="mt-3 text-[14px] leading-[1.6] text-[var(--text-primary)]">
            La superioridad estructural no se improvisa. Se diseña.
          </p>
        </div>
      </div>
    </div>
  )
}