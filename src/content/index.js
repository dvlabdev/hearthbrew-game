// Single source of truth for game content: src/content/data/content.json.
// Works in the browser and in Node (import attributes).
import data from './data/content.json' with { type: 'json' };

/** @typedef {import('./types.js').Ingredient} Ingredient */
/** @typedef {import('./types.js').Recipe} Recipe */
/** @typedef {import('./types.js').HaulHerb} HaulHerb */
/** @typedef {import('./types.js').Weather} Weather */
/** @typedef {import('./types.js').Customer} Customer */

export const CONTENT = data;
export const VERSION = /** @type {number} */ (data.version);
export const TRAITS = /** @type {{id: import('./types.js').TraitId, name: string, icon: string, shape: string}[]} */ (data.traits);
export const TRAIT_IDS = TRAITS.map(t => t.id);
export const INGREDIENTS = /** @type {Record<string, Ingredient>} */ (data.ingredients);
export const RECIPES = /** @type {Record<string, Recipe>} */ (data.recipes);
export const SCORING = /** @type {{starBands: number[], priceMult: number[], relationship: number[], recipeBonus: number, featuredMult: number}} */ (data.scoring);
export const BASES = /** @type {Record<string, {name: string, good?: string, mod?: import('./types.js').TraitVec, binder?: boolean, needsBinder?: string, price: number}>} */ (data.bases);
export const GOODS = /** @type {Record<string, {batch: number, price: number}>} */ (data.goods);
export const HAUL = /** @type {{basket: number, freshNights: number, rareWeight: number, pay: {featured: number, other: number}, herbs: Record<string, HaulHerb>}} */ (data.haul);
export const WEATHER = /** @type {Record<string, Weather>} */ (data.weather);
export const CUSTOMERS = /** @type {Record<string, Customer>} */ (data.customers);
export const KEYWORDS = /** @type {{phrases: string[], traits: Record<string, number>, heatFromTier?: number}[]} */ (data.keywords);
export const AVOID = /** @type {{phrases: string[], zero: string[]}[]} */ (data.avoid);
export const INTENSITY = /** @type {{words: string[], value: number}[]} */ (data.intensity);
export const TIERS = /** @type {{tier: number, days: number[], traits: number[], tol: number, avoid?: boolean}[]} */ (data.tiers);
