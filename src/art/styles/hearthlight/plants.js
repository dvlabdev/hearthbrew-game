// Hearthlight plant specimen cards (Spot the herb): a paper sheet, the plant at hero detail, the telling feature ringed.
import { GEOM } from '../../geom.js';
import { painter } from '../../lod.js';
import { svg, F, ST, LINE, paper } from './kit.js';
import { frond } from './ingredients.js';

const HERO = painter('hero', { prefix: 'hl' });

/** Spot-the-herb card: a specimen sheet with the plant drawn at hero detail. */
function sideView(/** @type {'chamomile' | 'mayweed'} */ kind) {
  const p = HERO;
  const g = kind === 'chamomile' ? GEOM.chamomileSide : GEOM.mayweedSide;
  const centre = kind === 'chamomile' ? /** @type {any} */ (g).dome : /** @type {any} */ (g).disc;
  const shade = kind === 'chamomile' ? 'M39 45 C39 31 44 28.5 50 28.5 V45 Z' : 'M37 41 Q43.5 39 50 38.8 V45 H37 Z';
  const florets = kind === 'chamomile'
    ? Array.from({ length: 14 }, (_, i) => `<circle cx="${42 + (i % 4) * 5 + (Math.floor(i / 4) % 2) * 2.5}" cy="${42 - Math.floor(i / 4) * 4}" r=".9"/>`).join('')
    : Array.from({ length: 8 }, (_, i) => `<circle cx="${39 + i * 3.2}" cy="41.6" r=".8"/>`).join('');
  const out = svg('0 0 100 100', `${paper(100, 100)}
    <ellipse cx="48" cy="95" rx="20" ry="2.4" ${F('--paper-sh')} opacity=".7"/>
    <path d="${GEOM.sideStem}" ${ST('--leaf-dk', 2)}/>
    ${[[50, 84, 205, 18], [50, 84, -25, 18], [50, 71, 210, 14], [50, 71, -30, 14]].map(([x, y, a, l]) => frond(p, x, y, a, l)).join('')}
    <path d="${g.petals}" ${ST('--paper-ink', 4.6)} opacity=".55"/><path d="${g.petals}" ${ST('--petal', 3.4)}/>
    <path d="${centre}" fill="url(#hl-yolk)" ${LINE(0.6)}/><path d="${shade}" ${F('--yolk-dk')} opacity=".45"/><g ${F('--yolk-dk')} opacity=".6">${florets}</g>
    <path d="M70 90 C74 92 80 92 84 89" ${ST('--paper-line', 0.6)}/><rect x="66" y="86" width="20" height="6" rx="1" fill="none" style="stroke:var(--paper-line)" stroke-width=".5" transform="rotate(-8 76 89)"/>
    <circle cx="50" cy="${kind === 'chamomile' ? 36 : 40}" r="17" ${ST('--paper-mark', 1.8)} stroke-dasharray="4 3"/>`, kind === 'chamomile' ? 'Chamomile: domed centre' : 'Mayweed: flat centre');
  return out;
}

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'plant:chamomile': () => sideView('chamomile'),
  'plant:mayweed': () => sideView('mayweed'),
};
