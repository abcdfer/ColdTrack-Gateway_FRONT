import { FleetKPIs } from '../components/dashboard/FleetKPIs'
import { FleetDeviceList } from '../components/dashboard/FleetDeviceList'
import { FleetOperationalTargets } from '../components/dashboard/FleetOperationalTargets'

export function FleetPage({
  devices = [],
  latestDataMap = {},
  searchTerm = '',
  onOpenSimulator,
}) {
  return (
    <div className="space-y-4">
      <FleetKPIs devices={devices} latestDataMap={latestDataMap} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7">
          <FleetDeviceList
            devices={devices}
            latestDataMap={latestDataMap}
            searchTerm={searchTerm}
            onOpenSimulator={onOpenSimulator}
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
