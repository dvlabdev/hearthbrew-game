// Every style pack, with its metadata, WITHOUT loading it (design/visual/05-design-system.md, pack contract).
// The game loads only the active pack (plus v0, the complete fallback, which the registry imports statically).
// Archived packs (rejected or superseded art-direction rounds) stay viewable: the gallery, the style tiles and the
// spike load them on demand. Adding a pack: a folder in src/art/styles/<id>/ and one entry here (a test checks both).

/**
 * @typedef {object} PackEntry
 * @property {string} id
 * @property {string} label
 * @property {number} [round]          art-direction round it came from (1, 2, 3)
 * @property {boolean} [archived]      not offered to the game; viewable in the gallery's Archive group
 * @property {string[]} [parents]      packs it was mixed from
 * @property {() => Promise<any>} load
 */

/** @type {PackEntry[]} */
export const MANIFEST = [
  { id: 'v0-prototype', label: 'v0 · prototype placeholders', load: () => import('./v0-prototype/index.js') },
  { id: 'hearthlight', label: 'Hearthlight', round: 3, parents: ['storybook', 'fable', 'naturalist'], load: () => import('./hearthlight/index.js') },
  // round 2: Hearthlight's parents (design/visual/04b-round2.md)
  { id: 'storybook', label: 'Lantern Storybook', round: 2, archived: true, load: () => import('./storybook/index.js') },
  { id: 'fable', label: 'Modern Fable', round: 2, archived: true, load: () => import('./fable/index.js') },
  { id: 'naturalist', label: 'Naturalist Still-life', round: 2, archived: true, load: () => import('./naturalist/index.js') },
  // round 1: rejected (design/visual/04-critique.md)
  { id: 'gilded', label: 'Gilded Herbal', round: 1, archived: true, load: () => import('./gilded/index.js') },
  { id: 'shadow', label: 'Shadow Theatre', round: 1, archived: true, load: () => import('./shadow/index.js') },
  { id: 'cyanotype', label: 'Cyanotype Herbarium', round: 1, archived: true, load: () => import('./cyanotype/index.js') },
  { id: 'riso', label: 'Folk Woodcut / Riso', round: 1, archived: true, load: () => import('./riso/index.js') },
];
