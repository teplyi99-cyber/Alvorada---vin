const BASE =
  process.env.QWEN_BASE_URL ??
  'https://dashscope-intl.aliyuncs.com/compatible-mode/v1'

export type QwenMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export async function qwenChat(
  messages: QwenMessage[],
  opts: { model?: string; temperature?: number; max_tokens?: number } = {}
): Promise<string> {
  const apiKey = process.env.QWEN_API_KEY ?? process.env.DASHSCOPE_API_KEY

  if (!apiKey) {
    throw new Error('QWEN_API_KEY is missing. Add a server-side Qwen key to .env.local')
  }

  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model ?? 'qwen-turbo',
      messages,
      temperature: opts.temperature ?? 0.7,
      max_tokens: opts.max_tokens ?? 512,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Qwen error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}
