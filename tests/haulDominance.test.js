import { test } from 'node:test';
import assert from 'node:assert/strict';
import { haulChecks } from '../src/sim/haulSim.js';

// Fixed seeds, so the result is deterministic. The need margin sits close to the 10% bar by design
// (following tomorrow's clue is a decent beginner strategy), so the quick test uses a 7% floor;
// the full 300-run check (npm run sim:haul) applies the real 10% bar.
test('haul: no single factor dominates, and weather matters (80 seeded runs)', () => {
  const r = haulChecks(80);
  for (const k of ['need', 'value', 'rarity']) assert.ok(r.margins[k] >= 0.07, `planner beats ${k} by ${(r.margins[k] * 100).toFixed(0)}%`);
  assert.ok(r.pass.eachSingleWinsSometimes, JSON.stringify(r.wins));
  assert.ok(r.pass.strategiesDisagree, String(r.disagree));
  assert.ok(r.pass.weatherMatters, String(r.weatherChanges));
});
