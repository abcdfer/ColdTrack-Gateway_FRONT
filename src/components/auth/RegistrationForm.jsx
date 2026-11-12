import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { registerAccount, verifyAccount } from '@/services/api'

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
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <form key={registration ? 'verify' : 'register'} className="operations-form mt-4" onSubmit={submit}>
      <fieldset disabled={pending}>
        {registration ? (
          <label>Código enviado a {registration.email}
            <input name="code" autoComplete="one-time-code" inputMode="numeric" pattern="[0-9]{6}" required />
          </label>
        ) : (
          <>
            <label>Nombre<input name="name" autoComplete="name" required /></label>
            <label>Correo<input name="email" type="email" autoComplete="email" required /></label>
            <label>Contraseña<input name="password" type="password" autoComplete="new-password" minLength={12} required /></label>
            <label>Tipo de cuenta<select name="role"><option value="owner">Propietario</option><option value="technician">Técnico</option></select></label>
            <label>Teléfono (opcional)<input name="phone" type="tel" autoComplete="tel" /></label>
          </>
        )}
        {error && <p role="alert">{error}</p>}
        <Button type="submit">{registration ? 'Verificar correo' : 'Crear cuenta'}</Button>
      </fieldset>
    </form>
  )
}
