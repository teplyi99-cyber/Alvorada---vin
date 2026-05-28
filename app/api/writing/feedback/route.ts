import { NextRequest, NextResponse } from 'next/server'
import { qwenChat, type QwenMessage } from '@/lib/qwen'
import { WRITING_TASKS } from '@/app/writing/data'

export type WritingCorrection = {
  original: string
  corrected: string
  explanation_ru: string
}

export type WritingFeedback = {
  score: number
  corrected_text: string
  natural_version: string
  corrections: WritingCorrection[]
  positive_ru: string
  suggestion_ru: string
}

type WritingFeedbackRequest = {
  taskId?: string
  userText?: string
}

function cleanJson(raw: string) {
  return raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim()
}

function normalizeFeedback(value: Partial<WritingFeedback>, userText: string): WritingFeedback {
  const score = Number(value.score)

  return {
    score: Number.isFinite(score) ? Math.min(5, Math.max(1, Math.round(score))) : 3,
    corrected_text: value.corrected_text?.trim() || userText,
    natural_version: value.natural_version?.trim() || value.corrected_text?.trim() || userText,
    corrections: Array.isArray(value.corrections)
      ? value.corrections
          .filter((item) => item?.original && item?.corrected && item?.explanation_ru)
          .slice(0, 5)
      : [],
    positive_ru: value.positive_ru?.trim() || 'Хорошая попытка: мысль понятна.',
    suggestion_ru:
      value.suggestion_ru?.trim() ||
      'Попробуй сделать текст чуть конкретнее и проверить порядок слов.',
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as WritingFeedbackRequest
    const task = WRITING_TASKS.find((item) => item.id === body.taskId)
    const userText = body.userText?.trim() ?? ''

    if (!task) {
      return NextResponse.json({ error: 'Writing task not found' }, { status: 404 })
    }

    if (userText.length < 5) {
      return NextResponse.json({ error: 'Text is too short' }, { status: 400 })
    }

    const messages: QwenMessage[] = [
      {
        role: 'system',
        content: `You are an English teacher for a Russian-speaking B1/B2 learner.
Check the user's writing for the given travel task.
Be practical, kind, and concise.
Return ONLY valid JSON with this exact shape:
{
  "score": 1,
  "corrected_text": "corrected version of the user's text",
  "natural_version": "a more natural but still simple B1/B2 version",
  "corrections": [
    {"original": "short incorrect phrase", "corrected": "better phrase", "explanation_ru": "short Russian explanation"}
  ],
  "positive_ru": "one short positive comment in Russian",
  "suggestion_ru": "one short next-step suggestion in Russian"
}
Score must be an integer from 1 to 5. Limit corrections to the 5 most useful items.`,
      },
      {
        role: 'user',
        content: `Task type: ${task.type}
Topic: ${task.topic}
Task: ${task.prompt}
Context: ${task.context}
Expected length: ${task.minWords}-${task.maxWords} words

User text:
${userText}`,
      },
    ]

    const raw = await qwenChat(messages, {
      model: 'qwen-turbo',
      temperature: 0.2,
      max_tokens: 900,
    })

    const parsed = JSON.parse(cleanJson(raw)) as Partial<WritingFeedback>
    const feedback = normalizeFeedback(parsed, userText)

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error('Writing feedback failed:', error)
    return NextResponse.json(
      { error: 'Could not check this text right now. Please try again.' },
      { status: 500 },
    )
  }
}
