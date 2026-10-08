# Stage 4: Critique & selection

**Status:** critiques complete (2026-10-09) · ⏳ waiting for your ratings and choice (gate 👤).

**Method:**
- 8 screenshots (4 directions × Candlelit/Day, 360px) in `shots/03-*.png`.
- Two independent reviewers, each from the images and the brief:
  - a **game art director** (craft, readability, production);
  - the **game editor** (market, pillars).
- Same weighted rubric for both: brief fit 25%, readability 20%, distinctiveness 20%, cohesion 15%, feasibility 15%, animation 5%.

## Scores (weighted, out of 5)
| Direction | Art director | Editor | **Average** | Rank |
|---|---|---|---|---|
| **Shadow Theatre** | 4.28 | 4.40 | **4.34** | 1 |
| **Cyanotype Herbarium** | 3.93 | 3.50 | **3.72** | 2 |
| **Folk Woodcut / Riso** | 3.33 | 2.75 | **3.04** | 3 |
| **Gilded Herbal** | 2.95 | 2.95 | **2.95** | 4 |

## The "3-second test" (editor)
| Direction | What a stranger would say from one screenshot |
|---|---|
| Shadow Theatre | "A fairy-tale potion game, kind of like a shadow-puppet show." The right genre plus a hook |
| Cyanotype | "A botany or nature-journal app." Botanical, but not witchy |
| Gilded | "An alchemy game", i.e. **Potion Craft in dark mode** |
| Riso | "A cute casual mobile game." No mention of an apothecary |

## Per direction: where both reviewers agree
**Shadow Theatre:**
- **Strengths:**
  - The best silhouettes and readability, the only one recognisable at 48px.
  - The look-alike difference reads instantly.
  - The cauldron against the glow is instant key art.
  - **The cheapest to produce:** one path per asset, no filters.
  - **The backlit sky works as the day clock:** dawn, noon, dusk, night, weather.
  - The Midsummer bonfire is native to the style: "the trailer shot".
- **Weaknesses:**
  - Ingredients lose their colour identity (fireroot survives only as a 4px dot).
  - The same peach sky everywhere becomes wallpaper.
  - Profile-only portraits put pillar 1 at risk (expressions).
  - Possible monotony and coldness over 60 assets.
  - Bugs: the ground strip squares off rounded corners; the flame disappears in the small cauldron slot.

**Cyanotype Herbarium:**
- **Strengths:**
  - The most original of the four; nobody owns this look.
  - Real herbal history.
  - The "no. 12 / no. 13" specimen plates are the best expression of **pillar 2 (discovery)**.
  - The Day tile is the most beautiful single frame of the eight.
- **Weaknesses:**
  - **Cold:** Prussian blue fights the brief's warm candlelight.
  - Portraits read as ghosts.
  - The Calm trait sits on a blue ground.
  - The in-art Latin captions render at 5–7px, illegible, breaking the 16px rule.

**Folk Woodcut / Riso:**
- **Strengths:** bold shapes, a clear look-alike read, a handmade feel.
- **Weaknesses:**
  - Pink and teal on charcoal reads as neon, zine merch, near kawaii; the least witchy.
  - **Pink chamomile is botanically wrong.**
  - Riso is a general design trend, not an identity.
  - It's the most filter-heavy.

**Gilded Herbal:**
- **Strengths:** the most unified tile, precious and candlelit at night.
- **Weaknesses:**
  - A gold primary button with small-caps serifs is the "shiny gold fantasy UI" the brief rules out.
  - The day theme is Potion Craft's territory.
  - Hatching muddies (the cauldron reads as a wire mesh).
  - **The most expensive to produce.**

## The shared recommendation: a hybrid with strict roles
Both reviewers propose essentially the same hybrid. The art director expects it to score about **4.5**:

| Layer | Source | Rule |
|---|---|---|
| **World, shop, customers, ingredients, props** | **Shadow Theatre** | Silhouettes on backlit skies. **The sky is the clock** (dawn, noon, dusk, night, weather; the Midsummer bonfire) |
| **Ingredient identity** | Riso (a touch) | **One lit spot of the ingredient's true colour inside each silhouette** (fireroot's ember, chamomile's yellow eye, a berry), slightly offset |
| **Portraits** | Shadow + one addition | Reiniger profiles (or three-quarter) with a **lit cut-out eye and mouth**, and 2–3 cheap expression variants per regular |
| **Wren's Notebook** | **Cyanotype** | Unlearned entries are a dark silhouette or pale photogram; learning one **"develops" it into a cyanotype specimen plate** ("no. 12"). A visual verb unique to Hearthbrew, stronger than Cozy Grove's colour return. The blue stays confined to the one cool, studious place |
| **Rewards** | Gilded (hairline) | **Gold only for earned things:** the star reveal, coins, the Midsummer Draught |

## Craft fixes required whichever direction wins
1. **Commit the chrome to the style.** Cards, buttons, meter and pills are identical in all four tiles; only the pictures change (Potion Craft's lesson in reverse). For Shadow, that means **cut-paper chrome**: scalloped or torn edges, paper layers held off the backlight with a drop shadow.
2. **Labels and layout:**
   - The truncated "Chamomil" label colliding with the next tile.
   - Captions on different baselines.
   - No in-art text under 16px.
3. **Small-size rules:**
   - At least a 2px rendered stroke at 48px.
   - No hatching, captions or blur below 64px.
   - Test at 40px.
4. **Trait meter, the most-seen widget:**
   - Empty segments under 3:1 contrast.
   - The slashed "0" reads as a "forbidden" sign.
   - It has no style yet.
5. **SVG plumbing:**
   - One global `<defs>` sprite (no duplicate IDs).
   - One shared grain overlay.
   - Clip ground layers to the tile's rounded shape.
6. **Day theme (Shadow):** three distinct skies (dawn pale, noon gold, dusk rose), not a permanent sunset, with text contrast re-checked over gradients.

## Proposed validation spike before Stage 5 (if the hybrid is chosen)
About 8–12 real assets in the hybrid, **each timed against the 30-minute production target**, then shown on your S23:
- 6 ingredients, including **4 similar roots or leaves**, to prove that silhouettes plus a colour spot tell 17 ingredients apart;
- **2 portraits with 2–3 expressions** each (the biggest risk);
- **2 sky phases** plus the morning weather card;
- **1 Notebook entry** with the "develop" transition (silhouette → cyanotype plate);
- the restyled cut-paper chrome (card, button, meter).

**Pass:**
- a "monotony test": all assets together on one screen still feel rich;
- AA contrast over the skies;
- production at 30 minutes or less per asset;
- you rate it at least 4/5.

## Your verdict
*(to be filled in from your copied report)*
