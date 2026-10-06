'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

type StaggerFadeInProps = {
  children: ReactNode
  delay?: number
  y?: number
  stagger?: number
  className?: string
  duration?: number
}

/** Cada hijo directo del primer contenedor entra escalonado al ser visible. */
export function StaggerFadeIn({ children, delay = 0, y = 28, stagger = 0.1, className }: StaggerFadeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const inner = root.firstElementChild as HTMLElement | null
    const targets = Array.from((inner && inner.children.length > 0 ? inner : root).children) as HTMLElement[]
    targets.forEach((t, i) => {
      t.dataset.reveal = ''
      t.style.setProperty('--reveal-y', `${y}px`)
      t.style.setProperty('--reveal-delay', `${delay + i * stagger}s`)
    })
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          targets.forEach((t) => (t.dataset.in = 'true'))
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    )
    io.observe(root)
    return () => io.disconnect()
  }, [delay, stagger, y])

  return <div ref={ref} className={cn(className)}>{children}</div>
}
