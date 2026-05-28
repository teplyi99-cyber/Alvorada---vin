export type DialogLine = {
  speaker: string
  text: string
  audioText?: string
}

export type ListeningQuestion = {
  question: string
  options: string[]
  answer: string
}

export type ListeningPart = {
  title: string
  lineIndexes: number[]
  question: ListeningQuestion
}

export type ListeningDialog = {
  id: string
  topic: 'airport' | 'hotel' | 'restaurant'
  emoji: string
  title: string
  titleRu: string
  task: string
  lines: DialogLine[]
  parts: ListeningPart[]
}

export const LISTENING_DIALOGS: ListeningDialog[] = [
  {
    id: 'airport-1',
    topic: 'airport',
    emoji: '✈️',
    title: 'Check-in at the Airport',
    titleRu: 'Регистрация в аэропорту',
    task: 'Прослушай диалог и кратко опиши по-русски: куда летит пассажир, какой у него багаж и какое место он получил?',
    lines: [
      { speaker: 'Agent', text: 'Good morning! Where are you flying to today?' },
      { speaker: 'Passenger', text: 'Good morning. I am flying to Barcelona, Spain.' },
      { speaker: 'Agent', text: 'May I see your passport and booking confirmation, please?' },
      { speaker: 'Passenger', text: 'Of course. Here you are.' },
      { speaker: 'Agent', text: 'Thank you. Do you have any bags to check in?' },
      { speaker: 'Passenger', text: 'Yes, I have one suitcase. It weighs about 20 kilograms.', audioText: 'Yes, I have one suitcase. It weighs about twenty kilograms.' },
      { speaker: 'Agent', text: 'That is within the limit. Would you prefer a window or aisle seat?' },
      { speaker: 'Passenger', text: 'A window seat, please.' },
      { speaker: 'Agent', text: 'Perfect. Here is your boarding pass. Your flight departs from gate 14 at 11:45.', audioText: 'Perfect. Here is your boarding pass. Your flight departs from gate fourteen at eleven forty-five.' },
      { speaker: 'Passenger', text: 'Thank you very much.' },
    ],
    parts: [
      {
        title: 'Куда летит пассажир',
        lineIndexes: [0, 1, 2, 3],
        question: {
          question: 'Куда летит пассажир?',
          options: ['Barcelona', 'Lisbon', 'Rome'],
          answer: 'Barcelona',
        },
      },
      {
        title: 'Багаж',
        lineIndexes: [4, 5],
        question: {
          question: 'Сколько багажа сдаёт пассажир?',
          options: ['One suitcase', 'Two backpacks', 'No luggage'],
          answer: 'One suitcase',
        },
      },
      {
        title: 'Место и посадка',
        lineIndexes: [6, 7, 8, 9],
        question: {
          question: 'Какое место выбрал пассажир?',
          options: ['Window seat', 'Aisle seat', 'Middle seat'],
          answer: 'Window seat',
        },
      },
    ],
  },
  {
    id: 'hotel-1',
    topic: 'hotel',
    emoji: '🏨',
    title: 'Hotel Check-in',
    titleRu: 'Заселение в отель',
    task: 'Прослушай диалог и кратко опиши по-русски: на какое имя бронь, какой номер, какие проблемы возникли?',
    lines: [
      { speaker: 'Receptionist', text: 'Good evening! Welcome to The Grand Hotel. How can I help you?' },
      { speaker: 'Guest', text: 'Hello. I have a reservation. My name is Johnson.' },
      { speaker: 'Receptionist', text: 'Let me check that for you. Yes, I can see a booking for two nights in a double room.', audioText: 'Let me check that for you. Yes, I can see a booking for two nights in a double room.' },
      { speaker: 'Guest', text: 'That is correct.' },
      { speaker: 'Receptionist', text: 'Could I see your passport, please?' },
      { speaker: 'Guest', text: 'Sure, here it is.' },
      { speaker: 'Receptionist', text: 'Thank you. I am afraid your room is not quite ready yet. It will be ready in about 30 minutes.', audioText: 'Thank you. I am afraid your room is not quite ready yet. It will be ready in about thirty minutes.' },
      { speaker: 'Guest', text: 'Oh, that is a bit inconvenient. Is there somewhere I can wait?' },
      { speaker: 'Receptionist', text: 'Of course. Our lounge on the ground floor is very comfortable. We also offer complimentary tea and coffee.' },
      { speaker: 'Guest', text: 'That sounds good. Thank you.' },
    ],
    parts: [
      {
        title: 'Бронь',
        lineIndexes: [0, 1, 2, 3],
        question: {
          question: 'На какое имя бронь?',
          options: ['Johnson', 'Smith', 'Brown'],
          answer: 'Johnson',
        },
      },
      {
        title: 'Документы',
        lineIndexes: [4, 5],
        question: {
          question: 'Что попросил показать администратор?',
          options: ['Passport', 'Credit card', 'Driver license'],
          answer: 'Passport',
        },
      },
      {
        title: 'Проблема с номером',
        lineIndexes: [6, 7, 8, 9],
        question: {
          question: 'Когда будет готов номер?',
          options: ['In about 30 minutes', 'Tomorrow morning', 'In two hours'],
          answer: 'In about 30 minutes',
        },
      },
    ],
  },
  {
    id: 'restaurant-1',
    topic: 'restaurant',
    emoji: '🍽️',
    title: 'Ordering at a Restaurant',
    titleRu: 'Заказ в ресторане',
    task: 'Прослушай диалог и кратко опиши по-русски: что заказал гость, были ли какие-то особые пожелания?',
    lines: [
      { speaker: 'Waiter', text: 'Good evening! Are you ready to order?' },
      { speaker: 'Guest', text: 'Yes, I think so. What do you recommend?' },
      { speaker: 'Waiter', text: 'Our grilled salmon is very popular tonight. It comes with roasted vegetables and a lemon butter sauce.' },
      { speaker: 'Guest', text: 'That sounds lovely. I will have that, please.' },
      { speaker: 'Waiter', text: 'Excellent choice. And for a starter?' },
      { speaker: 'Guest', text: 'I will have the tomato soup, please. Oh, I should mention I am allergic to nuts.' },
      { speaker: 'Waiter', text: 'Thank you for letting me know. I will inform the kitchen. And to drink?' },
      { speaker: 'Guest', text: 'Just sparkling water for now, thank you.' },
      { speaker: 'Waiter', text: 'Of course. Your order will be ready in about 15 minutes.', audioText: 'Of course. Your order will be ready in about fifteen minutes.' },
      { speaker: 'Guest', text: 'Perfect, thank you.' },
    ],
    parts: [
      {
        title: 'Главное блюдо',
        lineIndexes: [0, 1, 2, 3],
        question: {
          question: 'Что официант рекомендует как основное блюдо?',
          options: ['Grilled salmon', 'Tomato soup', 'Roasted chicken'],
          answer: 'Grilled salmon',
        },
      },
      {
        title: 'Закуска и аллергия',
        lineIndexes: [4, 5],
        question: {
          question: 'На что у гостя аллергия?',
          options: ['Nuts', 'Milk', 'Fish'],
          answer: 'Nuts',
        },
      },
      {
        title: 'Напиток и ожидание',
        lineIndexes: [6, 7, 8, 9],
        question: {
          question: 'Что гость заказал пить?',
          options: ['Sparkling water', 'Still water', 'Tea'],
          answer: 'Sparkling water',
        },
      },
    ],
  },
]
