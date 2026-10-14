# Game flow: the day and the 20 days (v1, approved 2026-10-14)

> **Status: approved 2026-10-14.** The user settled decisions **D1–D8** (§9); all eight went to the recommended option. This document is now **the single source of truth for the loop**: what happens, in what order, and why. It reconciles `GDD.md` §5, `roadmap.md`, `content-bible.md` §10, `economy.md`, `expedition.md` and `brew-math.md` with what is built (`design/morning.md`, `src/core/day.js`). Where it differs from an older doc, this one wins, and that doc carries a pointer here.
>
> Review page (phone-friendly): https://claude.ai/artifact/1wQfkBJeAaJ3MQB5hHzQCj

## 1. Design vs build: the gaps
| Part of the loop | Design says (source) | Build does (code) | Status |
|---|---|---|---|
| Phases of a day | Morning → Prepare & Sell → Improve → Rest (GDD §5) | Morning → haul → event → interim shop → night (`day.js` PHASES) | **Drifted:** no brewing, no Improve |
| Morning | 1 of 3 random cards; expedition = trail → haul → event (expedition.md) | Same, data-driven (`content.morning`, effects) | ✅ consistent |
| **How herbs become remedies** | Herbs are brewing ingredients; customers are served brews (brew-math §5, content-bible §1) | **Customers are served raw herbs** by trait and units (`resolveShop`: the C3 prototype stand-in) | **Drifted:** the core link is missing |
| **What a picked herb is worth** | Haul tiles show a coin value (expedition.md) | Value pays out directly at the shop (`HAUL.pay` + herb value) | **Decided (D3):** coin value is dropped; tiles show the known trait; prime = 2 items |
| Sell phase | Read 3–6 riddles, brew (Simmer/Boil), decide who gets which bottle; batches of 2–3 (GDD §5, content-bible §1) | Not built. Prototype B: one customer at a time, unlimited ingredients | **Decided (D2):** one at a time, queue visible, spares to the shelf |
| Customers per day | 3 → 4 → 5 → 6 by day ranges (economy §1) | Always 3 (featured + 2) | **Drifted** |
| Featured request | Teased the night before; the morning gathers for it; ×2 pay, +1 relationship (expedition.md, brew-math §5) | Teased in the morning, served the same afternoon (morning.md interim note) | **Drifted; decided (D6):** teased the night before |
| Riddles and tiers | Tier 1 days 1–4, tier 2 days 5–12, tier 3 days 13+ (brew-math §5) | Clue phrases only, no riddles | Not built (waits for the B verdict) |
| The regulars | **Pell, Marla, Fennick, Bramble** (GDD §6, content-bible §6 and §8) | Pell, Marla, Fennick, **Old Tamsin** (from prototypes B and C3) | **Drifted; decided (D1):** Bramble is the 4th regular, Tamsin a walk-in. Direction 1 had removed `bramble` from the starting friendships; the regulars fix restores it |
| Relationships | 3★ +2, 2★ +1, 1★ or less: skips tomorrow; beats at 3, 7 and 12 points (GDD §6) | +1 for serving the featured customer; +1 from errands and encounters | Partly built |
| Improve | Upgrades, donations, decor, Notebook review; 30–90 s (GDD §5, economy §3) | Not built | **Decided (D4):** a ledger section on the night screen |
| Rest | Recap, relationships, tomorrow's teaser, autosave (GDD §5) | Night recap, wilting, sleep, autosave on every step | Mostly ✅ (teaser missing) |
| Day 1 | Scripted: Wren's letter, Bramble, 3 customers, stocked shelf, no morning (quality-review storyboard) | Day 1 is a normal random morning | **Drifted; decided (D5):** scripted |
| Unlock pacing | Garden day 2, meadow day 3, kettle day 4 … cave day 13, festival day 14 (content-bible §10) | Everything is available from day 1 | **Drifted; decided (D7):** paced |
| Freshness | Fresh → wilted (−1 every trait) → spent; drying rack (brew-math §4) | Nights left only; wilted items leave the shelf | Partly built |
| Finale | Midsummer Draught on day 20, best brew judged; every star count plays an ending; then endless mode (GDD §3, content-bible §8) | Day 20 shows "the festival arrives in a later build" | Not built |
| Balance check | Economy sim checks 1–4 (economy §5) | Python checks frozen; JS economy sim runs | **Decided (D8):** bot-play after the sell phase is built |

