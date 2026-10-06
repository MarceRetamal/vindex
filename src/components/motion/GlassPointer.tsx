'use client'

import { useEffect } from 'react'

/**
 * Un solo listener global: escribe --mx/--my en el [data-glass] bajo el
 * puntero para el reflejo especular del vidrio. Sin re-render de React.
 */
export function GlassPointer() {
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>('[data-glass]')
      if (!target) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const r = target.getBoundingClientRect()
        target.style.setProperty('--mx', `${e.clientX - r.left}px`)
        target.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])
  return null
}
