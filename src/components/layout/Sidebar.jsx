import {
  Truck,
  Activity,
  ShieldAlert,
  History,
  Sliders,
  Cpu,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export function Sidebar({
  activeTab,
  setActiveTab,
  onOpenSimulator,
  onOpenInfo,
  onOpenConstruction,
  activeDeviceId,
  devices = [],
}) {
  const deviceIds =
    devices.length > 0 ? devices.map((d) => d.deviceId) : ['CT-001']
  const currentIdx = activeDeviceId ? deviceIds.indexOf(activeDeviceId) : 0
  const safeIdx = currentIdx >= 0 ? currentIdx : 0
  const currentTargetId = activeDeviceId || deviceIds[0] || 'CT-001'

  const prevIdx = (safeIdx - 1 + deviceIds.length) % deviceIds.length
  const nextIdx = (safeIdx + 1) % deviceIds.length
  const prevDeviceId = deviceIds[prevIdx]
  const nextDeviceId = deviceIds[nextIdx]

  const telemetryHref = `?device=${encodeURIComponent(activeDeviceId || 'CT-001')}`
  const isTelemetryActive = activeTab === 'telemetry' || Boolean(activeDeviceId)

  const toolNavItems = [
    { id: 'simulator', label: 'Simulador IoT', icon: Sliders, action: onOpenSimulator },
    { id: 'architecture', label: 'Topología & API', icon: Cpu, action: onOpenInfo },
    { id: 'settings', label: 'Configuración', icon: Settings, action: onOpenInfo },
  ]

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between glass-panel rounded-2xl p-4 min-h-[calc(100vh-2rem)] border-[#BECFFF]/15 shadow-2xl">
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="h-10 w-10 rounded-xl bg-black border border-[#BECFFF]/25 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(190,207,255,0.15)]">
            <img
              src="/logos/1.png"
              alt="ColdTrack"
              className="h-full w-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-base tracking-tight text-[#F3F4F6]">
              Cold<span className="text-[#BECFFF]">Track</span>
            </h1>
            <p className="text-[10px] text-[#A296BC] font-medium tracking-wide">
              Cold Chain Telemetry
            </p>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-[#A296BC] tracking-wider uppercase px-3 block mb-2">
            Menú Principal
          </span>
          <nav className="space-y-1">
            <a
              href="/"
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'fleet' && !activeDeviceId
                  ? 'bg-[#BECFFF]/15 text-[#BECFFF] border border-[#BECFFF]/30 shadow-[0_0_12px_rgba(190,207,255,0.15)]'
                  : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5'
              }`}
            >
              <Truck className="w-4 h-4 shrink-0" />
              <span>Flota de Frío</span>
            </a>

            <div
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border transition-all ${
                isTelemetryActive
                  ? 'bg-[#BECFFF]/15 text-[#BECFFF] border-[#BECFFF]/30 shadow-[0_0_12px_rgba(190,207,255,0.15)]'
                  : 'border-transparent text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5'
              }`}
            >
              <a
                href={telemetryHref}
                className="flex items-center gap-2.5 flex-1 py-1 text-xs font-medium"
              >
                <Activity className="w-4 h-4 shrink-0" />
                <span>Telemetría</span>
              </a>

              <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded-lg border border-white/10 shrink-0">
                <a
                  href={`?device=${encodeURIComponent(prevDeviceId)}`}
                  className="p-0.5 rounded hover:text-[#BECFFF] hover:bg-white/10 transition-colors"
                  title={`Anterior: ${prevDeviceId}`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </a>
                <span className="font-mono text-[10px] text-[#BECFFF] px-0.5">
                  {currentTargetId}
                </span>
                <a
                  href={`?device=${encodeURIComponent(nextDeviceId)}`}
                  className="p-0.5 rounded hover:text-[#BECFFF] hover:bg-white/10 transition-colors"
                  title={`Siguiente: ${nextDeviceId}`}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <button
              onClick={() => onOpenConstruction ? onOpenConstruction('Alertas & Seguridad') : setActiveTab('alerts')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'alerts'
                  ? 'bg-[#BECFFF]/15 text-[#BECFFF] border border-[#BECFFF]/30 shadow-[0_0_12px_rgba(190,207,255,0.15)]'
                  : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5'
              }`}
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Alertas & Seguridad</span>
            </button>

            <button
              onClick={() => onOpenConstruction ? onOpenConstruction('Historial de Eventos') : setActiveTab('history')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#BECFFF]/15 text-[#BECFFF] border border-[#BECFFF]/30 shadow-[0_0_12px_rgba(190,207,255,0.15)]'
                  : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4 shrink-0" />
              <span>Historial de Eventos</span>
            </button>
          </nav>
        </div>

        <div>
          <span className="text-[10px] font-semibold text-[#A296BC] tracking-wider uppercase px-3 block mb-2">
            Herramientas
          </span>
          <div className="space-y-1">
            {toolNavItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-[#9CA3AF] hover:text-[#BECFFF] hover:bg-white/5 transition-all cursor-pointer text-left"
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#BECFFF]/10 to-transparent border border-[#BECFFF]/20 text-center">
          <span className="text-[11px] font-heading font-semibold text-[#F3F4F6] block">
            ColdTrack Architecture
          </span>
          <p className="text-[10px] text-[#A296BC] mt-1 leading-snug">
            Tinkercad MCU · Serial Ext · Flask Gateway
          </p>
          <button
            onClick={onOpenInfo}
            className="mt-3 w-full py-1.5 px-2 rounded-lg bg-[#BECFFF] text-black font-semibold text-[11px] hover:bg-white transition-all cursor-pointer shadow-[0_0_10px_rgba(190,207,255,0.3)]"
          >
            Ver Sistema
          </button>
        </div>
      </div>
    </aside>
  )
}
