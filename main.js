// BROWSER'S QUEST - MOBILE BINARY MAX (COMPLETE)
const W = 300, H = 300;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// BINARY BUFFERS - MAX CAPACITY
const player = new Float32Array(8);           // x,y,vx,vy,w,h,facing,anim
const camera = new Float32Array(1);           // x
const particleBuffer = new Float32Array(2048*5); // 2048 particles max
let particleCount = 0;
let frames = 0, lastTime = performance.now();

// TOUCH INPUT (phone only)
const inputState = new Uint8Array(1); // bit0=left,1=right,2=jump,3=fire

// FRAME TRACKER
const metrics = { pfr: 0, fps: 0, particles: 0 };

// 255 FULL 8-BIT PATTERNS
const FULL_PATTERNS = new Uint8Array(256);
for(let i = 0; i < 256; i++) FULL_PATTERNS[i] = i;

// === TOUCH PHYSICS ===
function updatePlayer() {
  // LEFT / RIGHT
  if (inputState[0] & 1) { 
    player[2] -= 0.4; 
    player[6] = -1; 
  } // left
  if (inputState[0] & 2) { 
    player[2] += 0.4; 
    player[6] = 1; 
  } // right
  player[2] *= 0.85; // friction
  
  // JUMP
  if ((inputState[0] & 4) && player[1] + player[5] >= 240) {
    player[3] = -9; // jump force
    spawnParticles(player[0] + 12, player[1] + 32, 24); // dust
  }
  
  // GRAVITY + MOVE
  player[3] += 0.5; // gravity
  player[0] += player[2]; // x += vx
  player[1] += player[3]; // y += vy
  
  // COLLISION
  if (player[1] + player[5] >= 240) {
    player[1] = 240 - player[5];
    player[3] = 0;
  }
  if (player[0] < 0) player[0] = 0;
  
  // CAMERA
  camera[0] += (player[0] - 100 - camera[0]) * 0.1;
  if (camera[0] < 0) camera[0] = 0;
}

// === PARTICLES ===
function spawnParticles(x, y, count) {
  for (let i = 0; i < count && particleCount < 2048; i++, particleCount++) {
    const idx = particleCount * 5;
    particleBuffer[idx + 0] = x;
    particleBuffer[idx + 1] = y;
    particleBuffer[idx + 2] = (Math.random() - 0.5) * 6;
    particleBuffer[idx + 3] = (Math.random() - 0.5) * 6;
    particleBuffer[idx + 4] = 45 + Math.random() * 15;
  }
}

function updateParticles() {
  for (let i = particleCount - 1; i >= 0; i--) {
    const idx = i * 5;
    particleBuffer[idx + 0] += particleBuffer[idx + 2];
    particleBuffer[idx + 1] += particleBuffer[idx + 3];
    particleBuffer[idx + 2] *= 0.98;
    particleBuffer[idx + 3] += 0.08;
    particleBuffer[idx + 4]--;
    
    if (particleBuffer[idx + 4] <= 0) {
      particleCount--;
      particleBuffer.copyWithin(idx * 5, (idx + 1) * 5);
    }
  }
  metrics.particles = particleCount;
}

// === RENDER ===
function draw() {
  // SKY
  ctx.fillStyle = '#5c94fc';
  ctx.fillRect(0, 0, W, H);
  
  ctx.save();
  ctx.translate(-camera[0], 0);
  
  // GROUND LINE
  ctx.fillStyle = '#6b8c42';
  ctx.fillRect(0, 240, 3000, 60);
  
  // 255 PATTERN TILES (animated)
  for (let x = 0; x < 500; x += 10) {
    const patternId = (x + frames * 0.5) % 256;
    const pattern = FULL_PATTERNS[patternId];
    for (let bit = 0; bit < 8; bit++) {
      ctx.fillStyle = (pattern & (1 << bit)) ? '#8b4513' : '#5c94fc';
      ctx.fillRect(x + bit * 4, 232, 4, 8);
    }
  }
  
  // BROWSER (your character)
  const px = player[0], py = player[1];
  ctx.save();
  if (player[6] < 0) {
    ctx.translate(px + player[4], py);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(px, py);
  }
  
  // SHELL
  ctx.fillStyle = '#2e8b57';
  ctx.fillRect(2, 8, 20, 20);
  
  // SPIKES
  ctx.fillStyle = '#ffff00';
  ctx.fillRect(2, 0, 8, 8);
  ctx.fillRect(14, 0, 8, 8);
  
  // HEAD
  ctx.fillStyle = '#ffdead';
  ctx.fillRect(10, 4, 12, 10);
  ctx.fillStyle = '#ff4500';
  ctx.fillRect(12, 2, 8, 4);
  
  ctx.restore();
  ctx.restore();
  
  // PARTICLES
  for (let i = 0; i < particleCount; i++) {
    const idx = i * 5;
    ctx.fillStyle = '#ffff88';
    ctx.globalAlpha = particleBuffer[idx + 4] / 60;
    ctx.fillRect(particleBuffer[idx + 0], particleBuffer[idx + 1], 3, 3);
  }
  ctx.globalAlpha = 1;
  
  // HUD
  ctx.fillStyle = 'white';
  ctx.font = 'bold 12px Courier New';
  ctx.textAlign = 'left';
  ctx.fillText(`PFR:${metrics.pfr.toFixed(1)}ms`, 8, 18);
  ctx.fillText(`FPS:${metrics.fps.toFixed(0)}`, 8, 32);
  ctx.fillText(`PART:${metrics.particles}`, 8, 46);
}

// === FRAME TRACKER ===
function updateMetrics(now) {
  metrics.pfr = now - lastTime;
  metrics.fps = 1000 / metrics.pfr;
  lastTime = now;
  
  if (frames % 120 === 0) {
    console.table([{
      'PFR': metrics.pfr.toFixed(1) + 'ms',
      'FPS': metrics.fps.toFixed(0),
      'PARTICLES': metrics.particles,
      'X': player[0].toFixed(1)
    }]);
  }
}

// === MAIN LOOP ===
function loop(now) {
  updateMetrics(now);
  updatePlayer();
  updateParticles();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

// === TOUCH ONLY ===
function setupTouch() {
  const buttons = [
    { id: 'dpadLeft', bit: 1 << 0 },
    { id: 'dpadRight', bit: 1 << 1 },
    { id: 'btnA', bit: 1 << 2 },
    { id: 'btnB', bit: 1 << 3 }
  ];
  
  buttons.forEach(({ id, bit }) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      inputState[0] |= bit;
    }, { passive: false });
    
    el.addEventListener('touchend', (e) => {
      e.preventDefault();
      inputState[0] &= ~bit;
    }, { passive: false });
  });
}

// === START ===
player[0] = 50;
player[1] = 208;
player[4] = 24;
player[5] = 32;
player[6] = 1;

setupTouch();
spawnParticles(80, 240, 64);

requestAnimationFrame(loop);

console.log("BINARY QUEST MAX - 255 PATTERNS - PHONE TOUCH");
