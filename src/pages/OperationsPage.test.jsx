import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import OperationsPage from './OperationsPage'
import * as api from '@/services/api'

vi.mock('@/services/api', () => ({
  fetchDevices: vi.fn(), fetchPolicy: vi.fn(), fetchAlerts: vi.fn(),
  fetchTechnicians: vi.fn(), fetchContacts: vi.fn(), fetchReviews: vi.fn(),
  createReview: vi.fn(), updatePolicy: vi.fn(),
}))

test('configura la captura y envía la solicitud con identificadores numéricos', async () => {
  const user = userEvent.setup()
  const technician = { id: 5, name: 'María', email: 'tecnica@example.com' }
  const policy = { enabled: true, samplingActive: true, channels: ['tempInterior'], limits: {}, schedule: [] }
  api.fetchDevices.mockResolvedValue({ devices: [{ deviceId: 'CT-1' }] })
  api.fetchTechnicians.mockResolvedValue({ items: [technician] })
  api.fetchContacts.mockResolvedValue({ items: [technician] })
  api.fetchReviews.mockResolvedValue({ items: [] })
  api.fetchPolicy.mockResolvedValue(policy)
  api.fetchAlerts.mockResolvedValue({ items: [{ id: 7, description: 'Temperatura alta', active: true }] })
  api.updatePolicy.mockResolvedValue({ ...policy, enabled: false, samplingActive: false })
  api.createReview.mockResolvedValue({ id: 3, deviceId: 'CT-1', technicianId: 5, description: 'Temperatura alta' })

  render(<MemoryRouter><OperationsPage account={{ id: 1, role: 'owner' }} /></MemoryRouter>)
  await user.click(await screen.findByRole('checkbox', { name: 'Habilitar captura' }))
  await user.click(screen.getByRole('button', { name: 'Guardar configuración' }))
  expect(api.updatePolicy).toHaveBeenCalledWith('CT-1', {
    enabled: false, channels: ['tempInterior'], schedule: [], limits: {},
  })
  expect(await screen.findByText(/Captura pausada/)).toBeVisible()

  await user.selectOptions(screen.getByLabelText('Alerta'), '7')
  await user.selectOptions(screen.getByLabelText('Asignar a'), '5')
  await user.click(screen.getByRole('button', { name: 'Solicitar revisión' }))
  expect(api.createReview).toHaveBeenCalledWith({ alertId: 7, technicianId: 5, notes: '' })
  expect(await screen.findByRole('heading', { name: 'CT-1 · Temperatura alta' })).toBeVisible()
}, 12000)
