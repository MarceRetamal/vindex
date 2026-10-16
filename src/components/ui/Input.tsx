import * as React from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-12 w-full rounded-[16px] glass-field px-4 py-2 text-[15px] text-white transition-colors duration-300 ease-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[var(--text-muted)] hover:border-white/20 focus-visible:outline-none focus-visible:border-[var(--accent-bright)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
