'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const OPTIONS = [
  { value: 5,  label: '5 минут',  desc: 'Для самых занятых' },
  { value: 10, label: '10 минут', desc: 'Хороший старт' },
  { value: 20, label: '20 минут', desc: 'Заметный прогресс' },
  { value: 30, label: '30 минут', desc: 'Быстрый результат' },
]

export default function DailyPage() {
  const router = useRouter()
  const [selected, setSelected] = useState(10)

  const handleContinue = () => {
    localStorage.setItem('onboarding_daily', String(selected))
    router.push('/onboarding/trial')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex gap-1">
          <div className="h-1 flex-1 bg-sky-500 rounded-full" />
          <div className="h-1 flex-1 bg-sky-500 rounded-full" />
          <div className="h-1 flex-1 bg-sky-500 rounded-full" />
          <div className="h-1 flex-1 bg-gray-200 rounded-full" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Сколько времени в день?</h1>
          <p className="text-gray-500 mt-1">Выбери реалистичную цель</p>
        </div>

        <div className="space-y-3">
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              onClick={() => setSelected(o.value)}
              className={[
                'w-full text-left px-4 py-4 rounded-xl border-2 transition-all flex items-center justify-between',
                selected === o.value ? 'border-sky-500 bg-sky-50' : 'border-gray-200 bg-white hover:border-gray-300',
              ].join(' ')}
            >
              <div>
                <div className="font-semibold text-gray-900">{o.label}</div>
                <div className="text-sm text-gray-500">{o.desc}</div>
              </div>
              {selected === o.value && (
                <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center">
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
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-xl transition-colors"
        >
          Продолжить →
        </button>
      </div>
    </div>
  )
}
