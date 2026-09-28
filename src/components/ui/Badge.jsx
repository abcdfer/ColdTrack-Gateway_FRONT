import { cn } from '../../utils/cn'

export function Badge({ children, variant = 'default', className, ...props }) {
  const variants = {
    default: 'bg-[#BECFFF]/10 text-[#BECFFF] border-[#BECFFF]/25',
    secondary: 'bg-[#A296BC]/10 text-[#A296BC] border-[#A296BC]/25',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
    outline: 'bg-transparent text-[#9CA3AF] border-white/10',
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
