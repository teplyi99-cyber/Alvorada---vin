'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const MODULES = [
  { emoji: '🗣️', title: 'Практика', desc: 'AI-диалог с тьютором', href: '/practice', ready: true },
  { emoji: '✈️', title: 'Сценарии', desc: 'Аэропорт, отель, ресторан', href: '/scenarios', ready: true },
  { emoji: '📚', title: 'Словарь', desc: 'Интервальные повторения', href: '/vocabulary', ready: true },
  { emoji: '🎧', title: 'Аудио', desc: 'Диалоги с транскриптом', href: '/listening', ready: true },
  { emoji: '📊', title: 'Прогресс', desc: 'Статистика и достижения', href: '/progress', ready: true },
  { emoji: '⚙️', title: 'Настройки', desc: 'Уровень и цели', href: '/settings', ready: true },
]

type UserData = {
  streak_days: number
  total_dialogs: number
  level: string
  daily_minutes: number
}

function streakLabel(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100

  if (mod100 >= 11 && mod100 <= 14) return 'дней подряд'
  if (mod10 === 1) return 'день подряд'
  if (mod10 >= 2 && mod10 <= 4) return 'дня подряд'
  return 'дней подряд'
}

function dialogsLabel(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100

  if (mod100 >= 11 && mod100 <= 14) return 'диалогов'
  if (mod10 === 1) return 'диалог'
  if (mod10 >= 2 && mod10 <= 4) return 'диалога'
  return 'диалогов'
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return

    fetch('/api/user')
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUserData({
            streak_days: data.progress?.streak_days ?? 0,
            total_dialogs: data.progress?.total_dialogs ?? 0,
            level: data.user.level ?? 'B1',
            daily_minutes: data.user.daily_minutes ?? 10,
          })
        }
      })
      .catch(() => {})
  }, [status])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    )
  }

  const name = session?.user?.name?.split(' ')[0] ?? ''
  const streak = userData?.streak_days ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
        <div className="font-bold text-emerald-600">
          Alvorada <span className="text-xs tracking-widest text-sky-500 font-normal">V.I.N</span>
        </div>
        <div className="flex items-center gap-3">
          {userData && (
            <span className="text-xs bg-sky-100 text-sky-600 px-2 py-1 rounded-full">
              {userData.level}
            </span>
          )}
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Выход
          </button>
        </div>
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
            <div className="text-3xl font-bold">{streak}</div>
            <div className="text-sky-100 text-sm">{streakLabel(streak)}</div>
            <p className="text-sky-100 text-xs mt-1">
              {streak === 0 ? 'Начни первую сессию!' : 'Отличная серия, продолжай!'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl">{streak >= 7 ? '⚡' : '🔥'}</div>
            {userData && (
              <div className="text-sky-100 text-xs mt-1">
                {userData.total_dialogs} {dialogsLabel(userData.total_dialogs)}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-gray-600 text-sm mb-3 uppercase tracking-wide">
            Разделы
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {MODULES.map((m) => (
              <button
                key={m.title}
                onClick={() => m.ready ? router.push(m.href) : null}
                className={[
                  'bg-white rounded-2xl p-4 shadow-sm border text-left relative transition-all',
                  m.ready
                    ? 'border-gray-200 hover:border-sky-400 hover:shadow-md cursor-pointer'
                    : 'border-gray-100 cursor-default opacity-70',
                ].join(' ')}
              >
                <div className="text-2xl mb-2">{m.emoji}</div>
                <div className="font-semibold text-gray-900 text-sm">{m.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{m.desc}</div>
                {!m.ready && (
                  <span className="absolute top-2 right-2 text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">
                    скоро
                  </span>
                )}
                {m.ready && (
                  <span className="absolute top-2 right-2 text-xs bg-sky-100 text-sky-600 px-1.5 py-0.5 rounded-full">
                    ●
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">{session?.user?.email}</p>
      </main>
    </div>
  )
}
