// The interim day loop (design/morning.md): morning cards → haul → event → shop → night.
// Pure functions: each takes a GameState and returns a new one. Randomness is seeded by (seed, day, step),
// so a day replays identically after a reload.
// What cards and events *do* is data (content.json, in the effects vocabulary of ./effects.js); the few behaviours
// that aren't plain effects live in the CARD_ACTIONS and EVENT_KINDS registries; PHASES + dispatch() are the one
// place that says which action is allowed when (design/effects.md).
import { MORNING, EVENTS, HAUL, WEATHER, herbName } from '../content/index.js';
import { t as tr, fill } from '../content/strings.js';
import { genDay, pickedItem, resolveShop, night, slotsUsed } from './haul.js';
import { makeRng, pick, pickWeighted, shuffle } from './rng.js';
import { applyEffects, CONDITIONS, knows, learn, marketHerbs, marketPrice, teachesSomething } from './effects.js';

export { knows };

/** @typedef {import('./state.js').GameState} GameState @typedef {import('./state.js').Today} Today @typedef {import('./state.js').Card} Card */
/** @typedef {import('./effects.js').Vars} Vars */
/** @typedef {typeof MORNING.cards[string]} CardDef */

/** A deterministic stream for one step of one day. @param {GameState} s @param {number} step */
const rngFor = (s, step) => makeRng((s.seed * 7919 + s.day * 104729 + step * 31) | 0);
/** @param {GameState} s @returns {GameState} */
const clone = s => JSON.parse(JSON.stringify(s));

/**
 * Card behaviours that aren't plain effects, named by a card's "action" in content.
 * - deal: extra data drawn when the card is offered (seeded by the morning's stream)
 * - choose: applies the card, returns vars for its note
 * - next: the phase the card leads to (default: the shop)
 * @type {Record<string, { next?: Today['phase'], deal?: (s: GameState, def: CardDef, rng: () => number) => Partial<Card>, choose?: (s: GameState, card: Card, def: CardDef, opts: { buy?: string }) => Vars }>}
 */
export const CARD_ACTIONS = {
  /** Go out on the trail: the haul screen. */
  haul: { next: 'haul' },
  /** The market stalls: a few affordable herbs; buy one. */
  buyHerb: {
    deal: (s, def, rng) => ({ offers: shuffle(rng, marketHerbs().filter(h => marketPrice(h, def.markup) <= s.coins)).slice(0, def.offers) }),
    choose: (s, card, def, opts) => {
      const herb = opts.buy && card.offers?.includes(opts.buy) ? opts.buy : /** @type {string} */ (card.offers?.[0]);
      const price = marketPrice(herb, def.markup);
      applyEffects(s, [{ coins: -price }, { addHerbs: [herb] }], { rng: () => 0 });
      return { herb: herbName(herb), price };
    },
  },
};

/** Which cards can be offered today, in content order. @param {GameState} s */
const eligible = s => Object.keys(MORNING.cards).filter(k => { const w = MORNING.cards[k].when; return !w || CONDITIONS[w](s, MORNING.cards[k]); });

/** Start a day: weather, the customers, the finds (if you go out) and 3 morning cards. @param {GameState} state */
export function startDay(state) {
  const s = clone(state);
  const rng = rngFor(s, 1);
  const d = genDay(rng, s.shelf);
  const types = eligible(s);
  /** @type {string[]} */ const chosen = [];
  while (chosen.length < 3 && chosen.length < types.length) {
    const left = types.filter(t => !chosen.includes(t));
    chosen.push(pickWeighted(rng, left, left.map(t => MORNING.cards[t].weight)));
  }
  const offer = chosen.map(type => {
    const def = MORNING.cards[type];
    /** @type {Card} */ const card = { type, title: fill(def.title, { trail: pick(rng, MORNING.trails) }), text: def.text };
    const deal = def.action && CARD_ACTIONS[def.action].deal;
    return deal ? { ...card, ...deal(s, def, rng) } : card;
  });
  s.today = {
    phase: 'morning', weather: d.weather, offer, card: null, featured: d.featured, others: d.others, finds: d.finds, picks: [],
    gained: [], note: '', event: null, shop: null, wilted: [], startCoins: s.coins,
  };
  return s;
}

/**
 * Choose a morning card: its action or its effects apply, its note is written, and the day moves on.
 * @param {GameState} state @param {number} index @param {{ buy?: string }} [opts] market: which herb to buy
 */
export function chooseCard(state, index, opts = {}) {
  const s = clone(state), t = /** @type {Today} */ (s.today);
  const card = t.offer[index];
  if (!card || t.phase !== 'morning') throw new Error('No such morning card');
  t.card = index;
  const def = MORNING.cards[card.type];
  const action = def.action ? CARD_ACTIONS[def.action] : null;
  const rng = rngFor(s, 2);
  const vars = action?.choose ? action.choose(s, card, def, opts) : applyEffects(s, def.effects || [], { rng });
  if (def.note) t.note = tr(def.note, { ...vars, text: def.texts ? fill(pick(rng, def.texts), vars) : '' });
  t.phase = action?.next || 'shop';
  return s;
}

