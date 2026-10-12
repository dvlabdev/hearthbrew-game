// The interim day loop (design/morning.md): morning cards → haul → event → shop → night.
// Pure functions: each takes a GameState and returns a new one. Randomness is seeded by (seed, day, step),
// so a day replays identically after a reload.
import { MORNING, EVENTS, HAUL, CUSTOMERS, WEATHER } from '../content/index.js';
import { genDay, pickedItem, resolveShop, night, slotsUsed } from './haul.js';
import { makeRng, pick, pickWeighted, shuffle } from './rng.js';

/** @typedef {import('./state.js').GameState} GameState @typedef {import('./state.js').Today} Today @typedef {import('./state.js').Card} Card */
/** @typedef {import('./state.js').CardType} CardType */

const H = HAUL.herbs;
const REGULARS = Object.keys(CUSTOMERS);
/** A deterministic stream for one step of one day. @param {GameState} s @param {number} step */
const rngFor = (s, step) => makeRng((s.seed * 7919 + s.day * 104729 + step * 31) | 0);
/** @param {GameState} s @returns {GameState} */
const clone = s => JSON.parse(JSON.stringify(s));
/** @param {string} t @param {Record<string, string>} v */
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? '');
/** @param {string} herb */
const herbName = herb => herb[0].toUpperCase() + herb.slice(1);
/** The cheapest market price. */
const marketPrice = (/** @type {string} */ herb) => H[herb].value + MORNING.market.markup;

/** Which card types can be offered today. @param {GameState} s @returns {CardType[]} */
function eligible(s) {
  /** @type {CardType[]} */ const types = ['expedition', 'garden', 'errand'];
  if (s.coins >= Math.min(...Object.keys(H).filter(h => H[h].rarity !== 'rare').map(marketPrice))) types.push('market');
  if (Object.keys(H).some(h => !s.notebook.known[h])) types.push('study');
  return types;
}

/** Start a day: weather, the customers, the finds (if you go out) and 3 morning cards. @param {GameState} state */
export function startDay(state) {
  const s = clone(state);
  const rng = rngFor(s, 1);
  const d = genDay(rng, s.shelf);
  const types = eligible(s);
  /** @type {CardType[]} */ const chosen = [];
  while (chosen.length < 3 && chosen.length < types.length) {
    const left = types.filter(t => !chosen.includes(t));
    chosen.push(pickWeighted(rng, left, left.map(t => MORNING.cards[t].weight)));
  }
  const offer = chosen.map(type => {
    const c = MORNING.cards[type];
    /** @type {Card} */ const card = { type, title: fill(c.title, { trail: pick(rng, MORNING.trails) }), text: c.text };
    if (type === 'market') card.offers = shuffle(rng, Object.keys(H).filter(h => H[h].rarity !== 'rare' && marketPrice(h) <= s.coins)).slice(0, MORNING.market.offers);
    return card;
  });
  s.today = {
    phase: 'morning', weather: d.weather, offer, card: null, featured: d.featured, others: d.others, finds: d.finds, picks: [],
    gained: [], note: '', event: null, shop: null, wilted: [], startCoins: s.coins,
  };
  return s;
}

/**
 * Choose a morning card. The expedition goes to the haul; the others apply now and open the shop.
 * @param {GameState} state @param {number} index @param {{ buy?: string }} [opts] market: which herb to buy
 */
export function chooseCard(state, index, opts = {}) {
  const s = clone(state), t = /** @type {Today} */ (s.today);
  const card = t.offer[index];
  if (!card || t.phase !== 'morning') throw new Error('No such morning card');
  t.card = index;
  const rng = rngFor(s, 2);
  if (card.type === 'expedition') { t.phase = 'haul'; return s; }
  if (card.type === 'garden') {
    for (const herb of MORNING.garden.plots) { s.shelf.push(pickedItem(herb, t.weather)); t.gained.push(herb); }
    t.note = 'Your plots gave what they had.';
  } else if (card.type === 'market') {
    const herb = opts.buy && card.offers?.includes(opts.buy) ? opts.buy : /** @type {string} */ (card.offers?.[0]);
    s.coins -= marketPrice(herb);
    s.shelf.push(pickedItem(herb, t.weather)); t.gained.push(herb);
    t.note = `You bought ${herbName(herb)} for ${marketPrice(herb)} coins.`;
  } else if (card.type === 'errand') {
    const who = pick(rng, REGULARS);
    s.coins += MORNING.errand.coins;
    s.relationships[who] = (s.relationships[who] || 0) + 1;
    t.note = `${fill(pick(rng, MORNING.errand.texts), { who: CUSTOMERS[who].name })} +${MORNING.errand.coins} coins, and ${CUSTOMERS[who].name} won't forget it.`;
  } else if (card.type === 'study') {
    const herb = pick(rng, Object.keys(H).filter(h => !s.notebook.known[h]));
    learn(s, herb);
    t.note = `${fill(pick(rng, MORNING.study.texts), { herb: herbName(herb) })} ${herbName(herb)} brings ${traitName(H[herb].trait)}.`;
  }
  t.phase = 'shop';
  return s;
}

