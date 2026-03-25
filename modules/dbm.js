// ====================== SULTAN 47 BINARY MIRROR CORE ======================
// modules/dbm.js
// 255-unit buddy matrix + 8.8 fixed-point + nested logic + wildcard compression
// Phone-optimized, no keyboard, pure upgrade engine for the 5 games

export class DBM {
  constructor() {
    this.acc = 0;           // 16-bit 8.8 fixed-point accumulator
    this.carry = 0;         // Carry flag for ADC/SBC
    this.stack = [];        // For nested functions ( and )
    this.glyphLog = [];     // For debugging (optional)

    // 255-UNIT BUDDY MATRIX (bit-reversal mirror)
    this.buddyMatrix = new Uint8Array(256);
    for (let n = 0; n < 256; n++) {
      let rev = 0;
      let v = n;
      for (let i = 0; i < 8; i++) {
        rev = (rev << 1) | (v & 1);
        v >>= 1;
      }
      this.buddyMatrix[n] = rev;
    }
  }

  // 8.8 FIXED-POINT HELPERS
  toFixed(val) {
    return Math.floor(val * 256) & 0xFFFF;
  }

  fromFixed(fp) {
    return (fp >> 8) + ((fp & 0xFF) / 256);
  }

  // WILDCARD SUBNET MIRROR (memory compression)
  wildcardMirror(n, mask = 0xF0) {
    const masked = n & mask;
    return this.buddyMatrix[masked] | (n & \~mask);
  }

  // EXECUTE GLYPH STRAND (the heart of Sultan 47)
  execute(strand) {
    this.glyphLog = [];
    const tokens = strand.match(/[a-zA-Z0-9()+\-?xXwWnNuUoOAAS]/g) || [];

    for (let glyph of tokens) {
      this.glyphLog.push(glyph);

      // Basic load
      if (glyph === 'n') this.acc = this.toFixed(10);           // example n_index
      if (glyph === 'u') this.acc = this.toFixed(this.buddyMatrix[10]);

      // Math / fixed-point
      if (glyph === 'o1') this.acc = this.toFixed(this.fromFixed(this.acc) + 1);
      if (glyph === 'oA') this.acc = this.toFixed(10);
      if (glyph === 'o5') this.acc = this.toFixed(80);

      // ADC / SBC
      if (glyph === '+') { 
        this.acc = (this.acc + this.toFixed(1) + this.carry) & 0xFFFF;
        this.carry = this.acc > 0xFFFF ? 1 : 0;
      }
      if (glyph === '-') { 
        this.acc = (this.acc - this.toFixed(1) - (1 - this.carry)) & 0xFFFF;
        this.carry = this.acc < 0 ? 0 : 1;
      }

      // Shifts
      if (glyph === 'A') this.acc <<= 1;   // ASL
      if (glyph === 'S') this.acc >>= 1;   // LSR

      // Nested functions
      if (glyph === '(') this.stack.push({ acc: this.acc, carry: this.carry });
      if (glyph === ')') {
        const frame = this.stack.pop() || { acc: 0, carry: 0 };
        this.acc = frame.acc;
        this.carry = frame.carry;
      }

      // Prophecy / God String trigger
      if (glyph === 'x') this.runGodString();
    }

    return this.acc;   // return fixed-point value for games to use
  }

  // Full God String Prophecy
  runGodString() {
    this.execute('n(oA(?A:+S))u(o5(W-))');   // nested + if-else + wildcard + shifts
  }
}

// Global instance (easy access from main.js and game files)
export const dbm = new DBM();
