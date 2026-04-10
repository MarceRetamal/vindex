import { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'

type SectionVariant = 'default' | 'soft' | 'surface'

type SectionProps = {
  children: ReactNode
  id?: string
  className?: string
  innerClassName?: string
  variant?: SectionVariant
}

const variants: Record<SectionVariant, string> = {
  default: 'bg-transparent',
  soft: 'bg-[var(--bg-soft)]',
  surface: 'bg-[var(--surface-1)]',
}

export function Section({
  children,
  id,
  className = '',
  innerClassName = '',
  variant = 'default',
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-12 md:py-16 xl:py-24 ${variants[variant]} ${className}`}
    >
      <Container className={innerClassName}>{children}</Container>
    </section>
  )
}