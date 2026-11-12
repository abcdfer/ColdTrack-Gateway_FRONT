import { Snowflake, ShieldCheck } from 'lucide-react'
import { Card } from '../ui/Card'

export function FleetOperationalTargets({ devices = [], latestDataMap = {} }) {
  const total = devices.length
  let totalCompresor = 0
  let totalFan = 0
  let countWithCompresor = 0
  let countWithFan = 0
  let withoutFaults = 0
  let safeCircuits = 0

  devices.forEach((d) => {
    const data = latestDataMap[d.deviceId]
    const diag = data?.diagnostico || d.diagnostico
    const est = data?.estado || d.estado

    if (diag === 'SIN_FALLAS' || (!diag && est === 'OPERATIVO')) {
      withoutFaults++
    }

    if (data) {
      if (typeof data.compresor === 'number') {
        totalCompresor += data.compresor
        countWithCompresor++
      }
      if (typeof data.fanSolicitado === 'number') {
        totalFan += data.fanSolicitado
        countWithFan++
      }
      if (!data.proteccionAlta && !data.proteccionBaja && !data.ordenParoCompresor) {
        safeCircuits++
      }
    } else {
      safeCircuits++
    }
  })

  const healthRate = total > 0 ? Math.round((withoutFaults / total) * 100) : 0
  const avgCompresor = countWithCompresor > 0 ? Math.round(totalCompresor / countWithCompresor) : 0
  const avgFan = countWithFan > 0 ? Math.round(totalFan / countWithFan) : 0
  const safetyRate = total > 0 ? Math.round((safeCircuits / total) * 100) : 100

  return (
    <Card className="border-cold-ice/20 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-cold-divider/10 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-sm tracking-wide text-cold-text uppercase">
              Rendimiento Operativo Real
            </h3>
            <Snowflake className="w-4 h-4 text-cold-ice" />
          </div>
          <span className="text-[10px] font-mono text-cold-lavender">
            Telemetría Persistida
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-cold-muted">Unidades en Régimen Nominal</span>
              <span className="font-mono font-bold text-cold-ice">
                {healthRate}%
              </span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-cold-divider/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cold-ice to-cyan-400 shadow-[0_0_12px_rgba(190,207,255,0.4)]"
                style={{ width: `${healthRate}%` }}
              />
            </div>
            <span className="text-[10px] text-cold-lavender font-mono mt-1 block">
              {withoutFaults} de {total} equipos sin fallas
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-cold-muted">Carga Promedio de Compresores</span>
              <span className="font-mono font-bold text-cold-lavender">
                {countWithCompresor > 0 ? `${avgCompresor}%` : 'N/A'}
              </span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-cold-divider/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cold-lavender to-purple-400 shadow-[0_0_12px_rgba(162,150,188,0.4)]"
                style={{ width: `${Math.min(avgCompresor, 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-cold-lavender font-mono mt-1 block">
              Lectura real de modulaciones activas
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-cold-muted">Flujo de Forzadores Evaporador</span>
              <span className="font-mono font-bold text-cold-ice">
                {countWithFan > 0 ? `${avgFan}%` : 'N/A'}
              </span>
            </div>
            <div className="w-full bg-zinc-900 rounded-full h-2 overflow-hidden border border-cold-divider/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cold-ice/70 to-cold-lavender shadow-[0_0_12px_rgba(190,207,255,0.3)]"
                style={{ width: `${Math.min(avgFan, 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-cold-muted font-mono mt-1 block">
              Ventilación reportada en telemetría
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-cold-divider/10 flex items-center justify-between bg-cold-shade/40 p-3 rounded-xl border border-cold-divider/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-heading font-bold text-xs text-cold-text block">
              Circuitos de Presión Seguros
            </span>
            <span className="text-[10px] text-cold-muted">
              Presostatos sin disparos
            </span>
          </div>
        </div>
        <span className="font-mono font-extrabold text-base text-emerald-400">
          {safetyRate}%
        </span>
      </div>
    </Card>
  )
}
