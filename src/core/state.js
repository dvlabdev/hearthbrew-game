// Game state: a plain, serializable object. Systems are pure functions over it.
import { VERSION, CUSTOMERS, START } from '../content/index.js';

export const SAVE_VERSION = 3;

/**
 * @typedef {object} GameState
 * @property {number} saveVersion
 * @property {number} contentVersion
 * @property {number} seed
 * @property {number} day                    1..START.days, then endless
 * @property {number} coins
 * @property {import('../content/types.js').StockItem[]} shelf
 * @property {{ plant: string | null, age: number, tended: boolean }[]} garden
 * @property {{ known: Record<string, boolean[]>, decoded: string[], rules: string[], recipes: string[] }} notebook
 * @property {Record<string, number>} relationships   regular id -> points (never decrease)
 * @property {string[]} owned                          upgrades and stations bought
 * @property {Today | null} today                      the day in progress (design/morning.md)
 * @property {number} lastSpotDay                      Spot the herb never runs two days in a row
 * @property {Record<string, number[]>} log           phase durations in ms (debug metrics)
 */

/**
 * @typedef {'expedition' | 'garden' | 'market' | 'errand' | 'study'} CardType
 * @typedef {{ type: CardType, title: string, text: string, offers?: string[] }} Card
 * @typedef {{ kind: 'spot' | 'encounter' | 'discovery', id: string, choice?: number, right?: boolean }} EventState
 * @typedef {object} Today
 * @property {'morning' | 'haul' | 'event' | 'shop' | 'night'} phase
 * @property {string} weather
 * @property {Card[]} offer
 * @property {number | null} card                     index into offer
 * @property {{who: string, units: number}} featured
 * @property {{who: string, units: number}[]} others
 * @property {string[]} finds
 * @property {string[]} picks
 * @property {string[]} gained                         what the morning card or event added (for the recap)
 * @property {string} note                             the morning card's story line
 * @property {EventState | null} event
 * @property {{ coins: number, served: boolean[] } | null} shop
 * @property {string[]} wilted
 * @property {number} startCoins
 */

/** @param {number} [seed] @returns {GameState} */
export function newGame(seed = 1) {
  return {
    saveVersion: SAVE_VERSION,
    contentVersion: VERSION,
    seed,
    day: 1,
    coins: START.coins,
    shelf: START.shelf.map(s => ({ ...s })),
    garden: Array.from({ length: START.garden }, () => ({ plant: null, age: 0, tended: false })),
    notebook: { known: {}, decoded: [], rules: [], recipes: [] },
    relationships: Object.fromEntries(Object.keys(CUSTOMERS).map(id => [id, 0])),
    owned: START.owned.slice(),
    today: null,
    lastSpotDay: -9,
    log: {},
  };
}
