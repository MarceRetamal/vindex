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
    'inline-flex w-full whitespace-nowrap items-center justify-center rounded-[var(--button-radius)] px-[var(--button-padding-x)] py-[var(--button-padding-y)] text-[length:var(--button-font-size)] font-[var(--button-font-weight)] transition-all duration-[var(--button-transition-duration)] ease-out hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-main)] sm:w-auto'

  const variants = {
    primary:
      'bg-[var(--button-primary-rest-bg)] text-[var(--button-primary-rest-fg)] hover:bg-[var(--button-primary-hover-bg)] hover:text-[var(--button-primary-fg)] hover:shadow-[var(--button-primary-hover-shadow)] focus-visible:bg-[var(--button-primary-bg)] focus-visible:text-[var(--button-primary-fg)] focus-visible:ring-[var(--button-primary-bg)]',
    secondary:
      'border border-[var(--button-secondary-border)]/25 bg-transparent text-[var(--button-secondary-fg)] hover:border-[var(--button-secondary-border)]/60 hover:bg-[var(--button-secondary-hover-bg)] focus-visible:ring-[var(--button-secondary-border)]',
  }

  return (
    <Link href={href} className={`${base} ${variants[variant]}`}>
      {children}
    </Link>
  )
}