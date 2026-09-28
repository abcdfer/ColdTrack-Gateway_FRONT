import { useState } from 'react'
import { History, Download, Search, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

export function TelemetryHistoryTable({ history = [] }) {
  const [filter, setFilter] = useState('')

  const filteredHistory = history.filter((item) => {
    if (!filter) return true
    const search = filter.toLowerCase()
    return (
      (item.deviceId && item.deviceId.toLowerCase().includes(search)) ||
      (item.estado && item.estado.toLowerCase().includes(search)) ||
      (item.diagnostico && item.diagnostico.toLowerCase().includes(search))
    )
  })

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `coldtrack_telemetry_${Date.now()}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <Card className="border-[#BECFFF]/15">
      <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <CardTitle>
            <History className="w-4 h-4 text-[#BECFFF]" />
            Registro Histórico de Telemetría
          </CardTitle>
          <span className="text-xs text-[#9CA3AF]">
            Últimas {history.length} lecturas procesadas por la API
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Filtrar eventos..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F3F4F6] placeholder-[#9CA3AF] focus:outline-none focus:border-[#BECFFF]/40"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            disabled={history.length === 0}
            className="shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </CardHeader>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-[#A296BC] font-medium uppercase tracking-wider">
              <th className="py-2.5 px-3">Hora / Fecha</th>
              <th className="py-2.5 px-3">Equipo</th>
              <th className="py-2.5 px-3">T. Interior</th>
              <th className="py-2.5 px-3">T. Condensador</th>
              <th className="py-2.5 px-3">Presiones (B/A)</th>
              <th className="py-2.5 px-3">Compresor</th>
              <th className="py-2.5 px-3">Forzador</th>
              <th className="py-2.5 px-3">Diagnóstico</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#9CA3AF]">
                  No se encontraron lecturas registradas.
                </td>
              </tr>
            ) : (
              filteredHistory.map((item, idx) => {
                const isFault = item.diagnostico && item.diagnostico !== 'SIN_FALLAS'
                const timestamp = item.receivedAt
                  ? new Date(item.receivedAt).toLocaleTimeString()
                  : 'N/A'

                return (
                  <tr
                    key={item.id || idx}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono text-[#F3F4F6]">
                      {timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-medium text-[#BECFFF]">
                      {item.deviceId || 'N/A'}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {typeof item.tempInterior === 'number'
                        ? `${item.tempInterior.toFixed(1)}°C`
                        : '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#9CA3AF]">
                      {typeof item.tempCondensador === 'number'
                        ? `${item.tempCondensador.toFixed(1)}°C`
                        : '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {item.presionBaja ?? '-'}% / {item.presionAlta ?? '-'}%
                    </td>
                    <td className="py-2.5 px-3 font-mono">
                      {item.compresor ?? '-'}%
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#9CA3AF]">
                      {item.fanSolicitado ?? '-'}%
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={isFault ? 'danger' : 'default'}
                        className="text-[10px] py-0 px-2 font-mono"
                      >
                        {isFault ? (
                          <AlertCircle className="w-2.5 h-2.5" />
                        ) : (
                          <CheckCircle className="w-2.5 h-2.5" />
                        )}
                        {item.diagnostico || 'NORMAL'}
                      </Badge>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
