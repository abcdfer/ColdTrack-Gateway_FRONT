import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { SessionGate } from './SessionGate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionGate />
  </StrictMode>,
)
