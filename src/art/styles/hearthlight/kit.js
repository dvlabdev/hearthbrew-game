// Hearthlight kit: the shared drawing vocabulary of the pack (paint helpers, shapes, the shadow and paper units).
// Every family file (ingredients, people, scene…) draws with these. Level of detail comes from the painter (src/art/lod.js).
import { FACE } from '../../geom.js';
import { painter } from '../../lod.js';

/** @typedef {import('../../lod.js').Painter} Painter */

/** Draw an asset at the level of detail in o.lod ('mini' | 'icon' | 'hero'; icon by default). @param {{ lod?: string } | undefined} o @param {(p: Painter) => string} draw */
export const asset = (o, draw) => draw(painter(o && o.lod, { prefix: 'hl' }));

/** @param {string} gid @param {[number, string, number?][]} stops */
export const lin = (gid, stops, x2 = 0, y2 = 1) => `<linearGradient id="${gid}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, v, op]) =>
  `<stop offset="${o}" style="stop-color:var(${v})${op == null ? '' : `;stop-opacity:${op}`}"/>`).join('')}</linearGradient>`;
/** @param {string} gid @param {[number, string, number?][]} stops */
export const rad = (gid, stops, cx = 0.4, cy = 0.35, r = 0.75) => `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, v, op]) =>
  `<stop offset="${o}" style="stop-color:var(${v})${op == null ? '' : `;stop-opacity:${op}`}"/>`).join('')}</radialGradient>`;
export const [hx, hy, hrx, hry] = FACE.head;
export const SHAPES = {
  heat: '<path d="M24 5 L44 41 H4 Z"/>', calm: '<circle cx="24" cy="24" r="19"/>',
  vigor: '<rect x="6" y="6" width="36" height="36" rx="4"/>', clarity: '<path d="M24 3 L45 24 L24 45 L3 24 Z"/>',
};
/** Almond eye outline for a mood at (x, y). */
export const almond = (/** @type {number} */ x, /** @type {number} */ y, /** @type {string} */ mood) => {
  const [up, lo] = mood === 'happy' ? [3.6, 1.6] : [2.8, 3.2];
  return `M${x - 7} ${y} C${x - 4} ${y - up} ${x + 4} ${y - up} ${x + 7} ${y} C${x + 4} ${y + lo} ${x - 4} ${y + lo} ${x - 7} ${y} Z`;
};

/**
 * An asset's <svg>. `at` nests it inside another drawing (e.g. the Notebook page) at x, y, w, h: no role, no label.
 * `fit: 'slice'` fills a wider box by cropping (the morning banner) instead of letterboxing.
 * @param {string} vb @param {string} inner @param {string} name @param {{ x: number, y: number, w: number, h: number }} [at] @param {'slice'} [fit]
 */
export const svg = (vb, inner, name, at, fit) => (at
  ? `<svg x="${at.x}" y="${at.y}" width="${at.w}" height="${at.h}" viewBox="${vb}">${inner}</svg>`
  : `<svg ${fit === 'slice' ? 'preserveAspectRatio="xMidYMid slice" ' : ''}viewBox="${vb}" role="img" aria-label="${name}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`);
export const F = (/** @type {string} */ v) => `style="fill:var(${v})"`;
export const ST = (/** @type {string} */ v, /** @type {number} */ w) => `fill="none" style="stroke:var(${v})" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
export const LINE = (w = 0.6) => `style="stroke:var(--ink-line)" stroke-width="${w}" stroke-linejoin="round"`;
/** Soft cast shadow: the lantern is upper right, so shadows lean left. */
export const cast = (/** @type {Painter} */ p, /** @type {number} */ cx, /** @type {number} */ cy, /** @type {number} */ rx) => p.is('mini')
  ? `<path d="M${cx - rx * 0.8} ${cy - 2} H${cx + rx * 0.8} L${cx + rx * 0.5} ${cy + 4} H${cx - rx * 1.1} Z" ${F('--shadow')} opacity=".3"/>`
  : `<ellipse cx="${cx - rx * 0.15}" cy="${cy}" rx="${rx}" ry="${rx * 0.17}" ${F('--shadow')} opacity=".45" filter="url(#hl-blur)"/>`;
/** A lens from the origin out to length L (Fable's petal and leaf unit). */
export const lens = (/** @type {number} */ L, /** @type {number} */ w) => `M0 0 Q${w} ${-L / 2} 0 ${-L} Q${-w} ${-L / 2} 0 0 Z`;
/** A paper sheet (light in both themes: a physical page). Shared by Spot the herb and the Notebook. */
export const paper = (/** @type {number} */ w, /** @type {number} */ h) => `<rect width="${w}" height="${h}" rx="4" ${F('--paper')}/><rect width="${w}" height="${h}" rx="4" fill="#000" filter="url(#hl-paper)"/>
  <rect x="3.5" y="3.5" width="${w - 7}" height="${h - 7}" rx="2" fill="none" style="stroke:var(--paper-line)" stroke-width=".6"/><rect x="5" y="5" width="${w - 10}" height="${h - 10}" rx="1.5" fill="none" style="stroke:var(--paper-line)" stroke-width=".3"/>`;
