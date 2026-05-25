export type ScenarioId = 'airport' | 'hotel' | 'restaurant'

export const SCENARIOS = {
  airport: {
    id: 'airport' as ScenarioId,
    emoji: '✈️',
    title: 'Airport',
    titleRu: 'Аэропорт',
    desc: 'Check-in, security, boarding',
    character: 'Alex',
    characterRole: 'check-in agent at London Heathrow Airport',
    opening: "Hello! Welcome to Heathrow. Are you checking in for a flight today?",
  },
  hotel: {
    id: 'hotel' as ScenarioId,
    emoji: '🏨',
    title: 'Hotel',
    titleRu: 'Отель',
    desc: 'Check-in, room service, requests',
    character: 'Sarah',
    characterRole: 'front desk receptionist at a 4-star hotel in London',
    opening: "Good evening! Welcome to The Grand Hotel. Do you have a reservation?",
  },
  restaurant: {
    id: 'restaurant' as ScenarioId,
    emoji: '🍽️',
    title: 'Restaurant',
    titleRu: 'Ресторан',
    desc: 'Ordering, asking questions, paying',
    character: 'James',
    characterRole: 'waiter at a mid-range British restaurant',
    opening: "Good evening! Table for one? Here's our menu. Can I get you something to drink while you decide?",
  },
}

export function dialogPrompt(scenario: ScenarioId, history: string): string {
  const s = SCENARIOS[scenario]
  return `You are ${s.character}, a ${s.characterRole}.
Stay fully in character. Never break role, never teach grammar.
Respond naturally in 1-2 sentences max.
If the user's English is broken but understandable, understand them and respond naturally.
If completely unclear, politely ask for clarification in character.
Do NOT correct the user, do NOT explain grammar.
Conversation so far:
${history}`
}

export function evalPrompt(userMessage: string, scenario: ScenarioId): string {
  const s = SCENARIOS[scenario]
  return `You are an English teacher evaluating a B1/B2 student's response in a ${s.titleRu} scenario.

Evaluate this student message: "${userMessage}"

Return ONLY valid JSON, no other text, no markdown, no comments:
{
  "grammar_score": <integer 1-5>,
  "speech_level": "<formal|informal|neutral>",
  "correction": "<corrected English version of the phrase, or empty string if correct>",
  "explanation_ru": "<brief explanation in Russian why the correction was needed, or empty string>",
  "positive_ru": "<short praise in Russian, always present, e.g. Отличная фраза! or Хорошая попытка!>"
}

Rules:
- grammar_score 5 = perfect, 4 = minor issues, 3 = understandable but errors, 2 = significant errors, 1 = hard to understand
- If grammar_score is 4 or 5, correction and explanation_ru should be empty strings
- positive_ru must always be present and encouraging
- Return ONLY the JSON object, nothing else`
}
