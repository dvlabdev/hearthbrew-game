// Hearthbrew entry point: style setup, the game (src/ui/game.js), ?gallery (art) and ?components (design system).
import { art, STYLES, setStyle, activeStyle, requiredIds, styleDefs } from './art/registry.js';
import { componentsGallery } from './ui/componentsGallery.js';
import { startGame } from './ui/game.js';

const app = /** @type {HTMLElement} */ (document.getElementById('app'));
const params = new URLSearchParams(location.search);
const root = document.documentElement;
export const DEFAULT_STYLE = 'hearthlight';

/** Switch the style pack: its tokens (stylesheet) and its shared SVG defs. @param {string} id */
function useStyle(id) {
  setStyle(id);
  const link = /** @type {HTMLLinkElement} */ (document.getElementById('style-pack'));
  link.href = STYLES[id].css;
  const host = /** @type {HTMLElement} */ (document.getElementById('defs'));
  host.innerHTML = `<svg width="0" height="0">${styleDefs()}</svg>`;
}

/** Shared controls for the two galleries: style pack + Candlelit/Day. @param {() => void} render */
function controls(render, extra = '') {
  const html = `<div class="gallery-controls">
    <div class="seg" role="group" aria-label="Style pack">${Object.values(STYLES).filter(s => !s.exploration || s.round === 3).map(s =>
      `<button type="button" data-style="${s.id}" aria-pressed="${s.id === activeStyle().id}">${s.label}</button>`).join('')}</div>
    <div class="seg" role="group" aria-label="Light">
      <button type="button" data-theme="" aria-pressed="${!root.dataset.theme}">Candlelit</button>
      <button type="button" data-theme="day" aria-pressed="${root.dataset.theme === 'day'}">Day</button></div>${extra}</div>`;
  const wire = () => {
    app.querySelectorAll('[data-style]').forEach(b => b.addEventListener('click', () => { useStyle(/** @type {HTMLElement} */ (b).dataset.style || ''); render(); }));
    app.querySelectorAll('[data-theme]').forEach(b => b.addEventListener('click', () => {
      const t = /** @type {HTMLElement} */ (b).dataset.theme; if (t) root.dataset.theme = t; else delete root.dataset.theme; render();
    }));
  };
  return { html, wire };
}

function gallery() {
  let boil = false;
  const render = () => {
    const ids = requiredIds();
    const missing = ids.filter(id => !activeStyle().ASSETS[id]);
    const c = controls(render, `<div class="seg" role="group" aria-label="Cauldron heat">
      <button type="button" data-boil="0" aria-pressed="${!boil}">Simmer</button><button type="button" data-boil="1" aria-pressed="${boil}">Boil</button></div>
      <p class="muted">${ids.length} assets · ${missing.length ? `<b>${missing.length} from the v0 fallback</b> (dashed)` : 'all drawn in this style'} · <a href="./">back</a></p>`);
    app.innerHTML = `<h1>Art gallery</h1>${c.html}
      <div class="gallery">${ids.map(id => `<figure class="tile${id === 'prop:cauldron' ? ' wide' : ''}${activeStyle().ASSETS[id] ? '' : ' missing'}" style="margin:0">${art(id, { boil })}<code>${id}</code></figure>`).join('')}</div>`;
    c.wire();
    app.querySelectorAll('[data-boil]').forEach(b => b.addEventListener('click', () => { boil = /** @type {HTMLElement} */ (b).dataset.boil === '1'; render(); }));
  };
  render();
}

function components() {
  const render = () => {
    const c = controls(render, '<p class="muted"><a href="./">back</a> · tokens: src/ui/tokens.css · components: src/ui/components.css</p>');
    app.innerHTML = `<h1>Components</h1>${c.html}${componentsGallery()}`;
    c.wire();
  };
  render();
}

useStyle(STYLES[params.get('style') || ''] ? /** @type {string} */ (params.get('style')) : DEFAULT_STYLE);
if (params.has('gallery')) gallery();
else if (params.has('components')) components();
else startGame(app, params);