## 2. One day (target 5–15 minutes; quality-review check 7)
| # | Phase | Player does | Time | Screen |
|---|---|---|---|---|
| 1 | **Morning** | Sees the weather and *today's* featured customer (teased last night). Chooses 1 of 3 cards | 5 s | Morning ✅ built |
| 1a | ↳ Haul + event (expedition only) | Fills the basket (5 slots), then one event card | 30–45 s | Haul ✅, Event ✅ |
| 2 | **Prepare & Sell** | Customers arrive with riddles. For each: pick ingredients from the shelf, Simmer/Boil, brew, serve. Extra bottles from a batch go to the shelf | 3–6 min | Brewing bench + counter (to build) |
| 3 | **Rest, with the ledger** (D4) | Recap (takings, relationships, what was learned), wilting; then the **ledger**: upgrades and stations, festival donations, new Notebook entries; **tomorrow's teaser**; sleep | 40–100 s | Night ✅ (needs the ledger and the teaser) |

Improve is not its own phase (D4): it lives on the night screen, so a day has three screens after the morning (haul and event aside). The phase table in code (`PHASES`) grows from `morning → haul → event → shop → night` to `morning → haul → event → sell → night`.

## 3. The core link: herbs → brews → customers
- **Decided (D3):** a herb on the shelf is **one brewing ingredient**. Brewing uses one shelf item per cauldron slot, and the brew yields a batch (potion 2 bottles, tea 3 cups, salve 2 jars). Customers are served bottles, never raw herbs. The interim `resolveShop` goes away.
- **What the haul's numbers become (D3):**
  - **Coin value:** dropped from find tiles. Coins come only from sales (economy §1). Instead, a tile shows the herb's trait (colour + shape + glyph) **once the Notebook knows it**, and "?" before then (pillar 2).
  - **Prime ("double dose"):** gives **2 shelf items** instead of 1.
  - **Poor:** keeps a night less.
  - **Rarity and heavy (2 slots):** unchanged.
- **Consequence:** the haul's validated tuning (C3, `haul_sim`) measured value-based serving. With brewing, "is this a good haul" means "can I brew what today's customers need from it". The deferred bot-play (§8) is where that gets re-validated.

## 4. The sell phase (D2)
- **Decided (D2): one customer at a time, with the queue visible.**
  - A strip shows today's customers (portraits; the featured one marked).
  - The first riddle is open, and you brew and serve them in order, as in prototype B, the design that was blind-tested.
  - **Batches matter:** a potion makes 2 bottles. The spare goes to the shelf and can be **served to a later customer** whose need it fits, or kept for tomorrow (it ages like herbs). That's the "precision vs efficiency" choice from content-bible §1, without an assignment puzzle.
  - **You can always serve:** if nothing fits, serving a weak brew still pays something (0.25×) and costs no progress. A customer served 1★ or less skips tomorrow (GDD §6). Nobody is ever lost.
- **The featured request:** ×2 pay and +1 relationship (brew-math §5). It's always the first customer of the day.

## 5. The 20-day arc (content-bible §10, economy §1, brew-math §5)
| Days | Chapter | New (one verb at most from day 4) | Customers / day | Riddle tier |
|---|---|---|---|---|
| 1 | 1 Cold Hearth | Brewing, serving (scripted) | 3 | 1 |
| 2 | | Garden | 3 | 1 |
| 3 | | Morning cards begin (meadow expedition, market, errand, study) | 3 | 1 |
| 4 | 2 The Shop Reopens | Kettle → teas | 4 | 1 |
| 5 | | Drying rack, freshness, garden tonic | 4 | 2 |
| 6 | | Marla's first beat, lavender seed | 4 | 2 |
| 7 | 3 Into the Whisperwood | Whisperwood expedition, trowel | 4 | 2 |
| 8 | | Bramble's rhyme requests, Wren's letter, decor shop | 4 | 2 |
| 9 | | Salve pot → salves | 5 | 2 |
| 10 | | 5th cauldron slot on sale | 5 | 2 |
| 11 | | Glowcap night-bloom | 5 | 2 |
| 12 | 4 Under the Hill | Sunwort seed, lantern | 5 | 2 |
| 13 | | The cave | 5 | 3 |
| 14 | | Festival announced, donations | 5 | 3 |
| 15–19 | 5 Midsummer | Preparations, the regulars' final beats, Sunwort harvest | 6 | 3 |
| 20 | | **Midsummer Eve:** the Draught | — | finale |

Regular story beats unlock at 3, 7 and 12 relationship points, and each beat gives a gift (GDD §6).

