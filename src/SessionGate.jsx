import { useEffect, useLayoutEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import App from './App'
import { Button } from './components/ui/Button'
import { getSession, login, logout } from './services/apiService'

const themePreferenceKey = 'coldtrack-theme'

function readTheme() {
  try {
    return localStorage.getItem(themePreferenceKey) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function SessionGate() {
  const [theme, setTheme] = useState(readTheme)
  const isLight = theme === 'light'

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  function toggleTheme() {
    const nextTheme = isLight ? 'dark' : 'light'
    setTheme(nextTheme)
    try {
      localStorage.setItem(themePreferenceKey, nextTheme)
    } catch {
      // Keep the selected theme for this visit if storage is unavailable.
    }
  }

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

  const themeToggle = (
    <Button type="button" variant="outline" size="sm" aria-pressed={isLight} onClick={toggleTheme}>
      {isLight ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
      Tema claro
    </Button>
  )

  if (session?.authenticated) {
    return <>
      <div className="flex flex-wrap items-center justify-end gap-3 bg-cold-dark px-5 pt-3">
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        {themeToggle}
        {session.required && <Button variant="outline" size="sm" disabled={pending} onClick={endSession}>Cerrar sesión</Button>}
      </div>
      <App />
    </>
  }

  return (
    <main className="grid min-h-screen place-items-center bg-cold-dark p-5 text-cold-text">
      <section className="glass-panel w-full max-w-sm rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold">ColdTrack</h1>
          {themeToggle}
        </div>
        <p className="mt-2 text-sm text-zinc-400">Monitoreo de equipos de frío</p>
        {session && (
          <form className="mt-5 grid gap-4" onSubmit={submit}>
            <label className="grid gap-1 text-sm">
              Usuario
              <input name="username" autoComplete="username" required className="rounded-lg border border-cold-divider/20 bg-zinc-950 p-2" />
            </label>
            <label className="grid gap-1 text-sm">
              Contraseña
              <input name="password" type="password" autoComplete="current-password" required className="rounded-lg border border-cold-divider/20 bg-zinc-950 p-2" />
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
