import { lazy, Suspense, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react'

const RegistrationForm = lazy(() => import('@/components/auth/RegistrationForm'))
const LoginForm = lazy(() => import('@/components/auth/LoginForm'))
const ForgotPasswordForm = lazy(() => import('@/components/auth/ForgotPasswordForm'))

export function LoginPage({ canLogin, onLogin, pending, error }) {
  const [activeView, setActiveView] = useState('login') // 'login' | 'register' | 'forgot'
  const [verified, setVerified] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <main className="grid min-h-screen place-items-center bg-cold-dark p-4 sm:p-6 text-cold-text relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cold-ice/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-cold-lavender/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22 }}
        className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border-cold-ice/20 relative z-10"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-cold-dark border border-cold-ice/30 flex items-center justify-center p-2 shadow-[0_0_20px_rgba(190,207,255,0.2)]">
              <img
                src="/logos/1.png"
                alt="ColdTrack"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl tracking-tight text-cold-text flex items-center gap-1.5">
                Cold<span className="text-cold-ice">Track</span>
              </h1>
              <p className="text-[11px] text-cold-lavender font-medium">
                Monitoreo de equipos de frío & telemetría
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-6 grid grid-cols-2 rounded-xl bg-cold-dark/60 p-1 border border-cold-ice/15">
          <button
            type="button"
            onClick={() => {
              setActiveView('login')
              setVerified(false)
            }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeView === 'login'
                ? 'bg-cold-ice text-cold-on-accent shadow-md'
                : 'text-cold-muted hover:text-cold-text'
            }`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveView('register')
              setVerified(false)
            }}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeView === 'register'
                ? 'bg-cold-ice text-cold-on-accent shadow-md'
                : 'text-cold-muted hover:text-cold-text'
            }`}
          >
            Crear cuenta
          </button>
        </div>

        {verified && (
          <div className="mt-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <p role="status">Correo verificado. Ya podés iniciar sesión.</p>
          </div>
        )}

        {canLogin && (
          <Suspense fallback={<p role="status" className="mt-6 text-xs text-center text-cold-muted">Cargando formulario…</p>}>
            {activeView === 'login' && (
              <>
                <LoginForm onLogin={onLogin} pending={pending} />
                <div className="mt-4 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveView('forgot')}
                    className="text-cold-muted hover:text-cold-ice hover:underline transition-colors cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('register')}
                    className="text-cold-ice font-medium hover:underline cursor-pointer"
                  >
                    Crear una cuenta
                  </button>
                </div>
              </>
            )}

            {activeView === 'register' && (
              <>
                <RegistrationForm
                  onComplete={() => {
                    setVerified(true)
                    setActiveView('login')
                  }}
                />
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveView('login')}
                    className="text-xs text-cold-muted hover:text-cold-ice underline cursor-pointer"
                  >
                    Volver a iniciar sesión
                  </button>
                </div>
              </>
            )}

            {activeView === 'forgot' && (
              <>
                <ForgotPasswordForm onComplete={() => setActiveView('login')} />
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveView('login')}
                    className="text-xs text-cold-muted hover:text-cold-ice underline cursor-pointer"
                  >
                    Volver a iniciar sesión
                  </button>
                </div>
              </>
            )}
          </Suspense>
        )}

        {!canLogin && !error && (
          <div className="mt-6 text-center space-y-2">
            <div className="w-6 h-6 border-2 border-cold-ice/40 border-t-cold-ice rounded-full animate-spin mx-auto" />
            <p role="status" className="text-xs text-cold-muted">Conectando con ColdTrack Gateway…</p>
          </div>
        )}

        {error && activeView === 'login' && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            <p role="alert">{error}</p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-cold-divider/10 text-center">
          <p className="text-[10px] text-cold-muted flex items-center justify-center gap-1">
            <Shield className="w-3 h-3 text-cold-ice" />
            Conexión segura protegida con autenticación de sesión Flask
          </p>
        </div>
      </motion.section>
    </main>
  )
}
export default LoginPage
