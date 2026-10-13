// The game: title, then the day loop (design/morning.md). Each screen gets the state and `go(next)`;
// `go` saves and renders by phase, so a reload resumes the day where it was.
import { art } from '../art/registry.js';
import { VERSION, CONTENT, START } from '../content/index.js';
import { t } from '../content/strings.js';
import { validateContent } from '../content/validate.js';
import { SAVE_VERSION, newGame } from '../core/state.js';
import { save, load } from '../core/save.js';
import { startDay, dispatch } from '../core/day.js';
import { STRATEGIES } from '../sim/haulSim.js';
import { makeRng } from '../core/rng.js';
import { morning } from './screens/morning.js';
import { haul } from './screens/haul.js';
import { eventCard } from './screens/event.js';
import { shop, nightRecap } from './screens/shop.js';

/** @typedef {import('../core/state.js').GameState} GameState */

/** Bot-play a seeded game to day N (debug: test hauls on days 5 and 10). @param {number} seed @param {number} toDay */
function botTo(seed, toDay) {
  let s = startDay(newGame(seed));
  const rng = makeRng(seed);
  while (s.day < toDay) {
    const t = /** @type {NonNullable<GameState['today']>} */ (s.today);
    const exp = t.offer.findIndex(c => c.type === 'expedition');
    s = dispatch(s, { type: 'chooseCard', index: Math.max(0, exp), buy: t.offer[Math.max(0, exp)].offers?.[0] });
    if (s.today?.phase === 'haul') {
      s = dispatch(s, { type: 'takeHaul', picks: STRATEGIES.planner(s.shelf, { ...t }, rng) });
      s = dispatch(s, { type: 'resolveEvent', choice: 0 });
    }
    s = dispatch(dispatch(s, { type: 'openShop' }), { type: 'sleep' });
  }
  return s;
}

/** @param {HTMLElement} app @param {URLSearchParams} params */
export function startGame(app, params) {
  const debug = params.has('debug');

  /** @param {GameState} s */
  const go = s => {
    save(s);
    const t = s.today;
    if (!t) { title(); return; }
    const scr = t.phase === 'morning' ? morning(s, go) : t.phase === 'haul' ? haul(s, go) : t.phase === 'event' ? eventCard(s, go)
      : t.phase === 'shop' ? shop(s, go) : nightRecap(s, go);
    app.innerHTML = scr.html() + (debug ? debugPanel(s) : '');
    scr.wire(app);
    window.scrollTo(0, 0);
  };

  const contentErrors = debug ? validateContent(CONTENT) : [];
  const errorsLine = () => (contentErrors.length ? `\nCONTENT ERRORS (${contentErrors.length}):\n${contentErrors.join('\n')}` : '\ncontent: valid');
  /** @param {GameState} s */
  const debugPanel = s => `<pre class="debug">content v${VERSION} · save v${SAVE_VERSION} · seed ${s.seed} · day ${s.day} · phase ${s.today?.phase}
haul times (s): ${(s.log.haul || []).map(ms => (ms / 1000).toFixed(1)).join(', ') || '-'} (target < 30)
${innerWidth}×${innerHeight}${errorsLine()}</pre>`;

  const title = () => {
    const saved = load();
    app.innerHTML = `
      <section class="title">
        <p class="muted">${t('title.place', { days: START.days })}</p>
        <h1>${t('title.name')}</h1>
        ${art('prop:cauldron')}
        <p class="hand">${t('title.quote')}</p>
        ${saved?.today ? `<button class="btn block" type="button" data-continue>${t('title.continue', { day: saved.day })}</button>` : ''}
        <button class="btn ${saved?.today ? 'ghost' : ''} block" type="button" data-new>${saved?.today ? t('title.restart') : t('title.begin')}</button>
        <p class="muted">${t('title.build')}</p>
        <p class="muted"><a href="?gallery">${t('title.gallery')}</a> · <a href="?components">${t('title.components')}</a></p>
      </section>${debug ? `<pre class="debug">content v${VERSION} · save v${SAVE_VERSION} · try ?debug&day=5&seed=3${errorsLine()}</pre>` : ''}`;
    app.querySelector('[data-continue]')?.addEventListener('click', () => saved && go(saved));
    app.querySelector('[data-new]')?.addEventListener('click', () => go(startDay(newGame((Date.now() % 100000) + 1))));
  };

  if (debug && params.has('day')) go(botTo(Number(params.get('seed') || 1), Math.max(1, Number(params.get('day')))));
  else title();
}
