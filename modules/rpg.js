import { DBM } from './dbm.js';

export const GameEngine = {
    state: { xp: 0, lvl: 1, bits: 0, scene: 'SANDLOT', subTask: null },

    // The Master Action Loop (Functions in Functions)
    processAction: function(inputKey, isPressed) {
        
        const handleMovement = () => {
            // Nested If/Else for Symmetry Logic
            if (isPressed) {
                if (inputKey === 'LEFT' || inputKey === 'RIGHT') {
                    const direction = inputKey === 'LEFT' ? -1 : 1;
                    
                    // Equilibrium Check
                    if (Math.abs(player.lane) > 1.5) {
                        player.speed *= 0.8; // Friction in the "Woods"
                    } else {
                        player.lane += (direction * player.turnSpeed);
                    }
                }
            }
        };

        const handleCombat = () => {
            if (inputKey === 'B' && isPressed) {
                // Dive/Tackle Logic with Symmetry Compression
                player.isDiving = true;
                player.hitbox = DBM.sequence("oO00110").equilibrium; 
                
                setTimeout(() => {
                    player.isDiving = false;
                    player.hitbox = "oO0011001"; // Reset to standard diamond
                }, 300);
            }
        };

        // Execute Sub-functions
        handleMovement();
        handleCombat();
    }
};
