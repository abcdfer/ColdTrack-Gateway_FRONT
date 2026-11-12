import { cn } from '../../utils/cn'

export function Badge({ children, variant = 'default', className, ...props }) {
  const variants = {
    default: 'bg-cold-ice/10 text-cold-ice border-cold-ice/25',
    secondary: 'bg-cold-lavender/10 text-cold-lavender border-cold-lavender/25',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    outline: 'bg-transparent text-cold-muted border-cold-divider/10',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide select-none',
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
