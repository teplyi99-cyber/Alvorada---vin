import { NextRequest, NextResponse } from 'next/server'
import { qwenChat, QwenMessage } from '@/lib/qwen'
import { dialogPrompt, evalPrompt, ScenarioId } from '@/app/practice/prompts'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth-options'
import { supabaseAdmin } from '@/lib/supabase'

export type Feedback = {
  grammar_score: number
  speech_level: string
  correction: string
  explanation_ru: string
  positive_ru: string
}

export type ChatRequest = {
  scenario: ScenarioId
  history: { role: 'user' | 'assistant'; content: string }[]
  userMessage: string
}

export type ChatResponse = {
  reply: string
  feedback: Feedback
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json()
    const { scenario, history, userMessage } = body

    if (!scenario || !userMessage) {
      return NextResponse.json({ error: 'Missing scenario or userMessage' }, { status: 400 })
    }

    const historyStr = history
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n')

    const dialogMessages: QwenMessage[] = [
      { role: 'system', content: dialogPrompt(scenario, historyStr) },
      { role: 'user', content: userMessage },
    ]

    const evalMessages: QwenMessage[] = [
      { role: 'system', content: evalPrompt(userMessage, scenario) },
      { role: 'user', content: 'Evaluate.' },
    ]

    // Параллельно: диалог + оценка + обновление streak
    const session = await getServerSession(authOptions)

    const [reply, evalRaw] = await Promise.all([
      qwenChat(dialogMessages, { temperature: 0.8 }),
      qwenChat(evalMessages, { model: 'qwen-turbo', temperature: 0.1, max_tokens: 256 }),
    ])

    // Обновить streak если пользователь авторизован
    if (session?.user?.email) {
      try {
        const db = supabaseAdmin()
        const today = new Date().toISOString().split('T')[0]

        const { data: user } = await db
          .from('users')
          .select('id')
          .eq('email', session.user.email)
          .single()

        if (user) {
          const { data: progress } = await db
            .from('user_progress')
            .select('id, streak_days, last_active_date, total_dialogs')
            .eq('user_id', user.id)
            .single()

          if (progress && progress.last_active_date !== today) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = yesterday.toISOString().split('T')[0]

            const newStreak = progress.last_active_date === yesterdayStr
              ? (progress.streak_days ?? 0) + 1
              : 1

            await db
              .from('user_progress')
              .update({
                streak_days: newStreak,
                last_active_date: today,
                total_dialogs: (progress.total_dialogs ?? 0) + 1,
              })
              .eq('id', progress.id)
          } else if (progress) {
            await db
              .from('user_progress')
              .update({ total_dialogs: (progress.total_dialogs ?? 0) + 1 })
              .eq('id', progress.id)
          }
        }
      } catch {
        // Не критично — не ломаем чат из-за ошибки streak
      }
    }

    let feedback: Feedback
    try {
      const clean = evalRaw.replace(/```json|```/g, '').trim()
      feedback = JSON.parse(clean)
    } catch {
      feedback = {
        grammar_score: 3,
        speech_level: 'neutral',
        correction: '',
        explanation_ru: '',
        positive_ru: 'Хорошая попытка!',
      }
    }

    return NextResponse.json({ reply, feedback } satisfies ChatResponse)
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
