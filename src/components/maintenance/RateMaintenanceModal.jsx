import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { rateMaintenanceRequest } from '@/services/api'
import { Star, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react'

export function RateMaintenanceModal({ isOpen, onClose, request, onRated }) {
  const [score, setScore] = useState(5)
  const [hoverScore, setHoverScore] = useState(0)
  const [comment, setComment] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  if (!request) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setPending(true)
    setError('')
    try {
      const rated = await rateMaintenanceRequest(request.id, {
        score,
        comment: comment.trim() || 'Servicio completado satisfactoriamente.',
      })
      if (onRated) onRated(rated)
      onClose()
    } catch (err) {
      setError(err.message || 'Error al enviar la reseña')
    } finally {
      setPending(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calificar Servicio Técnico">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="p-3.5 rounded-2xl bg-cold-dark/60 border border-cold-ice/15">
          <span className="text-[10px] text-cold-lavender uppercase font-semibold">
            Solicitud #{request.id}
          </span>
          <h4 className="font-heading font-semibold text-sm text-cold-text mt-0.5">
            {request.description || `Mantenimiento en ${request.deviceId}`}
          </h4>
          <p className="text-[11px] text-cold-muted mt-1">
            Tu opinión ayuda a mantener la calidad y confiabilidad de la red de frío.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2 text-center py-2">
          <span className="text-xs font-semibold text-cold-text block">
            Puntuación del trabajo realizado
          </span>
          <div className="flex justify-center items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverScore || score) >= star
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setScore(star)}
                  onMouseEnter={() => setHoverScore(star)}
                  onMouseLeave={() => setHoverScore(0)}
                  className="p-1.5 transition-transform hover:scale-125 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      active
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : 'text-zinc-600'
                    }`}
                  />
                </button>
              )
            })}
          </div>
          <span className="text-[11px] text-cold-ice font-mono font-medium">
            {score === 5
              ? 'Excelente (5 / 5)'
              : score === 4
              ? 'Muy bueno (4 / 5)'
              : score === 3
              ? 'Aceptable (3 / 5)'
              : score === 2
              ? 'Regular (2 / 5)'
              : 'Deficiente (1 / 5)'}
          </span>
        </div>

        <label className="grid gap-1 font-medium text-cold-text">
          <span>Comentario o Reseña</span>
          <textarea
            rows={3}
            maxLength={1500}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describí la puntualidad, prolijidad y resolución del inconveniente…"
            className="w-full px-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text resize-none"
          />
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-cold-divider/10">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={pending || !comment.trim()}>
            {pending ? 'Enviando…' : 'Publicar Calificación'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
