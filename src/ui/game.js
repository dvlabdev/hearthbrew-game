// The game screens. Part A: title only; the day loop arrives with design/morning.md.
import { art } from '../art/registry.js';
import { VERSION } from '../content/index.js';
import { SAVE_VERSION } from '../core/state.js';

/** @param {HTMLElement} app @param {URLSearchParams} params */
export function startGame(app, params) {
  app.innerHTML = `
    <section class="title">
      <p class="muted">Thornwick · 20 days to Midsummer Eve</p>
      <h1>Hearthbrew</h1>
      ${art('prop:cauldron')}
      <p class="hand">“Keep the pot on a simmer, child, and the riddles will keep themselves.” — W.</p>
      <button class="btn" type="button" disabled>Day 1 · coming soon</button>
      <p class="muted"><a href="?gallery">Art gallery</a> · <a href="?components">Components</a></p>
    </section>
    ${params.has('debug') ? `<pre class="debug">content v${VERSION} · save v${SAVE_VERSION}\nseed ${params.get('seed') ?? '1'} · ${innerWidth}×${innerHeight}</pre>` : ''}`;
}
