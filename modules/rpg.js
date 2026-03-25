// ====================== UPGRADED XENON QUEST RPG ======================
// modules/rpg.js
// Original feel preserved + Sultan 47 upgrades (1-byte tiles, 8.8 fixed-point, DBM, diamond visuals)

import { dbm } from './dbm.js';

// Your exact 3-layer diamond point clouds (visual effect only)
const outerPointsFull = [ /* paste your full outerPointsFull array here */ ];
const middlePoints = [ /* paste your full middlePoints array here */ ];
const innerDiamondPoints = [ /* paste your full innerDiamondPoints array here */ ];

// 1-BYTE PER TILE MAP EXAMPLE (960 tiles max)
let currentMap = new Uint8Array(960); // flat 30×32 map for efficiency
let playerPos = { x: 15, y: 15 };     // tile coordinates

let player = {
  hp: 40,
  maxHp: 40,
  lvl: 1,
  atk: 6,
  gold: 120
};

export function initRPG() {
  playerStatsEl.textContent = `HP:\( {player.hp}/ \){player.maxHp}  LV:${player.lvl}`;
  showText('Welcome to Xenon Quest RPG — Sultan 47 Edition');
  // Seed a simple map (expandable later)
  currentMap.fill(1); // floor
  currentMap[15 + 15*32] = 0; // start position marker
}

export function drawRPG() {
  ctx.clearRect(0, 0, 300, 300);

  // Background: rotating diamond point clouds (visual only)
  drawDiamondLayer(outerPointsFull, '#0f0', 5.8, Date.now() / 800);
  drawDiamondLayer(middlePoints, '#0ff', 13.5, Date.now() / 1200);
  drawDiamondLayer(innerDiamondPoints, '#f0f', 65, Date.now() / 600);

  // Simple 1-byte tile map draw (demo)
  ctx.fillStyle = '#555';
  for (let i = 0; i < 960; i++) {
    const x = (i % 32) * 9.375;
    const y = Math.floor(i / 32) * 9.375;
    if (currentMap[i] === 0) ctx.fillStyle = '#8bac0f'; // grass
    ctx.fillRect(x, y, 9.375, 9.375);
    ctx.fillStyle = '#555';
  }

  // Player (pixel perfect)
  ctx.fillStyle = '#f33';
  ctx.fillRect(playerPos.x * 9.375 + 2, playerPos.y * 9.375 + 2, 18, 18);
}

function drawDiamondLayer(points, color, scale, rotation) {
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.2;
  const cx = 150, cy = 150;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const angle = rotation * 0.001;
    const x1 = cx + (p1.x * Math.cos(angle) - p1.y * Math.sin(angle)) * scale;
    const y1 = cy + (p1.x * Math.sin(angle) + p1.y * Math.cos(angle)) * scale;
    const x2 = cx + (p2.x * Math.cos(angle) - p2.y * Math.sin(angle)) * scale;
    const y2 = cy + (p2.x * Math.sin(angle) + p2.y * Math.cos(angle)) * scale;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// Touch movement (8.8 fixed-point ready)
export function moveRpg(dx, dy) {
  const speed = dbm.fromFixed(dbm.toFixed(1.0)); // smooth fixed-point speed
  playerPos.x = Math.max(0, Math.min(31, playerPos.x + dx));
  playerPos.y = Math.max(0, Math.min(29, playerPos.y + dy));

  // Occasional random encounter using DBM
  if (Math.random() < 0.12) startBattle();
}

function startBattle() {
  enemyStatsEl.style.display = 'block';
  enemyStatsEl.textContent = 'Goblin HP:25';
  showText('A Goblin appears! Mirror damage active');
  dbm.runGodString(); // Sultan 47 prophecy flash
}

export function triggerRPGAction() {
  // A button = attack / interact
  const dmgFP = dbm.execute('n(oA(?A:+S))u(o5(W-))'); // full DBM chain
  const dmg = Math.floor(dbm.fromFixed(dmgFP));
  showText(`Mirror strike! ${dmg} dmg`);
  // In real battle this would reduce enemy HP
}

export function triggerRPGMenu() {
  showText('Party / Inventory menu (upgrade coming)');
}

// Helper for main.js
export function getRPGStats() {
  return player;
}

function showText(txt) {
  const el = document.getElementById('textOutputEl');
  el.textContent = txt;
  el.style.display = 'block';
  setTimeout(() => el.style.opacity = '0', 2200);
}
