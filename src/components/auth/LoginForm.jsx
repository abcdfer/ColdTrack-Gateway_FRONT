import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'

const loginSchema = z.object({
  username: z.string().min(1, 'Ingresá tu usuario.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
})

const inputClass = 'rounded-lg border border-cold-divider/20 bg-zinc-950 p-2'

export default function LoginForm({ onLogin, pending }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  return (
    <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onLogin)} noValidate>
      <label className="grid gap-1 text-sm">
        Usuario
        <input {...register('username')} autoComplete="username" required
          aria-invalid={Boolean(errors.username)} aria-describedby={errors.username ? 'username-error' : undefined}
          className={inputClass} />
      </label>
      {errors.username && <p id="username-error" role="alert" className="text-sm text-rose-300">{errors.username.message}</p>}
      <label className="grid gap-1 text-sm">
        Contraseña
        <input {...register('password')} type="password" autoComplete="current-password" required
          aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined}
          className={inputClass} />
      </label>
      {errors.password && <p id="password-error" role="alert" className="text-sm text-rose-300">{errors.password.message}</p>}
      <Button type="submit" disabled={pending}>{pending ? 'Ingresando…' : 'Ingresar'}</Button>
    </form>
  )
}
