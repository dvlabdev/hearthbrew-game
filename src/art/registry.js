// Art registry: the only way screens get visuals. Style packs live in src/art/styles/<id>/ and implement the same asset ids.
import * as v0 from './styles/v0-prototype/index.js';
import { INGREDIENTS, CUSTOMERS, WEATHER, TRAIT_IDS } from '../content/index.js';

/** @typedef {{ id: string, label: string, css: string, ASSETS: Record<string, (opts?: any) => string> }} StylePack */

/** @type {Record<string, StylePack>} */
export const STYLES = { [v0.id]: v0 };
let active = v0.id;

/** @param {string} id */
export function setStyle(id) {
  if (!STYLES[id]) throw new Error(`Unknown style pack: ${id}`);
  active = id;
}
export const activeStyle = () => STYLES[active];

/**
 * An asset as an SVG string. Missing ids render a visible placeholder (and are caught by tests).
 * @param {string} id  e.g. 'ingredient:chamomile', 'portrait:marla', 'prop:cauldron'
 * @param {any} [opts] e.g. { boil: true } for the cauldron
 */
export function art(id, opts) {
  const fn = STYLES[active].ASSETS[id];
  return fn ? fn(opts) : `<svg viewBox="0 0 100 100" role="img" aria-label="missing ${id}"><rect width="100" height="100" fill="#f0f" opacity=".3"/><text x="50" y="55" font-size="10" text-anchor="middle">${id}</text></svg>`;
}

/** @param {string} id */
export const hasArt = id => !!STYLES[active].ASSETS[id];

/** Every asset id the game content needs. Each style pack must provide all of them. */
export function requiredIds() {
  return [
    ...TRAIT_IDS.map(t => `trait:${t}`),
    ...Object.keys(INGREDIENTS).map(i => `ingredient:${i}`),
    ...[...Object.keys(CUSTOMERS), 'bramble', 'traveller'].map(c => `portrait:${c}`),
    ...Object.keys(WEATHER).map(w => `weather:${w}`),
    'prop:cauldron', 'ui:coin',
    'plant:chamomile', 'plant:mayweed', 'plant:nettle', 'plant:deadnettle', 'plant:mint', 'plant:groundivy',
  ];
}
