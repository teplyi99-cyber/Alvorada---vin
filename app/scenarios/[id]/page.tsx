'use client'

import { useRouter, useParams } from 'next/navigation'
import { SCENARIOS, difficultyLabel, difficultyColor } from '../data'

export default function ScenarioPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const scenario = SCENARIOS.find((s) => s.id === id)

  if (!scenario) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="text-4xl">🤷</div>
          <p className="text-gray-500">Сценарий не найден</p>
          <button
            onClick={() => router.push('/scenarios')}
            className="text-sky-500 hover:underline text-sm"
          >
            ← Назад к сценариям
          </button>
        </div>
      </div>
    )
  }

  const handleStart = (dialogId: string) => {
    // Передаём сценарий и диалог в практику через URL параметры
    router.push(`/practice?scenario=${scenario.id}&dialog=${dialogId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => router.push('/scenarios')}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Назад
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{scenario.emoji}</span>
          <div>
            <div className="font-semibold text-gray-900">{scenario.titleRu}</div>
            <div className="text-xs text-gray-400">{scenario.character}</div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-3">
        <p className="text-sm text-gray-500 pb-2">
          Выбери диалог для практики:
        </p>

        {scenario.dialogs.map((dialog, index) => (
          <button
            key={dialog.id}
            onClick={() => handleStart(dialog.id)}
            className="w-full text-left bg-white rounded-2xl border border-gray-200 hover:border-sky-400 hover:shadow-sm transition-all px-5 py-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{dialog.titleRu}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColor[dialog.difficulty]}`}>
                    {difficultyLabel[dialog.difficulty]}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{dialog.description}</div>
              </div>
              <span className="text-gray-400 text-lg shrink-0 mt-0.5">→</span>
            </div>
          </button>
        ))}
      </main>
    </div>
  )
}
