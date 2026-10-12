// ?components: the living component gallery (design/visual/05-design-system.md). Every component in every state,
// rendered with the active style pack, so a style change is checked here first.
import { art } from '../art/registry.js';
import { findTile, shelfChip, meter } from './components.js';


/** @param {string} title @param {string} body @param {string} [note] */
const section = (title, body, note = '') => `<section class="card"><h2>${title}</h2>${note ? `<p class="muted">${note}</p>` : ''}${body}</section>`;

export function componentsGallery() {
  return [
    section('Buttons', `<div class="states">
      <button class="btn" type="button">Primary</button><button class="btn" type="button" aria-pressed="true">Selected</button><button class="btn" type="button" disabled>Disabled</button></div>
      <div class="states"><button class="btn secondary" type="button">Secondary</button><button class="btn ghost" type="button">Ghost</button><button class="btn ghost" type="button" disabled>Ghost disabled</button></div>`,
    'Press any button to see the pressed state. Tab to see focus.'),
    section('Morning card', `<div class="stack">
      <button class="mcard" type="button" aria-pressed="false">${art('weather:sun', { lod: 'mini' })}<span><b>Expedition: the Mill Path</b><span>Sunny. Flowers at their best.</span></span></button>
      <button class="mcard" type="button" aria-pressed="true">${art('ingredient:chamomile', { lod: 'mini' })}<span><b>Tend the garden</b><span>Selected</span></span></button>
      <button class="mcard" type="button" disabled>${art('ui:coin')}<span><b>Market day</b><span>Disabled (no coins)</span></span></button></div>`),
    section('Find tiles', `<div class="finds">
      ${findTile({ herb: 'chamomile', label: 'Chamomile', count: 3, value: 3, prime: true })}
      ${findTile({ herb: 'nettle', label: 'Nettle', count: 1, value: 1, poor: true })}
      ${findTile({ herb: 'lavender', label: 'Lavender', count: 1, value: 5, rare: true })}
      ${findTile({ herb: 'valerian', label: 'Valerian', count: 1, value: 4, heavy: true })}
      ${findTile({ herb: 'mint', label: 'Mint', count: 2, value: 2, pressed: true })}
      ${findTile({ herb: 'sage', label: 'Sage', count: 1, value: 2, disabled: true })}</div>`,
    'Default · prime ▲ · poor ▼ · rare glow · heavy (2 slots) · picked · disabled (basket full). At most two badges per tile.'),
    section('Basket', `<div class="basket"><button type="button" class="slot full">${art('ingredient:chamomile', { lod: 'mini' })}</button>
      <button type="button" class="slot full span2">${art('ingredient:valerian', { lod: 'mini' })}</button><span class="slot"></span><span class="slot"></span></div>`,
    'Five slots; heavy finds take two. Tap a filled slot to put it back.'),
    section('Shelf chips', `<div class="shelf">${shelfChip({ herb: 'chamomile', count: 2, next: 3, nights: [1, 3, 3] })}${shelfChip({ herb: 'nettle', count: 1, nights: [2] })}${shelfChip({ herb: 'sage', count: 1, nights: [1] })}</div>`,
    'One pip per item; a red pip wilts tonight. "→3" previews the basket while you pick.'),
    section('HUD pills', `<div class="states"><span class="pill">Day 3 <small>of 20</small></span><span class="pill">${art('ui:coin')}24</span><span class="pill">${art('weather:mist', { lod: 'mini' })}Mist</span></div>`),
    section('Clue: tomorrow, as words', `<div class="clue">${art('portrait:marla')}<div><b>Marla</b><q>something to quiet the mind</q></div></div>`,
    'Never ticks: reading it is the player\'s job (pillar 1).'),
    section('Segmented toggle', `<div class="seg" role="group" aria-label="Example"><button type="button" aria-pressed="true">Simmer</button><button type="button" aria-pressed="false">Boil</button><button type="button" disabled>Locked</button></div>`),
    section('Trait meter', meter(), 'Colour + shape + glyph, and the number.'),
    section('Sheet and toast', `<div class="sheet inline"><b>Valerian root</b><p class="muted">Heavy: takes 2 slots. Calm. Keeps 3 nights.</p><button class="btn secondary" type="button">Close</button></div>
      <p><span class="toast inline">Basket full</span></p>`, 'The sheet opens on long-press (details); the toast confirms quietly.'),
  ].join('');
}
