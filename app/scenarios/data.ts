export type DialogItem = {
  id: string
  title: string
  titleRu: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export type Scenario = {
  id: string
  emoji: string
  title: string
  titleRu: string
  description: string
  character: string
  ready: boolean
  dialogs: DialogItem[]
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'airport',
    emoji: '✈️',
    title: 'Airport',
    titleRu: 'Аэропорт',
    description: 'Регистрация, досмотр, посадка',
    character: 'Alex',
    ready: true,
    dialogs: [
      {
        id: 'check-in',
        title: 'Check-in',
        titleRu: 'Регистрация на рейс',
        description: 'Подходишь к стойке, сдаёшь багаж, получаешь посадочный талон',
        difficulty: 'easy',
      },
      {
        id: 'security',
        title: 'Security Check',
        titleRu: 'Досмотр',
        description: 'Проходишь контроль безопасности, объясняешь содержимое багажа',
        difficulty: 'easy',
      },
      {
        id: 'gate',
        title: 'At the Gate',
        titleRu: 'У выхода на посадку',
        description: 'Спрашиваешь про рейс, задержку, пересадку',
        difficulty: 'medium',
      },
      {
        id: 'lost-luggage',
        title: 'Lost Luggage',
        titleRu: 'Потерянный багаж',
        description: 'Багаж не пришёл, объясняешь ситуацию сотруднику',
        difficulty: 'hard',
      },
    ],
  },
  {
    id: 'hotel',
    emoji: '🏨',
    title: 'Hotel',
    titleRu: 'Отель',
    description: 'Заселение, запросы, выселение',
    character: 'Sarah',
    ready: true,
    dialogs: [
      {
        id: 'check-in',
        title: 'Check-in',
        titleRu: 'Заселение',
        description: 'Подтверждаешь бронь, получаешь ключ от номера',
        difficulty: 'easy',
      },
      {
        id: 'room-problem',
        title: 'Room Problem',
        titleRu: 'Проблема в номере',
        description: 'Не работает кондиционер, нет горячей воды — решаешь с рецепцией',
        difficulty: 'medium',
      },
      {
        id: 'room-service',
        title: 'Room Service',
        titleRu: 'Обслуживание номера',
        description: 'Заказываешь еду и напитки в номер',
        difficulty: 'easy',
      },
      {
        id: 'check-out',
        title: 'Check-out',
        titleRu: 'Выселение',
        description: 'Сдаёшь номер, проверяешь счёт, просишь такси',
        difficulty: 'medium',
      },
    ],
  },
  {
    id: 'restaurant',
    emoji: '🍽️',
    title: 'Restaurant',
    titleRu: 'Ресторан',
    description: 'Заказ, вопросы о меню, оплата',
    character: 'James',
    ready: true,
    dialogs: [
      {
        id: 'ordering',
        title: 'Ordering Food',
        titleRu: 'Заказ еды',
        description: 'Выбираешь блюда, спрашиваешь про состав и рекомендации',
        difficulty: 'easy',
      },
      {
        id: 'allergies',
        title: 'Dietary Requirements',
        titleRu: 'Диетические требования',
        description: 'Объясняешь аллергии и предпочтения в еде',
        difficulty: 'medium',
      },
      {
        id: 'complaint',
        title: 'Making a Complaint',
        titleRu: 'Жалоба',
        description: 'Блюдо не то что заказал или некачественное — решаешь вежливо',
        difficulty: 'hard',
      },
      {
        id: 'bill',
        title: 'Paying the Bill',
        titleRu: 'Оплата',
        description: 'Просишь счёт, делишь на двоих, оставляешь чаевые',
        difficulty: 'easy',
      },
    ],
  },
  {
    id: 'transport',
    emoji: '🚕',
    title: 'Transport',
    titleRu: 'Транспорт',
    description: 'Такси, метро, автобус',
    character: 'Driver',
    ready: false,
    dialogs: [],
  },
  {
    id: 'shopping',
    emoji: '🛍️',
    title: 'Shopping',
    titleRu: 'Шопинг',
    description: 'Магазины, примерка, возврат',
    character: 'Assistant',
    ready: false,
    dialogs: [],
  },
  {
    id: 'medical',
    emoji: '🏥',
    title: 'Medical',
    titleRu: 'Медицина',
    description: 'Аптека, врач, симптомы',
    character: 'Doctor',
    ready: false,
    dialogs: [],
  },
]

export const difficultyLabel: Record<string, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
}

export const difficultyColor: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  hard: 'bg-red-100 text-red-700',
}
