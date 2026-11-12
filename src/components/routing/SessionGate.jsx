import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Button } from '@/components/ui/Button'
import { LoginPage } from '@/pages/LoginPage'
import { getSession, login, logout } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'

export function SessionGate({ children }) {
  const session = useAuthStore((state) => state.session)
  const setSession = useAuthStore((state) => state.setSession)
  const [params] = useSearchParams()
  const operations = params.get('section') === 'operations'
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    getSession(controller.signal).then((result) => {
      if (!controller.signal.aborted) setSession(result)
    }).catch((err) => {
      if (err.name !== 'AbortError' && !controller.signal.aborted) setError('No se pudo conectar con ColdTrack.')
    })
    const expire = () => setSession({ required: true, authenticated: false })
    window.addEventListener('coldtrack-session-expired', expire)
    return () => {
      controller.abort()
      window.removeEventListener('coldtrack-session-expired', expire)
    }
  }, [setSession])

  async function submit({ username, password }) {
    setPending(true)
    setError('')
    try {
      setSession(await login(username, password))
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

  if (!session?.authenticated) {
    return <LoginPage canLogin={Boolean(session)} onLogin={submit} pending={pending} error={error} />
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-3 bg-cold-dark px-5 pt-3">
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
        {session.account?.role === 'owner' && (
          <Link className="rounded-md px-3 py-2 text-sm font-semibold text-cold-text underline"
            to={operations ? '/' : '/?section=operations'}>
            {operations ? 'Dashboard' : 'Operaciones'}
          </Link>
        )}
        <ThemeToggle />
        {session.required && <Button variant="outline" size="sm" disabled={pending} onClick={endSession}>Cerrar sesión</Button>}
      </div>
      {children}
    </>
  )
}
