// Brewing (design/brew-math.md). Port of tools/solution_space.py brew(), the validated reference.
import { INGREDIENTS, BASES } from '../content/index.js';

/** @typedef {import('../content/types.js').TraitVec} TraitVec */
/** @typedef {'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R8'} RuleId */

/** Index of the strongest trait (first one on ties). @param {readonly number[]} v */
export function mainTrait(v) {
  let m = 0;
  for (let i = 1; i < v.length; i++) if (v[i] > v[m]) m = i;
  return m;
}

/** @param {string} name @param {string} tag */
const has = (name, tag) => INGREDIENTS[name].tags.includes(tag);

/**
 * Brew a set of ingredients.
 * @param {readonly string[]} names  ingredients in the slots (empty slots omitted; repeats allowed)
 * @param {{ boil?: boolean, base?: string, binder?: boolean }} [opts]  heat (Simmer by default), base (spring water by default), beeswax binder
 * @returns {{ vec: TraitVec, fired: Set<RuleId>, separated: boolean }}
 */
export function brew(names, opts = {}) {
  const boil = !!opts.boil;
  const base = BASES[opts.base || 'water'];
  /** @type {number[]} */
  const s = base && base.mod ? base.mod.slice() : [0, 0, 0, 0];
  /** @type {Set<RuleId>} */
  const fired = new Set();

  for (const n of names) {
    const v = INGREDIENTS[n].vec.slice();
    if (has(n, 'delicate') && boil) {                       // R1: volatile oils boil off
      if (v[1] > 0) { v[1]--; fired.add('R1'); }
      if (v[3] > 0) { v[3]--; fired.add('R1'); }
    }
    if (has(n, 'tough') && !boil) { v[mainTrait(v)]--; fired.add('R2'); }   // R2: roots need a decoction
    for (let i = 0; i < 4; i++) s[i] += v[i];
  }
  if (names.includes('honey') && names.some(n => INGREDIENTS[n].vec[0] > 0)) { s[1] += 1; fired.add('R4'); }
  if (boil && s[0] >= 8) { for (let i = 1; i < 4; i++) s[i] -= 1; fired.add('R3'); }   // R3: scorched
  if (names.some(n => has(n, 'mod-salt'))) { s[mainTrait(s)] += 1; fired.add('R5'); }
  if (names.some(n => has(n, 'mod-purify'))) {                                          // R8: quartz purifies
    const nz = [0, 1, 2, 3].filter(i => s[i] > 0);
    if (nz.length) { let lo = nz[0]; for (const i of nz) if (s[i] < s[lo]) lo = i; s[lo] = 0; fired.add('R8'); }
  }
  // R6: oil and water don't mix without a binder (an oil base, or an oily ingredient, needs beeswax)
  const separated = (opts.base === 'oil' || names.some(n => has(n, 'oily'))) && !opts.binder;
  if (separated) fired.add('R6');

  const vec = /** @type {TraitVec} */ (s.map(x => Math.max(0, Math.min(10, x))));
  return { vec, fired, separated };
}

/** Ingredients that may never go into a potion (e.g. brimstone). @param {string} name */
export function allowedInPotion(name) {
  return !has(name, 'no-potion');
}
