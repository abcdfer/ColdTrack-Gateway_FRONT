import { Thermometer, Snowflake, Flame, ArrowUpRight, CheckCircle2, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'

export function TemperatureSection({ data }) {
  const tempInterior = typeof data?.tempInterior === 'number' ? data.tempInterior : null
  const tempCondensador = typeof data?.tempCondensador === 'number' ? data.tempCondensador : null
  const tempSuccion = typeof data?.tempSuccion === 'number' ? data.tempSuccion : null

  const diagnostico = data?.diagnostico || null
  const estado = data?.estado || null
  const isFault = diagnostico && diagnostico !== 'SIN_FALLAS'

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1 border-[#BECFFF]/25 bg-gradient-to-br from-[#0C0B0E] via-[#0C0B0E] to-[#BECFFF]/5">
        <CardHeader className="mb-2">
          <CardTitle>
            <Thermometer className="w-4 h-4 text-[#BECFFF]" />
            Cámara Interior
          </CardTitle>
          {diagnostico ? (
            <Badge variant={isFault ? 'danger' : 'default'} className="font-mono text-[10px]">
              {isFault ? (
                <AlertTriangle className="w-3 h-3 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              )}
              {diagnostico}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px]">
              SIN DATOS
            </Badge>
          )}
        </CardHeader>

        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative flex items-baseline gap-1">
            <span className="font-heading font-extrabold text-5xl sm:text-6xl text-[#F3F4F6] tracking-tight">
              {tempInterior !== null ? tempInterior.toFixed(1) : '--'}
            </span>
            <span className="text-2xl font-semibold text-[#BECFFF]">°C</span>
          </div>

          <div className="w-full mt-4 bg-zinc-900/80 rounded-full h-2.5 overflow-hidden border border-white/5 relative">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isFault
                  ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
                  : 'bg-[#BECFFF] shadow-[0_0_12px_rgba(190,207,255,0.6)]'
              }`}
              style={{
                width: tempInterior !== null
                  ? `${Math.min(Math.max(((tempInterior + 30) / 60) * 100, 5), 100)}%`
                  : '0%',
              }}
            />
          </div>

          <div className="flex justify-between w-full text-[10px] text-[#9CA3AF] mt-1.5 px-0.5">
            <span>-30°C</span>
            <span className="text-[#BECFFF]">Escala Térmica</span>
            <span>+30°C</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#9CA3AF]">
          <span>Estado Reportado (DB):</span>
          <span className="text-[#F3F4F6] font-medium font-mono">
            {estado || 'N/A'}
          </span>
        </div>
      </Card>

      <Card className="border-[#A296BC]/20">
        <CardHeader className="mb-2">
          <CardTitle className="text-[#A296BC]">
            <Flame className="w-4 h-4 text-[#A296BC]" />
            Temp. Condensador
          </CardTitle>
          <span className="text-xs text-[#9CA3AF] font-mono">Lado Alta</span>
        </CardHeader>

        <div className="flex items-baseline gap-1 py-3">
          <span className="font-heading font-bold text-4xl text-[#F3F4F6]">
            {tempCondensador !== null ? tempCondensador.toFixed(1) : '--'}
          </span>
          <span className="text-lg font-medium text-[#A296BC]">°C</span>
        </div>

        <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center justify-between text-[#9CA3AF]">
            <span>Diferencial Cond-Int:</span>
            <span className="text-[#BECFFF] font-mono flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" />
              {tempCondensador !== null && tempInterior !== null
                ? `${(tempCondensador - tempInterior).toFixed(1)}°C`
                : '--'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#9CA3AF]">
            <span>Registro Backend:</span>
            <span className="text-[#F3F4F6] font-mono">
              {data?.receivedAt ? new Date(data.receivedAt).toLocaleTimeString() : 'N/A'}
            </span>
          </div>
        </div>
      </Card>

      <Card className="border-[#A296BC]/20">
        <CardHeader className="mb-2">
          <CardTitle className="text-[#A296BC]">
            <Snowflake className="w-4 h-4 text-[#BECFFF]" />
            Temp. Succión
          </CardTitle>
          <span className="text-xs text-[#9CA3AF] font-mono">Lado Baja</span>
        </CardHeader>

        <div className="flex items-baseline gap-1 py-3">
          <span className="font-heading font-bold text-4xl text-[#F3F4F6]">
            {tempSuccion !== null ? tempSuccion.toFixed(1) : '--'}
          </span>
          <span className="text-lg font-medium text-[#A296BC]">°C</span>
        </div>

        <div className="space-y-2 pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center justify-between text-[#9CA3AF]">
            <span>Diferencial Succ-Int:</span>
            <span className="text-[#F3F4F6] font-mono">
              {tempSuccion !== null && tempInterior !== null
                ? `${(tempSuccion - tempInterior).toFixed(1)} K`
                : '--'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[#9CA3AF]">
            <span>Uptime Hardware:</span>
            <span className="text-[#BECFFF] font-mono">
              {data?.uptimeMs !== undefined ? `${data.uptimeMs} ms` : 'N/A'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
