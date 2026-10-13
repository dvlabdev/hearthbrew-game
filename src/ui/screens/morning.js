// Morning: the weather card, the customer expected this afternoon, and 3 cards: pick 1 (design/morning.md).
import { WEATHER, MORNING } from '../../content/index.js';
import { t } from '../../content/strings.js';
import { marketPrice } from '../../core/effects.js';
import { html, pic, raw } from '../dom.js';
import { art } from '../../art/registry.js';
import { hud, clue, herbName, title } from './common.js';

/** @typedef {import('../../core/state.js').GameState} GameState @typedef {import('../../core/state.js').Card} Card */
/** @typedef {NonNullable<GameState['today']>} Today */

/** Card art (mini detail level) from content; "weather" means today's weather. @param {Card} c @param {string} weather */
const cardArt = (c, weather) => {
  const id = MORNING.cards[c.type].art;
  return pic(id === 'weather' ? `weather:${weather}` : id, { lod: 'mini' });
};

/** @type {import('../screen.js').Screen} */
export const morning = {
  init: () => ({ market: -1 }),   // index of the card whose sub-choice sheet is open
  view(s, { market }) {
    const t0 = /** @type {Today} */ (s.today);
    const w = WEATHER[t0.weather];
    const sheet = market >= 0 ? t0.offer[market] : null;
    return html`${hud(s)}<section class="screen">
    ${title(t('morning.heading'))}
    <figure class="banner">${raw(art(`weather:${t0.weather}`).replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" '))}<figcaption><b>${w.label}.</b> ${w.text}</figcaption></figure>
    ${clue(s)}
    <div class="stack"><p class="eyebrow">${t('morning.choose')}</p>
      ${t0.offer.map((c, i) => html`<button class="mcard" type="button" data-action="card" data-i="${i}" data-key="card-${c.type}">${cardArt(c, t0.weather)}<span><b>${c.title}</b><span>${c.text}</span></span></button>`)}</div>
    ${sheet ? html`<div class="sheet" role="dialog" aria-label="${sheet.title}"><b>${sheet.title}</b><p class="muted">${t('market.pick')}</p>
      ${(sheet.offers || []).map(h => html`<button class="btn secondary block" type="button" data-action="buy" data-herb="${h}">${t('market.offer', { herb: herbName(h), price: marketPrice(h, MORNING.cards[sheet.type].markup || 0) })}</button>`)}
      <button class="btn ghost block" type="button" data-action="close">${t('market.close')}</button></div>` : ''}
  </section>`;
  },
  actions: {
    card(ctx, d) {
      const i = Number(d.i), card = /** @type {Today} */ (ctx.s.today).offer[i];
      if (card.offers) { ctx.set({ market: i }); focusSheet(ctx.root); return; }   // a card with a sub-choice opens its sheet
      ctx.act({ type: 'chooseCard', index: i });
    },
    buy: (ctx, d) => ctx.act({ type: 'chooseCard', index: ctx.local.market, buy: d.herb }),
    close(ctx) {
      const i = ctx.local.market;
      ctx.set({ market: -1 });
      /** @type {HTMLElement | null} */ (ctx.root.querySelector(`[data-action="card"][data-i="${i}"]`))?.focus();
    },
  },
};

/** Move focus into a newly opened sheet. @param {HTMLElement} root */
export const focusSheet = root => /** @type {HTMLElement | null} */ (root.querySelector('.sheet button'))?.focus();
