import { ShieldAlert, ShieldCheck, AlertOctagon, PowerOff } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'

export function ProtectionAndDiagnostics({ data }) {
  const diagnostico = data?.diagnostico || 'SIN REGISTRO'
  const estado = data?.estado || 'SIN REGISTRO'
  const proteccionAlta = Boolean(data?.proteccionAlta)
  const proteccionBaja = Boolean(data?.proteccionBaja)
  const ordenParoCompresor = Boolean(data?.ordenParoCompresor)

  const hasFault =
    (data?.diagnostico && data.diagnostico !== 'SIN_FALLAS') ||
    proteccionAlta ||
    proteccionBaja ||
    ordenParoCompresor ||
    (data?.estado && data.estado !== 'NORMAL' && data.estado !== 'OPERATIVO')

  return (
    <Card className={`border ${hasFault ? 'border-rose-500/30' : 'border-cold-ice/20'}`}>
      <CardHeader>
        <CardTitle className={hasFault ? 'text-rose-400' : 'text-cold-ice'}>
          {hasFault ? (
            <ShieldAlert className="w-5 h-5 text-rose-400" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          )}
          Diagnóstico y Línea de Seguridad
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={hasFault ? 'danger' : 'success'}>
            {hasFault ? 'FALLA REPORTADA' : 'ESTADO NOMINAL'}
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {estado}
          </Badge>
        </div>
      </CardHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-cold-shade/40 border border-cold-divider/5 flex flex-col justify-between">
          <span className="text-xs text-cold-muted font-medium">Diagnóstico API / DB</span>
          <span className="font-heading font-semibold text-sm text-cold-text mt-1 font-mono">
            {diagnostico}
          </span>
          <span className="text-[10px] text-cold-lavender mt-2">
            Fuente: Base de datos ColdTrack
          </span>
        </div>

        <div
          className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
            proteccionAlta
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
              : 'bg-cold-shade/40 border-cold-divider/5 text-cold-muted'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Protección Alta Presión</span>
            <AlertOctagon
              className={`w-4 h-4 ${proteccionAlta ? 'text-rose-400 animate-bounce' : 'text-zinc-600'}`}
            />
          </div>
          <span
            className={`font-heading font-semibold text-sm mt-1 font-mono ${
              proteccionAlta ? 'text-rose-400 font-bold' : 'text-cold-text'
            }`}
          >
            {proteccionAlta ? 'DISPARADA (HP_TRIP)' : 'NORMAL'}
          </span>
          <span className="text-[10px] text-cold-lavender mt-2">
            Sensor presostático HP
          </span>
        </div>

        <div
          className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
            proteccionBaja
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-200'
              : 'bg-cold-shade/40 border-cold-divider/5 text-cold-muted'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Protección Baja Presión</span>
            <AlertOctagon
              className={`w-4 h-4 ${proteccionBaja ? 'text-rose-400 animate-bounce' : 'text-zinc-600'}`}
            />
          </div>
          <span
            className={`font-heading font-semibold text-sm mt-1 font-mono ${
              proteccionBaja ? 'text-rose-400 font-bold' : 'text-cold-text'
            }`}
          >
            {proteccionBaja ? 'DISPARADA (LP_TRIP)' : 'NORMAL'}
          </span>
          <span className="text-[10px] text-cold-lavender mt-2">
            Sensor presostático LP
          </span>
        </div>

        <div
          className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
            ordenParoCompresor
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
              : 'bg-cold-shade/40 border-cold-divider/5 text-cold-muted'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Parada de Compresor</span>
            <PowerOff
              className={`w-4 h-4 ${
                ordenParoCompresor ? 'text-amber-400' : 'text-zinc-600'
              }`}
            />
          </div>
          <span
            className={`font-heading font-semibold text-sm mt-1 font-mono ${
              ordenParoCompresor ? 'text-amber-400 font-bold' : 'text-cold-text'
            }`}
          >
            {ordenParoCompresor ? 'ORDEN ACTIVA' : 'INACTIVA'}
          </span>
          <span className="text-[10px] text-cold-lavender mt-2">
            Interlock de compresor
          </span>
        </div>
      </div>
    </Card>
  )
}
