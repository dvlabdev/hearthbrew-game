# Stage 5: Design system (skeleton, 2026-10-12)

**Status:** the structure is built; the final look waits for the style decision.
- **Built:** the structure, spacing, type and components with their states.
- **Waiting:** the final look. Hearthlight v2 is locked, but you're still thinking about it, and the spike rating is open.
- **Why that's safe:** a style change only touches a pack (`src/art/styles/<id>/style.css` + its art), never a component.

**Live gallery:** `?components` (style switch, Candlelit/Day).

## Layers
| Layer | File | Who changes it |
|---|---|---|
| Raw palette and chrome | `src/art/styles/<id>/style.css` | a style pack |
| **Semantic tokens** | `src/ui/tokens.css` | the design system (rarely) |
| Components | `src/ui/components.css` | uses semantic tokens only. **Lint:** `tests/css-lint.test.js` forbids literal colours and px font sizes |
| Art | `art(id, { lod })` | style packs; missing ids fall back to v0 |

## Semantic tokens
**Colour roles** (`--c-*`):

| Token | Use |
|---|---|
| `--c-bg`, `--c-surface`, `--c-sunk` | page ground, raised surface, sunken areas |
| `--c-ink`, `--c-muted`, `--c-line` | text, secondary text, hairlines |
| `--c-accent` / `--c-on-accent` | the primary action and the text on it |
| `--c-secondary` | links and secondary highlights |
| `--c-focus` | the keyboard focus ring |
| `--c-coin` | coins and value |
| `--c-rare` | the rarity glow |
| `--c-prime` / `--c-poor` | weather quality: ▲ prime, ▼ poor |
| `--c-wilt` | items that wilt tonight |
| `--c-shadow` | shadows |

**Other tokens:**

| Group | Values |
|---|---|
| **Chrome** (pack-overridable) | `--card-fill`, `--card-edge`, `--elev-card`, `--btn-fill`, `--btn-elev`, `--hud-fill`, `--hud-edge` |
| **Type** | 16px floor, ratio 1.25: `--fs-0` 16 · `--fs-1` 20 · `--fs-2` 25 · `--fs-3` 31 · `--fs-4` 39; display, body and hand faces from the pack |
| **Space** (4pt) | `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 24 · `--s-6` 32 · `--s-7` 48 |
| **Shape** | `--radius-sm` 8 · `--radius-card` (pack) · `--radius-btn` (pack) · `--radius-pill` |
| **Size** | `--tap` 44 · art sizes: mini 40, icon 72, hero 160 (these follow the level-of-detail ladder) |
| **Motion** | `--t-fast` 120 · `--t-base` 200 · `--t-slow` 320 · `--t-story` 600ms, plus `--ease-out` and `--ease-spring`. All go to 0 under reduced motion |
| **Layers** | `--z-hud`, `--z-sheet`, `--z-toast` |

## Components and states
**States everywhere:**
- default;
- pressed (`:active`);
- disabled (`[disabled]`);
- focus (`:focus-visible`);
- selected (`[aria-pressed="true"]`).

| Component | Class | Notes |
|---|---|---|
| Button | `.btn`, `.btn.secondary`, `.btn.ghost`, `.block` | 44px minimum; the pressed state sinks 2px |
| Card | `.card`, `.eyebrow` | |
| Morning card | `.mcard` | a big tappable card with icon-size art |
| Find tile | `.find` (`.rare`, `.heavy`, pressed = picked, disabled = no room) | **at most 2 badges**: coin value (▲/▼) and the rarity glow; heavy shows a "2 slots" tag |
| Basket | `.basket` > `.slot` (`.full`, `.span2`) | 5 slots |
| Shelf chip | `.chip` with `.pips` > `.pip.wilt` and a `.delta` "→3" | |
| HUD | `.hud` > `.pill` | |
| Clue | `.clue` | tomorrow's customer as words, **never ticks** |
| Toggle | `.seg` | |
| Trait meter | `.meter` | colour + shape + glyph + number |
| Sheet / toast | `.sheet`, `.toast` | `.inline` variants for the gallery |
| Scaffolding | `.screen`, `.stack`, `.row-between`, `.art-wide`, `.dock` (sticky bottom actions in the thumb zone) | |

## What a style pack must provide
- **Palette:** `--bg`, `--surface`, `--sunk`, `--ink`, `--muted`, `--line`, `--accent`, `--on-accent`, `--secondary`, `--highlight`, trait colours plus `--on-trait`, and the fonts.
- **Optional chrome:** `--r-card`, `--r-btn`, `--card-bg`, `--card-border`, `--card-shadow`, `--btn-bg`, `--btn-shadow`, `--hud-bg`, `--hud-border`, `--display-weight`.
- **Art:** the `requiredIds()` assets, plus `defs` if it uses shared gradients or filters.

## Still to do (after the style decision)
- Final values per token, with contrast documented.
- Motion specs for the signature moments (pour, simmer/boil, star reveal).
- Components for brewing: riddle card, slot strip, result reveal.
