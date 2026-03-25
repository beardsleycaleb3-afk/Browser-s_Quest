import { dbm } from './dbm.js';

let playerPos = { x: 15, y: 15 };
let player = { hp: 40, maxHp: 40, lvl: 1 };

export function initRPG() {
    const stats = document.getElementById('playerStatsEl');
    stats.textContent = `HP: ${player.hp}/${player.maxHp} LV: ${player.lvl}`;
    stats.style.display = 'block';
}

export function drawRPG(ctx) {
    // Draw Background Grid
    ctx.fillStyle = '#222';
    for(let i=0; i<32; i++) {
        for(let j=0; j<32; j++) {
            if((i+j)%2==0) ctx.fillRect(i*9.375, j*9.375, 9, 9);
        }
    }
    
    // Draw Player using DBM scaling
    ctx.fillStyle = '#49bbc0';
    ctx.fillRect(playerPos.x * 9.375, playerPos.y * 9.375, 18, 18);
}

export function moveRpg(dx, dy) {
    // Use DBM fixed-point for smooth boundary checks
    playerPos.x = Math.max(0, Math.min(31, playerPos.x + dx));
    playerPos.y = Math.max(0, Math.min(29, playerPos.y + dy));
    
    if (Math.random() < 0.05) showText("A wild glitch appears!");
}

export function triggerRPGAction() {
    [span_2](start_span)// Calculate damage using Sultan 47 Glyph Strand[span_2](end_span)
    const dmgFP = dbm.execute('n(oA(7A:+5))u'); 
    const dmg = Math.floor(dbm.fromFixed(dmgFP));
    showText(`Mirror Strike! ${dmg} dmg`);
}
