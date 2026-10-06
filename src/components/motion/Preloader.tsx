'use client'

import { useEffect, useState } from 'react'

/**
 * Pantalla de entrada de vidrio, solo en la primera visita de la sesión.
 * Se pinta en el HTML del servidor (sin parpadeo) y se retira a los ~1.3 s;
 * no bloquea la hidratación ni el LCP del contenido que hay debajo.
 */
export function Preloader() {
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    let seen = false
    try {
      seen = sessionStorage.getItem('vindex-intro') === '1'
      sessionStorage.setItem('vindex-intro', '1')
    } catch {}
    const t = setTimeout(() => setDone(true), seen ? 0 : 1300)
    const t2 = setTimeout(() => setGone(true), seen ? 50 : 2200)
    return () => {
      clearTimeout(t)
      clearTimeout(t2)
    }
  }, [])

  if (gone) return null

  return (
    <div className="preloader" data-done={done} aria-hidden="true">
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative h-24 w-24">
          <span className="absolute inset-0 rounded-full border border-white/20" style={{ animation: 'pulse-ring 1.6s ease-out infinite' }} />
          <div className="glass glass-strong absolute inset-0 grid place-items-center overflow-hidden rounded-[28px]">
            <span className="text-4xl font-black text-white">V</span>
            <span className="absolute inset-y-0 w-1/3 bg-white/30" style={{ animation: 'sheen 1.4s var(--ease-liquid) infinite' }} />
          </div>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-[var(--vindex-silver)]">Vindex Legal</p>
      </div>
    </div>
  )
}
