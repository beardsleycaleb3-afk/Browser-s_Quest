import { dbm } from './dbm.js';
import * as GameLogic from './rpg.js'; // We'll use a unified logic file

let currentType = null;
let inMenu = true;
const ctx = document.getElementById('gameCanvas').getContext('2d');

export function loadSelectedRom(type) {
    currentType = type;
    inMenu = false;
    document.getElementById('romSelectorEl').style.display = 'none';
    document.getElementById('gameUIEl').hidden = false;
    GameLogic.init(type);
}

export function handleInput(key) {
    if (inMenu) return;
    GameLogic.update(key, currentType);
}

function loop() {
    ctx.clearRect(0, 0, 300, 300);
    if (!inMenu) GameLogic.draw(ctx, currentType);
    requestAnimationFrame(loop);
}
loop();
