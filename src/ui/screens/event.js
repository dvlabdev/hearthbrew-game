// One event card after the haul: Spot the herb, an Encounter or a Discovery (design/morning.md). Never a penalty.
import { art } from '../../art/registry.js';
import { EVENTS } from '../../content/index.js';
import { resolveEvent, spotOrder } from '../../core/day.js';
import { hud, herbName } from './common.js';

/** @typedef {import('../../core/state.js').GameState} GameState */

/** @param {GameState} s @param {(next: GameState) => void} go */
export function eventCard(s, go) {
  const t = /** @type {NonNullable<GameState['today']>} */ (s.today);
  const ev = /** @type {NonNullable<typeof t.event>} */ (t.event);
  /** @type {GameState | null} */ let done = null;   // the resolved state, shown as an outcome before moving on

  const body = () => {
    const r = done?.today?.event;
    if (ev.kind === 'spot') {
      const card = /** @type {(typeof EVENTS.spot)[0]} */ (EVENTS.spot.find(e => e.id === ev.id));
      const order = spotOrder(s, card);
      return `<h1>Spot the herb</h1><p>Two look-alikes by the path. Which one is <b>${herbName(card.good)}</b>? Look inside the circle.</p>
        <div class="grid2">${order.map((p, i) => `<button type="button" class="mcard spot" data-choice="${i}"${done ? ' disabled' : ''} aria-label="The ${i ? 'right' : 'left'} plant"${r?.choice === i ? ' aria-pressed="true"' : ''}>${art(`plant:${p}`)}</button>`).join('')}</div>
        ${r ? `<section class="card"><p class="hand">${r.right ? card.right : card.wrong}</p>${r.right ? `<p>You found a <b>${herbName(card.reward)}</b> nearby, a rare one. It's in your basket.</p>` : '<p class="muted">The field guide in the Notebook remembers it for you.</p>'}</section>` : ''}`;
    }
    if (ev.kind === 'encounter') {
      const card = /** @type {(typeof EVENTS.encounter)[0]} */ (EVENTS.encounter.find(e => e.id === ev.id));
      return `<h1>${card.title}</h1><p>${card.text}</p>
        ${r ? `<section class="card"><p>${card.options[/** @type {number} */ (r.choice)].text}</p></section>`
        : `<div class="stack">${card.options.map((o, i) => `<button class="btn secondary block" type="button" data-choice="${i}">${o.label}</button>`).join('')}</div>`}`;
    }
    const card = /** @type {(typeof EVENTS.discovery)[0]} */ (EVENTS.discovery.find(e => e.id === ev.id));
    return `<h1>${card.title}</h1><section class="card"><p class="hand">${card.text}</p></section>
      ${r ? '<p>Tucked into the Notebook, under brewing rules.</p>' : '<button class="btn secondary block" type="button" data-choice="0">Keep the page</button>'}`;
  };
  const html = () => `${hud(done || s)}<section class="screen">${body()}
    ${done ? '<div class="dock"><button class="btn block" type="button" data-next>On to the shop</button></div>' : ''}</section>`;
  /** @param {HTMLElement} root */
  const wire = root => {
    root.querySelectorAll('[data-choice]').forEach(b => b.addEventListener('click', () => {
      done = resolveEvent(s, Number(/** @type {HTMLElement} */ (b).dataset.choice)); root.innerHTML = html(); wire(root);
    }));
    root.querySelector('[data-next]')?.addEventListener('click', () => go(/** @type {GameState} */ (done)));
  };
  return { html, wire };
}
