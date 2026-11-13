import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { fetchProfile, updateProfile } from '@/services/api'
import { User, Mail, Phone, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

export function UserProfileModal({ isOpen, onClose, onProfileUpdated }) {
  const [profile, setProfile] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    if (!isOpen) return
    let active = true
    setLoading(true)
    setError('')
    setNotice('')
    fetchProfile()
      .then((data) => {
        if (!active) return
        setProfile(data)
        setName(data.name || '')
        setPhone(data.phone || '')
      })
      .catch((err) => {
        if (active) setError(err.message || 'Error al cargar perfil')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [isOpen])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setNotice('')
    try {
      const updated = await updateProfile({
        name: name.trim(),
        phone: phone.trim() || undefined,
      })
      setProfile(updated)
      setNotice('Perfil actualizado exitosamente.')
      if (onProfileUpdated) onProfileUpdated(updated)
      setTimeout(() => setNotice(''), 3000)
    } catch (err) {
      setError(err.message || 'Error al actualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Perfil de Cuenta y Contacto">
      <div className="space-y-4 text-xs">
        {loading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-cold-muted">
            <RefreshCw className="w-4 h-4 animate-spin text-cold-ice" />
            <span>Consultando datos del usuario…</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {notice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{notice}</span>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-3.5 rounded-2xl bg-cold-dark/70 border border-cold-ice/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-cold-lavender uppercase font-semibold">
                  Cuenta ID #{profile?.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cold-ice/15 text-cold-ice border border-cold-ice/30 uppercase">
                  {profile?.role === 'owner' ? 'Propietario de Equipos' : 'Técnico de Frío'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-cold-muted text-xs">
                <Mail className="w-3.5 h-3.5 text-cold-ice" />
                <span>{profile?.email}</span>
              </div>
            </div>

            <label className="grid gap-1 font-medium text-cold-text">
              <span>Nombre y Apellido</span>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
                />
                <User className="w-4 h-4 text-cold-muted absolute left-2.5 top-2.5" />
              </div>
            </label>

            <label className="grid gap-1 font-medium text-cold-text">
              <span>Teléfono de Contacto</span>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={40}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+54 9 11 1234-5678"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
                />
                <Phone className="w-4 h-4 text-cold-muted absolute left-2.5 top-2.5" />
              </div>
            </label>

            <div className="flex justify-end gap-2 pt-2 border-t border-cold-divider/10">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cerrar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Guardando…' : 'Actualizar Perfil'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
