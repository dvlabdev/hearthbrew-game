// The effects vocabulary (design/effects.md): what cards, encounter options, discoveries and rewards *do*,
// declared as data in content.json and applied by one interpreter. New content needs no code as long as it
// uses these words; a genuinely new behaviour adds one entry here (and its name in src/content/validate.js).
import { FORAGE, CUSTOMERS, REGULARS, herbName, traitName } from '../content/index.js';
import { pickedItem } from './haul.js';
import { pick } from './rng.js';

/** @typedef {import('./state.js').GameState} GameState @typedef {import('./state.js').Today} Today */
/** @typedef {Record<string, string | number>} Vars  values an effect exposes to the note text ({who}, {herb}, {trait}, {coins}) */
/** @typedef {{ rng: () => number, choice?: string }} Ctx  choice: what the player picked when buying (a seed) */
/** @typedef {Record<string, any>} Effect  one key: the effect name, its value: the argument, e.g. { "coins": 8 } */


/** The Notebook learns a herb's trait (all four slots of its trait vector are known for v1). @param {GameState} s @param {string} herb */
export function learn(s, herb) {
  s.notebook.known[herb] = [true, true, true, true];
  s.today?.learned?.push(`herb:${herb}`);   // the night ledger names what was learned today
}
/** @param {GameState} s @param {string} herb */
export const knows = (s, herb) => !!s.notebook.known[herb];

/**
 * Each effect mutates the (already cloned) state and returns the vars it exposes.
 * Effects that draw randomness use ctx.rng, in list order, so a day replays identically.
 * @type {Record<string, (s: GameState, arg: any, ctx: Ctx) => Vars>}
 */
export const EFFECTS = {
  /** coins: n. Coins change hands (positive: earned). */
  coins: (s, n) => { s.coins += n; return { coins: n }; },
  /** friend: "random" | regular id. That regular won't forget it (+1 relationship, never decreases). */
  friend: (s, who, ctx) => {
    const id = who === 'random' ? pick(ctx.rng, REGULARS) : who;
    s.relationships[id] = (s.relationships[id] || 0) + 1;
    return { who: CUSTOMERS[id].name };
  },
  /** addHerbs: [ids]. Fresh herbs join the shelf, shaped by today's weather. */
  addHerbs: (s, herbs) => {
    const t = /** @type {Today} */ (s.today);
    for (const h of herbs) { s.shelf.push(pickedItem(h, t.weather)); t.gained.push(h); }
    return herbs.length === 1 ? { herb: herbName(herbs[0]) } : /** @type {Vars} */ ({});
  },
  /** learnHerb: "unknown" (a random herb the Notebook doesn't know) | herb id. */
  learnHerb: (s, which, ctx) => {
    const herb = which === 'unknown' ? pick(ctx.rng, Object.keys(FORAGE).filter(h => !knows(s, h))) : which;
    if (!knows(s, herb)) learn(s, herb);
    return { herb: herbName(herb), trait: traitName(FORAGE[herb].trait) };
  },
  /** learnRule: rule id. A brewing rule goes into the Notebook. */
  learnRule: (s, rule) => {
    if (!s.notebook.rules.includes(rule)) { s.notebook.rules.push(rule); s.today?.learned?.push(`rule:${rule}`); }
    return {};
  },
  /** harvestGarden: true. Every planted plot gives its herb, in plot order (interim: no growth days yet, design/night.md). */
  harvestGarden: (s, _, ctx) => EFFECTS.addHerbs(s, s.garden.map(p => p.plant).filter(p => p != null), ctx),
  /** addPlot: "chosen". A new garden plot, planted with the seed the player chose (ctx.choice). */
  addPlot: (s, _, ctx) => {
    const seed = /** @type {string} */ (ctx.choice);
    s.garden.push({ plant: seed, age: 0, tended: false });
    return { herb: herbName(seed) };
  },
  /** donate: regular id. A festival donation linked to that regular, remembered for the finale. */
  donate: (s, who) => {
    s.donations.push(who);
    return { who: CUSTOMERS[who].name };
  },
};

/** Apply a list of effects in order; returns the merged vars. @param {GameState} s @param {Effect[]} effects @param {Ctx} ctx */
export function applyEffects(s, effects, ctx) {
  /** @type {Vars} */ const vars = {};
  for (const e of effects) for (const [name, arg] of Object.entries(e)) Object.assign(vars, EFFECTS[name](s, arg, ctx));
  return vars;
}

/** Would these effects still change something? (A discovery is offered only while it teaches something new.) @param {GameState} s @param {Effect[]} effects */
export const teachesSomething = (s, effects) => effects.some(e => (e.learnRule && !s.notebook.rules.includes(e.learnRule)) || (e.learnHerb && e.learnHerb !== 'unknown' && !knows(s, e.learnHerb)));

/** The cheapest price at the market stalls. @param {string} herb @param {number} markup */
export const marketPrice = (herb, markup) => FORAGE[herb].value + markup;
/** Herbs the stalls sell (never rares). */
export const marketHerbs = () => Object.keys(FORAGE).filter(h => FORAGE[h].rarity !== 'rare');

/**
 * Conditions a card can require with "when" (content.morning.cards[type].when).
 * @type {Record<string, (s: GameState, card: any) => boolean>}
 */
export const CONDITIONS = {
  /** At least one stall herb is affordable. */
  canBuyHerb: (s, card) => s.coins >= Math.min(...marketHerbs().map(h => marketPrice(h, card.markup))),
  /** The Notebook still has a herb to learn. */
  unknownHerb: s => Object.keys(FORAGE).some(h => !knows(s, h)),
};
