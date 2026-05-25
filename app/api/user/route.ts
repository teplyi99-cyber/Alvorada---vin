import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()

  const { data: user, error: userError } = await db
    .from('users')
    .select('id, level, daily_minutes')
    .eq('email', session.user.email)
    .single()

  if (userError || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const { data: progress } = await db
    .from('user_progress')
    .select('streak_days, total_dialogs')
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json({
    user: {
      level: user.level,
      daily_minutes: user.daily_minutes,
    },
    progress: progress ?? {
      streak_days: 0,
      total_dialogs: 0,
    },
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const level = typeof body.level === 'string' ? body.level : undefined
  const dailyMinutes = Number(body.daily_minutes)

  if (!level || !['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(level)) {
    return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
  }

  if (!Number.isInteger(dailyMinutes) || dailyMinutes < 1 || dailyMinutes > 240) {
    return NextResponse.json({ error: 'Invalid daily_minutes' }, { status: 400 })
  }

  const db = supabaseAdmin()
  const { data: user, error } = await db
    .from('users')
    .update({ level, daily_minutes: dailyMinutes })
    .eq('email', session.user.email)
    .select('level, daily_minutes')
    .single()

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ user })
}
