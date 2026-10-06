import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type CardProps = {
  title: string
  description: string
  eyebrow?: string
  className?: string
  footer?: ReactNode
  as?: 'h2' | 'h3'
}

export function Card({ title, description, eyebrow, className = '', footer, as: Heading = 'h3' }: CardProps) {
  return (
    <article
      data-glass
      className={cn(
        'glass glass-lift group flex h-full flex-col overflow-hidden rounded-[24px] p-6 md:p-8',
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)] md:mb-4 md:text-xs">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-xl font-bold leading-tight text-white md:text-2xl">{title}</Heading>
      <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)] md:mt-4 md:text-base">
        {description}
      </p>
      {footer ? <div className="mt-5 md:mt-6">{footer}</div> : null}
    </article>
  )
}
