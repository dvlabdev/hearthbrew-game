// Choose your haul (design/expedition.md): finds grouped by kind, a 5-slot basket, the shelf strip, the clue as words.
// Long-press a find for its details; tap a basket slot to put a find back. What you leave behind stays behind.
import { art } from '../../art/registry.js';
import { HAUL } from '../../content/index.js';
import { applyHaul, knows, logPhase } from '../../core/day.js';
import { pickedItem, slotsUsed } from '../../core/haul.js';
import { findTile } from '../components.js';
import { hud, clue, shelfStrip, herbName, H } from './common.js';

/** @typedef {import('../../core/state.js').GameState} GameState */
const TRAIT = { heat: 'Heat', calm: 'Calm', vigor: 'Vigor', clarity: 'Clarity' };
const LONG_PRESS = 450;

/** @param {GameState} s @param {(next: GameState) => void} go */
export function haul(s, go) {
  const t = /** @type {NonNullable<GameState['today']>} */ (s.today);
  const card = t.offer[/** @type {number} */ (t.card)];
  const started = performance.now();
  /** @type {string[]} */ let picks = [];
  /** @type {string | null} */ let detail = null;
  const kinds = [...new Set(t.finds)];
  const left = (/** @type {string} */ h) => t.finds.filter(f => f === h).length - picks.filter(p => p === h).length;

  const html = () => {
    const used = slotsUsed(picks);
    const tiles = kinds.map(h => {
      const it = pickedItem(h, t.weather), n = left(h);
      return findTile({ herb: h, label: herbName(h), count: n, value: it.value, prime: it.prime, poor: it.poor, rare: H[h].rarity === 'rare', heavy: H[h].slots > 1,
        pressed: n === 0, disabled: n > 0 && used + H[h].slots > HAUL.basket }).replace('<button type="button" class="find', `<button type="button" data-find="${h}" class="find`);
    }).join('');
    const slots = picks.map((p, i) => `<button type="button" class="slot full${H[p].slots > 1 ? ' span2' : ''}" data-unpick="${i}" aria-label="Put back ${herbName(p)}">${art(`ingredient:${p}`, { lod: 'mini' })}</button>`).join('')
      + Array.from({ length: HAUL.basket - used }, () => '<span class="slot" aria-hidden="true"></span>').join('');
    const d = detail ? pickedItem(detail, t.weather) : null;
    return `${hud(s)}<section class="screen">
      <div><p class="eyebrow">${card.title}</p><h1>Choose your haul</h1></div>
      ${clue(s)}
      ${shelfStrip(s.shelf, picks)}
      <div class="stack"><div class="row-between"><p class="eyebrow">Today's finds</p><span class="muted">Hold for details</span></div><div class="finds">${tiles}</div></div>
      <div class="stack"><div class="row-between"><p class="eyebrow">Basket</p><span class="muted">${used}/${HAUL.basket} slots</span></div><div class="basket">${slots}</div></div>
      <div class="dock"><button class="btn block" type="button" data-home>${picks.length ? `Head home with ${picks.length}` : 'Head home empty-handed'}</button></div>
      ${detail && d ? `<div class="sheet" role="dialog" aria-label="${herbName(detail)} details"><div class="clue">${art(`ingredient:${detail}`)}<div><b>${herbName(detail)}</b>
        <span class="muted">${H[detail].kind} · ${H[detail].rarity}${H[detail].slots > 1 ? ' · heavy: 2 slots' : ''}</span></div></div>
        <p>Worth ${d.value} coin${d.value === 1 ? '' : 's'}${d.prime ? ' (prime today: a double dose)' : d.poor ? ' (poor today)' : ''}. Keeps ${d.nights} nights.</p>
        <p>${knows(s, detail) ? `Brings <b>${TRAIT[/** @type {'heat'} */ (H[detail].trait)]}</b>.` : '<span class="muted">The Notebook doesn\'t know this one yet. Pick it to learn it.</span>'}</p>
        <button class="btn secondary block" type="button" data-close>Close</button></div>` : ''}
    </section>`;
  };

  /** @param {HTMLElement} root */
  const wire = root => {
    root.querySelectorAll('[data-find]').forEach(el => {
      const b = /** @type {HTMLButtonElement} */ (el), h = /** @type {string} */ (b.dataset.find);
      /** @type {number | undefined} */ let timer; let long = false;
      b.addEventListener('pointerdown', () => { long = false; timer = window.setTimeout(() => { long = true; detail = h; rerender(root); }, LONG_PRESS); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => clearTimeout(timer)));
      b.addEventListener('contextmenu', e => e.preventDefault());
      b.addEventListener('click', () => {
        if (long || b.disabled) return;
        if (left(h) > 0 && slotsUsed(picks) + H[h].slots <= HAUL.basket) { picks = [...picks, h]; rerender(root); }
      });
    });
    root.querySelectorAll('[data-unpick]').forEach(b => b.addEventListener('click', () => {
      const i = Number(/** @type {HTMLElement} */ (b).dataset.unpick); picks = picks.filter((_, j) => j !== i); rerender(root);
    }));
    root.querySelector('[data-close]')?.addEventListener('click', () => { detail = null; rerender(root); });
    root.querySelector('[data-home]')?.addEventListener('click', () => go(applyHaul(logPhase(s, 'haul', performance.now() - started), picks)));
  };
  /** @param {HTMLElement} root */
  const rerender = root => { const y = window.scrollY; root.innerHTML = html(); wire(root); window.scrollTo(0, y); };
  return { html, wire };
}
