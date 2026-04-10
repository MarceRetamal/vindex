'use client'

import { ReactNode, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type FadeInProps = {
  children: ReactNode
  delay?: number
  y?: number
  duration?: number
  className?: string
}

export function FadeIn({
  children,
  delay = 0,
  y = 24,
  duration = 0.8,
  className,
}: FadeInProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduceMotion) {
        gsap.set(containerRef.current, { opacity: 1, y: 0, visibility: 'visible' })
        return
      }

      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y,
          visibility: 'hidden',
        },
        {
          opacity: 1,
          y: 0,
          visibility: 'visible',
          duration,
          delay,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 88%',
            once: true,
          },
        }
      )
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className={cn('opacity-0 [visibility:hidden]', className)}>
      {children}
    </div>
  )
}