// Full-length haul dominance check (300 runs) on the real core:  npm run sim:haul
import { haulChecks } from '../src/sim/haulSim.js';

const r = haulChecks(300);
console.log('Mean 5-day score (coins + rareWeight x rares):');
for (const [k, v] of Object.entries(r.mean).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(8)} ${v.toFixed(1)}`);
const pct = (/** @type {number} */ x) => `${(x * 100).toFixed(0)}%`;
console.log('\nChecks:');
console.log(`  1. planner beats every single-factor strategy by >= 10%: ${r.pass.plannerBeatsSingles ? 'PASS' : 'FAIL'} (${Object.entries(r.margins).map(([k, v]) => `${k} +${pct(v)}`).join(', ')})`);
console.log(`  2. each single-factor strategy is best in some runs:      ${r.pass.eachSingleWinsSometimes ? 'PASS' : 'FAIL'} (${Object.entries(r.wins).map(([k, v]) => `${k} ${pct(v)}`).join(', ')})`);
console.log(`  3. strategies disagree on >= 50% of hauls:                ${r.pass.strategiesDisagree ? 'PASS' : 'FAIL'} (${pct(r.disagree)})`);
console.log(`  4. weather changes the best haul:                         ${r.pass.weatherMatters ? 'PASS' : 'FAIL'} (${pct(r.weatherChanges)})`);
process.exitCode = Object.values(r.pass).every(Boolean) ? 0 : 1;
