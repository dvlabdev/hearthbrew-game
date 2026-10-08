import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INGREDIENTS, RECIPES, CONTENT, HAUL, WEATHER, CUSTOMERS, TRAIT_IDS } from '../src/content/index.js';

test('every ingredient has a 4-trait vector and tags', () => {
  for (const [id, ing] of Object.entries(INGREDIENTS)) {
    assert.equal(ing.vec.length, 4, id);
    assert.ok(ing.vec.every(Number.isInteger), id);
    assert.ok(Array.isArray(ing.tags), id);
    assert.ok(!(ing.tags.includes('delicate') && ing.tags.includes('tough')), `${id}: delicate and tough are exclusive`);
  }
});

test('rule ids are unique and every rule is tagged real / exaggerated / magic', () => {
  const ids = CONTENT.rules.map(r => r.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const r of CONTENT.rules) assert.ok(['real', 'exaggerated', 'magic'].includes(r.tag), r.id);
});

test('recipes reference real ingredients and have 4-trait profiles', () => {
  for (const [id, r] of Object.entries(RECIPES)) {
    assert.equal(r.vec.length, 4, id);
    for (const ing of Object.keys(r.requires || {})) assert.ok(INGREDIENTS[ing], `${id} requires unknown ${ing}`);
  }
});

test('haul herbs, weathers and customers are consistent', () => {
  for (const [id, h] of Object.entries(HAUL.herbs)) {
    assert.ok(TRAIT_IDS.includes(h.trait), id);
    assert.ok(h.slots === 1 || h.slots === 2, id);
  }
  for (const [id, w] of Object.entries(WEATHER)) assert.ok(Array.isArray(w.prime) && w.finds > 0, id);
  for (const [id, c] of Object.entries(CUSTOMERS)) assert.ok(TRAIT_IDS.includes(c.trait), id);
  assert.equal(HAUL.rareWeight, 8, 'tuned value from haul_sim (V3 + weather)');
});
