import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useTelemetry } from './hooks/useTelemetry'
import { Sidebar } from './components/layout/Sidebar'
import { TopNavbar } from './components/layout/TopNavbar'
import { RightSidebar } from './components/layout/RightSidebar'
import { Footer } from './components/layout/Footer'
import { FleetPage } from './pages/FleetPage'
import { DeviceDetailPage } from './pages/DeviceDetailPage'
import { AlertsPage } from './pages/AlertsPage'
import { PolicyPage } from './pages/PolicyPage'
import { MaintenancePage } from './components/maintenance/MaintenancePage'
import { TechniciansPage } from './components/technicians/TechniciansPage'
import { TelemetrySimulatorModal } from './components/dashboard/TelemetrySimulatorModal'
import { SystemInfoModal } from './components/dashboard/SystemInfoModal'
import { AddDeviceModal } from './components/devices/AddDeviceModal'
import { UserProfileModal } from './components/profile/UserProfileModal'
import { AIAssistantModal } from './components/assistant/AIAssistantModal'
import { useAuthStore } from './store/useAuthStore'
import { Button } from './components/ui/Button'

export default function App() {
  const session = useAuthStore((state) => state.session)
  const account = session?.account
  const registered = Boolean(account)

  const [params] = useSearchParams()
  const activeDeviceFromUrl = params.get('device') || null

  const [activeTab, setActiveTab] = useState(activeDeviceFromUrl ? 'telemetry' : 'fleet')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)

  const {
    isConnected,
    healthInfo,
    devices,
    latestData,
    latestDataMap,
    history,
    alerts,
    isAutoRefresh,
    setIsAutoRefresh,
    lastUpdated,
    refreshData,
    injectTelemetry,
    monitoringStatus,
    pollingCadenceLabel,
  } = useTelemetry(activeDeviceFromUrl)

  const alertCount = devices.filter(
    (d) => (latestDataMap[d.deviceId]?.state || d.state) === 'alert'
  ).length

  const activeDeviceId = activeDeviceFromUrl || (devices.length > 0 ? devices[0].deviceId : '')

  function getPageHeader() {
    switch (activeTab) {
      case 'fleet':
        return {
          title: 'Flota de Frío',
          subtitle: 'Resumen operativo y estado en tiempo real de la flota frigorífica',
        }
      case 'telemetry':
        return {
          title: activeDeviceId ? `Telemetría ${activeDeviceId}` : 'Telemetría',
          subtitle: 'Monitoreo de ciclo térmico, presiones, horas de compresor y actuadores',
        }
      case 'alerts':
        return {
          title: 'Alertas & Diagnóstico',
          subtitle: 'Desvíos de temperatura, fallas de compresión y avisos automáticos',
        }
      case 'maintenance':
        return {
          title: 'Mantenimiento & Órdenes de Trabajo',
          subtitle: 'Asignación técnica, seguimiento de incidentes y calificación de servicio',
        }
      case 'technicians':
        return {
          title: 'Red de Técnicos Matriculados',
          subtitle: 'Directorio de profesionales de refrigeración y agenda de contactos',
        }
      case 'policy':
        return {
          title: 'Políticas de Captura & Sensores',
          subtitle: 'Canales habilitados, umbrales de seguridad, horarios y confirmación ACK',
        }
      default:
        return {
          title: 'ColdTrack Dashboard',
          subtitle: 'Monitoreo y telemetría de frío industrial',
        }
    }
  }

  const { title, subtitle } = getPageHeader()

  return (
    <div className="min-h-screen bg-cold-dark text-cold-text flex flex-col font-sans selection:bg-cold-ice/20 selection:text-cold-ice">
      <div className="flex-1 w-full max-w-[1720px] mx-auto p-3 sm:p-5 flex gap-4 lg:gap-5">
        <div className="hidden lg:block">
          <Sidebar
            activeTab={activeDeviceFromUrl ? 'telemetry' : activeTab}
            setActiveTab={setActiveTab}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenAddDevice={() => setIsAddDeviceOpen(true)}
            onOpenInfo={() => setIsInfoOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            activeDeviceId={activeDeviceId}
            devices={devices}
            alertCount={alertCount}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <TopNavbar
            title={title}
            subtitle={subtitle}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onOpenAlerts={() => setActiveTab('alerts')}
            onRefresh={refreshData}
            isConnected={isConnected}
            isAutoRefresh={isAutoRefresh}
            setIsAutoRefresh={setIsAutoRefresh}
            alertCount={alertCount}
            monitoringStatus={monitoringStatus}
            pollingCadenceLabel={pollingCadenceLabel}
          />

          {!isConnected && (
            <div className="glass-panel border-rose-500/30 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-rose-500/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-xs text-cold-text">
                    ColdTrack Gateway API Desconectada
                  </h4>
                  <p className="text-[11px] text-cold-muted mt-0.5">
                    No se pudieron sincronizar datos con el backend. Verificá tu red o iniciá el simulador.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <Button size="sm" variant="outline" onClick={refreshData}>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reconectar
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setIsSimulatorOpen(true)}
                >
                  Simulador IoT
                </Button>
              </div>
            </div>
          )}

          {/* MAIN CONTENT VIEW */}
          <div className="flex-1">
            {activeDeviceFromUrl || activeTab === 'telemetry' ? (
              <DeviceDetailPage
                deviceId={activeDeviceId}
                devices={devices}
                latestData={latestData}
                history={history}
                alerts={alerts}
                onRefresh={refreshData}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
                monitoringStatus={monitoringStatus}
                pollingCadenceLabel={pollingCadenceLabel}
              />
            ) : activeTab === 'alerts' ? (
              <AlertsPage
                devices={devices}
                initialDeviceId={activeDeviceId}
              />
            ) : activeTab === 'maintenance' ? (
              <MaintenancePage account={account} />
            ) : activeTab === 'technicians' ? (
              <TechniciansPage />
            ) : activeTab === 'policy' ? (
              <PolicyPage initialDeviceId={activeDeviceId} />
            ) : (
              <FleetPage
                devices={devices}
                latestDataMap={latestDataMap}
                searchTerm={searchTerm}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
                onOpenAddDevice={() => setIsAddDeviceOpen(true)}
                onRefresh={refreshData}
              />
            )}
          </div>
        </div>

        <div className="hidden xl:block">
          <RightSidebar
            history={history}
            latestData={latestData}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenInfo={() => setIsInfoOpen(true)}
            onRefresh={refreshData}
          />
        </div>
      </div>

      <Footer onOpenInfo={() => setIsInfoOpen(true)} />

      {/* ALL MODALS */}
      <TelemetrySimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        deviceId={registered ? activeDeviceId || 'CT-001' : 'SIM-001'}
        onInject={injectTelemetry}
      />

      <AddDeviceModal
        isOpen={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        onDeviceCreated={() => {
          refreshData()
        }}
      />

      <SystemInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        healthInfo={healthInfo}
      />

      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />
    </div>
  )
}
