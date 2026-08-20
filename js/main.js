/**
 * Seven Nights of the Comet - Main Entry Point
 * Initializes game and handles UI interactions
 */

let game = null;
let starAnimation = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initStarField();
  bindTitleScreen();
  bindMenuButtons();
  console.log('Seven Nights of the Comet v' + GAME_CONFIG.version);
});

/**
 * Animated star field for title screen
 */
function initStarField() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  
  function createStars() {
    stars = Array(150).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5,
      speed: 0.2 + Math.random() * 0.3,
      brightness: Math.random()
    }));
  }
  
  function animate() {
    ctx.fillStyle = '#070a26';
    ctx.fillRect(0, 0, width, height);
    
    stars.forEach(star => {
      star.y += star.speed;
      if (star.y > height) star.y = 0;
      
      star.brightness = 0.5 + Math.sin(Date.now() * 0.003 * star.speed) * 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    starAnimation = requestAnimationFrame(animate);
  }
  
  resize();
  createStars();
  animate();
  
  window.addEventListener('resize', () => {
    resize();
    createStars();
  });
}

/**
 * Title screen button handlers
 */
function bindTitleScreen() {
  const titleScreen = document.getElementById('titleScreen');
  
  document.getElementById('tNew')?.addEventListener('click', (e) => {
    e.stopPropagation();
    startNewGame();
  });
  
  document.getElementById('tCont')?.addEventListener('click', (e) => {
    e.stopPropagation();
    continueGame();
  });
  
  document.getElementById('tGal')?.addEventListener('click', (e) => {
    e.stopPropagation();
    showGallery();
  });
  
  // Click anywhere to start if no save
  titleScreen?.addEventListener('click', (e) => {
    if (e.target === titleScreen || e.target.id === 'starCanvas') {
      const saves = Utils.storage.get('cometSaves', {});
      if (Object.keys(saves).length > 0) {
        continueGame();
      } else {
        startNewGame();
      }
    }
  });
}

/**
 * Menu button handlers
 */
function bindMenuButtons() {
  // Save/Load
  document.getElementById('mSave')?.addEventListener('click', (e) => {
    e.stopPropagation();
    game?.save(0);
  });
  
  document.getElementById('mLoad')?.addEventListener('click', (e) => {
    e.stopPropagation();
    game?.load(0);
  });
  
  // Auto mode toggle
  document.getElementById('mAuto')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (game) {
      game.settings.autoMode = !game.settings.autoMode;
      game.updateMenuLabels();
      game.saveSettings();
    }
  });
  
  // Status
  document.getElementById('mStatus')?.addEventListener('click', (e) => {
    e.stopPropagation();
    game?.showStatus();
  });
  
  // Title screen
  document.getElementById('mTitle')?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToTitle();
  });
  
  // Close menu
  document.getElementById('mClose')?.addEventListener('click', (e) => {
    e.stopPropagation();
    game?.toggleMenu();
  });
  
  // Close status overlay
  document.getElementById('sClose')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('statusOv')?.classList.add('hidden');
  });
  
  // Close gallery overlay
  document.getElementById('gClose')?.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('galOv')?.classList.add('hidden');
  });
  
  // Ending restart
  document.getElementById('endRestart')?.addEventListener('click', (e) => {
    e.stopPropagation();
    startNewGame();
  });
  
  // Ending to title
  document.getElementById('endTitleBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    goToTitle();
  });
  
  // Card overlay
  document.getElementById('cardOv')?.addEventListener('click', () => {
    document.getElementById('cardOv')?.classList.add('hidden');
  });
  
  // Shard overlay
  document.getElementById('shardOv')?.addEventListener('click', () => {
    document.getElementById('shardOv')?.classList.add('hidden');
  });
}

/**
 * Start new game
 */
function startNewGame() {
  document.getElementById('titleScreen')?.classList.add('hidden');
  document.getElementById('endOv')?.classList.add('hidden');
  
  game = new GameEngine();
  game.reset();
  game.processNode();
  
  // Update shard counter
  updateShardCounter();
}

/**
 * Continue from save
 */
function continueGame() {
  const saves = Utils.storage.get('cometSaves', {});
  const latestSlot = Object.keys(saves).sort().pop();
  
  if (!latestSlot) {
    startNewGame();
    return;
  }
  
  document.getElementById('titleScreen')?.classList.add('hidden');
  document.getElementById('endOv')?.classList.add('hidden');
  
  game = new GameEngine();
  game.load(parseInt(latestSlot));
}

/**
 * Go to title screen
 */
function goToTitle() {
  document.getElementById('endOv')?.classList.add('hidden');
  document.getElementById('menuOv')?.classList.add('hidden');
  document.getElementById('titleScreen')?.classList.remove('hidden');
  
  if (game) {
    game.clearAutoTimer();
    game = null;
  }
}

/**
 * Show gallery of endings
 */
function showGallery() {
  const overlay = document.getElementById('galOv');
  const body = document.getElementById('galBody');
  
  if (!overlay || !body) return;
  
  const galaxy = Utils.storage.get('cometGalaxy', []);
  const allEndings = Object.entries(GAME_CONFIG.endings);
  
  body.innerHTML = allEndings.map(([key, config]) => {
    const unlocked = galaxy.includes(key);
    return `
      <div class="galItem ${unlocked ? '' : 'locked'}">
        <div class="gi">${unlocked ? '✦' : '🔒'}</div>
        <div>
          <div class="gt">${config.title}</div>
          <div class="gd">${unlocked ? 'Открыто' : 'Заблокировано'}</div>
        </div>
      </div>
    `;
  }).join('');
  
  overlay.classList.remove('hidden');
}

/**
 * Update shard counter in topbar
 */
function updateShardCounter() {
  const pill = document.getElementById('shardPill');
  if (pill && game) {
    pill.textContent = `💠 ${game.state.shards.length} / ${GAME_CONFIG.balance.totalShards}`;
  }
}

// Expose globally for debugging
window.startNewGame = startNewGame;
window.continueGame = continueGame;
window.goToTitle = goToTitle;
