# Hearthbrew: Game Design Document

**Status:** M0a draft v1. Scope and milestones live in [roadmap.md](roadmap.md); the brewing math is specified in [brew-math.md](brew-math.md).

## 1. One-liner
A cozy, witchy apothecary game. You have 20 days to restore your late mentor's shop at the edge of an enchanted wood. Read each villager's troubles, brew the remedy that fits, and earn the hamlet's trust before Midsummer Eve.

## 2. Setting & tone
- **Place:** **Thornwick**, a small hamlet where the fields meet the **Whisperwood**, an old, half-enchanted forest. The villagers live alongside small magics: hobs in the hearth, will-o'-wisps on the marsh paths, herbs that are said to be stronger at midsummer.
- **Tone:** twilight-cozy. Candlelight, steam, moss and soft rain. It's moody but never scary. Magic is everyday and folk-like, never epic.
- **Folklore hook (real tradition):** across Europe, herbs gathered on Midsummer (St John's) Eve were believed to be the most potent. This is the reason the festival matters to an apothecary.
- **Palette (locked):** Whisperwood Dusk, with Candlelit (night) as the primary look. See [art-direction.md](art-direction.md).
- **Voice:** warm, a little wry. Villagers speak plainly about their troubles, and the mentor's old notes are fond and teasing.

## 3. Frame & story
- **Premise:** your mentor, **Old Mother Wren**, has died and left you the **Hearthbrew apothecary**: a dusty shop, a cold cauldron, two overgrown garden plots and a battered notebook.
  - The hamlet is wary of a newcomer.
  - **Midsummer Eve is 20 days away.** By tradition, the apothecary brews the **Midsummer Draught** for the bonfire.
  - Brew it well and Thornwick accepts you as its new hedge-witch.
- **Chapters:**

| Ch. | Days | Beat | Unlocks |
|---|---|---|---|
| 1 Cold Hearth | 1–3 | Light the cauldron, serve your first neighbors, clear the garden, first walk in the meadow | Brewing, garden, meadow |
| 2 The Shop Reopens | 4–8 | Word spreads, so more customers arrive and freshness matters | Kettle (teas), drying rack, garden tonic |
| 3 Into the Whisperwood | 7–11 | Wren's notes point into the forest | Forest, mortar, salves |
| 4 Under the Hill | 12–15 | A cave where Wren gathered crystals and salt | Lantern oil, cave |
| 5 Midsummer | 16–20 | Gathering the Draught's ingredients, the regulars' final beats, the bonfire | Festival finale |

- **Ending:**
  - The festival is a special "request" built from everything you've learned, judged on your best attempt. Even a 1★ Draught gives an ending, and a better Draught gives a warmer one.
  - Credits follow, then **endless mode**: seasons of village requests and a Notebook still to complete.
- **Wren's Notebook:** the narrative and mechanical spine of the game. Wren's annotations appear next to your discoveries, so you're in dialogue with your mentor.

## 4. Pillars
1. **Read the customer.** Requests are riddles about a situation, with no numbers shown.
2. **Discovery is progression.** The Notebook fills with ingredient knowledge, reaction rules and decoded keywords.
3. **Always one more day.** A featured request, a teaser for tomorrow, and plants still growing.
4. **Cozy, with gentle stakes.** You can miss opportunities, but you never lose progress.

## 5. The day (4 phases)
| Phase | Player time | Decisions | Notes |
|---|---|---|---|
| **1. Explore & Collect** | 2–5 min | Spend **3 action points**: expedition (1 AP: choose a trail + one event card, see expedition.md), garden actions (plant / water / harvest, 1 AP for all garden work in a day), market (free; costs coins) | Expeditions give variety and rare finds. The garden gives reliable supply that grows over days. |
| **2. Prepare & Sell** | 3–7 min | Read 3–6 riddles, choose what to brew and how (heat: simmer or boil), and decide which customer gets which brew | One customer is the **featured request**: double pay plus a reputation bonus |
| **3. Improve** | 30–90 s | Buy upgrades, donate to the festival, review new Notebook entries | |
| **4. Rest** | ~10 s | None | Recap, relationship changes, tomorrow's teaser, autosave |

- **Day 1 is scripted:** only brew and serve, with 3 customers and the starter shelf already stocked.
- **Days 2–3** add the garden and then the meadow.
- **From day 4 on:** at most one new verb per day.

## 6. Characters
**Regulars**
- **Pell**, the woodcutter: big, gruff, often hurt. His requests lean on Heat and Vigor (sore muscles, cold mornings).
  - Arc: he's clearing deadfall for the bonfire.
- **Marla**, the baker: new mother, never sleeps. Her requests lean on Calm, sometimes Vigor.
  - Arc: the baby, and the festival cakes.
- **Fennick**, the apprentice scribe: anxious, studying for the guild exam. His requests lean on Clarity and Calm.
  - Arc: he passes or fails, and either way grows.
- **Bramble**, a hob (hearth spirit) who lives in your chimney: speaks in rhymes, with odd and playful requests that mix traits. Bramble is also the gentle tutorial voice.
  - Arc: Bramble was Wren's friend, and their memories reveal Wren's past.

**Other characters**
- **Walk-ins:** generated villagers (farmer, traveler, child, elder) built from the request templates.
- **Old Mother Wren:** present only through her Notebook notes and her shop.

Regulars have **relationship points**:
- A 3★ brew gives +2, a 2★ brew gives +1.
- 1★ or worse gives +0, and the regular skips the next day.
- Story beats unlock at 3, 7 and 12 points, and each beat gives a gift: a rare seed, a recipe hint, or a discount.
- Points never decrease.

## 7. Systems overview
| System | Pillar | Summary | Spec |
|---|---|---|---|
| Brewing | 1, 2 | Base + ingredients (after processing) + heat setting → trait vector → reaction rules → result | brew-math.md |
| Riddle requests | 1 | Templates with keyword + intensity words → hidden target vector; scored by distance → stars | brew-math.md |
| Notebook | 2 | Ingredient vectors revealed on use, reaction rules logged when triggered, keyword glossary, recipes | brew-math.md §6 |
| Freshness | 4 | Fresh → wilted → spent over days; drying preserves and shifts traits | brew-math.md §4 |
| Garden | 3 | Plots, seeds, multi-day growth, watering, garden tonic | content-bible (M0b) |
| Expeditions | 3 | One search-and-pick grid mini-game, one twist per area | content-bible (M0b) |
| Relationships | 3, 4 | 4 regulars, points that never drop, 3 beats each | this doc §6 |
| Economy & upgrades | 3 | Coins from sales; upgrades, donations, seeds, decor | economy.md (M0b) |
| Festival | 3 | Donations unlock bonfire elements; the final Draught request | content-bible (M0b) |

## 8. Out of scope for v1
See the "v2 maybe" list in roadmap.md. Notably excluded:
- Arcane trait, moon altar, charms
- Distiller
- Marsh and cliffs
- Seasons
- Any combat or fail state
