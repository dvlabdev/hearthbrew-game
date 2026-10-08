// Scoring a brew against a request (design/brew-math.md section 5).
import { SCORING, GOODS } from '../content/index.js';

/** @typedef {import('../content/types.js').TraitVec} TraitVec */

/** Manhattan distance. @param {readonly number[]} a @param {readonly number[]} b */
export function distance(a, b) {
  return a.reduce((acc, x, i) => acc + Math.abs(x - b[i]), 0);
}

/**
 * Stars 0-3 for a brew vector. R7 Harmonized lifts a 1-2 star brew by one when the two highest traits are equal and >= 4.
 * @param {TraitVec} vec @param {TraitVec} target @param {number} tol
 * @param {{ harmonize?: boolean, separated?: boolean }} [opts]
 * @returns {{ stars: number, d: number, harmonized: boolean }}
 */
export function score(vec, target, tol, opts = {}) {
  const [b3, b2, b1] = SCORING.starBands;
  const d = distance(vec, target);
  let stars = d <= tol + b3 ? 3 : d <= tol + b2 ? 2 : d <= tol + b1 ? 1 : 0;
  let harmonized = false;
  if (opts.harmonize !== false) {
    const top = vec.slice().sort((a, b) => b - a);
    if (top[0] === top[1] && top[0] >= 4 && stars < 3) { stars++; harmonized = true; }
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
