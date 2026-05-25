import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { step, ...data } = body

    const session = await getServerSession(authOptions)

    if (session?.user && (session.user as { id?: string }).id) {
      const uid = (session.user as { id: string }).id
      const db = supabaseAdmin()

      if (step === 'goal') {
        await db.from('users').update({ onboarding_goal: data.goal }).eq('id', uid)
      }
      if (step === 'level') {
        await db.from('users').update({ level: data.level }).eq('id', uid)
      }
      if (step === 'complete') {
        await db.from('users').update({ onboarding_completed: true }).eq('id', uid)
      }
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
