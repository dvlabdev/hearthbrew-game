import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newGame, SAVE_VERSION } from '../src/core/state.js';
import { save, load, migrate } from '../src/core/save.js';

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
