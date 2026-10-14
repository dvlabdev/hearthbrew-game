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
 * @property {Forage} [forage]      present when the herb can be found on a haul
 */

/**
 * @typedef {object} Forage
 * @property {string} kind          flower, leaf, root, fruit, mushroom (weather prime/poor/boost match on it)
 * @property {'common' | 'uncommon' | 'rare'} rarity
 * @property {number} slots         basket slots (1 or 2)
 * @property {number} units         doses per find
 * @property {number} value         coins when served
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

/** @typedef {Forage & { name: string, trait: TraitId }} HaulHerb  derived in content/index.js (FORAGE) */

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
 * @property {boolean} regular      regulars have relationship points and story beats; walk-ins don't
 * @property {number} [firstDay]    the first day they can visit (default 1)
 */

/** @typedef {{ herb: string, nights: number, units?: number, value?: number, prime?: boolean, poor?: boolean }} StockItem */

/** @typedef {Record<string, any>} Effect  one effect: { name: argument }, e.g. { "coins": 8 } (src/core/effects.js) */

/**
 * @typedef {object} CardDef        a morning card (content.morning.cards[type])
 * @property {number} weight         how often it is dealt
 * @property {string} title          may use {trail}
 * @property {string} text
 * @property {string} art            art id, or "weather" for today's weather
 * @property {string} [when]         a condition (CONDITIONS in src/core/effects.js)
 * @property {string} [action]       a behaviour beyond effects (CARD_ACTIONS in src/core/day.js)
 * @property {Effect[]} [effects]    applied when chosen (cards without an action)
 * @property {string} [note]         strings key for the story line, filled with the effects' vars and {text}
 * @property {string[]} [texts]      one is drawn as {text}, filled with the same vars
 * @property {number} [markup]       buyHerb: coins over a herb's value
 * @property {number} [offers]       buyHerb: how many herbs the stalls show
 */

/**
 * @typedef {object} Events
 * @property {{ kind: string, weight: number }[]} draw   which kind follows a haul (EVENT_KINDS in src/core/day.js)
 * @property {number} spotEvery
 * @property {{ id: string, good: string, bad: string, feature: string, reward: string, right: string, wrong: string }[]} spot
 * @property {{ id: string, title: string, text: string, options: { label: string, text: string, effects: Effect[] }[] }[]} encounter
 * @property {{ id: string, title: string, text: string, effects: Effect[] }[]} discovery
 */

export {};
