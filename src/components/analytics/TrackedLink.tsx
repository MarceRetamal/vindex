'use client'

import type { ReactNode } from 'react'
import { track } from '@/lib/track'

type TrackedLinkProps = {
  href: string
  /** Nombre del evento que se envía a GA4 al hacer clic (ej.: contact_click). */
  evento: string
  params?: Record<string, string | number>
  className?: string
  external?: boolean
  children: ReactNode
}

// Enlace común (tel:, https://wa.me/..., mailto:) que además avisa a GA4 cuando
// alguien hace clic. Sirve para medir contactos que no pasan por el formulario.
export function TrackedLink({ href, evento, params, className, external = false, children }: TrackedLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => track(evento, params)}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}
