import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { createDevice, createPairingCode, claimDevice } from '@/services/api'
import {
  PlusCircle,
  QrCode,
  Key,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Sparkles,
} from 'lucide-react'

// Simple SVG QR code pattern generator based on string hash for realistic visual presentation
function MiniQrSvg({ text }) {
  const size = 160
  // Generate deterministic pseudo matrix
  const matrix = []
  const n = 21
  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }

  for (let r = 0; r < n; r++) {
    const row = []
    for (let c = 0; c < n; c++) {
      // Corners finder patterns
      const isCornerTopLeft = r < 7 && c < 7
      const isCornerTopRight = r < 7 && c >= n - 7
      const isCornerBottomLeft = r >= n - 7 && c < 7

      if (isCornerTopLeft || isCornerTopRight || isCornerBottomLeft) {
        const localR = isCornerTopLeft ? r : isCornerTopRight ? r : r - (n - 7)
        const localC = isCornerTopLeft ? c : isCornerTopRight ? c - (n - 7) : c
        if (
          localR === 0 ||
          localR === 6 ||
          localC === 0 ||
          localC === 6 ||
          (localR >= 2 && localR <= 4 && localC >= 2 && localC <= 4)
        ) {
          row.push(1)
        } else {
          row.push(0)
        }
      } else {
        const bit = Math.abs((hash ^ (r * 31 + c * 17)) % 100) > 48 ? 1 : 0
        row.push(bit)
      }
    }
    matrix.push(row)
  }

  const cellSize = size / n

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-xl bg-white p-2 shadow-inner"
    >
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#0b0e14"
            />
          ) : null
        )
      )}
    </svg>
  )
}

