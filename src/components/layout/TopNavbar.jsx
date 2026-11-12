import { Search, Bell, Plus, Radio, AlertTriangle, CheckCircle2, RefreshCw, Activity } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

export function TopNavbar({
  title = 'Dashboard',
  subtitle = 'Monitoreo de equipos de frío y telemetría en tiempo real',
  searchTerm = '',
  setSearchTerm,
  onOpenSimulator,
  onRefresh,
  isConnected,
  isAutoRefresh,
  setIsAutoRefresh,
  alertCount = 0,
  monitoringStatus = 'normal',
  pollingCadenceLabel = '30s',
}) {
  const isAlert = monitoringStatus === 'alerta'
  const isRecovery = monitoringStatus === 'recuperacion'

  return (
    <header className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 py-2">
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="font-heading font-extrabold text-2xl tracking-tight text-cold-text">
            {title}
          </h2>
          <Activity className="w-5 h-5 text-cold-ice animate-pulse" />
        </div>
        <p className="text-xs text-cold-lavender mt-0.5">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cold-muted" />
          <input
            type="text"
            placeholder="Buscar unidad, diagnóstico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            className="w-full bg-cold-shade/60 border border-cold-divider/10 rounded-xl pl-9 pr-3 py-2 text-xs text-cold-text placeholder-cold-muted focus:outline-none focus:border-cold-ice/40 transition-colors"
          />
        </div>

        <button
          onClick={onRefresh}
          className="relative p-2.5 rounded-xl glass-panel text-cold-muted hover:text-cold-ice hover:border-cold-ice/30 transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAutoRefresh(!isAutoRefresh)}
          className={
            !isAutoRefresh
              ? 'text-cold-muted'
              : isAlert
              ? 'border-rose-500/50 text-rose-300 bg-rose-500/15 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse'
              : isRecovery
              ? 'border-emerald-500/50 text-emerald-300 bg-emerald-500/15 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'border-cold-ice/40 text-cold-ice bg-cold-ice/5'
          }
        >
          {isAlert ? (
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          ) : isRecovery ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Radio className="w-3.5 h-3.5" />
          )}

          <span className="hidden sm:inline font-mono">
            {!isAutoRefresh
              ? 'Pausado'
              : isAlert
              ? `Alerta · ${pollingCadenceLabel}`
              : isRecovery
              ? `Recuperación · ${pollingCadenceLabel}`
              : `Normal · ${pollingCadenceLabel}`}
          </span>
        </Button>

        <Button
          variant="primary"
          size="sm"
          onClick={onOpenSimulator}
          className="shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Inyectar Telemetría</span>
        </Button>
      </div>
    </header>
  )
}
