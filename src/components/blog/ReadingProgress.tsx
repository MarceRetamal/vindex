'use client'

import { useEffect, useRef } from 'react'

// Efecto "gradiente de meta": ver cuánto falta reduce el abandono mucho más
// que no ver nada. Es la misma señal que usan Medium o el NYT en sus notas.
//
// El ancho se escribe directo en el estilo de la barra, una vez por cuadro
// (requestAnimationFrame), sin re-renderizar React en cada evento de scroll.
export function ReadingProgress() {
  const barraRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cuadro = 0

    const calcular = () => {
      cuadro = 0
      const alto = document.documentElement.scrollHeight - window.innerHeight
      const avance = alto > 0 ? (window.scrollY / alto) * 100 : 0
      if (barraRef.current) barraRef.current.style.width = `${Math.min(100, Math.max(0, avance))}%`
    }
    const programar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(calcular)
    }

    calcular()
    window.addEventListener('scroll', programar, { passive: true })
    window.addEventListener('resize', programar)
    return () => {
      window.removeEventListener('scroll', programar)
      window.removeEventListener('resize', programar)
      cancelAnimationFrame(cuadro)
    }
  }, [])

  return (
    <div className="vindex-progress-track" role="presentation">
      <div ref={barraRef} className="vindex-progress-bar" style={{ width: '0%' }} />
    </div>
  )
}
