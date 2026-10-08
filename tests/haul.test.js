import { test } from 'node:test';
import assert from 'node:assert/strict';
import days from './fixtures/haul_days.json' with { type: 'json' };
import { playDay, pickedItem, serve, slotsUsed } from '../src/core/haul.js';

test('matches the validated haul_sim on the 5 scripted days (coins, served, wilted, rares)', () => {
  for (const d of days) {
    const r = playDay(/** @type {any} */ (d.stockBefore), /** @type {any} */ (d), d.picks);
    assert.equal(r.coins, d.coins, `day ${d.day}`);
    assert.deepEqual(r.served, d.served, `day ${d.day}`);
    assert.deepEqual(r.wilted, d.wilted, `day ${d.day}`);
    assert.equal(r.rares, d.rares, `day ${d.day}`);
  }
  assert.deepEqual(days.map(d => d.coins), [66, 68, 47, 70, 51]);
});

test('weather: prime is a double dose and +1 value; poor loses value and a night', () => {
  const sunChamomile = pickedItem('chamomile', 'sun');
  assert.equal(sunChamomile.units, 2); assert.equal(sunChamomile.value, 2); assert.ok(sunChamomile.prime);
  const sunGlowcap = pickedItem('glowcap', 'sun');      // mushrooms dry out in the sun
  assert.ok(sunGlowcap.poor); assert.equal(sunGlowcap.nights, 2);
  assert.equal(pickedItem('mint', 'frost').nights, 3);   // frost: +1 night, but leaves are poor (-1)
  assert.equal(pickedItem('fireroot', 'frost').nights, 4);
});

test('regression: twin items are removed one at a time, never together', () => {
  const a = { herb: 'mint', nights: 1, units: 1, value: 1 };
  const b = { herb: 'mint', nights: 1, units: 1, value: 1 };
  const r = serve([a, b], 'clarity', 1);
  assert.ok(r.ok);
  assert.equal(r.stock.length, 1, 'one identical mint must remain');
});

test('heavy finds take two basket slots', () => {
  assert.equal(slotsUsed(['valerian', 'chamomile']), 3);
  assert.equal(slotsUsed(['glowcap', 'glowcap', 'mint']), 5);
});
