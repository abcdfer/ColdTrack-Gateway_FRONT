import { Server, Compass, Eye, Network } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { getApiBaseUrl } from '../../services/apiService'

export function SystemInfoModal({ isOpen, onClose, healthInfo }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sistema y Arquitectura ColdTrack">
      <div className="space-y-6 text-xs text-[#9CA3AF]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-white/10">
          <div className="p-4 rounded-xl bg-black/50 border border-[#BECFFF]/20">
            <div className="flex items-center gap-2 mb-2 text-[#BECFFF]">
              <Compass className="w-4 h-4" />
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#F3F4F6]">
                Misión
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#9CA3AF]">
              Garantizar la integridad absoluta de la cadena de frío industrial mediante telemetría IoT de alta resolución, detección proactiva de fallas térmicas y monitoreo predictivo de sistemas frigoríficos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/50 border border-[#A296BC]/20">
            <div className="flex items-center gap-2 mb-2 text-[#A296BC]">
              <Eye className="w-4 h-4" />
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-[#F3F4F6]">
                Visión
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-[#9CA3AF]">
              Ser el estándar de referencia en observabilidad y diagnóstico automatizado para flotas de frío comercial y transporte refrigerado inteligente.
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-[#BECFFF] mb-3 flex items-center gap-2">
            <Network className="w-3.5 h-3.5" />
            Flujo de Datos y Pipeline de Telemetría
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5">
              <span className="block text-[10px] text-[#A296BC] uppercase font-bold">1. Hardware</span>
              <span className="font-medium text-[#F3F4F6] block mt-1">Circuito Tinkercad</span>
              <span className="text-[10px] text-[#9CA3AF]">Sensores & MCU</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5">
              <span className="block text-[10px] text-[#A296BC] uppercase font-bold">2. Enlace</span>
              <span className="font-medium text-[#F3F4F6] block mt-1">Chrome Serial Ext.</span>
              <span className="text-[10px] text-[#9CA3AF]">Monitor Serie JSON</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-white/5">
              <span className="block text-[10px] text-[#A296BC] uppercase font-bold">3. Gateway</span>
              <span className="font-medium text-[#F3F4F6] block mt-1">IoT Gateway (8080)</span>
              <span className="text-[10px] text-[#9CA3AF]">Serialización & Filtro</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#BECFFF]/10 border border-[#BECFFF]/30">
              <span className="block text-[10px] text-[#BECFFF] uppercase font-bold">4. API & UI</span>
              <span className="font-medium text-[#BECFFF] block mt-1">ColdTrack API</span>
              <span className="text-[10px] text-[#9CA3AF]">Persistencia SQLite</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-xs text-[#F3F4F6] flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-[#BECFFF]" />
              Configuración de Conexión API
            </span>
            {healthInfo && (
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                v{healthInfo.version || '1.3.0'} · {healthInfo.storage || 'sqlite'}
              </span>
            )}
          </div>
          <p className="break-all font-mono">{getApiBaseUrl()}</p>
        </div>
      </div>
    </Modal>
  )
}
