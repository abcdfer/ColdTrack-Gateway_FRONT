import { RefreshCw, Activity, Cpu, Sparkles, Sliders, ShieldCheck } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

export function Header({
  isConnected,
  isAutoRefresh,
  setIsAutoRefresh,
  onRefresh,
  onOpenSimulator,
  onOpenInfo,
  lastUpdated,
}) {
  return (
    <header className="border-b border-cold-ice/10 bg-cold-shade/60 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center h-11 w-11 rounded-xl bg-cold-surface border border-cold-ice/25 overflow-hidden shadow-[0_0_15px_rgba(190,207,255,0.15)]">
            <img
              src="/logos/1.png"
              alt="ColdTrack"
              className="h-8 w-8 object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-heading text-xl font-bold tracking-tight text-cold-text">
                Cold<span className="text-cold-ice">Track</span>
              </span>
              <Badge variant={isConnected ? 'success' : 'danger'}>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                  }`}
                />
                {isConnected ? 'API ONLINE' : 'DISCONNECTED'}
              </Badge>
            </div>
            <p className="text-xs text-cold-lavender font-medium tracking-wide">
              Industrial Cold Chain Telemetry System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          {lastUpdated && (
            <span className="text-xs text-cold-muted hidden sm:inline-block">
              Sync:{' '}
              <span className="text-cold-ice font-mono">
                {lastUpdated.toLocaleTimeString()}
              </span>
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            className={
              isAutoRefresh
                ? 'border-cold-ice/40 text-cold-ice bg-cold-ice/5'
                : 'text-cold-muted'
            }
          >
            <Activity
              className={`w-3.5 h-3.5 ${
                isAutoRefresh ? 'animate-pulse text-cold-ice' : ''
              }`}
            />
            {isAutoRefresh ? 'Auto 3s' : 'Pausado'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="hover:border-cold-ice/40"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refrescar</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenSimulator}
            className="border-cold-lavender/40"
          >
            <Sliders className="w-3.5 h-3.5" />
            Simulador
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenInfo}
            className="shadow-sm"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sistema</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
