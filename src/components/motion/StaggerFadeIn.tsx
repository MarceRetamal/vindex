'use client'

import { ReactNode, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type StaggerFadeInProps = {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  stagger?: number
  className?: string
}

export function StaggerFadeIn({
  children,
  delay = 0,
  y = 24,
  duration = 0.8,
  stagger = 0.12,
  className,
}: StaggerFadeInProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const element = containerRef.current
      const inner = element.firstElementChild as HTMLElement | null
      const targets =
        inner && inner.children.length > 0
          ? Array.from(inner.children)
          : Array.from(element.children)

      if (targets.length === 0) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduceMotion) {
        gsap.set(targets, { opacity: 1, y: 0, visibility: 'visible', autoAlpha: 1 })
        return
      }

      // Force container visible so children can be seen
      gsap.set(element, { opacity: 1, visibility: 'visible', autoAlpha: 1 })
      
      // Initial state to prevent FOUC for targets
      gsap.set(targets, { opacity: 0, visibility: 'hidden', y })

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        visibility: 'visible',
        duration,
        delay,
        stagger,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 88%',
          once: true,
        },
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className={cn('opacity-0 [visibility:hidden]', className)}>
      {children}
    </div>
  )
}