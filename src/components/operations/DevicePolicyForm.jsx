import { useState } from 'react'
import { Button } from '@/components/ui/Button'

const sensors = {
  tempInterior: 'Temperatura interior (°C)',
  tempCondensador: 'Temperatura del condensador (°C)',
  tempSuccion: 'Temperatura de succión (°C)',
  presionAlta: 'Presión alta (%)',
  presionBaja: 'Presión baja (%)',
}
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

export function DevicePolicyForm({ policy, onSave, pending }) {
  const [schedule, setSchedule] = useState(policy.schedule)

  function updateWindow(index, changes) {
    setSchedule((current) => current.map((window, position) => position === index ? { ...window, ...changes } : window))
  }

  function submit(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const limits = {}
    for (const sensor of Object.keys(sensors)) {
      const bounds = {}
      for (const bound of ['min', 'max']) {
        const value = fields.get(sensor + '-' + bound)
        if (value !== '') bounds[bound] = Number(value)
      }
      if (Object.keys(bounds).length) limits[sensor] = bounds
    }
    onSave({ enabled: fields.has('enabled'), channels: fields.getAll('channels'), schedule, limits })
  }

  return (
    <form className="operations-form" onSubmit={submit}>
      <fieldset disabled={pending}>
        <legend>Captura y umbrales</legend>
        <p role="status">Captura {policy.samplingActive ? 'activa' : 'pausada'} según la configuración guardada.</p>
        <label className="flex items-center gap-2"><input name="enabled" type="checkbox" defaultChecked={policy.enabled} /> Habilitar captura</label>
        {Object.entries(sensors).map(([key, label]) => (
          <div key={key} className="grid grid-cols-2 items-end gap-2 sm:grid-cols-3">
            <label className="col-span-2 flex items-center gap-2 sm:col-span-1"><input type="checkbox" name="channels" value={key} defaultChecked={policy.channels.includes(key)} /> {label}</label>
            <label>Mínimo<input name={key + '-min'} aria-label={label + ' mínimo'} type="number" step="any" defaultValue={policy.limits[key]?.min} /></label>
            <label>Máximo<input name={key + '-max'} aria-label={label + ' máximo'} type="number" step="any" defaultValue={policy.limits[key]?.max} /></label>
          </div>
        ))}
        <h3 className="font-semibold">Horarios de operación (UTC)</h3>
        <p>Sin horarios, la captura habilitada opera todo el día. En Argentina, sumá tres horas para convertir a UTC.</p>
        {schedule.map((window, index) => (
          <div key={index} className="grid grid-cols-2 items-end gap-2 sm:grid-cols-4">
            <label>Día<select value={window.day} onChange={(event) => updateWindow(index, { day: Number(event.target.value) })}>
              {days.map((day, value) => <option key={day} value={value}>{day}</option>)}
            </select></label>
            <label>Desde<input type="time" value={window.start} required onChange={(event) => updateWindow(index, { start: event.target.value })} /></label>
            <label>Hasta<input type="time" value={window.end} required onChange={(event) => updateWindow(index, { end: event.target.value })} /></label>
            <Button type="button" variant="outline" onClick={() => setSchedule(schedule.filter((_, position) => position !== index))}>Quitar</Button>
          </div>
        ))}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setSchedule([...schedule, { day: 0, start: '12:00', end: '20:00' }])}>Agregar horario</Button>
          <Button type="submit">Guardar configuración</Button>
        </div>
      </fieldset>
    </form>
  )
}
