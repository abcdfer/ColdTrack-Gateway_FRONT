export const getApiBaseUrl = () => window.location.origin

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  })
  if (!response.ok) {
    if (response.status === 401 && path !== '/api/session') {
      window.dispatchEvent(new Event('coldtrack-session-expired'))
    }
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `HTTP ${response.status}`)
  }
  return response.status === 204 ? undefined : response.json()
}

const sendJson = (path, method, data) =>
  apiRequest(path, { method, body: JSON.stringify(data) })

// ==========================================
// SESIÓN Y CUENTA
// ==========================================
export const getSession = (signal) => apiRequest('/api/session', { signal })
export const login = (username, password) =>
  sendJson('/api/session', 'POST', { username, password })
export const logout = () => apiRequest('/api/session', { method: 'DELETE' })

export const fetchProfile = () => apiRequest('/api/profile')
export const updateProfile = (data) => sendJson('/api/profile', 'PATCH', data)

export const registerAccount = (data) =>
  sendJson('/api/registration', 'POST', data)
export const verifyAccount = (data) =>
  sendJson('/api/registration/verify', 'POST', data)

export const requestPasswordReset = (data) =>
  sendJson('/api/password-reset', 'POST', data)
export const confirmPasswordReset = (data) =>
  sendJson('/api/password-reset/confirm', 'POST', data)

// ==========================================
// SISTEMA Y SALUD
// ==========================================
export const checkHealth = () => apiRequest('/health')

// ==========================================
// EQUIPOS (DEVICES)
// ==========================================
export const fetchDevices = () => apiRequest('/api/devices')
export const createDevice = (data) => sendJson('/api/devices', 'POST', data)
export const fetchDeviceDetail = (deviceId) =>
  apiRequest(`/api/devices/${encodeURIComponent(deviceId)}`)

export const createPairingCode = (data) =>
  sendJson('/api/devices/pairing', 'POST', data)
export const claimDevice = (data) =>
  sendJson('/api/devices/claim', 'POST', data)

// ==========================================
// POLÍTICA DE CAPTURA Y SENSORES
// ==========================================
const devicePolicyPath = (id) =>
  `/api/devices/${encodeURIComponent(id)}/policy`
export const fetchPolicy = (id) => apiRequest(devicePolicyPath(id))
export const updatePolicy = (id, data) =>
  sendJson(devicePolicyPath(id), 'PATCH', data)

export const confirmCaptureAck = (id, revision) =>
  sendJson(`/api/devices/${encodeURIComponent(id)}/capture-ack`, 'PUT', {
    revision,
  })

// ==========================================
// PREFERENCIAS DE NOTIFICACIONES (CORREO)
// ==========================================
const deviceNotifPath = (id) =>
  `/api/devices/${encodeURIComponent(id)}/notification-preferences`
export const fetchNotificationPreferences = (id) =>
  apiRequest(deviceNotifPath(id))
export const updateNotificationPreferences = (id, data) =>
  sendJson(deviceNotifPath(id), 'PUT', data)

// ==========================================
// TIEMPO DE USO DEL COMPRESOR
// ==========================================
export const fetchDeviceUsage = (deviceId, days = 7) => {
  const params = new URLSearchParams({ days: String(days) })
  return apiRequest(
    `/api/devices/${encodeURIComponent(deviceId)}/usage?${params}`
  )
}

// ==========================================
// TELEMETRÍA Y SIMULADOR
// ==========================================
export const fetchLatestTelemetry = (deviceId) =>
  apiRequest(`/api/telemetry/latest/${encodeURIComponent(deviceId)}`)

export const fetchTelemetry = (deviceId = null, limit = 50) => {
  const params = new URLSearchParams({ limit: String(limit) })
  if (deviceId) params.set('deviceId', deviceId)
  return apiRequest(`/api/telemetry?${params}`)
}

export const sendTelemetry = (payload) =>
  sendJson('/api/simulator/readings', 'POST', payload)

export const sendGatewayTelemetry = (payload) =>
  sendJson('/api/telemetry', 'POST', payload)

// ==========================================
// ALERTAS Y REVISIONES
// ==========================================
export const fetchAlerts = (deviceId) =>
  apiRequest(`/api/devices/${encodeURIComponent(deviceId)}/alerts`)

export const fetchReviews = () => apiRequest('/api/reviews')
export const createReview = (data) => sendJson('/api/reviews', 'POST', data)

// ==========================================
// MANTENIMIENTO Y SOLICITUDES
// ==========================================
export const fetchMaintenanceRequests = (params = {}) => {
  const query = new URLSearchParams()
  if (params.limit) query.set('limit', String(params.limit))
  if (params.beforeId) query.set('beforeId', String(params.beforeId))
  const qs = query.toString()
  return apiRequest(`/api/maintenance-requests${qs ? `?${qs}` : ''}`)
}

export const createMaintenanceRequest = (data) =>
  sendJson('/api/maintenance-requests', 'POST', data)

export const fetchMaintenanceDetail = (requestId) =>
  apiRequest(`/api/maintenance-requests/${encodeURIComponent(requestId)}`)

export const updateMaintenanceStatus = (requestId, data) =>
  sendJson(
    `/api/maintenance-requests/${encodeURIComponent(requestId)}/status`,
    'PATCH',
    data
  )

export const rateMaintenanceRequest = (requestId, data) =>
  sendJson(
    `/api/maintenance-requests/${encodeURIComponent(requestId)}/rating`,
    'POST',
    data
  )

// ==========================================
// DIRECTORIO DE TÉCNICOS Y CONTACTOS
// ==========================================
export const fetchTechnicians = () => apiRequest('/api/technicians')
export const fetchContacts = () => apiRequest('/api/technician-contacts')
export const saveContact = (id) =>
  apiRequest(`/api/technician-contacts/${encodeURIComponent(id)}`, {
    method: 'PUT',
  })
export const removeContact = (id) =>
  apiRequest(`/api/technician-contacts/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })

// ==========================================
// ASISTENTE VIRTUAL (FAQ & DIAGNÓSTICO)
// ==========================================
export const askAssistant = (question) =>
  sendJson('/api/assistant/questions', 'POST', { question })
