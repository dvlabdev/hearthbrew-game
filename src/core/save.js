// Versioned save/load. Every schema change adds a migration and a test (CLAUDE.md).
import { SAVE_VERSION, newGame } from './state.js';

export const SAVE_KEY = 'hearthbrew-save';

/**
 * Migrations, keyed by the version they upgrade FROM. Each takes the old object and returns the next version.
 * v0 was the unversioned shape used by early experiments: { day, coins, stock }.
 * @type {Record<number, (old: any) => any>}
 */
export const MIGRATIONS = {
  0: old => {
    const fresh = newGame(old.seed ?? 1);
    return { ...fresh, day: old.day ?? 1, coins: old.coins ?? 0, shelf: old.stock ?? [], saveVersion: 1 };
  },
};

/** Bring any older save up to the current version. @param {any} raw @returns {import('./state.js').GameState} */
export function migrate(raw) {
  let s = raw;
  let v = typeof s.saveVersion === 'number' ? s.saveVersion : 0;
  while (v < SAVE_VERSION) {
    const step = MIGRATIONS[v];
    if (!step) throw new Error(`No migration from save version ${v}`);
    s = step(s);
    v = s.saveVersion;
  }
  return s;
}

/** @param {import('./state.js').GameState} state @param {Storage | undefined} [storage] @returns {boolean} saved */
export function save(state, storage = globalThis.localStorage) {
  try { storage?.setItem(SAVE_KEY, JSON.stringify(state)); return !!storage; } catch { return false; }
}

/** @param {Storage | undefined} [storage] @returns {import('./state.js').GameState | null} */
export function load(storage = globalThis.localStorage) {
  try {
    const raw = storage?.getItem(SAVE_KEY);
    return raw ? migrate(JSON.parse(raw)) : null;
  } catch { return null; }
}
