import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STYLES, setStyle, art, requiredIds, loadAll } from '../src/art/registry.js';

await loadAll();   // packs load lazily; the tests check every one, archived included

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

test('round 2+ packs show the game: a shop scene, moods, and one shared defs block with no dangling refs', () => {
  for (const pack of Object.values(STYLES).filter(p => (p.round || 1) >= 2)) {
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

test('level of detail: mini has no filters or hairlines, hero adds detail over icon', () => {
  for (const pack of Object.values(STYLES).filter(p => (p.round || 1) >= 3)) {
    for (const id of (pack.scope || []).filter(a => a.startsWith('ingredient:'))) {
      const mini = pack.ASSETS[id]({ lod: 'mini' }), icon = pack.ASSETS[id]({}), hero = pack.ASSETS[id]({ lod: 'hero' });
      assert.doesNotMatch(mini, /filter="/, `${pack.id}:${id} mini uses a filter`);
      assert.doesNotMatch(mini, /stroke-width="0?\.\d+"/, `${pack.id}:${id} mini has a hairline`);
      assert.ok(mini.length < icon.length && icon.length < hero.length, `${pack.id}:${id} detail should grow mini < icon < hero`);
    }
  }
});

test('the manifest lists every style folder, and only those', async () => {
  const { readdirSync, statSync } = await import('node:fs');
  const { MANIFEST } = await import('../src/art/styles/manifest.js');
  const dir = new URL('../src/art/styles/', import.meta.url);
  const folders = readdirSync(dir).filter(f => statSync(new URL(f, dir)).isDirectory()).sort();
  assert.deepEqual(MANIFEST.map(m => m.id).sort(), folders);
  for (const m of MANIFEST) assert.equal(STYLES[m.id].id, m.id, `${m.id}: manifest id matches the pack`);
  assert.ok(MANIFEST.filter(m => !m.archived).length >= 2, 'v0 and the current pack are not archived');
});

test('Hearthlight families never draw the same id twice', async () => {
  const { merge } = await import('../src/art/styles/hearthlight/index.js');
  const f = () => '<svg/>';
  assert.throws(() => merge({ a: { 'ui:coin': f }, b: { 'ui:coin': f } }), /drawn twice/);
  assert.deepEqual(Object.keys(merge({ a: { x: f }, b: { y: f } })), ['x', 'y']);
});

test('current packs simplify through the painter, never by post-processing SVG text', async () => {
  const { readdirSync, readFileSync } = await import('node:fs');
  const { MANIFEST } = await import('../src/art/styles/manifest.js');
  for (const m of MANIFEST.filter(x => !x.archived)) {
    const dir = new URL(`../src/art/styles/${m.id}/`, import.meta.url);
    for (const f of readdirSync(dir).filter(x => x.endsWith('.js'))) {
      const src = readFileSync(new URL(f, dir), 'utf8');
      assert.doesNotMatch(src, /\.replace\(\s*(\/[^/]*<|['"`]<)/, `${m.id}/${f} rewrites SVG markup with replace(); use the painter (src/art/lod.js)`);
      assert.doesNotMatch(src, /^let lod\b/m, `${m.id}/${f} keeps the level of detail in module state; pass the painter instead`);
    }
  }
});

test('painter: what each level keeps', async () => {
  const { painter } = await import('../src/art/lod.js');
  const mini = painter('mini', { prefix: 'hl' }), icon = painter(undefined, { prefix: 'hl' }), hero = painter('hero', { prefix: 'hl' });
  assert.equal(icon.lod, 'icon');
  assert.equal(mini.paint('honey'), 'style="fill:var(--honey)"');
  assert.equal(icon.paint('honey'), 'fill="url(#hl-honey)"');
  assert.deepEqual([mini.soft('x'), icon.soft('x'), mini.fine('x'), icon.fine('x')], ['', 'x', '', 'x']);
  assert.deepEqual([mini.detail('x'), icon.detail('x'), hero.detail('x')], ['', '', 'x']);
  assert.ok(hero.atLeast('icon') && !mini.atLeast('icon'));
});
