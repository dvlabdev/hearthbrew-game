// The night ledger (design/night.md): what can be bought tonight, and buying it.
// Only items that work now can be bought (the user's decision, 2026-10-14); the rest are listed as "soon".
import { LEDGER, INGREDIENTS, FORAGE } from '../content/index.js';
import { applyEffects, knows } from './effects.js';

/** @typedef {import('./state.js').GameState} GameState @typedef {import('../content/types.js').LedgerItem} LedgerItem */
/** @typedef {'owned' | 'locked' | 'soon' | 'poor' | 'buyable'} ItemStatus */

/** @param {GameState} state @returns {GameState} */
const clone = state => JSON.parse(JSON.stringify(state));
/** @param {string} id */
const item = id => LEDGER.items.find(it => it.id === id);

/**
 * Seeds a new plot can take: herbs that can grow in a garden (grow days + a forage facet) that you already grow or
 * your Notebook knows. Always at least the starting plots' herbs.
 * @param {GameState} s
 */
export function seedChoices(s) {
  const planted = new Set(s.garden.map(p => p.plant).filter(Boolean));
  return Object.keys(INGREDIENTS).filter(id => INGREDIENTS[id].grow && FORAGE[id] && (planted.has(id) || knows(s, id)));
}

/**
 * Where an item stands tonight. Order matters: owned, then not yet (day), then waiting for its system, then its
 * prerequisite, then money.
 * @param {GameState} s @param {LedgerItem} it @returns {ItemStatus}
 */
export function status(s, it) {
  if (s.owned.includes(it.id)) return 'owned';
  if (s.day < it.from) return 'locked';
  if (it.soon) return 'soon';
  if (it.requires && !s.owned.includes(it.requires)) return 'locked';
  return s.coins < it.price ? 'poor' : 'buyable';
}

/** Every catalogue item with its status, in content order. @param {GameState} s */
export const available = s => LEDGER.items.map(it => ({ item: it, status: status(s, it) }));

/** The next thing that unlocks after today (lowest day, then content order), or null. @param {GameState} s */
export function nextUnlock(s) {
  const later = LEDGER.items.filter(it => !s.owned.includes(it.id) && it.from > s.day);
  return later.reduce((/** @type {LedgerItem | null} */ best, it) => (!best || it.from < best.from ? it : best), null);
}

/** Does buying this item ask for a seed? @param {LedgerItem} it */
export const needsSeed = it => !!it.effects?.some(e => 'addPlot' in e);

/**
 * Buy an item: pay, apply its effects (with the chosen seed for a plot), mark it owned.
 * @param {GameState} state @param {string} id @param {{ seed?: string }} [opts]
 */
export function buy(state, id, opts = {}) {
  const it = item(id);
  if (!it) throw new Error(`No such ledger item: ${id}`);
  const st = status(state, it);
  if (st !== 'buyable') throw new Error(`${id} can't be bought tonight (${st})`);
  if (needsSeed(it) && !(opts.seed && seedChoices(state).includes(opts.seed))) throw new Error(`${id} needs a seed you can plant`);
  const s = clone(state);
  applyEffects(s, [{ coins: -it.price }, ...(it.effects || [])], { rng: () => 0, choice: opts.seed });
  s.owned.push(id);
  return s;
}
