// Morning: the weather card, the customer expected this afternoon, and 3 cards: pick 1 (design/morning.md).
import { art } from '../../art/registry.js';
import { WEATHER, MORNING } from '../../content/index.js';
import { t as tr } from '../../content/strings.js';
import { chooseCard } from '../../core/day.js';
import { hud, clue, herbName, H } from './common.js';

/** @typedef {import('../../core/state.js').GameState} GameState @typedef {import('../../core/state.js').Card} Card */

/** Card art (mini detail level) from content; "weather" means today's weather. @param {Card} c @param {string} weather */
const cardArt = (c, weather) => {
  const id = MORNING.cards[c.type].art;
  return art(id === 'weather' ? `weather:${weather}` : id, { lod: 'mini' });
};

/** @param {GameState} s @param {(next: GameState) => void} go */
export function morning(s, go) {
  const t = /** @type {NonNullable<GameState['today']>} */ (s.today);
  const w = WEATHER[t.weather];
  let market = -1;
  const html = () => `${hud(s)}<section class="screen">
    <h1>${tr('morning.heading')}</h1>
    <figure class="banner">${art(`weather:${t.weather}`).replace('<svg ', '<svg preserveAspectRatio="xMidYMid slice" ')}<figcaption><b>${w.label}.</b> ${w.text}</figcaption></figure>
    ${clue(s)}
    <div class="stack"><p class="eyebrow">${tr('morning.choose')}</p>
      ${t.offer.map((c, i) => `<button class="mcard" type="button" data-card="${i}">${cardArt(c, t.weather)}<span><b>${c.title}</b><span>${c.text}</span></span></button>`).join('')}</div>
    ${market >= 0 ? `<div class="sheet" role="dialog" aria-label="${MORNING.cards.market.title}"><b>${MORNING.cards.market.title}</b><p class="muted">${tr('market.pick')}</p>
      ${(t.offer[market].offers || []).map(h => `<button class="btn secondary block" type="button" data-buy="${h}">${tr('market.offer', { herb: herbName(h), price: H[h].value + MORNING.market.markup })}</button>`).join('')}
      <button class="btn ghost block" type="button" data-close>${tr('market.close')}</button></div>` : ''}
  </section>`;
  /** @param {HTMLElement} root */
  const wire = root => {
    root.querySelectorAll('[data-card]').forEach(b => b.addEventListener('click', () => {
      const i = Number(/** @type {HTMLElement} */ (b).dataset.card);
      if (t.offer[i].type === 'market') { market = i; rerender(root); return; }
      go(chooseCard(s, i));
    }));
    root.querySelectorAll('[data-buy]').forEach(b => b.addEventListener('click', () => go(chooseCard(s, market, { buy: /** @type {HTMLElement} */ (b).dataset.buy }))));
    root.querySelector('[data-close]')?.addEventListener('click', () => { market = -1; rerender(root); });
  };
  /** @param {HTMLElement} root */
  const rerender = root => { root.innerHTML = html(); wire(root); };
  return { html, wire };
}
