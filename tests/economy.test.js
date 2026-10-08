import { test } from 'node:test';
import assert from 'node:assert/strict';
import { economyChecks } from '../src/sim/economy.js';

test('economy: the four economy.md checks pass (100 seeded runs; npm run sim:economy for 300)', () => {
  const r = economyChecks(100);
  assert.deepEqual(r.pass, { noDeadDays: true, slot5ByDay12: true, noHoarding: true, weakReachesFinale: true });
  assert.ok(r.weak.total < r.average.total && r.average.total < r.strong.total, 'better brewing earns more');
});
