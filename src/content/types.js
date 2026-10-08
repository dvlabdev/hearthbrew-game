// Shared JSDoc types for Hearthbrew content and core state. No runtime code.

/** @typedef {[number, number, number, number]} TraitVec  Heat, Calm, Vigor, Clarity */
/** @typedef {'heat' | 'calm' | 'vigor' | 'clarity'} TraitId */

/**
 * @typedef {object} Ingredient
 * @property {string} name
 * @property {TraitVec} vec
 * @property {string[]} tags        e.g. delicate, tough, mod-salt, mod-purify, oily, no-potion
 * @property {string[]} sources
 * @property {number} [grow]        days to grow in the garden
 * @property {number} [price]       market price
 */

/**
 * @typedef {object} Recipe
 * @property {string} name
 * @property {TraitVec} vec
 * @property {string} hint
 * @property {string} [good]
 * @property {number} [slots]
 * @property {number} [tol]
 * @property {Record<string, [number, number]>} [requires]
 * @property {boolean} [noHarmonize]
 */

/**
 * @typedef {object} HaulHerb
 * @property {string} name
 * @property {TraitId} trait
 * @property {number} units
 * @property {number} value
 * @property {'common' | 'uncommon' | 'rare'} rarity
 * @property {number} slots
 * @property {string} kind
 */

/**
 * @typedef {object} Weather
 * @property {string} label
 * @property {string} icon
 * @property {number} finds
 * @property {string[]} boost
 * @property {number} rareMult
 * @property {number} extraRare
 * @property {string[]} prime
 * @property {string[]} [poor]
 * @property {number} nights
 * @property {TraitId | null} skew
 * @property {string} text
 */

/**
 * @typedef {object} Customer
 * @property {string} name
 * @property {TraitId} trait
 * @property {string} clue
 */

/** @typedef {{ herb: string, nights: number, units?: number, value?: number, prime?: boolean, poor?: boolean }} StockItem */

export {};
