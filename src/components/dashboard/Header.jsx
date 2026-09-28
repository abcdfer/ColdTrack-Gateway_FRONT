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
    <header className="border-b border-[#BECFFF]/10 bg-black/60 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center h-11 w-11 rounded-xl bg-[#0C0B0E] border border-[#BECFFF]/25 overflow-hidden shadow-[0_0_15px_rgba(190,207,255,0.15)]">
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
              <span className="font-heading text-xl font-bold tracking-tight text-[#F3F4F6]">
                Cold<span className="text-[#BECFFF]">Track</span>
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
            <p className="text-xs text-[#A296BC] font-medium tracking-wide">
              Industrial Cold Chain Telemetry System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap justify-end">
          {lastUpdated && (
            <span className="text-xs text-[#9CA3AF] hidden sm:inline-block">
              Sync:{' '}
              <span className="text-[#BECFFF] font-mono">
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
                ? 'border-[#BECFFF]/40 text-[#BECFFF] bg-[#BECFFF]/5'
                : 'text-[#9CA3AF]'
            }
          >
            <Activity
              className={`w-3.5 h-3.5 ${
                isAutoRefresh ? 'animate-pulse text-[#BECFFF]' : ''
              }`}
            />
            {isAutoRefresh ? 'Auto 3s' : 'Pausado'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="hover:border-[#BECFFF]/40"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refrescar</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenSimulator}
            className="border-[#A296BC]/40"
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
