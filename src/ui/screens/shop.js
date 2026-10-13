// Afternoon (interim shop, served by the validated haul rules) and Night (wilting, recap, sleep). design/morning.md
import { art } from '../../art/registry.js';
import { CUSTOMERS, START } from '../../content/index.js';
import { t as tr } from '../../content/strings.js';
import { dispatch } from '../../core/day.js';
import { hud, shelfStrip, herbName, custName } from './common.js';

/** @typedef {import('../../core/state.js').GameState} GameState */

/** @param {GameState} s @param {(next: GameState) => void} go */
export function shop(s, go) {
  const t = /** @type {NonNullable<GameState['today']>} */ (s.today);
  const visitors = [t.featured, ...t.others];
  const html = () => `${hud(s)}<section class="screen">
    <h1>${tr('shop.heading')}</h1>
    ${t.note || t.gained.length ? `<section class="card">${t.note ? `<p>${t.note}</p>` : ''}${t.gained.length ? `<p class="muted">${tr('shop.added', { list: t.gained.map(herbName).join(', ') })}</p>` : ''}</section>` : ''}
    ${shelfStrip(s.shelf)}
    <div class="stack"><p class="eyebrow">${tr('shop.expected')}</p>
      ${visitors.map((v, i) => `<div class="card clue">${art(`portrait:${v.who}`)}<div><b>${custName(v.who)}</b>${i === 0 ? `<span class="muted">${tr('shop.featured')}</span>` : ''}<q>${CUSTOMERS[v.who].clue}</q></div></div>`).join('')}</div>
    <p class="muted">${tr('shop.interim')}</p>
    <div class="dock"><button class="btn block" type="button" data-open>${tr('shop.open')}</button></div></section>`;
  /** @param {HTMLElement} root */
  const wire = root => root.querySelector('[data-open]')?.addEventListener('click', () => go(dispatch(s, { type: 'openShop' })));
  return { html, wire };
}

/** @param {GameState} s @param {(next: GameState) => void} go */
export function nightRecap(s, go) {
  const t = /** @type {NonNullable<GameState['today']>} */ (s.today);
  const r = /** @type {NonNullable<typeof t.shop>} */ (t.shop);
  const visitors = [t.featured, ...t.others];
  const earned = s.coins - t.startCoins;
  const html = () => `${hud(s)}<section class="screen">
    <h1>${tr('night.heading')}</h1>
    <div class="stack">${visitors.map((v, i) => `<div class="card clue">${art(`portrait:${v.who}`, { mood: r.served[i] ? 'happy' : 'tired' })}<div><b>${custName(v.who)}</b>
      <p>${tr(r.served[i] ? 'night.served' : 'night.missed')}</p></div></div>`).join('')}</div>
    <section class="card"><div class="row-between"><span>${tr('night.takings')}</span><span class="pill">${art('ui:coin')}${earned >= 0 ? '+' : ''}${earned}</span></div>
      <p class="muted">${t.wilted.length ? tr('night.wilted', { list: t.wilted.map(herbName).join(', ') }) : tr('night.noWilt')}</p></section>
    ${shelfStrip(s.shelf)}
    <p class="hand">${s.day >= START.days ? tr('night.finale') : tr('night.left', { n: START.days - s.day })}</p>
    <div class="dock"><button class="btn block" type="button" data-sleep>${tr('night.sleep')}</button></div></section>`;
  /** @param {HTMLElement} root */
  const wire = root => root.querySelector('[data-sleep]')?.addEventListener('click', () => go(dispatch(s, { type: 'sleep' })));
  return { html, wire };
}
