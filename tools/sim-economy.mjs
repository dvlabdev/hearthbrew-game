// Full-length economy check (300 runs) on the real content:  npm run sim:economy
import { economyChecks } from '../src/sim/economy.js';

const r = economyChecks(300);
const pct = (/** @type {number} */ x) => `${(x * 100).toFixed(0)}%`;
for (const bot of /** @type {const} */ (['weak', 'average', 'strong'])) {
  const b = r[bot];
  console.log(`  ${bot.padEnd(8)} earned ${b.total} | 5th slot by day 12 in ${pct(b.slot5By12)} | dead-day runs ${pct(b.dead)} | hoarding runs ${pct(b.hoard)} | finale items by day 19 ${pct(b.crit)}`);
}
console.log('\nChecks:');
for (const [k, v] of Object.entries(r.pass)) console.log(`  ${k.padEnd(20)} ${v ? 'PASS' : 'FAIL'}`);
process.exitCode = Object.values(r.pass).every(Boolean) ? 0 : 1;
