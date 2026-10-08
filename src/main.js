// Hearthbrew entry point. M1 setup: title screen, ?debug panel, ?gallery art comparison.
// Gameplay screens arrive after the prototype B verdict (design/roadmap.md).
import { VERSION } from './content/index.js';
import { art, STYLES, setStyle, activeStyle, requiredIds, hasArt } from './art/registry.js';
import { SAVE_VERSION } from './core/state.js';

const app = /** @type {HTMLElement} */ (document.getElementById('app'));
const params = new URLSearchParams(location.search);
const root = document.documentElement;

/** @param {string} id */
function useStyle(id) {
  setStyle(id);
  const link = /** @type {HTMLLinkElement} */ (document.getElementById('style-pack'));
  link.href = STYLES[id].css;
}

function title() {
  app.innerHTML = `
    <section class="title">
      <p class="muted">Thornwick · 20 days to Midsummer Eve</p>
      <h1>Hearthbrew</h1>
      ${art('prop:cauldron')}
      <p class="hand">“Keep the pot on a simmer, child, and the riddles will keep themselves.” — W.</p>
      <button class="btn" type="button" disabled>Day 1 · coming soon</button>
      <p class="muted">Build in progress (M1 setup). <a href="?gallery">Art gallery</a></p>
    </section>
    ${params.has('debug') ? `<pre class="debug">content v${VERSION} · save v${SAVE_VERSION} · style ${activeStyle().id}\nseed ${params.get('seed') ?? '1'} · ${innerWidth}×${innerHeight}</pre>` : ''}`;
}

function gallery() {
  let boil = false;
  const render = () => {
    const ids = requiredIds();
    const missing = ids.filter(id => !hasArt(id));
    app.innerHTML = `
      <h1>Art gallery</h1>
      <div class="gallery-controls">
        <div class="seg" role="group" aria-label="Style pack">${Object.values(STYLES).map(s =>
          `<button type="button" data-style="${s.id}" aria-pressed="${s.id === activeStyle().id}">${s.label}</button>`).join('')}</div>
        <div class="seg" role="group" aria-label="Light">
          <button type="button" data-theme="" aria-pressed="${!root.dataset.theme}">Candlelit</button>
          <button type="button" data-theme="day" aria-pressed="${root.dataset.theme === 'day'}">Day</button></div>
        <div class="seg" role="group" aria-label="Cauldron heat">
          <button type="button" data-boil="0" aria-pressed="${!boil}">Simmer</button>
          <button type="button" data-boil="1" aria-pressed="${boil}">Boil</button></div>
        <p class="muted">${ids.length} assets · ${missing.length ? `<b>${missing.length} missing</b>` : 'none missing'} · <a href="./">back</a></p>
      </div>
      <div class="gallery">${ids.map(id => `<figure class="tile${id === 'prop:cauldron' ? ' wide' : ''}${hasArt(id) ? '' : ' missing'}" style="margin:0">${art(id, { boil })}<code>${id}</code></figure>`).join('')}</div>`;
    app.querySelectorAll('[data-style]').forEach(b => b.addEventListener('click', () => { useStyle(/** @type {HTMLElement} */ (b).dataset.style || ''); render(); }));
    app.querySelectorAll('[data-theme]').forEach(b => b.addEventListener('click', () => {
      const t = /** @type {HTMLElement} */ (b).dataset.theme; if (t) root.dataset.theme = t; else delete root.dataset.theme; render();
    }));
    app.querySelectorAll('[data-boil]').forEach(b => b.addEventListener('click', () => { boil = /** @type {HTMLElement} */ (b).dataset.boil === '1'; render(); }));
  };
  render();
}

if (params.has('style') && STYLES[params.get('style') || '']) useStyle(params.get('style') || '');
if (params.has('gallery')) gallery(); else title();
