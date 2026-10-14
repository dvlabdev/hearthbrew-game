import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame } from '../src/core/state.js';
import { startDay, dispatch, tomorrow, chooseCard, applyHaul, resolveEvent } from '../src/core/day.js';
import { available, buy, seedChoices, status, nextUnlock, needsSeed } from '../src/core/ledger.js';
import { LEDGER, CUSTOMERS } from '../src/content/index.js';

/** @typedef {import('../src/core/state.js').GameState} GameState */

/** A state at night on a given day, with coins. @param {number} day @param {number} coins @param {number} [seed] */
function nightOn(day, coins, seed = 3) {
  const s = startDay({ ...newGame(seed), day });
  if (!s.today) throw new Error('no day');
  s.today.phase = 'night'; s.coins = coins;
  return s;
}
/** @param {string} id */
const byId = id => /** @type {import('../src/content/types.js').LedgerItem} */ (LEDGER.items.find(it => it.id === id));

test('tomorrow() is exactly who comes tomorrow (200 seeds x 10 days)', () => {
  for (let seed = 1; seed <= 200; seed++) for (let day = 1; day <= 10; day++) {
    const s = startDay({ ...newGame(seed), day });
    const next = startDay({ ...s, day: day + 1 });
    assert.deepEqual(tomorrow(s), next.today?.featured, `seed ${seed} day ${day}`);
  }
});

test('the catalogue: what works now is buyable, the rest waits; days and prices gate', () => {
  const day1 = nightOn(1, 999);
  assert.equal(status(day1, byId('plot3')), 'locked', 'plot 3 opens on day 2');
  const day2 = nightOn(2, 10);
  assert.equal(status(day2, byId('plot3')), 'poor');
  assert.equal(status(nightOn(2, 40), byId('plot3')), 'buyable');
  assert.equal(status(nightOn(5, 999), byId('kettle')), 'soon', 'stations wait for the brewing bench');
  assert.equal(status(nightOn(9, 999), byId('plot4')), 'locked', 'plot 4 needs plot 3');
  assert.equal(status(nightOn(13, 999), byId('donate-wood')), 'locked', 'donations open on day 14');
  assert.equal(status(nightOn(14, 999), byId('donate-wood')), 'buyable');
  assert.ok(available(day2).every(x => ['owned', 'locked', 'soon', 'poor', 'buyable'].includes(x.status)));
  assert.equal(nextUnlock(day1)?.id, 'plot3');
  assert.throws(() => buy(nightOn(5, 999), 'kettle'), /can't be bought/);
});

test('buying a plot: pay, choose a valid seed, the garden card then harvests it too', () => {
  let s = nightOn(2, 100);
  assert.deepEqual(seedChoices(s), ['chamomile', 'mint'], 'the starting plots, before the Notebook knows anything');
  assert.ok(needsSeed(byId('plot3')));
  assert.throws(() => buy(s, 'plot3'), /needs a seed/);
  assert.throws(() => buy(s, 'plot3', { seed: 'glowcap' }), /needs a seed/, 'not growable');
  s.notebook.known.lavender = [true, true, true, true];
  assert.ok(seedChoices(s).includes('lavender'), 'the Notebook knows it, and it grows in a garden');
  s = dispatch(s, { type: 'buy', item: 'plot3', seed: 'lavender' });
  assert.equal(s.today?.phase, 'night', 'a purchase stays at night');
  assert.equal(s.coins, 60);
  assert.deepEqual(s.garden.map(p => p.plant), ['chamomile', 'mint', 'lavender']);
  assert.ok(s.owned.includes('plot3'));
  assert.equal(status(s, byId('plot3')), 'owned');
  assert.throws(() => buy(s, 'plot3', { seed: 'mint' }), /owned/, 'once only');
  // tomorrow, the garden card harvests three herbs
  let next = dispatch(s, { type: 'sleep' });
  if (!next.today) throw new Error('no day');
  next.today.offer = [{ type: 'garden', title: 'Tend the garden', text: '' }];
  next = chooseCard(next, 0);
  assert.deepEqual(next.today?.gained, ['chamomile', 'mint', 'lavender']);
});

test('a donation is recorded for the finale, linked to its regular', () => {
  const s = dispatch(nightOn(14, 120), { type: 'buy', item: 'donate-cakes' });
  assert.deepEqual(s.donations, ['marla']);
  assert.equal(s.coins, 70);
  assert.ok(CUSTOMERS[s.donations[0]].regular);
});

test('buy is a night action only, and sleep still moves on', () => {
  const morning = startDay(newGame(4));
  assert.throws(() => dispatch(morning, { type: 'buy', item: 'plot3', seed: 'mint' }), /not allowed in phase morning/);
  const s = dispatch(nightOn(2, 100), { type: 'sleep' });
  assert.equal(s.today?.phase, 'morning');
  assert.equal(s.day, 3);
});

test('the Notebook records what it learned today: haul picks, study, discoveries', () => {
  let s = startDay(newGame(5));
  if (!s.today) throw new Error('no day');
  s.today.offer = [{ type: 'expedition', title: 'x', text: '' }];
  s = chooseCard(s, 0);
  const picks = /** @type {NonNullable<GameState['today']>} */ (s.today).finds.slice(0, 2);
  s = applyHaul(s, picks);
  if (!s.today) throw new Error('no day');
  s.today.event = { kind: 'discovery', id: 'wren-page' };
  s = resolveEvent(s, 0);
  const learned = /** @type {string[]} */ (s.today?.learned);
  for (const h of new Set(picks)) assert.ok(learned.includes(`herb:${h}`), h);
  assert.ok(learned.includes('rule:R1'));
  assert.equal(new Set(learned).size, learned.length, 'no repeats');
});
