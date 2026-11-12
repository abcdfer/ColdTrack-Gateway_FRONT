import { lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ThemeToggle } from '@/components/common/ThemeToggle'

const LoginForm = lazy(() => import('@/components/auth/LoginForm'))

export function LoginPage({ canLogin, onLogin, pending, error }) {
  const reduceMotion = useReducedMotion()

  return (
    <main className="grid min-h-screen place-items-center bg-cold-dark p-5 text-cold-text">
      <motion.section initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }} className="glass-panel w-full max-w-sm rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-bold">ColdTrack</h1>
          <ThemeToggle />
        </div>
        <p className="mt-2 text-sm text-zinc-400">Monitoreo de equipos de frío</p>
        {canLogin && (
          <Suspense fallback={<p role="status" className="mt-4 text-sm">Cargando formulario…</p>}>
            <LoginForm onLogin={onLogin} pending={pending} />
          </Suspense>
        )}
        {!canLogin && !error && <p role="status" className="mt-4 text-sm">Conectando…</p>}
        {error && <p role="alert" className="mt-4 text-sm text-rose-300">{error}</p>}
      </motion.section>
    </main>
  )
}
