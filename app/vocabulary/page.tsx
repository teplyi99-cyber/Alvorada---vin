'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { WORDS, TOPICS, getOptions, type Word } from './data'

type Screen = 'topics' | 'quiz' | 'result'
type TopicId = 'airport' | 'hotel' | 'restaurant'
type TopicPack = {
  id: string
  title: string
  description: string
  words: Word[]
}

const PACK_SIZE = 10

function getTopicPacks(topicId: TopicId): TopicPack[] {
  const topicWords = WORDS.filter((word) => word.topic === topicId)

  return Array.from({ length: Math.ceil(topicWords.length / PACK_SIZE) }, (_, index) => {
    const start = index * PACK_SIZE
    const words = topicWords.slice(start, start + PACK_SIZE)

    return {
      id: `${topicId}-${index + 1}`,
      title: `Пакет ${index + 1}`,
      description: `Слова ${start + 1}-${start + words.length}`,
      words,
    }
  })
}

// ─── Topic picker ─────────────────────────────────────────────────────────────

function TopicPicker({ onSelect }: { onSelect: (topic: TopicId) => void }) {
  const router = useRouter()
  const topicList = Object.entries(TOPICS) as [TopicId, { label: string; emoji: string }][]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-700">
          ← Назад
        </button>
        <div className="font-semibold text-gray-900">Словарь</div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-3">
        <p className="text-sm text-gray-500 pb-1">Выбери тему для повторения:</p>

        {topicList.map(([id, topic]) => {
          const count = WORDS.filter((w) => w.topic === id).length
          const packCount = getTopicPacks(id).length
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="w-full text-left bg-white rounded-2xl border border-gray-200 hover:border-sky-400 hover:shadow-sm transition-all px-5 py-4 flex items-center gap-4"
            >
              <span className="text-3xl">{topic.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{topic.label}</div>
                <div className="text-sm text-gray-500">{packCount} пакета по 10 слов · всего {count}</div>
              </div>
              <span className="text-gray-400">→</span>
            </button>
          )
        })}
      </main>
    </div>
  )
}

// ─── Pack picker ──────────────────────────────────────────────────────────────

function PackPicker({
  topic,
  onSelect,
  onBack,
}: {
  topic: TopicId
  onSelect: (pack: TopicPack) => void
  onBack: () => void
}) {
  const topicMeta = TOPICS[topic]
  const packs = getTopicPacks(topic)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-700">
          ← Назад
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl">{topicMeta.emoji}</span>
          <div className="font-semibold text-gray-900">{topicMeta.label}</div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-3">
        <p className="text-sm text-gray-500 pb-1">Выбери короткий пакет из 10 слов:</p>

        {packs.map((pack) => (
          <button
            key={pack.id}
            onClick={() => onSelect(pack)}
            className="w-full text-left bg-white rounded-2xl border border-gray-200 hover:border-sky-400 hover:shadow-sm transition-all px-5 py-4 flex items-center gap-4"
          >
            <span className="text-2xl">📦</span>
            <div className="flex-1">
              <div className="font-semibold text-gray-900">{pack.title}</div>
              <div className="text-sm text-gray-500">{pack.description} · {pack.words.length} слов</div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        ))}
      </main>
    </div>
  )
}

// ─── Quiz card ────────────────────────────────────────────────────────────────

