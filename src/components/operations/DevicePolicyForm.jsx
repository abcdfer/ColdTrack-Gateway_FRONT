import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { confirmCaptureAck } from '@/services/api'
import {
  Sliders,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Plus,
  Trash2,
  Calendar,
  Layers,
  Activity,
} from 'lucide-react'

const sensors = {
  tempInterior: { label: 'Temperatura interior', unit: '°C', defaultMin: -25, defaultMax: -15 },
  tempCondensador: { label: 'Temperatura del condensador', unit: '°C', defaultMin: 20, defaultMax: 60 },
  tempSuccion: { label: 'Temperatura de succión', unit: '°C', defaultMin: -30, defaultMax: -10 },
  presionAlta: { label: 'Presión alta', unit: 'bar', defaultMin: 40, defaultMax: 90 },
  presionBaja: { label: 'Presión baja', unit: 'bar', defaultMin: 10, defaultMax: 40 },
}

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export function DevicePolicyForm({ policy, onSave, pending, deviceId }) {
  const [schedule, setSchedule] = useState(policy.schedule || [])
  const [ackNotice, setAckNotice] = useState('')
  const [ackPending, setAckPending] = useState(false)
  const [ackError, setAckError] = useState('')

  function updateWindow(index, changes) {
    setSchedule((current) =>
      current.map((window, position) =>
        position === index ? { ...window, ...changes } : window
      )
    )
  }

  function submit(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const limits = {}
    for (const sensor of Object.keys(sensors)) {
      const bounds = {}
      for (const bound of ['min', 'max']) {
        const value = fields.get(sensor + '-' + bound)
        if (value !== '' && value !== null) bounds[bound] = Number(value)
      }
      if (Object.keys(bounds).length) limits[sensor] = bounds
    }
    onSave({
      enabled: fields.has('enabled'),
      channels: fields.getAll('channels'),
      schedule,
      limits,
    })
  }

  async function handleConfirmAck() {
    if (!deviceId || !policy?.revision) return
    setAckPending(true)
    setAckNotice('')
    setAckError('')
    try {
      await confirmCaptureAck(deviceId, policy.revision)
      setAckNotice('Política confirmada por el Gateway (ACK registrado con éxito).')
      setTimeout(() => setAckNotice(''), 3500)
    } catch (err) {
      setAckError(err.message || 'Error al enviar ACK de captura')
    } finally {
      setAckPending(false)
    }
  }

  return (
    <form className="space-y-6" onSubmit={submit}>
      <fieldset disabled={pending} className="space-y-5">
        <legend className="sr-only">Captura y umbrales</legend>

        {/* Sampling Status Card */}
        <div className="p-4 rounded-2xl bg-cold-dark/70 border border-cold-ice/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                policy.samplingActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
            >
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p role="status" className="font-heading font-semibold text-xs text-cold-text">
                Captura {policy.samplingActive ? 'activa' : 'pausada'} según la configuración guardada.
              </p>
              <p className="text-[11px] text-cold-muted">
                Revisión criptográfica: <span className="font-mono text-[10px] text-cold-ice">{policy.revision ? policy.revision.slice(0, 16) + '…' : 'Inicial'}</span>
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-cold-shade/60 border border-cold-divider/10 cursor-pointer self-start sm:self-auto">
            <input
              name="enabled"
              type="checkbox"
              defaultChecked={policy.enabled}
              className="w-4 h-4 rounded text-cold-ice focus:ring-cold-ice bg-cold-dark border-cold-ice/30 cursor-pointer"
            />
            <span className="font-semibold text-xs text-cold-text select-none">
              Habilitar captura
            </span>
          </label>
        </div>

        {/* Sensors & Thresholds */}
        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-xs text-cold-text uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cold-ice" />
            Canales de Telemetría y Límites de Alarma
          </h3>

          <div className="space-y-2">
            {Object.entries(sensors).map(([key, config]) => {
              const isChecked = policy.channels?.includes(key)
              return (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-cold-dark/50 border border-cold-divider/10 grid grid-cols-1 sm:grid-cols-12 items-center gap-3"
                >
                  <label className="sm:col-span-5 flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      name="channels"
                      value={key}
                      defaultChecked={isChecked}
                      className="w-4 h-4 rounded text-cold-ice focus:ring-cold-ice bg-cold-dark border-cold-ice/30 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-medium text-cold-text block">
                        {config.label}
                      </span>
                      <span className="text-[10px] text-cold-lavender font-mono">
                        {key} ({config.unit})
                      </span>
                    </div>
                  </label>

                  <div className="sm:col-span-7 grid grid-cols-2 gap-2">
                    <label className="grid gap-1 text-[11px] text-cold-muted">
                      <span>Mínimo ({config.unit})</span>
                      <input
                        name={key + '-min'}
                        aria-label={config.label + ' (°C) mínimo'}
                        type="number"
                        step="any"
                        defaultValue={policy.limits?.[key]?.min}
                        placeholder={String(config.defaultMin)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-cold-shade/80 border border-cold-divider/15 text-cold-text font-mono focus:border-cold-ice focus:outline-none"
                      />
                    </label>

                    <label className="grid gap-1 text-[11px] text-cold-muted">
                      <span>Máximo ({config.unit})</span>
                      <input
                        name={key + '-max'}
                        aria-label={config.label + ' (°C) máximo'}
                        type="number"
                        step="any"
                        defaultValue={policy.limits?.[key]?.max}
                        placeholder={String(config.defaultMax)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-cold-shade/80 border border-cold-divider/15 text-cold-text font-mono focus:border-cold-ice focus:outline-none"
                      />
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Schedule */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-xs text-cold-text uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cold-ice" />
                Horarios de Operación (UTC)
              </h3>
              <p className="text-[11px] text-cold-muted mt-0.5">
                Sin horarios, la captura habilitada opera las 24 horas del día. En Argentina (UTC-3), sumá 3 horas.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSchedule([...schedule, { day: 0, start: '12:00', end: '20:00' }])}
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar horario
            </Button>
          </div>

          {schedule.length === 0 ? (
            <div className="p-3.5 rounded-xl bg-cold-dark/40 border border-dashed border-cold-divider/15 text-center text-xs text-cold-muted">
              Operación continua 24/7 sin ventanas horarias restrictivas.
            </div>
          ) : (
            <div className="space-y-2">
              {schedule.map((windowItem, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-cold-dark/50 border border-cold-divider/10 grid grid-cols-2 sm:grid-cols-4 items-end gap-2"
                >
                  <label className="grid gap-1 text-[11px] text-cold-muted">
                    <span>Día de la semana</span>
                    <select
                      value={windowItem.day}
                      onChange={(e) => updateWindow(index, { day: Number(e.target.value) })}
                      className="w-full px-2 py-1.5 text-xs rounded-lg bg-cold-shade border border-cold-divider/15 text-cold-text focus:outline-none"
                    >
                      {days.map((day, value) => (
                        <option key={day} value={value}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-1 text-[11px] text-cold-muted">
                    <span>Desde (UTC)</span>
                    <input
                      type="time"
                      value={windowItem.start}
                      required
                      onChange={(e) => updateWindow(index, { start: e.target.value })}
                      className="w-full px-2 py-1.5 text-xs rounded-lg bg-cold-shade border border-cold-divider/15 text-cold-text focus:outline-none"
                    />
                  </label>

                  <label className="grid gap-1 text-[11px] text-cold-muted">
                    <span>Hasta (UTC)</span>
                    <input
                      type="time"
                      value={windowItem.end}
                      required
                      onChange={(e) => updateWindow(index, { end: e.target.value })}
                      className="w-full px-2 py-1.5 text-xs rounded-lg bg-cold-shade border border-cold-divider/15 text-cold-text focus:outline-none"
                    />
                  </label>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-rose-400 hover:text-rose-300 py-1.5"
                    onClick={() => setSchedule(schedule.filter((_, pos) => pos !== index))}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Quitar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cold-divider/10">
          <div className="flex items-center gap-2">
            {deviceId && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={ackPending}
                onClick={handleConfirmAck}
                title="Confirmar recepción y aplicación en firmware"
              >
                <Send className="w-3.5 h-3.5 text-cold-ice" />
                {ackPending ? 'Confirmando…' : 'Confirmar Aplicación (ACK)'}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={pending}>
              {pending ? 'Guardando…' : 'Guardar configuración'}
            </Button>
          </div>
        </div>

        {ackNotice && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{ackNotice}</span>
          </div>
        )}

        {ackError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{ackError}</span>
          </div>
        )}
      </fieldset>
    </form>
  )
}
export default DevicePolicyForm
