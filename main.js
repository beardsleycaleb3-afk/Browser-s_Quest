import { dbm } from './dbm.js';
import * as ConsoleCore from './rpg.js';

let activeGame = null;
let isMenu = true;
const ctx = document.getElementById('gameCanvas').getContext('2d');

// Unified Button Listener
export function handleInput(key) {
    if (key === 'START' && !isMenu) {
        showText("PAUSED"); // Global Pause logic
        return;
    }
    
    if (isMenu) return; // Menu navigation handled by selector
    
    // Pass the key to the game engine
    ConsoleCore.update(key, activeGame);
}

export function loadSelectedRom(type) {
    activeGame = type;
    isMenu = false;
    document.getElementById('romSelectorEl').style.display = 'none';
    document.getElementById('gameUIEl').hidden = false;
    ConsoleCore.init(type);
}

function render() {
    ctx.clearRect(0, 0, 300, 300);
    if (!isMenu) ConsoleCore.draw(ctx, activeGame);
    requestAnimationFrame(render);
}
render();
