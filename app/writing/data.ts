export type WritingTaskType = 'reply' | 'scenario' | 'improve'
export type WritingTopic = 'airport' | 'hotel' | 'restaurant'

export type WritingTask = {
  id: string
  type: WritingTaskType
  topic: WritingTopic
  title: string
  titleRu: string
  prompt: string
  context: string
  exampleAnswer?: string
  minWords: number
  maxWords: number
}

export const TYPE_LABELS: Record<WritingTaskType, string> = {
  reply: 'Ответить на сообщение',
  scenario: 'Решить ситуацию',
  improve: 'Сделать фразу естественнее',
}

export const TOPIC_LABELS: Record<WritingTopic, string> = {
  airport: 'Аэропорт',
  hotel: 'Отель',
  restaurant: 'Ресторан',
}

export const WRITING_TASKS: WritingTask[] = [
  {
    id: 'airport-reply-baggage',
    type: 'reply',
    topic: 'airport',
    title: 'Baggage confirmation',
    titleRu: 'Ответ авиакомпании про багаж',
    prompt:
      'An airline employee asks you to confirm your baggage and arrival time at the airport. Write a polite reply.',
    context:
      'Message: "Could you please confirm how many bags you will check in and what time you plan to arrive at the airport?"',
    exampleAnswer:
      'Hello, I will check in one suitcase and one small carry-on bag. I plan to arrive at the airport around 8:30.',
    minWords: 20,
    maxWords: 55,
  },
  {
    id: 'airport-scenario-lost-luggage',
    type: 'scenario',
    topic: 'airport',
    title: 'Lost luggage desk',
    titleRu: 'Обращение из-за потерянного багажа',
    prompt:
      'Your suitcase did not arrive. Write a short message to the airport staff and explain what happened.',
    context:
      'You need to say where you flew from, describe the suitcase, and ask what you should do next.',
    minWords: 35,
    maxWords: 80,
  },
  {
    id: 'airport-improve-seat',
    type: 'improve',
    topic: 'airport',
    title: 'Seat request',
    titleRu: 'Вежливая просьба о месте',
    prompt:
      'Rewrite this message so it sounds polite and natural: "Give me window seat please. I do not like middle seat."',
    context: 'Imagine you are writing to an airline employee before check-in.',
    minWords: 15,
    maxWords: 45,
  },
  {
    id: 'hotel-reply-checkin',
    type: 'reply',
    topic: 'hotel',
    title: 'Check-in time',
    titleRu: 'Ответ отелю о времени заезда',
    prompt:
      'The hotel asks what time you will arrive. Write a polite reply and ask one useful question.',
    context:
      'Message: "Thank you for your reservation. Could you let us know your expected arrival time?"',
    exampleAnswer:
      'Hello, I expect to arrive at around 7 p.m. Could you please tell me if late check-in is available?',
    minWords: 20,
    maxWords: 55,
  },
  {
    id: 'hotel-scenario-noisy-room',
    type: 'scenario',
    topic: 'hotel',
    title: 'Noisy room',
    titleRu: 'Просьба поменять шумный номер',
    prompt:
      'You cannot sleep because your room is very noisy. Write a polite message to reception.',
    context:
      'Explain the problem, ask if another room is available, and keep the tone calm.',
    minWords: 35,
    maxWords: 80,
  },
  {
    id: 'hotel-improve-late-checkout',
    type: 'improve',
    topic: 'hotel',
    title: 'Late checkout',
    titleRu: 'Естественная просьба о позднем выезде',
    prompt:
      'Rewrite this message so it sounds natural: "I want stay in room more time tomorrow. Can I go out at 2?"',
    context: 'You are asking the hotel for late checkout.',
    minWords: 15,
    maxWords: 45,
  },
  {
    id: 'restaurant-reply-reservation',
    type: 'reply',
    topic: 'restaurant',
    title: 'Reservation details',
    titleRu: 'Подтверждение брони в ресторане',
    prompt:
      'The restaurant asks you to confirm your reservation and any allergies. Write a clear reply.',
    context:
      'Message: "Please confirm your reservation for four people at 8 p.m. Do you have any food allergies?"',
    exampleAnswer:
      'Hello, I confirm the reservation for four people at 8 p.m. One person is allergic to nuts.',
    minWords: 20,
    maxWords: 55,
  },
  {
    id: 'restaurant-scenario-wrong-order',
    type: 'scenario',
    topic: 'restaurant',
    title: 'Wrong order',
    titleRu: 'Неправильный заказ',
    prompt:
      'The waiter brought the wrong dish. Write what you would say politely.',
    context:
      'Explain what you ordered, what you received, and ask for help without sounding rude.',
    minWords: 25,
    maxWords: 65,
  },
  {
    id: 'restaurant-improve-bill',
    type: 'improve',
    topic: 'restaurant',
    title: 'The bill',
    titleRu: 'Естественная просьба о счете',
    prompt:
      'Rewrite this message so it sounds natural: "Bring bill. We pay separate. Fast please."',
    context: 'You are talking to a waiter at the end of dinner.',
    minWords: 15,
    maxWords: 45,
  },
]
