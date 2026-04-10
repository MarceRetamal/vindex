import { ReactNode } from 'react'

type PageShellProps = {
  children: ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-6 pt-12 pb-20 md:px-8 md:pt-20 md:pb-28">
      {children}
    </div>
  )
}