import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, SAVE_VERSION } from '../src/core/state.js';
import { save, load, migrate } from '../src/core/save.js';
import { startDay, chooseCard } from '../src/core/day.js';
import { ALIASES, CUSTOMERS } from '../src/content/index.js';

/** In-memory stand-in for localStorage. */
function memoryStorage() {
  /** @type {Map<string, string>} */ const m = new Map();
  return /** @type {Storage} */ (/** @type {unknown} */ ({
    getItem: (/** @type {string} */ k) => m.get(k) ?? null,
    setItem: (/** @type {string} */ k, /** @type {string} */ v) => { m.set(k, v); },
  }));
}

test('save and load round-trip a game', () => {
  const st = memoryStorage();
  const g = newGame(42); g.day = 5; g.coins = 123;
  assert.ok(save(g, st));
  assert.deepEqual(load(st), g);
});

test('migrates an unversioned v0 save to the current version', () => {
  const old = { day: 3, coins: 40, stock: [{ herb: 'mint', nights: 2 }] };
  const m = migrate(old);
  assert.equal(m.saveVersion, SAVE_VERSION);
  assert.equal(m.day, 3); assert.equal(m.coins, 40);
  assert.deepEqual(m.shelf, [{ herb: 'mint', nights: 2 }]);
});

test('load survives missing or broken storage', () => {
  assert.equal(load(undefined), null);
  const broken = /** @type {Storage} */ (/** @type {unknown} */ ({ getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } }));
  assert.equal(load(broken), null);
  assert.equal(save(newGame(), broken), false);
});

test('v2 -> v3: relationships cover exactly the customers in content', () => {
  const g = newGame(5);
  const v2 = { ...g, saveVersion: 2, relationships: { marla: 2, pell: 1, fennick: 0, bramble: 4 } };
  const m = migrate(v2);
  assert.equal(m.saveVersion, 3);
  assert.deepEqual(Object.keys(m.relationships).sort(), Object.keys(CUSTOMERS).sort());
  assert.equal(m.relationships.marla, 2);
  assert.equal(m.relationships.tamsin, 0);
  assert.ok(!('bramble' in m.relationships));
});

test('a new game starts with every customer and nothing else', () => {
  assert.deepEqual(Object.keys(newGame().relationships).sort(), Object.keys(CUSTOMERS).sort());
});

test('load repairs content ids: aliases rename, unknown ids are dropped', () => {
  const st = memoryStorage();
  const g = startDay(newGame(9));
  g.shelf.push({ herb: 'oldmint', nights: 2 }, { herb: 'moonmoss', nights: 2 });
  g.notebook.known.oldmint = [true, true, true, true];
  g.relationships.oldmarla = 3;
  save(g, st);
  ALIASES.herb.oldmint = 'mint';
  ALIASES.customer.oldmarla = 'marla';
  try {
    const r = /** @type {import('../src/core/state.js').GameState} */ (load(st));
    assert.ok(r.shelf.some(s => s.herb === 'mint' && s.nights === 2));
    assert.ok(!r.shelf.some(s => s.herb === 'moonmoss' || s.herb === 'oldmint'));
    assert.ok(r.notebook.known.mint);
    assert.equal(r.relationships.marla, 3);
    assert.deepEqual(r.today, g.today, 'a valid day in progress is kept');
  } finally { delete ALIASES.herb.oldmint; delete ALIASES.customer.oldmarla; }
});

test('a day in progress that refers to a missing id restarts from its morning', () => {
  const st = memoryStorage();
  const g = chooseCard(startDay(newGame(4)), 0);
  if (!g.today) throw new Error('no day');
  g.today.finds = [...g.today.finds, 'moonmoss'];
  save(g, st);
  const r = load(st);
  assert.equal(r?.today?.phase, 'morning');
  assert.equal(r?.day, g.day);
  assert.ok(!r?.today?.finds.includes('moonmoss'));
});
