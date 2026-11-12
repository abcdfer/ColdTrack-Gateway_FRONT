import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SessionGate } from '@/components/routing/SessionGate'

import { useAuthStore } from '@/store/useAuthStore'

const OperationsPage = lazy(() => import('@/pages/OperationsPage'))
const App = lazy(() => import('./App'))

function DashboardRoute() {
  const { search } = useLocation()

  const account = useAuthStore((state) => state.session?.account)
  const operations = account && (account.role === 'technician' || new URLSearchParams(search).get('section') === 'operations')

  return (
    <SessionGate>
      <Suspense fallback={<p role="status" className="p-5 text-cold-text">Cargando dashboard…</p>}>
        {operations ? <OperationsPage key={account.id} account={account} /> : <App key={search} />}
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