/** @param {string} trait */
const traitName = trait => ({ heat: 'Heat', calm: 'Calm', vigor: 'Vigor', clarity: 'Clarity' })[trait] || trait;
/** The Notebook learns a herb's trait (all four slots of its trait vector are known for v1). @param {GameState} s @param {string} herb */
function learn(s, herb) { s.notebook.known[herb] = [true, true, true, true]; }
/** @param {GameState} s @param {string} herb */
export const knows = (s, herb) => !!s.notebook.known[herb];

/** Take the basket home: picked finds join the shelf (weather-shaped), first picks teach the Notebook, an event is drawn. @param {GameState} state @param {string[]} picks */
export function applyHaul(state, picks) {
  const s = clone(state), t = /** @type {Today} */ (s.today);
  if (t.phase !== 'haul') throw new Error('Not on the haul');
  if (slotsUsed(picks) > HAUL.basket) throw new Error('Basket over capacity');
  const pool = t.finds.slice();
  for (const p of picks) { const i = pool.indexOf(p); if (i < 0) throw new Error(`${p} was not found today`); pool.splice(i, 1); }
  t.picks = picks.slice();
  for (const p of picks) { s.shelf.push(pickedItem(p, t.weather)); if (!knows(s, p)) learn(s, p); }
  const rng = rngFor(s, 3);
  const kinds = /** @type {('spot' | 'encounter' | 'discovery')[]} */ (['encounter', 'discovery']);
  if (s.day - s.lastSpotDay >= EVENTS.spotEvery) kinds.push('spot', 'spot');
  const kind = pick(rng, kinds);
  const deck = kind === 'spot' ? EVENTS.spot : kind === 'encounter' ? EVENTS.encounter : EVENTS.discovery;
  t.event = { kind, id: pick(rng, deck).id };
  if (kind === 'spot') s.lastSpotDay = s.day;
  t.phase = 'event';
  return s;
}

/** Resolve the event card. Spot: choice 0 = left plant, 1 = right plant (the page decides the order). @param {GameState} state @param {number} choice */
export function resolveEvent(state, choice) {
  const s = clone(state), t = /** @type {Today} */ (s.today);
  const ev = /** @type {import('./state.js').EventState} */ (t.event);
  if (t.phase !== 'event' || !ev) throw new Error('No event to resolve');
  ev.choice = choice;
  if (ev.kind === 'spot') {
    const card = /** @type {(typeof EVENTS.spot)[0]} */ (EVENTS.spot.find(e => e.id === ev.id));
    ev.right = spotOrder(s, card)[choice] === card.good;
    if (ev.right) { s.shelf.push({ ...pickedItem(card.reward, t.weather) }); t.gained.push(card.reward); if (!knows(s, card.reward)) learn(s, card.reward); }
  } else if (ev.kind === 'encounter') {
    const card = /** @type {(typeof EVENTS.encounter)[0]} */ (EVENTS.encounter.find(e => e.id === ev.id));
    const opt = card.options[choice];
    if (opt.effect === 'coins') s.coins += opt.coins || 0;
    if (opt.effect === 'friend') { const who = pick(rngFor(s, 4), REGULARS); s.relationships[who] = (s.relationships[who] || 0) + 1; }
  } else {
    const card = /** @type {(typeof EVENTS.discovery)[0]} */ (EVENTS.discovery.find(e => e.id === ev.id));
    if (!s.notebook.rules.includes(card.rule)) s.notebook.rules.push(card.rule);
  }
  t.phase = 'shop';
  return s;
}

/** Spot the herb: which plant is drawn left and right today (seeded, so it can't be learned by position). @param {GameState} s @param {{good: string, bad: string}} card */
export function spotOrder(s, card) { return rngFor(s, 5)() < 0.5 ? [card.good, card.bad] : [card.bad, card.good]; }

/** Open the shop (interim: served from the shelf by the validated haul rules). @param {GameState} state */
export function runShop(state) {
  const s = clone(state), t = /** @type {Today} */ (s.today);
  if (t.phase !== 'shop') throw new Error('The shop is not open');
  const r = resolveShop(s.shelf, t.featured, t.others);
  s.shelf = r.stock; s.coins += r.coins;
  t.shop = { coins: r.coins, served: r.served };
  if (r.served[0]) s.relationships[t.featured.who] = (s.relationships[t.featured.who] || 0) + 1;
  t.phase = 'night';
  return s;
}

/** Night: the shelf ages, the day ends, the next morning starts. @param {GameState} state */
export function endDay(state) {
  const s = clone(state), t = /** @type {Today} */ (s.today);
  if (t.phase !== 'night') throw new Error('The day is not over');
  const n = night(s.shelf);
  s.shelf = n.stock; t.wilted = n.wilted;
  return s;
}

/** Sleep: advance to the next day and deal its morning. @param {GameState} state */
export function nextDay(state) {
  const s = clone(state);
  s.day += 1;
  return startDay(s);
}

/** Record a phase duration (debug metrics). @param {GameState} state @param {string} phase @param {number} ms */
export function logPhase(state, phase, ms) {
  const s = clone(state);
  (s.log[phase] ||= []).push(Math.round(ms));
  return s;
}

/** Weather helper for screens. @param {string} w */
export const weatherOf = w => WEATHER[w];
