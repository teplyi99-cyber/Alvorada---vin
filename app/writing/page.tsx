'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  TOPIC_LABELS,
  TYPE_LABELS,
  WRITING_TASKS,
  type WritingTask,
  type WritingTaskType,
  type WritingTopic,
} from './data'

type WritingCorrection = {
  original: string
  corrected: string
  explanation_ru: string
}

type WritingFeedback = {
  score: number
  corrected_text: string
  natural_version: string
  corrections: WritingCorrection[]
  positive_ru: string
  suggestion_ru: string
}

const TYPE_ORDER: WritingTaskType[] = ['reply', 'scenario', 'improve']
const TOPIC_ORDER: WritingTopic[] = ['airport', 'hotel', 'restaurant']

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function TaskCard({ task, selected, onSelect }: { task: WritingTask; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left bg-white rounded-2xl border px-4 py-4 transition-all ${
        selected ? 'border-sky-400 shadow-sm ring-2 ring-sky-100' : 'border-gray-200 hover:border-sky-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium text-sky-600">{TYPE_LABELS[task.type]}</div>
          <div className="font-semibold text-gray-900 mt-1">{task.titleRu}</div>
          <div className="text-sm text-gray-500 mt-1">{TOPIC_LABELS[task.topic]} · {task.minWords}-{task.maxWords} слов</div>
        </div>
        <span className="text-gray-400">{selected ? '✓' : '→'}</span>
      </div>
    </button>
  )
}

function FeedbackView({ feedback }: { feedback: WritingFeedback }) {
  return (
    <div className="space-y-3">
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
        <div className="text-sm text-emerald-700 font-medium">Оценка</div>
        <div className="text-3xl font-bold text-emerald-700 mt-1">{feedback.score}/5</div>
        <p className="text-sm text-emerald-800 mt-2">{feedback.positive_ru}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <div className="text-sm font-semibold text-gray-900">Исправленный вариант</div>
        <p className="text-gray-700 mt-2 whitespace-pre-wrap">{feedback.corrected_text}</p>
      </div>

      <div className="bg-white border border-sky-100 rounded-2xl p-4">
        <div className="text-sm font-semibold text-gray-900">Make it natural</div>
        <p className="text-gray-700 mt-2 whitespace-pre-wrap">{feedback.natural_version}</p>
      </div>

      {feedback.corrections.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4">
          <div className="text-sm font-semibold text-gray-900">Что поправить</div>
          <div className="mt-3 space-y-3">
            {feedback.corrections.map((correction, index) => (
              <div key={`${correction.original}-${index}`} className="border-l-2 border-sky-200 pl-3">
                <div className="text-sm text-gray-500 line-through">{correction.original}</div>
                <div className="text-sm text-gray-900 font-medium">{correction.corrected}</div>
                <div className="text-xs text-gray-500 mt-1">{correction.explanation_ru}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
        <div className="text-sm font-semibold text-amber-900">Следующий шаг</div>
        <p className="text-sm text-amber-900 mt-1">{feedback.suggestion_ru}</p>
      </div>
    </div>
  )
}

export default function WritingPage() {
  const router = useRouter()
  const [selectedTopic, setSelectedTopic] = useState<WritingTopic>('airport')
  const [selectedType, setSelectedType] = useState<WritingTaskType>('reply')
  const [selectedTaskId, setSelectedTaskId] = useState(WRITING_TASKS[0].id)
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const visibleTasks = useMemo(
    () => WRITING_TASKS.filter((task) => task.topic === selectedTopic && task.type === selectedType),
    [selectedTopic, selectedType],
  )

  const selectedTask = WRITING_TASKS.find((task) => task.id === selectedTaskId) ?? visibleTasks[0] ?? WRITING_TASKS[0]
  const words = countWords(text)
  const lengthHint =
    words < selectedTask.minWords
      ? `Добавь еще примерно ${selectedTask.minWords - words} слов`
      : words > selectedTask.maxWords
        ? `Сократи примерно на ${words - selectedTask.maxWords} слов`
        : 'Длина подходит'

  const selectTask = (task: WritingTask) => {
    setSelectedTaskId(task.id)
    setText('')
    setFeedback(null)
    setError('')
  }

  const handleTopic = (topic: WritingTopic) => {
    setSelectedTopic(topic)
    const nextTask = WRITING_TASKS.find((task) => task.topic === topic && task.type === selectedType)
    if (nextTask) selectTask(nextTask)
  }

  const handleType = (type: WritingTaskType) => {
    setSelectedType(type)
    const nextTask = WRITING_TASKS.find((task) => task.topic === selectedTopic && task.type === type)
    if (nextTask) selectTask(nextTask)
  }

  const submit = async () => {
    setLoading(true)
    setError('')
    setFeedback(null)

    try {
      const response = await fetch('/api/writing/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: selectedTask.id, userText: text }),
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error ?? 'Не удалось проверить текст')
      }

      setFeedback(data.feedback)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось проверить текст')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 h-14 flex items-center gap-3">
        <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-700">
          ← Назад
        </button>
        <div className="font-semibold text-gray-900">Письмо</div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid gap-5 lg:grid-cols-[360px_1fr]">
        <section className="space-y-4">
          <div>
            <div className="text-sm text-gray-500 mb-2">Тема</div>
            <div className="grid grid-cols-3 gap-2">
              {TOPIC_ORDER.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopic(topic)}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium ${
                    selectedTopic === topic
                      ? 'bg-sky-500 border-sky-500 text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-sky-300'
                  }`}
                >
                  {TOPIC_LABELS[topic]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">Тип задания</div>
            <div className="space-y-2">
              {TYPE_ORDER.map((type) => (
                <button
                  key={type}
                  onClick={() => handleType(type)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm font-medium ${
                    selectedType === type
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-200'
                  }`}
                >
                  {TYPE_LABELS[type]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-gray-500">Задание</div>
            {visibleTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                selected={task.id === selectedTask.id}
                onSelect={() => selectTask(task)}
              />
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-sky-600">{TYPE_LABELS[selectedTask.type]}</div>
                <h1 className="text-xl font-bold text-gray-900 mt-1">{selectedTask.titleRu}</h1>
                <p className="text-sm text-gray-500 mt-1">{selectedTask.title}</p>
              </div>
              <div className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                {selectedTask.minWords}-{selectedTask.maxWords} слов
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-gray-500 uppercase">Prompt</div>
                <p className="text-gray-900 mt-1">{selectedTask.prompt}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-gray-500 uppercase">Context</div>
                <p className="text-gray-700 mt-1">{selectedTask.context}</p>
              </div>

              {selectedTask.exampleAnswer && (
                <div className="bg-sky-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-sky-700 uppercase">Example</div>
                  <p className="text-sky-900 mt-1">{selectedTask.exampleAnswer}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <label htmlFor="writing-text" className="font-semibold text-gray-900">
                Твой текст
              </label>
              <span className={`text-xs ${words >= selectedTask.minWords && words <= selectedTask.maxWords ? 'text-emerald-600' : 'text-gray-500'}`}>
                {words} слов · {lengthHint}
              </span>
            </div>

            <textarea
              id="writing-text"
              value={text}
              onChange={(event) => {
                setText(event.target.value)
                setFeedback(null)
                setError('')
              }}
              placeholder="Write your answer in English..."
              className="w-full min-h-[190px] resize-y rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />

            {error && (
              <div className="mt-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={submit}
                disabled={loading || text.trim().length < 5}
                className="rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading ? 'Проверяю...' : 'Проверить'}
              </button>
              <button
                onClick={() => {
                  setText('')
                  setFeedback(null)
                  setError('')
                }}
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300"
              >
                Очистить
              </button>
            </div>
          </div>

          {feedback && <FeedbackView feedback={feedback} />}
        </section>
      </main>
    </div>
  )
}
