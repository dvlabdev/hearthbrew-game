// Screen structure tests: views are pure functions returning markup, so they're checked in Node without a DOM.
// (morph and focus need a browser: see the playthrough checks in design/ui-architecture.md.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame } from '../src/core/state.js';
import { startDay, dispatch } from '../src/core/day.js';
import { CUSTOMERS } from '../src/content/index.js';
import { SCREENS, titleScreen } from '../src/ui/game.js';

/** @typedef {import('../src/core/state.js').GameState} GameState @typedef {import('../src/ui/screen.js').Screen} Screen */

/** One state per phase, plus the UI states worth checking (open sheets, picks). */
function cases() {
  /** @type {{ name: string, screen: Screen, s: GameState, local?: Record<string, any> }[]} */ const out = [];
  let seed = 1, s = startDay(newGame(seed));
  while (!s.today?.offer.some(c => c.type === 'expedition')) s = startDay(newGame(++seed));
  const morning = s;
  out.push({ name: 'morning', screen: SCREENS.morning, s: morning });
  const haul = dispatch(morning, { type: 'chooseCard', index: /** @type {any} */ (morning.today).offer.findIndex((/** @type {any} */ c) => c.type === 'expedition') });
  const finds = /** @type {any} */ (haul.today).finds;
  out.push({ name: 'haul', screen: SCREENS.haul, s: haul });
  out.push({ name: 'haul + picks + details', screen: SCREENS.haul, s: haul, local: { ...SCREENS.haul.init?.(haul), picks: finds.slice(0, 2), detail: finds[0], from: 'info' } });
  const ev = dispatch(haul, { type: 'takeHaul', picks: finds.slice(0, 1) });
  out.push({ name: 'event', screen: SCREENS.event, s: ev });
  const resolved = dispatch(ev, { type: 'resolveEvent', choice: 0 });
  out.push({ name: 'event resolved', screen: SCREENS.event, s: ev, local: { done: resolved } });
  out.push({ name: 'shop', screen: SCREENS.shop, s: resolved });
  const night = dispatch(resolved, { type: 'openShop' });
  out.push({ name: 'night', screen: SCREENS.night, s: night });
  // a morning with the market sheet open
  for (let k = 1; k < 80; k++) {
    const r = startDay({ ...newGame(k), coins: 60 });
    const i = /** @type {any} */ (r.today).offer.findIndex((/** @type {any} */ c) => c.offers);
    if (i >= 0) { out.push({ name: 'morning + market sheet', screen: SCREENS.morning, s: r, local: { market: i } }); break; }
  }
  out.push({ name: 'title', screen: { ...titleScreen, init: undefined }, s: newGame(), local: { saved: morning } });
  return out;
}

/** @param {{ screen: Screen, s: GameState, local?: Record<string, any> }} c */
const render = c => String(c.screen.view(c.s, c.local ?? (c.screen.init ? c.screen.init(c.s) : {})));

test('every phase has a screen', () => {
  for (const p of ['morning', 'haul', 'event', 'shop', 'night']) assert.ok(/** @type {any} */ (SCREENS)[p]?.view, p);
});

for (const c of cases()) {
  test(`screen "${c.name}": buttons, names, actions, title`, () => {
    const out = render(c);
    const buttons = [...out.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)];
    assert.ok(buttons.length > 0, 'has buttons');
    for (const [whole, attrs, inner] of buttons) {
      assert.match(attrs, /type="button"/, `button without type: ${whole.slice(0, 80)}`);
      assert.doesNotMatch(inner, /<button\b/, `nested button: ${whole.slice(0, 80)}`);
      const name = /aria-label="[^"]+"/.test(attrs) || inner.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<[^>]+>/g, '').trim().length > 0;
      assert.ok(name, `button without an accessible name: ${whole.slice(0, 120)}`);
    }
    for (const [, name] of out.matchAll(/data-(?:action|hold)="([^"]+)"/g)) assert.ok(c.screen.actions?.[name], `data-action "${name}" has no action`);
    assert.equal([...out.matchAll(/<h1 tabindex="-1">/g)].length, 1, 'one focusable h1');
  });
}

test('content text is escaped on screen', () => {
  const c = cases()[0];
  const who = /** @type {any} */ (c.s.today).featured.who;
  const before = CUSTOMERS[who].clue;
  CUSTOMERS[who].clue = `<b>"Wren's" & co</b>`;
  try {
    const out = render(c);
    assert.ok(out.includes('&lt;b&gt;&quot;Wren&#39;s&quot; &amp; co&lt;/b&gt;'), 'escaped');
    assert.ok(!out.includes(`<b>"Wren's"`), 'not raw');
  } finally { CUSTOMERS[who].clue = before; }
});
