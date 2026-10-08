// Single source of truth for game content: src/content/data/content.json.
// Works in the browser and in Node (import attributes).
import data from './data/content.json' with { type: 'json' };

/** @typedef {import('./types.js').Ingredient} Ingredient */
/** @typedef {import('./types.js').Recipe} Recipe */
/** @typedef {import('./types.js').HaulHerb} HaulHerb */
/** @typedef {import('./types.js').Weather} Weather */
/** @typedef {import('./types.js').Customer} Customer */

export const CONTENT = data;
export const VERSION = /** @type {number} */ (/** @type {unknown} */ (data.version));
export const TRAITS = /** @type {{id: import('./types.js').TraitId, name: string, icon: string, shape: string}[]} */ (/** @type {unknown} */ (data.traits));
export const TRAIT_IDS = TRAITS.map(t => t.id);
export const INGREDIENTS = /** @type {Record<string, Ingredient>} */ (/** @type {unknown} */ (data.ingredients));
export const RECIPES = /** @type {Record<string, Recipe>} */ (/** @type {unknown} */ (data.recipes));
export const SCORING = /** @type {{starBands: number[], priceMult: number[], relationship: number[], recipeBonus: number, featuredMult: number}} */ (/** @type {unknown} */ (data.scoring));
export const BASES = /** @type {Record<string, {name: string, good?: string, mod?: import('./types.js').TraitVec, binder?: boolean, needsBinder?: string, price: number}>} */ (/** @type {unknown} */ (data.bases));
export const GOODS = /** @type {Record<string, {batch: number, price: number}>} */ (/** @type {unknown} */ (data.goods));
export const HAUL = /** @type {{basket: number, freshNights: number, rareWeight: number, pay: {featured: number, other: number}, herbs: Record<string, HaulHerb>}} */ (/** @type {unknown} */ (data.haul));
export const WEATHER = /** @type {Record<string, Weather>} */ (/** @type {unknown} */ (data.weather));
export const CUSTOMERS = /** @type {Record<string, Customer>} */ (/** @type {unknown} */ (data.customers));
export const KEYWORDS = /** @type {{phrases: string[], traits: Record<string, number>, heatFromTier?: number}[]} */ (/** @type {unknown} */ (data.keywords));
export const AVOID = /** @type {{phrases: string[], zero: string[]}[]} */ (/** @type {unknown} */ (data.avoid));
export const INTENSITY = /** @type {{words: string[], value: number}[]} */ (/** @type {unknown} */ (data.intensity));
export const TIERS = /** @type {{tier: number, days: number[], traits: number[], tol: number, avoid?: boolean}[]} */ (/** @type {unknown} */ (data.tiers));
