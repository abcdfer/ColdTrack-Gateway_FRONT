import { useState, useEffect } from 'react'
import { fetchAlerts } from '@/services/api'
import { CreateMaintenanceModal } from '@/components/maintenance/CreateMaintenanceModal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  RefreshCw,
  Info,
  Server,
} from 'lucide-react'

export function AlertsPage({ devices = [], initialDeviceId = '' }) {
  const [selectedDeviceId, setSelectedDeviceId] = useState(
    initialDeviceId || devices[0]?.deviceId || ''
  )
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createForAlert, setCreateForAlert] = useState(null)

  useEffect(() => {
    if (!selectedDeviceId && devices.length > 0) {
      setSelectedDeviceId(devices[0].deviceId)
    }
  }, [devices, selectedDeviceId])

  function loadAlerts() {
    if (!selectedDeviceId) return
    setLoading(true)
    setError('')
    fetchAlerts(selectedDeviceId)
      .then((data) => {
        setAlerts(data.items || [])
      })
      .catch((err) => {
        setError(err.message || 'Error al obtener alertas del equipo')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadAlerts()
  }, [selectedDeviceId])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cold-divider/10">
        <div>
          <h2 className="font-heading font-bold text-xl text-cold-text flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Centro de Alertas y Diagnóstico Frigorífico
          </h2>
          <p className="text-xs text-cold-muted mt-0.5">
            Detección de anomalías térmicas, disparos de presostato y fallas de ciclo
          </p>
        </div>

        <div className="flex items-center gap-3">
          {devices.length > 0 && (
            <label className="flex items-center gap-2 text-xs text-cold-muted">
              <span>Equipo:</span>
              <select
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-cold-dark/70 border border-cold-ice/20 text-cold-text font-mono text-xs focus:outline-none"
              >
                {devices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.name ? `${d.name} (${d.deviceId})` : d.deviceId}
                  </option>
                ))}
              </select>
            </label>
          )}

          <Button variant="outline" size="sm" onClick={loadAlerts}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && alerts.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-cold-muted">
          <RefreshCw className="w-6 h-6 animate-spin text-cold-ice" />
          <span className="text-xs">Consultando registro de incidentes…</span>
        </div>
      ) : alerts.length === 0 ? (
        <Card className="py-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
          <h3 className="font-heading font-bold text-base text-cold-text">
            Sin desvíos registrados
          </h3>
          <p className="text-xs text-cold-muted mt-1 max-w-sm mx-auto">
            El equipo <strong className="text-cold-ice">{selectedDeviceId}</strong> está operando
            dentro de los rangos térmicos y de presión configurados en su política de captura.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const isDanger = alert.active
            return (
              <Card
                key={alert.id}
                className={`p-4 sm:p-5 transition-all border ${
                  isDanger
                    ? 'border-rose-500/30 bg-rose-500/5'
                    : 'border-cold-divider/10 bg-cold-dark/40'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={isDanger ? 'danger' : 'success'} className="text-[10px]">
                        {isDanger ? 'ACTIVA' : 'RESUELTA'}
                      </Badge>
                      <span className="font-mono text-xs text-cold-lavender">
                        Incidente #{alert.id}
                      </span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-cold-dark/70 border border-cold-ice/15 text-cold-text">
                        {selectedDeviceId}
                      </span>
                      {alert.severity && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-cold-shade uppercase font-semibold text-cold-muted">
                          Severidad: {alert.severity}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading font-bold text-sm text-cold-text pt-0.5">
                      {alert.description || alert.type.replaceAll('_', ' ')}
                    </h3>
                  </div>

                  <div className="text-right text-xs shrink-0 space-y-1">
                    <div className="flex items-center gap-1.5 sm:justify-end text-cold-muted text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Iniciada: {new Date(alert.openedAt).toLocaleString()}</span>
                    </div>
                    {alert.resolvedAt && (
                      <div className="flex items-center gap-1.5 sm:justify-end text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resuelta: {new Date(alert.resolvedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions row */}
                <div className="mt-4 pt-3 border-t border-cold-divider/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs text-cold-lavender">
                    <Info className="w-3.5 h-3.5 text-cold-ice" />
                    <span>Tipo: <strong className="font-mono">{alert.type}</strong></span>
                  </div>

                  {isDanger && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => setCreateForAlert(alert)}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Solicitar Mantenimiento desde esta Alerta
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {createForAlert && (
        <CreateMaintenanceModal
          isOpen={Boolean(createForAlert)}
          onClose={() => setCreateForAlert(null)}
          initialDeviceId={selectedDeviceId}
          initialAlertId={createForAlert.id}
          onCreated={() => loadAlerts()}
        />
      )}
    </div>
  )
}
export default AlertsPage
