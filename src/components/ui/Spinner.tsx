import { cn } from '@/lib/utils'

/**
 * Indicador de carga circular. Es decorativo: el estado se anuncia en el
 * componente que lo usa (por ejemplo, `aria-busy` y el texto del botón).
 */
export function Spinner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={cn('h-4 w-4 animate-spin motion-reduce:animate-none', className)}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity=".25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
