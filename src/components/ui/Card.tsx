import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Overline } from '@/components/ui/Overline'

type CardProps = {
  title: string
  description: string
  eyebrow?: string
  className?: string
  footer?: ReactNode
  /** Imagen o elemento a todo el ancho, arriba de la tarjeta (ej.: portada de una nota). */
  media?: ReactNode
  as?: 'h2' | 'h3'
}

export function Card({ title, description, eyebrow, className = '', footer, media, as: Heading = 'h3' }: CardProps) {
  return (
    <article
      data-glass
      className={cn(
        'glass glass-lift group flex h-full flex-col overflow-hidden rounded-[24px] p-6 md:p-8',
        className
      )}
    >
      {media ? <div className="-mx-6 -mt-6 mb-5 md:-mx-8 md:-mt-8 md:mb-6">{media}</div> : null}
      {eyebrow ? (
        <Overline className="mb-3 md:mb-4 md:text-xs">
          {eyebrow}
        </Overline>
      ) : null}
      <Heading className="text-xl font-bold leading-tight text-white md:text-2xl">{title}</Heading>
      <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)] md:mt-4 md:text-base">
        {description}
      </p>
      {footer ? <div className="mt-5 md:mt-6">{footer}</div> : null}
    </article>
  )
}
