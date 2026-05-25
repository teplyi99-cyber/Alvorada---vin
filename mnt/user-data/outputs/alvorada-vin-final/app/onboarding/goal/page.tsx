'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const GOALS = [
  { id: 'travel', emoji: '✈️', title: 'Путешествия', desc: 'Аэропорт, отель, транспорт' },
  { id: 'work',   emoji: '💼', title: 'Работа',      desc: 'Переговоры, письма, встречи' },
  { id: 'study',  emoji: '🎓', title: 'Учёба',       desc: 'Экзамены, понимание текстов' },
  { id: 'daily',  emoji: '🗣️', title: 'Общение',     desc: 'Повседневные разговоры' },
]

export default function GoalPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const handleContinue = async () => {
    if (!selected) return
    setSaving(true)
    localStorage.setItem('onboarding_goal', selected)
    fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step: 'goal', goal: selected }),
    }).catch(() => {})
    setSaving(false)
    router.push('/onboarding/test')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex gap-1">
          <div className="h-1 flex-1 bg-sky-500 rounded-full" />
          <div className="h-1 flex-1 bg-gray-200 rounded-full" />
          <div className="h-1 flex-1 bg-gray-200 rounded-full" />
          <div className="h-1 flex-1 bg-gray-200 rounded-full" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Какая цель?</h1>
          <p className="text-gray-500 mt-1">Подберём сценарии под тебя</p>
        </div>

        <div className="space-y-3">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelected(g.id)}
              className={[
                'w-full text-left px-4 py-4 rounded-xl border-2 transition-all flex items-center gap-3',
                selected === g.id ? 'border-sky-500 bg-sky-50' : 'border-gray-200 bg-white hover:border-gray-300',
              ].join(' ')}
            >
              <span className="text-2xl">{g.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{g.title}</div>
                <div className="text-sm text-gray-500">{g.desc}</div>
              </div>
              {selected === g.id && (
                <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected || saving}
          className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl transition-colors"
        >
          Продолжить →
        </button>
      </div>
    </div>
  )
}
