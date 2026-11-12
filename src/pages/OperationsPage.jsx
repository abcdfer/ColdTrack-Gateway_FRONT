import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { DevicePolicyForm } from '@/components/operations/DevicePolicyForm'
import * as api from '@/services/api'

export default function OperationsPage({ account }) {
  const owner = account.role === 'owner'
  const [devices, setDevices] = useState([])
  const [directory, setDirectory] = useState([])
  const [contacts, setContacts] = useState([])
  const [reviews, setReviews] = useState([])
  const [deviceId, setDeviceId] = useState('')
  const [details, setDetails] = useState(null)
  const [token, setToken] = useState(null)
  const [error, setError] = useState('')
  const [deviceError, setDeviceError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let current = true
    const requests = [api.fetchReviews()]
    if (owner) requests.push(api.fetchDevices(), api.fetchTechnicians(), api.fetchContacts())
    Promise.all(requests).then(([reviewList, deviceList, technicianList, contactList]) => {
      if (!current) return
      setReviews(reviewList.items)
      if (owner) {
        const items = deviceList.devices
        setDevices(items)
        setDeviceId(items[0]?.deviceId ?? '')
        setDirectory(technicianList.items)
        setContacts(contactList.items)
      }
    }).catch((err) => { if (current) setError(err.message) })
      .finally(() => { if (current) setLoading(false) })
    return () => { current = false }
  }, [owner])

  useEffect(() => {
    if (!deviceId) return
    let current = true
    Promise.all([api.fetchPolicy(deviceId), api.fetchAlerts(deviceId)]).then(([policy, result]) => {
      if (current) setDetails({ deviceId, policy, alerts: result.items })
    }).catch((err) => { if (current) setDeviceError(err.message) })
    return () => { current = false }
  }, [deviceId])

  async function act(action, success) {
    setPending(true)
    setError('')
    setNotice('')
    try {
      await action()
      setNotice(success)
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  function selectDevice(id) {
    setDeviceError('')
    setDetails(null)
    setDeviceId(id)
  }

  function createDevice(event) {
    event.preventDefault()
    const form = event.currentTarget
    const name = new FormData(form).get('name')
    act(async () => {
      const created = await api.createDevice({ name })
      setDevices((previous) => [...previous, { name: created.name, deviceId: created.deviceId }])
      setToken(created)
      selectDevice(created.deviceId)
      form.reset()
    }, 'Equipo registrado.')
  }

  function saveContact(event) {
    event.preventDefault()
    const id = new FormData(event.currentTarget).get('technicianId')
    act(async () => {
      await api.saveContact(id)
      setContacts((await api.fetchContacts()).items)
    }, 'Contacto guardado.')
  }

  function createReview(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    act(async () => {
      const review = await api.createReview({ ...values, alertId: Number(values.alertId), technicianId: Number(values.technicianId) })
      setReviews((previous) => [review, ...previous.filter((item) => item.id !== review.id)])
      form.reset()
    }, 'Solicitud de revisión enviada.')
  }

  const savedIds = new Set(contacts.map((contact) => contact.id))
  const availableTechnicians = directory.filter((technician) => !savedIds.has(technician.id))
  const device = details?.deviceId === deviceId ? details : null

  return (
    <main className="bg-cold-dark px-5 py-6 text-cold-text">
      <div className="mx-auto max-w-5xl space-y-4">
        <h1 className="font-heading text-2xl font-bold">{owner ? 'Operaciones' : 'Solicitudes asignadas'}</h1>
        {error && <p role="alert">{error}</p>}
        {notice && <p role="status">{notice}</p>}
        {loading && <p role="status">Cargando…</p>}
        {owner && !loading && (
          <>
            <section className="operations-form glass-panel rounded-xl p-4">
              <h2 className="text-lg font-semibold">Equipos</h2>
              <form onSubmit={createDevice}>
                <fieldset disabled={pending}>
                  <label>Nombre del nuevo equipo<input name="name" maxLength={100} required /></label>
                  <Button type="submit">Registrar equipo</Button>
                </fieldset>
              </form>
              {token && <div className="space-y-2">
                <p>Token del gateway de {token.name}. Copialo antes de cerrar esta pantalla.</p>
                <code className="block break-all select-all">{token.gatewayToken}</code>
                <Button variant="outline" onClick={() => setToken(null)}>Ocultar token</Button>
              </div>}
              {devices.length > 0 && <label>Equipo seleccionado
                <select value={deviceId} disabled={pending} onChange={(event) => selectDevice(event.target.value)}>
                  {devices.map((item) => <option key={item.deviceId} value={item.deviceId}>{item.name || item.deviceId}</option>)}
                </select>
              </label>}
              {deviceId && <Link className="underline" to={'/?device=' + encodeURIComponent(deviceId)}>Ver telemetría y simulador</Link>}
              {deviceError && <p role="alert">{deviceError}</p>}
              {deviceId && !device && !deviceError && <p role="status">Cargando equipo…</p>}
              {device && <DevicePolicyForm key={deviceId} policy={device.policy} pending={pending} onSave={(changes) => {
                act(async () => {
                  const policy = await api.updatePolicy(deviceId, changes)
                  setDetails({ ...device, policy })
                }, 'Configuración guardada.')
              }} />}
            </section>
            <section className="operations-form glass-panel rounded-xl p-4">
              <h2 className="text-lg font-semibold">Contactos técnicos</h2>
              {contacts.length === 0 && <p>Todavía no guardaste contactos.</p>}
              <ul className="space-y-2">{contacts.map((contact) => (
                <li key={contact.id}>{contact.name} · <a className="underline" href={'mailto:' + contact.email}>{contact.email}</a>
                  {contact.phone && <> · <a className="underline" href={'tel:' + contact.phone}>{contact.phone}</a></>}
                </li>
              ))}</ul>
              {availableTechnicians.length > 0 && <form onSubmit={saveContact}>
                <fieldset disabled={pending}>
                  <label>Técnico registrado<select name="technicianId" required>
                    <option value="">Seleccioná un técnico</option>
                    {availableTechnicians.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select></label>
                  <Button type="submit">Guardar contacto</Button>
                </fieldset>
              </form>}
            </section>
            {device && <section className="operations-form glass-panel rounded-xl p-4">
              <h2 className="text-lg font-semibold">Alertas y diagnóstico</h2>
              {device.alerts.length === 0 && <p>El equipo todavía no tiene alertas.</p>}
              {device.alerts.map((alert) => <div key={alert.id} className="border-b border-cold-divider/30 pb-3">
                <p className="font-semibold">{alert.description || alert.type}</p>
                <p>{alert.active ? 'Activa' : 'Resuelta'}</p>
              </div>)}
              {device.alerts.length > 0 && contacts.length === 0 && <p>Guardá un contacto técnico para solicitar una revisión.</p>}
              {device.alerts.length > 0 && contacts.length > 0 && <form key={deviceId} onSubmit={createReview}>
                <fieldset disabled={pending}>
                  <label>Alerta<select name="alertId" required>
                    <option value="">Seleccioná una alerta</option>
                    {device.alerts.map((item) => <option key={item.id} value={item.id}>{item.description || item.type}</option>)}
                  </select></label>
                  <label>Asignar a<select name="technicianId" required>
                    <option value="">Seleccioná un contacto</option>
                    {contacts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                  </select></label>
                  <label>Detalle adicional (opcional)<textarea name="notes" maxLength={1500} /></label>
                  <Button type="submit">Solicitar revisión</Button>
                </fieldset>
              </form>}
            </section>}
          </>
        )}
        {!loading && <section className="glass-panel space-y-3 rounded-xl p-4">
          <h2 className="text-lg font-semibold">Historial de solicitudes</h2>
          {reviews.length === 0 && <p>Todavía no hay solicitudes.</p>}
          {reviews.map((review) => (
            <article key={review.id} className="space-y-1 border-b border-cold-divider/30 pb-3">
              <h3 className="font-semibold">{review.deviceId} · {review.description}</h3>
              {review.notes && <p>{review.notes}</p>}
              {owner && <p>Técnico: {contacts.find((contact) => contact.id === review.technicianId)?.name ?? review.technicianId}</p>}
            </article>
          ))}
        </section>}
      </div>
    </main>
  )
}
