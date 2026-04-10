import { ReactNode } from 'react'

type PageBlockProps = {
  children: ReactNode
  className?: string
}

export function PageBlock({
  children,
  className = '',
}: PageBlockProps) {
  return <div className={`mt-10 md:mt-14 ${className}`}>{children}</div>
}