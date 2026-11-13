import { useState } from 'react'
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
  Bell,
  Wrench,
  Clock,
} from 'lucide-react'
import { TemperatureSection } from '../components/dashboard/TemperatureSection'
import { ActuatorsPanel } from '../components/dashboard/ActuatorsPanel'
import { ProtectionAndDiagnostics } from '../components/dashboard/ProtectionAndDiagnostics'
import { TelemetryHistoryTable } from '../components/dashboard/TelemetryHistoryTable'
import { CompressorUsageCard } from '../components/devices/CompressorUsageCard'
import { NotificationPreferencesModal } from '../components/devices/NotificationPreferencesModal'
import { CreateMaintenanceModal } from '../components/maintenance/CreateMaintenanceModal'
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
  onNavigateTab,
  monitoringStatus = 'normal',
  pollingCadenceLabel = '30s',
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [createForAlert, setCreateForAlert] = useState(null)
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false)

  const currentDevice = devices.find((d) => d.deviceId === deviceId)
  const isOnline = currentDevice?.status === 'online' || Boolean(latestData?.receivedAt)

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
            Regresá a la pantalla principal para seleccionar un equipo de la flota.
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
                {currentDevice?.name ? `${currentDevice.name} (${deviceId})` : deviceId}
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
              {latestData?.source === 'simulator'
                ? 'Origen de datos: Simulador Web IoT'
                : 'Origen de datos: Gateway Serial / MQTT'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNotifOpen(true)}
            title="Configurar notificaciones de correo para este equipo"
          >
            <Bell className="w-3.5 h-3.5 text-cold-ice" />
            <span className="hidden sm:inline">Avisos Correo</span>
          </Button>

          {onNavigateTab && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab('policy')}
              title="Ajustar sensores, umbrales y horarios"
            >
              <Sliders className="w-3.5 h-3.5 text-cold-ice" />
              <span className="hidden sm:inline">Política</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMaintenanceOpen(true)}
            title="Solicitar visita técnica para este equipo"
          >
            <Wrench className="w-3.5 h-3.5 text-cold-ice" />
            <span className="hidden sm:inline">Pedir Técnico</span>
          </Button>

          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>

          <Button variant="primary" size="sm" onClick={onOpenSimulator}>
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulador</span>
          </Button>
        </div>
      </div>

      <TemperatureSection data={latestData} />
      <ActuatorsPanel data={latestData} />
      <ProtectionAndDiagnostics data={latestData} />

      {/* Compressor Operating Hours & Duty Cycle */}
      <CompressorUsageCard deviceId={deviceId} />

      {/* Alertas del equipo */}
      <Card className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between pb-2 border-b border-cold-divider/10">
          <div>
            <h3 className="font-heading text-sm font-semibold text-cold-text flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Alertas Recientes del Equipo
            </h3>
            <p className="text-[11px] text-cold-muted">
              Episodios fuera de rango y diagnósticos del ciclo
            </p>
          </div>
          {onNavigateTab && (
            <button
              type="button"
              onClick={() => onNavigateTab('alerts')}
              className="text-xs text-cold-ice hover:underline font-medium cursor-pointer"
            >
              Ver todas en Alertas →
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="py-4 text-center text-xs text-cold-muted">
            Sin alertas registradas. Los parámetros operan normalmente.
          </div>
        ) : (
          <ul className="divide-y divide-cold-divider/10">
            {alerts.slice(0, 5).map((alert) => (
              <li
                key={alert.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5 text-xs"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={alert.active ? 'danger' : 'success'}>
                    {alert.active ? 'Activa' : 'Resuelta'}
                  </Badge>
                  <span className="font-medium text-cold-text">
                    {alert.description || alert.type.replaceAll('_', ' ')}
                  </span>
                  <time className="text-cold-muted text-[11px]" dateTime={alert.resolvedAt || alert.openedAt}>
                    {new Date(alert.resolvedAt || alert.openedAt).toLocaleString()}
                  </time>
                </div>

                {alert.active && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs py-1 self-start sm:self-auto"
                    onClick={() => setCreateForAlert(alert)}
                  >
                    <Wrench className="w-3.5 h-3.5 text-cold-ice" />
                    Solicitar Técnico
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <TelemetryHistoryTable history={history} />

      <NotificationPreferencesModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        deviceId={deviceId}
      />

      <CreateMaintenanceModal
        isOpen={isMaintenanceOpen || Boolean(createForAlert)}
        onClose={() => {
          setIsMaintenanceOpen(false)
          setCreateForAlert(null)
        }}
        initialDeviceId={deviceId}
        initialAlertId={createForAlert?.id}
        onCreated={() => {
          if (onRefresh) onRefresh()
        }}
      />
    </div>
  )
}
export default DeviceDetailPage
