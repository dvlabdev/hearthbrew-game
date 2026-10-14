// The game: title, then the day loop (design/morning.md, design/ui-architecture.md).
// go(next) saves and mounts the screen for next.today.phase (SCREENS), so a reload resumes the day where it was.
// Screens update in place (morph); a new screen scrolls to the top and focuses its h1.
import { VERSION, CONTENT, START } from '../content/index.js';
import { t } from '../content/strings.js';
import { validateContent } from '../content/validate.js';
import { SAVE_VERSION, newGame } from '../core/state.js';
import { save, load } from '../core/save.js';
import { startDay } from '../core/day.js';
import { html, pic } from './dom.js';
import { mount } from './screen.js';
import { morning } from './screens/morning.js';
import { haul } from './screens/haul.js';
import { eventCard } from './screens/event.js';
import { shop, nightRecap } from './screens/shop.js';

/** @typedef {import('../core/state.js').GameState} GameState @typedef {import('./screen.js').Screen} Screen */

/** One screen per phase of the day (src/core/day.js PHASES). @type {Record<NonNullable<GameState['today']>['phase'], Screen>} */
export const SCREENS = { morning, haul, event: eventCard, shop, night: nightRecap };

/** The title screen: continue the saved day or start a new game. @type {Screen} */
export const titleScreen = {
  init: () => ({ saved: load() }),
  view: (_, { saved }) => html`<section class="title">
    <p class="muted">${t('title.place', { days: START.days })}</p>
    <h1 tabindex="-1">${t('title.name')}</h1>
    ${pic('prop:cauldron')}
    <p class="hand">${t('title.quote')}</p>
    ${saved?.today ? html`<button class="btn block" type="button" data-action="continue">${t('title.continue', { day: saved.day })}</button>` : ''}
    <button class="btn ${saved?.today ? 'ghost' : ''} block" type="button" data-action="begin">${saved?.today ? t('title.restart') : t('title.begin')}</button>
    <p class="muted">${t('title.build')}</p>
    <p class="muted"><a href="?gallery">${t('title.gallery')}</a> · <a href="?components">${t('title.components')}</a></p>
  </section>`,
  actions: {
    continue: ctx => ctx.local.saved && ctx.go(ctx.local.saved),
    begin: ctx => ctx.go(startDay(newGame((Date.now() % 100000) + 1))),
  },
};

/** @param {HTMLElement} app @param {URLSearchParams} params */
export function startGame(app, params) {
  const debug = params.has('debug');
  app.innerHTML = '<div class="screen-root"></div><pre class="debug" hidden></pre>';
  const root = /** @type {HTMLElement} */ (app.firstElementChild);
  const panel = /** @type {HTMLElement} */ (app.lastElementChild);
  const status = document.getElementById('status');

  const contentErrors = debug ? validateContent(CONTENT) : [];
  const errorsLine = contentErrors.length ? `\nCONTENT ERRORS (${contentErrors.length}):\n${contentErrors.join('\n')}` : '\ncontent: valid';
  /** @param {GameState | null} s */
  const showDebug = s => {
    panel.hidden = !debug;
    if (!debug) return;
    panel.textContent = s?.today
      ? `content v${VERSION} · save v${SAVE_VERSION} · seed ${s.seed} · day ${s.day} · phase ${s.today.phase}
haul times (s): ${(s.log.haul || []).map(ms => (ms / 1000).toFixed(1)).join(', ') || '-'} (target < 30)
${innerWidth}×${innerHeight}${errorsLine}`
      : `content v${VERSION} · save v${SAVE_VERSION} · try ?debug&day=5&seed=3${errorsLine}`;
  };

  /** Mount a screen fresh: new local state, top of the page, focus on its title. @param {Screen} screen @param {GameState} s */
  const open = (screen, s) => {
    mount(root, screen, s, go, { status, save });
    showDebug(s.today ? s : null);
    window.scrollTo(0, 0);
    /** @type {HTMLElement | null} */ (root.querySelector('h1'))?.focus({ preventScroll: true });
  };

  /** @param {GameState} s */
  function go(s) {
    if (!s.today) { open(titleScreen, s); return; }
    save(s);
    open(SCREENS[s.today.phase], s);
  }

  if (debug && params.has('day')) {
    // the debug bot needs the haul sim: load it only here, so the game itself never depends on src/sim
    import('./debugBot.js').then(m => go(m.botTo(Number(params.get('seed') || 1), Math.max(1, Number(params.get('day'))))));
  } else open(titleScreen, newGame());
}

