// Exploration pack: Folk Woodcut / Riso. Bold carved shapes in 2-3 spot inks, slightly out of register, printed grain.
// Night prints fluoro inks on dark paper (blend: screen); Day prints on cream paper (blend: multiply).
import { GEOM, petals, cauldron } from '../../geom.js';

export const id = 'riso';
export const label = 'Folk Woodcut / Riso';
export const exploration = true;
export const css = new URL('./style.css', import.meta.url).href;
export const brief = {
  adjectives: ['handmade', 'cheerful', 'punchy'],
  inspiration: 'Folk herbal woodcuts, linocut, risograph zines (spot inks, misregistration, grain)',
  technique: 'Two offset ink layers with a blend mode, outline wobble via feDisplacementMap on static layers, one grain overlay.',
};

const DEFS = `<defs>
  <filter id="rs-grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="1" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .4  0 0 0 .2 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
  <filter id="rs-carve" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="3" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2.6" xChannelSelector="R" yChannelSelector="G"/></filter>
</defs>`;
const K = 'style="stroke:var(--ink-key)"';
const blend = 'style="mix-blend-mode:var(--riso-blend)"';
const paper = (/** @type {number} */ w = 100) => `<rect width="${w}" height="${w}" rx="${w * 0.08}" style="fill:var(--paper)"/>`;
const grain = (/** @type {number} */ w = 100) => `<rect width="${w}" height="${w}" rx="${w * 0.08}" style="fill:var(--paper)" filter="url(#rs-grain)" opacity=".9"/>`;
const svg = (/** @type {string} */ vb, /** @type {string} */ inner, /** @type {string} */ label) => `<svg viewBox="${vb}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${DEFS}${inner}</svg>`;

/** Trait badge: chunky shape in the trait ink, an offset key-ink outline, knocked-out glyph. */
function badge(/** @type {string} */ shape, /** @type {string} */ glyph, /** @type {string} */ color, /** @type {string} */ label) {
  return svg('0 0 48 48', `<g ${blend}>${shape.replace('/>', ` transform="translate(1.6 1.4)" style="fill:var(${color})"/>`)}${shape.replace('/>', ` fill="none" ${K} stroke-width="3" stroke-linejoin="round"/>`)}</g><path d="${glyph}" style="fill:var(--paper)"/>`, label);
}
const head = (/** @type {{x:number,y:number,s:number}} */ h) =>
  `<g transform="translate(${h.x} ${h.y}) scale(${h.s})"><g transform="translate(1.6 1.2)" style="fill:var(--ink-pink)">${petals(8, 5.5, 14)}</g><circle r="8" style="fill:var(--ink-yellow)"/></g>`;

