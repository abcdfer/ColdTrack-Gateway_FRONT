import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { DevicePolicyForm } from '@/components/operations/DevicePolicyForm'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import * as api from '@/services/api'
import {
  Wrench,
  Users,
  ShieldAlert,
  Server,
  Plus,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react'

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
    Promise.all(requests)
      .then(([reviewList, deviceList, technicianList, contactList]) => {
        if (!current) return
        setReviews(reviewList.items || [])
        if (owner) {
          const items = deviceList.devices || []
          setDevices(items)
          setDeviceId(items[0]?.deviceId ?? '')
          setDirectory(technicianList.items || [])
          setContacts(contactList.items || [])
        }
      })
      .catch((err) => {
        if (current) setError(err.message)
      })
      .finally(() => {
        if (current) setLoading(false)
      })
    return () => {
      current = false
    }
  }, [owner])

  useEffect(() => {
    if (!deviceId) return
    let current = true
    Promise.all([api.fetchPolicy(deviceId), api.fetchAlerts(deviceId)])
      .then(([policy, result]) => {
        if (current) setDetails({ deviceId, policy, alerts: result.items || [] })
      })
      .catch((err) => {
        if (current) setDeviceError(err.message)
      })
    return () => {
      current = false
    }
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
      setContacts((await api.fetchContacts()).items || [])
    }, 'Contacto guardado.')
  }

  function createReview(event) {
    event.preventDefault()
    const form = event.currentTarget
    const values = Object.fromEntries(new FormData(form))
    act(async () => {
      const review = await api.createReview({
        ...values,
        alertId: Number(values.alertId),
        technicianId: Number(values.technicianId),
      })
      setReviews((previous) => [review, ...previous.filter((item) => item.id !== review.id)])
      form.reset()
    }, 'Solicitud de revisión enviada.')
  }

  const savedIds = new Set(contacts.map((contact) => contact.id))
  const availableTechnicians = directory.filter((technician) => !savedIds.has(technician.id))
  const device = details?.deviceId === deviceId ? details : null

  return (
    <main className="bg-cold-dark px-4 sm:px-6 py-6 text-cold-text min-h-screen">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cold-divider/10">
          <div>
            <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
              <Wrench className="w-6 h-6 text-cold-ice" />
              {owner ? 'Operaciones' : 'Solicitudes asignadas'}
            </h1>
            <p className="text-xs text-cold-muted mt-0.5">
              Administración de flota, políticas de captura, contactos y revisiones de servicio
            </p>
          </div>
          <Link
            to="/"
            className="text-xs font-semibold text-cold-ice hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            ← Volver al Dashboard
          </Link>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <p role="alert">{error}</p>
          </div>
        )}
        {notice && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <p role="status">{notice}</p>
          </div>
        )}
        {loading && (
          <div className="py-8 text-center text-xs text-cold-muted flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-cold-ice" />
            <p role="status">Cargando…</p>
          </div>
        )}

        {owner && !loading && (
          <>
            {/* EQUIPOS */}
            <section className="operations-form glass-panel rounded-2xl p-5 space-y-4">
              <h2 className="text-base font-bold font-heading flex items-center gap-2">
                <Server className="w-4 h-4 text-cold-ice" />
                Equipos y Dispositivos
              </h2>
              <form onSubmit={createDevice} className="grid gap-3">
                <fieldset disabled={pending} className="grid gap-3">
                  <label className="grid gap-1 text-xs font-medium">
                    <span>Nombre del nuevo equipo</span>
                    <input
                      name="name"
                      maxLength={100}
                      required
                      placeholder="Ej: Cámara Frigorífica Norte"
                      className="rounded-xl border border-cold-ice/20 bg-cold-dark/70 p-2.5 text-xs text-cold-text focus:border-cold-ice focus:outline-none"
                    />
                  </label>
                  <Button type="submit" disabled={pending}>
                    {pending ? 'Registrando…' : 'Registrar equipo'}
                  </Button>
                </fieldset>
              </form>

              {token && (
                <div className="space-y-2 p-3.5 rounded-xl bg-cold-dark/80 border border-amber-500/30 text-xs">
                  <p className="text-amber-300 font-medium">
                    Token del gateway de {token.name}. Copialo antes de cerrar esta pantalla.
                  </p>
                  <code className="block break-all select-all p-2 rounded-lg bg-cold-shade font-mono text-[11px] text-amber-200">
                    {token.gatewayToken}
                  </code>
                  <Button variant="outline" size="sm" onClick={() => setToken(null)}>
                    Ocultar token
                  </Button>
                </div>
              )}

              {devices.length > 0 && (
                <label className="grid gap-1 text-xs font-medium pt-2">
                  <span>Equipo seleccionado</span>
                  <select
                    value={deviceId}
                    disabled={pending}
                    onChange={(event) => selectDevice(event.target.value)}
                    className="rounded-xl border border-cold-ice/20 bg-cold-dark/70 p-2.5 text-xs text-cold-text focus:border-cold-ice focus:outline-none"
                  >
                    {devices.map((item) => (
                      <option key={item.deviceId} value={item.deviceId}>
                        {item.name || item.deviceId}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {deviceId && (
                <div className="pt-1">
                  <Link
                    className="text-xs text-cold-ice hover:underline inline-flex items-center gap-1 font-medium"
                    to={'/?device=' + encodeURIComponent(deviceId)}
                  >
                    Ver telemetría y simulador →
                  </Link>
                </div>
              )}

              {deviceError && (
                <p role="alert" className="text-xs text-rose-300">
                  {deviceError}
                </p>
              )}
              {deviceId && !device && !deviceError && (
                <p role="status" className="text-xs text-cold-muted">
                  Cargando equipo…
                </p>
              )}

              {device && (
                <div className="pt-3 border-t border-cold-divider/10">
                  <DevicePolicyForm
                    key={deviceId}
                    deviceId={deviceId}
                    policy={device.policy}
                    pending={pending}
                    onSave={(changes) => {
                      act(async () => {
                        const policy = await api.updatePolicy(deviceId, changes)
                        setDetails({ ...device, policy })
                      }, 'Configuración guardada.')
                    }}
                  />
                </div>
              )}
            </section>

            {/* CONTACTOS */}
            <section className="operations-form glass-panel rounded-2xl p-5 space-y-4">
              <h2 className="text-base font-bold font-heading flex items-center gap-2">
                <Users className="w-4 h-4 text-cold-ice" />
                Contactos técnicos
              </h2>
              {contacts.length === 0 ? (
                <p className="text-xs text-cold-muted">Todavía no guardaste contactos.</p>
              ) : (
                <ul className="space-y-2 text-xs">
                  {contacts.map((contact) => (
                    <li
                      key={contact.id}
                      className="p-2.5 rounded-xl bg-cold-dark/50 border border-cold-divider/10 flex items-center gap-2 flex-wrap"
                    >
                      <strong className="text-cold-text">{contact.name}</strong> ·{' '}
                      <a className="text-cold-ice hover:underline" href={'mailto:' + contact.email}>
                        {contact.email}
                      </a>
                      {contact.phone && (
                        <>
                          {' '}
                          ·{' '}
                          <a className="text-cold-ice hover:underline" href={'tel:' + contact.phone}>
                            {contact.phone}
                          </a>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {availableTechnicians.length > 0 && (
                <form onSubmit={saveContact} className="pt-2">
                  <fieldset disabled={pending} className="grid gap-3">
                    <label className="grid gap-1 text-xs font-medium">
                      <span>Técnico registrado</span>
                      <select
                        name="technicianId"
                        required
                        className="rounded-xl border border-cold-ice/20 bg-cold-dark/70 p-2 text-xs text-cold-text"
                      >
                        <option value="">Seleccioná un técnico</option>
                        {availableTechnicians.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Button type="submit" disabled={pending}>
                      Guardar contacto
                    </Button>
                  </fieldset>
                </form>
              )}
            </section>

            {/* ALERTAS Y REVISIÓN */}
            {device && (
              <section className="operations-form glass-panel rounded-2xl p-5 space-y-4">
                <h2 className="text-base font-bold font-heading flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cold-ice" />
                  Alertas y diagnóstico
                </h2>
                {device.alerts.length === 0 ? (
                  <p className="text-xs text-cold-muted">El equipo todavía no tiene alertas.</p>
                ) : (
                  <div className="space-y-2">
                    {device.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="p-2.5 rounded-xl bg-cold-dark/50 border border-cold-divider/10 flex items-center justify-between text-xs"
                      >
                        <p className="font-semibold text-cold-text">
                          {alert.description || alert.type}
                        </p>
                        <Badge variant={alert.active ? 'danger' : 'success'}>
                          {alert.active ? 'Activa' : 'Resuelta'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}

                {device.alerts.length > 0 && contacts.length === 0 && (
                  <p className="text-xs text-amber-300">
                    Guardá un contacto técnico para solicitar una revisión.
                  </p>
                )}

                {device.alerts.length > 0 && contacts.length > 0 && (
                  <form key={deviceId} onSubmit={createReview} className="pt-2 grid gap-3">
                    <fieldset disabled={pending} className="grid gap-3">
                      <label className="grid gap-1 text-xs font-medium">
                        <span>Alerta</span>
                        <select
                          name="alertId"
                          required
                          className="rounded-xl border border-cold-ice/20 bg-cold-dark/70 p-2 text-xs text-cold-text"
                        >
                          <option value="">Seleccioná una alerta</option>
                          {device.alerts.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.description || item.type}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="grid gap-1 text-xs font-medium">
                        <span>Asignar a</span>
                        <select
                          name="technicianId"
                          required
                          className="rounded-xl border border-cold-ice/20 bg-cold-dark/70 p-2 text-xs text-cold-text"
                        >
                          <option value="">Seleccioná un contacto</option>
                          {contacts.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="grid gap-1 text-xs font-medium">
                        <span>Detalle adicional (opcional)</span>
                        <textarea
                          name="notes"
                          maxLength={1500}
                          rows={2}
                          className="rounded-xl border border-cold-ice/20 bg-cold-dark/70 p-2 text-xs text-cold-text resize-none"
                        />
                      </label>

                      <Button type="submit" disabled={pending}>
                        Solicitar revisión
                      </Button>
                    </fieldset>
                  </form>
                )}
              </section>
            )}
          </>
        )}

        {/* HISTORIAL DE SOLICITUDES */}
        {!loading && (
          <section className="glass-panel space-y-4 rounded-2xl p-5">
            <h2 className="text-base font-bold font-heading flex items-center gap-2">
              <Clock className="w-4 h-4 text-cold-ice" />
              Historial de solicitudes
            </h2>
            {reviews.length === 0 ? (
              <p className="text-xs text-cold-muted">Todavía no hay solicitudes.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <article
                    key={review.id}
                    className="p-3.5 rounded-xl bg-cold-dark/50 border border-cold-divider/10 space-y-1.5 text-xs"
                  >
                    <h3 className="font-semibold text-cold-text">
                      {review.deviceId} · {review.description}
                    </h3>
                    {review.notes && <p className="text-cold-muted italic">«{review.notes}»</p>}
                    {owner && (
                      <p className="text-cold-lavender text-[11px]">
                        Técnico:{' '}
                        {contacts.find((contact) => contact.id === review.technicianId)?.name ??
                          review.technicianId}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
