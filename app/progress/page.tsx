'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

type UserData = {
  streak_days: number
  total_dialogs: number
  level: string
  daily_minutes: number
}

type Achievement = {
  id: string
  emoji: string
  title: string
  desc: string
  unlocked: boolean
}

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

function streakLabel(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100

  if (mod100 >= 11 && mod100 <= 14) return 'дней подряд'
  if (mod10 === 1) return 'день подряд'
  if (mod10 >= 2 && mod10 <= 4) return 'дня подряд'
  return 'дней подряд'
}

function levelAtLeast(userLevel: string, target: string): boolean {
  return LEVEL_ORDER.indexOf(userLevel) >= LEVEL_ORDER.indexOf(target)
}

function getAchievements(data: UserData): Achievement[] {
  return [
    {
      id: 'first-dialog',
      emoji: '🎯',
      title: 'Первый диалог',
      desc: 'Завершил первый диалог с AI',
      unlocked: data.total_dialogs >= 1,
    },
    {
      id: 'five-dialogs',
      emoji: '🔥',
      title: 'Пять диалогов',
      desc: 'Завершил 5 диалогов',
      unlocked: data.total_dialogs >= 5,
    },
    {
      id: 'ten-dialogs',
      emoji: '💪',
      title: 'Десять диалогов',
      desc: 'Завершил 10 диалогов',
      unlocked: data.total_dialogs >= 10,
    },
    {
      id: 'streak-3',
      emoji: '📅',
      title: '3 дня подряд',
      desc: 'Практиковался 3 дня без перерыва',
      unlocked: data.streak_days >= 3,
    },
    {
      id: 'streak-7',
      emoji: '⚡',
      title: 'Неделя подряд',
      desc: '7 дней без перерыва',
      unlocked: data.streak_days >= 7,
    },
    {
      id: 'level-b2',
      emoji: '🎓',
      title: 'Уровень B2',
      desc: 'Достиг уровня B2',
      unlocked: levelAtLeast(data.level, 'B2'),
    },
  ]
}

export default function ProgressPage() {
  const { status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return

    fetch('/api/user')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load user')
        return r.json()
      })
      .then((data) => {
        setUserData({
          streak_days: data.progress?.streak_days ?? 0,
          total_dialogs: data.progress?.total_dialogs ?? 0,
          level: data.user?.level ?? 'B1',
          daily_minutes: data.user?.daily_minutes ?? 10,
        })
      })
      .catch(() => {
        setUserData({ streak_days: 0, total_dialogs: 0, level: 'B1', daily_minutes: 10 })
      })
      .finally(() => setLoading(false))
  }, [status])

  if (loading || !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    )
  }

  const achievements = getAchievements(userData)
  const unlocked = achievements.filter((a) => a.unlocked).length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Назад
        </button>
        <div className="font-semibold text-gray-900">Прогресс</div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-sky-500 rounded-2xl p-4 text-white">
            <div className="text-3xl font-bold">{userData.streak_days}</div>
            <div className="text-sky-100 text-sm mt-0.5">{streakLabel(userData.streak_days)}</div>
            <div className="text-2xl mt-2">🔥</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{userData.total_dialogs}</div>
            <div className="text-gray-500 text-sm mt-0.5">диалогов всего</div>
            <div className="text-2xl mt-2">💬</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{userData.level}</div>
            <div className="text-gray-500 text-sm mt-0.5">твой уровень</div>
            <div className="text-2xl mt-2">🎓</div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{userData.daily_minutes}</div>
            <div className="text-gray-500 text-sm mt-0.5">минут в день</div>
            <div className="text-2xl mt-2">⏱️</div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Достижения</h2>
            <span className="text-sm text-gray-400">{unlocked} / {achievements.length}</span>
          </div>

          <div className="space-y-2">
            {achievements.map((a) => (
              <div
                key={a.id}
                className={[
                  'bg-white rounded-2xl border px-4 py-3 flex items-center gap-3 transition-all',
                  a.unlocked ? 'border-gray-200' : 'border-gray-100 opacity-50',
                ].join(' ')}
              >
                <div className={[
                  'w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0',
                  a.unlocked ? 'bg-sky-100' : 'bg-gray-100',
                ].join(' ')}>
                  {a.unlocked ? a.emoji : '🔒'}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{a.title}</div>
                  <div className="text-xs text-gray-500">{a.desc}</div>
                </div>
                {a.unlocked && (
                  <div className="ml-auto text-emerald-500 text-lg">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {userData.total_dialogs === 0 && (
          <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 text-center space-y-3">
            <p className="text-gray-700 font-medium">Начни первый диалог!</p>
            <p className="text-sm text-gray-500">Пройди практику чтобы разблокировать достижения</p>
            <button
              onClick={() => router.push('/practice')}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors text-sm"
            >
              Начать практику →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
