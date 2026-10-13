// Scoring a brew against a request (design/brew-math.md section 5).
import { SCORING, GOODS } from '../content/index.js';
import { stage } from './rules.js';

/** @typedef {import('../content/types.js').TraitVec} TraitVec */

/** Manhattan distance. @param {readonly number[]} a @param {readonly number[]} b */
export function distance(a, b) {
  return a.reduce((acc, x, i) => acc + Math.abs(x - b[i]), 0);
}

/**
 * Stars 0-3 for a brew vector: the distance bands, then the score-stage rules (R7 Harmonized), then the R6 cap.
 * @param {TraitVec} vec @param {TraitVec} target @param {number} tol
 * @param {{ harmonize?: boolean, separated?: boolean }} [opts]
 * @returns {{ stars: number, d: number, harmonized: boolean }}
 */
export function score(vec, target, tol, opts = {}) {
  const [b3, b2, b1] = SCORING.starBands;
  const d = distance(vec, target);
  let stars = d <= tol + b3 ? 3 : d <= tol + b2 ? 2 : d <= tol + b1 ? 1 : 0;
  let harmonized = false;
  for (const r of stage('score')) {   // R7 Harmonized (src/core/rules.js)
    const next = r.apply({ stars, vec, opts });
    if (next != null) { stars = next; if (r.id === 'R7') harmonized = true; }
  }
  if (opts.separated) stars = Math.min(stars, 1);   // R6: a separated brew is capped at 1 star
  return { stars, d, harmonized };
}

/**
 * Coins paid for one serving.
 * @param {string} good  potion | tea | salve
 * @param {number} stars
 * @param {{ recipe?: boolean, featured?: boolean }} [opts]
 */
export function price(good, stars, opts = {}) {
  let p = GOODS[good].price * SCORING.priceMult[stars];
  if (opts.recipe) p *= SCORING.recipeBonus;
  if (opts.featured) p *= SCORING.featuredMult;
  return Math.round(p);
}

/** Relationship points for a regular. @param {number} stars */
export const relationshipGain = stars => SCORING.relationship[stars];
