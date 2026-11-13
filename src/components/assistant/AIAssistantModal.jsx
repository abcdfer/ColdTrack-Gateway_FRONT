import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { askAssistant } from '@/services/api'
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react'

const SUGGESTED_QUESTIONS = [
  '¿Cómo pauso los sensores?',
  '¿Qué significa la alerta de presión alta?',
  '¿Cómo calculo las horas de uso del compresor?',
  '¿Cómo vinculo un nuevo equipo con QR?',
  '¿Cómo solicito un técnico de frío?',
  '¿Qué hacer ante un desvío de temperatura interior?',
]

export function AIAssistantModal({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: '¡Hola! Soy el asistente virtual de ColdTrack. Puedo responder tus consultas sobre telemetría, alertas térmicas, configuración de sensores y mantenimiento de tu cadena de frío. ¿En qué puedo orientarte?',
      topic: 'Bienvenida',
    },
  ])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleSend(questionText) {
    const q = (questionText || input).trim()
    if (!q || pending) return

    const newMsgs = [...messages, { role: 'user', text: q }]
    setMessages(newMsgs)
    setInput('')
    setPending(true)
    setError('')

    try {
      const res = await askAssistant(q)
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          text: res.answer,
          topic: res.topic,
          answered: res.answered,
        },
      ])
    } catch (err) {
      setError(err.message || 'No se pudo obtener respuesta del asistente')
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          text: 'Lo siento, ocurrió un error temporal al consultar el servicio del asistente. Por favor verificá tu conexión o reintentá en unos momentos.',
          topic: 'Error',
        },
      ])
    } finally {
      setPending(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asistente Inteligente ColdTrack">
      <div className="space-y-4 text-xs">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-cold-ice/15 to-cold-lavender/10 border border-cold-ice/20">
          <div className="p-2.5 rounded-xl bg-cold-ice text-cold-on-accent shadow-[0_0_15px_rgba(190,207,255,0.4)]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-heading font-semibold text-xs text-cold-text flex items-center gap-1.5">
              ColdTrack Assistant
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cold-ice/20 text-cold-ice font-mono">
                API v1.3
              </span>
            </h4>
            <p className="text-[11px] text-cold-lavender">
              Consultas operativas, desvíos frigoríficos y normativas de conservación
            </p>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div>
          <span className="text-[10px] uppercase font-semibold text-cold-lavender tracking-wider block mb-1.5 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-300" />
            Preguntas frecuentes sugeridas:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((sq) => (
              <button
                key={sq}
                type="button"
                disabled={pending}
                onClick={() => handleSend(sq)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-cold-dark/60 hover:bg-cold-ice/15 hover:text-cold-ice border border-cold-ice/15 text-cold-muted transition-all text-left cursor-pointer"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Box */}
        <div className="h-64 overflow-y-auto space-y-3 p-3 rounded-2xl bg-cold-dark/70 border border-cold-ice/15 custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-xs space-y-1.5 ${
                  m.role === 'user'
                    ? 'bg-cold-ice text-cold-on-accent font-medium rounded-tr-sm shadow-md'
                    : 'bg-cold-surface border border-cold-ice/15 text-cold-text rounded-tl-sm'
                }`}
              >
                {m.topic && m.role === 'assistant' && (
                  <div className="flex items-center gap-1 text-[10px] font-semibold uppercase text-cold-lavender pb-1 border-b border-cold-divider/10">
                    <Sparkles className="w-3 h-3 text-cold-ice" />
                    <span>Tema: {m.topic}</span>
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}

          {pending && (
            <div className="flex items-center gap-2 text-cold-muted text-xs p-2">
              <div className="w-4 h-4 border-2 border-cold-ice border-t-transparent rounded-full animate-spin" />
              <span>Consultando asistente…</span>
            </div>
          )}
        </div>

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2 pt-1"
        >
          <input
            type="text"
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hacé una pregunta sobre tu equipo o la app…"
            disabled={pending}
            className="flex-1 px-3 py-2 text-xs rounded-xl bg-cold-dark/70 border border-cold-ice/20 focus:border-cold-ice focus:outline-none text-cold-text"
          />
          <Button type="submit" disabled={pending || !input.trim()} size="sm">
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preguntar</span>
          </Button>
        </form>
      </div>
    </Modal>
  )
}
