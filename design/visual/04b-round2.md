# Stage 3–4, round 2: three new directions

**Status:** 2026-10-11 · rated by the product owner → **hybrid "Hearthlight"** in progress (round 3). Page: https://claude.ai/artifact/PwPeRDrMYiAFRDXcTMSBC9
**Why there's a round 2:** you rejected all four round 1 directions (see `04-critique.md`, "Your verdict"). The reasons were: too gold or boring traits; not "game" enough; too flat and simple; cartoonish, unrealistic colour. You pointed toward *soft painted storybook*, *crisp modern flat*, *something else*.

## What changed in the method
| Round 1 | Round 2 |
|---|---|
| A designer's board: swatches and isolated icons | **Leads with a 360px game screen:** the shop room, the customer behind the counter, a HUD, the riddle, the brew bench, the shelf and the trait meter |
| One shared set of simple drawings, restyled | **Each direction draws its own detail.** Only the layout is shared (`FACE`, `SCENE` in `src/art/geom.js`) |
| Flat single fills | Light, shading, depth and materials |
| Identical interface chrome in every tile | **The chrome follows the style** (card, button, HUD and chip tokens per pack) |
| One expression | **Two expressions** (tired → relieved), for pillar 1 |
| Gradients excluded by the brief | Soft gradients and light allowed (brief §3 overridden by your verdict); neon and corporate flat still out |

## The three directions (a realism scale)
| | **Lantern Storybook** | **Modern Fable** | **Naturalist Still-life** |
|---|---|---|---|
| Your pointer | soft painted storybook | crisp modern flat | something else: the most realistic |
| Adjectives | glowing, tender, enchanted | crisp, atmospheric, serene | authentic, rich, candlelit |
| References | painted picture books, Ghibli interiors, Spiritfarer, Cozy Grove | Alto's Odyssey, Monument Valley, Florence | Dutch still life, Strange Horticulture, botanical plates |
| Technique | gradient fills lit from the lantern, radial glows, rim light, rounded forms, paper grain | flat fills; every form is a lit plane plus a shadow plane; banded skies, layered hills, long shadows | multi-stop gradients plus noise textures (wood grain, iron, plaster), fine sepia linework, true plant structure (spiral seed-heads, divided leaves) |
| Type | Fraunces + Atkinson | DM Serif Display + Atkinson | Cormorant Garamond + Atkinson |
| Chrome | soft glowing cards, pill buttons | crisp cards, chunky pressable buttons | ruled paper labels, leather-tab buttons |
| Production cost / asset | medium | **low** | **high** (and the heaviest to render on a phone) |

## Technical gate (passed)
- **Contrast:** AA in both themes for all three (`node tools/contrast-check.mjs`). Trait colours were tuned on the lightness ladder (`tools/tune-traits.mjs`).
- **Tests:** `npm test` passes (23). A new test requires each round 2 pack to have a shop scene, two different moods, and one shared defs block with no undefined `url(#…)` references.
- **Layout:** no page overflow at 340px; no console errors.
- **Screenshots:** `shots/04b-{storybook,fable,naturalist}-{night,day}.png`.

## Known rough edges (exploration quality, to fix in the chosen direction)
- Marla stands a little small and low in the scene; the customer should be larger, since reading her is pillar 1.
- Modern Fable's lantern glow is two hard discs; it needs a proper stepped halo.
- The Day themes keep the moon position for the sun, and the window light is subtle.
- The naturalist filters (noise textures) need a phone performance check before production.

## Your verdict (2026-10-11)
| Direction | Rating |
|---|---|
| Lantern Storybook | 4/5 |
| Modern Fable | 3/5 |
| Naturalist Still-life | 4/5 |

**Favourite: a mix.** "I like the colour palette and style of Lantern, the geometric style of design of Modern Fable, but also the realistic style of Naturalist."

## Synthesis: Hearthlight (each parent gets one job)
| Layer | From | Rule |
|---|---|---|
| **Construction** | Modern Fable | Clean geometric forms: lens petals, faceted roots, crisp shelves and bundles, and a clear shadow plane on every form. Silhouettes read at 40px |
| **Light and palette** | Lantern Storybook | Dusk-blue room and lantern amber; gradient light from the lantern side, rim light, glow, one paper grain |
| **Detail and material** | Naturalist | **Detail where the eye goes** (a hierarchy, not everywhere): faces (iris, lids, lips, modelling), botanical truth (spiral seed-heads, veins, divided leaves), the counter's wood grain. Backgrounds stay simple |
| **Chrome** | Lantern + Fable | Glowing cards with crisp 14px corners; chunky pressable buttons in lantern amber |

Also folded in: a larger customer in the scene (pillar 1) and a proper stepped halo for the lantern.
→ Round 3: one hybrid pack (`src/art/styles/hearthlight/`) on `prototypes/style-tiles-r3.html`, shown next to its three parents. Rate it on your phone: https://claude.ai/artifact/HPcSzR7YKU5HRzphqYuKQ5 (shots: `shots/04c-hearthlight-{night,day}.png`). AA contrast passes in both themes; tests pass.

## Round 3 verdict (2026-10-11)
"The comparison is very interesting. Each of the styles has great points."

**What you liked in each:**
- **Naturalist:**
  - its **Spot-the-herb card**, on white paper "like a paper page";
  - its chamomile (along with Hearthlight's).
- **Hearthlight:**
  - its chamomile;
  - its **background lighting**;
  - its **shop scene with the shadows**.
  - (Naturalist is "too realistic and darkish".)
- **Modern Fable:** its stylisation, "a great option to simplify the design and the level of detail".

**Decision: detail by size**, one style with a level-of-detail ladder. → `04d-direction.md`.
