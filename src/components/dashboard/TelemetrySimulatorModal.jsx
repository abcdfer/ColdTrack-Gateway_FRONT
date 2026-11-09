import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

const normal = {
  tempInterior: -18.4, tempCondensador: 36.8, tempSuccion: -22,
  presionAlta: 62, presionBaja: 28,
}
const scenarios = [
  { label: 'Normal / recuperación', values: normal },
  { label: 'Alta presión', values: { ...normal, presionAlta: 96 } },
  { label: 'Baja presión', values: { ...normal, presionBaja: 8 } },
  { label: 'Temperatura alta', values: { ...normal, tempInterior: 8 } },
]
const fields = [
  ['tempInterior', 'Temperatura interior (°C)', -60, 80],
  ['tempCondensador', 'Temperatura condensador (°C)', -60, 120],
  ['tempSuccion', 'Temperatura succión (°C)', -80, 80],
  ['presionAlta', 'Presión alta (%)', 0, 100],
  ['presionBaja', 'Presión baja (%)', 0, 100],
]

export function TelemetrySimulatorModal({ isOpen, onClose, onInject }) {
  const [values, setValues] = useState(normal)
  const [pending, setPending] = useState(false)
  const [feedback, setFeedback] = useState(null)

  async function submit(event) {
    event.preventDefault()
    setPending(true)
    setFeedback(null)
    try {
      const result = await onInject(Object.fromEntries(
        fields.map(([key]) => [key, Number(values[key])]),
      ))
      setFeedback({ message: `SIM-001 · ${result.diagnostico.replaceAll('_', ' ')}` })
    } catch (err) {
      setFeedback({ error: true, message: err.message })
    } finally {
      setPending(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Simulador de telemetría">
      <form className="space-y-4 text-sm" onSubmit={submit}>
        <p className="text-zinc-400">Enviá una lectura de prueba para el equipo SIM-001.</p>
        <div className="flex flex-wrap gap-2">
          {scenarios.map(({ label, values: preset }) => (
            <Button key={label} type="button" size="sm" variant="outline" disabled={pending}
              onClick={() => { setValues(preset); setFeedback(null) }}>
              {label}
            </Button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {fields.map(([key, label, min, max]) => (
            <label key={key} className="grid gap-1 text-xs text-zinc-300">
              {label}
              <input type="number" step="0.1" min={min} max={max} required disabled={pending}
                value={values[key]} onChange={(event) => setValues({ ...values, [key]: event.target.value })}
                className="w-full rounded-lg border border-white/20 bg-zinc-950 p-2 text-white" />
            </label>
          ))}
        </div>
        {feedback && <p role={feedback.error ? 'alert' : 'status'}
          className={feedback.error ? 'text-rose-300' : 'text-[#BECFFF]'}>{feedback.message}</p>}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cerrar</Button>
          <Button type="submit" disabled={pending}>{pending ? 'Enviando…' : 'Enviar lectura'}</Button>
        </div>
      </form>
    </Modal>
  )
}
