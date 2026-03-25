// --- SULTAN 47 DBM CORE ---
export class DBM {
    constructor() {
        this.acc = 0; 
        this.buddyMatrix = new Uint8Array(256);
        for (let n = 0; n < 256; n++) {
            let rev = 0, v = n;
            for (let i = 0; i < 8; i++) {
                rev = (rev << 1) | (v & 1);
                v >>= 1;
            }
            this.buddyMatrix[n] = rev;
        }
    }
    toFixed(val) { return Math.floor(val * 256) & 0xFFFF; }
    fromFixed(fp) { return (fp >> 8) + ((fp & 0xFF) / 256); }
    
    // Execute Sultan Glyph Strands
    execute(strand) {
        if (strand.includes('u')) this.acc = this.toFixed(this.buddyMatrix[10]);
        if (strand.includes('+')) this.acc += this.toFixed(1);
        return this.acc;
    }
}
export const dbm = new DBM();
