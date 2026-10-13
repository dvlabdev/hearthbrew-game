// Hearthlight (locked direction, design/visual/04d-direction.md): the product owner's mix of the round 2 directions.
// Construction from Modern Fable (geometric forms, one crisp shadow plane per form), light and palette from
// Lantern Storybook (dusk room, lantern glow, rim light, grain), detail from Naturalist only where the eye goes
// (faces, botanical structure, the counter's grain). Backgrounds stay simple.
//
// The pack is split by asset family; each family file exports a partial ASSETS map, merged here.
// New assets go in their family file and draw through the painter `p` (src/art/lod.js) — never by post-processing SVG.
import { defs } from './defs.js';
import { ASSETS as ui } from './ui.js';
import { ASSETS as ingredients } from './ingredients.js';
import { ASSETS as plants } from './plants.js';
import { ASSETS as scene } from './scene.js';
import { ASSETS as people } from './people.js';
import { ASSETS as notebook } from './notebook.js';
import { ASSETS as weather } from './weather.js';

export const id = 'hearthlight';
export const label = 'Hearthlight';
export const exploration = true;   // not yet complete: ids it lacks fall back to v0 (tests check its own scope)
export const round = 3;
export const parents = ['storybook', 'fable', 'naturalist'];
export const css = new URL('./style.css', import.meta.url).href;
export const brief = {
  adjectives: ['warm', 'crafted', 'true-to-life'],
  inspiration: 'Your mix: Lantern Storybook palette and light + Modern Fable geometry + Naturalist detail on faces and plants',
  technique: 'Geometric silhouettes with one clipped shadow plane each; gradient lantern light, rim light and glow; fine detail (iris, florets, veins, grain) only on hero objects; one shared grain.',
};
export { defs };

/** Merge the family maps; an id drawn by two families is a mistake. @param {Record<string, Record<string, (opts?: any) => string>>} families */
export function merge(families) {
  /** @type {Record<string, (opts?: any) => string>} */ const out = {};
  for (const [family, assets] of Object.entries(families)) for (const [k, fn] of Object.entries(assets)) {
    if (out[k]) throw new Error(`hearthlight: "${k}" is drawn twice (again in ${family})`);
    out[k] = fn;
  }
  return out;
}

export const ASSETS = merge({ ui, ingredients, plants, scene, people, notebook, weather });
export const scope = Object.keys(ASSETS);
