// Haul dominance simulation. Port of tools/haul_sim.py strategies and checks, running on the real core (src/core/haul.js).
import { HAUL, WEATHER, CUSTOMERS } from '../content/index.js';
import { pickedItem, resolveShop, playDay, slotsUsed } from '../core/haul.js';
import { makeRng, pick, pickWeighted } from '../core/rng.js';

/** @typedef {import('../content/types.js').StockItem} StockItem */
/** @typedef {{ weather: string, featured: {who: string, units: number}, finds: string[], others: {who: string, units: number}[] }} Day */

const H = HAUL.herbs, NAMES = Object.keys(H), CUST = Object.keys(CUSTOMERS), WKEYS = Object.keys(WEATHER);
export const START_STOCK = [{ herb: 'chamomile', nights: 1 }, { herb: 'chamomile', nights: 3 }, { herb: 'nettle', nights: 2 }, { herb: 'sage', nights: 3 }];

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

/** @param {string[]} order */
function fill(order) {
  /** @type {string[]} */ const picks = [];
  for (const h of order) if (slotsUsed(picks) + H[h].slots <= HAUL.basket) picks.push(h);
  return picks;
}

const RANK = { rare: 0, uncommon: 1, common: 2 };
/** @type {Record<string, (stock: StockItem[], day: Day, rng: () => number) => string[]>} */
export const STRATEGIES = {
  need: (stock, day) => { const t = CUSTOMERS[day.featured.who].trait; return fill(day.finds.slice().sort((a, b) => Number(H[a].trait !== t) - Number(H[b].trait !== t) || H[b].units / H[b].slots - H[a].units / H[a].slots)); },
  value: (stock, day) => fill(day.finds.slice().sort((a, b) => pickedItem(b, day.weather).value / H[b].slots - pickedItem(a, day.weather).value / H[a].slots)),
  rarity: (stock, day) => fill(day.finds.slice().sort((a, b) => RANK[H[a].rarity] - RANK[H[b].rarity] || H[b].value - H[a].value)),
  random: (stock, day, rng) => { const f = day.finds.slice(); for (let i = f.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [f[i], f[j]] = [f[j], f[i]]; } return fill(f); },
  planner: (stock, day, rng) => planner(stock, day, rng),
};

/** Stock-aware planner: tries every basket, samples the unknown customers. */
function planner(/** @type {StockItem[]} */ stock, /** @type {Day} */ day, /** @type {() => number} */ rng, samples = 8) {
  let best = /** @type {string[]} */ ([]), bestScore = -1;
  const seen = new Set();
  const n = day.finds.length;
  for (let mask = 0; mask < (1 << n); mask++) {
    const picks = day.finds.filter((_, i) => mask & (1 << i)).sort();
    const key = picks.join(',');
    if (seen.has(key) || slotsUsed(picks) > HAUL.basket) continue;
    seen.add(key);
    let tot = 0;
    for (let s = 0; s < samples; s++) {
      const others = [0, 1].map(() => ({ who: pick(rng, CUST), units: pick(rng, [1, 1, 2]) }));
      const all = stock.map(x => ({ ...x })).concat(picks.map(p => pickedItem(p, day.weather)));
      const r = resolveShop(all, day.featured, others);
      tot += r.coins + 3 * r.stock.filter(x => x.nights > 1).reduce((a, x) => a + (x.units ?? H[x.herb].units), 0);
    }
    const sc = tot / samples + HAUL.rareWeight * picks.filter(p => H[p].rarity === 'rare').length;
    if (sc > bestScore) { best = picks; bestScore = sc; }
  }
  return best;
}

/** One 5-day run with every strategy on the same days. @param {number} seed */
export function runOnce(seed, days = 5) {
  const rng = makeRng(seed);
  /** @type {Record<string, StockItem[]>} */ const stocks = Object.fromEntries(Object.keys(STRATEGIES).map(k => [k, START_STOCK.map(s => ({ ...s }))]));
  /** @type {Record<string, number>} */ const score = Object.fromEntries(Object.keys(STRATEGIES).map(k => [k, 0]));
  let disagree = 0;
  for (let d = 0; d < days; d++) {
    const day = genDay(rng, stocks.planner);
    /** @type {Record<string, string[]>} */ const picks = {};
    for (const [k, f] of Object.entries(STRATEGIES)) picks[k] = f(stocks[k], day, makeRng(Math.floor(rng() * 1e9)));
    if (new Set(['need', 'value', 'rarity'].map(k => picks[k].slice().sort().join(','))).size > 1) disagree++;
    for (const k of Object.keys(STRATEGIES)) {
      const r = playDay(stocks[k], day, picks[k]);
      stocks[k] = r.stock; score[k] += r.coins + HAUL.rareWeight * r.rares;
    }
  }
  return { score, disagree: disagree / days };
}

/** The four haul checks (validation.md). @param {number} runs */
export function haulChecks(runs) {
  const res = Array.from({ length: runs }, (_, i) => runOnce(i + 1));
  /** @param {string} k */ const mean = k => res.reduce((a, r) => a + r.score[k], 0) / runs;
  const singles = ['need', 'value', 'rarity'];
  const m = Object.fromEntries(Object.keys(STRATEGIES).map(k => [k, mean(k)]));
  const wins = Object.fromEntries(singles.map(k => [k, res.filter(r => r.score[k] === Math.max(...singles.map(s => r.score[s]))).length / runs]));
  const disagree = res.reduce((a, r) => a + r.disagree, 0) / runs;
  // weather plays a role: same finds and customers, other weather -> does the best haul change?
  const rng = makeRng(99); let changed = 0; const trials = Math.max(20, Math.floor(runs / 5));
  for (let t = 0; t < trials; t++) {
    const stock = START_STOCK.map(s => ({ ...s }));
    const day = genDay(rng, stock);
    const best = new Set(WKEYS.map(wk => planner(stock, { ...day, weather: wk }, makeRng(t)).join(',')));
    if (best.size > 1) changed++;
  }
  const margins = Object.fromEntries(singles.map(k => [k, m.planner / m[k] - 1]));
  return {
    mean: m, wins, disagree, weatherChanges: changed / trials, margins,
    pass: {
      plannerBeatsSingles: singles.every(k => margins[k] >= 0.10),
      eachSingleWinsSometimes: singles.every(k => wins[k] > 0.05),
      strategiesDisagree: disagree >= 0.5,
      weatherMatters: changed / trials >= 0.5,
    },
  };
}
