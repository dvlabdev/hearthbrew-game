// Versioned save/load. Every schema change adds a migration and a test (CLAUDE.md).
import { ALIASES, CUSTOMERS, EVENTS, FORAGE, INGREDIENTS, WEATHER, VERSION } from '../content/index.js';
import { SAVE_VERSION, newGame } from './state.js';
import { START_STOCK } from './haul.js';
import { startDay } from './day.js';

export const SAVE_KEY = 'hearthbrew-save';

/**
 * Migrations, keyed by the version they upgrade FROM. Each takes the old object and returns the next version.
 * v0 was the unversioned shape used by early experiments: { day, coins, stock }.
 * @type {Record<number, (old: any) => any>}
 */
export const MIGRATIONS = {
  0: old => {
    const fresh = newGame(old.seed ?? 1);
    const { today, lastSpotDay, log, ...v1 } = fresh;
    return { ...v1, day: old.day ?? 1, coins: old.coins ?? 0, shelf: old.stock ?? [], saveVersion: 1 };
  },
  // v1 -> v2 (2026-10-12): the playable day loop (design/morning.md). No day in progress; an empty shelf gets the starting stock.
  1: old => ({ ...old, shelf: old.shelf && old.shelf.length ? old.shelf : START_STOCK.map(s => ({ ...s })), today: null, lastSpotDay: -9, log: {}, saveVersion: 2 }),
  // v2 -> v3 (2026-10-13): relationships cover exactly the customers in content (v2 had a stray "bramble" and no "tamsin").
  2: old => ({ ...old, relationships: Object.fromEntries(Object.keys(CUSTOMERS).map(id => [id, old.relationships?.[id] ?? 0])), saveVersion: 3 }),
};

/**
 * Content-id repair, run on every load (not a migration: content changes don't bump the save version).
 * Renamed ids follow content.aliases; ids that no longer exist are dropped. A day in progress that refers
 * to a missing id restarts from its morning. Never throws on unknown content.
 * @param {import('./state.js').GameState} state
 */
export function repairIds(state) {
  const herb = (/** @type {string} */ id) => ALIASES.herb[id] ?? id;
  const cust = (/** @type {string} */ id) => ALIASES.customer[id] ?? id;
  const s = { ...state, contentVersion: VERSION };
  s.shelf = (state.shelf || []).map(it => ({ ...it, herb: herb(it.herb) })).filter(it => FORAGE[it.herb]);
  s.notebook = { ...state.notebook, known: Object.fromEntries(Object.entries(state.notebook?.known || {}).map(([k, v]) => [herb(k), v]).filter(([k]) => INGREDIENTS[k])) };
  const rel = Object.fromEntries(Object.entries(state.relationships || {}).map(([k, v]) => [cust(k), v]));
  s.relationships = Object.fromEntries(Object.keys(CUSTOMERS).map(id => [id, rel[id] ?? 0]));
  const t = state.today;
  if (t) {
    const herbs = [...t.finds, ...t.picks, ...t.gained].map(herb);
    const who = [t.featured, ...t.others].map(v => ({ ...v, who: cust(v.who) }));
    const ev = t.event;
    const ok = herbs.every(h => FORAGE[h]) && who.every(v => CUSTOMERS[v.who]) && !!WEATHER[t.weather]
      && (!ev || EVENTS[ev.kind]?.some(e => e.id === ev.id));
    if (!ok) return startDay({ ...s, today: null });
    const [featured, ...others] = who;
    s.today = { ...t, finds: t.finds.map(herb), picks: t.picks.map(herb), gained: t.gained.map(herb), featured, others };
  }
  return s;
}

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
    return raw ? repairIds(migrate(JSON.parse(raw))) : null;
  } catch { return null; }
}
