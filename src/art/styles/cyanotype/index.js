// Exploration pack: Cyanotype Herbarium. Pale photograms on Prussian blue (after Anna Atkins, 1843).
// Thicker plant parts print whiter; a soft contact-print edge and paper grain. Specimen labels in Latin.
import { GEOM, petals, cauldron } from '../../geom.js';

export const id = 'cyanotype';
export const label = 'Cyanotype Herbarium';
export const exploration = true;
export const css = new URL('./style.css', import.meta.url).href;
export const brief = {
  adjectives: ['botanical', 'serene', 'authentic'],
  inspiration: "Anna Atkins' Photographs of British Algae: Cyanotype Impressions (1843), herbarium sheets",
  technique: 'Translucent stacked whites (thicker = whiter), a 0.6px blur for the contact-print edge, one shared grain overlay.',
};

const DEFS = `<defs>
  <filter id="cy-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .13 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <filter id="cy-print" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".55"/></filter>
  <radialGradient id="cy-vignette" cx=".5" cy=".5" r=".7"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>
</defs>`;
const W = 'style="fill:var(--print-hi)"';
const WS = 'style="stroke:var(--print-hi)"';
const plate = (/** @type {number} */ w = 100, /** @type {string} */ label = '') => `<rect width="${w}" height="${w}" rx="${w * 0.06}" style="fill:var(--print)"/>
  <rect width="${w}" height="${w}" rx="${w * 0.06}" style="fill:var(--print)" filter="url(#cy-grain)"/><rect width="${w}" height="${w}" rx="${w * 0.06}" fill="url(#cy-vignette)"/>
  ${label ? `<text x="${w * 0.07}" y="${w * 0.93}" font-family="'Libre Caslon Text',Georgia,serif" font-style="italic" font-size="${w * 0.075}" ${W} opacity=".85">${label}</text>` : ''}`;
const svg = (/** @type {string} */ vb, /** @type {string} */ inner, /** @type {string} */ label) => `<svg viewBox="${vb}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${DEFS}${inner}</svg>`;

