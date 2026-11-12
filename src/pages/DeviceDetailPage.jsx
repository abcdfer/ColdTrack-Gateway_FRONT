import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Radio,
  Sliders,
  RefreshCw,
  Server,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Activity,
} from 'lucide-react'
import { TemperatureSection } from '../components/dashboard/TemperatureSection'
import { ActuatorsPanel } from '../components/dashboard/ActuatorsPanel'
import { ProtectionAndDiagnostics } from '../components/dashboard/ProtectionAndDiagnostics'
import { TelemetryHistoryTable } from '../components/dashboard/TelemetryHistoryTable'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'

export function DeviceDetailPage({
  deviceId,
  devices = [],
  latestData,
  history = [],
  alerts = [],
  onRefresh,
  onOpenSimulator,
  monitoringStatus = 'normal',
  pollingCadenceLabel = '30s',
}) {
  const currentDevice = devices.find((d) => d.deviceId === deviceId)
  const isOnline = currentDevice?.status === 'online'

  const deviceIds =
    devices.length > 0 ? devices.map((d) => d.deviceId) : ['CT-001']
  const currentIdx = deviceIds.indexOf(deviceId)
  const safeIdx = currentIdx >= 0 ? currentIdx : 0
  const prevDeviceId =
    deviceIds[(safeIdx - 1 + deviceIds.length) % deviceIds.length]
  const nextDeviceId = deviceIds[(safeIdx + 1) % deviceIds.length]

  const isAlert = monitoringStatus === 'alerta'
  const isRecovery = monitoringStatus === 'recuperacion'

  if (!deviceId) {
    return (
      <Card className="py-12 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <Server className="w-8 h-8 text-cold-lavender" />
          <h3 className="font-heading font-bold text-base text-cold-text">
            No se especificó un dispositivo
          </h3>
          <p className="text-xs text-cold-muted">
            Regresa a la pantalla principal para seleccionar un equipo de la flota.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-cold-ice text-cold-on-accent font-semibold text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver a la Flota
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-cold-divider/10">
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cold-divider/10 text-xs text-cold-muted hover:text-cold-ice hover:border-cold-ice/40 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Flota</span>
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Radio className="w-4 h-4 text-cold-ice animate-pulse" />
              <h2 className="font-heading font-bold text-xl text-cold-text">
                {deviceId}
              </h2>
              <div className="flex items-center gap-1 bg-cold-shade/40 px-1 py-0.5 rounded-lg border border-cold-divider/10">
                <Link
                  to={`?device=${encodeURIComponent(prevDeviceId)}`}
                  className="p-1 rounded hover:text-cold-ice hover:bg-cold-divider/10 text-cold-muted transition-colors"
                  title={`Anterior: ${prevDeviceId}`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`?device=${encodeURIComponent(nextDeviceId)}`}
                  className="p-1 rounded hover:text-cold-ice hover:bg-cold-divider/10 text-cold-muted transition-colors"
                  title={`Siguiente: ${nextDeviceId}`}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <Badge variant={isOnline ? 'success' : 'default'} className="text-[10px]">
                {isOnline ? 'CONECTADO' : 'OFFLINE'}
              </Badge>

              <Badge
                variant={isAlert ? 'danger' : isRecovery ? 'success' : 'default'}
                className="text-[10px] font-mono tracking-tight"
              >
                {isAlert ? (
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                ) : isRecovery ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Activity className="w-3 h-3 text-cold-ice" />
                )}
                {isAlert
                  ? `ESTADO DE ALERTA (${pollingCadenceLabel})`
                  : isRecovery
                  ? `RECUPERACIÓN RECIENTE (${pollingCadenceLabel})`
                  : `ESTADO NORMAL (${pollingCadenceLabel})`}
              </Badge>
            </div>
            <span className="text-xs text-cold-lavender font-mono">
              {latestData?.source === 'simulator' ? 'Origen: simulador web' : 'Origen: gateway de telemetría'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>

          <Button variant="secondary" size="sm" onClick={onOpenSimulator}>
            <Sliders className="w-3.5 h-3.5" />
            <span>Abrir simulador</span>
          </Button>
        </div>
      </div>

      <TemperatureSection data={latestData} />
      <ActuatorsPanel data={latestData} />
      <ProtectionAndDiagnostics data={latestData} />
      <Card className="space-y-3 p-4">
        <h3 className="font-heading text-sm font-semibold">Alertas del equipo</h3>
        {alerts.length === 0 ? <p className="text-xs text-zinc-400">Sin alertas registradas.</p> : (
          <ul className="divide-y divide-cold-divider/10">
            {alerts.map((alert) => (
              <li key={alert.id} className="flex flex-wrap items-center gap-2 py-2 text-xs">
                <Badge variant={alert.active ? 'danger' : 'success'}>{alert.active ? 'Activa' : 'Resuelta'}</Badge>
                <span>{alert.type.replaceAll('_', ' ')}</span>
                <time className="text-zinc-400" dateTime={alert.resolvedAt || alert.openedAt}>
                  {new Date(alert.resolvedAt || alert.openedAt).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <TelemetryHistoryTable history={history} />
    </div>
  )
}
