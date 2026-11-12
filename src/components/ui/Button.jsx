import { cn } from '../../utils/cn'

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cold-ice/40 disabled:cursor-not-allowed select-none rounded-lg cursor-pointer'

  const variants = {
    primary:
      'bg-cold-ice text-cold-on-accent font-semibold hover:bg-cold-accent-hover hover:shadow-[0_0_20px_rgba(190,207,255,0.45)] active:scale-[0.98] disabled:bg-cold-disabled disabled:text-cold-muted/40 disabled:shadow-none',
    secondary:
      'bg-cold-lavender/15 text-cold-ice border border-cold-lavender/30 hover:bg-cold-lavender/25 hover:border-cold-ice/40 active:scale-[0.98] disabled:bg-cold-subtle disabled:text-cold-muted/30 disabled:border-transparent',
    outline:
      'bg-transparent text-cold-text border border-cold-divider/15 hover:border-cold-ice/50 hover:text-cold-ice hover:bg-cold-ice/5 active:scale-[0.98] disabled:opacity-40 disabled:border-cold-divider/5',
    ghost:
      'bg-transparent text-cold-muted hover:text-cold-text hover:bg-cold-divider/5 active:scale-[0.98] disabled:opacity-40',
    danger:
      'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 hover:border-rose-400 active:scale-[0.98] disabled:opacity-40',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-sm px-4 py-2 h-10',
    lg: 'text-base px-6 py-3 h-12',
    icon: 'h-9 w-9 p-0',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
