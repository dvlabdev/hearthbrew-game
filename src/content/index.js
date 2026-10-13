// Single source of truth for game content: src/content/data/content.json.
// Works in the browser and in Node (import attributes).
import data from './data/content.json' with { type: 'json' };
import { mainTrait } from './traits.js';

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
export const HAUL = /** @type {{basket: number, freshNights: number, rareWeight: number, pay: {featured: number, other: number}}} */ (/** @type {unknown} */ (data.haul));
export const WEATHER = /** @type {Record<string, Weather>} */ (/** @type {unknown} */ (data.weather));
export const CUSTOMERS = /** @type {Record<string, Customer>} */ (/** @type {unknown} */ (data.customers));
export const KEYWORDS = /** @type {{phrases: string[], traits: Record<string, number>, heatFromTier?: number}[]} */ (/** @type {unknown} */ (data.keywords));
export const AVOID = /** @type {{phrases: string[], zero: string[]}[]} */ (/** @type {unknown} */ (data.avoid));
export const INTENSITY = /** @type {{words: string[], value: number}[]} */ (/** @type {unknown} */ (data.intensity));
export const TIERS = /** @type {{tier: number, days: number[], traits: number[], tol: number, avoid?: boolean}[]} */ (/** @type {unknown} */ (data.tiers));
export const MORNING = /** @type {{cards: Record<string, import('./types.js').CardDef>, trails: string[]}} */ (/** @type {unknown} */ (data.morning));
export const EVENTS = /** @type {import('./types.js').Events} */ (/** @type {unknown} */ (data.events));
export const START = /** @type {{days: number, coins: number, shelf: import('./types.js').StockItem[], garden: number, owned: string[]}} */ (/** @type {unknown} */ (data.start));
export const PLANTS = /** @type {Record<string, {name: string}>} */ (data.plants);
export const ALIASES = /** @type {Record<'herb' | 'customer', Record<string, string>>} */ (data.aliases);
/** The base used when none is chosen (spring water). */
export const DEFAULT_BASE = /** @type {string} */ (Object.keys(BASES).find(k => /** @type {{default?: boolean}} */ (BASES[k]).default));

/**
 * Foraged herbs: every ingredient with a `forage` facet, flattened for the haul rules.
 * The trait is the ingredient's strongest one, so the haul and the brewing can't disagree.
 * @type {Record<string, HaulHerb>}
 */
export const FORAGE = Object.fromEntries(Object.entries(INGREDIENTS)
  .filter(([, ing]) => ing.forage)
  .map(([id, ing]) => [id, { name: ing.name, trait: TRAIT_IDS[mainTrait(ing.vec)], .../** @type {import('./types.js').Forage} */ (ing.forage) }]));

/** Display name of a herb or plant. @param {string} id */
export const herbName = id => INGREDIENTS[id]?.name ?? PLANTS[id]?.name ?? id;
/** Display name of a trait. @param {string} id */
export const traitName = id => TRAITS.find(t => t.id === id)?.name ?? id;
