import { dbm } from './dbm.js';

let currentGame = null;
let inRomSelector = true;
const ctx = document.getElementById('gameCanvas').getContext('2d');

[span_5](start_span)// Enhanced File Loader[span_5](end_span)
export function handleRomUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            // Parses uploaded Zelda/JSON data
            const romData = JSON.parse(event.target.result);
            loadGame(romData);
        } catch (err) {
            showText("Invalid ROM: Use JSON format");
        }
    };
    reader.readAsText(file);
}

function loadGame(rom) {
    currentGame = {
        ...rom,
        x: rom.x || 15,
        y: rom.y || 15
    };
    inRomSelector = false;
    document.getElementById('romSelectorEl').style.display = 'none';
    document.getElementById('gameUIEl').hidden = false;
    showText("Welcome to " + rom.name);
}

export function handleInput(key) {
    if (inRomSelector || !currentGame) return;
    
    [span_6](start_span)// Wire D-Pad to move player[span_6](end_span)
    if (key === 'UP') currentGame.y -= 1;
    if (key === 'DOWN') currentGame.y += 1;
    if (key === 'LEFT') currentGame.x -= 1;
    if (key === 'RIGHT') currentGame.x += 1;
    
    if (key === 'A') {
        const dmg = dbm.execute(currentGame.dbm_logic || "n+");
        showText(currentGame.actionA + ": " + dbm.fromFixed(dmg) + " dmg");
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, 300, 300);
    if (!inRomSelector && currentGame) {
        ctx.fillStyle = currentGame.color || "#0f0";
        ctx.fillRect(currentGame.x * 9.375, currentGame.y * 9.375, 18, 18); [span_7](start_span)// Pixel perfect scale[span_7](end_span)
    }
    requestAnimationFrame(gameLoop);
}
gameLoop();
