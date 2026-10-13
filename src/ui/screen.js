// Screens (design/ui-architecture.md): a screen is a plain object, mounted on a root element.
//   init(s) → local            per-screen UI state (picks, an open sheet…); reset whenever a new state arrives
//   view(s, local) → Raw       pure markup (html`…`); no listeners
//   actions: { name(ctx, data, ev) }   called for [data-action="name"] clicks, and [data-hold="name"] long-presses
// mount() re-renders with morph() on every set(), so elements, focus and scroll survive.
import { morph } from './dom.js';
import { dispatch } from '../core/day.js';

/** @typedef {import('../core/state.js').GameState} GameState */
/** @typedef {import('../core/day.js').Action} Action */
/**
 * @typedef {object} Ctx
 * @property {GameState} s                          the state this screen shows
 * @property {Record<string, any>} local            its UI state
 * @property {(patch: Record<string, any>) => void} set   update the UI state and re-render in place
 * @property {(next: GameState) => void} go         hand a new game state to the game (saves, routes by phase)
 * @property {(a: Action) => void} act              go(dispatch(s, a))
 * @property {(text: string) => void} say           a short screen-reader announcement
 * @property {HTMLElement} root
 */
/**
 * @typedef {object} Screen
 * @property {(s: GameState) => Record<string, any>} [init]
 * @property {(s: GameState, local: Record<string, any>) => import('./dom.js').Raw} view
 * @property {Record<string, (ctx: Ctx, data: DOMStringMap, ev: Event) => void>} [actions]
 */

export const LONG_PRESS = 450;

/**
 * Mount a screen on `root` (replacing whatever screen was there). Listeners are delegated on the root,
 * so re-renders never re-wire anything.
 * @param {HTMLElement} root @param {Screen} screen @param {GameState} s @param {(next: GameState) => void} go
 * @param {{ status?: HTMLElement | null }} [opts]
 * @returns {Ctx}
 */
export function mount(root, screen, s, go, opts = {}) {
  /** @type {Ctx} */
  const ctx = {
    s, root, go,
    local: screen.init ? screen.init(s) : {},
    set: patch => { ctx.local = { ...ctx.local, ...patch }; render(); },
    act: a => go(dispatch(s, a)),
    say: text => { if (opts.status) { opts.status.textContent = ''; opts.status.textContent = text; } },
  };
  const render = () => morph(root, screen.view(ctx.s, ctx.local));
  const actions = screen.actions || {};
  /** @param {string | undefined} name @param {HTMLElement} el @param {Event} ev */
  const run = (name, el, ev) => {
    if (!name || !actions[name]) return;
    if (el instanceof HTMLButtonElement && el.disabled) return;
    actions[name](ctx, el.dataset, ev);
  };

  let held = false;
  /** @type {number | undefined} */ let timer;
  const cancel = () => clearTimeout(timer);
  root.onclick = ev => {
    if (held) { held = false; return; }   // the click that ends a long-press
    const el = /** @type {HTMLElement | null} */ (/** @type {Element} */ (ev.target).closest('[data-action]'));
    if (el && root.contains(el)) run(el.dataset.action, el, ev);
  };
  root.onpointerdown = ev => {
    held = false;
    const el = /** @type {HTMLElement | null} */ (/** @type {Element} */ (ev.target).closest('[data-hold]'));
    if (!el || !root.contains(el)) return;
    cancel();
    timer = window.setTimeout(() => { held = true; run(el.dataset.hold, el, ev); }, LONG_PRESS);
  };
  root.onpointerup = root.onpointercancel = root.onpointerleave = cancel;
  root.oncontextmenu = ev => { if (/** @type {Element} */ (ev.target).closest('[data-hold]')) ev.preventDefault(); };

  render();
  return ctx;
}
