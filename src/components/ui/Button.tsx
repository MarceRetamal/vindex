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
    'inline-flex w-full whitespace-nowrap items-center justify-center rounded-[8px] px-5 py-[13px] text-sm font-bold transition-all duration-300 ease-out hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)] sm:w-auto'

  const variants = {
    primary:
      'bg-[var(--accent)] text-[var(--bg-deep)] hover:bg-[var(--accent-hover)] hover:shadow-[0_10px_30px_rgba(212,175,55,0.22)] focus-visible:ring-[var(--accent)]',
    secondary:
      'border border-[var(--vindex-silver)]/25 bg-transparent text-[var(--text-primary)] hover:border-[var(--vindex-silver)]/60 hover:bg-white/[0.03] focus-visible:ring-[var(--vindex-silver)]',
  }

  return (
    <Link href={href} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  )
}