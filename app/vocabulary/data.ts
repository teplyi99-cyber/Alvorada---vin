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
  { id: 'a11', word: 'customs', transcription: '[ˈkʌstəmz]', translation: 'таможня', example: 'We need to go through customs.', topic: 'airport' },
  { id: 'a12', word: 'baggage claim', transcription: '[ˈbæɡɪdʒ kleɪm]', translation: 'выдача багажа', example: 'Baggage claim is downstairs.', topic: 'airport' },
  { id: 'a13', word: 'boarding', transcription: '[ˈbɔːdɪŋ]', translation: 'посадка на рейс', example: 'Boarding starts in twenty minutes.', topic: 'airport' },
  { id: 'a14', word: 'flight attendant', transcription: '[flaɪt əˈtendənt]', translation: 'бортпроводник', example: 'Ask the flight attendant for water.', topic: 'airport' },
  { id: 'a15', word: 'seat belt', transcription: '[siːt belt]', translation: 'ремень безопасности', example: 'Please fasten your seat belt.', topic: 'airport' },
  { id: 'a16', word: 'overhead bin', transcription: '[ˌəʊvəˈhed bɪn]', translation: 'верхняя багажная полка', example: 'Put your bag in the overhead bin.', topic: 'airport' },
  { id: 'a17', word: 'aisle seat', transcription: '[aɪl siːt]', translation: 'место у прохода', example: 'I would prefer an aisle seat.', topic: 'airport' },
  { id: 'a18', word: 'window seat', transcription: '[ˈwɪndəʊ siːt]', translation: 'место у окна', example: 'Do you have a window seat available?', topic: 'airport' },
  { id: 'a19', word: 'connecting flight', transcription: '[kəˈnektɪŋ flaɪt]', translation: 'стыковочный рейс', example: 'I have a connecting flight to Lisbon.', topic: 'airport' },
  { id: 'a20', word: 'layover', transcription: '[ˈleɪəʊvə]', translation: 'пересадка / ожидание между рейсами', example: 'We have a three-hour layover.', topic: 'airport' },
  { id: 'a21', word: 'terminal', transcription: '[ˈtɜːmɪnəl]', translation: 'терминал', example: 'Which terminal does the flight leave from?', topic: 'airport' },
  { id: 'a22', word: 'passport control', transcription: '[ˈpɑːspɔːt kənˈtrəʊl]', translation: 'паспортный контроль', example: 'The line at passport control is long.', topic: 'airport' },
  { id: 'a23', word: 'visa', transcription: '[ˈviːzə]', translation: 'виза', example: 'Do I need a visa for this country?', topic: 'airport' },
  { id: 'a24', word: 'departure board', transcription: '[dɪˈpɑːtʃə bɔːd]', translation: 'табло вылетов', example: 'Check the departure board for your gate.', topic: 'airport' },
  { id: 'a25', word: 'boarding time', transcription: '[ˈbɔːdɪŋ taɪm]', translation: 'время посадки', example: 'What is the boarding time?', topic: 'airport' },
  { id: 'a26', word: 'one-way ticket', transcription: '[ˌwʌn ˈweɪ ˈtɪkɪt]', translation: 'билет в одну сторону', example: 'I need a one-way ticket to Rome.', topic: 'airport' },
  { id: 'a27', word: 'round-trip ticket', transcription: '[ˌraʊnd ˈtrɪp ˈtɪkɪt]', translation: 'билет туда и обратно', example: 'A round-trip ticket is cheaper.', topic: 'airport' },
  { id: 'a28', word: 'cancelled', transcription: '[ˈkænsəld]', translation: 'отменён', example: 'Our flight was cancelled.', topic: 'airport' },
  { id: 'a29', word: 'turbulence', transcription: '[ˈtɜːbjələns]', translation: 'турбулентность', example: 'There may be some turbulence.', topic: 'airport' },
  { id: 'a30', word: 'lost luggage', transcription: '[lɒst ˈlʌɡɪdʒ]', translation: 'потерянный багаж', example: 'Where can I report lost luggage?', topic: 'airport' },

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
  { id: 'h11', word: 'front desk', transcription: '[frʌnt desk]', translation: 'стойка администратора', example: 'Please call the front desk.', topic: 'hotel' },
  { id: 'h12', word: 'vacancy', transcription: '[ˈveɪkənsi]', translation: 'свободный номер', example: 'Do you have any vacancies tonight?', topic: 'hotel' },
  { id: 'h13', word: 'suite', transcription: '[swiːt]', translation: 'люкс / номер люкс', example: 'We booked a suite with a sea view.', topic: 'hotel' },
  { id: 'h14', word: 'twin room', transcription: '[twɪn ruːm]', translation: 'номер с двумя кроватями', example: 'We need a twin room, please.', topic: 'hotel' },
  { id: 'h15', word: 'extra blanket', transcription: '[ˈekstrə ˈblæŋkɪt]', translation: 'дополнительное одеяло', example: 'Could I have an extra blanket?', topic: 'hotel' },
  { id: 'h16', word: 'air conditioning', transcription: '[ˈeə kəndɪʃənɪŋ]', translation: 'кондиционер', example: 'The air conditioning is not working.', topic: 'hotel' },
  { id: 'h17', word: 'heating', transcription: '[ˈhiːtɪŋ]', translation: 'отопление', example: 'Can you turn on the heating?', topic: 'hotel' },
  { id: 'h18', word: 'safe', transcription: '[seɪf]', translation: 'сейф', example: 'Is there a safe in the room?', topic: 'hotel' },
  { id: 'h19', word: 'elevator', transcription: '[ˈelɪveɪtə]', translation: 'лифт', example: 'The elevator is next to reception.', topic: 'hotel' },
  { id: 'h20', word: 'laundry service', transcription: '[ˈlɔːndri ˈsɜːvɪs]', translation: 'прачечная / услуга стирки', example: 'Do you offer laundry service?', topic: 'hotel' },
  { id: 'h21', word: 'wake-up call', transcription: '[ˈweɪk ʌp kɔːl]', translation: 'звонок-будильник', example: 'I would like a wake-up call at seven.', topic: 'hotel' },
  { id: 'h22', word: 'late check-out', transcription: '[leɪt tʃek aʊt]', translation: 'поздний выезд', example: 'Can we request a late check-out?', topic: 'hotel' },
  { id: 'h23', word: 'deposit', transcription: '[dɪˈpɒzɪt]', translation: 'депозит / залог', example: 'The hotel requires a deposit.', topic: 'hotel' },
  { id: 'h24', word: 'receipt', transcription: '[rɪˈsiːt]', translation: 'чек / квитанция', example: 'Could I have a receipt, please?', topic: 'hotel' },
  { id: 'h25', word: 'noisy room', transcription: '[ˈnɔɪzi ruːm]', translation: 'шумный номер', example: 'This is a very noisy room.', topic: 'hotel' },
  { id: 'h26', word: 'change rooms', transcription: '[tʃeɪndʒ ruːmz]', translation: 'поменять номер', example: 'Is it possible to change rooms?', topic: 'hotel' },
  { id: 'h27', word: 'shower', transcription: '[ˈʃaʊə]', translation: 'душ', example: 'The shower has no hot water.', topic: 'hotel' },
  { id: 'h28', word: 'towels', transcription: '[ˈtaʊəlz]', translation: 'полотенца', example: 'Could we have clean towels?', topic: 'hotel' },
  { id: 'h29', word: 'breakfast included', transcription: '[ˈbrekfəst ɪnˈkluːdɪd]', translation: 'завтрак включён', example: 'Is breakfast included in the price?', topic: 'hotel' },
  { id: 'h30', word: 'do not disturb', transcription: '[duː nɒt dɪˈstɜːb]', translation: 'не беспокоить', example: 'Please put the do not disturb sign on the door.', topic: 'hotel' },

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
  { id: 'r11', word: 'table for two', transcription: '[ˈteɪbəl fə tuː]', translation: 'столик на двоих', example: 'We need a table for two.', topic: 'restaurant' },
  { id: 'r12', word: 'reservation name', transcription: '[ˌrezəˈveɪʃən neɪm]', translation: 'имя бронирования', example: 'What is the reservation name?', topic: 'restaurant' },
  { id: 'r13', word: 'waiter', transcription: '[ˈweɪtə]', translation: 'официант', example: 'The waiter brought us the menu.', topic: 'restaurant' },
  { id: 'r14', word: 'waitress', transcription: '[ˈweɪtrəs]', translation: 'официантка', example: 'The waitress recommended the fish.', topic: 'restaurant' },
  { id: 'r15', word: 'chef', transcription: '[ʃef]', translation: 'шеф-повар', example: 'The chef prepared a special dish.', topic: 'restaurant' },
  { id: 'r16', word: 'specials', transcription: '[ˈspeʃəlz]', translation: 'специальные блюда', example: 'What are today’s specials?', topic: 'restaurant' },
  { id: 'r17', word: 'side dish', transcription: '[saɪd dɪʃ]', translation: 'гарнир', example: 'Can I choose a side dish?', topic: 'restaurant' },
  { id: 'r18', word: 'appetizer', transcription: '[ˈæpɪtaɪzə]', translation: 'закуска', example: 'We will share an appetizer.', topic: 'restaurant' },
  { id: 'r19', word: 'medium rare', transcription: '[ˌmiːdiəm ˈreə]', translation: 'средней прожарки с кровью', example: 'I would like my steak medium rare.', topic: 'restaurant' },
  { id: 'r20', word: 'well done', transcription: '[ˌwel ˈdʌn]', translation: 'хорошо прожаренный', example: 'Please make the steak well done.', topic: 'restaurant' },
  { id: 'r21', word: 'spicy', transcription: '[ˈspaɪsi]', translation: 'острый', example: 'Is this dish very spicy?', topic: 'restaurant' },
  { id: 'r22', word: 'mild', transcription: '[maɪld]', translation: 'неострый / мягкий', example: 'I prefer mild food.', topic: 'restaurant' },
  { id: 'r23', word: 'dairy-free', transcription: '[ˈdeəri friː]', translation: 'без молочных продуктов', example: 'Do you have dairy-free desserts?', topic: 'restaurant' },
  { id: 'r24', word: 'gluten-free', transcription: '[ˈɡluːtən friː]', translation: 'без глютена', example: 'Is this bread gluten-free?', topic: 'restaurant' },
  { id: 'r25', word: 'still water', transcription: '[stɪl ˈwɔːtə]', translation: 'вода без газа', example: 'I would like still water, please.', topic: 'restaurant' },
  { id: 'r26', word: 'sparkling water', transcription: '[ˈspɑːklɪŋ ˈwɔːtə]', translation: 'газированная вода', example: 'Can we have sparkling water?', topic: 'restaurant' },
  { id: 'r27', word: 'receipt', transcription: '[rɪˈsiːt]', translation: 'чек', example: 'Could I get a receipt?', topic: 'restaurant' },
  { id: 'r28', word: 'split the bill', transcription: '[splɪt ðə bɪl]', translation: 'разделить счёт', example: 'Can we split the bill?', topic: 'restaurant' },
  { id: 'r29', word: 'takeaway', transcription: '[ˈteɪkəweɪ]', translation: 'еда на вынос', example: 'Can I get this as takeaway?', topic: 'restaurant' },
  { id: 'r30', word: 'service charge', transcription: '[ˈsɜːvɪs tʃɑːdʒ]', translation: 'плата за обслуживание', example: 'Is the service charge included?', topic: 'restaurant' },
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
