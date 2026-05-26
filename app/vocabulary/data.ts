export type Word = {
  id: string
  word: string
  transcription: string
  translation: string
  example: string
  topic: 'airport' | 'hotel' | 'restaurant'
}

export const WORDS: Word[] = [
  // AIRPORT
  { id: 'a1', word: 'boarding pass', transcription: '[ˈbɔːdɪŋ pɑːs]', translation: 'посадочный талон', example: 'May I see your boarding pass?', topic: 'airport' },
  { id: 'a2', word: 'check-in', transcription: '[ˈtʃek ɪn]', translation: 'регистрация', example: 'Where is the check-in counter?', topic: 'airport' },
  { id: 'a3', word: 'departure', transcription: '[dɪˈpɑːtʃə]', translation: 'отправление / вылет', example: 'The departure is at 14:30.', topic: 'airport' },
  { id: 'a4', word: 'arrival', transcription: '[əˈraɪvəl]', translation: 'прибытие', example: 'What is the arrival time?', topic: 'airport' },
  { id: 'a5', word: 'luggage', transcription: '[ˈlʌɡɪdʒ]', translation: 'багаж', example: 'My luggage is lost.', topic: 'airport' },
  { id: 'a6', word: 'passport', transcription: '[ˈpɑːspɔːt]', translation: 'паспорт', example: 'Can I see your passport, please?', topic: 'airport' },
  { id: 'a7', word: 'security check', transcription: '[sɪˈkjʊərɪti tʃek]', translation: 'досмотр безопасности', example: 'Please remove your shoes at the security check.', topic: 'airport' },
  { id: 'a8', word: 'gate', transcription: '[ɡeɪt]', translation: 'выход на посадку', example: 'Your flight departs from gate 12.', topic: 'airport' },
  { id: 'a9', word: 'delayed', transcription: '[dɪˈleɪd]', translation: 'задержан', example: 'The flight is delayed by two hours.', topic: 'airport' },
  { id: 'a10', word: 'carry-on', transcription: '[ˈkæri ɒn]', translation: 'ручная кладь', example: 'You can take one carry-on bag.', topic: 'airport' },

  // HOTEL
  { id: 'h1', word: 'reservation', transcription: '[ˌrezəˈveɪʃən]', translation: 'бронирование', example: 'I have a reservation under Smith.', topic: 'hotel' },
  { id: 'h2', word: 'check out', transcription: '[tʃek aʊt]', translation: 'выселение', example: 'What time is check out?', topic: 'hotel' },
  { id: 'h3', word: 'room service', transcription: '[ruːm ˈsɜːvɪs]', translation: 'обслуживание в номере', example: 'I would like to order room service.', topic: 'hotel' },
  { id: 'h4', word: 'reception', transcription: '[rɪˈsepʃən]', translation: 'стойка регистрации', example: 'Please go to the reception desk.', topic: 'hotel' },
  { id: 'h5', word: 'double room', transcription: '[ˈdʌbəl ruːm]', translation: 'двухместный номер', example: 'I booked a double room.', topic: 'hotel' },
  { id: 'h6', word: 'single room', transcription: '[ˈsɪŋɡəl ruːm]', translation: 'одноместный номер', example: 'Do you have a single room available?', topic: 'hotel' },
  { id: 'h7', word: 'complaint', transcription: '[kəmˈpleɪnt]', translation: 'жалоба', example: 'I have a complaint about my room.', topic: 'hotel' },
  { id: 'h8', word: 'amenities', transcription: '[əˈmiːnɪtiz]', translation: 'удобства', example: 'What amenities does the room have?', topic: 'hotel' },
  { id: 'h9', word: 'housekeeping', transcription: '[ˈhaʊskiːpɪŋ]', translation: 'уборка номера', example: 'Could you send housekeeping please?', topic: 'hotel' },
  { id: 'h10', word: 'key card', transcription: '[kiː kɑːd]', translation: 'ключ-карта', example: 'Here is your key card for room 205.', topic: 'hotel' },

  // RESTAURANT
  { id: 'r1', word: 'menu', transcription: '[ˈmenjuː]', translation: 'меню', example: 'Could I see the menu, please?', topic: 'restaurant' },
  { id: 'r2', word: 'order', transcription: '[ˈɔːdə]', translation: 'заказ / заказывать', example: 'Are you ready to order?', topic: 'restaurant' },
  { id: 'r3', word: 'bill', transcription: '[bɪl]', translation: 'счёт', example: 'Could we have the bill, please?', topic: 'restaurant' },
  { id: 'r4', word: 'tip', transcription: '[tɪp]', translation: 'чаевые', example: 'Is the tip included?', topic: 'restaurant' },
  { id: 'r5', word: 'starter', transcription: '[ˈstɑːtə]', translation: 'закуска / первое', example: 'I will have the soup as a starter.', topic: 'restaurant' },
  { id: 'r6', word: 'main course', transcription: '[meɪn kɔːs]', translation: 'основное блюдо', example: 'For the main course, I would like the steak.', topic: 'restaurant' },
  { id: 'r7', word: 'dessert', transcription: '[dɪˈzɜːt]', translation: 'десерт', example: 'Would you like any dessert?', topic: 'restaurant' },
  { id: 'r8', word: 'allergy', transcription: '[ˈælədʒi]', translation: 'аллергия', example: 'I have an allergy to nuts.', topic: 'restaurant' },
  { id: 'r9', word: 'vegetarian', transcription: '[ˌvedʒɪˈteəriən]', translation: 'вегетарианский', example: 'Do you have any vegetarian options?', topic: 'restaurant' },
  { id: 'r10', word: 'recommend', transcription: '[ˌrekəˈmend]', translation: 'рекомендовать', example: 'What do you recommend?', topic: 'restaurant' },
]

export const TOPICS = {
  airport: { label: 'Аэропорт', emoji: '✈️' },
  hotel: { label: 'Отель', emoji: '🏨' },
  restaurant: { label: 'Ресторан', emoji: '🍽️' },
}

// Генерируем 4 варианта ответа: 1 правильный + 3 случайных
export function getOptions(word: Word, allWords: Word[]): string[] {
  const correct = word.translation
  const others = allWords
    .filter((w) => w.id !== word.id)
    .map((w) => w.translation)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)

  return [correct, ...others].sort(() => Math.random() - 0.5)
}
