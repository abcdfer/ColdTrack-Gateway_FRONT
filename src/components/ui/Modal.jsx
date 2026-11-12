import { Dialog } from 'radix-ui'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Modal({ isOpen, onClose, title, children, className }) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md" />
        <Dialog.Content aria-describedby={undefined} className={cn(
          'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 glass-panel rounded-2xl p-6 shadow-2xl border border-cold-ice/25 overflow-hidden motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-200',
          className,
        )}>
          <div className="flex items-center justify-between pb-4 border-b border-cold-divider/10 mb-4">
            <Dialog.Title className="font-heading text-lg font-bold text-cold-text tracking-wide">
              {title}
            </Dialog.Title>
            <Dialog.Close type="button" aria-label="Cerrar diálogo" className="p-1.5 rounded-lg text-cold-muted hover:text-cold-ice hover:bg-cold-divider/10 transition-colors cursor-pointer">
              <X aria-hidden="true" className="w-5 h-5" />
            </Dialog.Close>
          </div>
          <div className="custom-scrollbar max-h-[min(80vh,calc(100dvh-8rem))] overflow-y-auto pr-1">
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
