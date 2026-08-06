import { ReactNode } from 'react'

type EyebrowProps = {
  children: ReactNode
  className?: string
}

export function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--vindex-silver)] md:text-xs md:tracking-[0.24em] ${className}`}
    >
      {children}
    </p>
  )
}