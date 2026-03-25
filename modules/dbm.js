// The Buddy System Sequencer: 101 (Left) + 102 (Center) + 101 (Right)
export const DBM = {
    // Symmetry Compression: Input a sequence, get the Equilibrium & Mirrored version
    sequence: (str) => {
        const center = str.length / 2;
        const left = str;
        const equilibrium = str.split('').reverse().join(''); // Reversed Mirror
        const right = equilibrium.split('').map(char => {
            // Bit-shift logic for characters A-Z, 1-9
            if (/[a-zA-Z]/.test(char)) return String.fromCharCode(char.charCodeAt(0) + 1);
            if (/[0-9]/.test(char)) return (parseInt(char) + 1) % 10;
            return char;
        }).join('');
        return { left, equilibrium, right };
    },

    // Bit-Shift Sequencer for the "Diamond" nodes
    shift: (val, step) => (val << step) | (val >> (32 - step))
};
