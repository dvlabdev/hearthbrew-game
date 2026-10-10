// Art registry: the only way screens get visuals. Style packs live in src/art/styles/<id>/ and implement the same asset ids.
import * as v0 from './styles/v0-prototype/index.js';
import * as gilded from './styles/gilded/index.js';
import * as shadow from './styles/shadow/index.js';
import * as cyanotype from './styles/cyanotype/index.js';
import * as riso from './styles/riso/index.js';
import * as storybook from './styles/storybook/index.js';
import * as fable from './styles/fable/index.js';
import * as naturalist from './styles/naturalist/index.js';
import { INGREDIENTS, CUSTOMERS, WEATHER, TRAIT_IDS } from '../content/index.js';

/**
 * @typedef {{ id: string, label: string, css: string, ASSETS: Record<string, (opts?: any) => string>,
 *   exploration?: boolean, round?: number, defs?: string, scope?: string[], brief?: { adjectives: string[], inspiration: string, technique: string } }} StylePack
 * `defs` (gradients, filters, clip paths) must be injected once per page; assets reference them by id.
 * Complete packs must provide every requiredIds() asset. Exploration packs (art-direction study) cover only their `scope`.
 */

/** @type {Record<string, StylePack>} */
export const STYLES = Object.fromEntries([v0, gilded, shadow, cyanotype, riso, storybook, fable, naturalist].map(p => [p.id, /** @type {StylePack} */ (p)]));
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
