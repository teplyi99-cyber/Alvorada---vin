'use client'

import { useRouter } from 'next/navigation'
import { SCENARIOS } from './data'

export default function ScenariosPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Назад
        </button>
        <div>
          <div className="font-semibold text-gray-900">Сценарии</div>
          <div className="text-xs text-gray-400">Выбери тему для практики</div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-3">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            onClick={() => s.ready ? router.push(`/scenarios/${s.id}`) : null}
            className={[
              'w-full text-left bg-white rounded-2xl border transition-all px-5 py-4 flex items-center gap-4',
              s.ready
                ? 'border-gray-200 hover:border-sky-400 hover:shadow-sm cursor-pointer'
                : 'border-gray-100 opacity-60 cursor-default',
            ].join(' ')}
          >
            <span className="text-3xl shrink-0">{s.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{s.titleRu}</span>
                {!s.ready && (
                  <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                    скоро
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-0.5">{s.description}</div>
              {s.ready && (
                <div className="text-xs text-sky-500 mt-1">
                  {s.dialogs.length} диалогов · {s.character}
                </div>
              )}
            </div>
            {s.ready && (
              <span className="text-gray-400 text-lg shrink-0">→</span>
            )}
          </button>
        ))}
      </main>
    </div>
  )
}
