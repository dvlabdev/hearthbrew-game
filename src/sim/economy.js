// 20-day economy simulation. Port of tools/economy_sim.py (check 6). Pure; used by tests and tools/sim-economy.mjs.
import { GOODS, SCORING } from '../content/index.js';
import { makeRng } from '../core/rng.js';

const DAYS = 20;
/** @param {number} d */ const customers = d => (d <= 3 ? 3 : d <= 8 ? 4 : d <= 14 ? 5 : 6);
export const BOTS = { weak: [0.10, 0.35, 0.45, 0.10], average: [0.05, 0.20, 0.45, 0.30], strong: [0.00, 0.05, 0.30, 0.65] };
const MARKET_PER_DAY = 6;
/** @type {[string, number, number, boolean][]} name, price, unlock day, story-critical */
export const UPGRADES = [
  ['plot 3', 40, 2, false], ['cauldron slot 4', 60, 3, true], ['kettle', 80, 4, true],
  ['drying rack', 50, 5, false], ['compost bin', 30, 5, false],
  ['trowel', 45, 7, false], ['salve pot', 120, 9, true], ['cauldron slot 5', 180, 10, true],
  ['lantern', 100, 12, false], ['plot 4', 60, 8, false], ['shelf +6', 40, 4, false],
  ['plot 5', 90, 11, false], ['plot 6', 120, 13, false],
  ['donation: bonfire wood', 50, 14, false], ['donation: cakes', 50, 14, false],
  ['donation: garlands', 50, 15, false], ['donation: hearth blessing', 50, 15, false],
];
const PRIORITY = UPGRADES.slice().sort((a, b) => Number(!a[3]) - Number(!b[3]) || UPGRADES.indexOf(a) - UPGRADES.indexOf(b));
const DECOR = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80];
export const STORY_DAYS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

/** @param {number[]} probs @param {() => number} rng */
function drawStars(probs, rng) {
  let r = rng();
  for (let s = 0; s < 4; s++) { r -= probs[s]; if (r < 0) return s; }
  return 3;
}

/** One 20-day run. @param {keyof typeof BOTS} bot @param {number} seed */
export function play(bot, seed) {
  const rng = makeRng(seed);
  let coins = 0, decorI = 0;
  /** @type {Set<string>} */ const owned = new Set();
  const log = [];
  for (let day = 1; day <= DAYS; day++) {
    let earned = 0;
    const tea = owned.has('kettle') ? 0.25 : 0, salve = owned.has('salve pot') ? 0.25 : 0;
    for (let c = 0; c < customers(day); c++) {
      const s = drawStars(BOTS[bot], rng), r = rng();
      const base = r < salve ? GOODS.salve.price : r < salve + tea ? GOODS.tea.price : GOODS.potion.price;
      earned += base * SCORING.priceMult[s] * (c === 0 ? SCORING.featuredMult : 1);
    }
    earned = Math.round(earned) - (day > 1 ? MARKET_PER_DAY : 0);
    coins += earned;
    /** @type {string[]} */ const bought = [];
    for (const [name, cost, unlock, crit] of PRIORITY) {
      if (owned.has(name) || day < unlock) continue;
      if (coins >= cost) { coins -= cost; owned.add(name); bought.push(name); } else if (crit) break;
    }
    const critLeft = Math.max(0, ...UPGRADES.filter(u => u[3] && !owned.has(u[0])).map(u => u[1]));
    while (day >= 8 && decorI < DECOR.length && coins - DECOR[decorI] >= 50 + critLeft) { coins -= DECOR[decorI]; bought.push(`decor ${DECOR[decorI]}`); decorI++; }
    const remaining = UPGRADES.filter(u => !owned.has(u[0])).map(u => u[1]);
    log.push({ day, earned, coins, bought, maxRemaining: remaining.length ? Math.max(...remaining) : 0 });
  }
  return log;
}

/** The four economy.md section 5 checks over many runs. @param {number} runs */
export function economyChecks(runs) {
  /** @param {keyof typeof BOTS} bot */
  const summarize = bot => {
    const res = Array.from({ length: runs }, (_, i) => play(bot, i + 1));
    const slot5 = res.map(l => l.find(e => e.bought.includes('cauldron slot 5'))?.day ?? 99);
    const dead = res.filter(l => l.some(e => e.day >= 2 && e.day <= 15 && !e.bought.length && !STORY_DAYS.has(e.day))).length / runs;
    const hoard = res.filter(l => l.some(e => e.day < 15 && e.maxRemaining && e.coins > 2 * e.maxRemaining)).length / runs;
    const crit = res.filter(l => UPGRADES.filter(u => u[3]).every(u => l.some(e => e.day <= 19 && e.bought.includes(u[0])))).length / runs;
    const total = res.map(l => l.reduce((a, e) => a + e.earned, 0)).sort((a, b) => a - b)[Math.floor(runs / 2)];
    return { slot5By12: slot5.filter(d => d <= 12).length / runs, dead, hoard, crit, total };
  };
  const weak = summarize('weak'), average = summarize('average'), strong = summarize('strong');
  return {
    weak, average, strong,
    pass: {
      noDeadDays: average.dead <= 0.1,
      slot5ByDay12: average.slot5By12 >= 0.8,
      noHoarding: average.hoard <= 0.1,
      weakReachesFinale: weak.crit >= 0.9,
    },
  };
}
