/**
 * Seven Nights of the Comet - Story Data
 * All dialog nodes, choices, and endings
 */

const STORY = {
  // Prologue
  prologue: {
    bg: 'station',
    speaker: 'mem',
    text: 'Двенадцать лет назад я дал обещание под хвостом той кометы. Теперь она возвращается — и я тоже.'
  },
  
  night1_intro: {
    bg: 'street',
    sprites: [{ pos: 'c', img: 'rio_joy' }],
    speaker: 'rio',
    text: 'Ты вернулся! Я знала, что ты придёшь...'
  },
  
  night1_choice: {
    type: 'choice',
    choices: [
      { text: '«Я помню наше обещание»', next: 'night1_rio_good', affinity: { rio: 15 } },
      { text: '«Многое изменилось»', next: 'night1_rio_neutral', affinity: { rio: 5 } }
    ]
  },
  
  night1_rio_good: {
    bg: 'cafe',
    sprites: [{ pos: 'l', img: 'rio_blush', speak: true }],
    speaker: 'rio',
    text: 'Я каждый день смотрела на небо. Ждала тебя.'
  },
  
  night1_rio_neutral: {
    bg: 'cafe',
    sprites: [{ pos: 'l', img: 'rio_blush', dim: true }],
    speaker: 'rio',
    text: 'Да... время идёт. Но некоторые вещи не меняются.'
  },
  
  night2_intro: {
    bg: 'shrine',
    sprites: [{ pos: 'r', img: 'ayana_smile' }],
    speaker: 'ayana',
    text: 'Комета Хосино... Она приносит людям правду о себе.'
  },
  
  night2_choice: {
    type: 'choice',
    choices: [
      { text: '«Какую правду?»', next: 'night2_ayana_deep', affinity: { ayana: 15 }, shard: 1 },
      { text: '«Это просто красивая легенда»', next: 'night2_ayana_light', affinity: { ayana: 5 } }
    ]
  },
  
  night2_ayana_deep: {
    bg: 'observatory',
    sprites: [{ pos: 'c', img: 'ayana_smile', speak: true }],
    speaker: 'ayana',
    text: 'Когда комета проходит близко, звёзды шепчут наши настоящие имена.'
  },
  
  night2_ayana_light: {
    bg: 'observatory',
    sprites: [{ pos: 'c', img: 'ayana_sad' }],
    speaker: 'ayana',
    text: 'Может быть. Но я верю в магию этого места.'
  },
  
  night3_intro: {
    bg: 'pier',
    sprites: [{ pos: 'l', img: 'miyu_calm' }],
    speaker: 'miyu',
    text: '...'
  },
  
  night3_choice: {
    type: 'choice',
    choices: [
      { text: '«Тишина тоже говорит»', next: 'night3_miyu_good', affinity: { miyu: 15 } },
      { text: '«Что случилось?»', next: 'night3_miyu_neutral', affinity: { miyu: 5 } }
    ]
  },
  
  night3_miyu_good: {
    bg: 'pier',
    sprites: [{ pos: 'l', img: 'miyu_calm', speak: true }],
    speaker: 'miyu',
    text: 'Ты... понимаешь. Спасибо.'
  },
  
  night3_miyu_neutral: {
    bg: 'pier',
    sprites: [{ pos: 'l', img: 'miyu_sad' }],
    speaker: 'miyu',
    text: 'Ничего. Просто смотрю на воду.'
  },
  
  // Shard collection scenes
  shard_scene1: {
    bg: 'festival',
    speaker: 'mem',
    text: '💠 Осколок памяти найден. Детский смех на летнем фестивале.'
  },
  
  shard_scene2: {
    bg: 'shrine',
    speaker: 'mem',
    text: '💠 Осколок памяти найден. Молитва у древнего камня.'
  },
  
  shard_scene3: {
    bg: 'observatory',
    speaker: 'mem',
    text: '💠 Осколок памяти найден. Телескоп показывает прошлое.'
  },
  
  // Final night
  final_night: {
    bg: 'comet',
    speaker: 'mem',
    text: 'Комета здесь. Семь ночей прошли. Пришло время выбрать.'
  },
  
  final_choice: {
    type: 'choice',
    choices: [
      { text: '✦ Рио — детское обещание', next: 'ending_rio', flag: 'choseRio' },
      { text: '✦ Аяна — звёздная тайна', next: 'ending_ayana', flag: 'choseAyana' },
      { text: '✦ Мию — тихое понимание', next: 'ending_miyu', flag: 'choseMiyu' },
      { text: '○ Наблюдать одному', next: 'ending_alone' },
      { text: '○ Остаться друзьями', next: 'ending_friend' }
    ]
  },
  
  // Endings
  ending_rio: { type: 'ending', id: 'rio' },
  ending_ayana: { type: 'ending', id: 'ayana' },
  ending_miyu: { type: 'ending', id: 'miyu' },
  ending_alone: { type: 'ending', id: 'alone' },
  ending_friend: { type: 'ending', id: 'friend' }
};

Object.freeze(STORY);
