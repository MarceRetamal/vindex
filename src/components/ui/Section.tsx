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
  soft: 'bg-black/20',
  surface: 'bg-transparent',
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
      className={`py-16 md:py-24 xl:py-32 ${variants[variant]} ${className}`}
    >
      <Container className={innerClassName}>{children}</Container>
    </section>
  )
}