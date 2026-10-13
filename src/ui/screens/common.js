// Pieces shared by the game screens: HUD, the expected-customer clue, the shelf strip.
import { CUSTOMERS, FORAGE, WEATHER, START, herbName } from '../../content/index.js';
import { t } from '../../content/strings.js';
import { shelfChip } from '../components.js';
import { html, pic, tx } from '../dom.js';

/** @typedef {import('../../core/state.js').GameState} GameState @typedef {import('../../content/types.js').StockItem} StockItem */

export const H = FORAGE;
export { herbName };
/** @param {string} id */
export const custName = id => CUSTOMERS[id]?.name ?? id;

/** Top bar: day, weather, coins. @param {GameState} s */
export function hud(s) {
  const w = s.today ? WEATHER[s.today.weather] : null;
  return html`<header class="hud"><span class="pill">${tx('hud.day', { day: s.day, days: START.days })}</span>
    ${w && s.today ? html`<span class="pill">${pic(`weather:${s.today.weather}`, { lod: 'mini' })}${w.label}</span>` : ''}
    <span class="pill" aria-label="${t('hud.coins', { coins: s.coins })}">${pic('ui:coin')}${s.coins}</span></header>`;
}

/** The screen title: focus lands here when a new screen opens (tabindex -1). @param {string | import('../dom.js').Raw} text */
export const title = text => html`<h1 tabindex="-1">${text}</h1>`;

/** The customer expected at the shop, as words only (pillar 1: no ticks). @param {GameState} s */
export function clue(s, heading = t('clue.heading')) {
  const f = /** @type {NonNullable<GameState['today']>} */ (s.today).featured;
  return html`<section class="card"><p class="eyebrow">${heading}</p><div class="clue">${pic(`portrait:${f.who}`)}
    <div><b>${custName(f.who)}</b><q>${CUSTOMERS[f.who].clue}</q>${f.units > 1 ? html`<span class="muted">${t('clue.strong')}</span>` : ''}</div></div></section>`;
}

/** The shelf strip: one chip per herb with wilt pips; `adding` previews picks ("→3"). @param {StockItem[]} shelf @param {string[]} [adding] */
export function shelfStrip(shelf, adding = []) {
  /** @type {Map<string, number[]>} */ const by = new Map();
  for (const it of shelf) by.set(it.herb, [...(by.get(it.herb) || []), it.nights]);
  for (const h of adding) if (!by.has(h)) by.set(h, []);
  const chips = [...by.entries()].map(([herb, nights]) => shelfChip({ herb, count: nights.length, next: nights.length + adding.filter(a => a === herb).length, nights: nights.sort((a, b) => a - b) }));
  return html`<div class="stack"><p class="eyebrow">${t('shelf.heading')}</p><div class="shelf">${chips.length ? chips : html`<span class="muted">${t('shelf.empty')}</span>`}</div></div>`;
}
