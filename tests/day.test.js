import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, SAVE_VERSION } from '../src/core/state.js';
import { migrate } from '../src/core/save.js';
import { startDay, chooseCard, applyHaul, resolveEvent, runShop, endDay, nextDay, spotOrder } from '../src/core/day.js';
import { HAUL, FORAGE, CUSTOMERS, EVENTS } from '../src/content/index.js';
import { STRATEGIES } from '../src/sim/haulSim.js';
import { makeRng } from '../src/core/rng.js';

const H = FORAGE;

test('a morning offers 3 distinct cards, at most one expedition, market only when affordable', () => {
  for (let seed = 1; seed <= 60; seed++) {
    const s = startDay(newGame(seed));
    const types = s.today?.offer.map(c => c.type) || [];
    assert.equal(types.length, 3);
    assert.equal(new Set(types).size, 3, `seed ${seed}: duplicate cards ${types}`);
    assert.ok(!types.includes('market'), 'no coins on day 1, so no market');
  }
});

test('the finds follow the generator rule: >= 2 serve the expected customer, >= 1 rare or heavy', () => {
  for (let seed = 1; seed <= 60; seed++) {
    const t = startDay(newGame(seed)).today;
    if (!t) throw new Error('no day');
    const trait = CUSTOMERS[t.featured.who].trait;
    assert.ok(t.finds.filter(f => H[f].trait === trait).length >= 2, `seed ${seed}`);
    assert.ok(t.finds.some(f => H[f].rarity === 'rare' || H[f].slots > 1), `seed ${seed}`);
  }
});

test('the same seed replays the same day', () => {
  assert.deepEqual(startDay(newGame(7)), startDay(newGame(7)));
  assert.notDeepEqual(startDay(newGame(7)).today, startDay(newGame(8)).today);
});

test('every card type and event resolves; a wrong Spot the herb costs nothing', () => {
  let s = startDay(newGame(3));
  s.coins = 50;
  s = startDay(s);
  for (let i = 0; i < 3; i++) {
    const after = chooseCard(s, i, {});
    assert.ok(after.today && ['haul', 'shop'].includes(after.today.phase));
    if (s.today?.offer[i].type === 'market') assert.ok(after.coins < s.coins);
  }
  const spot = EVENTS.spot[0];
  const base = { ...startDay(newGame(5)) };
  if (!base.today) throw new Error('no day');
  base.today.phase = 'event'; base.today.event = { kind: 'spot', id: spot.id };
  const wrongIndex = spotOrder(base, spot).indexOf(spot.bad);
  const wrong = resolveEvent(base, wrongIndex);
  assert.equal(wrong.today?.event?.right, false);
  assert.equal(wrong.shelf.length, base.shelf.length, 'no penalty');
  const right = resolveEvent(base, 1 - wrongIndex);
  assert.equal(right.today?.event?.right, true);
  assert.equal(right.shelf.length, base.shelf.length + 1, 'bonus rare find');
});

test('a 20-day bot plays the whole loop; coins never go down except at the market', () => {
  let s = startDay(newGame(11));
  const rng = makeRng(99);
  for (let d = 0; d < 20; d++) {
    const t = s.today; if (!t) throw new Error('no day');
    const exp = t.offer.findIndex(c => c.type === 'expedition');
    const before = s.coins;
    s = chooseCard(s, exp >= 0 ? exp : 0);
    if (s.today?.phase === 'haul') {
      const picks = STRATEGIES.planner(s.shelf, { weather: t.weather, featured: t.featured, others: t.others, finds: t.finds }, rng);
      s = applyHaul(s, picks);
      s = resolveEvent(s, 0);
    }
    s = endDay(runShop(s));
    if (t.offer[exp >= 0 ? exp : 0].type !== 'market') assert.ok(s.coins >= before, `day ${s.day}: coins fell`);
    assert.ok(s.shelf.every(i => i.nights > 0), 'wilted items leave the shelf');
    s = nextDay(s);
  }
  assert.equal(s.day, 21);
  assert.ok(s.coins > 200, `20 days should earn a living (got ${s.coins})`);
});

test('the basket cannot exceed its slots, and picks must come from the finds', () => {
  let s = startDay(newGame(2));
  const exp = s.today?.offer.findIndex(c => c.type === 'expedition') ?? -1;
  if (exp < 0) return;
  s = chooseCard(s, exp);
  assert.throws(() => applyHaul(s, ['valerian', 'valerian', 'glowcap']));
  assert.throws(() => applyHaul(s, ['not-a-herb']));
});

test('v1 saves migrate to v2 with no day in progress', () => {
  const v1 = { ...newGame(4), saveVersion: 1, shelf: [] };
  delete (/** @type {any} */ (v1)).today; delete (/** @type {any} */ (v1)).log; delete (/** @type {any} */ (v1)).lastSpotDay;
  const m = migrate(v1);
  assert.equal(m.saveVersion, SAVE_VERSION);
  assert.equal(m.today, null);
  assert.ok(m.shelf.length > 0, 'an empty shelf gets the starting stock');
});
