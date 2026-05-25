'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const MODULES = [
  { emoji: '🗣️', title: 'Практика',  desc: 'AI-диалог с тьютором',      href: '/practice',   ready: false },
  { emoji: '✈️', title: 'Сценарии',  desc: 'Аэропорт, отель, ресторан', href: '/scenarios',  ready: false },
  { emoji: '📚', title: 'Словарь',   desc: 'Интервальные повторения',    href: '/vocabulary', ready: false },
  { emoji: '🎧', title: 'Аудио',     desc: 'Диалоги с транскриптом',     href: '/listening',  ready: false },
]

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    )
  }

  const name = session?.user?.name?.split(' ')[0] ?? ''

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <div className="font-bold text-emerald-600">
          Alvorada <span className="text-xs tracking-widest text-sky-500 font-normal">V.I.N</span>
        </div>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="text-sm text-gray-500 hover:text-gray-900">
          Выход
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {name ? `Привет, ${name}! 👋` : 'Добро пожаловать! 👋'}
          </h1>
          <p className="text-gray-500 mt-1">Готов к практике сегодня?</p>
        </div>

        <div className="bg-sky-500 rounded-2xl p-5 text-white flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">0</div>
            <div className="text-sky-100 text-sm">дней подряд</div>
            <p className="text-sky-100 text-xs mt-1">Начни первую сессию!</p>
          </div>
          <div className="text-5xl">🔥</div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-600 text-sm mb-3 uppercase tracking-wide">Разделы</h2>
          <div className="grid grid-cols-2 gap-3">
            {MODULES.map((m) => (
              <div
                key={m.title}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative"
              >
                <div className="text-2xl mb-2">{m.emoji}</div>
                <div className="font-semibold text-gray-900 text-sm">{m.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{m.desc}</div>
                <span className="absolute top-2 right-2 text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
                  скоро
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">{session?.user?.email}</p>
      </main>
    </div>
  )
}
