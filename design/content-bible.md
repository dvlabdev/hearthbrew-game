# Content Bible (v1 scope): M0b.2

Vectors are written as `[Heat, Calm, Vigor, Clarity]`. The rules are in [brew-math.md](brew-math.md) and the grounding is in [research/alchemy-research.md](research/alchemy-research.md). Every item lists its **role**: if it has no role, it gets cut.

## 1. Goods
| Good | Base | Station | Batch | Base price | Unlock | Role |
|---|---|---|---|---|---|---|
| Potion | Spring water (free) | Cauldron (3→5 slots, Simmer/Boil) | 2 bottles | 10c | Day 1 | The core puzzle |
| Tea | Tea leaves (1c) — adds Calm +1 | Kettle (2 slots, always steeped) | 3 cups | 7c | Day 4 | Cheap, quick, many cups. Good for simple Calm requests and frees up the cauldron. |
| Salve | Oil (3c) + beeswax (2c) | Cauldron with the salve pot (mortar unlocks it) | 2 jars | 16c | Day 9 | High value. Salve requests are about the body ("aching back", "chapped hands"); Clarity is rarely wanted. |

**Batch rule:** one brew fills several containers. Serving two similar requests from one batch is a real choice: you trade precision for efficiency.

**Self-use goods** (made with the normal brewing system, not new recipes):
| Good | Requirement | Effect | Unlock |
|---|---|---|---|
| Garden tonic | Any potion with Vigor ≥ 4 and Heat ≤ 1, at 2★ or better | Pour on a plot: it advances 1 growth day | Day 5 (Wren's note) |
| Lantern oil | A salve-type brew with Heat ≥ 4 (pine resin, brimstone) | Fuels the lantern for the cave (1 trip per jar) | Day 12 |

## 2. Ingredients (v1, 21 items)
| Ingredient | Vector | Tags | Source | Role | Tag |
|---|---|---|---|---|---|
| Chamomile | [0,3,0,0] | delicate, flower | start, garden (2d) | Pure Calm | 🧪 |
| Lavender | [0,2,0,1] | delicate, flower | garden (3d) | Calm with a little Clarity | 🧪 |
| Mint | [−2,1,0,2] | delicate, leaf | start, meadow, garden (2d) | **Cancels Heat**; Clarity | 🧪 |
| Sage | [0,0,0,3] | leaf (sturdy) | start, meadow | Pure Clarity | 🧪 |
| Fireroot | [3,0,0,0] | tough, root | start, meadow, garden (4d) | Main Heat source | 🧪 (ginger) |
| Nettle | [1,0,3,0] | leaf | meadow | Main Vigor source | 🧪 |
| Rosehip | [0,0,2,0] | tough, fruit | meadow, garden (5d) | Pure (gentle) Vigor | 🧪 |
| Honey | [0,1,1,0] | sweetener (R4) | market 2c | Smooths Heat brews (R4) | 🧪✨ |
| Valerian | [0,4,−1,−1] | tough, root | forest (trowel), garden (4d) | **Strong Calm with side-effects**; dulls Clarity | 🧪 |
| Glowcap | [0,−1,0,4] | tough, fungus | forest | **Strong Clarity**; unsettles Calm | ✨ (glows faintly) |
| Pine resin | [2,0,0,1] | resinous, oil-like | forest | Heat + Clarity; a lantern-oil ingredient | 🧪 |
| Bilberry | [0,1,2,1] | delicate, fruit | forest | Gentle all-rounder for Vigor | 🧪 |
| Angelica root | [2,0,1,1] | tough, root | forest (trowel) | Warming tonic: Heat + Vigor | 🧪 |
| Brimstone | [4,−1,0,0] | mineral, **no-potion** | cave | Strong Heat; salves and lantern oil only (not allowed in potions) | 🧪✨ |
| Salt | — (modifier R5) | mineral | cave, market 3c | +1 to the strongest trait; +2 shelf days | 🧪✨ |
| Quartz dust | — (modifier R8) | mineral, crystal, **rare** (1 per cave trip, max 1 per brew) | cave | **Purify**: sets the brew's lowest non-zero trait to 0 | ✨ |
| Sunwort | [1,1,1,1] | delicate, flower | garden only (6d, **single harvest of 2**, annual); seed from Bramble's 3rd beat or Wren's note on day 12 | Festival ingredient, required in the Midsummer Draught | ✨ (St John's wort, fictionalized) |
| Spring water | base | — | free | Potion base | — |
| Tea leaves | base, +1 Calm | — | market 1c | Tea base | — |
| Oil | base | oily | market 3c | Salve base (needs beeswax, R6) | 🧪 |
| Beeswax | binder | — | market 2c | Prevents Separated (R6) | 🧪 |

**New reaction rule R8 (✨):** Quartz dust *purifies*. The brew's lowest non-zero trait becomes 0. This is the late-game answer to tier-3 "avoid" requests.

**Coverage check:** every trait has a pure source (chamomile, sage, nettle, fireroot), a strong source with a side-effect (valerian, glowcap, angelica, brimstone), a canceller (mint for Heat) or modifiers (salt, quartz), and pair blends. The solution-space script in M0c verifies that nothing is dominant or never useful.

**Design principle (from the M0c request-space check):** *starter ingredients are simple and honest, while forest and cave ingredients are strong with a catch.* Each starter ingredient carries at most one side trait, apart from mint's deliberate Heat cancelling, lavender and honey. Depth in tiers 2–3 comes from strong ingredients with side-effects (valerian, glowcap, angelica) and from what's actually in your basket.

## 3. Tools & stations (v1)
| Item | Type | Price | Available from | Role |
|---|---|---|---|---|
| Cauldron (3 slots) | Station | start | — | Core |
| Cauldron: 4th slot | Upgrade | 60c | Day 3 | Bigger profiles, more combinations |
| Cauldron: 5th slot | Upgrade | 180c | Day 10 | Needed for the Midsummer Draught |
| Shelf (6 goods) → 12 | Station / upgrade | start / 40c | Day 4 | Lets you stock ahead for tomorrow's requests |
| Kettle | Station | 80c | Day 4 | Teas |
| Drying rack | Station | 50c | Day 5 | Defeats wilting; trait shift |
| Salve pot | Station | 120c | Day 9 | Salves and lantern oil |
| Basket (6 picks) → 8 picks | Field tool | start / 70c | Day 6 | Bigger hauls from expeditions |
| Sickle | Field tool | start | — | Meadow herbs |
| Trowel | Field tool | 45c | Day 7 | Root nodes (valerian, angelica) |
| Lantern | Field tool | 100c | Day 12 | Cave access (uses lantern oil) |
| Garden plots (2 → 6) | Garden | +40 / 60 / 90 / 120c | Day 2+ | Steady supply |
| Watering can | Garden | start | — | Growth |
| Compost bin | Garden | 30c | Day 5 | Spent ingredients and 0★ brews → fertilizer (+1 growth day on one plot) |

The **mortar** from the roadmap is renamed the **salve pot** in v1, to keep a single verb per station. Grinding moves to the v2 list.

## 4. Garden
- Each plot holds 1 seed and needs a **daily water** to grow one day. An unwatered plant **pauses**; it never dies (pillar 4).
- **Harvest yield:** 3 fresh units. Plants can be re-harvested every 3 days: they're perennials, which reduces micromanagement.
- **Growth times:**

| Plant | Days to grow |
|---|---|
| Chamomile | 2 |
| Mint | 2 |
| Lavender | 3 |
| Fireroot | 4 |
| Valerian | 4 |
| Rosehip | 5 |
| Sunwort | 6 |

- **Garden AP:** 1 AP covers all of the day's garden work (plant, water, harvest).

## 5. Expeditions (one framework, three skins)
- **Grid:** a grid of bushes or tiles. **Picks are limited by the basket**, not by a timer (cozy).
  - Each tile hides an ingredient or nothing.
  - **Glints** hint at rare nodes.
  - Each run gives 4–8 items. Duration: 60–90 seconds.

| Area | Grid | Opens | Twist |
|---|---|---|---|
| Meadow | 5×5 | Day 3 | Basic. Herb clusters: neighbors of a find are likely to hold the same herb. |
| Whisperwood | 6×6 | Day 7 | **Wandering nodes:** after each pick, one hidden node rustles and moves to an adjacent tile (with a visible tell). Roots need the trowel. |
| Under the Hill | 6×6 | Day 12 (lantern + oil) | **Dark:** only the lantern radius around your last pick is visible. Crystals form veins of adjacent tiles. |

## 6. Riddle keywords (starter glossary)
| Keyword / phrase | Trait (magnitude per the intensity word) |
|---|---|
| can't sleep / restless / tossing all night | Calm |
| nerves / jittery / shaking hands | Calm (+ a little Clarity) |
| foggy head / can't focus / forgetful | Clarity |
| chilled / cold to the bone / frosty morning | Heat |
| aching / sore / stiff back | Vigor (+ Heat in tier 2+) |
| worn out / weak / spring fatigue | Vigor |
| sniffles / stuffy | Clarity + Heat |
| upset stomach / heavy meal | Calm + Vigor |
| "but nothing that keeps me awake" | avoid: Clarity 0, Heat 0 |
| "nothing too fiery" | avoid: Heat 0 |

- **Intensity:** "a little / slightly" = 3; plain = 4–5; "terribly / all week / can't bear it" = 6–7.
- **Bramble** speaks in rhyme and uses synonyms from tier 2 onward ("my hearth is cold, my bones are old" → Heat + Vigor).

## 7. Named recipes (discoverable, v1 starter set)
| Recipe | Profile | Wren's hint (shown on the silhouette) |
|---|---|---|
| Sleepwell Draught | [0,6,0,0] | "Two cups of quiet." |
| Woodsman's Warmer | [4,0,4,0] | "Root for the fire, leaf for the arm." |
| Scholar's Clearwater | [0,3,0,4] | "A calm hand, a clear head." |
| Spring Tonic | [0,0,5,2] | "What the hedge gives in March." |
| Hearthside Tea | [1,4,0,0] (tea) | "Warm the cup, not the tongue." |
| Comfrey-less Balm | [2,0,4,0] (salve) | "For backs that carry the village." |
| **Midsummer Draught** | [5,5,5,5] (5 slots, festival) | "Everything at once, in balance. Sunwort knows how." |

## 8. Festival
- **Bonfire donations** (coin sink; each makes the finale warmer and gets a mention in the ending):

| Element | Linked to | Cost |
|---|---|---|
| Bonfire wood | Pell | 50c |
| Midsummer cakes | Marla | 50c |
| Lantern garlands | Fennick | 50c |
| Hearth blessing | Bramble | 50c |
| Seven-herb wreath | collect 7 different herbs | 0c, a collection goal |

- **The finale request:** Midsummer Draught `[5,5,5,5]` with **tol 2**. It **must contain 1–2 Sunwort**, and **R7 does not apply** ("the Draught demands true balance"). Your best brew of day 20 is judged.
  - Validated (2026-10-07): 17 different 3★ combinations and 199 at 2★ or better, with varied ingredients. See validation.md.
  - Every star rating, including 0★, plays an ending.

## 9. v2 maybe list (do not build in v1)
Lemon balm, mugwort, vervain, yarrow · mortar (grinding) · candles and incense · distiller · moon altar and Arcane · charms · marsh and cliffs · beehive · greenhouse · seasons and moon phases · more regulars.
