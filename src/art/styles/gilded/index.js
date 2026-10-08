// Exploration pack: Gilded Herbal. Gold engraving on ink-dark (gilded apothecary jars, illuminated manuscripts).
// Inverse of Potion Craft's black-on-sepia. Colours come from style.css tokens so Candlelit/Day both work.
import { GEOM, petals, cauldron } from '../../geom.js';

export const id = 'gilded';
export const label = 'Gilded Herbal';
export const exploration = true;
export const css = new URL('./style.css', import.meta.url).href;
export const brief = {
  adjectives: ['precious', 'candlelit', 'learned'],
  inspiration: 'Gilded apothecary jars, illuminated herbals, banknote engraving',
  technique: 'Gold linework with <pattern> hatching and stipple on an ink-dark ground; small icons use a simplified seal.',
};

const DEFS = `<defs>
  <linearGradient id="gh-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--gold-hi)"/><stop offset=".55" style="stop-color:var(--gold)"/><stop offset="1" style="stop-color:var(--gold-lo)"/></linearGradient>
  <pattern id="gh-hatch" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="3.2" style="stroke:var(--gold)" stroke-width=".8"/></pattern>
  <pattern id="gh-xhatch" width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="3.2" style="stroke:var(--gold-lo)" stroke-width=".7"/></pattern>
  <pattern id="gh-stipple" width="2.8" height="2.8" patternUnits="userSpaceOnUse"><circle cx="1.4" cy="1.4" r=".65" style="fill:var(--gold-hi)"/></pattern>
</defs>`;
const G = 'stroke="url(#gh-gold)"';
const ground = (/** @type {number} */ w = 100) => `<rect width="${w}" height="${w}" rx="${w * 0.08}" style="fill:var(--art-ground)"/><rect x="${w * 0.04}" y="${w * 0.04}" width="${w * 0.92}" height="${w * 0.92}" rx="${w * 0.05}" fill="none" ${G} stroke-width="${w * 0.008}" opacity=".6"/>`;
const svg = (/** @type {string} */ vb, /** @type {string} */ inner, /** @type {string} */ label) => `<svg viewBox="${vb}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${DEFS}${inner}</svg>`;

/** Trait badge: the trait shape in its colour, gold bezel, engraved ink glyph. */
function badge(/** @type {string} */ shape, /** @type {string} */ glyph, /** @type {string} */ color, /** @type {string} */ label) {
  return svg('0 0 48 48', `${shape.replace('/>', ` style="fill:var(${color})" ${G} stroke-width="2.4" stroke-linejoin="round"/>`)}
    ${shape.replace('/>', ` fill="url(#gh-hatch)" opacity=".35"/>`)}
    <path d="${glyph}" style="fill:var(--on-trait)"/>`, label);
}

