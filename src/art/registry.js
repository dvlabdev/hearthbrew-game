// Art registry: the only way screens get visuals. Style packs live in src/art/styles/<id>/ and implement the same asset ids.
// Packs load lazily (src/art/styles/manifest.js): the game loads its one active pack; v0, the complete fallback, is always here.
import * as v0 from './styles/v0-prototype/index.js';
import { MANIFEST } from './styles/manifest.js';
import { INGREDIENTS, CUSTOMERS, WEATHER, TRAIT_IDS, MORNING, EVENTS } from '../content/index.js';

/**
 * @typedef {{ id: string, label: string, css: string, ASSETS: Record<string, (opts?: any) => string>,
 *   exploration?: boolean, round?: number, parents?: string[], defs?: string, scope?: string[], brief?: { adjectives: string[], inspiration: string, technique: string } }} StylePack
 * `defs` (gradients, filters, clip paths) must be injected once per page; assets reference them by id.
 * Complete packs must provide every requiredIds() asset. Exploration packs (art-direction study) cover only their `scope`.
 */

export { MANIFEST };

/** The packs loaded so far, by id. v0 is always loaded. @type {Record<string, StylePack>} */
export const STYLES = { [v0.id]: /** @type {StylePack} */ (/** @type {unknown} */ (v0)) };
let active = v0.id;

/** Load a pack (once) without activating it. @param {string} id @returns {Promise<StylePack>} */
export async function ensureStyle(id) {
  if (STYLES[id]) return STYLES[id];
  const entry = MANIFEST.find(m => m.id === id);
  if (!entry) throw new Error(`Unknown style pack: ${id}`);
  STYLES[id] = /** @type {StylePack} */ (await entry.load());
  return STYLES[id];
}

/** Load a pack and make it the active one. @param {string} id */
export async function loadStyle(id) {
  await ensureStyle(id);
  setStyle(id);
  return STYLES[id];
}

/** Load every pack, archived ones included (tests, galleries, tools). */
export async function loadAll() {
  await Promise.all(MANIFEST.map(m => ensureStyle(m.id)));
  return STYLES;
}

/** The active pack's shared <defs> (gradients, filters, clip paths): inject once per page. */
export const styleDefs = () => STYLES[active].defs || '';

/** Activate a pack that is already loaded. @param {string} id */
export function setStyle(id) {
  if (!STYLES[id]) throw new Error(`Style pack not loaded: ${id} (await loadStyle first)`);
  active = id;
}
export const activeStyle = () => STYLES[active];

/**
 * An asset as an SVG string. Missing ids render a visible placeholder (and are caught by tests).
 * @param {string} id  e.g. 'ingredient:chamomile', 'portrait:marla', 'prop:cauldron'
 * @param {any} [opts] e.g. { boil: true } for the cauldron
 */
export function art(id, opts) {
  // exploration packs cover part of the content: fall back to the complete v0 pack, then to a visible placeholder
  const fn = STYLES[active].ASSETS[id] || STYLES[v0.id].ASSETS[id];
  return fn ? fn(opts) : `<svg viewBox="0 0 100 100" role="img" aria-label="missing ${id}"><rect width="100" height="100" fill="#f0f" opacity=".3"/><text x="50" y="55" font-size="10" text-anchor="middle">${id}</text></svg>`;
}

/** @param {string} id */
export const hasArt = id => !!(STYLES[active].ASSETS[id] || STYLES[v0.id].ASSETS[id]);

/** Every asset id the game content needs. Each style pack must provide all of them. */
export function requiredIds() {
  return [...new Set([
    ...TRAIT_IDS.map(t => `trait:${t}`),
    ...Object.keys(INGREDIENTS).map(i => `ingredient:${i}`),
    ...[...Object.keys(CUSTOMERS), 'traveller'].map(c => `portrait:${c}`),
    ...Object.keys(WEATHER).map(w => `weather:${w}`),
    ...Object.values(MORNING.cards).map(c => c.art).filter(a => a !== 'weather'),
    ...EVENTS.spot.flatMap(e => [`plant:${e.good}`, `plant:${e.bad}`]),
    'prop:cauldron', 'ui:coin',
    'plant:chamomile', 'plant:mayweed', 'plant:nettle', 'plant:deadnettle', 'plant:mint', 'plant:groundivy',
  ])];
}
