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

test('round 2 packs show the game: a shop scene, moods, and one shared defs block with no dangling refs', () => {
  for (const pack of Object.values(STYLES).filter(p => p.round === 2)) {
    for (const asset of ['scene:shop', 'ingredient:rosehip']) assert.ok(pack.ASSETS[asset], `${pack.id} is missing ${asset}`);
    assert.notEqual(pack.ASSETS['portrait:marla']({ mood: 'happy' }), pack.ASSETS['portrait:marla']({ mood: 'tired' }), `${pack.id}: moods must differ`);
    const defined = new Set([...(pack.defs || '').matchAll(/id="([^"]+)"/g)].map(m => m[1]));
    for (const asset of pack.scope || []) {
      const out = [pack.ASSETS[asset]({}), pack.ASSETS[asset]({ layer: 'front', boil: true })].join('');
      assert.doesNotMatch(out, /\sid="/, `${pack.id}:${asset} declares its own ids (put them in defs)`);
      for (const [, ref] of out.matchAll(/url\(#([^)]+)\)/g)) assert.ok(defined.has(ref), `${pack.id}:${asset} uses undefined #${ref}`);
    }
  }
});

test('the cauldron has distinct simmer and boil states', () => {
  setStyle('v0-prototype');
  assert.doesNotMatch(art('prop:cauldron', { boil: false }), /class="pot boil"/);
  assert.match(art('prop:cauldron', { boil: true }), /class="pot boil"/);
});
