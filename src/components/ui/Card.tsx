import { ReactNode } from 'react'

type CardProps = {
  title: string
  description: string
  eyebrow?: string
  className?: string
  footer?: ReactNode
}

export function Card({
  title,
  description,
  eyebrow,
  className = '',
  footer,
}: CardProps) {
  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] p-[var(--card-padding-mobile)] transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-[var(--card-border-hover)] hover:shadow-[var(--card-shadow-hover)] md:p-[var(--card-padding-desktop)] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--card-accent-line-hover)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex h-full flex-col">
        {eyebrow ? (
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--card-eyebrow-color)] md:mb-4 md:text-xs">
            {eyebrow}
          </p>
        ) : null}

        <h3 className="text-xl font-bold leading-tight text-[var(--card-title-color)] transition-colors duration-300 group-hover:text-[var(--card-title-color)] md:text-2xl">
          {title}
        </h3>

        <p className="mt-3 text-[15px] leading-7 text-[var(--card-body-color)] md:mt-4 md:text-base">
          {description}
        </p>

        {footer ? <div className="mt-5 md:mt-6">{footer}</div> : null}
      </div>
    </article>
  )
}