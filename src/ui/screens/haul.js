// Choose your haul (design/expedition.md): finds grouped by kind, a 5-slot basket, the shelf strip, the clue as words.
// Tap a find to pick it; tap its picture (or long-press it) for details; tap a basket slot to put a find back.
// What you leave behind stays behind.
import { HAUL, traitName } from '../../content/index.js';
import { t, tn } from '../../content/strings.js';
import { dispatch, knows, logPhase } from '../../core/day.js';
import { pickedItem, slotsUsed } from '../../core/haul.js';
import { findTile } from '../components.js';
import { html, pic, tx } from '../dom.js';
import { hud, clue, shelfStrip, herbName, H, title } from './common.js';
import { focusSheet } from './morning.js';

/** @typedef {import('../../core/state.js').GameState} GameState */
/** @typedef {NonNullable<GameState['today']>} Today */

/** How many of a herb are still on the path. @param {Today} t0 @param {string[]} picks @param {string} h */
const left = (t0, picks, h) => t0.finds.filter(f => f === h).length - picks.filter(p => p === h).length;

/** @type {import('../screen.js').Screen} */
export const haul = {
  init: () => ({ picks: [], detail: null, started: performance.now() }),
  view(s, { picks, detail }) {
    const t0 = /** @type {Today} */ (s.today);
    const card = t0.offer[/** @type {number} */ (t0.card)];
    const used = slotsUsed(picks);
    const tiles = [...new Set(t0.finds)].map(h => {
      const it = pickedItem(h, t0.weather), n = left(t0, picks, h);
      return findTile({ herb: h, label: herbName(h), count: n, value: it.value, prime: it.prime, poor: it.poor, rare: H[h].rarity === 'rare', heavy: H[h].slots > 1,
        pressed: n === 0, disabled: n > 0 && used + H[h].slots > HAUL.basket });
    });
    // slots keep a stable key per pick (herb + its occurrence), so a put-back or a new pick keeps the others' elements
    /** @type {Record<string, number>} */ const seen = {};
    const slots = picks.map((p, i) => html`<button type="button" class="slot full${H[p].slots > 1 ? ' span2' : ''}" data-action="unpick" data-i="${i}" data-key="slot-${p}-${seen[p] = (seen[p] || 0) + 1}" aria-label="${t('haul.putBack', { herb: herbName(p) })}">${pic(`ingredient:${p}`, { lod: 'mini' })}</button>`);
    const empty = Array.from({ length: HAUL.basket - used }, () => html`<span class="slot" aria-hidden="true"></span>`);
    const d = detail ? pickedItem(detail, t0.weather) : null;
    return html`${hud(s)}<section class="screen">
      <div><p class="eyebrow">${card.title}</p>${title(t('haul.heading'))}</div>
      ${clue(s)}
      ${shelfStrip(s.shelf, picks)}
      <div class="stack"><div class="row-between"><p class="eyebrow">${t('haul.finds')}</p><span class="muted">${t('haul.hint')}</span></div><div class="finds">${tiles}</div></div>
      <div class="stack"><div class="row-between"><p class="eyebrow">${t('haul.basket')}</p><span class="muted">${t('haul.slots', { used, total: HAUL.basket })}</span></div><div class="basket">${slots}${empty}</div></div>
      <div class="dock"><button class="btn block" type="button" data-action="home">${picks.length ? t('haul.home', { n: picks.length }) : t('haul.homeEmpty')}</button></div>
      ${detail && d ? html`<div class="sheet" role="dialog" aria-label="${t('haul.details', { herb: herbName(detail) })}"><div class="clue">${pic(`ingredient:${detail}`)}<div><b>${herbName(detail)}</b>
        <span class="muted">${t(`kind.${H[detail].kind}`)} · ${t(`rarity.${H[detail].rarity}`)}${H[detail].slots > 1 ? t('haul.heavy') : ''}</span></div></div>
        <p>${tn('haul.worth', d.value, { value: d.value })}${d.prime ? t('haul.prime') : d.poor ? t('haul.poor') : ''}. ${t('haul.keeps', { nights: d.nights })}</p>
        <p>${knows(s, detail) ? tx('haul.brings', { trait: traitName(H[detail].trait) }) : html`<span class="muted">${t('haul.unknown')}</span>`}</p>
        <button class="btn secondary block" type="button" data-action="close">${t('common.close')}</button></div>` : ''}
    </section>`;
  },
  actions: {
    pick(ctx, d) {
      const t0 = /** @type {Today} */ (ctx.s.today), h = /** @type {string} */ (d.herb), picks = ctx.local.picks;
      if (left(t0, picks, h) <= 0 || slotsUsed(picks) + H[h].slots > HAUL.basket) return;
      const next = [...picks, h];
      ctx.set({ picks: next });
      ctx.say(t('say.picked', { herb: herbName(h), used: slotsUsed(next), total: HAUL.basket }));
    },
    unpick(ctx, d) {
      const i = Number(d.i), h = ctx.local.picks[i];
      const next = ctx.local.picks.filter((/** @type {string} */ _, j) => j !== i);
      ctx.set({ picks: next });
      ctx.say(t('say.putBack', { herb: herbName(h), used: slotsUsed(next), total: HAUL.basket }));
      // the slot is gone: keep focus in the basket (the next filled slot, or the find it came from)
      /** @type {HTMLElement | null} */ (ctx.root.querySelector(`[data-action="unpick"][data-i="${Math.min(i, next.length - 1)}"]`) || ctx.root.querySelector(`.find-pick[data-herb="${h}"]`))?.focus();
    },
    details(ctx, d) {
      ctx.set({ detail: d.herb, from: d.action === 'details' ? 'info' : 'pick' });
      focusSheet(ctx.root);
    },
    close(ctx) {
      const { detail: h, from } = ctx.local;
      ctx.set({ detail: null });
      /** @type {HTMLElement | null} */ (ctx.root.querySelector(`.find-${from}[data-herb="${h}"]`))?.focus();   // back where the sheet was opened
    },
    home(ctx) {
      const timed = logPhase(ctx.s, 'haul', performance.now() - ctx.local.started);   // debug metric
      ctx.go(dispatch(timed, { type: 'takeHaul', picks: ctx.local.picks }));
    },
  },
};

