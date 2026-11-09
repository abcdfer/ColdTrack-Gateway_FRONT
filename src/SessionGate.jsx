import { useEffect, useState } from 'react'
import App from './App'
import { Button } from './components/ui/Button'
import { getSession, login, logout } from './services/apiService'

export function SessionGate() {
  const [session, setSession] = useState(null)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    getSession(controller.signal).then(setSession).catch((err) => {
      if (err.name !== 'AbortError') setError('No se pudo conectar con ColdTrack.')
    })
    const expire = () => setSession({ required: true, authenticated: false })
    window.addEventListener('coldtrack-session-expired', expire)
    return () => {
      controller.abort()
      window.removeEventListener('coldtrack-session-expired', expire)
    }
  }, [])

  async function submit(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    setPending(true)
    setError('')
    try {
      setSession(await login(fields.get('username'), fields.get('password')))
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  async function endSession() {
    setPending(true)
    setError('')
    try {
      setSession(await logout())
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(false)
    }
  }

  if (session?.authenticated) {
    return <>
      {session.required && <div className="flex items-center justify-end gap-3 bg-black px-5 pt-3">
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        <Button variant="outline" size="sm" disabled={pending} onClick={endSession}>Cerrar sesión</Button>
      </div>}
      <App />
    </>
  }

  return (
    <main className="grid min-h-screen place-items-center bg-black p-5 text-white">
      <section className="glass-panel w-full max-w-sm rounded-2xl p-6">
        <h1 className="font-heading text-2xl font-bold">ColdTrack</h1>
        <p className="mt-2 text-sm text-zinc-400">Monitoreo de equipos de frío</p>
        {session && (
          <form className="mt-5 grid gap-4" onSubmit={submit}>
            <label className="grid gap-1 text-sm">
              Usuario
              <input name="username" autoComplete="username" required className="rounded-lg border border-white/20 bg-zinc-950 p-2" />
            </label>
            <label className="grid gap-1 text-sm">
              Contraseña
              <input name="password" type="password" autoComplete="current-password" required className="rounded-lg border border-white/20 bg-zinc-950 p-2" />
            </label>
            <Button type="submit" disabled={pending}>{pending ? 'Ingresando…' : 'Ingresar'}</Button>
          </form>
        )}
        {!session && !error && <p role="status" className="mt-4 text-sm">Conectando…</p>}
        {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
      </section>
    </main>
  )
}
