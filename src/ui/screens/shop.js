// Afternoon (interim shop, served by the validated haul rules) and Night (wilting, recap, sleep). design/morning.md
import { CUSTOMERS, START } from '../../content/index.js';
import { t } from '../../content/strings.js';
import { html, pic } from '../dom.js';
import { hud, shelfStrip, herbName, custName, title } from './common.js';

/** @typedef {import('../../core/state.js').GameState} GameState */
/** @typedef {NonNullable<GameState['today']>} Today */

/** @type {import('../screen.js').Screen} */
export const shop = {
  view(s) {
    const t0 = /** @type {Today} */ (s.today);
    const visitors = [t0.featured, ...t0.others];
    return html`${hud(s)}<section class="screen">
    ${title(t('shop.heading'))}
    ${t0.note || t0.gained.length ? html`<section class="card">${t0.note ? html`<p>${t0.note}</p>` : ''}${t0.gained.length ? html`<p class="muted">${t('shop.added', { list: t0.gained.map(herbName).join(', ') })}</p>` : ''}</section>` : ''}
    ${shelfStrip(s.shelf)}
    <div class="stack"><p class="eyebrow">${t('shop.expected')}</p>
      ${visitors.map((v, i) => html`<div class="card clue">${pic(`portrait:${v.who}`)}<div><b>${custName(v.who)}</b>${i === 0 ? html`<span class="muted">${t('shop.featured')}</span>` : ''}<q>${CUSTOMERS[v.who].clue}</q></div></div>`)}</div>
    <p class="muted">${t('shop.interim')}</p>
    <div class="dock"><button class="btn block" type="button" data-action="open">${t('shop.open')}</button></div></section>`;
  },
  actions: { open: ctx => ctx.act({ type: 'openShop' }) },
};

/** @type {import('../screen.js').Screen} */
export const nightRecap = {
  view(s) {
    const t0 = /** @type {Today} */ (s.today);
    const r = /** @type {NonNullable<Today['shop']>} */ (t0.shop);
    const visitors = [t0.featured, ...t0.others];
    const earned = s.coins - t0.startCoins;
    return html`${hud(s)}<section class="screen">
    ${title(t('night.heading'))}
    <div class="stack">${visitors.map((v, i) => html`<div class="card clue">${pic(`portrait:${v.who}`, { mood: r.served[i] ? 'happy' : 'tired' })}<div><b>${custName(v.who)}</b>
      <p>${t(r.served[i] ? 'night.served' : 'night.missed')}</p></div></div>`)}</div>
    <section class="card"><div class="row-between"><span>${t('night.takings')}</span><span class="pill">${pic('ui:coin')}${earned >= 0 ? '+' : ''}${earned}</span></div>
      <p class="muted">${t0.wilted.length ? t('night.wilted', { list: t0.wilted.map(herbName).join(', ') }) : t('night.noWilt')}</p></section>
    ${shelfStrip(s.shelf)}
    <p class="hand">${s.day >= START.days ? t('night.finale') : t('night.left', { n: START.days - s.day })}</p>
    <div class="dock"><button class="btn block" type="button" data-action="sleep">${t('night.sleep')}</button></div></section>`;
  },
  actions: { sleep: ctx => ctx.act({ type: 'sleep' }) },
};
