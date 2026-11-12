import { Server, Compass, Eye, Network } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { getApiBaseUrl } from '@/services/api'

export function SystemInfoModal({ isOpen, onClose, healthInfo }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sistema y Arquitectura ColdTrack">
      <div className="space-y-6 text-xs text-cold-muted">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-cold-divider/10">
          <div className="p-4 rounded-xl bg-cold-shade/50 border border-cold-ice/20">
            <div className="flex items-center gap-2 mb-2 text-cold-ice">
              <Compass className="w-4 h-4" />
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-cold-text">
                Misión
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-cold-muted">
              Garantizar la integridad absoluta de la cadena de frío industrial mediante telemetría IoT de alta resolución, detección proactiva de fallas térmicas y monitoreo predictivo de sistemas frigoríficos.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-cold-shade/50 border border-cold-lavender/20">
            <div className="flex items-center gap-2 mb-2 text-cold-lavender">
              <Eye className="w-4 h-4" />
              <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-cold-text">
                Visión
              </h3>
            </div>
            <p className="text-xs leading-relaxed text-cold-muted">
              Ser el estándar de referencia en observabilidad y diagnóstico automatizado para flotas de frío comercial y transporte refrigerado inteligente.
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-cold-ice mb-3 flex items-center gap-2">
            <Network className="w-3.5 h-3.5" />
            Flujo de Datos y Pipeline de Telemetría
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-cold-divider/5">
              <span className="block text-[10px] text-cold-lavender uppercase font-bold">1. Hardware</span>
              <span className="font-medium text-cold-text block mt-1">Circuito Tinkercad</span>
              <span className="text-[10px] text-cold-muted">Sensores & MCU</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-cold-divider/5">
              <span className="block text-[10px] text-cold-lavender uppercase font-bold">2. Enlace</span>
              <span className="font-medium text-cold-text block mt-1">Chrome Serial Ext.</span>
              <span className="text-[10px] text-cold-muted">Monitor Serie JSON</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-900/60 border border-cold-divider/5">
              <span className="block text-[10px] text-cold-lavender uppercase font-bold">3. Gateway</span>
              <span className="font-medium text-cold-text block mt-1">IoT Gateway (8080)</span>
              <span className="text-[10px] text-cold-muted">Serialización & Filtro</span>
            </div>
            <div className="p-2.5 rounded-lg bg-cold-ice/10 border border-cold-ice/30">
              <span className="block text-[10px] text-cold-ice uppercase font-bold">4. API & UI</span>
              <span className="font-medium text-cold-ice block mt-1">ColdTrack API</span>
              <span className="text-[10px] text-cold-muted">Persistencia SQLite</span>
            </div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-cold-shade/60 border border-cold-divider/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-heading font-semibold text-xs text-cold-text flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-cold-ice" />
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
