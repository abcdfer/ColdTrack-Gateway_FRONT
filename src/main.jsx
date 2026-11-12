import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './AppRoutes'
import { applyTheme, useThemeStore } from '@/store/useThemeStore'
import './index.css'

applyTheme(useThemeStore.getState().theme)
useThemeStore.subscribe(({ theme }) => applyTheme(theme))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>,
)
