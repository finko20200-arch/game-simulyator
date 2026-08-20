/**
 * Seven Nights of the Comet - Game Configuration
 * Centralized configuration for game balance and assets
 */

const GAME_CONFIG = {
  // Version for save compatibility
  version: '2.0.0',
  
  // Asset paths (local)
  assets: {
    bg: {
      station: 'assets/bg/station.png',
      street: 'assets/bg/street.png',
      cafe: 'assets/bg/cafe.png',
      shrine: 'assets/bg/shrine.png',
      pier: 'assets/bg/pier.png',
      observatory: 'assets/bg/observatory.png',
      festival: 'assets/bg/festival.png',
      comet: 'assets/bg/comet.png'
    },
    char: {
      rio_joy: 'assets/char/rio_joy.png',
      rio_blush: 'assets/char/rio_blush.png',
      ayana_smile: 'assets/char/ayana_smile.png',
      ayana_sad: 'assets/char/ayana_sad.png',
      miyu_calm: 'assets/char/miyu_calm.png',
      miyu_sad: 'assets/char/miyu_sad.png'
    }
  },
  
  // Character definitions
  characters: {
    rio: { name: 'Рио', color: '#ff8a5c', role: 'Детство' },
    ayana: { name: 'Аяна', color: '#b18cff', role: 'Загадка' },
    miyu: { name: 'Мию', color: '#7fe3e0', role: 'Тишина' },
    ren: { name: 'Рэн', color: '#6aa9ff', role: 'Связь' }
  },
  
  // Game balance
  balance: {
    maxAffinity: 100,
    totalShards: 3,
    textSpeeds: { slow: 30, normal: 15, fast: 5 },
    autoDelay: 2000,
    fadeDuration: 1100,
    spriteTransition: 600
  },
  
  // Save system
  save: {
    key: 'cometGameSave_v2',
    maxSlots: 3,
    autosaveInterval: 300000 // 5 minutes
  },
  
  // Endings
  endings: {
    rio: { title: '✦ Тёплое обещание', bg: 'comet' },
    ayana: { title: '✦ Звёздный выбор', bg: 'observatory' },
    miyu: { title: '✦ Тихое понимание', bg: 'pier' },
    alone: { title: '✦ Одинокий наблюдатель', bg: 'shrine' },
    friend: { title: '✦ Просто друзья', bg: 'festival' }
  }
};

// Freeze to prevent modifications
Object.freeze(GAME_CONFIG);
