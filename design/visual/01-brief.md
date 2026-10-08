# Hearthbrew: Visual Design Brief (Stage 1)

**Status:** draft for approval · 2026-10-09 · the design lead (Claude), for the user/product owner.

## 1. The product in one sentence
A cozy, witchy apothecary game for phones: you read your neighbours' troubles, gather herbs and brew the remedy that fits, one short day at a time, until Midsummer Eve.

## 2. Audience and context of use
| | |
|---|---|
| **Players** | Adults who enjoy cozy and management games (Stardew, Potion Craft, Spiritfarer). Curious and patient, they read; they aren't twitch players |
| **Device** | Phone, portrait, **360 × 780 CSS px** (Samsung S23 is the reference), touch, often **one-handed** |
| **Where** | In the browser or inside the Claude app, on short breaks and in the evening |
| **Session** | 5–15 minutes per in-game day; must be readable at a glance and resumable mid-day |
| **Light** | Often evening and indoor. **Candlelit (dark) is the primary theme**, Day secondary (your earlier choice) |

## 3. Experience goals: tone
| It **is** | It **isn't** |
|---|---|
| Witchy, with folk magic and old craft | Horror, gore, edgy occult |
| Warm: candlelight, steam, home | Saccharine or kawaii, pastel-cute |
| Herbal and handmade: you can feel the material | Generic fantasy RPG (shiny gold UI, swords) |
| Curious: worth looking at closely | Corporate flat UI, neon, gradients |
| Calm, with gentle feedback | Noisy, flashing, punishing (no harsh red failure states) |

## 4. Pillars → what the visuals must do
| Pillar | Visual implication |
|---|---|
| 1. Read the customer | **Expressive portraits** and **text-forward riddle cards**. Typography must carry personality *and* stay easy to read |
| 2. Discovery is progression | **Wren's Notebook** as a tactile object: handwriting, sketches that fill in as you learn. Unknowns look *intriguing*, not missing |
| 3. Always one more day | A clear **day rhythm** through light and colour: morning, shop, evening, night. Weather is visible at a glance |
| 4. Cozy, gentle stakes | Soft feedback. A poor result looks *wistful*, never alarming. Rewards (stars, coins, a decoded word) feel crafted |

## 5. Signature moments (the screenshots people remember)
1. **The cauldron:** a lazy simmer vs a rolling boil, and the liquid's colour shifting as ingredients go in.
2. **Dropping an ingredient into the pot.**
3. **The star reveal** after serving.
4. **Wren's handwritten notes** appearing in the Notebook.
5. **The morning weather card.**
6. **Midsummer:** the bonfire and the Draught (the finale).

## 6. Functional requirements (non-negotiable)
- **Legibility at 360px;** body text **at least 16px**; tap targets **at least 44px**.
- **WCAG AA contrast:** at least 4.5:1 for text and 3:1 for UI and graphics, in **both** themes.
- **Traits:** always colour **+ shape + glyph**, distinguishable in greyscale and under protan, deutan and tritan simulation.
- **Visual differences that carry gameplay** (look-alike plants, prime/poor quality) must be **visible**, not only written. This is a lesson from the herb-walk prototype.
- **Numbers that matter look like what they are:** a coin with a number, not abstract dots (a lesson from the haul prototype).
- **Reduced motion:** every animation has a static equivalent.
- **One-handed use:** primary actions in the lower half (thumb zone).

## 7. Content inventory (what the style must scale to)
| Category | Count (v1) |
|---|---|
| Ingredients | 17 (+ 4 bases) |
| Look-alike plants (Spot the herb) | 6 |
| Portraits | 6 (4 regulars, a traveller, Wren in sketches) |
| Props and stations | cauldron, kettle, drying rack, salve pot, shelf, garden plot |
| Weather icons | 5 |
| Trait badges | 4 |
| UI components | about 15 (buttons, cards, meter, slots, sheets, toggles, toasts…) |
| Backgrounds / phases | 4 times of day + 3 areas (meadow, Whisperwood, Under the Hill) |
| **Total** | **about 60 illustrated items + the UI kit** |

## 8. Production constraints
- **Code-generated only:** SVG and CSS, written by Claude. No painted raster art, no 3D, no external asset packs.
- **Cost target:** one new ingredient asset should take **≤ 30 minutes** to produce in the chosen style, or 60 items won't get made.
- **Performance:** idle animation should run smoothly on a mid-range phone. Heavy SVG filters (turbulence, displacement) limited to a few elements at a time, and cached.
- **Fonts:** at most **3 Google Fonts families**; body text stays a high-legibility face.
- **Everything goes through the art registry** (`src/art/registry.js`), so the style stays swappable.

## 9. Lessons carried forward
- **From art-direction v1:** you liked the **Candlelit** mood and the warm-dark palette, but found the overall look "not interesting enough". Palettes that are too close to each other confused you.
- **From the prototypes:**
  - Visible differences beat text descriptions.
  - Number badges beat dots.
  - Strong, clear trait shapes worked.
  - The side-by-side, circled comparison in Spot the herb was understood immediately.

## 10. Success criteria for the final look
1. **Recognisable in 3 seconds:** a stranger shown one screenshot says "witchy apothecary / potion shop".
2. **Distinct:** not mistaken for Potion Craft, Wytchwood or Strange Horticulture.
3. **Accessible:** passes every automated contrast and CVD check (section 6).
4. **Cohesive:** every asset follows written illustration rules (stroke, palette, light, texture).
5. **Feasible:** the cost target in section 8 holds when tested on real assets.
6. **Loved:** you rate the chosen direction **4/5 or higher** on your phone.

## 11. Out of scope
3D, painted or raster illustration, rigged character animation, voice acting, localisation of art text.

## 12. Process and sign-off points
1. **Brief** 👤 (this document)
2. Research and technique study
3. Four style tiles
4. Critique and selection 👤
5. Design system
6. Key screens 👤
7. Production rollout
