'use strict';

const crypto = require('crypto');

function hashValue(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

class HashRng {
  constructor(seed) {
    this.seed = String(seed);
    this.offset = 0;
    this.buffer = Buffer.from(hashValue(this.seed), 'hex');
  }

  nextByte() {
    if (this.offset >= this.buffer.length) {
      this.buffer = Buffer.from(hashValue(`${this.seed}:${this.offset}`), 'hex');
      this.offset = 0;
    }
    return this.buffer[this.offset++];
  }

  float() {
    const a = this.nextByte();
    const b = this.nextByte();
    const value = (a << 8) + b;
    return value / 65535;
  }

  integer(min, max) {
    const low = Math.ceil(min);
    const high = Math.floor(max);
    return Math.floor(this.float() * (high - low + 1)) + low;
  }

  number(min, max, precision) {
    const value = min + this.float() * (max - min);
    if (typeof precision !== 'number') return value;
    return Number(value.toFixed(precision));
  }

  pick(values) {
    if (!Array.isArray(values) || values.length === 0) return undefined;
    return values[this.integer(0, values.length - 1)];
  }
}

module.exports = {
  HashRng,
  hashValue
};
