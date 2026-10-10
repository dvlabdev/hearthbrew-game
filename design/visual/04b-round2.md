# Stage 3–4, round 2: three new directions

**Status:** 2026-10-10 · built and technically checked · ⏳ waiting for your rating (gate 👤) on your phone: https://claude.ai/artifact/PwPeRDrMYiAFRDXcTMSBC9
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

## Your verdict
*(to be filled in from your copied report)*
