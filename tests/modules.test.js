import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Every module under src/ must at least load (screens aren't run by other tests, so a syntax slip there would hide).
// main.js is the browser entry point and touches the DOM at load, so it's checked by the browser playthrough instead.
/** @param {string} dir @returns {string[]} */
const files = dir => readdirSync(dir).flatMap(f => {
  const p = join(dir, f);
  return statSync(p).isDirectory() ? files(p) : p.endsWith('.js') ? [p] : [];
});

test('every src module loads', async () => {
  const list = files('src').filter(f => !f.endsWith('main.js'));
  assert.ok(list.length > 20);
  for (const f of list) await assert.doesNotReject(import(pathToFileURL(resolve(f)).href), f);
});
