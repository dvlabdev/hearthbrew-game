# UI architecture: screens, safe templates, in-place updates (2026-10-13)

This is audit Direction 3 (`design/audit-2026-10-12.md`). Screens used to rebuild the whole page on every tap (`innerHTML`), which lost focus and scroll, and they escaped nothing. Now:
- **screens are small declarative objects;**
- **markup is escaped by default;**
- **updates morph the live DOM in place,** so elements, focus and scroll survive.

There are no dependencies: the user chose our own morph over vendoring lit-html.

## Templates (`src/ui/dom.js`)
| Helper | Use |
|---|---|
| `` html`…${v}…` `` | All markup. Strings and numbers in `${}` are **escaped**; `Raw` passes through; arrays are joined; `null`, `false` and `undefined` render nothing |
| `t(key, vars)` | Player text as **plain text** (escaped when interpolated). Use for attributes and text without markup |
| `tx(key, vars)` | Player text whose string has markup (`<b>`, `<small>`): the string is trusted content, the vars are escaped |
| `pic(id, opts)` | Art from the registry (trusted, drawn by the style packs) |
| `raw(s)` | Last resort for markup the code itself produces. **Never for content text** |

Content text (customer clues, card text, event text) is always interpolated plainly, so it's escaped. A test injects `<b>"Wren's" & co</b>` into a clue and checks that it shows literally.

## Screens (`src/ui/screen.js`)
```js
export const haul = {
  init: s => ({ picks: [], detail: null }),          // per-screen UI state; reset when a new game state arrives
  view: (s, local) => html`…`,                        // pure: markup only, no listeners
  actions: { pick(ctx, data, ev) { … ctx.set({ picks }) … } },
};
```
**`mount(root, screen, s, go)`** renders `view` and delegates listeners on the root:
- a click on `[data-action="name"]` calls `actions.name(ctx, el.dataset, ev)`;
- a 450 ms press on `[data-hold="name"]` calls the same action (the click that ends a long-press is ignored).

**`ctx`** provides:
- **`set(patch)`**: update the local UI state and re-morph;
- **`act(action)`**: `go(dispatch(s, action))`;
- **`go(state)`**: hand a new game state to the game, which saves it and routes by phase;
- **`say(text)`**: an announcement in the `role="status"` region.

**`SCREENS`** (`src/ui/game.js`) maps each phase in `PHASES` to its screen. `titleScreen` is shown when there's no day in progress. **Adding a screen** means adding a phase to `PHASES` (core), an entry to `SCREENS`, and its `view` and `actions`.

## Morph rules
`morph(root, markup)` parses the markup and patches the live DOM:
- **Matching:** elements are matched by **`data-key`** when present, otherwise by tag in order. Matched elements keep their identity: only changed attributes, text and children are touched.
- **Give `data-key` to anything in a list that can change** (find tiles `find-<herb>`, basket slots `slot-<herb>-<n>`, cards `card-<type>`, shelf chips `chip-<herb>`). Then adding or removing one item leaves the others' elements alone; this is the base for the planned arc-into-the-basket animation.
- **SVG art** is compared as a whole and swapped only when it differs.
- **Debug panel:** it lives outside the screen root (`.screen-root`, `display: contents`), so morphs never touch it.

## Focus and announcements
- **A new screen** (any `go`) scrolls to the top and focuses its single **`<h1 tabindex="-1">`** (use `title(text)` from `screens/common.js`). Screen readers hear the new page title, not the whole page.
- **Within a screen,** focus stays where it was, because the element survives the morph. When the focused element disappears, the action moves focus deliberately:
  - opening a sheet focuses its first button;
  - closing it returns focus to the control that opened it;
  - putting a slot back focuses the next slot, or the herb's tile.
- **Announcements:** `<main>` is no longer `aria-live`. Short announcements go through `ctx.say()` into `#status` (`role="status"`), e.g. "Mint in the basket, 3 of 5 slots."

## Find tiles
A find tile is a `.find` card holding two buttons, because a button can't sit inside a button:
- **`.find-info`**, the herb's **picture** with a small ⓘ badge: opens the details. It's a 56px-wide target, kept wide so that names like "Chamomile ×1" still fit at 340px.
- **`.find-pick`**, the rest of the tile: picks the herb. A long-press also opens the details, as before.

## Tests
- **`tests/dom.test.js`:** escaping in content and attributes, `Raw` and arrays, and `tx` escaping vars but keeping string markup.
- **`tests/screens.test.js`** renders every screen in every phase, plus open sheets and picks, in Node. It checks:
  - every button has `type="button"` and an accessible name;
  - there are no nested buttons;
  - every `data-action` or `data-hold` has an action;
  - each screen has exactly one focusable `h1`;
  - content text is escaped.
- **Browser checks** (the morph needs a real DOM; done for this change at 360px and 340px):
  - **Picks:** a picked tile is the same element afterwards and keeps focus; scroll doesn't jump; the status line announces the pick.
  - **Details:** the picture opens the sheet, Close returns focus, and long-press still works.
  - **New screens** focus their `h1`.
  - **Full loop:** every card, the market sheet, the 3 event kinds, shop, night, Continue and `?debug&day=5`.
  - **Debug bot:** `src/ui/debugBot.js` loads only for `?debug&day`, so the game itself no longer loads the haul sim.
