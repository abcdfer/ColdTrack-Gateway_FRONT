import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SessionGate } from '@/components/routing/SessionGate'

const App = lazy(() => import('./App'))

function DashboardRoute() {
  const { search } = useLocation()

  return (
    <SessionGate>
      <Suspense fallback={<p role="status" className="p-5 text-cold-text">Cargando dashboard…</p>}>
        <App key={search} />
      </Suspense>
    </SessionGate>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
