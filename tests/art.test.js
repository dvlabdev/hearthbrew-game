import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STYLES, setStyle, art, requiredIds } from '../src/art/registry.js';

test('every style pack provides every asset the content needs, as valid-looking SVG', () => {
  for (const id of Object.keys(STYLES)) {
    setStyle(id);
    for (const asset of requiredIds()) {
      assert.ok(STYLES[id].ASSETS[asset], `${id} is missing ${asset}`);
      const out = art(asset, { boil: true });
      assert.match(out, /^<svg[\s\S]*<\/svg>$/, `${id}:${asset} is not an <svg>`);
      assert.match(out, /aria-label="[^"]+"/, `${id}:${asset} needs an accessible label`);
    }
  }
});

test('the cauldron has distinct simmer and boil states', () => {
  assert.doesNotMatch(art('prop:cauldron', { boil: false }), /class="pot boil"/);
  assert.match(art('prop:cauldron', { boil: true }), /class="pot boil"/);
});
