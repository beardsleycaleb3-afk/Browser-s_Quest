import { dbm } from './modules/dbm.js';
import * as RPG from './modules/rpg.js';

let currentRomType = null;
let inRomSelector = true;
const ctx = document.getElementById('gameCanvas').getContext('2d');

const loadedRows = [
    { id: 'rpg', name: 'Xenon Quest RPG', type: 'rpg' },
    { id: 'zombie', name: 'Brain Eater 3D', type: 'zombie' },
    { id: 'side', name: 'Ninja Shadow Run', type: 'side' },
    { id: 'pacman', name: 'Ghost Maze DX', type: 'pacman' },
    { id: 'football', name: 'Super Striker', type: 'football' }
];

export function loadSelectedRom(index) {
    const rom = loadedRows[index];
    currentRomType = rom.type;
    inRomSelector = false;
    document.getElementById('romSelectorEl').style.display = 'none';
    document.getElementById('gameUIEl').hidden = false;
    
    // Initialize specific game logic
    if (currentRomType === 'rpg') RPG.initRPG();
    showText("LOADING: " + rom.name);
}

export function handleInput(key) {
    if (inRomSelector) return;
    
    if (currentRomType === 'rpg') {
        if (key === 'UP') RPG.moveRpg(0, -1);
        if (key === 'DOWN') RPG.moveRpg(0, 1);
        if (key === 'LEFT') RPG.moveRpg(-1, 0);
        if (key === 'RIGHT') RPG.moveRpg(1, 0);
        if (key === 'A') RPG.triggerRPGAction();
    } else {
        showText(currentRomType + " action: " + key);
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, 300, 300);
    if (!inRomSelector) {
        if (currentRomType === 'rpg') RPG.drawRPG(ctx);
    }
    requestAnimationFrame(gameLoop);
}
gameLoop();
