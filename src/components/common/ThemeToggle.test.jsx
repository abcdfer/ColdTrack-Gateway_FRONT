import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test } from 'vitest'
import { ThemeToggle } from './ThemeToggle'
import { useThemeStore } from '@/store/useThemeStore'

afterEach(() => {
  localStorage.clear()
  useThemeStore.setState({ theme: 'dark' })
})

test('cambia de tema y guarda la elección con la clave existente', async () => {
  const user = userEvent.setup()
  render(<ThemeToggle />)
  const toggle = screen.getByRole('button', { name: 'Tema claro' })
  expect(toggle).toHaveAttribute('aria-pressed', 'false')

  await user.click(toggle)
  expect(toggle).toHaveAttribute('aria-pressed', 'true')
  expect(localStorage.getItem('coldtrack-theme')).toBe('light')

  await user.click(toggle)
  expect(toggle).toHaveAttribute('aria-pressed', 'false')
  expect(localStorage.getItem('coldtrack-theme')).toBe('dark')
})
