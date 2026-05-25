import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { supabaseAdmin } from '@/lib/supabase'

// POST /api/user/activity — вызывается после каждой практики
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()
  const today = new Date().toISOString().split('T')[0]

  const { data: user } = await db
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const { data: progress } = await db
    .from('user_progress')
    .select('id, streak_days, last_active_date, total_dialogs')
    .eq('user_id', user.id)
    .single()

  if (!progress) {
    await db.from('user_progress').insert({
      user_id: user.id,
      streak_days: 1,
      last_active_date: today,
      total_dialogs: 1,
    })
    return NextResponse.json({ streak_days: 1 })
  }

  const lastActive = progress.last_active_date
  let newStreak = progress.streak_days ?? 0

  if (lastActive === today) {
    // Уже практиковался сегодня — streak не меняем
    return NextResponse.json({ streak_days: newStreak })
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  if (lastActive === yesterdayStr) {
    // Практиковался вчера — продолжаем streak
    newStreak += 1
  } else {
    // Пропустил — начинаем заново
    newStreak = 1
  }

  await db
    .from('user_progress')
    .update({
      streak_days: newStreak,
      last_active_date: today,
      total_dialogs: (progress.total_dialogs ?? 0) + 1,
    })
    .eq('id', progress.id)

  return NextResponse.json({ streak_days: newStreak })
}
