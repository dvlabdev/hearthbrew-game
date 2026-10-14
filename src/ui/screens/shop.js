// Afternoon (interim shop, served by the validated haul rules) and Night (wilting, recap, sleep). design/morning.md
import { CUSTOMERS, START, LEDGER, FORAGE, CONTENT, traitName } from '../../content/index.js';
import { tomorrow } from '../../core/day.js';
import { available, nextUnlock, needsSeed, seedChoices } from '../../core/ledger.js';
import { focusSheet } from './morning.js';
import { t } from '../../content/strings.js';
import { html, pic, tx } from '../dom.js';
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

/** The ledger part of the night (design/night.md): Notebook today, coins, what can be bought, what waits. @param {GameState} s */
function ledger(s) {
  const t0 = /** @type {Today} */ (s.today);
  const items = available(s);
  const shop = items.filter(x => x.item.effects && x.status !== 'locked');   // buyable, poor or owned
  const soon = items.filter(x => x.status === 'soon');
  const next = nextUnlock(s);
  const learned = t0.learned ?? [];
  return html`<section class="card ledger" aria-labelledby="ledger-h"><h2 id="ledger-h" tabindex="-1">${t('ledger.heading')}</h2>
    <div class="stack"><p class="eyebrow">${t('ledger.notebook')}</p>
      ${learned.length ? html`<ul class="learned">${learned.map(e => {
        const [kind, id] = e.split(':');
        return kind === 'herb'
          ? html`<li>${tx('ledger.learnedHerb', { herb: herbName(id), trait: traitName(FORAGE[id]?.trait ?? '') })}</li>`
          : html`<li>${t('ledger.learnedRule', { text: CONTENT.rules.find(r => r.id === id)?.text ?? id })}</li>`;
      })}</ul>` : html`<p class="muted">${t('ledger.nothingLearned')}</p>`}</div>
    <div class="row-between"><span>${t('ledger.coins')}</span><span class="pill">${pic('ui:coin')}${s.coins}</span></div>
    <div class="stack"><p class="eyebrow">${t('ledger.buyable')}</p>
      ${shop.length ? shop.map(({ item, status }) => html`<div class="lrow" data-key="item-${item.id}"><span>${item.name}</span>
        ${status === 'owned' ? html`<span class="muted">${t('ledger.owned')}</span>`
        : html`<button class="btn secondary" type="button" data-action="buy" data-item="${item.id}"${status === 'poor' ? html` disabled` : ''}>${status === 'poor' ? t('ledger.poor', { price: item.price }) : t('ledger.buy', { price: item.price })}</button>`}</div>`)
      : html`<p class="muted">${t('ledger.nothingNow')}</p>`}
      ${s.donations.length ? html`<p class="muted">${t('ledger.donations', { list: s.donations.map(custName).join(', ') })}</p>` : ''}</div>
    ${soon.length ? html`<div class="stack"><p class="eyebrow">${t('ledger.soonHeading')}</p>
      ${soon.map(({ item }) => html`<div class="lrow soon" data-key="item-${item.id}"><span>${item.name}</span><span>${pic('ui:coin')}${item.price}</span></div>`)}</div>` : ''}
    ${next ? html`<p class="muted">${t('ledger.next', { item: next.name, day: next.from })}</p>` : ''}
  </section>`;
}

/** Tomorrow's featured customer (D6): exact, from tomorrow's streams. @param {GameState} s */
function teaser(s) {
  const f = tomorrow(s);
  return html`<section class="card"><p class="eyebrow">${t('tomorrow.heading')}</p><div class="clue">${pic(`portrait:${f.who}`)}
    <div><b>${custName(f.who)}</b><q>${CUSTOMERS[f.who].clue}</q>${f.units > 1 ? html`<span class="muted">${t('clue.strong')}</span>` : ''}</div></div></section>`;
}

/** @param {string} id */
const itemOf = id => /** @type {import('../../content/types.js').LedgerItem} */ (LEDGER.items.find(it => it.id === id));

/** @type {import('../screen.js').Screen} */
export const nightRecap = {
  init: () => ({ seedFor: null }),   // the plot whose seed sheet is open
  view(s, { seedFor }) {
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
    ${ledger(s)}
    ${teaser(s)}
    <p class="hand">${s.day >= START.days ? t('night.finale') : t('night.left', { n: START.days - s.day })}</p>
    <div class="dock"><button class="btn block" type="button" data-action="sleep">${t('night.sleep')}</button></div>
    ${seedFor ? html`<div class="sheet" role="dialog" aria-labelledby="seed-h"><b id="seed-h">${t('ledger.seedHeading')}</b><p class="muted">${t('ledger.seedHelp')}</p>
      ${seedChoices(s).map(h => html`<button class="btn secondary block" type="button" data-action="plant" data-seed="${h}">${pic(`ingredient:${h}`, { lod: 'mini' })}${herbName(h)}</button>`)}
      <button class="btn ghost block" type="button" data-action="cancel">${t('ledger.cancel')}</button></div>` : ''}</section>`;
  },
  actions: {
    sleep: ctx => ctx.act({ type: 'sleep' }),
    buy(ctx, d) {
      const it = itemOf(/** @type {string} */ (d.item));
      if (needsSeed(it)) { ctx.set({ seedFor: it.id }); focusSheet(ctx.root); return; }
      ctx.apply({ type: 'buy', item: it.id });
      ctx.say(t('ledger.bought', { item: it.name, coins: ctx.s.coins }));
      /** @type {HTMLElement | null} */ (ctx.root.querySelector('#ledger-h'))?.focus();
    },
    plant(ctx, d) {
      const id = ctx.local.seedFor, seed = /** @type {string} */ (d.seed);
      ctx.apply({ type: 'buy', item: id, seed });
      ctx.set({ seedFor: null });
      ctx.say(t('ledger.planted', { herb: herbName(seed), coins: ctx.s.coins }));
      /** @type {HTMLElement | null} */ (ctx.root.querySelector('#ledger-h'))?.focus();
    },
    cancel(ctx) {
      const id = ctx.local.seedFor;
      ctx.set({ seedFor: null });
      /** @type {HTMLElement | null} */ (ctx.root.querySelector(`[data-action="buy"][data-item="${id}"]`))?.focus();
    },
  },
};
