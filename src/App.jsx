import { useState, useEffect } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { useTelemetry } from './hooks/useTelemetry'
import { Sidebar } from './components/layout/Sidebar'
import { TopNavbar } from './components/layout/TopNavbar'
import { RightSidebar } from './components/layout/RightSidebar'
import { Footer } from './components/layout/Footer'
import { FleetPage } from './pages/FleetPage'
import { DeviceDetailPage } from './pages/DeviceDetailPage'
import { TelemetrySimulatorModal } from './components/dashboard/TelemetrySimulatorModal'
import { SystemInfoModal } from './components/dashboard/SystemInfoModal'
import { UnderConstructionModal } from './components/ui/UnderConstructionModal'
import { Button } from './components/ui/Button'

export default function App() {
  const [activeDeviceFromUrl, setActiveDeviceFromUrl] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('device') || null
  })

  const [activeTab, setActiveTab] = useState(activeDeviceFromUrl ? 'telemetry' : 'fleet')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)
  const [isInfoOpen, setIsInfoOpen] = useState(false)
  const [underConstructionModule, setUnderConstructionModule] = useState(null)

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const dev = params.get('device') || null
      setActiveDeviceFromUrl(dev)
      if (dev) {
        setActiveTab('telemetry')
      } else {
        setActiveTab('fleet')
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

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

  const alertCount = devices.filter((d) => (latestDataMap[d.deviceId]?.state || d.state) === 'alert').length

  return (
    <div className="min-h-screen bg-black text-[#F3F4F6] flex flex-col font-sans selection:bg-[#BECFFF]/20 selection:text-[#BECFFF]">
      <div className="flex-1 w-full max-w-[1720px] mx-auto p-3 sm:p-5 flex gap-4 lg:gap-5">
        <div className="hidden lg:block">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
            onOpenInfo={() => setIsInfoOpen(true)}
            onOpenConstruction={(name) => setUnderConstructionModule(name)}
            activeDeviceId={activeDeviceFromUrl}
            devices={devices}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <TopNavbar
            title={activeDeviceFromUrl ? `Telemetría ${activeDeviceFromUrl}` : 'Dashboard'}
            subtitle={
              activeDeviceFromUrl
                ? 'Monitoreo de ciclo térmico, presiones y actuadores de la unidad'
                : 'Resumen operativo y estado en tiempo real de la flota frigorífica'
            }
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onOpenSimulator={() => setIsSimulatorOpen(true)}
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
                  <h4 className="font-heading font-semibold text-xs text-[#F3F4F6]">
                    ColdTrack API Desconectada
                  </h4>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                    No se pudieron actualizar los datos. Volvé a intentar la conexión.
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
                  Simulador
                </Button>
              </div>
            </div>
          )}

          <div className="flex-1">
            {activeDeviceFromUrl ? (
              <DeviceDetailPage
                deviceId={activeDeviceFromUrl}
                devices={devices}
                latestData={latestData}
                history={history}
                alerts={alerts}
                onRefresh={refreshData}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
                monitoringStatus={monitoringStatus}
                pollingCadenceLabel={pollingCadenceLabel}
              />
            ) : (
              <FleetPage
                devices={devices}
                latestDataMap={latestDataMap}
                searchTerm={searchTerm}
                onOpenSimulator={() => setIsSimulatorOpen(true)}
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

      <TelemetrySimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onInject={injectTelemetry}
      />

      <SystemInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        healthInfo={healthInfo}
      />

      <UnderConstructionModal
        isOpen={Boolean(underConstructionModule)}
        onClose={() => setUnderConstructionModule(null)}
        moduleName={underConstructionModule}
      />
    </div>
  )
}
