import { FleetKPIs } from '../components/dashboard/FleetKPIs'
import { FleetDeviceList } from '../components/dashboard/FleetDeviceList'
import { FleetOperationalTargets } from '../components/dashboard/FleetOperationalTargets'
import { Button } from '../components/ui/Button'
import { PlusCircle, QrCode } from 'lucide-react'

export function FleetPage({
  devices = [],
  latestDataMap = {},
  searchTerm = '',
  onOpenSimulator,
  onOpenAddDevice,
}) {
  return (
    <div className="space-y-4">
      {/* Fleet Header with Add Device button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h2 className="font-heading font-bold text-lg text-cold-text">
            Flota de Frío Monitoreada
          </h2>
          <p className="text-xs text-cold-muted">
            Supervisión continua de cámaras frigoríficas, furgones y depósitos térmicos
          </p>
        </div>

        {onOpenAddDevice && (
          <Button
            size="sm"
            variant="primary"
            onClick={onOpenAddDevice}
            className="self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nuevo Equipo / Vincular QR</span>
          </Button>
        )}
      </div>

      <FleetKPIs devices={devices} latestDataMap={latestDataMap} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <FleetDeviceList
            devices={devices}
            latestDataMap={latestDataMap}
            searchTerm={searchTerm}
            onOpenSimulator={onOpenSimulator}
            onOpenAddDevice={onOpenAddDevice}
          />
        </div>

        <div className="lg:col-span-5">
          <FleetOperationalTargets
            devices={devices}
            latestDataMap={latestDataMap}
          />
        </div>
      </div>
    </div>
  )
}
export default FleetPage
