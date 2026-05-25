'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const QUESTIONS = [
  {
    text: 'Which sentence is correct?',
    options: [
      'I am going to the airport yesterday.',
      'I went to the airport yesterday.',
      'I go to the airport yesterday.',
    ],
    correct: 1,
  },
  {
    text: 'Complete: "By the time we arrived, the flight ___ already."',
    options: [
      'departed',
      'has departed',
      'had departed',
    ],
    correct: 2,
  },
  {
    text: 'What does "check in" mean at a hotel?',
    options: [
      'Pay the bill and leave',
      'Register upon arrival',
      'Check the room for problems',
    ],
    correct: 1,
  },
  {
    text: 'How do you politely order food?',
    options: [
      'Give me the pasta.',
      "I'd like the pasta, please.",
      'I want pasta now.',
    ],
    correct: 1,
  },
  {
    text: 'Choose the correct passive form:',
    options: [
      'The luggage was lost at the airport.',
      'The luggage lost at the airport.',
      'The luggage has lose at the airport.',
    ],
    correct: 0,
  },
]

export default function TestPage() {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [scores, setScores] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const q = QUESTIONS[current]
  const isLast = current === QUESTIONS.length - 1

  const pick = (idx: number) => {
    if (showFeedback) return
    setSelected(idx)
    setShowFeedback(true)
  }

  const next = () => {
    const newScore = scores + (selected === q.correct ? 1 : 0)
    if (isLast) {
      const level = newScore >= 3 ? 'B2' : 'B1'
      localStorage.setItem('onboarding_level', level)
      fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'level', level }),
      }).catch(() => {})
      router.push('/onboarding/daily')
    } else {
      setScores(newScore)
      setCurrent((c) => c + 1)
      setSelected(null)
      setShowFeedback(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Вопрос {current + 1} / {QUESTIONS.length}</span>
            <span>Проверка уровня</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all"
              style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <p className="font-semibold text-gray-900">{q.text}</p>
          <div className="space-y-2">
            {q.options.map((opt, idx) => {
              let cls = 'w-full text-left px-4 py-3 rounded-xl border-2 text-sm transition-all '
              if (!showFeedback) {
                cls += selected === idx ? 'border-sky-500 bg-sky-50' : 'border-gray-200 bg-white hover:border-gray-300 cursor-pointer'
              } else {
                if (idx === q.correct) cls += 'border-emerald-500 bg-emerald-50 text-emerald-800'
                else if (idx === selected) cls += 'border-red-400 bg-red-50 text-red-700'
                else cls += 'border-gray-100 bg-gray-50 text-gray-400'
              }
              return (
                <button key={idx} className={cls} onClick={() => pick(idx)}>
                  {opt}
                </button>
              )
            })}
          </div>
          {showFeedback && (
            <p className={`text-sm font-medium ${selected === q.correct ? 'text-emerald-600' : 'text-red-600'}`}>
              {selected === q.correct ? '✓ Правильно!' : `✗ Правильно: "${q.options[q.correct]}"`}
            </p>
          )}
        </div>

        {showFeedback && (
          <button onClick={next} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-xl transition-colors">
            {isLast ? 'Завершить →' : 'Далее →'}
          </button>
        )}
      </div>
    </div>
  )
}
