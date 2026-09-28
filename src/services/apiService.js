const DEFAULT_BASE_URL = 'http://127.0.0.1:5000'

export const getApiBaseUrl = () => {
  return localStorage.getItem('coldtrack_api_url') || DEFAULT_BASE_URL
}

export const setApiBaseUrl = (url) => {
  localStorage.setItem('coldtrack_api_url', url)
}

export const checkHealth = async () => {
  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}/health`, {
    headers: { 'Accept': 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

export const fetchDevices = async () => {
  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}/api/devices`, {
    headers: { 'Accept': 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

export const fetchTelemetry = async (deviceId = null, limit = 50) => {
  const baseUrl = getApiBaseUrl()
  const url = new URL(`${baseUrl}/api/telemetry`)
  if (deviceId) {
    url.searchParams.append('deviceId', deviceId)
  }
  url.searchParams.append('limit', limit.toString())

  const response = await fetch(url.toString(), {
    headers: { 'Accept': 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

export const fetchLatestTelemetry = async (deviceId) => {
  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}/api/telemetry/latest/${encodeURIComponent(deviceId)}`, {
    headers: { 'Accept': 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json()
}

export const sendTelemetry = async (payload) => {
  const baseUrl = getApiBaseUrl()
  const response = await fetch(`${baseUrl}/api/telemetry`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `HTTP ${response.status}`)
  }
  return response.json()
}
