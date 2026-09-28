import {
  Zap,
  Download,
  Sliders,
  Cpu,
  Bot,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { Card } from '../ui/Card'

export function RightSidebar({
  history = [],
  latestData = null,
  onOpenSimulator,
  onOpenInfo,
  onRefresh,
}) {
  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(history, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute(
      'download',
      `coldtrack_telemetry_${Date.now()}.json`
    )
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const currentRecord = latestData || history[0] || null
  const currentDiagnostico = currentRecord?.diagnostico || null
  const currentEstado = currentRecord?.estado || null
  const isFault = currentDiagnostico && currentDiagnostico !== 'SIN_FALLAS'

  return (
    <aside className="w-80 shrink-0 space-y-4">
      <Card className="border-[#BECFFF]/15 p-4">
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#BECFFF] mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#BECFFF]" />
          Acciones Rápidas
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={onRefresh}
            className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#A296BC]" />
              Sincronizar Gateway
            </span>
            <ArrowRight className="w-3 h-3 text-[#9CA3AF]" />
          </button>

          <button
            onClick={handleExportJSON}
            disabled={history.length === 0}
            className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5 transition-colors cursor-pointer text-left disabled:opacity-40"
          >
            <span className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-[#A296BC]" />
              Exportar Auditoría JSON
            </span>
            <ArrowRight className="w-3 h-3 text-[#9CA3AF]" />
          </button>

          <button
            onClick={onOpenSimulator}
            className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-[#BECFFF]" />
              Inyector de Telemetría
            </span>
            <ArrowRight className="w-3 h-3 text-[#9CA3AF]" />
          </button>

          <button
            onClick={onOpenInfo}
            className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-[#A296BC]" />
              Topología Tinkercad
            </span>
            <ArrowRight className="w-3 h-3 text-[#9CA3AF]" />
          </button>
        </div>
      </Card>

      <Card className="border-[#BECFFF]/25 bg-gradient-to-b from-[#BECFFF]/10 via-transparent to-transparent p-4 text-center">
        <div className="h-9 w-9 rounded-xl bg-[#BECFFF]/20 border border-[#BECFFF]/40 flex items-center justify-center mx-auto text-[#BECFFF] mb-2.5 shadow-[0_0_12px_rgba(190,207,255,0.25)]">
          <Bot className="w-5 h-5" />
        </div>
        <h4 className="font-heading font-bold text-xs text-[#F3F4F6]">
          Diagnóstico de Base de Datos
        </h4>
        <p className="text-[11px] text-[#A296BC] mt-1 mb-3 leading-snug">
          Estado verificado desde la API ColdTrack.
        </p>

        {currentRecord ? (
          <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-[11px] text-left space-y-1.5 mb-2">
            <div className="flex items-center justify-between">
              <span className="text-[#9CA3AF]">Equipo:</span>
              <span className="font-mono text-[#F3F4F6] font-semibold">
                {currentRecord.deviceId || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9CA3AF]">Diagnóstico:</span>
              <span
                className={`font-mono font-semibold flex items-center gap-1 ${
                  isFault ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {isFault ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <CheckCircle2 className="w-3 h-3" />
                )}
                {currentDiagnostico || 'SIN_FALLAS'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9CA3AF]">Estado:</span>
              <span className="font-mono text-[#BECFFF]">
                {currentEstado || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#9CA3AF]">Timestamp:</span>
              <span className="font-mono text-[10px] text-[#A296BC]">
                {currentRecord.receivedAt
                  ? new Date(currentRecord.receivedAt).toLocaleTimeString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-[#9CA3AF] py-2">
            Esperando lecturas de la base de datos...
          </p>
        )}
      </Card>

      <Card className="border-[#A296BC]/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-[#A296BC]">
            Actividad Reciente
          </h3>
          <span className="text-[10px] font-mono text-[#9CA3AF]">
            {history.length} eventos
          </span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          {history.length === 0 ? (
            <p className="text-[11px] text-[#9CA3AF] text-center py-4">
              Sin actividad registrada aún.
            </p>
          ) : (
            history.slice(0, 7).map((item, idx) => {
              const itemFault =
                item.diagnostico && item.diagnostico !== 'SIN_FALLAS'
              const time = item.receivedAt
                ? new Date(item.receivedAt).toLocaleTimeString()
                : 'N/A'

              return (
                <div
                  key={item.id || idx}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-black/40 border border-white/5 hover:border-white/10 transition-all"
                >
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      itemFault ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-semibold text-[11px] text-[#F3F4F6] truncate">
                        {item.deviceId || 'Equipo'}
                      </span>
                      <span className="text-[9px] font-mono text-[#9CA3AF] shrink-0">
                        {time}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#A296BC] truncate mt-0.5">
                      {item.diagnostico || 'Lectura nominal'} ·{' '}
                      {typeof item.tempInterior === 'number'
                        ? `${item.tempInterior.toFixed(1)}°C`
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>
    </aside>
  )
}
