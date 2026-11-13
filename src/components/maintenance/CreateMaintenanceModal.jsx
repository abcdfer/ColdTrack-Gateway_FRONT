import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import {
  fetchDevices,
  fetchContacts,
  fetchTechnicians,
  fetchAlerts,
  createMaintenanceRequest,
} from '@/services/api'
import { Wrench, AlertTriangle, UserCheck, CheckCircle2, AlertCircle } from 'lucide-react'

export function CreateMaintenanceModal({
  isOpen,
  onClose,
  initialDeviceId = '',
  initialAlertId = null,
  onCreated,
}) {
  const [devices, setDevices] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [deviceAlerts, setDeviceAlerts] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(initialDeviceId)
  const [selectedTechnician, setSelectedTechnician] = useState('')
  const [selectedAlert, setSelectedAlert] = useState(initialAlertId || '')
  const [description, setDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    let active = true
    setLoading(true)
    setError('')
    setSelectedDevice(initialDeviceId)
    setSelectedAlert(initialAlertId || '')

    Promise.all([fetchDevices(), fetchContacts(), fetchTechnicians()])
      .then(([devData, contData, techData]) => {
        if (!active) return
        const devList = devData.devices || []
        setDevices(devList)
        if (!selectedDevice && devList.length > 0) {
          setSelectedDevice(devList[0].deviceId)
        }

        // Prioritize contacts, or fall back to directory
        const list = contData.items?.length > 0 ? contData.items : techData.items || []
        setTechnicians(list)
        if (list.length > 0) {
          setSelectedTechnician(String(list[0].id))
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
  }, [isOpen, initialDeviceId, initialAlertId])

  // Load alerts when selectedDevice changes
  useEffect(() => {
    if (!selectedDevice) return
    let active = true
    fetchAlerts(selectedDevice)
      .then((res) => {
        if (active) setDeviceAlerts(res.items || [])
      })
      .catch(() => {
        if (active) setDeviceAlerts([])
      })
    return () => {
      active = false
    }
  }, [selectedDevice])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const payload = {
        deviceId: selectedDevice,
        technicianId: Number(selectedTechnician),
        notes: notes.trim() || undefined,
      }

      if (selectedAlert) {
        payload.alertId = Number(selectedAlert)
      } else {
        payload.description = description.trim() || 'Mantenimiento preventivo general'
      }

      const created = await createMaintenanceRequest(payload)
      if (onCreated) onCreated(created)
      onClose()
    } catch (err) {
      setError(err.message || 'Error al generar la solicitud de mantenimiento')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Solicitud de Mantenimiento">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-cold-dark/60 border border-cold-ice/15">
          <div className="p-2.5 rounded-xl bg-cold-ice/10 text-cold-ice border border-cold-ice/20">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-xs text-cold-text">
              Nueva Orden de Asistencia Técnica
            </h4>
            <p className="text-[11px] text-cold-muted">
              Asigná un técnico matriculado para resolver desvíos o realizar revisión programada.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="grid gap-1 font-medium text-cold-text">
            <span>Equipo Afectado</span>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
            >
              {devices.map((d) => (
                <option key={d.deviceId} value={d.deviceId}>
                  {d.name ? `${d.name} (${d.deviceId})` : d.deviceId}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 font-medium text-cold-text">
            <span>Técnico Asignado</span>
            <select
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
            >
              {technicians.length === 0 ? (
                <option value="">No hay técnicos disponibles</option>
              ) : (
                technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.email})
                  </option>
                ))
              )}
            </select>
          </label>
        </div>

        {deviceAlerts.length > 0 && (
          <label className="grid gap-1 font-medium text-cold-text">
            <span>Vincular con Alerta del Equipo (Opcional)</span>
            <select
              value={selectedAlert}
              onChange={(e) => setSelectedAlert(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
            >
              <option value="">Ninguna / Solicitud Manual</option>
              {deviceAlerts.map((a) => (
                <option key={a.id} value={a.id}>
                  Alerta #{a.id} - {a.description || a.type} ({a.active ? 'Activa' : 'Resuelta'})
                </option>
              ))}
            </select>
          </label>
        )}

        {!selectedAlert && (
          <label className="grid gap-1 font-medium text-cold-text">
            <span>Descripción del Problema o Tarea</span>
            <input
              type="text"
              required
              maxLength={1500}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Revisión de carga de gas y limpieza de serpentina"
              className="w-full px-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
            />
          </label>
        )}

        <label className="grid gap-1 font-medium text-cold-text">
          <span>Notas Adicionales para el Técnico (Opcional)</span>
          <textarea
            rows={3}
            maxLength={1500}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Horario de acceso a planta, precauciones de seguridad, etc."
            className="w-full px-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text resize-none"
          />
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-cold-divider/10">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={submitting || !selectedDevice || !selectedTechnician}
          >
            {submitting ? 'Enviando…' : 'Crear Solicitud'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
