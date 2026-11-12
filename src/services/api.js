export const getApiBaseUrl = () => window.location.origin

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
  if (!response.ok) {
    if (response.status === 401 && path !== '/api/session') {
      window.dispatchEvent(new Event('coldtrack-session-expired'))
    }
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || `HTTP ${response.status}`)
  }
  return response.json()
}

export const getSession = (signal) => apiRequest('/api/session', { signal })
export const login = (username, password) => apiRequest('/api/session', {
  method: 'POST',
  body: JSON.stringify({ username, password }),
})
export const logout = () => apiRequest('/api/session', { method: 'DELETE' })
export const checkHealth = () => apiRequest('/health')
export const fetchDevices = () => apiRequest('/api/devices')
export const fetchLatestTelemetry = (deviceId) => apiRequest(`/api/telemetry/latest/${encodeURIComponent(deviceId)}`)
export const fetchAlerts = (deviceId) => apiRequest(`/api/devices/${encodeURIComponent(deviceId)}/alerts`)

export const fetchTelemetry = (deviceId = null, limit = 50) => {
  const params = new URLSearchParams({ limit: String(limit) })
  if (deviceId) params.set('deviceId', deviceId)
  return apiRequest(`/api/telemetry?${params}`)
}

export const sendTelemetry = (payload) => apiRequest('/api/simulator/readings', {
  method: 'POST',
  body: JSON.stringify(payload),
})
