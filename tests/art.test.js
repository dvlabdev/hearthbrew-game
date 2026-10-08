import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STYLES, setStyle, art, requiredIds } from '../src/art/registry.js';

test('every style pack provides the assets it promises, as labelled SVG', () => {
  for (const id of Object.keys(STYLES)) {
    setStyle(id);
    const pack = STYLES[id];
    const ids = pack.exploration ? /** @type {string[]} */ (pack.scope) : requiredIds();   // complete packs: everything the content needs
    for (const asset of ids) {
      assert.ok(STYLES[id].ASSETS[asset], `${id} is missing ${asset}`);
      const out = art(asset, { boil: true });
      assert.match(out, /^<svg[\s\S]*<\/svg>$/, `${id}:${asset} is not an <svg>`);
      assert.match(out, /aria-label="[^"]+"/, `${id}:${asset} needs an accessible label`);
    }
  }
});

test('exploration packs cover the style-tile scope', () => {
  const tileScope = ['trait:heat', 'trait:calm', 'trait:vigor', 'trait:clarity', 'ingredient:chamomile', 'ingredient:fireroot',
    'plant:chamomile', 'plant:mayweed', 'prop:cauldron', 'portrait:marla', 'ui:coin', 'ui:texture'];
  for (const pack of Object.values(STYLES).filter(p => p.exploration)) {
    for (const asset of tileScope) assert.ok(pack.ASSETS[asset], `${pack.id} is missing ${asset}`);
    assert.ok(pack.brief && pack.brief.adjectives.length === 3, `${pack.id} needs a brief with 3 adjectives`);
  }
});

test('the cauldron has distinct simmer and boil states', () => {
  setStyle('v0-prototype');
  assert.doesNotMatch(art('prop:cauldron', { boil: false }), /class="pot boil"/);
  assert.match(art('prop:cauldron', { boil: true }), /class="pot boil"/);
});
