// ?debug&day=N&seed=S: bot-play a seeded game to day N (test hauls on days 5 and 10). Loaded lazily by game.js.
import { newGame } from '../core/state.js';
import { startDay, dispatch } from '../core/day.js';
import { STRATEGIES } from '../sim/haulSim.js';
import { makeRng } from '../core/rng.js';

/** @typedef {import('../core/state.js').GameState} GameState */

/** @param {number} seed @param {number} toDay @returns {GameState} */
export function botTo(seed, toDay) {
  let s = startDay(newGame(seed));
  const rng = makeRng(seed);
  while (s.day < toDay) {
    const t = /** @type {NonNullable<GameState['today']>} */ (s.today);
    const i = Math.max(0, t.offer.findIndex(c => c.type === 'expedition'));
    s = dispatch(s, { type: 'chooseCard', index: i, buy: t.offer[i].offers?.[0] });
    if (s.today?.phase === 'haul') {
      s = dispatch(s, { type: 'takeHaul', picks: STRATEGIES.planner(s.shelf, { ...t }, rng) });
      s = dispatch(s, { type: 'resolveEvent', choice: 0 });
    }
    s = dispatch(dispatch(s, { type: 'openShop' }), { type: 'sleep' });
  }
  return s;
}
