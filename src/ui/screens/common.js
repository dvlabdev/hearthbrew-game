// Pieces shared by the game screens: HUD, the expected-customer clue, the shelf strip.
import { art } from '../../art/registry.js';
import { CUSTOMERS, HAUL, WEATHER } from '../../content/index.js';
import { shelfChip } from '../components.js';

/** @typedef {import('../../core/state.js').GameState} GameState @typedef {import('../../content/types.js').StockItem} StockItem */

export const H = HAUL.herbs;
/** @param {string} id */
export const herbName = id => id[0].toUpperCase() + id.slice(1);
/** @param {string} id */
export const custName = id => CUSTOMERS[id]?.name ?? herbName(id);

/** Top bar: day, weather, coins. @param {GameState} s */
export function hud(s) {
  const w = s.today ? WEATHER[s.today.weather] : null;
  return `<header class="hud"><span class="pill">Day ${s.day} <small>of 20</small></span>
    ${w && s.today ? `<span class="pill">${art(`weather:${s.today.weather}`, { lod: 'mini' })}${w.label}</span>` : ''}
    <span class="pill" aria-label="${s.coins} coins">${art('ui:coin')}${s.coins}</span></header>`;
}

/** The customer expected at the shop, as words only (pillar 1: no ticks). @param {GameState} s */
export function clue(s, heading = 'At the shop this afternoon') {
  const f = /** @type {NonNullable<GameState['today']>} */ (s.today).featured;
  return `<section class="card"><p class="eyebrow">${heading}</p><div class="clue">${art(`portrait:${f.who}`)}
    <div><b>${custName(f.who)}</b><q>${CUSTOMERS[f.who].clue}</q>${f.units > 1 ? '<span class="muted"> · a good strong dose</span>' : ''}</div></div></section>`;
}

/** The shelf strip: one chip per herb with wilt pips; `adding` previews picks ("→3"). @param {StockItem[]} shelf @param {string[]} [adding] */
export function shelfStrip(shelf, adding = []) {
  /** @type {Map<string, number[]>} */ const by = new Map();
  for (const it of shelf) by.set(it.herb, [...(by.get(it.herb) || []), it.nights]);
  for (const h of adding) if (!by.has(h)) by.set(h, []);
  const chips = [...by.entries()].map(([herb, nights]) => shelfChip({ herb, count: nights.length, next: nights.length + adding.filter(a => a === herb).length, nights: nights.sort((a, b) => a - b) }));
  return `<div class="stack"><p class="eyebrow">Your shelf</p><div class="shelf">${chips.join('') || '<span class="muted">Empty</span>'}</div></div>`;
}
