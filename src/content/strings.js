// Player-facing text (content.strings): dotted keys with {placeholders}. design/content-model.md
import data from './data/content.json' with { type: 'json' };

const STRINGS = /** @type {Record<string, string>} */ (data.strings);

/** Replace {name} placeholders. @param {string} text @param {Record<string, string | number>} [vars] */
export const fill = (text, vars = {}) => text.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

/**
 * The text for a key, filled. A missing key shows the key itself; tests check that every key the code uses exists.
 * @param {string} key @param {Record<string, string | number>} [vars]
 */
export const t = (key, vars) => fill(STRINGS[key] ?? key, vars);

/**
 * Plural: `key.one` when n is 1, else `key.other`. `n` is also available as a placeholder.
 * @param {string} key @param {number} n @param {Record<string, string | number>} [vars]
 */
export const tn = (key, n, vars = {}) => t(`${key}.${n === 1 ? 'one' : 'other'}`, { n, ...vars });
