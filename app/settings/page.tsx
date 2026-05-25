'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
const MINUTES = [5, 10, 15, 20, 30, 45, 60]

export default function SettingsPage() {
  const { status } = useSession()
  const router = useRouter()

  const [level, setLevel] = useState('B1')
  const [daily, setDaily] = useState(10)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return

    fetch('/api/user')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load settings')
        return r.json()
      })
      .then((data) => {
        setLevel(data.user?.level ?? 'B1')
        setDaily(data.user?.daily_minutes ?? 10)
      })
      .catch(() => setError('Не удалось загрузить настройки'))
      .finally(() => setLoading(false))
  }, [status])

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setError('')

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, daily_minutes: daily }),
      })

      if (!response.ok) throw new Error('Failed to save settings')

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Не удалось сохранить настройки')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Назад
        </button>
        <div className="font-semibold text-gray-900">Настройки</div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <div>
            <div className="font-semibold text-gray-900">Уровень английского</div>
            <div className="text-sm text-gray-500 mt-0.5">Влияет на сложность диалогов</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={[
                  'px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-all',
                  level === l
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300',
                ].join(' ')}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3">
          <div>
            <div className="font-semibold text-gray-900">Цель в день</div>
            <div className="text-sm text-gray-500 mt-0.5">Сколько минут хочешь заниматься</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {MINUTES.map((m) => (
              <button
                key={m}
                onClick={() => setDaily(m)}
                className={[
                  'px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-all',
                  daily === m
                    ? 'border-sky-500 bg-sky-50 text-sky-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300',
                ].join(' ')}
              >
                {m} мин
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white font-semibold py-4 rounded-xl transition-colors"
        >
          {saving ? 'Сохраняем...' : saved ? '✓ Сохранено!' : 'Сохранить'}
        </button>
      </main>
    </div>
  )
}