function QuizScreen({
  words,
  onFinish,
  onBack,
}: {
  words: Word[]
  onFinish: (correct: number, total: number) => void
  onBack: () => void
}) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [correct, setCorrect] = useState(0)
  const [options, setOptions] = useState<string[]>([])

  const word = words[index]
  const isLast = index === words.length - 1

  useEffect(() => {
    setOptions(getOptions(word, WORDS))
    setSelected(null)
  }, [index, word])

  const pick = (option: string) => {
    if (selected) return
    setSelected(option)
    if (option === word.translation) {
      setCorrect((c) => c + 1)
    }
  }

  const next = () => {
    if (isLast) {
      onFinish(correct + (selected === word.translation ? 1 : 0), words.length)
    } else {
      setIndex((i) => i + 1)
    }
  }

  const progress = ((index + 1) / words.length) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-700">
          ← Назад
        </button>
        <div className="flex-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-sm text-gray-400">{index + 1}/{words.length}</span>
      </header>

      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Карточка слова */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center space-y-2">
          <div className="text-3xl font-bold text-gray-900">{word.word}</div>
          <div className="text-gray-400 text-sm">{word.transcription}</div>
          <div className="text-gray-500 text-sm italic mt-3">"{word.example}"</div>
        </div>

        {/* Варианты */}
        <div className="space-y-3">
          <p className="text-sm text-gray-500 text-center">Выбери перевод:</p>
          {options.map((opt) => {
            let cls = 'w-full text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm transition-all '
            if (!selected) {
              cls += 'border-gray-200 bg-white hover:border-sky-400 cursor-pointer'
            } else if (opt === word.translation) {
              cls += 'border-emerald-500 bg-emerald-50 text-emerald-800'
            } else if (opt === selected) {
              cls += 'border-red-400 bg-red-50 text-red-700'
            } else {
              cls += 'border-gray-100 bg-gray-50 text-gray-400'
            }
            return (
              <button key={opt} className={cls} onClick={() => pick(opt)}>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Кнопка далее */}
        {selected && (
          <button
            onClick={next}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-xl transition-colors"
          >
            {isLast ? 'Завершить →' : 'Далее →'}
          </button>
        )}
      </main>
    </div>
  )
}

// ─── Result screen ────────────────────────────────────────────────────────────

function ResultScreen({
  correct,
  total,
  onRetry,
  onBack,
}: {
  correct: number
  total: number
  onRetry: () => void
  onBack: () => void
}) {
  const router = useRouter()
  const percent = Math.round((correct / total) * 100)
  const emoji = percent >= 80 ? '🎉' : percent >= 50 ? '👍' : '💪'
  const message =
    percent >= 80 ? 'Отлично! Ты хорошо знаешь эти слова.' :
    percent >= 50 ? 'Неплохо! Повтори ещё раз для закрепления.' :
    'Нужно ещё поработать. Не сдавайся!'

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="text-6xl">{emoji}</div>

        <div>
          <div className="text-4xl font-bold text-gray-900">{correct}/{total}</div>
          <div className="text-gray-500 mt-1">{percent}% правильных ответов</div>
        </div>

        <p className="text-gray-600">{message}</p>

        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-4 rounded-xl transition-colors"
          >
            Повторить ещё раз
          </button>
          <button
            onClick={onBack}
            className="w-full bg-white border border-gray-200 text-gray-700 font-semibold py-4 rounded-xl hover:border-gray-300 transition-colors"
          >
            Выбрать другой пакет
          </button>
          <button
            onClick={() => router.push('/practice')}
            className="w-full text-sky-500 text-sm hover:underline py-2"
          >
            Закрепить слова в практике →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Page entry point ─────────────────────────────────────────────────────────

export default function VocabularyPage() {
  const [screen, setScreen] = useState<Screen>('topics')
  const [topic, setTopic] = useState<TopicId | null>(null)
  const [pack, setPack] = useState<TopicPack | null>(null)
  const [result, setResult] = useState<{ correct: number; total: number } | null>(null)
  const [quizWords, setQuizWords] = useState<Word[]>([])

  const selectTopic = (t: TopicId) => {
    setTopic(t)
    setPack(null)
    setResult(null)
  }

  const startQuiz = (selectedPack: TopicPack) => {
    setPack(selectedPack)
    setQuizWords([...selectedPack.words].sort(() => Math.random() - 0.5))
    setScreen('quiz')
  }

  const handleFinish = (correct: number, total: number) => {
    setResult({ correct, total })
    setScreen('result')
  }

  const handleRetry = () => {
    if (!pack) return
    setQuizWords([...pack.words].sort(() => Math.random() - 0.5))
    setScreen('quiz')
  }

  if (screen === 'topics' && !topic) return <TopicPicker onSelect={selectTopic} />

  if (screen === 'topics' && topic) {
    return (
      <PackPicker
        topic={topic}
        onSelect={startQuiz}
        onBack={() => {
          setTopic(null)
          setPack(null)
        }}
      />
    )
  }

  if (screen === 'quiz') return (
    <QuizScreen
      words={quizWords}
      onFinish={handleFinish}
      onBack={() => setScreen('topics')}
    />
  )

  if (screen === 'result' && result) return (
    <ResultScreen
      correct={result.correct}
      total={result.total}
      onRetry={handleRetry}
      onBack={() => setScreen('topics')}
    />
  )

  return null
}
