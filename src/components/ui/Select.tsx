import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'flex h-12 w-full appearance-none rounded-[16px] glass-field px-4 py-2 pr-10 text-[15px] text-white transition-colors duration-300 ease-out placeholder:text-[var(--text-muted)] hover:border-white/20 focus-visible:outline-none focus-visible:border-[var(--accent-bright)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute right-3 top-0 flex h-full items-center text-[var(--text-muted)]">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    )
  }
)
Select.displayName = 'Select'

export { Select }
