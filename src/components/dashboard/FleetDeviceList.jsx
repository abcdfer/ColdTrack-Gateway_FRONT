import { Link } from 'react-router-dom'
import { ExternalLink, Filter, Download, Clock, Thermometer, AlertCircle, CheckCircle2, Truck } from 'lucide-react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'

function formatUptime(uptimeMs) {
  if (!uptimeMs && uptimeMs !== 0) return '00:00:00'
  const totalSeconds = Math.floor(uptimeMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function FleetDeviceList({
  devices = [],
  latestDataMap = {},
  searchTerm = '',
  onOpenSimulator,
}) {
  const filtered = devices.filter((dev) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      dev.deviceId.toLowerCase().includes(term) ||
      (dev.name && dev.name.toLowerCase().includes(term)) ||
      (dev.estado && dev.estado.toLowerCase().includes(term)) ||
      (dev.diagnostico && dev.diagnostico.toLowerCase().includes(term))
    )
  })

  return (
    <Card className="border-cold-ice/20 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-cold-divider/10 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-sm tracking-wide text-cold-text uppercase">
              Equipos de Frío
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cold-ice/10 text-cold-ice">
              {filtered.length} unidades
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={onOpenSimulator}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-cold-divider/10 text-cold-muted hover:text-cold-ice hover:border-cold-ice/30 transition-all cursor-pointer"
            >
              <Filter className="w-3 h-3" />
              <span>Filtrar</span>
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="w-8 h-8 text-cold-lavender mx-auto mb-2" />
            <p className="text-xs text-cold-muted">
              No se encontraron dispositivos registrados.
            </p>
            <button
              onClick={onOpenSimulator}
              className="mt-3 px-3 py-1.5 rounded-lg bg-cold-ice text-cold-on-accent font-semibold text-xs cursor-pointer shadow-sm"
            >
              Inyectar Telemetría Inicial
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((device) => {
              const latest = latestDataMap[device.deviceId]
              const isOnline = device.status === 'online'
              const diagnostico =
                latest?.diagnostico || device.diagnostico || 'SIN_FALLAS'
              const estado = latest?.estado || device.estado || 'NORMAL'
              const hasFault = (latest?.state || device.state) === 'alert'
              const tempInterior = latest?.tempInterior
              const uptimeMs = latest?.uptimeMs

              return (
                <div
                  key={device.deviceId}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-cold-shade/40 border border-cold-divider/5 hover:border-cold-ice/25 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cold-ice/10 border border-cold-ice/25 flex items-center justify-center font-heading font-bold text-xs text-cold-ice shrink-0">
                      {device.deviceId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || 'CT'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm text-cold-text">
                          {device.deviceId}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-600'
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-cold-lavender mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Recorrido: {formatUptime(uptimeMs)}
                        </span>
                        <span>·</span>
                        <span>{estado}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="font-heading font-bold text-sm text-cold-ice block font-mono">
                        {typeof tempInterior === 'number'
                          ? `${tempInterior.toFixed(1)}°C`
                          : 'N/A'}
                      </span>
                      <Badge
                        variant={hasFault ? 'danger' : 'default'}
                        className="text-[9px] py-0 px-1.5 font-mono"
                      >
                        {hasFault ? (
                          <AlertCircle className="w-2.5 h-2.5" />
                        ) : (
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        )}
                        {diagnostico}
                      </Badge>
                    </div>

                    <Link
                      to={`?device=${encodeURIComponent(device.deviceId)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-cold-ice/10 text-cold-ice border border-cold-ice/30 hover:bg-cold-ice hover:text-cold-on-accent font-semibold text-xs transition-all shrink-0"
                    >
                      <span>Telemetría</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}