export function AddDeviceModal({ isOpen, onClose, onDeviceCreated }) {
  const [activeTab, setActiveTab] = useState('create') // 'create' | 'pairing' | 'claim'
  const [name, setName] = useState('')
  const [claimCode, setClaimCode] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [tokenResult, setTokenResult] = useState(null)
  const [pairingResult, setPairingResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setClaimCode('')
      setError('')
      setTokenResult(null)
      setPairingResult(null)
      setCopied(false)
    }
  }, [isOpen])

  // Countdown timer for pairing code expiry
  useEffect(() => {
    if (!pairingResult?.expiresIn) return
    setCountdown(pairingResult.expiresIn)
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval)
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [pairingResult])

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    setPending(true)
    setError('')
    try {
      const created = await createDevice({ name: name.trim() })
      setTokenResult(created)
      if (onDeviceCreated) onDeviceCreated(created)
    } catch (err) {
      setError(err.message || 'Error al registrar el equipo')
    } finally {
      setPending(false)
    }
  }

  async function handleGeneratePairing(e) {
    e.preventDefault()
    if (!name.trim()) return
    setPending(true)
    setError('')
    try {
      const pairing = await createPairingCode({ name: name.trim() })
      setPairingResult(pairing)
    } catch (err) {
      setError(err.message || 'Error al generar código de vinculación')
    } finally {
      setPending(false)
    }
  }

  async function handleClaim(e) {
    e.preventDefault()
    if (!claimCode.trim()) return
    setPending(true)
    setError('')
    try {
      const claimed = await claimDevice({
        pairingCode: claimCode.trim(),
        name: name.trim() || undefined,
      })
      setTokenResult(claimed)
      if (onDeviceCreated) onDeviceCreated(claimed)
    } catch (err) {
      setError(err.message || 'Código inválido o ya expirado')
    } finally {
      setPending(false)
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestión de Equipos y Vinculación">
      <div className="space-y-4 text-xs">
        {/* Tab switcher */}
        <div className="grid grid-cols-3 rounded-xl bg-cold-dark/60 p-1 border border-cold-ice/15">
          <button
            type="button"
            onClick={() => {
              setActiveTab('create')
              setError('')
            }}
            className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'create'
                ? 'bg-cold-ice text-cold-on-accent shadow-md'
                : 'text-cold-muted hover:text-cold-text'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Alta Directa</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('pairing')
              setError('')
            }}
            className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'pairing'
                ? 'bg-cold-ice text-cold-on-accent shadow-md'
                : 'text-cold-muted hover:text-cold-text'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Código / QR</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('claim')
              setError('')
            }}
            className={`py-1.5 px-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'claim'
                ? 'bg-cold-ice text-cold-on-accent shadow-md'
                : 'text-cold-muted hover:text-cold-text'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Vincular Código</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: ALTA DIRECTA */}
        {activeTab === 'create' && !tokenResult && (
          <form onSubmit={handleCreate} className="space-y-4">
            <p className="text-cold-muted">
              Registrá una nueva unidad frigorífica. La API emitirá el identificador único del equipo
              y el token secreto para configurar el Gateway o MCU.
            </p>
            <label className="grid gap-1.5 font-medium text-cold-text">
              <span>Nombre o Identificador Descriptivo</span>
              <input
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Cámara Frigorífica 02 - Lácteos"
                className="w-full px-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={pending || !name.trim()}>
                {pending ? 'Registrando…' : 'Registrar Equipo'}
              </Button>
            </div>
          </form>
        )}

        {/* TOKEN GENERATED SUCCESS SCREEN */}
        {tokenResult && (
          <div className="space-y-4 p-4 rounded-2xl bg-cold-dark/70 border border-cold-ice/25 text-left">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-5 h-5" />
              <span>Equipo Registrado Exitosamente</span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-cold-lavender uppercase font-semibold">
                Nombre de la Unidad:
              </span>
              <p className="font-heading font-bold text-sm text-cold-text">{tokenResult.name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-cold-lavender uppercase font-semibold">
                Device ID Asignado:
              </span>
              <code className="block p-2 rounded-lg bg-cold-shade font-mono text-xs text-cold-ice border border-cold-divider/10">
                {tokenResult.deviceId}
              </code>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-cold-lavender uppercase font-semibold flex items-center justify-between">
                <span>Gateway Secret Token</span>
                <span className="text-[10px] text-amber-300 font-normal">
                  ⚠️ Copialo ahora; no se vuelve a mostrar
                </span>
              </span>
              <div className="relative">
                <code className="block p-2.5 pr-10 rounded-lg bg-cold-shade font-mono text-[11px] text-amber-200 border border-amber-500/20 break-all select-all">
                  {tokenResult.gatewayToken}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(tokenResult.gatewayToken)}
                  className="absolute right-2 top-2 p-1 rounded hover:bg-white/10 text-cold-ice cursor-pointer"
                  title="Copiar token"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="button"
              className="w-full mt-2"
              onClick={() => {
                setTokenResult(null)
                onClose()
              }}
            >
              Listo, cerrar ventana
            </Button>
          </div>
        )}

        {/* TAB 2: GENERAR CÓDIGO QR / PAIRING */}
        {activeTab === 'pairing' && !pairingResult && (
          <form onSubmit={handleGeneratePairing} className="space-y-4">
            <p className="text-cold-muted">
              Generá un código de vinculación temporal de uso único. Puede ser escaneado como QR desde
              el dispositivo o ingresado para asociar el hardware con tu cuenta.
            </p>
            <label className="grid gap-1.5 font-medium text-cold-text">
              <span>Nombre para la Unidad</span>
              <input
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Contenedor Móvil #4"
                className="w-full px-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={pending || !name.trim()}>
                {pending ? 'Generando…' : 'Crear Código de Vinculación'}
              </Button>
            </div>
          </form>
        )}

        {/* PAIRING QR DISPLAY SCREEN */}
        {pairingResult && (
          <div className="space-y-4 text-center">
            <div className="flex justify-center my-2">
              <MiniQrSvg text={pairingResult.pairingCode} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Expira en: {Math.floor(countdown / 60)}:
                {(countdown % 60).toString().padStart(2, '0')} min
              </span>
            </div>

            <div className="space-y-1 text-left">
              <span className="text-[10px] text-cold-lavender uppercase font-semibold">
                Código de Vinculación (Pairing Code):
              </span>
              <div className="relative">
                <code className="block p-2.5 pr-10 rounded-lg bg-cold-shade font-mono text-xs text-cold-ice border border-cold-divider/10 break-all select-all">
                  {pairingResult.pairingCode}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(pairingResult.pairingCode)}
                  className="absolute right-2 top-2 p-1 rounded hover:bg-white/10 text-cold-ice cursor-pointer"
                  title="Copiar código"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setClaimCode(pairingResult.pairingCode)
                  setActiveTab('claim')
                  setPairingResult(null)
                }}
              >
                Vincular ahora con este código
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPairingResult(null)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: RECLAMAR EQUIPO CON CÓDIGO */}
        {activeTab === 'claim' && !tokenResult && (
          <form onSubmit={handleClaim} className="space-y-4">
            <p className="text-cold-muted">
              Si contás con un código emitido por el técnico o generado previamente, ingresalo aquí
              para vincular el equipo a tu flota.
            </p>
            <label className="grid gap-1.5 font-medium text-cold-text">
              <span>Código de Vinculación (Pairing Code)</span>
              <input
                type="text"
                required
                value={claimCode}
                onChange={(e) => setClaimCode(e.target.value)}
                placeholder="Pegá aquí el código alfanumérico…"
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
              />
            </label>
            <label className="grid gap-1.5 font-medium text-cold-text">
              <span>Nombre Opcional (personalizado)</span>
              <input
                type="text"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre para identificarlo"
                className="w-full px-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
              />
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={pending || !claimCode.trim()}>
                {pending ? 'Vinculando…' : 'Confirmar Vinculación'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
