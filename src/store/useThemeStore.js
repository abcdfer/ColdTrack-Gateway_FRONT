import { create } from 'zustand'

const storageKey = 'coldtrack-theme'

function readTheme() {
  try {
    return localStorage.getItem(storageKey) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export const useThemeStore = create((set) => ({
  theme: readTheme(),
  toggleTheme: () => set(({ theme }) => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    try {
      localStorage.setItem(storageKey, nextTheme)
    } catch {
      return { theme: nextTheme }
    }
    return { theme: nextTheme }
  }),
}))

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
}
