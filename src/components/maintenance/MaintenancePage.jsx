import { useState, useEffect } from 'react'
import {
  fetchMaintenanceRequests,
  fetchMaintenanceDetail,
  updateMaintenanceStatus,
  fetchContacts,
} from '@/services/api'
import { CreateMaintenanceModal } from './CreateMaintenanceModal'
import { RateMaintenanceModal } from './RateMaintenanceModal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import {
  Wrench,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  PlayCircle,
  Star,
  ChevronDown,
  ChevronUp,
  History,
  User,
} from 'lucide-react'

const STATUS_MAP = {
  requested: { label: 'Solicitada', variant: 'default', color: 'text-cold-ice' },
  accepted: { label: 'Aceptada', variant: 'secondary', color: 'text-cyan-400' },
  in_progress: { label: 'En Progreso', variant: 'warning', color: 'text-amber-400' },
  resolved: { label: 'Resuelta', variant: 'success', color: 'text-emerald-400' },
  closed: { label: 'Cerrada', variant: 'default', color: 'text-zinc-400' },
  cancelled: { label: 'Cancelada', variant: 'danger', color: 'text-rose-400' },
}

const STEPS = ['requested', 'accepted', 'in_progress', 'resolved', 'closed']

export function MaintenancePage({ account }) {
  const isOwner = account?.role === 'owner'
  const isTechnician = account?.role === 'technician'

  const [requests, setRequests] = useState([])
  const [contacts, setContacts] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [rateTarget, setRateTarget] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [detailsMap, setDetailsMap] = useState({})
  const [actionPending, setActionPending] = useState(null)

  function loadRequests() {
    setLoading(true)
    setError('')
    Promise.all([fetchMaintenanceRequests(), isOwner ? fetchContacts() : Promise.resolve({ items: [] })])
      .then(([reqData, contData]) => {
        setRequests(reqData.items || [])
        setContacts(contData.items || [])
      })
      .catch((err) => {
        setError(err.message || 'Error al obtener solicitudes')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadRequests()
  }, [isOwner])

  async function toggleExpand(id) {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (!detailsMap[id]) {
      try {
        const detail = await fetchMaintenanceDetail(id)
        setDetailsMap((prev) => ({ ...prev, [id]: detail }))
      } catch (err) {
        console.error(err)
      }
    }
  }

  async function handleStatusChange(requestId, newStatus, notesPrompt) {
    const note = notesPrompt ? window.prompt(notesPrompt) : ''
    if (notesPrompt && note === null) return // cancelled prompt
    setActionPending(requestId)
    setError('')
    try {
      const updated = await updateMaintenanceStatus(requestId, {
        status: newStatus,
        notes: note || undefined,
      })
      setRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r)))
      setDetailsMap((prev) => ({ ...prev, [requestId]: updated }))
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el estado de la solicitud')
    } finally {
      setActionPending(null)
    }
  }

  const filteredRequests =
    filterStatus === 'all'
      ? requests
      : requests.filter((r) => r.status === filterStatus)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cold-divider/10">
        <div>
          <h2 className="font-heading font-bold text-xl text-cold-text flex items-center gap-2">
            <Wrench className="w-5 h-5 text-cold-ice" />
            {isTechnician ? 'Órdenes de Trabajo Asignadas' : 'Gestión de Mantenimiento y Solicitudes'}
          </h2>
          <p className="text-xs text-cold-muted mt-0.5">
            {isTechnician
              ? 'Seguimiento técnico, cambio de estado y resolución de incidentes en equipos'
              : 'Coordinación con técnicos certificados, trazabilidad de incidentes y calificación de servicio'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadRequests}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </Button>

          {isOwner && (
            <Button variant="primary" size="sm" onClick={() => setIsCreateOpen(true)}>
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Solicitud</span>
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs custom-scrollbar">
        {[
          { id: 'all', label: 'Todas' },
          { id: 'requested', label: 'Solicitadas' },
          { id: 'accepted', label: 'Aceptadas' },
          { id: 'in_progress', label: 'En Progreso' },
          { id: 'resolved', label: 'Resueltas' },
          { id: 'closed', label: 'Cerradas' },
          { id: 'cancelled', label: 'Canceladas' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-cold-ice text-cold-on-accent font-semibold shadow-[0_0_12px_rgba(190,207,255,0.25)]'
                : 'bg-cold-shade/40 text-cold-muted hover:text-cold-text border border-cold-divider/10'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 opacity-70 text-[10px]">
              {tab.id === 'all'
                ? requests.length
                : requests.filter((r) => r.status === tab.id).length}
            </span>
          </button>
        ))}
      </div>

      {loading && requests.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-cold-muted">
          <RefreshCw className="w-6 h-6 animate-spin text-cold-ice" />
          <span className="text-xs">Cargando solicitudes de servicio…</span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="py-12 text-center">
          <Wrench className="w-8 h-8 text-cold-lavender mx-auto mb-2 opacity-50" />
          <h3 className="font-heading font-semibold text-sm text-cold-text">
            No hay solicitudes {filterStatus !== 'all' ? `en estado "${filterStatus}"` : ''}
          </h3>
          <p className="text-xs text-cold-muted mt-1 max-w-sm mx-auto">
            {isOwner
              ? 'Podés emitir una solicitud manual o vincularla desde cualquier alerta activa en tus equipos.'
              : 'No tenés órdenes de trabajo pendientes en esta sección.'}
          </p>
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Crear primera solicitud
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => {
            const statusInfo = STATUS_MAP[req.status] || STATUS_MAP.requested
            const isExpanded = expandedId === req.id
            const detail = detailsMap[req.id]
            const isPendingThis = actionPending === req.id
            const technicianName =
              contacts.find((c) => c.id === req.technicianId)?.name ||
              `Técnico #${req.technicianId}`

            return (
              <Card key={req.id} className="p-4 sm:p-5 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-cold-ice">
                        ORD #{req.id}
                      </span>
                      <span className="text-xs text-cold-muted">·</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-cold-dark/70 border border-cold-ice/15 text-cold-text">
                        {req.deviceId}
                      </span>
                      <Badge variant={statusInfo.variant} className="text-[10px]">
                        {statusInfo.label}
                      </Badge>
                      {req.alertId && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300">
                          Vinculada a Alerta #{req.alertId}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-semibold text-sm text-cold-text">
                      {req.description}
                    </h3>
                    {req.notes && (
                      <p className="text-xs text-cold-muted italic">«{req.notes}»</p>
                    )}
                  </div>

                  {/* Top-right info */}
                  <div className="text-right text-xs shrink-0 space-y-1">
                    <div className="flex items-center gap-1.5 sm:justify-end text-cold-muted text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:justify-end text-cold-ice text-[11px]">
                      <User className="w-3.5 h-3.5" />
                      <span>{technicianName}</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar for lifecycle */}
                {req.status !== 'cancelled' && (
                  <div className="mt-4 pt-3 border-t border-cold-divider/10">
                    <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                      {STEPS.map((step, idx) => {
                        const currentIdx = STEPS.indexOf(req.status)
                        const isDone = currentIdx >= idx
                        const isCurrent = currentIdx === idx
                        return (
                          <div key={step} className="space-y-1">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                isDone
                                  ? 'bg-cold-ice shadow-[0_0_8px_rgba(190,207,255,0.4)]'
                                  : 'bg-cold-shade border border-cold-divider/10'
                              }`}
                            />
                            <span
                              className={`${
                                isCurrent
                                  ? 'text-cold-ice font-semibold'
                                  : isDone
                                  ? 'text-cold-text'
                                  : 'text-cold-muted'
                              }`}
                            >
                              {STATUS_MAP[step]?.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Actions row */}
                <div className="mt-4 pt-3 border-t border-cold-divider/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(req.id)}
                      className="text-xs text-cold-lavender hover:text-cold-ice flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Ocultar historial' : 'Ver trazabilidad'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* OWNER ACTIONS */}
                    {isOwner && req.status === 'requested' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isPendingThis}
                        onClick={() =>
                          handleStatusChange(
                            req.id,
                            'cancelled',
                            '¿Motivo de cancelación de la orden?'
                          )
                        }
                      >
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                        Cancelar Solicitud
                      </Button>
                    )}

                    {isOwner && req.status === 'resolved' && (
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={isPendingThis}
                        onClick={() =>
                          handleStatusChange(
                            req.id,
                            'closed',
                            'Notas finales de conformidad de cierre:'
                          )
                        }
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirmar Cierre de Trabajo
                      </Button>
                    )}

                    {isOwner && req.status === 'closed' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setRateTarget(req)}
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        {detail?.rating ? 'Modificar Calificación' : 'Calificar al Técnico'}
                      </Button>
                    )}

                    {/* TECHNICIAN ACTIONS */}
                    {isTechnician && req.status === 'requested' && (
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={isPendingThis}
                        onClick={() =>
                          handleStatusChange(
                            req.id,
                            'accepted',
                            'Notas de aceptación de trabajo:'
                          )
                        }
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Aceptar Orden
                      </Button>
                    )}

                    {isTechnician && req.status === 'accepted' && (
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={isPendingThis}
                        onClick={() =>
                          handleStatusChange(
                            req.id,
                            'in_progress',
                            'Observaciones al iniciar servicio en planta:'
                          )
                        }
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        Comenzar Trabajo
                      </Button>
                    )}

                    {isTechnician && req.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={isPendingThis}
                        onClick={() =>
                          handleStatusChange(
                            req.id,
                            'resolved',
                            'Detalle del trabajo técnico realizado y repuestos colocados:'
                          )
                        }
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Marcar como Resuelto
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expanded Details / Timeline */}
                {isExpanded && (
                  <div className="mt-4 p-4 rounded-xl bg-cold-dark/60 border border-cold-ice/15 space-y-4">
                    <h4 className="font-heading font-semibold text-xs text-cold-text flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-cold-ice" />
                      Historial de Transiciones y Trazabilidad
                    </h4>

                    {detail?.rating && (
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= detail.rating.score
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-zinc-600'
                                }`}
                              />
                            ))}
                          </div>
                          <span>Calificación del Propietario ({detail.rating.score}/5)</span>
                        </div>
                        <p className="text-xs text-cold-text italic">
                          "{detail.rating.comment}"
                        </p>
                      </div>
                    )}

                    <div className="space-y-2 border-l border-cold-ice/20 pl-3 ml-2">
                      {(detail?.history || []).map((h, hIdx) => (
                        <div key={hIdx} className="space-y-0.5 relative text-xs">
                          <div className="w-2 h-2 rounded-full bg-cold-ice absolute -left-[17px] top-1.5 ring-4 ring-cold-dark" />
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-cold-text">
                              {STATUS_MAP[h.status]?.label || h.status}
                            </span>
                            <span className="text-[10px] text-cold-lavender">
                              por {h.actorRole === 'owner' ? 'Propietario' : 'Técnico'} (#{h.actorId})
                            </span>
                            <span className="text-[10px] text-cold-muted">
                              {new Date(h.createdAt).toLocaleString()}
                            </span>
                          </div>
                          {h.notes && <p className="text-cold-muted text-[11px]">«{h.notes}»</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <CreateMaintenanceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => loadRequests()}
      />

      <RateMaintenanceModal
        isOpen={Boolean(rateTarget)}
        onClose={() => setRateTarget(null)}
        request={rateTarget}
        onRated={() => loadRequests()}
      />
    </div>
  )
}
