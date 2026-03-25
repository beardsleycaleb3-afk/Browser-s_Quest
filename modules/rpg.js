import { dbm } from './dbm.js';

let obj = { x: 15, y: 15, color: '#49bbc0' };

export function init(type) {
    obj.x = 15; obj.y = 15;
    if (type === 'zombie') obj.color = '#ff4444';
    if (type === 'side') obj.color = '#ffff00';
    if (type === 'pacman') obj.color = '#ffcc00';
    if (type === 'football') obj.color = '#ffffff';
}

export function update(key, type) {
    // Shared D-Pad Control
    if (key === 'UP') obj.y -= 1;
    if (key === 'DOWN') obj.y += 1;
    if (key === 'LEFT') obj.x -= 1;
    if (key === 'RIGHT') obj.x += 1;

    // A-Button "Sultan Power"
    if (key === 'A') {
        const power = dbm.execute('n(u+)');
        console.log("Sultan Power Level:", dbm.fromFixed(power));
    }
}

export function draw(ctx, type) {
    // Draw the World
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, 300, 300);
    
    // Draw Player (Scaled to your 300x300 screen)
    ctx.fillStyle = obj.color;
    let size = (type === 'pacman') ? 12 : 20;
    ctx.fillRect(obj.x * 9.3, obj.y * 9.3, size, size);
    
    // Game-Specific Overlays
    ctx.fillStyle = 'white';
    ctx.font = '10px monospace';
    ctx.fillText(`MODE: ${type.toUpperCase()}`, 10, 20);
}
