'use client'

import { useEffect, useState } from 'react'

// Efecto "gradiente de meta": ver cuánto falta reduce el abandono mucho más
// que no ver nada. Es la misma señal que usan Medium o el NYT en sus notas.
export function ReadingProgress() {
  const [progreso, setProgreso] = useState(0)

  useEffect(() => {
    const calcular = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight
      const avance = alto > 0 ? (window.scrollY / alto) * 100 : 0
      setProgreso(Math.min(100, Math.max(0, avance)))
    }

    calcular()
    window.addEventListener('scroll', calcular, { passive: true })
    window.addEventListener('resize', calcular)
    return () => {
      window.removeEventListener('scroll', calcular)
      window.removeEventListener('resize', calcular)
    }
  }, [])

  return (
    <div className="vindex-progress-track" role="presentation">
      <div className="vindex-progress-bar" style={{ width: `${progreso}%` }} />
    </div>
  )
}
