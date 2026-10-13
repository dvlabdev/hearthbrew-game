// One event card after the haul: Spot the herb, an Encounter or a Discovery (design/morning.md). Never a penalty.
import { t } from '../../content/strings.js';
import { dispatch, eventCard as entry, spotOrder } from '../../core/day.js';
import { html, pic, tx } from '../dom.js';
import { hud, herbName, title } from './common.js';

/** @typedef {import('../../core/state.js').GameState} GameState */
/** @typedef {NonNullable<GameState['today']>} Today */

/** The body of each event kind (the kind's rules live in EVENT_KINDS, src/core/day.js). r = the resolved event, once chosen. */
const BODIES = /** @type {Record<string, (s: GameState, card: any, r: Today['event'] | undefined, done: boolean) => import('../dom.js').Raw>} */ ({
  spot: (s, card, r, done) => html`${title(t('spot.heading'))}<p>${tx('spot.ask', { herb: herbName(card.good) })}</p>
    <div class="grid2">${spotOrder(s, card).map((p, i) => html`<button type="button" class="mcard spot" data-action="choose" data-i="${i}"${done ? html` disabled` : ''} aria-label="${t(i ? 'spot.right' : 'spot.left')}"${r?.choice === i ? html` aria-pressed="true"` : ''}>${pic(`plant:${p}`)}</button>`)}</div>
    ${r ? html`<section class="card"><p class="hand">${r.right ? card.right : card.wrong}</p>${r.right ? html`<p>${tx('spot.reward', { herb: herbName(card.reward) })}</p>` : html`<p class="muted">${t('spot.guide')}</p>`}</section>` : ''}`,
  encounter: (s, card, r) => html`${title(card.title)}<p>${card.text}</p>
    ${r ? html`<section class="card"><p>${card.options[/** @type {number} */ (r.choice)].text}</p></section>`
    : html`<div class="stack">${card.options.map((/** @type {{label: string}} */ o, /** @type {number} */ i) => html`<button class="btn secondary block" type="button" data-action="choose" data-i="${i}">${o.label}</button>`)}</div>`}`,
  discovery: (s, card, r) => html`${title(card.title)}<section class="card"><p class="hand">${card.text}</p></section>
    ${r ? html`<p>${t('discovery.kept')}</p>` : html`<button class="btn secondary block" type="button" data-action="choose" data-i="0">${t('discovery.keep')}</button>`}`,
});

/** @type {import('../screen.js').Screen} */
export const eventCard = {
  init: () => ({ done: null }),   // the resolved state, shown as an outcome before moving on
  view(s, { done }) {
    const ev = /** @type {NonNullable<Today['event']>} */ (/** @type {Today} */ (s.today).event);
    const r = done?.today?.event;
    return html`${hud(done || s)}<section class="screen">${BODIES[ev.kind](s, entry(ev), r, !!done)}
    ${done ? html`<div class="dock"><button class="btn block" type="button" data-action="next">${t('event.next')}</button></div>` : ''}</section>`;
  },
  actions: {
    choose(ctx, d) {
      if (ctx.local.done) return;
      ctx.set({ done: dispatch(ctx.s, { type: 'resolveEvent', choice: Number(d.i) }) });
      /** @type {HTMLElement | null} */ (ctx.root.querySelector('[data-action="next"]'))?.focus();
    },
    next: ctx => ctx.go(ctx.local.done),
  },
};
