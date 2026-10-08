import { test } from 'node:test';
import assert from 'node:assert/strict';
import brews from './fixtures/brews.json' with { type: 'json' };
import { brew, allowedInPotion } from '../src/core/brew.js';
import { score, price } from '../src/core/score.js';

test('matches the validated Python brew() on 300 random brews (vector, distance, stars)', () => {
  for (const f of brews) {
    const { vec } = brew(f.names, { boil: f.boil });
    assert.deepEqual(vec, f.vec, `${f.names.join('+')} ${f.boil ? 'boil' : 'simmer'}`);
    const s = score(vec, /** @type {any} */ (f.target), f.tol);
    assert.equal(s.d, f.d);
    assert.equal(s.stars, f.stars, `${f.names.join('+')} vs ${f.target}`);
  }
});

test('brew-math examples (variant D, tol 1)', () => {
  const marla = brew(['chamomile', 'chamomile']);
  assert.deepEqual(marla.vec, [0, 6, 0, 0]);
  assert.equal(score(marla.vec, [0, 6, 0, 0], 1).stars, 3);

  const pell = brew(['fireroot', 'nettle'], { boil: true });
  assert.deepEqual(pell.vec, [4, 0, 3, 0]);
  assert.equal(score(pell.vec, [4, 0, 4, 0], 1).stars, 3);

  const fennick = brew(['sage', 'chamomile']);
  assert.deepEqual(fennick.vec, [0, 3, 0, 3]);
  assert.equal(score(fennick.vec, [0, 3, 0, 4], 1).stars, 3);
});

test('rules fire as described', () => {
  assert.ok(brew(['chamomile'], { boil: true }).fired.has('R1'), 'boiling a delicate flower');
  assert.ok(brew(['fireroot']).fired.has('R2'), 'simmering a tough root');
  assert.ok(brew(['honey', 'fireroot'], { boil: true }).fired.has('R4'), 'honey softens heat');
  assert.ok(brew(['fireroot', 'fireroot', 'fireroot'], { boil: true }).fired.has('R3'), 'scorched at heat 9 on a boil');
  assert.equal(brew(['fireroot', 'fireroot', 'fireroot']).fired.has('R3'), false, 'no scorching on a simmer');
  const sep = brew(['pine']);
  assert.ok(sep.separated && sep.fired.has('R6'), 'oily resin in water separates');
  assert.equal(brew(['pine'], { binder: true }).separated, false, 'beeswax binds it');
  assert.equal(score([5, 5, 0, 0], [5, 5, 0, 0], 1, { separated: true }).stars, 1, 'separated caps at 1 star');
});

test('brimstone is not allowed in potions; prices follow the economy', () => {
  assert.equal(allowedInPotion('brimstone'), false);
  assert.equal(allowedInPotion('chamomile'), true);
  assert.equal(price('potion', 3), 23);          // 15 x 1.5, rounded
  assert.equal(price('potion', 2, { featured: true }), 30);
  assert.equal(price('salve', 2), 24);
});
