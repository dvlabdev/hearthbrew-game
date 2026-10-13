// Brewing (design/brew-math.md). Port of tools/solution_space.py brew(), the (frozen) validated reference.
// The rules themselves live in ./rules.js, one entry each; brew() runs them by stage.
import { INGREDIENTS, BASES, DEFAULT_BASE } from '../content/index.js';
import { mainTrait } from '../content/traits.js';
import { stage } from './rules.js';

export { mainTrait };

/** @typedef {import('../content/types.js').TraitVec} TraitVec */
/** @typedef {string} RuleId  an id from content.rules / src/core/rules.js */

/** @param {string} name @param {string} tag */
const has = (name, tag) => INGREDIENTS[name].tags.includes(tag);

/**
 * Brew a set of ingredients: the base, each ingredient's rules, the sum, the brew-level rules, the flags.
 * @param {readonly string[]} names  ingredients in the slots (empty slots omitted; repeats allowed)
 * @param {{ boil?: boolean, base?: string, binder?: boolean }} [opts]  heat (Simmer by default), base (spring water by default), beeswax binder
 * @returns {{ vec: TraitVec, fired: Set<RuleId>, separated: boolean }}
 */
export function brew(names, opts = {}) {
  /** @type {import('./rules.js').BrewCtx} */
  const ctx = {
    names, boil: !!opts.boil, base: opts.base || DEFAULT_BASE, binder: !!opts.binder,
    has, vec: n => INGREDIENTS[n].vec, flags: { separated: false },
  };
  const base = BASES[ctx.base];
  /** @type {number[]} */
  const s = base && base.mod ? base.mod.slice() : [0, 0, 0, 0];
  /** @type {Set<RuleId>} */
  const fired = new Set();

  for (const n of names) {
    const v = INGREDIENTS[n].vec.slice();
    for (const r of stage('ingredient')) if (r.apply(v, n, ctx)) fired.add(r.id);
    for (let i = 0; i < 4; i++) s[i] += v[i];
  }
  for (const r of stage('brew')) if (r.apply(s, ctx)) fired.add(r.id);
  for (const r of stage('flag')) if (r.apply(ctx)) fired.add(r.id);

  const vec = /** @type {TraitVec} */ (s.map(x => Math.max(0, Math.min(10, x))));
  return { vec, fired, separated: ctx.flags.separated };
}

/** Ingredients that may never go into a potion (e.g. brimstone). @param {string} name */
export function allowedInPotion(name) {
  return !has(name, 'no-potion');
}
