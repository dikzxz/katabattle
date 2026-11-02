/** Stable 32-bit string hash, independent of runtime-specific crypto APIs. */
export function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Mulberry32 PRNG. Each call returns a deterministic number in [0, 1). */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRandom(seed: string): () => number {
  return mulberry32(hashSeed(seed));
}

export function newSeed(): string {
  const values = new Uint32Array(4);
  globalThis.crypto.getRandomValues(values);
  return Array.from(values, (value) => value.toString(36).padStart(7, "0")).join("");
}

const FILLER_LETTER_WEIGHTS: readonly [string, number][] = [
  ["A", 12], ["N", 11], ["I", 10], ["K", 9], ["E", 9], ["T", 8], ["R", 8], ["U", 7], ["S", 7], ["M", 6], ["L", 6],
  ["D", 4], ["P", 4], ["B", 4], ["G", 4], ["H", 4], ["O", 4],
  ["J", 1], ["C", 1], ["Y", 1], ["W", 1], ["F", 1], ["V", 1], ["Z", 1], ["Q", 0.2], ["X", 0.2],
];
const FILLER_TOTAL_WEIGHT = FILLER_LETTER_WEIGHTS.reduce((total, [, weight]) => total + weight, 0);

export function pickFillerLetter(random: () => number): string {
  let pick = random() * FILLER_TOTAL_WEIGHT;
  for (const [letter, weight] of FILLER_LETTER_WEIGHTS) {
    pick -= weight;
    if (pick < 0) return letter;
  }
  return FILLER_LETTER_WEIGHTS[0][0];
}
