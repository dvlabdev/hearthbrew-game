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

/** FNV-1a hash of a stream name. @param {string} name */
function hashName(name) {
  let h = 0x811c9dc5;
  for (let i = 0; i < name.length; i++) h = Math.imul(h ^ name.charCodeAt(i), 0x01000193);
  return h >>> 0;
}

/** Murmur3-style finalizer: mixes the inputs so nearby seeds, days and names give unrelated streams. @param {number[]} xs */
function mix(...xs) {
  let h = 0x9e3779b9;
  for (const x of xs) {
    h = Math.imul(h ^ (x | 0), 0x85ebca6b);
    h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  }
  return h | 0;
}

/**
 * A deterministic stream for one feature of one day (design/morning.md): `day.finds`, `morning.offer`, `event.draw`…
 * Each name is independent of every other, so a new draw in one feature never shifts another. Adding a stream is a new name.
 * @param {{ seed: number, day: number }} s @param {string} name
 */
export const stream = (s, name) => makeRng(mix(s.seed, s.day, hashName(name)));

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
