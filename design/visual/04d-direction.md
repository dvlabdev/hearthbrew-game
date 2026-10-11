# Locked direction: Hearthlight v2

**Status:** locked 2026-10-11 (from the round 3 verdict), pending the validation spike (`05-spike-log.md`).

## One style, one job per parent
| Layer | From | Rule |
|---|---|---|
| **Shapes** | Modern Fable | Geometric construction: lens petals and leaves, faceted roots, straight shelves and bundles. **One crisp shadow plane per form** (the light comes from the upper right) |
| **Light and palette** | Lantern Storybook | Dusk-blue room, lantern amber, gradient light, rim light on the lantern side, glow, one shared grain |
| **Detail** | Naturalist | Only on hero views (see the ladder): florets in a spiral, veins, divided leaves, irises and lips, fine sepia line |
| **Paper** | Naturalist | Specimen sheets for Spot the herb and the Notebook |

## Level-of-detail ladder (the core rule)
| Level | Size | Where | Rendering |
|---|---|---|---|
| **Hero** | ≥160px | Notebook pages, Spot-the-herb cards, portraits, the result reveal | Naturalist structure and fine line (0.6–1px), on paper where it's a sheet |
| **Icon** | about 96px | brew slots, haul finds, request art | Hearthlight: geometric forms, gradient light, a few details |
| **Mini** | ≤48px | shelf chips, HUD, trait meter, inventory | Modern Fable: flat lit and shadow planes. **No filters, no fine line, no texture** |
| **Scene** | full width | shop, morning card skies | Hearthlight lighting and long shadows; simple shapes, with detail only on the counter grain |

**Code:** `art(id, { lod: 'hero' | 'icon' | 'mini' })`; the default is `icon`.

## Paper sheets
- **Where:** Spot-the-herb cards and Notebook pages.
- **Look:** light paper in **both** themes, since it's a physical object you hold; a ruled border; paper grain; specimen numbers ("no. 12") set as **page text at 16px+**, never inside the art.
- **Develop:** a Notebook entry you haven't learned is a pale pencil outline; learning it "develops" the full specimen plate. This replaces round 1's cyanotype idea.

## Still true from the brief
- Traits are colour + shape + glyph.
- AA contrast in both themes.
- 16px minimum text, 44px tap targets.
- Reduced motion.
- 360px, one-handed use.
