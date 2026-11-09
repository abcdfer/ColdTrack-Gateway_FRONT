import { Truck, Activity, ShieldCheck, AlertTriangle } from 'lucide-react'
import { Card } from '../ui/Card'

export function FleetKPIs({ devices = [], latestDataMap = {} }) {
  const total = devices.length
  const online = devices.filter((d) => d.status === 'online').length
  const alerts = devices.filter((d) => {
    const data = latestDataMap[d.deviceId]
    return (data?.state || d.state) === 'alert'
  }).length
  const compliant = Math.max(0, total - alerts)
  const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 100

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      <Card className="border-[#BECFFF]/20 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#9CA3AF] uppercase font-medium">
            Total Unidades
          </span>
          <div className="p-2 rounded-lg bg-[#BECFFF]/10 text-[#BECFFF]">
            <Truck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F3F4F6]">
            {total}
          </span>
          <span className="text-[10px] text-[#BECFFF] font-medium font-mono">
            {total > 0 ? '+100% registradas' : 'esperando'}
          </span>
        </div>
      </Card>

      <Card className="border-emerald-500/20 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-emerald-400 uppercase font-medium">
            En Tránsito / Online
          </span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400">
            {online}
          </span>
          <span className="text-[10px] text-emerald-400/80 font-mono">
            telemetría activa
          </span>
        </div>
      </Card>

      <Card className="border-[#BECFFF]/20 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#BECFFF] uppercase font-medium">
            Cadena Asegurada
          </span>
          <div className="p-2 rounded-lg bg-[#BECFFF]/10 text-[#BECFFF]">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F3F4F6]">
            {complianceRate}%
          </span>
          <span className="text-[10px] text-[#BECFFF] font-mono">
            régimen térmico
          </span>
        </div>
      </Card>

      <Card className="border-rose-500/25 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-rose-400 uppercase font-medium">
            Alertas Críticas
          </span>
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-heading font-extrabold text-2xl sm:text-3xl text-rose-400">
            {alerts}
          </span>
          <span className="text-[10px] text-rose-300 font-mono">
            {alerts === 0 ? 'sin anomalías' : 'requiere atención'}
          </span>
        </div>
      </Card>
    </div>
  )
}
