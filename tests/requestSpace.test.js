// Check 4 (validation.md) on the real core: every request the riddle system can produce, and the Midsummer Draught.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import midsummer from './fixtures/midsummer.json' with { type: 'json' };
import { KEYWORDS, INTENSITY, TRAIT_IDS, INGREDIENTS } from '../src/content/index.js';
import { brew } from '../src/core/brew.js';
import { score } from '../src/core/score.js';

const STARTER = ['chamomile', 'lavender', 'mint', 'sage', 'fireroot', 'nettle', 'rosehip', 'honey'];

/** All multisets of size k (with repeats) from items. @template T @param {T[]} items @param {number} k @returns {T[][]} */
function multisets(items, k) {
  /** @type {T[][]} */ const out = [];
  const rec = (/** @type {number} */ start, /** @type {T[]} */ cur) => {
    if (cur.length === k) { out.push(cur.slice()); return; }
    for (let i = start; i < items.length; i++) { cur.push(items[i]); rec(i, cur); cur.pop(); }
  };
  rec(0, []);
  return out;
}

/** Target from one keyword at an intensity (tier 1 rules). */
function kwTarget(/** @type {typeof KEYWORDS[number]} */ kw, /** @type {number} */ intensity, /** @type {number} */ tier) {
  const t = [0, 0, 0, 0];
  for (const [trait, w] of Object.entries(kw.traits)) {
    if (trait === 'heat' && (kw.heatFromTier ?? 0) > tier) continue;
    t[TRAIT_IDS.indexOf(/** @type {any} */ (trait))] = Math.min(10, Math.ceil(intensity * w));
  }
  return /** @type {import('../src/content/types.js').TraitVec} */ (t);
}

/** Distinct 3-star combos for a target. */
function solutions(/** @type {any} */ target, /** @type {number} */ tol, /** @type {string[]} */ pool, /** @type {number} */ slots, harmonize = true) {
  const sols = new Set();
  for (const combo of multisets([...pool, ''], slots)) {
    const names = combo.filter(Boolean);
    if (!names.length) continue;
    for (const boil of [false, true]) {
      if (score(brew(names, { boil }).vec, target, tol, { harmonize }).stars === 3) sols.add(names.join('+'));
    }
  }
  return sols.size;
}

test('tier 1: every request has a 3-star answer with the starter shelf (variant D)', () => {
  const intens = [...new Set([...INTENSITY.map(i => i.value), 3, 4, 6])];
  const targets = new Set();
  for (const kw of KEYWORDS) for (const i of intens) targets.add(JSON.stringify(kwTarget(kw, i, 1)));
  const counts = [...targets].map(t => solutions(JSON.parse(t), 1, STARTER, 3));
  assert.equal(counts.length, 21, 'request count matches the Python request_space');
  assert.equal(counts.filter(c => c === 0).length, 0, 'no unsolvable beginner request');
  const median = counts.slice().sort((a, b) => a - b)[Math.floor(counts.length / 2)];
  assert.ok(median >= 2 && median <= 6, `median ${median} in the 2-6 target range`);
});

test('Midsummer Draught: same number of 3-star combinations as the Python reference', () => {
  const pool = Object.keys(INGREDIENTS);
  let count = 0;
  for (const combo of multisets([...pool, ''], 5)) {
    const names = combo.filter(Boolean);
    const sun = names.filter(n => n === 'sunwort').length;
    if (sun < 1 || sun > 2) continue;
    const ok = [false, true].some(boil => score(brew(names, { boil }).vec, [5, 5, 5, 5], 2, { harmonize: false }).stars === 3);
    if (ok) count++;
  }
  assert.equal(count, midsummer.threeStarCombos);
});
