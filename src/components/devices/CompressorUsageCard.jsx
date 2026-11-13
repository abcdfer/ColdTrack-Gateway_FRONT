import { useState, useEffect } from 'react'
import { fetchDeviceUsage } from '@/services/api'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Clock, Zap, Gauge, AlertCircle, RefreshCw } from 'lucide-react'

export function CompressorUsageCard({ deviceId }) {
  const [days, setDays] = useState(7)
  const [usage, setUsage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!deviceId) return
    let active = true
    setLoading(true)
    setError(null)
    fetchDeviceUsage(deviceId, days)
      .then((data) => {
        if (active) setUsage(data)
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [deviceId, days])

  const runningHours = usage ? (usage.runningSeconds / 3600).toFixed(1) : '0.0'
  const observedHours = usage ? (usage.observedSeconds / 3600).toFixed(1) : '0.0'
  const dutyCycle =
    usage && usage.observedSeconds > 0
      ? Math.min(100, Math.round((usage.runningSeconds / usage.observedSeconds) * 100))
      : 0

  return (
    <Card className="p-4 sm:p-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cold-divider/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cold-ice/10 text-cold-ice border border-cold-ice/20">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-cold-text flex items-center gap-2">
              Horas de Uso del Compresor
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cold-shade/60 border border-cold-divider/10 text-cold-lavender">
                API: /api/devices/{'{id}'}/usage
              </span>
            </h3>
            <p className="text-[11px] text-cold-muted">
              Medición de ciclo de trabajo real excluyendo pausas prolongadas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-[11px] text-cold-muted mr-1">Ventana:</span>
          {[1, 7, 14, 30].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                days === d
                  ? 'bg-cold-ice text-cold-on-accent font-semibold shadow-[0_0_10px_rgba(190,207,255,0.3)]'
                  : 'bg-cold-shade/40 text-cold-muted hover:text-cold-text border border-cold-divider/10'
              }`}
            >
              {d === 1 ? '24h' : `${d}d`}
            </button>
          ))}
        </div>
      </div>

      {loading && !usage && (
        <div className="py-6 flex items-center justify-center gap-2 text-xs text-cold-muted">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-cold-ice" />
          <span>Calculando telemetría acumulada…</span>
        </div>
      )}

      {error && (
        <div className="my-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>No se pudo obtener el tiempo de uso: {error}</span>
        </div>
      )}

      {usage && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-cold-dark/50 border border-cold-ice/15">
              <span className="text-[10px] text-cold-lavender uppercase font-semibold tracking-wider block">
                Tiempo en Marcha
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-heading font-extrabold text-2xl text-cold-text">
                  {runningHours}
                </span>
                <span className="text-xs text-cold-muted font-medium">horas</span>
              </div>
              <span className="text-[10px] text-cold-muted">
                {Math.round(usage.runningSeconds / 60)} minutos totales
              </span>
            </div>

            <div className="p-3 rounded-xl bg-cold-dark/50 border border-cold-ice/15">
              <span className="text-[10px] text-cold-lavender uppercase font-semibold tracking-wider block">
                Tiempo Observado
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-heading font-extrabold text-2xl text-cold-text">
                  {observedHours}
                </span>
                <span className="text-xs text-cold-muted font-medium">horas</span>
              </div>
              <span className="text-[10px] text-cold-muted">
                Tolerancia máx de brecha: {usage.maxGapSeconds}s
              </span>
            </div>

            <div className="p-3 rounded-xl bg-cold-dark/50 border border-cold-ice/15">
              <span className="text-[10px] text-cold-lavender uppercase font-semibold tracking-wider block">
                Ciclo de Trabajo (Duty Cycle)
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="font-heading font-extrabold text-2xl text-cold-ice">
                  {dutyCycle}%
                </span>
                <Badge
                  variant={dutyCycle > 85 ? 'danger' : dutyCycle > 65 ? 'warning' : 'success'}
                  className="text-[10px] ml-1"
                >
                  {dutyCycle > 85 ? 'Sobrecarga' : dutyCycle > 65 ? 'Moderado' : 'Óptimo'}
                </Badge>
              </div>
              <span className="text-[10px] text-cold-muted">
                Relación de compresión activa
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-cold-muted">Distribución de carga (0% - 100%)</span>
              <span className="font-mono text-cold-ice font-semibold">{dutyCycle}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-cold-shade border border-cold-divider/10 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  dutyCycle > 85
                    ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                    : dutyCycle > 65
                    ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                    : 'bg-cold-ice shadow-[0_0_10px_rgba(190,207,255,0.4)]'
                }`}
                style={{ width: `${dutyCycle}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
