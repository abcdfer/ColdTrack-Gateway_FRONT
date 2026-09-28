import { useState, useEffect, useCallback, useRef } from 'react'
import {
  checkHealth,
  fetchDevices,
  fetchTelemetry,
  fetchLatestTelemetry,
  sendTelemetry,
} from '../services/apiService'

const SLOW_INTERVAL = 30000
const FAST_INTERVAL = 5000

function isDeviceInAlert(record, deviceEntry) {
  const diag = record?.diagnostico || deviceEntry?.diagnostico
  if (diag && diag !== 'SIN_FALLAS') {
    return true
  }

  const est = record?.estado || deviceEntry?.estado
  if (est) {
    const upper = est.toUpperCase()
    if (
      upper.includes('FALLA') ||
      upper.includes('ALARMA') ||
      upper.includes('CRITIC') ||
      upper === 'ERROR'
    ) {
      return true
    }
  }

  if (record) {
    if (record.proteccionAlta || record.proteccionBaja || record.ordenParoCompresor) {
      return true
    }
  }

  return false
}

export function useTelemetry(initialDeviceId = null) {
  const [isConnected, setIsConnected] = useState(false)
  const [healthInfo, setHealthInfo] = useState(null)
  const [devices, setDevices] = useState([])
  const [selectedDeviceId, setSelectedDeviceId] = useState(initialDeviceId || '')
  const [latestData, setLatestData] = useState(null)
  const [latestDataMap, setLatestDataMap] = useState({})
  const [history, setHistory] = useState([])
  const [isAutoRefresh, setIsAutoRefresh] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const [monitoringStatus, setMonitoringStatus] = useState('normal')
  const [pollingCadence, setPollingCadence] = useState(SLOW_INTERVAL)

  const wasInAlertRef = useRef(false)
  const isMountedRef = useRef(true)
  const pollTimerRef = useRef(null)
  const recoveryTimerRef = useRef(null)

  const activeDeviceId = selectedDeviceId || initialDeviceId || null

  const refreshData = useCallback(async () => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }

    try {
      const health = await checkHealth()
      if (!isMountedRef.current) return
      setHealthInfo(health)
      setIsConnected(true)
      setError(null)

      const devicesRes = await fetchDevices()
      if (!isMountedRef.current) return
      const devList = devicesRes.devices || []
      setDevices(devList)

      const dataMap = {}
      await Promise.all(
        devList.map(async (dev) => {
          try {
            const devLatest = await fetchLatestTelemetry(dev.deviceId)
            if (devLatest) {
              dataMap[dev.deviceId] = devLatest
            }
          } catch {
            dataMap[dev.deviceId] = null
          }
        })
      )

      if (!isMountedRef.current) return
      setLatestDataMap(dataMap)

      const targetId = activeDeviceId || (devList.length > 0 ? devList[0].deviceId : null)
      let currentLatest = null

      if (targetId) {
        if (dataMap[targetId]) {
          currentLatest = dataMap[targetId]
        } else {
          try {
            currentLatest = await fetchLatestTelemetry(targetId)
          } catch {
            currentLatest = null
          }
        }
      }

      if (isMountedRef.current) {
        setLatestData(currentLatest)
      }

      const historyRes = await fetchTelemetry(activeDeviceId, 30)
      if (isMountedRef.current) {
        setHistory(historyRes.items || [])
        setLastUpdated(new Date())
      }

      let hasAlert = false
      if (targetId) {
        const targetDev = devList.find((d) => d.deviceId === targetId)
        hasAlert = isDeviceInAlert(currentLatest, targetDev)
      } else {
        hasAlert = devList.some((d) => isDeviceInAlert(dataMap[d.deviceId], d))
      }

      let nextInterval = SLOW_INTERVAL

      if (hasAlert) {
        wasInAlertRef.current = true
        if (recoveryTimerRef.current) {
          clearTimeout(recoveryTimerRef.current)
          recoveryTimerRef.current = null
        }
        setMonitoringStatus('alerta')
        setPollingCadence(FAST_INTERVAL)
        nextInterval = FAST_INTERVAL
      } else if (wasInAlertRef.current) {
        wasInAlertRef.current = false
        setMonitoringStatus('recuperacion')
        setPollingCadence(SLOW_INTERVAL)
        nextInterval = SLOW_INTERVAL

        if (recoveryTimerRef.current) {
          clearTimeout(recoveryTimerRef.current)
        }
        recoveryTimerRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            setMonitoringStatus('normal')
          }
        }, 8000)
      } else {
        setMonitoringStatus((prev) => (prev === 'recuperacion' ? prev : 'normal'))
        setPollingCadence(SLOW_INTERVAL)
        nextInterval = SLOW_INTERVAL
      }

      if (isMountedRef.current && isAutoRefresh) {
        pollTimerRef.current = setTimeout(() => {
          refreshData()
        }, nextInterval)
      }
    } catch (err) {
      if (!isMountedRef.current) return
      setIsConnected(false)
      setError(err.message || 'Error de conexión con ColdTrack API')

      if (isAutoRefresh) {
        pollTimerRef.current = setTimeout(() => {
          refreshData()
        }, FAST_INTERVAL)
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [activeDeviceId, isAutoRefresh])

  useEffect(() => {
    isMountedRef.current = true
    refreshData()

    return () => {
      isMountedRef.current = false
      if (pollTimerRef.current) {
        clearTimeout(pollTimerRef.current)
      }
      if (recoveryTimerRef.current) {
        clearTimeout(recoveryTimerRef.current)
      }
    }
  }, [refreshData])

  const injectTelemetry = async (payload) => {
    const result = await sendTelemetry(payload)
    await refreshData()
    return result
  }

  const pollingCadenceLabel = `${Math.round(pollingCadence / 1000)}s`

  return {
    isConnected,
    healthInfo,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    latestData,
    latestDataMap,
    history,
    isAutoRefresh,
    setIsAutoRefresh,
    isLoading,
    error,
    lastUpdated,
    refreshData,
    injectTelemetry,
    monitoringStatus,
    pollingCadence,
    pollingCadenceLabel,
  }
}
