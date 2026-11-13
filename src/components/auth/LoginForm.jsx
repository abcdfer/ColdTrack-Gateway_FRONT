import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Sparkles, Lock, Mail } from 'lucide-react'

const loginSchema = z.object({
  username: z.string().min(1, 'Ingresá tu usuario.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
})

const inputClass =
  'w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text transition-all'

export default function LoginForm({ onLogin, pending }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  function fillDemoCredentials() {
    setValue('username', 'propietario.pruebas@example.test', { shouldValidate: true })
    setValue('password', 'Mg8R27iotn-i95ZLXetYBkr_3Qil0S2V', { shouldValidate: true })
  }

  return (
    <form className="mt-4 grid gap-3.5" onSubmit={handleSubmit(onLogin)} noValidate>
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-cold-lavender">Credenciales</span>
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-cold-ice hover:underline cursor-pointer"
        >
          <Sparkles className="w-3 h-3" />
          Usar cuenta de prueba
        </button>
      </div>

      <label className="grid gap-1 text-xs font-medium text-cold-text">
        Usuario
        <div className="relative">
          <input
            {...register('username')}
            autoComplete="username"
            required
            placeholder="usuario@ejemplo.com"
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'username-error' : undefined}
            className={inputClass}
          />
          <Mail className="w-4 h-4 text-cold-muted absolute left-2.5 top-2.5" />
        </div>
      </label>
      {errors.username && (
        <p id="username-error" role="alert" className="text-xs text-rose-300">
          {errors.username.message}
        </p>
      )}

      <label className="grid gap-1 text-xs font-medium text-cold-text">
        Contraseña
        <div className="relative">
          <input
            {...register('password')}
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••••••"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
            className={inputClass}
          />
          <Lock className="w-4 h-4 text-cold-muted absolute left-2.5 top-2.5" />
        </div>
      </label>
      {errors.password && (
        <p id="password-error" role="alert" className="text-xs text-rose-300">
          {errors.password.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="mt-1 w-full">
        {pending ? 'Ingresando…' : 'Ingresar'}
      </Button>
    </form>
  )
}
