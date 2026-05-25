'use client'

import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-emerald-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-8">
        <div>
          <div className="text-5xl font-bold text-emerald-600">Alvorada</div>
          <div className="text-xs tracking-widest text-sky-500 mt-2">V . I . N</div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">Добро пожаловать!</h1>
          <p className="text-gray-500 leading-relaxed">
            Учи английский через живые диалоги в реальных ситуациях — аэропорт, отель, ресторан.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {['✈️ Аэропорт', '🏨 Отель', '🍽️ Ресторан', '🗣️ AI-практика'].map((tag) => (
            <span key={tag} className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm border border-gray-100">
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={() => router.push('/onboarding/goal')}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-xl transition-colors text-lg"
        >
          Начать →
        </button>

        <p className="text-sm text-gray-400">
          Уже есть аккаунт?{' '}
          <button onClick={() => router.push('/login')} className="text-sky-500 hover:underline">
            Войти
          </button>
        </p>
      </div>
    </div>
  )
}
