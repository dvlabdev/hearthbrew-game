import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { CONTENT, FORAGE, INGREDIENTS, HAUL, TRAIT_IDS, herbName, traitName } from '../src/content/index.js';
import { validateContent } from '../src/content/validate.js';
import { t, tn } from '../src/content/strings.js';
import { mainTrait } from '../src/content/traits.js';

test('content.json passes validation', () => {
  assert.deepEqual(validateContent(CONTENT), []);
});

test('validation names the broken reference', () => {
  /** @type {any} */ const c = structuredClone(CONTENT);
  c.events.spot[0].reward = 'lavendr';
  c.morning.cards.garden.effects = [{ addHerbs: ['chamomile', 'honey'] }];   // honey: an ingredient, but not a foraged herb
  c.ledger.items[0].price = 0;
  c.ledger.items[1].requires = 'plot99';
  c.ledger.items[4].effects = [{ donate: 'tamsin' }];
  c.start.garden = ['chamomile', 'glowcap'];
  c.events.discovery[0].effects[0].learnRule = 'R99';
  c.morning.cards.errand.effects.push({ teleport: 1 });
  c.morning.cards.market.action = 'haggle';
  c.events.encounter[0].options[0].effects = [{ friend: 'wren' }, { friend: 'tamsin' }];
  c.weather.sun.prime.push('moss');
  c.ingredients.mint.forage.slots = 3;
  c.aliases.herb.oldmint = 'mintt';
  c.strings['hud.day'] = 'Day {day';
  const errors = validateContent(c);
  for (const needle of ['"lavendr"', 'addHerbs needs foraged herbs', '"R99"', 'unknown effect "teleport"', 'unknown action "haggle"', 'unknown customer "wren"', '"tamsin" is a walk-in', '"moss"', 'ingredients.mint.forage: slots', '"mintt"', 'strings.hud.day', 'ledger.items.plot3: price', 'requires unknown item "plot99"', 'donate needs a regular', `start.garden: "glowcap" can't grow`])
    assert.ok(errors.some(e => e.includes(needle)), `expected an error mentioning ${needle}; got:\n${errors.join('\n')}`);
});

test('every foraged herb is an ingredient whose trait is its strongest one', () => {
  assert.ok(Object.keys(FORAGE).length >= 9);
  for (const [id, h] of Object.entries(FORAGE)) {
    assert.equal(h.trait, TRAIT_IDS[mainTrait(INGREDIENTS[id].vec)], id);
    assert.equal(h.name, INGREDIENTS[id].name, id);
  }
  assert.equal(HAUL.rareWeight, 8, 'tuned value from haul_sim (V3 + weather)');
});

test('names come from content', () => {
  assert.equal(herbName('glowcap'), 'Glowcap');
  assert.equal(herbName('pine'), 'Pine resin');
  assert.equal(herbName('mayweed'), 'Mayweed');
  assert.equal(traitName('calm'), 'Calm');
});

test('strings: placeholders and plurals', () => {
  assert.equal(t('hud.day', { day: 3, days: 20 }), 'Day 3 <small>of 20</small>');
  assert.equal(tn('haul.worth', 1, { value: 1 }), 'Worth 1 coin');
  assert.equal(tn('haul.worth', 2, { value: 2 }), 'Worth 2 coins');
  assert.equal(t('no.such.key'), 'no.such.key');
});

test('every string key used in src exists in content.strings', () => {
  /** @param {string} dir @returns {string[]} */
  const files = dir => readdirSync(dir).flatMap(f => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? (f === 'styles' ? [] : files(p)) : p.endsWith('.js') ? [p] : [];
  });
  const S = /** @type {Record<string, string>} */ (CONTENT.strings);
  /** @type {string[]} */ const missing = [];
  let used = 0;
  for (const f of files('src')) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/\b(t|tr)\('([\w.]+)'/g)) { used++; if (!(m[2] in S)) missing.push(`${f}: ${m[2]}`); }
    for (const m of src.matchAll(/\btn\('([\w.]+)'/g)) { used++; for (const form of ['one', 'other']) if (!(`${m[1]}.${form}` in S)) missing.push(`${f}: ${m[1]}.${form}`); }
  }
  assert.ok(used > 40, `only ${used} string uses found: is the scan broken?`);
  assert.deepEqual(missing, []);
});
