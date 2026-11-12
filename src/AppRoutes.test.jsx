import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Link, MemoryRouter, useSearchParams } from 'react-router-dom'
import { beforeEach, expect, test, vi } from 'vitest'
import { AppRoutes } from './AppRoutes'
import { getSession, login, logout } from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'

vi.mock('@/services/api', () => ({ getSession: vi.fn(), login: vi.fn(), logout: vi.fn() }))
vi.mock('./App', () => ({
  default: function TestDashboard() {
    const [params] = useSearchParams()
    return <>
      <h2>{params.get('device') || 'Flota'}</h2>
      <Link to="/">Flota</Link>
    </>
  },
}))

const loggedOut = { required: true, authenticated: false }
const loggedIn = { required: true, authenticated: true }
const routeTimeout = { timeout: 5000 }

beforeEach(() => {
  vi.resetAllMocks()
  useAuthStore.getState().setSession(null)
  getSession.mockResolvedValue(loggedOut)
  login.mockResolvedValue(loggedIn)
  logout.mockResolvedValue(loggedOut)
})

test('valida el ingreso y conserva el enlace al equipo después de iniciar sesión', async () => {
  const user = userEvent.setup()
  render(<MemoryRouter initialEntries={['/?device=CT-001']}><AppRoutes /></MemoryRouter>)
  await user.click(await screen.findByRole('button', { name: 'Ingresar' }, routeTimeout))
  expect(await screen.findByText('Ingresá tu usuario.')).toBeVisible()
  expect(login).not.toHaveBeenCalled()

  await user.type(screen.getByLabelText('Usuario'), 'demo')
  await user.type(screen.getByLabelText('Contraseña'), 'clave-de-prueba')
  await user.click(screen.getByRole('button', { name: 'Ingresar' }))
  expect(await screen.findByRole('heading', { name: 'CT-001' }, routeTimeout)).toBeVisible()

  await user.click(screen.getByRole('link', { name: 'Flota' }))
  expect(await screen.findByRole('heading', { name: 'Flota' })).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
  expect(await screen.findByRole('button', { name: 'Ingresar' }, routeTimeout)).toBeInTheDocument()
}, 15000)
