import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useThemeStore } from '@/store/useThemeStore'

export function ThemeToggle() {
  const isLight = useThemeStore((state) => state.theme === 'light')
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <Button type="button" variant="outline" size="sm" aria-pressed={isLight} onClick={toggleTheme}>
      {isLight ? <Sun aria-hidden="true" className="size-4" /> : <Moon aria-hidden="true" className="size-4" />}
      Tema claro
    </Button>
  )
}