/**
 * Event kinds: how a kind is offered and resolved. Entries of a kind live in content.events[kind];
 * which kind follows a haul is drawn from content.events.draw (weighted, among the kinds available).
 * @type {Record<string, { deck: (s: GameState) => any[], available?: (s: GameState) => boolean, onDraw?: (s: GameState) => void, resolve: (s: GameState, card: any, choice: number) => void }>}
 */
export const EVENT_KINDS = {
  /** Spot the herb: pick the right look-alike; right = a rare find nearby, wrong = no penalty. Never two days running. */
  spot: {
    deck: () => EVENTS.spot,
    available: s => s.day - s.lastSpotDay >= EVENTS.spotEvery,
    onDraw: s => { s.lastSpotDay = s.day; },
    resolve: (s, card, choice) => {
      const ev = /** @type {NonNullable<Today['event']>} */ (/** @type {Today} */ (s.today).event);
      ev.right = spotOrder(s, card)[choice] === card.good;
      if (ev.right) applyEffects(s, [{ addHerbs: [card.reward] }, { learnHerb: card.reward }], { rng: rngFor(s, 4) });
    },
  },
  /** A meeting with options; each option's effects apply. */
  encounter: {
    deck: () => EVENTS.encounter,
    resolve: (s, card, choice) => { applyEffects(s, card.options[choice].effects, { rng: rngFor(s, 4) }); },
  },
  /** A page of Wren's notes: offered only while it still teaches something. */
  discovery: {
    deck: s => EVENTS.discovery.filter(e => teachesSomething(s, e.effects)),
    resolve: (s, card) => { applyEffects(s, card.effects, { rng: rngFor(s, 4) }); },
  },
};

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
  const kinds = EVENTS.draw
    .filter(d => { const k = EVENT_KINDS[d.kind]; return k.deck(s).length > 0 && (!k.available || k.available(s)); })
    .flatMap(d => Array.from({ length: d.weight }, () => d.kind));
  const kind = pick(rng, kinds);
  t.event = { kind, id: pick(rng, EVENT_KINDS[kind].deck(s)).id };
  EVENT_KINDS[kind].onDraw?.(s);
  t.phase = 'event';
  return s;
}

/** Find the content entry of the event in progress. @param {{ kind: string, id: string }} ev */
export const eventCard = ev => /** @type {any} */ (EVENTS)[ev.kind].find((/** @type {{ id: string }} */ e) => e.id === ev.id);

/** Resolve the event card. Spot: choice 0 = left plant, 1 = right plant (the page decides the order). @param {GameState} state @param {number} choice */
export function resolveEvent(state, choice) {
  const s = clone(state), t = /** @type {Today} */ (s.today);
  const ev = t.event;
  if (t.phase !== 'event' || !ev) throw new Error('No event to resolve');
  ev.choice = choice;
  EVENT_KINDS[ev.kind].resolve(s, eventCard(ev), choice);
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

/**
 * The day's phases and where each may lead. dispatch() refuses any action outside its phase,
 * and any result that jumps to a phase not listed here.
 * @type {Record<Today['phase'], Today['phase'][]>}
 */
export const PHASES = {
  morning: ['haul', 'shop'],
  haul: ['event'],
  event: ['shop'],
  shop: ['night'],
  night: ['morning'],
};

/**
 * @typedef {{ type: 'chooseCard', index: number, buy?: string }
 *   | { type: 'takeHaul', picks: string[] }
 *   | { type: 'resolveEvent', choice: number }
 *   | { type: 'openShop' }
 *   | { type: 'sleep' }} Action
 */

/** Player actions: the phase each is allowed in, and what it does. @type {Record<Action['type'], { from: Today['phase'], run: (s: GameState, a: any) => GameState }>} */
export const ACTIONS = {
  chooseCard: { from: 'morning', run: (s, a) => chooseCard(s, a.index, { buy: a.buy }) },
  takeHaul: { from: 'haul', run: (s, a) => applyHaul(s, a.picks) },
  resolveEvent: { from: 'event', run: (s, a) => resolveEvent(s, a.choice) },
  openShop: { from: 'shop', run: s => endDay(runShop(s)) },   // the interim shop serves itself, then night falls
  sleep: { from: 'night', run: nextDay },
};

/** The one entry point for the UI, bots and replays: apply a player action. @param {GameState} state @param {Action} action @returns {GameState} */
export function dispatch(state, action) {
  const phase = state.today?.phase;
  const a = ACTIONS[action.type];
  if (!a) throw new Error(`Unknown action ${action.type}`);
  if (!phase || phase !== a.from) throw new Error(`${action.type} is not allowed in phase ${phase ?? '(no day)'}`);
  const next = a.run(state, action);
  const to = /** @type {Today['phase']} */ (next.today?.phase);
  if (!PHASES[phase].includes(to)) throw new Error(`${action.type} led from ${phase} to ${to}, which PHASES does not allow`);
  return next;
}

/** Record a phase duration (debug metrics). @param {GameState} state @param {string} phase @param {number} ms */
export function logPhase(state, phase, ms) {
  const s = clone(state);
  (s.log[phase] ||= []).push(Math.round(ms));
  return s;
}

/** Weather helper for screens. @param {string} w */
export const weatherOf = w => WEATHER[w];