/** Trait badge: trait colour with a white keyline (stands out on the blue ground), dark glyph. */
function badge(/** @type {string} */ shape, /** @type {string} */ glyph, /** @type {string} */ color, /** @type {string} */ label) {
  return svg('0 0 48 48', `${shape.replace('/>', ` style="fill:var(${color});stroke:var(--keyline)" stroke-width="3" stroke-linejoin="round"/>`)}<path d="${glyph}" style="fill:var(--on-trait)"/>`, label);
}
const head = (/** @type {{x:number,y:number,s:number}} */ h, /** @type {boolean} */ domed) =>
  `<g transform="translate(${h.x} ${h.y}) scale(${h.s})" ${W} fill-opacity=".5">${petals(8, 5.5, 14)}<circle r="${domed ? 8 : 7}" fill-opacity=".85"/>${domed ? '<circle r="4" fill-opacity="1"/>' : ''}</g>`;

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'trait:heat': () => badge('<path d="M24 5 L44 41 H4 Z"/>', 'M24 18c4 5 6 8 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3-1-3 0-5 0-8z', '--heat', 'Heat'),
  'trait:calm': () => badge('<circle cx="24" cy="24" r="19"/>', 'M24 12c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z', '--calm', 'Calm'),
  'trait:vigor': () => badge('<rect x="6" y="6" width="36" height="36" rx="4"/>', 'M14 34c0-12 8-20 22-20 0 14-8 22-20 22z', '--vigor', 'Vigor'),
  'trait:clarity': () => badge('<path d="M24 3 L45 24 L24 45 L3 24 Z"/>', 'M24 13l2.8 7.7 8.2.3-6.4 5 2.3 7.9L24 29.3l-6.9 4.6 2.3-7.9-6.4-5 8.2-.3z', '--clarity', 'Clarity'),

  'ingredient:chamomile': () => svg('0 0 100 100', `${plate(100, 'Matricaria')}<g filter="url(#cy-print)"><g fill="none" ${WS} stroke-opacity=".8" stroke-width="2.2" stroke-linecap="round"><path d="${GEOM.stem}"/><path d="${GEOM.feather}" stroke-width="1.6"/></g>${GEOM.heads.map(h => head(h, true)).join('')}</g>`, 'Chamomile'),
  'ingredient:fireroot': () => svg('0 0 100 100', `${plate(100, 'Zingiber ignis')}<g filter="url(#cy-print)"><path d="${GEOM.fireroot[0]}" ${W} fill-opacity=".55"/><path d="${GEOM.fireroot[0]}" fill="none" ${WS} stroke-opacity=".9" stroke-width="1.4"/>
    <g fill="none" ${WS} stroke-opacity=".8" stroke-width="3" stroke-linecap="round"><path d="${GEOM.fireroot[1]}"/><path d="${GEOM.fireroot[2]}"/></g><path d="${GEOM.firerootRings}" fill="none" style="stroke:var(--print)" stroke-width="1.4"/></g>
    <circle cx="80" cy="60" r="4" style="fill:var(--heat);stroke:var(--keyline)" stroke-width="1.2"/>`, 'Fireroot'),

  'plant:chamomile': () => svg('0 0 100 100', `${plate(100, 'no. 12')}<g filter="url(#cy-print)"><g fill="none" ${WS} stroke-opacity=".8" stroke-width="2.2" stroke-linecap="round"><path d="${GEOM.sideStem}"/><path d="${GEOM.sideLeaves}"/><path d="${GEOM.chamomileSide.petals}" stroke-width="3.2" stroke-opacity=".6"/></g>
    <path d="${GEOM.chamomileSide.dome}" ${W} fill-opacity=".95"/></g><circle cx="50" cy="35" r="17" fill="none" style="stroke:var(--highlight)" stroke-width="1.8" stroke-dasharray="4 3"/>`, 'Chamomile: domed centre'),
  'plant:mayweed': () => svg('0 0 100 100', `${plate(100, 'no. 13')}<g filter="url(#cy-print)"><g fill="none" ${WS} stroke-opacity=".8" stroke-width="2.2" stroke-linecap="round"><path d="${GEOM.sideStem}"/><path d="${GEOM.sideLeaves}"/><path d="${GEOM.mayweedSide.petals}" stroke-width="3.2" stroke-opacity=".6"/></g>
    <path d="${GEOM.mayweedSide.disc}" ${W} fill-opacity=".7"/></g><circle cx="50" cy="38" r="17" fill="none" style="stroke:var(--highlight)" stroke-width="1.8" stroke-dasharray="4 3"/>`, 'Mayweed: flat centre'),

  'prop:cauldron': (o = {}) => cauldron({
    boil: o.boil, label: 'Cauldron, cyanotype print', liquid: o.liquid || 'var(--calm)',
    before: `${plate(200)}`,
    body: `${W} fill-opacity=".38" ${WS} stroke-opacity=".9" stroke-width="2"`, rim: `${W} fill-opacity=".6"`,
    bodyExtra: `<path d="M50 108 C54 132 68 148 86 154" fill="none" ${WS} stroke-width="5" stroke-opacity=".55" stroke-linecap="round"/>`,
    legs: `${WS} stroke-opacity=".7" stroke-width="7"`, handles: `${WS} stroke-opacity=".7" stroke-width="5"`,
    flames: ['var(--heat)', 'var(--print-hi)'], steam: 'var(--print-hi)', bubble: 'var(--print-hi)', splash: 'var(--print-hi)',
  }).replace('xmlns="http://www.w3.org/2000/svg">', `xmlns="http://www.w3.org/2000/svg">${DEFS}`),

  'portrait:marla': () => {
    const [bx, by, br] = GEOM.marlaBun;
    return svg('0 0 160 160', `${plate(160, 'Marla, baker')}<g filter="url(#cy-print)">
      <path d="${GEOM.marlaProfile}" ${W} fill-opacity=".7"/><circle cx="${bx}" cy="${by}" r="${br}" ${W} fill-opacity=".85"/>
      <path d="${GEOM.marlaScarf}" fill="none" ${WS} stroke-opacity=".95" stroke-width="7" stroke-linecap="round"/>
      <g ${W} fill-opacity=".9">${[0, 1, 2, 3, 4].map(i => `<circle cx="${64 + i * 9}" cy="${132 + (i % 2) * 6}" r="3"/>`).join('')}</g></g>
      <path d="${GEOM.marlaEye}" fill="none" style="stroke:var(--print)" stroke-width="2.2" stroke-linecap="round"/>`, 'Marla, cyanotype portrait');
  },

  'ui:coin': () => svg('0 0 24 24', `<circle cx="12" cy="12" r="10.5" style="fill:var(--accent)"/><circle cx="12" cy="12" r="7" fill="none" style="stroke:var(--print)" stroke-width="1.2"/>`, 'Coin'),
  'ui:texture': () => svg('0 0 100 100', `${plate(100)}<g filter="url(#cy-print)" ${WS} fill="none" stroke-opacity=".35" stroke-width="1.2"><path d="M10 90 C30 60 20 30 40 10 M60 95 C70 70 90 60 92 30"/><path d="M30 60 l-8 -6 M28 44 l8 -5 M80 66 l8 -4"/></g>`, 'Cyanotype paper'),
};
export const scope = Object.keys(ASSETS);
