'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SCENARIOS, ScenarioId } from './prompts'
import type { Feedback, ChatResponse } from '@/app/api/chat/route'

type Message = {
  role: 'user' | 'assistant'
  content: string
  feedback?: Feedback
}

function ScenarioPicker({ onSelect }: { onSelect: (id: ScenarioId) => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Практика</h1>
          <p className="text-gray-500 mt-1">Выбери сценарий для диалога</p>
        </div>
        <div className="space-y-3">
          {Object.values(SCENARIOS).map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="w-full text-left bg-white rounded-2xl border border-gray-200 hover:border-sky-400 hover:shadow-sm transition-all px-5 py-4 flex items-center gap-4"
            >
              <span className="text-3xl">{s.emoji}</span>
              <div>
                <div className="font-semibold text-gray-900">{s.titleRu}</div>
                <div className="text-sm text-gray-500">{s.desc}</div>
              </div>
              <span className="ml-auto text-gray-400 text-lg">→</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeedbackCard({ fb }: { fb: Feedback }) {
  const scoreColor =
    fb.grammar_score >= 4 ? 'text-emerald-600' :
    fb.grammar_score >= 2 ? 'text-amber-600' : 'text-red-500'
  const scoreBg =
    fb.grammar_score >= 4 ? 'bg-emerald-50 border-emerald-200' :
    fb.grammar_score >= 2 ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'
  return (
    <div className={`mt-1 rounded-xl border text-sm px-3 py-2 space-y-1 ${scoreBg}`}>
      <div className="flex items-center justify-between">
        <span className="text-gray-500 text-xs">{fb.positive_ru}</span>
        <span className={`font-bold text-xs ${scoreColor}`}>
          {'★'.repeat(fb.grammar_score)}{'☆'.repeat(5 - fb.grammar_score)}
        </span>
      </div>
      {fb.correction && (
        <div className="text-gray-700"><span className="text-gray-400">→ </span>{fb.correction}</div>
      )}
      {fb.explanation_ru && (
        <div className="text-gray-500 text-xs">{fb.explanation_ru}</div>
      )}
    </div>
  )
}

function ChatScreen({
  scenarioId, dialogTitle, onBack,
}: {
  scenarioId: ScenarioId; dialogTitle?: string; onBack: () => void
}) {
  const scenario = SCENARIOS[scenarioId]
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: scenario.opening },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    const userMsg: Message = { role: 'user', content: text }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioId, history, userMessage: text }),
      })
      if (!res.ok) throw new Error('API error')
      const data: ChatResponse = await res.json()
      setMessages([
        ...nextMessages.slice(0, -1),
        { ...userMsg, feedback: data.feedback },
        { role: 'assistant', content: data.reply },
      ])
    } catch {
      setMessages([...nextMessages, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-700 transition-colors">← Назад</button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{scenario.emoji}</span>
          <div>
            <div className="font-semibold text-gray-900 text-sm leading-tight">{dialogTitle || scenario.titleRu}</div>
            <div className="text-xs text-gray-400">{scenario.character}</div>
          </div>
        </div>
        <div className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">B1/B2</div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            {msg.role === 'assistant' && (
              <div className="text-xs text-gray-400 mb-1 ml-1">{scenario.character}</div>
            )}
            <div className={[
              'max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-sky-500 text-white rounded-br-sm'
                : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100',
            ].join(' ')}>{msg.content}</div>
            {msg.role === 'user' && msg.feedback && (
              <div className="max-w-xs md:max-w-md w-full"><FeedbackCard fb={msg.feedback} /></div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-start">
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white border-t border-gray-100 px-4 py-3 shrink-0">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Type your reply in English..."
            disabled={loading}
            className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
            autoFocus
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200 text-white disabled:text-gray-400 rounded-xl w-10 h-10 flex items-center justify-center transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M14 8L2 2l2.5 6L2 14l12-6z" fill="currentColor" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          Пиши на английском — получишь оценку после каждого ответа
        </p>
      </div>
    </div>
  )
}

// Fix 1: useSearchParams требует Suspense в Next.js App Router
function PracticeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Fix 2: валидируем scenario — не принимаем неизвестные значения
  const rawScenario = searchParams.get('scenario')
  const urlScenario = rawScenario && rawScenario in SCENARIOS
    ? (rawScenario as ScenarioId)
    : null

  const urlDialog = searchParams.get('dialog')
  const [scenario, setScenario] = useState<ScenarioId | null>(urlScenario)

  const dialogTitle = urlDialog
    ? urlDialog.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : undefined

  const handleBack = () => {
    if (urlScenario) {
      router.push(`/scenarios/${urlScenario}`)
    } else {
      setScenario(null)
    }
  }

  if (!scenario) return <ScenarioPicker onSelect={setScenario} />

  return <ChatScreen scenarioId={scenario} dialogTitle={dialogTitle} onBack={handleBack} />
}

export default function PracticePage() {
  return (
    <Suspense fallback={null}>
      <PracticeContent />
    </Suspense>
  )
}
