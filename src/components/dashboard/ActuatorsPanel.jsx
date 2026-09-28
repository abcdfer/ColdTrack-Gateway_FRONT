import { Gauge, Fan, Zap, Clock } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'

function formatUptime(uptimeMs) {
  if (!uptimeMs && uptimeMs !== 0) return '00:00:00'
  const totalSeconds = Math.floor(uptimeMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function ActuatorsPanel({ data }) {
  const compresor = typeof data?.compresor === 'number' ? data.compresor : 0
  const presionBaja = typeof data?.presionBaja === 'number' ? data.presionBaja : 0
  const presionAlta = typeof data?.presionAlta === 'number' ? data.presionAlta : 0
  const fanSolicitado = typeof data?.fanSolicitado === 'number' ? data.fanSolicitado : 0
  const fanPWM = typeof data?.fanPWM === 'number' ? data.fanPWM : 0
  const fanRpm = typeof data?.fanRpm === 'number' ? data.fanRpm : 0
  const uptimeMs = data?.uptimeMs

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-[#BECFFF]/20">
        <CardHeader className="mb-2">
          <CardTitle>
            <Zap className="w-4 h-4 text-[#BECFFF]" />
            Compresor
          </CardTitle>
          <span className="font-mono text-xs text-[#9CA3AF]">PWM / Potencia</span>
        </CardHeader>
        <div className="flex items-baseline justify-between">
          <span className="font-heading font-bold text-3xl text-[#F3F4F6]">
            {compresor}%
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
              compresor > 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-zinc-800 text-zinc-400'
            }`}
          >
            {compresor > 0 ? 'MARCHA' : 'DETENIDO'}
          </span>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className="bg-[#BECFFF] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(190,207,255,0.5)]"
            style={{ width: `${Math.min(compresor, 100)}%` }}
          />
        </div>
      </Card>

      <Card className="border-[#A296BC]/20">
        <CardHeader className="mb-2">
          <CardTitle className="text-[#A296BC]">
            <Fan className="w-4 h-4 text-[#A296BC]" />
            Forzador / Fan
          </CardTitle>
          <span className="font-mono text-xs text-[#9CA3AF]">
            {fanRpm ? `${Math.round(fanRpm)} RPM` : 'RPM N/A'}
          </span>
        </CardHeader>
        <div className="flex items-baseline justify-between">
          <span className="font-heading font-bold text-3xl text-[#F3F4F6]">
            {fanSolicitado}%
          </span>
          <span className="font-mono text-xs text-[#9CA3AF]">
            PWM {fanPWM}/255
          </span>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className="bg-[#A296BC] h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(162,150,188,0.5)]"
            style={{ width: `${Math.min(fanSolicitado, 100)}%` }}
          />
        </div>
      </Card>

      <Card className="border-[#A296BC]/20">
        <CardHeader className="mb-2">
          <CardTitle className="text-[#A296BC]">
            <Gauge className="w-4 h-4 text-[#BECFFF]" />
            Presiones Circuito
          </CardTitle>
          <span className="font-mono text-xs text-[#9CA3AF]">Baja / Alta</span>
        </CardHeader>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-zinc-900/60 p-2 rounded-lg border border-white/5">
            <span className="text-[10px] text-[#9CA3AF] uppercase block font-medium">Baja</span>
            <span className="font-heading font-bold text-xl text-[#BECFFF]">
              {presionBaja}%
            </span>
          </div>
          <div className="bg-zinc-900/60 p-2 rounded-lg border border-white/5">
            <span className="text-[10px] text-[#9CA3AF] uppercase block font-medium">Alta</span>
            <span className="font-heading font-bold text-xl text-[#F3F4F6]">
              {presionAlta}%
            </span>
          </div>
        </div>
      </Card>

      <Card className="border-[#A296BC]/20">
        <CardHeader className="mb-2">
          <CardTitle className="text-[#A296BC]">
            <Clock className="w-4 h-4 text-[#A296BC]" />
            Tiempo de Actividad
          </CardTitle>
          <span className="font-mono text-xs text-[#9CA3AF]">Uptime</span>
        </CardHeader>
        <div className="flex items-baseline justify-between pt-1">
          <span className="font-heading font-mono font-bold text-2xl text-[#F3F4F6]">
            {formatUptime(uptimeMs)}
          </span>
          <span className="text-[10px] font-mono text-[#9CA3AF]">
            {uptimeMs ? `${uptimeMs} ms` : 'Sin datos'}
          </span>
        </div>
        <div className="mt-3 text-xs text-[#9CA3AF] flex items-center justify-between border-t border-white/10 pt-2">
          <span>Reloj RTC:</span>
          <span className="text-[#BECFFF] font-mono">Sincronizado</span>
        </div>
      </Card>
    </div>
  )
}
