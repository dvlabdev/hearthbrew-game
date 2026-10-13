// Safe templates and in-place DOM updates (design/ui-architecture.md). No dependencies.
// - html`…`: interpolated values are escaped unless they are Raw (trusted markup).
// - morph(root, markup): updates the live DOM to match markup, keeping elements, focus and scroll.
import { art } from '../art/registry.js';
import { t } from '../content/strings.js';

/** Trusted markup. Only html`…`, pic() and tx() make it; screens never wrap content text in it. */
export class Raw {
  /** @param {string} s */
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}

const ESC = /** @type {Record<string, string>} */ ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' });
/** Escape text for HTML content and attribute values. @param {unknown} v */
export const esc = v => String(v).replace(/[&<>"']/g, c => ESC[c]);

/** @param {unknown} v @returns {string} */
const part = v => (v == null || v === false ? '' : v instanceof Raw ? v.s : Array.isArray(v) ? v.map(part).join('') : esc(v));

/** Template tag: escapes every interpolation except Raw values; arrays are joined. @param {TemplateStringsArray} strings @param {...unknown} values */
export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += part(values[i]) + strings[i + 1];
  return new Raw(out);
}

/** Mark markup as trusted. Use only for markup the code or the art packs produce. @param {string} s */
export const raw = s => new Raw(s);

/** Art from the registry (trusted: drawn by the style packs). @param {string} id @param {Record<string, unknown>} [opts] */
export const pic = (id, opts) => raw(art(id, opts));

/**
 * Player text from content.strings: the string's own markup (<b>, <small>) is trusted content; the vars filled into it are escaped.
 * @param {string} key @param {Record<string, string | number>} [vars]
 */
export const tx = (key, vars = {}) => raw(t(key, Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, esc(v)]))));

// ---------- morph ----------

/** @param {Node} n */
const keyOf = n => (n.nodeType === 1 ? /** @type {Element} */ (n).getAttribute('data-key') : null);
/** Can `a` be updated in place to become `b`? @param {Node} a @param {Node} b */
const same = (a, b) => a.nodeType === b.nodeType && a.nodeName === b.nodeName && keyOf(a) === keyOf(b);

/**
 * Update `root`'s children in place to match `markup`. Elements are matched by data-key, else by tag in order;
 * matched elements keep their identity (so focus, scroll and running animations survive).
 * SVG art is swapped whole when it differs (it is static, and this avoids namespace edge cases).
 * @param {Element} root @param {string | Raw} markup
 */
export function morph(root, markup) {
  const tpl = document.createElement('template');
  tpl.innerHTML = String(markup);
  patchChildren(root, tpl.content);
}

/** @param {Node} parent @param {Node} next */
function patchChildren(parent, next) {
  const olds = [...parent.childNodes];
  /** @type {Map<string, Node>} */ const keyed = new Map();
  /** @type {Node[]} */ const unkeyed = [];
  for (const n of olds) { const k = keyOf(n); if (k) keyed.set(k, n); else unkeyed.push(n); }
  let u = 0;
  /** @type {Node[]} */ const result = [];
  for (const n of [...next.childNodes]) {
    const k = keyOf(n);
    /** @type {Node | undefined} */ let cand;
    if (k) { cand = keyed.get(k); keyed.delete(k); } else {
      // the next unkeyed old node of the same kind, skipping ones that can't match
      while (u < unkeyed.length && !same(unkeyed[u], n)) u++;
      cand = unkeyed[u++];
    }
    result.push(cand && same(cand, n) ? patch(cand, n) : n);
  }
  // put the result in order, then drop what's left over
  result.forEach((n, i) => { if (parent.childNodes[i] !== n) parent.insertBefore(n, parent.childNodes[i] || null); });
  while (parent.childNodes.length > result.length) parent.removeChild(/** @type {Node} */ (parent.lastChild));
}

/** Patch `a` to match `b`; returns the node to keep (a, or b when replaced). @param {Node} a @param {Node} b @returns {Node} */
function patch(a, b) {
  if (a.nodeType !== 1) { if (a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return a; }
  const ea = /** @type {Element} */ (a), eb = /** @type {Element} */ (b);
  if (ea.namespaceURI === 'http://www.w3.org/2000/svg') return ea.outerHTML === eb.outerHTML ? ea : eb;
  for (const { name } of [...ea.attributes]) if (!eb.hasAttribute(name)) ea.removeAttribute(name);
  for (const { name, value } of [...eb.attributes]) if (ea.getAttribute(name) !== value) ea.setAttribute(name, value);
  if (ea instanceof HTMLInputElement && eb instanceof HTMLInputElement) {
    if (ea.value !== eb.value) ea.value = eb.value;
    ea.checked = eb.checked;
  }
  patchChildren(ea, eb);
  return ea;
}