## 6. Day 1 (scripted, D5; quality-review storyboard)
1. Wren's letter, then "Light the hearth".
2. Bramble in the chimney (2 rhyming lines).
3. Marla's riddle; the Notebook pulses ("The four traits").
4. The brewing bench with a stocked shelf: chamomile ×2, simmer, serve. **First sale under 90 s.**
5. Pell: fireroot on simmer shows the loss, then Boil (rule R2).
6. Fennick: a quick win.
7. The night ledger shows the 4th slot, locked.
8. Rest teases tomorrow's customer and the garden.

There's no morning card on day 1. Day 2's morning offers the garden.

## 7. Finale and endless mode (GDD §3, content-bible §8)
- **Day 20:** the Midsummer Draught request `[5,5,5,5]`, tol 2, which must contain 1–2 Sunwort and doesn't get R7. The best brew of the day is judged. Every star count, including 0★, plays an ending; donations and regulars' beats make it warmer.
- **Then endless mode:** new request seasons, the Notebook still to complete, decor as the coin sink.

## 8. The balance bot-play (D8: after the sell phase; defined here)
Once the sell phase is built, a headless bot plays **many seeds × 20 days** through `dispatch()` with simple policies (cautious, average, greedy). It reports:
- **Economy:** coins per day against economy §2, and the 4 checks of economy §5 (no dead day, 5th slot by day 12, no hoarding, the weak bot reaches the finale).
- **Haul:** how often the shelf can make a 2★+ brew for each customer, by day and tier. Once herbs are ingredients, this replaces C3's value measure.
- **Pacing:** each day has something new or affordable, and customers per day match §5.
- **Gentle stakes:** no run gets stuck (it can always serve, and always reach day 20).

## 9. Decisions (settled by the user, 2026-10-14)
All eight went to the recommended option. The alternative is kept for the record.

| # | Decision | **Chosen** | Not chosen |
|---|---|---|---|
| D1 | The 4th regular | **Bramble** (as the GDD says: hob, tutorial voice, rhymes); Old Tamsin becomes a walk-in | Keep Tamsin as a regular and drop Bramble |
| D2 | Sell phase | **One customer at a time, queue visible, spare bottles on the shelf** | All riddles read up front, then assign bottles |
| D3 | Herb value on the haul | **Drop coin value; tiles show the known trait; prime = 2 items** | Keep coin value (e.g. as a sell-back price at the market) |
| D4 | Improve | **Folded into the night screen** (a "ledger" section before Sleep: fewer screens, same choices) | Its own phase and screen, as in the GDD |
| D5 | Day 1 | **Scripted, as designed** | A normal random morning from day 1 |
| D6 | Teaser timing | **Teased at night for tomorrow** (as designed); the morning shows it again | Keep "teased in the morning, served the same afternoon" |
| D7 | Unlock pacing | **As content-bible §10** (garden day 2, cards day 3, one verb a day from day 4) | Everything available from day 1 |
| D8 | When the bot-play runs | **After the sell phase is built** (it needs brewing to measure anything) | Earlier, on the interim loop |

## 9b. Regulars and walk-ins (D1, built 2026-10-14)
- **Regulars:** Marla, Pell, Fennick and **Bramble**. They have relationship points (never decreasing), story beats and festival donations. A customer in content has `regular: true`.
- **Walk-ins:** villagers without relationships, e.g. **Old Tamsin** the farmer (`regular: false`). Generated walk-ins from templates come with riddles (GDD §6).
- **When a customer starts visiting:** `firstDay` (default 1). **Bramble's requests start on day 8** (content-bible §10); Bramble is the tutorial voice before that (D5, not built yet). The customer pool for day N is everyone with `firstDay ≤ N`, in content order. The sims use day 1's pool, so their validated numbers don't change.
- **Relationships:** only for regulars. Serving the featured customer adds +1 only when they are a regular. A "friend" effect picks among the regulars.
- **Saves:** content changes, not schema. `repairIds()` rebuilds relationships over the regulars on load: Bramble returns (at 0, or with the points of a v2 save), and Tamsin's entry is dropped.

## 10. Next build steps (each has a gate)
1. ✅ **Regulars fix (D1):** done 2026-10-14 (§9b).
2. **The sell phase and brewing bench** (§3–4): needs the **prototype B verdict** (the riddle and Notebook design).
3. **The night ledger and tomorrow's teaser** (D4, D6).
4. **Day 1 script and unlock pacing** (D5, D7).
5. **Balance bot-play** (§8).
6. **Art production** for the new screens and characters: needs the **Hearthlight spike rating**.
