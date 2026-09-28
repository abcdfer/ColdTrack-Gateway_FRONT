import { Server, Radio, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

export function DeviceSelector({
  devices,
  selectedDeviceId,
  onSelectDevice,
  onOpenSimulator,
}) {
  if (!devices || devices.length === 0) {
    return (
      <Card className="border-dashed border-[#A296BC]/30 py-6 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-[#A296BC]/10 border border-[#A296BC]/20 text-[#A296BC]">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm text-[#F3F4F6]">
              Sin Equipos Detectados
            </h4>
            <p className="text-xs text-[#9CA3AF] max-w-sm mt-1">
              Inicia la simulación en Tinkercad o inyecta una lectura de prueba para inicializar un dispositivo ColdTrack.
            </p>
          </div>
          <Button size="sm" variant="secondary" onClick={onOpenSimulator}>
            Inyectar Telemetría Inicial
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#A296BC] uppercase tracking-wider pr-2 border-r border-white/10 shrink-0">
        <Radio className="w-3.5 h-3.5 text-[#BECFFF] animate-pulse" />
        Equipos ({devices.length}):
      </div>

      {devices.map((device) => {
        const isSelected = device.deviceId === selectedDeviceId
        const isOnline = device.status === 'online'
        const hasWarning = device.diagnostico && device.diagnostico !== 'SIN_FALLAS'

        return (
          <button
            key={device.deviceId}
            onClick={() => onSelectDevice(device.deviceId)}
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-left transition-all duration-200 cursor-pointer shrink-0 border ${
              isSelected
                ? 'bg-[#BECFFF]/15 border-[#BECFFF]/40 shadow-[0_0_15px_rgba(190,207,255,0.15)] text-[#F3F4F6]'
                : 'glass-panel text-[#9CA3AF] hover:border-[#BECFFF]/25 hover:text-[#F3F4F6]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-400' : 'bg-zinc-600'
                }`}
              />
              <span className="font-heading font-semibold text-sm">
                {device.deviceId}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Badge
                variant={hasWarning ? 'warning' : 'default'}
                className="text-[10px] py-0 px-1.5"
              >
                {hasWarning ? (
                  <AlertTriangle className="w-2.5 h-2.5" />
                ) : (
                  <CheckCircle2 className="w-2.5 h-2.5" />
                )}
                {device.diagnostico || 'ACTIVO'}
              </Badge>
            </div>
          </button>
        )
      })}
    </div>
  )
}
