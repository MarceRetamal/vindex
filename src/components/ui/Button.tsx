'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ButtonProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
  arrow?: boolean
}

export function Button({
  href,
  children,
  variant = 'primary',
  className,
  arrow = true,
}: ButtonProps) {
  return (
    <Link
      href={href}
      data-glass
      className={cn(
        'glass-btn w-full sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]',
        variant === 'primary' ? 'glass-btn-primary' : 'glass-btn-secondary',
        className
      )}
    >
      <span>{children}</span>
      {arrow ? <ArrowRight aria-hidden className="glass-btn-arrow h-4 w-4" /> : null}
    </Link>
  )
}
