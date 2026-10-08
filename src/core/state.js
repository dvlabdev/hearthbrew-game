// Game state: a plain, serializable object. Systems are pure functions over it.
import { VERSION } from '../content/index.js';

export const SAVE_VERSION = 1;

/**
 * @typedef {object} GameState
 * @property {number} saveVersion
 * @property {number} contentVersion
 * @property {number} seed
 * @property {number} day                    1..20, then endless
 * @property {number} coins
 * @property {import('../content/types.js').StockItem[]} shelf
 * @property {{ plant: string | null, age: number, tended: boolean }[]} garden
 * @property {{ known: Record<string, boolean[]>, decoded: string[], rules: string[], recipes: string[] }} notebook
 * @property {Record<string, number>} relationships   regular id -> points (never decrease)
 * @property {string[]} owned                          upgrades and stations bought
 */

/** @param {number} [seed] @returns {GameState} */
export function newGame(seed = 1) {
  return {
    saveVersion: SAVE_VERSION,
    contentVersion: VERSION,
    seed,
    day: 1,
    coins: 0,
    shelf: [],
    garden: [{ plant: null, age: 0, tended: false }, { plant: null, age: 0, tended: false }],
    notebook: { known: {}, decoded: [], rules: [], recipes: [] },
    relationships: { marla: 0, pell: 0, fennick: 0, bramble: 0 },
    owned: ['cauldron', 'shelf', 'basket', 'sickle', 'watering-can'],
  };
}
