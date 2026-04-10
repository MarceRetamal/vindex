import Link from 'next/link'

type ButtonProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({
  href,
  children,
  variant = 'primary',
}: ButtonProps) {
  const base =
    'inline-flex w-full whitespace-nowrap items-center justify-center rounded-[8px] px-5 py-[13px] text-sm font-semibold transition-all duration-300 hover:-translate-y-[1px] sm:w-auto'

  const variants = {
    primary:
      'bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-hover)] hover:shadow-[0_10px_30px_rgba(176,141,87,0.18)]',
    secondary:
      'border border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-white/10 hover:bg-[var(--surface-1)]',
  }

  return (
    <Link href={href} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  )
}