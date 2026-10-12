// Choose-your-haul rules (design/expedition.md). Port of tools/haul_sim.py, checked against it by tests.
import { HAUL, WEATHER, CUSTOMERS } from '../content/index.js';
import { pick, pickWeighted } from './rng.js';

/** @typedef {import('../content/types.js').StockItem} StockItem */

const H = HAUL.herbs, NAMES = Object.keys(H), CUST = Object.keys(CUSTOMERS), WKEYS = Object.keys(WEATHER);

/** @typedef {{ weather: string, featured: {who: string, units: number}, finds: string[], others: {who: string, units: number}[] }} Day */

/** The validated starting shelf (prototype C3 and the sims). @type {StockItem[]} */
export const START_STOCK = [{ herb: 'chamomile', nights: 1 }, { herb: 'chamomile', nights: 3 }, { herb: 'nettle', nights: 2 }, { herb: 'sage', nights: 3 }];


/**
 * A herb picked today, shaped by the weather: prime kinds give a double dose (+1 unit) and +1 value;
 * poor kinds lose 1 value and keep a night less.
 * @param {string} herb @param {string} weather @returns {Required<StockItem>}
 */
export function pickedItem(herb, weather) {
  const w = WEATHER[weather], h = H[herb];
  const prime = w.prime.includes(h.kind), poor = (w.poor || []).includes(h.kind);
  return {
    herb, prime, poor,
    nights: HAUL.freshNights + w.nights - (poor ? 1 : 0),
    units: h.units + (prime ? 1 : 0),
    value: Math.max(0, h.value + (prime ? 1 : 0) - (poor ? 1 : 0)),
  };
}

/** @param {StockItem} s */ const unitsOf = s => s.units ?? H[s.herb].units;
/** @param {StockItem} s */ const valueOf = s => s.value ?? H[s.herb].value;

/**
 * Serve one need from stock, using the items that wilt soonest. Items are removed by identity,
 * never by equality (twin items must not vanish together: a bug the browser cross-check found).
 * @param {StockItem[]} stock @param {string} trait @param {number} units
 * @returns {{ ok: boolean, value: number, stock: StockItem[] }}
 */
export function serve(stock, trait, units) {
  const cand = stock.filter(s => H[s.herb].trait === trait)
    .map((s, i) => ({ s, i }))
    .sort((a, b) => a.s.nights - b.s.nights || unitsOf(b.s) - unitsOf(a.s) || a.i - b.i)
    .map(x => x.s);
  let got = 0;
  /** @type {StockItem[]} */
  const used = [];
  for (const s of cand) { if (got >= units) break; used.push(s); got += unitsOf(s); }
  if (got < units) return { ok: false, value: 0, stock };
  return { ok: true, value: used.reduce((a, s) => a + valueOf(s), 0), stock: stock.filter(s => !used.includes(s)) };
}

/**
 * Tomorrow's shop: the featured customer first, then the others in order.
 * @param {StockItem[]} stock
 * @param {{ who: string, units: number }} featured
 * @param {{ who: string, units: number }[]} others
 */
export function resolveShop(stock, featured, others) {
  let coins = 0;
  /** @type {boolean[]} */
  const served = [];
  [featured, ...others].forEach((c, i) => {
    const r = serve(stock, CUSTOMERS[c.who].trait, c.units);
    if (r.ok) coins += (i === 0 ? HAUL.pay.featured : HAUL.pay.other) + r.value;
    served.push(r.ok); stock = r.stock;
  });
  return { coins, served, stock };
}

/** Every item loses a night; items at 0 have wilted. @param {StockItem[]} stock */
export function night(stock) {
  const out = stock.map(s => ({ ...s, nights: s.nights - 1 }));
  return { stock: out.filter(s => s.nights > 0), wilted: out.filter(s => s.nights <= 0).map(s => s.herb) };
}

/** Basket slots used. @param {readonly string[]} picks */
export const slotsUsed = picks => picks.reduce((a, h) => a + H[h].slots, 0);

/**
 * One full morning-to-night cycle (used by tests and sims).
 * @param {StockItem[]} stock
 * @param {{ weather: string, featured: {who: string, units: number}, others: {who: string, units: number}[] }} day
 * @param {readonly string[]} picks
 */
export function playDay(stock, day, picks) {
  const all = stock.map(s => ({ ...s })).concat(picks.map(p => pickedItem(p, day.weather)));
  const r = resolveShop(all, day.featured, day.others);
  const n = night(r.stock);
  return { stock: n.stock, coins: r.coins, served: r.served, wilted: n.wilted, rares: picks.filter(p => H[p].rarity === 'rare').length };
}

/** Random day following the generator rule in expedition.md. @param {() => number} rng @param {StockItem[]} stock @returns {Day} */
export function genDay(rng, stock) {
  const wk = pick(rng, WKEYS), w = WEATHER[wk];
  const pickCust = () => (w.skew && rng() < 0.5 ? pick(rng, CUST.filter(c => CUSTOMERS[c].trait === w.skew)) : pick(rng, CUST));
  const featured = { who: pickCust(), units: pick(rng, [1, 2, 2]) };
  const ft = CUSTOMERS[featured.who].trait;
  const finds = [];
  const serving = NAMES.filter(h => H[h].trait === ft);
  finds.push(pick(rng, serving), pick(rng, serving));
  const wilting = stock.filter(s => s.nights === 1).map(s => s.herb);
  finds.push(wilting.length ? pick(rng, wilting) : pick(rng, NAMES));
  finds.push(pick(rng, NAMES.filter(h => H[h].rarity === 'rare' || H[h].slots > 1)));
  const weights = NAMES.map(h => (w.boost.includes(H[h].kind) ? 3 : 1) * (H[h].rarity === 'rare' ? 0.4 * w.rareMult : 1));
  while (finds.length < w.finds) finds.push(pickWeighted(rng, NAMES, weights));
  for (let i = 0; i < w.extraRare; i++) finds.push(pick(rng, NAMES.filter(h => H[h].rarity === 'rare')));
  const others = [0, 1].map(() => ({ who: pickCust(), units: pick(rng, [1, 1, 2]) }));
  return { weather: wk, featured, finds, others };
}
