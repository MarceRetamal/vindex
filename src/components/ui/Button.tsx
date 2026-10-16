import Link from 'next/link'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/Spinner'

type ButtonBase = {
  children: ReactNode
  /** `primary`: acción principal de la pantalla (una por bloque). `secondary`: alternativa. */
  variant?: 'primary' | 'secondary'
  /** `sm` es la versión compacta del encabezado. */
  size?: 'md' | 'sm'
  /** Flecha a la derecha. Se oculta sola mientras `loading` está activo. */
  arrow?: boolean
  className?: string
}

/** Con `href` se renderiza un enlace (interno con next/link, externo con <a>). */
type ButtonAsLink = ButtonBase &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'> & {
    href: string
    /** Abre en otra pestaña con `rel="noopener noreferrer"`. */
    external?: boolean
  }

/** Sin `href` se renderiza un <button>. */
type ButtonAsButton = ButtonBase &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
    href?: undefined
    /** Muestra el indicador de carga, deshabilita el botón y marca `aria-busy`. */
    loading?: boolean
    /** Texto que reemplaza a `children` mientras carga (ej.: "Enviando..."). */
    loadingLabel?: ReactNode
  }

export type ButtonProps = ButtonAsLink | ButtonAsButton

const BASE =
  'glass-btn w-full sm:w-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]'

function clases({ variant = 'primary', size = 'md', className }: ButtonBase) {
  return cn(
    BASE,
    variant === 'primary' ? 'glass-btn-primary' : 'glass-btn-secondary',
    size === 'sm' && '!py-2.5 !px-5',
    className
  )
}

const Flecha = () => <ArrowRight aria-hidden className="glass-btn-arrow h-4 w-4" />

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { href, external, children, variant, size, arrow = true, className, ...resto } = props
    const contenido = (
      <>
        <span>{children}</span>
        {arrow ? <Flecha /> : null}
      </>
    )
    const className_ = clases({ variant, size, className, children })

    if (external) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" data-glass className={className_} {...resto}>
          {contenido}
        </a>
      )
    }
    return (
      <Link href={href} data-glass className={className_} {...resto}>
        {contenido}
      </Link>
    )
  }

  const {
    children,
    variant,
    size,
    arrow = true,
    className,
    loading = false,
    loadingLabel,
    disabled,
    type = 'button',
    ...resto
  } = props

  return (
    <button
      type={type}
      data-glass
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={clases({
        variant,
        size,
        children,
        className: cn('disabled:cursor-not-allowed disabled:opacity-50', className),
      })}
      {...resto}
    >
      {loading ? <Spinner /> : null}
      <span>{loading && loadingLabel ? loadingLabel : children}</span>
      {arrow && !loading ? <Flecha /> : null}
    </button>
  )
}
