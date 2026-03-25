// ====================== SULTAN CONSOLE - main.js ======================
// Central brain - touch-only, original ROM names, upgrade-ready

// DOM references
const romSelectorEl = document.getElementById('romSelectorEl');
const gameUIEl = document.getElementById('gameUIEl');
const gameCanvas = document.getElementById('gameCanvas');
const ctx = gameCanvas.getContext('2d');
const gameTitleEl = document.getElementById('gameTitleEl');
const playerStatsEl = document.getElementById('playerStatsEl');
const enemyStatsEl = document.getElementById('enemyStatsEl');
const textOutputEl = document.getElementById('textOutputEl');
const romListEl = document.getElementById('romListEl');
const uploadRomInputEl = document.getElementById('uploadRomInputEl');

// Touch buttons
const btnAEl = document.getElementById('btnAEl');
const btnBEl = document.getElementById('btnBEl');

// Game state
let currentRomType = null;
let inRomSelector = true;
let loadedRoms = [
  { id: 'rpg', name: 'Xenon Quest RPG', type: 'rpg' },
  { id: 'zombie', name: 'Brain Eater 3D', type: 'zombie' },
  { id: 'side', name: 'Ninja Shadow Run', type: 'side' },
  { id: 'pacman', name: 'Ghost Maze DX', type: 'pacman' },
  { id: 'football', name: 'Super Striker', type: 'football' }
];

// ====================== ROM SELECTOR ======================
function renderRomSelector() {
  romListEl.innerHTML = '';
  loadedRoms.forEach((rom, idx) => {
    const div = document.createElement('div');
    div.className = 'rom-slot';
    div.textContent = rom.name;
    div.onclick = () => loadSelectedRom(idx);
    romListEl.appendChild(div);
  });
}

function handleRomUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  loadedRoms.push({
    id: 'custom_' + Date.now(),
    name: file.name.substring(0, 20),
    type: 'custom'
  });
  renderRomSelector();
}

function loadSelectedRom(index) {
  const rom = loadedRoms[index];
  currentRomType = rom.type;
  inRomSelector = false;

  romSelectorEl.style.display = 'none';
  gameUIEl.hidden = false;
  gameTitleEl.textContent = rom.name;

  // Clear previous game state
  textOutputEl.style.display = 'none';
  enemyStatsEl.style.display = 'none';

  // Launch the correct game (upgraded stubs)
  if (currentRomType === 'rpg') initRPG();
  else if (currentRomType === 'zombie') initZombie();
  else if (currentRomType === 'side') initSide();
  else if (currentRomType === 'pacman') initPacman();
  else if (currentRomType === 'football') initFootball();
}

// ====================== GAME STUBS (we will upgrade these next) ======================
function initRPG() {
  playerStatsEl.textContent = 'HP:40/40  LV:1';
  showText('Welcome to Xenon Quest RPG');
  // Upgrades (1-byte tiles, fixed-point, buddy matrix) will go here later
}

function initZombie() { showText('Brain Eater 3D - Touch A to shoot'); }
function initSide()   { showText('Ninja Shadow Run - Touch A to jump'); }
function initPacman() { showText('Ghost Maze DX - Touch arrows to move'); }
function initFootball(){ showText('Super Striker - Touch A to kick'); }

// ====================== INPUT - TOUCH ONLY ======================
function handleInput(key) {
  if (inRomSelector) return;

  if (key === 'A') {
    // Sultan 47 upgrade hook - will be used by each game
    if (currentRomType === 'rpg') triggerRPGAction();
    else if (currentRomType === 'zombie') triggerZombieAction();
    else if (currentRomType === 'side') triggerSideAction();
    else if (currentRomType === 'pacman') triggerPacmanAction();
    else if (currentRomType === 'football') triggerFootballAction();
  }

  if (key === 'B') {
    // Back / secondary action
    if (currentRomType === 'rpg') showText('Party menu coming soon...');
    else showText('B pressed');
  }
}

// Simple action placeholders (we will expand with upgrades)
function triggerRPGAction() { showText('RPG Action - Prophecy ready'); }
function triggerZombieAction() { showText('Shoot!'); }
function triggerSideAction() { showText('Jump!'); }
function triggerPacmanAction() { showText('Move!'); }
function triggerFootballAction() { showText('Kick!'); }

// ====================== COMMON HELPERS ======================
function showText(txt) {
  textOutputEl.textContent = txt;
  textOutputEl.style.display = 'block';
  textOutputEl.style.opacity = '1';
  setTimeout(() => { textOutputEl.style.opacity = '0'; }, 2200);
}

// ====================== MAIN LOOP ======================
function gameLoop() {
  ctx.clearRect(0, 0, 300, 300);
  // Each game will draw here later
  requestAnimationFrame(gameLoop);
}

// ====================== TOUCH LISTENERS ======================
btnAEl.addEventListener('pointerdown', () => handleInput('A'));
btnBEl.addEventListener('pointerdown', () => handleInput('B'));

// D-Pad will be wired per-game later (for now just log)
document.querySelectorAll('#dpadCtn > div').forEach(btn => {
  btn.addEventListener('pointerdown', () => {
    if (inRomSelector) return;
    showText('D-Pad pressed - movement coming in next upgrade');
  });
});

// ====================== UPLOAD & START ======================
uploadRomInputEl.addEventListener('change', handleRomUpload);

// Start the console
renderRomSelector();
gameLoop();

console.log('%c✅ Sultan Console ready - touch only, original games, upgrade path open', 'color:#9bbc0f; font-family:monospace');
