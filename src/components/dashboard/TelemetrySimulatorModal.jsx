import { useState } from 'react'
import { Play, Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

const PRESETS = [
  {
    name: 'Ciclo Normal de Frío',
    data: {
      deviceId: 'CT-001',
      estado: 'REFRIGERANDO',
      diagnostico: 'SIN_FALLAS',
      tempInterior: -18.4,
      tempCondensador: 36.8,
      tempSuccion: -22.0,
      presionBaja: 28,
      presionAlta: 62,
      compresor: 85,
      fanSolicitado: 90,
      fanPWM: 230,
      fanRpm: 1450.0,
      proteccionAlta: 0,
      proteccionBaja: 0,
      ordenParoCompresor: 0,
      uptimeMs: 145000,
    },
  },
  {
    name: 'Alarma de Alta Presión',
    data: {
      deviceId: 'CT-001',
      estado: 'FALLA_CRITICA',
      diagnostico: 'FALLA_PRESION_ALTA',
      tempInterior: 7.8,
      tempCondensador: 68.5,
      tempSuccion: 3.2,
      presionBaja: 40,
      presionAlta: 96,
      compresor: 0,
      fanSolicitado: 100,
      fanPWM: 255,
      fanRpm: 1600.0,
      proteccionAlta: 1,
      proteccionBaja: 0,
      ordenParoCompresor: 1,
      uptimeMs: 320000,
    },
  },
  {
    name: 'Falla Sensor / Presión Baja',
    data: {
      deviceId: 'CT-001',
      estado: 'ALARMA_LP',
      diagnostico: 'FALLA_PRESION_BAJA',
      tempInterior: 1.2,
      tempCondensador: 29.4,
      tempSuccion: -31.0,
      presionBaja: 8,
      presionAlta: 45,
      compresor: 0,
      fanSolicitado: 40,
      fanPWM: 102,
      fanRpm: 800.0,
      proteccionAlta: 0,
      proteccionBaja: 1,
      ordenParoCompresor: 1,
      uptimeMs: 450000,
    },
  },
]

export function TelemetrySimulatorModal({ isOpen, onClose, onInject }) {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0)
  const [formData, setFormData] = useState(PRESETS[0].data)
  const [isSending, setIsSending] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const handleSelectPreset = (idx) => {
    setSelectedPresetIndex(idx)
    setFormData(PRESETS[idx].data)
    setFeedback(null)
  }

  const handleChangeField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSend = async (e) => {
    e.preventDefault()
    setIsSending(true)
    setFeedback(null)
    try {
      await onInject({
        ...formData,
        uptimeMs: Number(formData.uptimeMs) || 100000,
      })
      setFeedback({ type: 'success', text: 'Telemetría enviada a la API con éxito.' })
      setTimeout(() => {
        onClose()
        setFeedback(null)
      }, 1200)
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Error al enviar telemetría.' })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Simulador de Telemetría IoT">
      <div className="space-y-4 text-xs">
        <div>
          <span className="text-[#9CA3AF] block mb-2 font-medium">
            Selecciona un escenario de prueba preconfigurado:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {PRESETS.map((preset, idx) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleSelectPreset(idx)}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  selectedPresetIndex === idx
                    ? 'bg-[#BECFFF]/15 border-[#BECFFF]/50 text-[#F3F4F6] shadow-[0_0_10px_rgba(190,207,255,0.2)]'
                    : 'bg-black/40 border-white/10 text-[#9CA3AF] hover:border-white/20'
                }`}
              >
                <span className="font-heading font-semibold block text-[11px]">
                  {preset.name}
                </span>
                <span className="text-[10px] text-[#A296BC] mt-0.5 block">
                  {preset.data.diagnostico}
                </span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSend} className="space-y-3 pt-2 border-t border-white/10">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[#9CA3AF] block mb-1">Device ID</label>
              <input
                type="text"
                value={formData.deviceId}
                onChange={(e) => handleChangeField('deviceId', e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F3F4F6] font-mono focus:border-[#BECFFF]/40 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[#9CA3AF] block mb-1">Estado</label>
              <input
                type="text"
                value={formData.estado}
                onChange={(e) => handleChangeField('estado', e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F3F4F6] font-mono focus:border-[#BECFFF]/40 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[#9CA3AF] block mb-1">Diagnóstico</label>
              <input
                type="text"
                value={formData.diagnostico}
                onChange={(e) => handleChangeField('diagnostico', e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F3F4F6] font-mono focus:border-[#BECFFF]/40 outline-none"
                required
              />
            </div>

            <div>
              <label className="text-[#9CA3AF] block mb-1">Temp Interior (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.tempInterior}
                onChange={(e) => handleChangeField('tempInterior', parseFloat(e.target.value) || 0)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F3F4F6] font-mono focus:border-[#BECFFF]/40 outline-none"
              />
            </div>

            <div>
              <label className="text-[#9CA3AF] block mb-1">Temp Condensador (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.tempCondensador}
                onChange={(e) => handleChangeField('tempCondensador', parseFloat(e.target.value) || 0)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F3F4F6] font-mono focus:border-[#BECFFF]/40 outline-none"
              />
            </div>

            <div>
              <label className="text-[#9CA3AF] block mb-1">Temp Succión (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.tempSuccion}
                onChange={(e) => handleChangeField('tempSuccion', parseFloat(e.target.value) || 0)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F3F4F6] font-mono focus:border-[#BECFFF]/40 outline-none"
              />
            </div>

            <div>
              <label className="text-[#9CA3AF] block mb-1">Presión Baja (%)</label>
              <input
                type="number"
                value={formData.presionBaja}
                onChange={(e) => handleChangeField('presionBaja', parseInt(e.target.value, 10) || 0)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F3F4F6] font-mono focus:border-[#BECFFF]/40 outline-none"
              />
            </div>

            <div>
              <label className="text-[#9CA3AF] block mb-1">Presión Alta (%)</label>
              <input
                type="number"
                value={formData.presionAlta}
                onChange={(e) => handleChangeField('presionAlta', parseInt(e.target.value, 10) || 0)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F3F4F6] font-mono focus:border-[#BECFFF]/40 outline-none"
              />
            </div>

            <div>
              <label className="text-[#9CA3AF] block mb-1">Compresor (%)</label>
              <input
                type="number"
                value={formData.compresor}
                onChange={(e) => handleChangeField('compresor', parseInt(e.target.value, 10) || 0)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-[#F3F4F6] font-mono focus:border-[#BECFFF]/40 outline-none"
              />
            </div>
          </div>

          {feedback && (
            <div
              className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSending}
            >
              <Send className="w-3.5 h-3.5" />
              {isSending ? 'Enviando...' : 'Enviar al Backend'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
