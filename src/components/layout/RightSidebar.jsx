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
      <Card className="border-cold-ice/15 p-4">
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-cold-ice mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cold-ice" />
          Acciones Rápidas
        </h3>
        <div className="space-y-1.5">
          <button
            onClick={onRefresh}
            className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-cold-muted hover:text-cold-text hover:bg-cold-divider/5 transition-colors cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cold-lavender" />
              Sincronizar Gateway
            </span>
            <ArrowRight className="w-3 h-3 text-cold-muted" />
          </button>

          <button
            onClick={handleExportJSON}
            disabled={history.length === 0}
            className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-cold-muted hover:text-cold-text hover:bg-cold-divider/5 transition-colors cursor-pointer text-left disabled:opacity-40"
          >
            <span className="flex items-center gap-2">
              <Download className="w-3.5 h-3.5 text-cold-lavender" />
              Exportar Auditoría JSON
            </span>
            <ArrowRight className="w-3 h-3 text-cold-muted" />
          </button>

          <button
            onClick={onOpenSimulator}
            className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-cold-muted hover:text-cold-text hover:bg-cold-divider/5 transition-colors cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-cold-ice" />
              Inyector de Telemetría
            </span>
            <ArrowRight className="w-3 h-3 text-cold-muted" />
          </button>

          <button
            onClick={onOpenInfo}
            className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-cold-muted hover:text-cold-text hover:bg-cold-divider/5 transition-colors cursor-pointer text-left"
          >
            <span className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-cold-lavender" />
              Topología Tinkercad
            </span>
            <ArrowRight className="w-3 h-3 text-cold-muted" />
          </button>
        </div>
      </Card>

      <Card className="border-cold-ice/25 bg-gradient-to-b from-cold-ice/10 via-transparent to-transparent p-4 text-center">
        <div className="h-9 w-9 rounded-xl bg-cold-ice/20 border border-cold-ice/40 flex items-center justify-center mx-auto text-cold-ice mb-2.5 shadow-[0_0_12px_rgba(190,207,255,0.25)]">
          <Bot className="w-5 h-5" />
        </div>
        <h4 className="font-heading font-bold text-xs text-cold-text">
          Diagnóstico de Base de Datos
        </h4>
        <p className="text-[11px] text-cold-lavender mt-1 mb-3 leading-snug">
          Estado verificado desde la API ColdTrack.
        </p>

        {currentRecord ? (
          <div className="p-2.5 rounded-lg bg-cold-shade/60 border border-cold-divider/10 text-[11px] text-left space-y-1.5 mb-2">
            <div className="flex items-center justify-between">
              <span className="text-cold-muted">Equipo:</span>
              <span className="font-mono text-cold-text font-semibold">
                {currentRecord.deviceId || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cold-muted">Diagnóstico:</span>
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
              <span className="text-cold-muted">Estado:</span>
              <span className="font-mono text-cold-ice">
                {currentEstado || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-cold-muted">Timestamp:</span>
              <span className="font-mono text-[10px] text-cold-lavender">
                {currentRecord.receivedAt
                  ? new Date(currentRecord.receivedAt).toLocaleTimeString()
                  : 'N/A'}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-cold-muted py-2">
            Esperando lecturas de la base de datos...
          </p>
        )}
      </Card>

      <Card className="border-cold-lavender/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-cold-lavender">
            Actividad Reciente
          </h3>
          <span className="text-[10px] font-mono text-cold-muted">
            {history.length} eventos
          </span>
        </div>

        <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar pr-1">
          {history.length === 0 ? (
            <p className="text-[11px] text-cold-muted text-center py-4">
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
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-cold-shade/40 border border-cold-divider/5 hover:border-cold-divider/10 transition-all"
                >
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      itemFault ? 'bg-rose-400 animate-pulse' : 'bg-emerald-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono font-semibold text-[11px] text-cold-text truncate">
                        {item.deviceId || 'Equipo'}
                      </span>
                      <span className="text-[9px] font-mono text-cold-muted shrink-0">
                        {time}
                      </span>
                    </div>
                    <p className="text-[10px] text-cold-lavender truncate mt-0.5">
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
