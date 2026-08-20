/**
 * Seven Nights of the Comet - Game Engine
 * Modular game logic with error handling
 */

class GameEngine {
  constructor() {
    this.state = {
      currentNode: 'prologue',
      affinity: { rio: 0, ayana: 0, miyu: 0 },
      shards: [],
      flags: {},
      playTime: 0,
      startTime: Date.now()
    };
    
    this.settings = {
      autoMode: false,
      textSpeed: 'normal',
      sfxVolume: 0.7,
      musicVolume: 0.5,
      reducedMotion: false
    };
    
    this.galaxy = []; // Unlocked endings
    this.currentAutoTimer = null;
    this.isTyping = false;
    this.typeWriterInterval = null;
    
    this.init();
  }
  
  init() {
    this.loadSettings();
    this.bindEvents();
    this.checkReducedMotion();
    console.log('Game engine initialized');
  }
  
  checkReducedMotion() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.settings.reducedMotion = mediaQuery.matches;
    mediaQuery.addEventListener('change', (e) => {
      this.settings.reducedMotion = e.matches;
    });
  }
  
  bindEvents() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.advance();
      }
      if (e.code === 'Escape') {
        this.toggleMenu();
      }
    });
    
    // Click to advance
    document.getElementById('stage')?.addEventListener('click', () => {
      this.advance();
    });
    
    // Menu buttons
    document.getElementById('btnMenu')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleMenu();
    });
    
    document.getElementById('btnStatus')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showStatus();
    });
  }
  
  advance() {
    if (this.isTyping) {
      this.completeTyping();
      return;
    }
    
    if (this.settings.autoMode) {
      this.clearAutoTimer();
    }
    
    // Process next dialog node
    this.processNode();
  }
  
  processNode() {
    try {
      const node = STORY[this.state.currentNode];
      if (!node) {
        console.error('Node not found:', this.state.currentNode);
        return;
      }
      
      if (node.type === 'choice') {
        this.showChoices(node.choices);
        return;
      }
      
      if (node.type === 'ending') {
        this.showEnding(node.id);
        return;
      }
      
      this.displayDialog(node);
      
    } catch (error) {
      console.error('Error processing node:', error);
      this.showError('Произошла ошибка при загрузке сцены');
    }
  }
  
  displayDialog(node) {
    const dialog = document.getElementById('dialog');
    const nameplate = document.getElementById('nameplate');
    const dtext = document.getElementById('dtext');
    const advMark = document.getElementById('advMark');
    
    dialog?.classList.remove('hidden', 'mem');
    advMark?.classList.remove('show');
    
    // Set nameplate
    if (node.speaker) {
      const charConfig = GAME_CONFIG.characters[node.speaker] || {};
      nameplate.textContent = charConfig.name || node.speaker;
      nameplate.style.setProperty('--c', charConfig.color || '#7d8cff');
      nameplate.classList.toggle('memP', node.speaker === 'mem');
      
      if (node.speaker === 'mem') {
        dialog?.classList.add('mem');
      }
    } else {
      nameplate.textContent = '';
      nameplate.classList.remove('memP');
    }
    
    // Type writer effect
    this.typeText(node.text || '', dtext);
    
    // Update background and sprites
    if (node.bg) {
      this.setBackground(node.bg);
    }
    
    if (node.sprites !== undefined) {
      this.setSprites(node.sprites);
    }
    
    // Auto mode
    if (this.settings.autoMode && !node.choices) {
      this.setAutoTimer();
    }
  }
  
  typeText(text, element) {
    if (!element) return;
    
    this.isTyping = true;
    element.textContent = '';
    
    const speed = GAME_CONFIG.balance.textSpeeds[this.settings.textSpeed] || 15;
    let index = 0;
    
    clearInterval(this.typeWriterInterval);
    
    this.typeWriterInterval = setInterval(() => {
      if (index < text.length) {
        element.textContent += text[index];
        index++;
      } else {
        this.completeTyping();
      }
    }, this.settings.reducedMotion ? 1 : speed);
  }
  
  completeTyping() {
    clearInterval(this.typeWriterInterval);
    this.isTyping = false;
    
    const currentNode = STORY[this.state.currentNode];
    if (currentNode && currentNode.text) {
      document.getElementById('dtext').textContent = currentNode.text;
      document.getElementById('advMark')?.classList.add('show');
    }
  }
  
  setAutoTimer() {
    this.clearAutoTimer();
    this.currentAutoTimer = setTimeout(() => {
      this.advance();
    }, GAME_CONFIG.balance.autoDelay);
  }
  
  clearAutoTimer() {
    if (this.currentAutoTimer) {
      clearTimeout(this.currentAutoTimer);
      this.currentAutoTimer = null;
    }
  }
  
  showChoices(choices) {
    const container = document.getElementById('choices');
    if (!container || !choices) return;
    
    container.innerHTML = '';
    choices.forEach((choice, index) => {
      const btn = document.createElement('button');
      btn.className = 'choiceBtn';
      btn.textContent = choice.text;
      btn.style.animationDelay = `${index * 0.1}s`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.makeChoice(choice);
      });
      btn.setAttribute('role', 'button');
      btn.setAttribute('aria-label', choice.text);
      container.appendChild(btn);
    });
  }
  
  makeChoice(choice) {
    document.getElementById('choices').innerHTML = '';
    
    // Apply effects
    if (choice.affinity) {
      Object.entries(choice.affinity).forEach(([char, value]) => {
        this.state.affinity[char] = Utils.clamp(
          (this.state.affinity[char] || 0) + value,
          0,
          GAME_CONFIG.balance.maxAffinity
        );
      });
      this.showToast('Аффинность изменена');
    }
    
    if (choice.shard && !this.state.shards.includes(choice.shard)) {
      this.state.shards.push(choice.shard);
      this.showShardToast(choice.shard);
    }
    
    if (choice.flag) {
      this.state.flags[choice.flag] = true;
    }
    
    // Move to next node
    this.state.currentNode = choice.next;
    this.processNode();
  }
  
  setBackground(bgKey) {
    const bgA = document.getElementById('bgA');
    const bgB = document.getElementById('bgB');
    const assetPath = GAME_CONFIG.assets.bg[bgKey];
    
    if (!assetPath || !bgA || !bgB) return;
    
    // Simple fade transition
    const currentBg = bgB.classList.contains('on') ? bgB : bgA;
    const nextBg = bgB.classList.contains('on') ? bgA : bgB;
    
    nextBg.style.backgroundImage = `url('${assetPath}')`;
    nextBg.classList.add('on');
    
    setTimeout(() => {
      currentBg.classList.remove('on');
    }, GAME_CONFIG.balance.fadeDuration);
  }
  
  setSprites(spritesConfig) {
    const layer = document.getElementById('spriteLayer');
    if (!layer) return;
    
    layer.innerHTML = '';
    
    if (!spritesConfig) return;
    
    spritesConfig.forEach((sprite, index) => {
      const el = document.createElement('div');
      el.className = `sprite pos-${sprite.pos || 'c'} shown`;
      if (sprite.dim) el.classList.add('dim');
      if (sprite.speak) el.classList.add('speak');
      
      const img = document.createElement('img');
      img.src = GAME_CONFIG.assets.char[sprite.img] || '';
      img.alt = sprite.img || '';
      img.loading = 'lazy';
      
      el.appendChild(img);
      layer.appendChild(el);
    });
  }
  
  showToast(message) {
    const container = document.getElementById('toasts');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.remove(), 2200);
  }
  
  showShardToast(shardId) {
    const overlay = document.getElementById('shardOv');
    const title = document.getElementById('shardTitle');
    const count = document.getElementById('shardCount');
    
    if (!overlay || !title || !count) return;
    
    title.textContent = `Осколок памяти #${this.state.shards.length}`;
    count.textContent = `${this.state.shards.length} / ${GAME_CONFIG.balance.totalShards}`;
    
    overlay.classList.remove('hidden');
    
    const hideHandler = () => {
      overlay.classList.add('hidden');
      overlay.removeEventListener('click', hideHandler);
    };
    overlay.addEventListener('click', hideHandler);
  }
  
  toggleMenu() {
    const menu = document.getElementById('menuOv');
    if (!menu) return;
    
    const isHidden = menu.classList.contains('hidden');
    menu.classList.toggle('hidden', !isHidden);
    
    if (isHidden) {
      this.updateMenuLabels();
    }
  }
  
  updateMenuLabels() {
    const autoBtn = document.getElementById('mAuto');
    if (autoBtn) {
      autoBtn.textContent = ` Авто-режим: ${this.settings.autoMode ? 'вкл' : 'выкл'}`;
    }
  }
  
  showStatus() {
    const overlay = document.getElementById('statusOv');
    const body = document.getElementById('statusBody');
    const shardRow = document.getElementById('shardRow');
    
    if (!overlay || !body || !shardRow) return;
    
    // Build character list
    body.innerHTML = Object.entries(GAME_CONFIG.characters).map(([key, config]) => {
      const affinity = this.state.affinity[key] || 0;
      return `
        <div class="charRow">
          <div style="--c:${config.color}" class="nm">${config.name}</div>
          <div class="role">${config.role}</div>
          <div class="heartBar">
            <div class="hb"><i style="width:${affinity}%"></i></div>
            <b>${affinity}%</b>
          </div>
        </div>
      `;
    }).join('');
    
    // Build shard display
    shardRow.innerHTML = Array(GAME_CONFIG.balance.totalShards).fill(0).map((_, i) => {
      const got = this.state.shards[i] ? 'got' : '';
      return `<span class="${got}">💠</span>`;
    }).join('');
    
    overlay.classList.remove('hidden');
  }
  
  save(slot = 0) {
    const saveData = {
      version: GAME_CONFIG.version,
      state: Utils.deepClone(this.state),
      settings: Utils.deepClone(this.settings),
      timestamp: Date.now(),
      slot
    };
    
    const saves = Utils.storage.get('cometSaves', {});
    saves[slot] = saveData;
    
    const success = Utils.storage.set('cometSaves', saves);
    if (success) {
      this.showToast('Игра сохранена');
    } else {
      this.showError('Не удалось сохранить');
    }
    return success;
  }
  
  load(slot = 0) {
    const saves = Utils.storage.get('cometSaves', {});
    const saveData = saves[slot];
    
    if (!saveData) {
      this.showError('Нет сохранения');
      return false;
    }
    
    // Version check
    if (saveData.version !== GAME_CONFIG.version) {
      console.warn('Save version mismatch');
    }
    
    this.state = Utils.deepClone(saveData.state);
    this.settings = { ...this.settings, ...saveData.settings };
    
    this.toggleMenu();
    this.processNode();
    this.showToast('Игра загружена');
    return true;
  }
  
  showEnding(endingId) {
    const overlay = document.getElementById('endOv');
    const title = document.getElementById('endTitle');
    const lines = document.getElementById('endLines');
    const stats = document.getElementById('endStats');
    
    if (!overlay || !title || !lines || !stats) return;
    
    const endingConfig = GAME_CONFIG.endings[endingId] || GAME_CONFIG.endings.alone;
    
    // Set background
    const bgAsset = GAME_CONFIG.assets.bg[endingConfig.bg];
    if (bgAsset) {
      overlay.style.backgroundImage = `url('${bgAsset}')`;
    }
    
    title.textContent = endingConfig.title;
    
    // Generate ending text based on state
    lines.innerHTML = this.generateEndingText(endingId);
    
    // Stats
    const playMinutes = Math.floor((Date.now() - this.state.startTime) / 60000);
    stats.innerHTML = `
      Время игры: ${playMinutes} мин<br>
      Осколки: ${this.state.shards.length}/${GAME_CONFIG.balance.totalShards}<br>
      Дата: ${Utils.formatTime(new Date())}
    `;
    
    // Add to galaxy
    if (!this.galaxy.includes(endingId)) {
      this.galaxy.push(endingId);
      Utils.storage.set('cometGalaxy', this.galaxy);
    }
    
    overlay.classList.remove('hidden');
  }
  
  generateEndingText(endingId) {
    const texts = {
      rio: '<p>Вы выбрали остаться с Рио. Детское обещание наконец исполнено.</p>',
      ayana: '<p>Аяна открывает вам свою тайну. Звёзды свидетельствуют вашему выбору.</p>',
      miyu: '<p>Тихое понимание без слов. Иногда это важнее любых признаний.</p>',
      alone: '<p>Вы наблюдаете комету в одиночестве. Некоторые пути нужно проходить одному.</p>',
      friend: '<p>Дружба — тоже форма любви. Фестиваль продолжается.</p>'
    };
    return texts[endingId] || texts.alone;
  }
  
  showError(message) {
    console.error(message);
    this.showToast('⚠ ' + message);
  }
  
  loadSettings() {
    const saved = Utils.storage.get('cometSettings');
    if (saved) {
      this.settings = { ...this.settings, ...saved };
    }
    
    // Load galaxy
    this.galaxy = Utils.storage.get('cometGalaxy', []);
  }
  
  saveSettings() {
    Utils.storage.set('cometSettings', this.settings);
  }
  
  reset() {
    this.state = {
      currentNode: 'prologue',
      affinity: { rio: 0, ayana: 0, miyu: 0 },
      shards: [],
      flags: {},
      playTime: 0,
      startTime: Date.now()
    };
    this.clearAutoTimer();
    this.completeTyping();
  }
}

// Make globally available
window.GameEngine = GameEngine;
