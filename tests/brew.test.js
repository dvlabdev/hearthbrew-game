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

test('every content rule has exactly one implementation, and every implementation has its content entry', async () => {
  const { RULES, STAGES } = await import('../src/core/rules.js');
  const { CONTENT } = await import('../src/content/index.js');
  const code = RULES.map(r => r.id), content = CONTENT.rules.map(r => r.id);
  assert.equal(new Set(code).size, code.length, 'a rule is implemented twice');
  assert.deepEqual([...code].sort(), [...content].sort(), 'src/core/rules.js and content.rules list different rules');
  for (const r of RULES) assert.ok(STAGES.includes(r.stage), `${r.id}: unknown stage ${r.stage}`);
  for (const r of CONTENT.rules) assert.ok(['real', 'exaggerated', 'magic'].includes(r.tag), `${r.id} needs a real / exaggerated / magic tag`);
});

test('a new rule is one registry entry: it runs in its stage and is reported', async () => {
  const { RULES } = await import('../src/core/rules.js');
  // R99 (test only): a rolling boil with 3+ ingredients wakes +1 Vigor
  RULES.splice(RULES.findIndex(r => r.stage === 'flag'), 0, { id: 'R99', stage: 'brew', apply: (s, c) => {
    if (!c.boil || c.names.length < 3) return false;
    s[2] += 1;
    return true;
  } });
  try {
    const before = brew(['sage', 'sage', 'sage']);
    const r = brew(['sage', 'sage', 'sage'], { boil: true });
    assert.ok(r.fired.has('R99'));
    assert.equal(r.vec[2], before.vec[2] + 1);
    assert.ok(!before.fired.has('R99'), 'not on a simmer');
  } finally { RULES.splice(RULES.findIndex(r => r.id === 'R99'), 1); }
  assert.ok(!brew(['sage', 'sage', 'sage'], { boil: true }).fired.has('R99'), 'removed again');
});

test('R7 Harmonized lives in the registry and score() reports it', async () => {
  const { score } = await import('../src/core/score.js');
  const h = score([5, 5, 0, 0], [5, 5, 3, 0], 0);
  assert.ok(h.harmonized && h.stars >= 1);
  assert.equal(score([5, 5, 0, 0], [5, 5, 3, 0], 0, { harmonize: false }).harmonized, false, 'not for the Midsummer Draught');
});
