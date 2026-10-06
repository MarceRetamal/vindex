'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type FadeInProps = {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  /** compat con la API anterior; la duración vive en CSS */
  duration?: number
}

/**
 * Revelado por IntersectionObserver + transiciones CSS (sin GSAP en el
 * camino crítico). El contenido es visible si JS no corre (ver
 * <noscript> en el layout) y respeta prefers-reduced-motion en CSS.
 */
export function FadeIn({ children, delay = 0, y = 28, className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            ;(e.target as HTMLElement).dataset.in = 'true'
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal
      style={{ ['--reveal-y' as string]: `${y}px`, ['--reveal-delay' as string]: `${delay}s` }}
      className={cn(className)}
    >
      {children}
    </div>
  )
}
