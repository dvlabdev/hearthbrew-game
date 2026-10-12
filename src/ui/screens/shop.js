// Afternoon (interim shop, served by the validated haul rules) and Night (wilting, recap, sleep). design/morning.md
import { art } from '../../art/registry.js';
import { CUSTOMERS } from '../../content/index.js';
import { runShop, endDay, nextDay } from '../../core/day.js';
import { hud, shelfStrip, herbName, custName } from './common.js';

/** @typedef {import('../../core/state.js').GameState} GameState */

/** @param {GameState} s @param {(next: GameState) => void} go */
export function shop(s, go) {
  const t = /** @type {NonNullable<GameState['today']>} */ (s.today);
  const visitors = [t.featured, ...t.others];
  const html = () => `${hud(s)}<section class="screen">
    <h1>Afternoon: the shop</h1>
    ${t.note || t.gained.length ? `<section class="card">${t.note ? `<p>${t.note}</p>` : ''}${t.gained.length ? `<p class="muted">Added to the shelf: ${t.gained.map(herbName).join(', ')}.</p>` : ''}</section>` : ''}
    ${shelfStrip(s.shelf)}
    <div class="stack"><p class="eyebrow">Expected today</p>
      ${visitors.map((v, i) => `<div class="card clue">${art(`portrait:${v.who}`)}<div><b>${custName(v.who)}</b>${i === 0 ? '<span class="muted"> · the one you heard about</span>' : ''}<q>${CUSTOMERS[v.who].clue}</q></div></div>`).join('')}</div>
    <p class="muted">Until the brewing bench is built, your shelf serves them by itself.</p>
    <div class="dock"><button class="btn block" type="button" data-open>Open the shop</button></div></section>`;
  /** @param {HTMLElement} root */
  const wire = root => root.querySelector('[data-open]')?.addEventListener('click', () => go(endDay(runShop(s))));
  return { html, wire };
}

/** @param {GameState} s @param {(next: GameState) => void} go */
export function nightRecap(s, go) {
  const t = /** @type {NonNullable<GameState['today']>} */ (s.today);
  const r = /** @type {NonNullable<typeof t.shop>} */ (t.shop);
  const visitors = [t.featured, ...t.others];
  const earned = s.coins - t.startCoins;
  const html = () => `${hud(s)}<section class="screen">
    <h1>Night</h1>
    <div class="stack">${visitors.map((v, i) => `<div class="card clue">${art(`portrait:${v.who}`, { mood: r.served[i] ? 'happy' : 'tired' })}<div><b>${custName(v.who)}</b>
      <p>${r.served[i] ? 'Went home with what they needed.' : 'Your shelf had nothing for them today. They\'ll be back.'}</p></div></div>`).join('')}</div>
    <section class="card"><div class="row-between"><span>The day's takings</span><span class="pill">${art('ui:coin')}${earned >= 0 ? '+' : ''}${earned}</span></div>
      ${t.wilted.length ? `<p class="muted">Wilted overnight: ${t.wilted.map(herbName).join(', ')}.</p>` : '<p class="muted">Nothing wilted tonight.</p>'}</section>
    ${shelfStrip(s.shelf)}
    <p class="hand">${s.day >= 20 ? 'Midsummer Eve is here. (The festival arrives in a later build.)' : `${20 - s.day} days to Midsummer Eve.`}</p>
    <div class="dock"><button class="btn block" type="button" data-sleep>Sleep</button></div></section>`;
  /** @param {HTMLElement} root */
  const wire = root => root.querySelector('[data-sleep]')?.addEventListener('click', () => go(nextDay(s)));
  return { html, wire };
}
