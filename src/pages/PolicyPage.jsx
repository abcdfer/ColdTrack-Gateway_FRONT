import { useState, useEffect } from 'react'
import { fetchDevices, fetchPolicy, updatePolicy } from '@/services/api'
import { DevicePolicyForm } from '@/components/operations/DevicePolicyForm'
import { NotificationPreferencesModal } from '@/components/devices/NotificationPreferencesModal'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Sliders, Bell, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'

export function PolicyPage({ initialDeviceId = '' }) {
  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState(initialDeviceId)
  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchDevices()
      .then((data) => {
        if (!active) return
        const devList = data.devices || []
        setDevices(devList)
        if (!selectedDeviceId && devList.length > 0) {
          setSelectedDeviceId(devList[0].deviceId)
        }
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [selectedDeviceId])

  useEffect(() => {
    if (!selectedDeviceId) return
    let active = true
    setLoading(true)
    setError('')
    setNotice('')
    fetchPolicy(selectedDeviceId)
      .then((data) => {
        if (active) setPolicy(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Error al obtener política del equipo')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [selectedDeviceId])

  async function handleSave(changes) {
    setPending(true)
    setError('')
    setNotice('')
    try {
      const updated = await updatePolicy(selectedDeviceId, changes)
      setPolicy(updated)
      setNotice('Configuración de captura y umbrales guardada correctamente.')
      setTimeout(() => setNotice(''), 3500)
    } catch (err) {
      setError(err.message || 'Error al actualizar la configuración')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cold-divider/10">
        <div>
          <h2 className="font-heading font-bold text-xl text-cold-text flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cold-ice" />
            Políticas de Captura, Canales y Horarios
          </h2>
          <p className="text-xs text-cold-muted mt-0.5">
            Configurá qué sensores muestrean, umbrales de disparo y ventanas horarias de operación
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

          {selectedDeviceId && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNotifOpen(true)}
              title="Configurar avisos de correo para este equipo"
            >
              <Bell className="w-3.5 h-3.5 text-cold-ice" />
              <span>Avisos por Correo</span>
            </Button>
          )}
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !policy ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-cold-muted">
          <RefreshCw className="w-6 h-6 animate-spin text-cold-ice" />
          <span className="text-xs">Cargando política del equipo {selectedDeviceId}…</span>
        </div>
      ) : !policy ? (
        <Card className="py-12 text-center text-xs text-cold-muted">
          No se encontró configuración para el equipo seleccionado.
        </Card>
      ) : (
        <Card className="p-5 sm:p-6">
          <DevicePolicyForm
            key={selectedDeviceId}
            deviceId={selectedDeviceId}
            policy={policy}
            pending={pending}
            onSave={handleSave}
          />
        </Card>
      )}

      {selectedDeviceId && (
        <NotificationPreferencesModal
          isOpen={isNotifOpen}
          onClose={() => setIsNotifOpen(false)}
          deviceId={selectedDeviceId}
        />
      )}
    </div>
  )
}
export default PolicyPage
