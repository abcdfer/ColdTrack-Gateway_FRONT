import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { registerAccount, verifyAccount } from '@/services/api'
import { CheckCircle2, AlertCircle, ShieldCheck, Mail, Lock, User, Phone } from 'lucide-react'

export default function RegistrationForm({ onComplete }) {
  const [registration, setRegistration] = useState(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event) {
    event.preventDefault()
    const values = Object.fromEntries(new FormData(event.currentTarget))
    setError('')
    setPending(true)
    try {
      if (registration) {
        await verifyAccount({ ...registration, code: values.code })
        onComplete()
      } else {
        const { registrationId } = await registerAccount(values)
        setRegistration({ email: values.email, registrationId })
      }
    } catch (err) {
      setError(err.message || 'Error al procesar el registro')
    } finally {
      setPending(false)
    }
  }

  const inputClass =
    'w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text transition-all'

  return (
    <form key={registration ? 'verify' : 'register'} className="mt-4 grid gap-3.5" onSubmit={submit}>
      <fieldset disabled={pending} className="grid gap-3.5">
        {registration ? (
          <div>
            <div className="mb-3 flex items-center gap-2 p-3 rounded-xl bg-cold-ice/10 border border-cold-ice/25 text-cold-ice text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Código de verificación enviado a <strong>{registration.email}</strong></span>
            </div>
            <label className="grid gap-1 text-xs font-medium text-cold-text">
              <span>Código de 6 dígitos</span>
              <input
                name="code"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]{6}"
                placeholder="000000"
                required
                className="w-full px-3 py-2 text-sm font-mono tracking-widest text-center rounded-xl bg-cold-dark/70 border border-cold-ice/30 focus:border-cold-ice focus:outline-none text-cold-text"
              />
            </label>
          </div>
        ) : (
          <>
            <label className="grid gap-1 text-xs font-medium text-cold-text">
              <span>Nombre completo</span>
              <div className="relative">
                <input name="name" autoComplete="name" required placeholder="Juan Pérez" className={inputClass} />
                <User className="w-4 h-4 text-cold-muted absolute left-2.5 top-2.5" />
              </div>
            </label>

            <label className="grid gap-1 text-xs font-medium text-cold-text">
              <span>Correo electrónico</span>
              <div className="relative">
                <input name="email" type="email" autoComplete="email" required placeholder="correo@ejemplo.com" className={inputClass} />
                <Mail className="w-4 h-4 text-cold-muted absolute left-2.5 top-2.5" />
              </div>
            </label>

            <label className="grid gap-1 text-xs font-medium text-cold-text">
              <span>Contraseña</span>
              <div className="relative">
                <input name="password" type="password" autoComplete="new-password" minLength={12} required placeholder="Mínimo 12 caracteres" className={inputClass} />
                <Lock className="w-4 h-4 text-cold-muted absolute left-2.5 top-2.5" />
              </div>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <label className="grid gap-1 text-xs font-medium text-cold-text">
                <span>Tipo de cuenta</span>
                <select name="role" className="w-full px-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text">
                  <option value="owner">Propietario</option>
                  <option value="technician">Técnico</option>
                </select>
              </label>

              <label className="grid gap-1 text-xs font-medium text-cold-text">
                <span>Teléfono (opc.)</span>
                <div className="relative">
                  <input name="phone" type="tel" autoComplete="tel" placeholder="+54 11 ..." className={inputClass} />
                  <Phone className="w-4 h-4 text-cold-muted absolute left-2.5 top-2.5" />
                </div>
              </label>
            </div>
          </>
        )}

        {error && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p role="alert">{error}</p>
          </div>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? 'Procesando…' : registration ? 'Verificar correo' : 'Crear cuenta'}
        </Button>
      </fieldset>
    </form>
  )
}
