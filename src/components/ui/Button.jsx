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
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#BECFFF]/40 disabled:cursor-not-allowed select-none rounded-lg cursor-pointer'

  const variants = {
    primary:
      'bg-[#BECFFF] text-black font-semibold hover:bg-white hover:shadow-[0_0_20px_rgba(190,207,255,0.45)] active:scale-[0.98] disabled:bg-[#1F2430] disabled:text-[#9CA3AF]/40 disabled:shadow-none',
    secondary:
      'bg-[#A296BC]/15 text-[#BECFFF] border border-[#A296BC]/30 hover:bg-[#A296BC]/25 hover:border-[#BECFFF]/40 active:scale-[0.98] disabled:bg-[#121216] disabled:text-[#9CA3AF]/30 disabled:border-transparent',
    outline:
      'bg-transparent text-[#F3F4F6] border border-white/15 hover:border-[#BECFFF]/50 hover:text-[#BECFFF] hover:bg-[#BECFFF]/5 active:scale-[0.98] disabled:opacity-40 disabled:border-white/5',
    ghost:
      'bg-transparent text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5 active:scale-[0.98] disabled:opacity-40',
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
