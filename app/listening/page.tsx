'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LISTENING_DIALOGS, type ListeningDialog } from './data'

// ─── Topic picker ─────────────────────────────────────────────────────────────

function DialogPicker({ onSelect }: { onSelect: (d: ListeningDialog) => void }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-700">
          ← Назад
        </button>
        <div className="font-semibold text-gray-900">Аудирование</div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-3">
        <p className="text-sm text-gray-500 pb-1">Выбери диалог для прослушивания:</p>

        {LISTENING_DIALOGS.map((dialog) => (
          <button
            key={dialog.id}
            onClick={() => onSelect(dialog)}
            className="w-full text-left bg-white rounded-2xl border border-gray-200 hover:border-sky-400 hover:shadow-sm transition-all px-5 py-4 flex items-center gap-4"
          >
            <span className="text-3xl">{dialog.emoji}</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{dialog.titleRu}</div>
              <div className="text-sm text-gray-500">{dialog.lines.length} реплик</div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        ))}
      </main>
    </div>
  )
}

// ─── Player + Task ────────────────────────────────────────────────────────────

function ListeningScreen({
  dialog,
  onBack,
}: {
  dialog: ListeningDialog
  onBack: () => void
}) {
  const [playing, setPlaying] = useState(false)
  const [currentLine, setCurrentLine] = useState(-1)
  const [showTranscript, setShowTranscript] = useState(false)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState<'listen' | 'task' | 'result'>('listen')
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Проверяем поддержку TTS
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const speak = () => {
    if (!ttsSupported) return
    window.speechSynthesis.cancel()
    setPlaying(true)
    setCurrentLine(0)

    const speakLine = (index: number) => {
      if (index >= dialog.lines.length) {
        setPlaying(false)
        setCurrentLine(-1)
        return
      }

      const line = dialog.lines[index]
      const utterance = new SpeechSynthesisUtterance(
        `${line.speaker} says: ${line.text}`
      )
      utterance.lang = 'en-GB'
      utterance.rate = 0.85
      utterance.pitch = line.speaker === 'Agent' || line.speaker === 'Receptionist' || line.speaker === 'Waiter'
        ? 1.1 : 0.9

      utterance.onstart = () => setCurrentLine(index)
      utterance.onend = () => speakLine(index + 1)

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }

    speakLine(0)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setPlaying(false)
    setCurrentLine(-1)
  }

  const handleSubmit = async () => {
    if (!answer.trim()) return
    setLoading(true)

    try {
      const transcript = dialog.lines
        .map((l) => `${l.speaker}: ${l.text}`)
        .join('\n')

      const prompt = `You are an English teacher. A student listened to this dialogue:

${transcript}

The task was: "${dialog.task}"

The student wrote this response: "${answer}"

Evaluate if the student understood the main points of the dialogue.
Respond in Russian only. Be encouraging. Max 3 sentences.
Start with ✓ if they understood well, or with → if they missed something important.`

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: dialog.topic,
          history: [],
          userMessage: prompt,
        }),
      })

      const data = await res.json()
      setFeedback(data.reply || 'Хорошая попытка!')
      setPhase('result')
    } catch {
      setFeedback('Не удалось получить оценку. Попробуй ещё раз.')
      setPhase('result')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-700">
          ← Назад
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{dialog.emoji}</span>
          <div className="font-semibold text-gray-900 text-sm">{dialog.titleRu}</div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">

        {/* Плеер */}
        {phase === 'listen' && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-4">
              <div className="text-5xl">{playing ? '🔊' : '🎧'}</div>
              <div>
                <div className="font-semibold text-gray-900">{dialog.title}</div>
                <div className="text-sm text-gray-500 mt-1">{dialog.lines.length} реплик · English</div>
              </div>

              {!ttsSupported && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
                  ⚠️ Аудио работает только в Chrome/Edge
                </div>
              )}

              {ttsSupported && (
                <div className="flex gap-3 justify-center">
                  {!playing ? (
                    <button
                      onClick={speak}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                    >
                      ▶ Слушать
                    </button>
                  ) : (
                    <button
                      onClick={stop}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
                    >
                      ⏹ Стоп
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Текущая реплика */}
            {playing && currentLine >= 0 && (
              <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm">
                <span className="text-sky-600 font-medium">{dialog.lines[currentLine]?.speaker}: </span>
                <span className="text-gray-700">{dialog.lines[currentLine]?.text}</span>
              </div>
            )}

            {/* Транскрипт */}
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="text-sm text-sky-500 hover:underline w-full text-center"
            >
              {showTranscript ? 'Скрыть транскрипт' : 'Показать транскрипт'}
            </button>

            {showTranscript && (
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
                {dialog.lines.map((line, i) => (
                  <div key={i} className={`text-sm ${i === currentLine ? 'text-sky-600 font-medium' : 'text-gray-700'}`}>
                    <span className="text-gray-400">{line.speaker}: </span>
                    {line.text}
                  </div>
                ))}
              </div>
            )}

            {/* Кнопка перейти к заданию */}
            <button
              onClick={() => setPhase('task')}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-xl transition-colors"
            >
              Перейти к заданию →
            </button>
          </>
        )}

        {/* Задание */}
        {phase === 'task' && (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="text-sm font-medium text-amber-800 mb-1">📝 Задание:</div>
              <div className="text-sm text-amber-700">{dialog.task}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600 font-medium">
                Твой ответ на английском:
              </label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write what you understood from the dialogue..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-sky-400 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPhase('listen')}
                className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors text-sm"
              >
                ← Слушать ещё раз
              </button>
              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || loading}
                className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {loading ? 'Проверяем...' : 'Проверить →'}
              </button>
            </div>
          </>
        )}

        {/* Результат */}
        {phase === 'result' && feedback && (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <div className="font-semibold text-gray-900">Оценка:</div>
              <div className="text-gray-700 leading-relaxed">{feedback}</div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
              <div className="text-sm font-medium text-gray-500 mb-2">Твой ответ:</div>
              <div className="text-sm text-gray-700">{answer}</div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setPhase('listen')
                  setAnswer('')
                  setFeedback(null)
                  stop()
                }}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-xl transition-colors"
              >
                Попробовать ещё раз
              </button>
              <button
                onClick={onBack}
                className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors"
              >
                Выбрать другой диалог
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// ─── Page entry point ─────────────────────────────────────────────────────────

export default function ListeningPage() {
  const [dialog, setDialog] = useState<ListeningDialog | null>(null)

  if (!dialog) return <DialogPicker onSelect={setDialog} />

  return <ListeningScreen dialog={dialog} onBack={() => setDialog(null)} />
}
