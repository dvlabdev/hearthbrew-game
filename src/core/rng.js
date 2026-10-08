// Seeded RNG (mulberry32), the same generator the prototypes used.

/** @param {number} seed @returns {() => number} uniform float in [0, 1) */
export function makeRng(seed) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** @template T @param {() => number} rng @param {readonly T[]} arr @returns {T} */
export function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

/** @template T @param {() => number} rng @param {readonly T[]} arr @param {readonly number[]} weights @returns {T} */
export function pickWeighted(rng, arr, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < arr.length; i++) { r -= weights[i]; if (r < 0) return arr[i]; }
  return arr[arr.length - 1];
}

/** @template T @param {() => number} rng @param {T[]} arr @returns {T[]} a shuffled copy */
export function shuffle(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
