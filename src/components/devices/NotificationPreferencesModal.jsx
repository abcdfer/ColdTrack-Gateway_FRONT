import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import {
  fetchNotificationPreferences,
  updateNotificationPreferences,
} from '@/services/api'
import {
  Bell,
  Mail,
  VolumeX,
  Volume2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

const KNOWN_CODES = [
  { code: 'tempInterior:max', label: 'Temperatura Interior Alta', desc: 'Desvío sobre umbral máximo' },
  { code: 'tempInterior:min', label: 'Temperatura Interior Baja', desc: 'Congelamiento excesivo' },
  { code: 'tempCondensador:max', label: 'Condensador Sobrecalentado', desc: 'Riesgo de falla de compresor' },
  { code: 'presionAlta:max', label: 'Presión Alta Excedida', desc: 'Disparo de protección alta' },
  { code: 'presionBaja:min', label: 'Presión Baja Insuficiente', desc: 'Pérdida de refrigerante' },
]

export function NotificationPreferencesModal({ isOpen, onClose, deviceId }) {
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [mutedCodes, setMutedCodes] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!isOpen || !deviceId) return
    let active = true
    setLoading(true)
    setError('')
    setSuccess('')
    fetchNotificationPreferences(deviceId)
      .then((prefs) => {
        if (!active) return
        setEmailEnabled(Boolean(prefs.emailEnabled))
        setMutedCodes(prefs.mutedCodes || [])
      })
      .catch((err) => {
        if (active) setError(err.message || 'Error al cargar preferencias')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [isOpen, deviceId])

  function toggleCode(code) {
    setMutedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    )
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      await updateNotificationPreferences(deviceId, {
        emailEnabled,
        mutedCodes,
      })
      setSuccess('Preferencias guardadas exitosamente.')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al guardar preferencias')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Preferencias de Correo y Avisos">
      <div className="space-y-4 text-xs">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-cold-dark/60 border border-cold-ice/15">
          <div className="p-2.5 rounded-xl bg-cold-ice/10 text-cold-ice border border-cold-ice/20">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-xs text-cold-text">
              Notificaciones para {deviceId}
            </h4>
            <p className="text-[11px] text-cold-muted">
              Elegí qué alertas generan avisos por correo electrónico automático.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-cold-muted">
            <RefreshCw className="w-4 h-4 animate-spin text-cold-ice" />
            <span>Consultando preferencias del equipo…</span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Master toggle */}
            <div className="p-3.5 rounded-xl bg-cold-dark/70 border border-cold-ice/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className={`w-4 h-4 ${emailEnabled ? 'text-cold-ice' : 'text-cold-muted'}`} />
                <div>
                  <span className="font-medium text-cold-text block">
                    Notificaciones Generales por Correo
                  </span>
                  <span className="text-[10px] text-cold-muted">
                    {emailEnabled ? 'Habilitadas para este equipo' : 'Silenciadas completamente'}
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-cold-shade peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cold-ice"></div>
              </label>
            </div>

            {/* Muted codes manager */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-cold-lavender uppercase tracking-wider block">
                Reglas y Silenciamiento Específico
              </span>
              <p className="text-[11px] text-cold-muted">
                Marcá las alertas que deseás silenciar (no enviarán avisos por correo):
              </p>

              <div className="space-y-1.5 mt-2">
                {KNOWN_CODES.map(({ code, label, desc }) => {
                  const isMuted = mutedCodes.includes(code)
                  return (
                    <div
                      key={code}
                      onClick={() => toggleCode(code)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isMuted
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : 'bg-cold-dark/40 border-cold-divider/10 text-cold-text hover:border-cold-ice/30'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-cold-ice shrink-0" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs">{label}</span>
                            <code className="text-[10px] font-mono opacity-60">[{code}]</code>
                          </div>
                          <span className="text-[10px] opacity-75">{desc}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border border-current">
                        {isMuted ? 'Silenciada' : 'Activa'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-cold-divider/10">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cerrar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Guardando…' : 'Guardar Preferencias'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
