'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Msg = { role: 'ai' | 'user'; text: string; hint?: boolean }

const INIT: Msg[] = [
  { role: 'ai', text: 'Hello! Welcome to Heathrow Airport. Are you checking in for a flight today?' },
  { role: 'ai', text: '(Привет! Добро пожаловать. Вы регистрируетесь на рейс?)', hint: true },
]

const SUGGEST = [
  "Yes, I'd like to check in for my flight to Barcelona.",
  "Yes, I have a flight at 14:30.",
  "I need help with check-in, please.",
]

export default function TrialPage() {
  const router = useRouter()
  const [msgs, setMsgs] = useState<Msg[]>(INIT)
  const [input, setInput] = useState('')
  const [done, setDone] = useState(false)

  const send = (text: string) => {
    if (!text.trim() || done) return
    setMsgs((m) => [...m, { role: 'user', text }])
    setInput('')
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { role: 'ai', text: 'Great! Could I see your passport and booking confirmation, please?' },
        { role: 'ai', text: '(Отлично! Могу я увидеть паспорт и подтверждение бронирования?)', hint: true },
      ])
      setDone(true)
    }, 700)
  }

  const handleLogin = () => {
    // После логина → onboarding/complete (сохранит данные и перейдёт на dashboard)
    router.push('/login?callbackUrl=/onboarding/complete')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center space-y-1">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-medium px-3 py-1 rounded-full">
            ✈️ Пробный диалог
          </span>
          <h1 className="text-xl font-bold text-gray-900">Попробуй прямо сейчас</h1>
          <p className="text-sm text-gray-500">Ответь агенту на английском</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3 min-h-40">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={[
                'max-w-xs px-3 py-2 rounded-2xl text-sm',
                m.role === 'user' ? 'bg-sky-500 text-white rounded-br-sm' :
                m.hint ? 'bg-gray-100 text-gray-500 italic text-xs' :
                'bg-gray-100 text-gray-900 rounded-bl-sm',
              ].join(' ')}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {!done && (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 text-center">Выбери или напиши:</p>
            {SUGGEST.map((s, i) => (
              <button key={i} onClick={() => send(s)}
                className="w-full text-left text-sm px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-sky-400 hover:bg-sky-50 transition-all">
                {s}
              </button>
            ))}
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
                placeholder="Или напиши свой ответ..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-sky-400" />
              <button onClick={() => send(input)}
                className="px-4 bg-sky-500 text-white rounded-xl hover:bg-sky-600">→</button>
            </div>
          </div>
        )}

        {done && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
            <div className="text-3xl">🎉</div>
            <p className="font-semibold text-gray-900">Отлично! Первый диалог пройден.</p>
            <p className="text-sm text-gray-600">Войди чтобы сохранить прогресс и продолжить</p>
            <button onClick={handleLogin}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors">
              Войти с Google →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
