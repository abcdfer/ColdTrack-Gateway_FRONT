import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { requestPasswordReset, confirmPasswordReset } from '@/services/api'
import { KeyRound, Mail, CheckCircle2, AlertCircle } from 'lucide-react'

export default function ForgotPasswordForm({ onComplete }) {
  const [step, setStep] = useState('request') // 'request' | 'confirm'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, setPending] = useState(false)

  async function handleRequest(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setPending(true)
    try {
      await requestPasswordReset({ email })
      setNotice(`Enviamos un código de recuperación a ${email}.`)
      setStep('confirm')
    } catch (err) {
      setError(err.message || 'No se pudo enviar el código de recuperación.')
    } finally {
      setPending(false)
    }
  }

  async function handleConfirm(e) {
    e.preventDefault()
    setError('')
    setNotice('')
    setPending(true)
    try {
      await confirmPasswordReset({ email, code, newPassword })
      setNotice('Contraseña restablecida correctamente. Ya podés ingresar.')
      setTimeout(() => {
        onComplete()
      }, 1500)
    } catch (err) {
      setError(err.message || 'Código incorrecto o vencido.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mt-4">
      {notice && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === 'request' ? (
        <form onSubmit={handleRequest} className="space-y-4">
          <p className="text-xs text-cold-muted">
            Ingresá tu correo electrónico para recibir un código de recuperación.
          </p>
          <label className="grid gap-1.5 text-xs font-medium text-cold-text">
            <span>Correo electrónico</span>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@coldtrack.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text transition-all"
              />
              <Mail className="w-4 h-4 text-cold-muted absolute left-2.5 top-2.5" />
            </div>
          </label>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Enviando código…' : 'Enviar código de recuperación'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleConfirm} className="space-y-4">
          <label className="grid gap-1.5 text-xs font-medium text-cold-text">
            <span>Código de 6 dígitos</span>
            <input
              type="text"
              required
              inputMode="numeric"
              pattern="[0-9]{6}"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full px-3 py-2 text-xs font-mono tracking-widest text-center rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
            />
          </label>

          <label className="grid gap-1.5 text-xs font-medium text-cold-text">
            <span>Nueva contraseña</span>
            <div className="relative">
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text transition-all"
              />
              <KeyRound className="w-4 h-4 text-cold-muted absolute left-2.5 top-2.5" />
            </div>
          </label>

          <Button type="submit" disabled={pending} className="w-full">
            {pending ? 'Restableciendo…' : 'Restablecer contraseña'}
          </Button>
        </form>
      )}
    </div>
  )
}