const head = (/** @type {{x:number,y:number,s:number}} */ h, /** @type {boolean} */ domed) =>
  `<g transform="translate(${h.x} ${h.y}) scale(${h.s})"><g fill="url(#gh-hatch)" ${G} stroke-width="${1.3 / h.s}">${petals(8, 5.5, 14)}</g>
   <circle r="8.5" fill="url(#gh-stipple)" ${G} stroke-width="${1.3 / h.s}"/>${domed ? `<circle cx="-2.5" cy="-2.5" r="3" style="fill:var(--gold-hi)" opacity=".8"/>` : ''}</g>`;

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'trait:heat': () => badge('<path d="M24 4 L45 42 H3 Z"/>', 'M24 18c4 5 6 8 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3-1-3 0-5 0-8z', '--heat', 'Heat'),
  'trait:calm': () => badge('<circle cx="24" cy="24" r="20"/>', 'M24 12c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z', '--calm', 'Calm'),
  'trait:vigor': () => badge('<rect x="5" y="5" width="38" height="38" rx="4"/>', 'M14 34c0-12 8-20 22-20 0 14-8 22-20 22z', '--vigor', 'Vigor'),
  'trait:clarity': () => badge('<path d="M24 2 L46 24 L24 46 L2 24 Z"/>', 'M24 13l2.8 7.7 8.2.3-6.4 5 2.3 7.9L24 29.3l-6.9 4.6 2.3-7.9-6.4-5 8.2-.3z', '--clarity', 'Clarity'),

  'ingredient:chamomile': () => svg('0 0 100 100', `${ground()}<g fill="none" ${G} stroke-width="1.6" stroke-linecap="round"><path d="${GEOM.stem}"/><path d="${GEOM.feather}"/></g>${GEOM.heads.map(h => head(h, true)).join('')}`, 'Chamomile'),
  'ingredient:fireroot': () => svg('0 0 100 100', `${ground()}
    <path d="${GEOM.fireroot[0]}" fill="url(#gh-hatch)" ${G} stroke-width="1.6"/><path d="${GEOM.fireroot[0]}" fill="url(#gh-xhatch)" opacity=".5"/>
    <g fill="none" ${G} stroke-width="1.6" stroke-linecap="round"><path d="${GEOM.fireroot[1]}"/><path d="${GEOM.fireroot[2]}"/><path d="${GEOM.firerootRings}"/></g>
    <circle cx="80" cy="60" r="5" style="fill:var(--heat)" ${G} stroke-width="1.2"/>`, 'Fireroot'),

  'plant:chamomile': () => svg('0 0 100 100', `${ground()}<g fill="none" ${G} stroke-width="1.6" stroke-linecap="round"><path d="${GEOM.sideStem}"/><path d="${GEOM.sideLeaves}"/><path d="${GEOM.chamomileSide.petals}" stroke-width="3"/></g>
    <path d="${GEOM.chamomileSide.dome}" fill="url(#gh-stipple)" ${G} stroke-width="1.6"/><circle cx="50" cy="35" r="17" fill="none" style="stroke:var(--highlight)" stroke-width="1.6" stroke-dasharray="4 3"/>`, 'Chamomile: domed centre'),
  'plant:mayweed': () => svg('0 0 100 100', `${ground()}<g fill="none" ${G} stroke-width="1.6" stroke-linecap="round"><path d="${GEOM.sideStem}"/><path d="${GEOM.sideLeaves}"/><path d="${GEOM.mayweedSide.petals}" stroke-width="3"/></g>
    <path d="${GEOM.mayweedSide.disc}" fill="url(#gh-hatch)" ${G} stroke-width="1.6"/><circle cx="50" cy="38" r="17" fill="none" style="stroke:var(--highlight)" stroke-width="1.6" stroke-dasharray="4 3"/>`, 'Mayweed: flat centre'),

  'prop:cauldron': (o = {}) => cauldron({
    boil: o.boil, label: 'Copper cauldron', liquid: o.liquid || 'var(--calm)',
    body: `fill="url(#gh-xhatch)" ${G} stroke-width="2.4"`, rim: `style="fill:var(--art-ground)" ${G} stroke-width="2.4"`,
    bodyExtra: `<path d="${GEOM.pot.body}" fill="url(#gh-hatch)" opacity=".7"/><path d="M50 108 C54 132 68 148 86 154" fill="none" style="stroke:var(--gold-hi)" stroke-width="3" stroke-linecap="round"/>`,
    legs: `${G} stroke-width="6"`, handles: `${G} stroke-width="4"`,
    flames: ['var(--heat)', 'var(--gold-hi)'], steam: 'var(--gold)', bubble: 'var(--gold-hi)', splash: 'var(--gold-hi)',
    before: `<rect width="200" height="200" rx="16" style="fill:var(--art-ground)"/>`,
  }).replace('<svg ', `<svg `).replace('xmlns="http://www.w3.org/2000/svg">', `xmlns="http://www.w3.org/2000/svg">${DEFS}`),

  'portrait:marla': () => svg('0 0 160 160', `<rect width="160" height="160" rx="14" style="fill:var(--art-ground)"/>
    <ellipse cx="80" cy="80" rx="64" ry="72" fill="none" ${G} stroke-width="3"/><ellipse cx="80" cy="80" rx="58" ry="66" fill="none" ${G} stroke-width="1" opacity=".7"/>
    <clipPath id="gh-oval"><ellipse cx="80" cy="80" rx="58" ry="66"/></clipPath>
    <g clip-path="url(#gh-oval)">
      <path d="M24 160 C26 122 52 108 80 108 C108 108 134 122 136 160Z" fill="url(#gh-hatch)" ${G} stroke-width="1.6"/>
      <path d="M56 160 C58 132 66 118 80 118 C94 118 102 132 104 160Z" style="fill:var(--art-ground)" ${G} stroke-width="1.4"/>
      <ellipse cx="80" cy="72" rx="30" ry="34" style="fill:var(--art-ground)" ${G} stroke-width="1.8"/>
      <path d="M50 70 C48 46 62 38 80 38 C98 38 112 46 110 70 C102 56 92 52 80 52 C68 52 58 56 50 70Z" fill="url(#gh-xhatch)" ${G} stroke-width="1.6"/>
      <circle cx="80" cy="32" r="13" fill="url(#gh-xhatch)" ${G} stroke-width="1.6"/>
      <path d="M52 54 C64 42 96 42 108 54" fill="none" style="stroke:var(--heat)" stroke-width="4" stroke-linecap="round"/>
      <path d="M62 76 q7 5 14 0 M86 76 q7 5 14 0" fill="none" ${G} stroke-width="2" stroke-linecap="round"/>
      <path d="M74 94 q6 4 12 0" fill="none" ${G} stroke-width="1.8" stroke-linecap="round"/>
      <path d="M58 84 l6 0 M96 84 l6 0" ${G} stroke-width="1" opacity=".6"/>
    </g>`, 'Marla, engraved portrait'),

  'ui:coin': () => svg('0 0 24 24', `<circle cx="12" cy="12" r="10.5" fill="url(#gh-gold)"/><circle cx="12" cy="12" r="7.5" fill="none" style="stroke:var(--gold-lo)" stroke-width="1" stroke-dasharray="1 1.2"/>`, 'Coin'),
  'ui:texture': () => svg('0 0 100 100', `<rect width="100" height="100" style="fill:var(--art-ground)"/><rect width="100" height="100" fill="url(#gh-hatch)" opacity=".25"/><rect width="100" height="100" fill="url(#gh-xhatch)" opacity=".15"/>`, 'Engraved texture'),
};
export const scope = Object.keys(ASSETS);
