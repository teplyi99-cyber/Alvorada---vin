'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LISTENING_DIALOGS, type ListeningDialog } from './data'

type AnswerMap = Record<number, string>

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function getPreferredEnglishVoice(voices: SpeechSynthesisVoice[]) {
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'))
  const preferredNames = ['google uk english', 'google us english', 'microsoft zira', 'microsoft david', 'microsoft mark']

  return (
    englishVoices.find((voice) => preferredNames.some((name) => voice.name.toLowerCase().includes(name))) ??
    englishVoices.find((voice) => voice.lang.toLowerCase() === 'en-gb') ??
    englishVoices.find((voice) => voice.lang.toLowerCase() === 'en-us') ??
    englishVoices[0] ??
    null
  )
}

function DialogPicker({ onSelect }: { onSelect: (dialog: ListeningDialog) => void }) {
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
              <div className="text-sm text-gray-500">{dialog.parts.length} части · {dialog.lines.length} реплик</div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        ))}
      </main>
    </div>
  )
}

function ListeningScreen({ dialog, onBack }: { dialog: ListeningDialog; onBack: () => void }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoiceName, setSelectedVoiceName] = useState('')
  const [rate, setRate] = useState(0.9)
  const [playing, setPlaying] = useState(false)
  const [currentLine, setCurrentLine] = useState(-1)
  const [currentPart, setCurrentPart] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [showTranscript, setShowTranscript] = useState(false)
  const [summary, setSummary] = useState('')
  const [completed, setCompleted] = useState(false)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  useEffect(() => {
    if (!ttsSupported) return

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices()
      setVoices(availableVoices)

      const preferred = getPreferredEnglishVoice(availableVoices)
      if (preferred) setSelectedVoiceName((current) => current || preferred.name)
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
      window.speechSynthesis.onvoiceschanged = null
      window.speechSynthesis.cancel()
    }
  }, [ttsSupported])

  const englishVoices = useMemo(
    () => voices.filter((voice) => voice.lang.toLowerCase().startsWith('en')),
    [voices],
  )

  const selectedVoice = useMemo(
    () => voices.find((voice) => voice.name === selectedVoiceName) ?? getPreferredEnglishVoice(voices),
    [selectedVoiceName, voices],
  )

  const part = dialog.parts[currentPart]
  const correctAnswers = Object.entries(answers).filter(([index, answer]) => {
    const question = dialog.parts[Number(index)]?.question
    return question && normalize(answer) === normalize(question.answer)
  }).length

  const stop = () => {
    if (ttsSupported) window.speechSynthesis.cancel()
    setPlaying(false)
    setCurrentLine(-1)
  }

  const speakLineIndexes = (lineIndexes: number[]) => {
    if (!ttsSupported || !selectedVoice) return

    window.speechSynthesis.cancel()
    setPlaying(true)

    const speakNext = (position: number) => {
      const lineIndex = lineIndexes[position]

      if (lineIndex === undefined) {
        setPlaying(false)
        setCurrentLine(-1)
        return
      }

      const line = dialog.lines[lineIndex]
      const utterance = new SpeechSynthesisUtterance(`${line.speaker} says: ${line.audioText ?? line.text}`)
      utterance.voice = selectedVoice
      utterance.lang = selectedVoice.lang
      utterance.rate = rate
      utterance.pitch = line.speaker === 'Agent' || line.speaker === 'Receptionist' || line.speaker === 'Waiter' ? 1.05 : 0.95
      utterance.onstart = () => setCurrentLine(lineIndex)
      utterance.onend = () => speakNext(position + 1)

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    }

    speakNext(0)
  }

  const chooseAnswer = (answer: string) => {
    setAnswers((current) => ({ ...current, [currentPart]: answer }))
  }

  const resetDialog = () => {
    stop()
    setCurrentPart(0)
    setAnswers({})
    setShowTranscript(false)
    setSummary('')
    setCompleted(false)
  }

  const allPartsAnswered = dialog.parts.every((_, index) => answers[index])

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-700">
            ← Назад
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{dialog.emoji}</span>
            <div className="font-semibold text-gray-900 text-sm">Итог аудирования</div>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-3">
            <div className="text-5xl">✅</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Упражнение завершено</h1>
              <p className="text-sm text-gray-500 mt-1">
                Правильных ответов: {correctAnswers} из {dialog.parts.length}
              </p>
            </div>
          </section>

          {summary.trim() && (
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
              <div className="text-sm font-semibold text-gray-900">Твой пересказ</div>
              <div className="text-sm text-gray-700 leading-relaxed">{summary}</div>
            </section>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={resetDialog}
              className="bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors text-sm"
            >
              Повторить
            </button>
            <button
              onClick={onBack}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Другой диалог
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button
          onClick={() => {
            stop()
            onBack()
          }}
          className="text-gray-400 hover:text-gray-700"
        >
          ← Назад
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{dialog.emoji}</span>
          <div className="font-semibold text-gray-900 text-sm">{dialog.titleRu}</div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-400">Voice</div>
              <div className="font-semibold text-gray-900 text-sm">
                {selectedVoice ? `${selectedVoice.name} (${selectedVoice.lang})` : 'English voice not found'}
              </div>
            </div>
            <button
              onClick={() => speakLineIndexes([part.lineIndexes[0]])}
              disabled={!selectedVoice || playing}
              className="text-xs bg-sky-100 text-sky-600 disabled:text-gray-400 disabled:bg-gray-100 px-3 py-2 rounded-lg font-medium"
            >
              Тест голоса
            </button>
          </div>

          {!selectedVoice && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">
              Для качественного аудио нужен английский голос в Chrome/Edge или в системе.
            </div>
          )}

          {englishVoices.length > 0 && (
            <select
              value={selectedVoiceName}
              onChange={(event) => setSelectedVoiceName(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-sky-400"
            >
              {englishVoices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Скорость</span>
            {[0.75, 0.9, 1].map((value) => (
              <button
                key={value}
                onClick={() => setRate(value)}
                className={[
                  'px-3 py-1.5 rounded-lg text-xs font-medium border',
                  rate === value ? 'bg-sky-500 text-white border-sky-500' : 'bg-white text-gray-600 border-gray-200',
                ].join(' ')}
              >
                {value}x
              </button>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Часть {currentPart + 1} из {dialog.parts.length}</div>
              <div className="font-semibold text-gray-900">{part.title}</div>
            </div>
            <div className="text-3xl">{playing ? '🔊' : '🎧'}</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {!playing ? (
              <button
                onClick={() => speakLineIndexes(part.lineIndexes)}
                disabled={!selectedVoice}
                className="bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Слушать часть
              </button>
            ) : (
              <button
                onClick={stop}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                Стоп
              </button>
            )}
            <button
              onClick={() => speakLineIndexes(dialog.lines.map((_, index) => index))}
              disabled={!selectedVoice || playing}
              className="bg-white border border-gray-200 text-gray-700 disabled:text-gray-400 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors text-sm"
            >
              Весь диалог
            </button>
          </div>

          {currentLine >= 0 && (
            <div className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-sm">
              <span className="text-sky-600 font-medium">{dialog.lines[currentLine]?.speaker}: </span>
              <span className="text-gray-700">{dialog.lines[currentLine]?.text}</span>
            </div>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <div className="font-semibold text-gray-900 text-sm">{part.question.question}</div>
          <div className="space-y-2">
            {part.question.options.map((option) => {
              const selected = answers[currentPart] === option
              const answered = Boolean(answers[currentPart])
              const correct = option === part.question.answer

              return (
                <button
                  key={option}
                  onClick={() => chooseAnswer(option)}
                  className={[
                    'w-full text-left rounded-xl border px-4 py-3 text-sm transition-colors',
                    selected && correct ? 'bg-emerald-50 border-emerald-300 text-emerald-700' :
                    selected && !correct ? 'bg-red-50 border-red-300 text-red-700' :
                    answered && correct ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                    'bg-white border-gray-200 text-gray-700 hover:border-sky-300',
                  ].join(' ')}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {answers[currentPart] && (
            <div className="text-sm text-gray-500">
              {normalize(answers[currentPart]) === normalize(part.question.answer)
                ? 'Верно. Можно идти дальше.'
                : `Правильный ответ: ${part.question.answer}`}
            </div>
          )}
        </section>

        <div className="flex gap-3">
          <button
            onClick={() => {
              stop()
              setCurrentPart((value) => Math.max(0, value - 1))
            }}
            disabled={currentPart === 0}
            className="flex-1 bg-white border border-gray-200 text-gray-700 disabled:text-gray-300 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors text-sm"
          >
            ← Назад
          </button>
          <button
            onClick={() => {
              stop()
              setCurrentPart((value) => Math.min(dialog.parts.length - 1, value + 1))
            }}
            disabled={currentPart === dialog.parts.length - 1}
            className="flex-1 bg-white border border-gray-200 text-gray-700 disabled:text-gray-300 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors text-sm"
          >
            Дальше →
          </button>
        </div>

        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="text-sm text-sky-500 hover:underline w-full text-center"
        >
          {showTranscript ? 'Скрыть транскрипт' : 'Показать транскрипт'}
        </button>

        {showTranscript && (
          <section className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            {dialog.lines.map((line, index) => (
              <div key={index} className={`text-sm ${index === currentLine ? 'text-sky-600 font-medium' : 'text-gray-700'}`}>
                <span className="text-gray-400">{line.speaker}: </span>
                {line.text}
              </div>
            ))}
          </section>
        )}

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <div>
            <div className="font-semibold text-gray-900">Финальный пересказ</div>
            <div className="text-xs text-gray-500 mt-1">{dialog.task}</div>
          </div>
          <textarea
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Напиши по-русски, что понял из диалога..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-sky-400 resize-none"
          />
          <div className="bg-gray-50 rounded-xl border border-gray-100 px-4 py-3 text-sm text-gray-600">
            Результат: {correctAnswers} из {dialog.parts.length} вопросов. Ответь на вопросы во всех частях, затем заверши упражнение.
          </div>
          {!allPartsAnswered && (
            <div className="text-xs text-amber-600">
              Осталось ответить на вопросы: {dialog.parts.length - Object.keys(answers).length}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={resetDialog}
              className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:border-gray-300 transition-colors text-sm"
            >
              Сбросить
            </button>
            <button
              onClick={() => {
                stop()
                setCompleted(true)
              }}
              disabled={!allPartsAnswered}
              className="flex-1 bg-sky-500 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Завершить упражнение
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function ListeningPage() {
  const [dialog, setDialog] = useState<ListeningDialog | null>(null)

  if (!dialog) return <DialogPicker onSelect={setDialog} />

  return <ListeningScreen dialog={dialog} onBack={() => setDialog(null)} />
}
