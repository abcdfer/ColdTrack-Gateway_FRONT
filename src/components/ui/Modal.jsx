import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

export function Modal({ isOpen, onClose, title, children, className }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full max-w-xl glass-panel rounded-2xl p-6 shadow-2xl z-10 border border-cold-ice/25 overflow-hidden animate-in fade-in zoom-in-95 duration-200',
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-cold-divider/10 mb-4">
          <h2 className="font-heading text-lg font-bold text-cold-text tracking-wide flex items-center gap-2">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-cold-muted hover:text-cold-ice hover:bg-cold-divider/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="custom-scrollbar max-h-[80vh] overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  )
}
