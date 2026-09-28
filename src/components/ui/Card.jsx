import { cn } from '../../utils/cn'

export function Card({ children, className, hover = true, ...props }) {
  return (
    <div
      className={cn(
        'glass-panel rounded-xl p-5 relative overflow-hidden transition-all duration-300',
        hover && 'glass-panel-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('flex items-center justify-between gap-4 mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3
      className={cn(
        'font-heading text-sm font-semibold tracking-wider uppercase text-[#BECFFF] flex items-center gap-2',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('text-xs text-[#9CA3AF]', className)} {...props}>
      {children}
    </p>
  )
}
