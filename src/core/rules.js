// Brewing rules (design/brew-math.md): one entry per rule, in run order. Text and tag (real / exaggerated / magic)
// live in content.rules; tests/brew.test.js checks that the ids here and there match exactly.
// Stages run in this order: each ingredient → sum → brew → flag; `score` rules run in score() after the star bands.
// Within a stage, array order is run order (it matters: R4's +Calm comes before R3's scorching).
// Adding a rule: its text and tag in content.rules, one entry here, and tests. (The Python reference is frozen.)
import { mainTrait } from '../content/traits.js';

/**
 * @typedef {object} BrewCtx           built once per brew
 * @property {readonly string[]} names  the ingredients (repeats allowed)
 * @property {boolean} boil
 * @property {string} base
 * @property {boolean} binder
 * @property {(name: string, tag: string) => boolean} has
 * @property {(name: string) => readonly number[]} vec
 * @property {{ separated: boolean }} flags
 */
/**
 * @typedef {{ id: string, stage: 'ingredient', apply: (v: number[], name: string, ctx: BrewCtx) => boolean }
 *   | { id: string, stage: 'brew', apply: (sum: number[], ctx: BrewCtx) => boolean }
 *   | { id: string, stage: 'flag', apply: (ctx: BrewCtx) => boolean }
 *   | { id: string, stage: 'score', apply: (s: { stars: number, vec: readonly number[], opts: { harmonize?: boolean } }) => number | null }} Rule
 * `apply` returns whether the rule fired (score rules: the new star count, or null when they don't fire).
 */

export const STAGES = /** @type {const} */ (['ingredient', 'brew', 'flag', 'score']);

/** @type {Rule[]} */
export const RULES = [
  // R1 🧪 Delicate ingredient at Boil: -1 Calm and -1 Clarity (if present). Volatile oils boil off.
  { id: 'R1', stage: 'ingredient', apply: (v, n, c) => {
    if (!c.boil || !c.has(n, 'delicate')) return false;
    let fired = false;
    if (v[1] > 0) { v[1]--; fired = true; }
    if (v[3] > 0) { v[3]--; fired = true; }
    return fired;
  } },
  // R2 🧪 Tough ingredient at Simmer: -1 on its main trait. Roots need a decoction.
  { id: 'R2', stage: 'ingredient', apply: (v, n, c) => {
    if (c.boil || !c.has(n, 'tough')) return false;
    v[mainTrait(v)]--;
    return true;
  } },
  // R4 🧪✨ Honey + any Heat ingredient: +1 Calm. Keyed on the sweetener tag.
  { id: 'R4', stage: 'brew', apply: (s, c) => {
    if (!c.names.some(n => c.has(n, 'sweetener')) || !c.names.some(n => c.vec(n)[0] > 0)) return false;
    s[1] += 1;
    return true;
  } },
  // R3 🧪✨ Brew Heat >= 8 at Boil: Scorched, all other traits -1.
  { id: 'R3', stage: 'brew', apply: (s, c) => {
    if (!c.boil || s[0] < 8) return false;
    for (let i = 1; i < 4; i++) s[i] -= 1;
    return true;
  } },
  // R5 🧪✨ Salt: +1 to the brew's highest trait (+2 shelf days: applied by the shelf, not here).
  { id: 'R5', stage: 'brew', apply: (s, c) => {
    if (!c.names.some(n => c.has(n, 'mod-salt'))) return false;
    s[mainTrait(s)] += 1;
    return true;
  } },
  // R8 ✨ Quartz dust: the lowest non-zero trait becomes 0.
  { id: 'R8', stage: 'brew', apply: (s, c) => {
    if (!c.names.some(n => c.has(n, 'mod-purify'))) return false;
    const nz = [0, 1, 2, 3].filter(i => s[i] > 0);
    if (!nz.length) return false;
    let lo = nz[0];
    for (const i of nz) if (s[i] < s[lo]) lo = i;
    s[lo] = 0;
    return true;
  } },
  // R6 🧪 Oily ingredient (or an oil base) without beeswax: Separated, max 1 star (the cap is applied in score()).
  { id: 'R6', stage: 'flag', apply: c => {
    c.flags.separated = (c.base === 'oil' || c.names.some(n => c.has(n, 'oily'))) && !c.binder;
    return c.flags.separated;
  } },
  // R7 ✨ Two highest traits equal and >= 4: Harmonized, +1 star (max 3); not for the Midsummer Draught (harmonize: false).
  { id: 'R7', stage: 'score', apply: ({ stars, vec, opts }) => {
    if (opts.harmonize === false || stars >= 3) return null;
    const top = vec.slice().sort((a, b) => b - a);
    return top[0] === top[1] && top[0] >= 4 ? stars + 1 : null;
  } },
];

/** The rules of one stage, in run order. @template {Rule['stage']} S @param {S} stage @returns {Extract<Rule, { stage: S }>[]} */
export const stage = stage => /** @type {any} */ (RULES.filter(r => r.stage === stage));
