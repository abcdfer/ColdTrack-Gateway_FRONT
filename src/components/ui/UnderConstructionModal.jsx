import { Construction, Sparkles, ArrowRight } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

export function UnderConstructionModal({ isOpen, onClose, moduleName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Módulo en Construcción">
      <div className="flex flex-col items-center text-center py-4 px-2 space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-[#0C0B0E] border border-[#BECFFF]/30 flex items-center justify-center text-[#BECFFF] shadow-[0_0_25px_rgba(190,207,255,0.25)]">
            <Construction className="w-8 h-8 text-[#BECFFF] animate-pulse" />
          </div>
          <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#A296BC]/20 border border-[#A296BC]/40 flex items-center justify-center text-[#A296BC]">
            <Sparkles className="w-3 h-3" />
          </div>
        </div>

        <div className="space-y-1.5 max-w-sm">
          <h3 className="font-heading font-bold text-base text-[#F3F4F6] tracking-wide">
            {moduleName || 'Sección del Sistema'}
          </h3>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            Esta sección se encuentra actualmente en proceso de integración y desarrollo dentro de la plataforma ColdTrack.
          </p>
        </div>

        <div className="w-full p-3 rounded-xl bg-black/40 border border-white/5 text-left text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#A296BC]">Estado de Entrega:</span>
            <span className="font-mono text-[#BECFFF] font-semibold">Sprint Próximo</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#A296BC]">Compatibilidad IoT:</span>
            <span className="font-mono text-emerald-400 font-semibold">En Cola de Despliegue</span>
          </div>
        </div>

        <div className="w-full flex items-center justify-end gap-2 pt-2 border-t border-white/10">
          <Button variant="primary" size="sm" onClick={onClose} className="w-full sm:w-auto">
            <span>Entendido</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Modal>
  )
}
