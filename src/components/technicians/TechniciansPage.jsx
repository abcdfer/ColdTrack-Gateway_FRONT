import { useState, useEffect } from 'react'
import {
  fetchTechnicians,
  fetchContacts,
  saveContact,
  removeContact,
} from '@/services/api'
import { CreateMaintenanceModal } from '../maintenance/CreateMaintenanceModal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import {
  Users,
  BookmarkCheck,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  Wrench,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'

export function TechniciansPage() {
  const [tab, setTab] = useState('contacts') // 'contacts' | 'directory'
  const [contacts, setContacts] = useState([])
  const [directory, setDirectory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pendingId, setPendingId] = useState(null)
  const [createForTech, setCreateForTech] = useState(null)

  function loadData() {
    setLoading(true)
    setError('')
    Promise.all([fetchContacts(), fetchTechnicians()])
      .then(([contData, dirData]) => {
        setContacts(contData.items || [])
        setDirectory(dirData.items || [])
      })
      .catch((err) => {
        setError(err.message || 'Error al obtener técnicos')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSaveContact(id) {
    setPendingId(id)
    setError('')
    try {
      await saveContact(id)
      setNotice('Técnico guardado en tus contactos.')
      loadData()
      setTimeout(() => setNotice(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al guardar contacto')
    } finally {
      setPendingId(null)
    }
  }

  async function handleRemoveContact(id) {
    if (!window.confirm('¿Deseás remover a este técnico de tus contactos frecuentes?')) return
    setPendingId(id)
    setError('')
    try {
      await removeContact(id)
      setNotice('Técnico removido de contactos.')
      loadData()
      setTimeout(() => setNotice(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al quitar contacto')
    } finally {
      setPendingId(null)
    }
  }

  const savedIds = new Set(contacts.map((c) => c.id))

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cold-divider/10">
        <div>
          <h2 className="font-heading font-bold text-xl text-cold-text flex items-center gap-2">
            <Users className="w-5 h-5 text-cold-ice" />
            Red de Técnicos de Frío Industrial
          </h2>
          <p className="text-xs text-cold-muted mt-0.5">
            Directorio de técnicos matriculados y agenda de contactos de confianza para emergencias
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={loadData}>
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </Button>
      </div>

      {notice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setTab('contacts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            tab === 'contacts'
              ? 'bg-cold-ice text-cold-on-accent shadow-[0_0_12px_rgba(190,207,255,0.25)]'
              : 'bg-cold-shade/40 text-cold-muted hover:text-cold-text border border-cold-divider/10'
          }`}
        >
          <BookmarkCheck className="w-4 h-4" />
          <span>Mis Contactos Guardados</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
            {contacts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setTab('directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            tab === 'directory'
              ? 'bg-cold-ice text-cold-on-accent shadow-[0_0_12px_rgba(190,207,255,0.25)]'
              : 'bg-cold-shade/40 text-cold-muted hover:text-cold-text border border-cold-divider/10'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Directorio General</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/20">
            {directory.length}
          </span>
        </button>
      </div>

      {loading && contacts.length === 0 && directory.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-cold-muted">
          <RefreshCw className="w-6 h-6 animate-spin text-cold-ice" />
          <span className="text-xs">Consultando directorio técnico…</span>
        </div>
      ) : tab === 'contacts' ? (
        contacts.length === 0 ? (
          <Card className="py-12 text-center">
            <BookmarkCheck className="w-8 h-8 text-cold-lavender mx-auto mb-2 opacity-50" />
            <h3 className="font-heading font-semibold text-sm text-cold-text">
              Todavía no guardaste contactos
            </h3>
            <p className="text-xs text-cold-muted mt-1 max-w-sm mx-auto">
              Explorá el directorio de técnicos matriculados y agregá a tus profesionales de preferencia.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setTab('directory')}
            >
              Ver Directorio General
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((tech) => (
              <Card key={tech.id} className="p-4 space-y-3 relative">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-heading font-bold text-sm text-cold-text">{tech.name}</h4>
                    </div>
                    <span className="text-[10px] text-cold-lavender">
                      Técnico Matriculado #{tech.id}
                    </span>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    Guardado
                  </Badge>
                </div>

                <div className="space-y-1 text-xs">
                  <a
                    href={`mailto:${tech.email}`}
                    className="flex items-center gap-2 text-cold-muted hover:text-cold-ice transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{tech.email}</span>
                  </a>
                  {tech.phone ? (
                    <a
                      href={`tel:${tech.phone}`}
                      className="flex items-center gap-2 text-cold-muted hover:text-cold-ice transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span>{tech.phone}</span>
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 text-zinc-500 text-[11px]">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      Sin teléfono registrado
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-cold-divider/10 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs py-1"
                    onClick={() => setCreateForTech(tech)}
                  >
                    <Wrench className="w-3.5 h-3.5 text-cold-ice" />
                    Asignar Orden
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-400 hover:text-rose-300 py-1"
                    disabled={pendingId === tech.id}
                    onClick={() => handleRemoveContact(tech.id)}
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    Quitar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )
      ) : (
        /* DIRECTORY TAB */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {directory.length === 0 ? (
            <div className="col-span-full text-center py-12 text-cold-muted text-xs">
              No hay técnicos registrados en la base de datos central.
            </div>
          ) : (
            directory.map((tech) => {
              const isSaved = savedIds.has(tech.id)
              return (
                <Card key={tech.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-heading font-bold text-sm text-cold-text">{tech.name}</h4>
                      <span className="text-[10px] text-cold-lavender">
                        ID Profesional #{tech.id}
                      </span>
                    </div>
                    {isSaved && (
                      <Badge variant="success" className="text-[10px]">
                        En Contactos
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1 text-xs">
                    <a
                      href={`mailto:${tech.email}`}
                      className="flex items-center gap-2 text-cold-muted hover:text-cold-ice transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{tech.email}</span>
                    </a>
                    {tech.phone ? (
                      <a
                        href={`tel:${tech.phone}`}
                        className="flex items-center gap-2 text-cold-muted hover:text-cold-ice transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <span>{tech.phone}</span>
                      </a>
                    ) : (
                      <span className="flex items-center gap-2 text-zinc-500 text-[11px]">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        Sin teléfono registrado
                      </span>
                    )}
                  </div>

                  <div className="pt-2 border-t border-cold-divider/10 flex items-center justify-between gap-2">
                    {isSaved ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs py-1"
                        onClick={() => setCreateForTech(tech)}
                      >
                        <Wrench className="w-3.5 h-3.5 text-cold-ice" />
                        Asignar Orden
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={pendingId === tech.id}
                        onClick={() => handleSaveContact(tech.id)}
                        className="w-full"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Guardar en Contactos
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })
          )}
        </div>
      )}

      {createForTech && (
        <CreateMaintenanceModal
          isOpen={Boolean(createForTech)}
          onClose={() => setCreateForTech(null)}
          onCreated={() => {
            setNotice('Orden creada exitosamente.')
            setTimeout(() => setNotice(''), 3000)
          }}
        />
      )}
    </div>
  )
}
