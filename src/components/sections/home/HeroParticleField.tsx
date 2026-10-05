'use client'

import dynamic from 'next/dynamic'
import { useSyncExternalStore } from 'react'

const ParticleV = dynamic(
  () => import('@/components/sections/home/ParticleV').then((mod) => mod.ParticleV),
  { ssr: false }
)

/**
 * V estática (misma geometría que src/app/icon.svg) usada como fallback:
 * prefers-reduced-motion, y como primer frame antes de que el canvas
 * monte, para no dejar el hero vacío ni mover layout al hidratar.
 */
function StaticIsotypeV() {
  return (
    <div className="relative aspect-square w-full max-w-[520px] mx-auto md:aspect-[4/5] md:max-w-none">
      <svg
        viewBox="0 0 512 512"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M154 128L256 336L358 128H404L278 384H234L108 128H154Z"
          fill="var(--vindex-silver)"
          opacity={0.85}
        />
      </svg>
    </div>
  )
}

function subscribe() {
  // No cambia en caliente: prefers-reduced-motion no se re-evalúa en vivo acá,
  // solo al montar. Sin listener real que suscribir.
  return () => {}
}

function getCanvasReady() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return !reduceMotion && typeof window.CanvasRenderingContext2D !== 'undefined'
}

function getServerSnapshot() {
  return false
}

export function HeroParticleField() {
  const ready = useSyncExternalStore(subscribe, getCanvasReady, getServerSnapshot)

  if (!ready) return <StaticIsotypeV />
  return <ParticleV />
}