/** @type {Record<string, (opts?: any) => string>} */
export const ASSETS = {
  'trait:heat': () => badge('<path d="M24 5 L44 41 H4 Z"/>', 'M24 18c4 5 6 8 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3-1-3 0-5 0-8z', '--heat', 'Heat'),
  'trait:calm': () => badge('<circle cx="24" cy="24" r="19"/>', 'M24 12c5 7 8 11 8 15a8 8 0 0 1-16 0c0-4 3-8 8-15z', '--calm', 'Calm'),
  'trait:vigor': () => badge('<rect x="6" y="6" width="36" height="36" rx="5"/>', 'M14 34c0-12 8-20 22-20 0 14-8 22-20 22z', '--vigor', 'Vigor'),
  'trait:clarity': () => badge('<path d="M24 3 L45 24 L24 45 L3 24 Z"/>', 'M24 13l2.8 7.7 8.2.3-6.4 5 2.3 7.9L24 29.3l-6.9 4.6 2.3-7.9-6.4-5 8.2-.3z', '--clarity', 'Clarity'),

  'ingredient:chamomile': () => svg('0 0 100 100', `${paper()}<g ${blend}>${GEOM.heads.map(head).join('')}
    <g filter="url(#rs-carve)" fill="none" ${K} stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="${GEOM.stem}"/><path d="${GEOM.feather}" stroke-width="2.6"/>
    ${GEOM.heads.map(h => `<g transform="translate(${h.x} ${h.y}) scale(${h.s})" stroke-width="${2.2 / h.s}">${petals(8, 5.5, 14)}</g>`).join('')}</g></g>${grain()}`, 'Chamomile'),
  'ingredient:fireroot': () => svg('0 0 100 100', `${paper()}<g ${blend}><path d="${GEOM.fireroot[0]}" transform="translate(2 1.6)" style="fill:var(--ink-yellow)"/><path d="${GEOM.fireroot[0]}" style="fill:var(--ink-pink)" opacity=".55"/>
    <g filter="url(#rs-carve)" fill="none" ${K} stroke-width="3" stroke-linecap="round"><path d="${GEOM.fireroot[0]}"/><path d="${GEOM.fireroot[1]}"/><path d="${GEOM.fireroot[2]}"/><path d="${GEOM.firerootRings}" stroke-width="2"/></g></g>
    <circle cx="80" cy="60" r="5" style="fill:var(--heat)"/>${grain()}`, 'Fireroot'),

  'plant:chamomile': () => svg('0 0 100 100', `${paper()}<g ${blend}><path d="${GEOM.chamomileSide.dome}" transform="translate(1.6 1.2)" style="fill:var(--ink-yellow)"/>
    <g filter="url(#rs-carve)" fill="none" ${K} stroke-width="3" stroke-linecap="round"><path d="${GEOM.sideStem}"/><path d="${GEOM.sideLeaves}"/><path d="${GEOM.chamomileSide.petals}" style="stroke:var(--ink-pink)" stroke-width="4"/><path d="${GEOM.chamomileSide.dome}"/></g></g>
    <circle cx="50" cy="35" r="17" fill="none" style="stroke:var(--highlight)" stroke-width="2" stroke-dasharray="4 3"/>${grain()}`, 'Chamomile: domed centre'),
  'plant:mayweed': () => svg('0 0 100 100', `${paper()}<g ${blend}><path d="${GEOM.mayweedSide.disc}" transform="translate(1.6 1.2)" style="fill:var(--ink-yellow)"/>
    <g filter="url(#rs-carve)" fill="none" ${K} stroke-width="3" stroke-linecap="round"><path d="${GEOM.sideStem}"/><path d="${GEOM.sideLeaves}"/><path d="${GEOM.mayweedSide.petals}" style="stroke:var(--ink-pink)" stroke-width="4"/><path d="${GEOM.mayweedSide.disc}"/></g></g>
    <circle cx="50" cy="38" r="17" fill="none" style="stroke:var(--highlight)" stroke-width="2" stroke-dasharray="4 3"/>${grain()}`, 'Mayweed: flat centre'),

  'prop:cauldron': (o = {}) => cauldron({
    boil: o.boil, label: 'Cauldron, riso print', liquid: o.liquid || 'var(--calm)',
    before: `${paper(200)}<path d="${'M36 92 C34 142 62 166 100 166 C138 166 166 142 164 92 Z'}" transform="translate(4 3)" style="fill:var(--ink-pink)" opacity=".85"/>`,
    body: `style="fill:var(--ink-key)"`, rim: `style="fill:var(--ink-teal)"`,
    bodyExtra: `<path d="M50 108 C54 132 68 148 86 154" fill="none" style="stroke:var(--ink-yellow)" stroke-width="5" stroke-linecap="round"/>`,
    legs: `${K} stroke-width="8"`, handles: `${K} stroke-width="6"`,
    flames: ['var(--ink-pink)', 'var(--ink-yellow)'], steam: 'var(--ink-teal)', bubble: 'var(--paper)', splash: 'var(--ink-pink)',
    after: `<rect width="200" height="200" rx="16" style="fill:var(--paper)" filter="url(#rs-grain)" opacity=".7"/>`,
  }).replace('xmlns="http://www.w3.org/2000/svg">', `xmlns="http://www.w3.org/2000/svg">${DEFS}`),

  'portrait:marla': () => svg('0 0 160 160', `${paper(160)}<g ${blend}>
    <circle cx="84" cy="84" r="62" style="fill:var(--ink-yellow)" opacity=".75"/>
    <path d="M24 160 C26 122 52 108 80 108 C108 108 134 122 136 160Z" transform="translate(3 2)" style="fill:var(--ink-pink)"/>
    <path d="M24 160 C26 122 52 108 80 108 C108 108 134 122 136 160Z" fill="none" ${K} stroke-width="3.5"/>
    <ellipse cx="80" cy="72" rx="30" ry="34" style="fill:var(--paper)" ${K} stroke-width="3.5"/>
    <path d="M50 70 C48 46 62 38 80 38 C98 38 112 46 110 70 C102 56 92 52 80 52 C68 52 58 56 50 70Z" style="fill:var(--ink-key)"/>
    <circle cx="80" cy="30" r="13" style="fill:var(--ink-key)"/>
    <path d="M52 54 C64 42 96 42 108 54" fill="none" style="stroke:var(--ink-pink)" stroke-width="6" stroke-linecap="round"/>
    <path d="M62 76 q7 5 14 0 M86 76 q7 5 14 0" fill="none" ${K} stroke-width="3" stroke-linecap="round"/>
    <circle cx="66" cy="88" r="5" style="fill:var(--ink-pink)" opacity=".7"/><circle cx="96" cy="88" r="5" style="fill:var(--ink-pink)" opacity=".7"/>
    <path d="M74 95 q6 4 12 0" fill="none" ${K} stroke-width="3" stroke-linecap="round"/></g>${grain(160)}`, 'Marla, riso portrait'),

  'ui:coin': () => svg('0 0 24 24', `<circle cx="12.8" cy="12.6" r="10" style="fill:var(--ink-pink)"/><circle cx="12" cy="12" r="10" style="fill:var(--ink-yellow)"/><circle cx="12" cy="12" r="6" fill="none" ${K} stroke-width="1.6"/>`, 'Coin'),
  'ui:texture': () => svg('0 0 100 100', `${paper()}<g ${blend}><circle cx="30" cy="40" r="22" style="fill:var(--ink-pink)" opacity=".6"/><circle cx="62" cy="58" r="26" style="fill:var(--ink-teal)" opacity=".5"/></g>${grain()}`, 'Riso paper and inks'),
};
export const scope = Object.keys(ASSETS);
