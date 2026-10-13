import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stream, makeRng } from '../src/core/rng.js';
import { genDay, START_STOCK } from '../src/core/haul.js';
import { newGame } from '../src/core/state.js';
import { startDay } from '../src/core/day.js';
import { WEATHER } from '../src/content/index.js';

const NAMES = ['day.weather', 'day.customers', 'day.finds', 'morning.offer', 'morning.card', 'event.draw', 'event.resolve', 'spot.order'];
/** @param {() => number} r @param {number} n */
const take = (r, n) => Array.from({ length: n }, () => r());

test('a stream is deterministic: same seed, day and name, same sequence', () => {
  assert.deepEqual(take(stream({ seed: 7, day: 3 }, 'day.finds'), 20), take(stream({ seed: 7, day: 3 }, 'day.finds'), 20));
});

test('streams differ by name, day and seed (no collisions over 200 seeds x 30 days x every name)', () => {
  /** @type {Set<string>} */ const seen = new Set();
  let n = 0;
  for (let seed = 1; seed <= 200; seed++) for (let day = 1; day <= 30; day++) for (const name of NAMES) {
    const r = stream({ seed, day }, name);
    seen.add(`${r()}|${r()}`); n++;
  }
  assert.equal(seen.size, n);
});

test('the generator keeps the validated draw order when given one generator (the sims)', () => {
  // with a single generator genDay must draw exactly as before streams existed: weather, featured, finds, others
  const a = genDay(makeRng(5), START_STOCK);
  const r = makeRng(5);
  const b = genDay({ weather: r, customers: r, finds: r }, START_STOCK);
  assert.deepEqual(a, b);
});

test('independence: more finds drawn never changes the weather, the customers or the morning offer', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const base = /** @type {NonNullable<ReturnType<typeof startDay>['today']>} */ (startDay(newGame(seed)).today);
    const w = WEATHER[base.weather];
    w.finds += 3; w.extraRare += 1;   // the finds stream now draws more
    try {
      const again = /** @type {NonNullable<ReturnType<typeof startDay>['today']>} */ (startDay(newGame(seed)).today);
      assert.equal(again.finds.length, base.finds.length + 4, `seed ${seed}: more finds`);
      assert.equal(again.weather, base.weather);
      assert.deepEqual([again.featured, again.others], [base.featured, base.others], `seed ${seed}: customers moved`);
      assert.deepEqual(again.offer, base.offer, `seed ${seed}: the morning offer moved`);
    } finally { w.finds -= 3; w.extraRare -= 1; }
  }
});
