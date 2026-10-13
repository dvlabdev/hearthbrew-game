# The morning, playable (interim day loop, 2026-10-12)

> **The target loop is [game-flow.md](game-flow.md)** (approved 2026-10-14). This interim loop (raw herbs served automatically, teased the same morning) is replaced as the sell phase is built.

**Why:**
- It makes the validated morning (`expedition.md`: cards, haul, event) playable on the phone now.
- Brewing, riddles and the Notebook still wait for the prototype B verdict.
- Until then the shop resolves itself with the validated haul rules (`resolveShop`, exactly as prototype C3 and `tools/haul_sim.py` do).

**Pillars:**
- 3, always one more day: a full loop you can repeat;
- 2, discovery: the first pick of a species and Study fill the Notebook;
- 4, gentle stakes: nothing is ever lost, and a wrong Spot the herb only teaches.

## The loop
| Phase | What happens | Code |
|---|---|---|
| **Morning** | The weather card for the day, the customer expected at the shop (as words), and **3 random cards; pick 1** | `startDay`, `chooseCard` |
| **Haul** (expedition only) | Choose your haul, exactly as in `expedition.md` | `applyHaul` |
| **Event** (expedition only) | One card: Spot the herb (never two days running), an Encounter or a Discovery | `resolveEvent` |
| **Shop (interim)** | The expected customer first, then two others, served from the shelf by `resolveShop` | `runShop` |
| **Night** | Wilting (`night`), a recap, then sleep → the next day | `endDay` |

**Interim simplification:** the customer teased in the morning visits **that afternoon**. That is the validated sim's day (`playDay`). The "tomorrow" framing returns when brewing is in the day.

## Morning cards
Three distinct types are drawn by weight, from those eligible today.

| Card | Weight | Effect |
|---|---|---|
| **Expedition: {trail}** | 3 | → the haul and an event. The trail name is flavour in v1 (3 areas × 3 trails) |
| **Tend the garden** | 2 | Harvest each plot (its herb, shaped by the weather: prime/poor via `pickedItem`). Plots regrow |
| **Market day** | 1.5 | Buy one of 3 herbs for its value + 2 coins. **Only offered if you can afford one** |
| **Village errand** | 1.5 | +8 coins and +1 friendship with a regular (who, and why, is flavour text) |
| **Wren's study** | 1 | The Notebook learns the trait of a herb you don't know yet (Wren's line) |

## Events
| Event | Choice | Result |
|---|---|---|
| **Spot the herb** (chamomile vs mayweed) | Tap the plant you want | **Right:** a bonus rare find (lavender) and Wren's nod. **Wrong:** Wren explains over the same picture (the domed centre), with no penalty |
| **Encounter: a stranded traveller** | Share your lunch, or point the way | Share: +1 friendship with a random regular (they hear of it). Point: +3 coins (a tip) |
| **Discovery: a page of Wren's notes** | Read it | The Notebook learns a rule (R1: delicate herbs at a boil) |

## Haul screen (from `expedition.md`)
- Finds grouped by kind.
- **At most 2 badges:** the coin value (▲ prime / ▼ poor) and the rarity glow; heavy finds are tagged "2 slots".
- The basket holds 5 slots; tap a basket slot to put a find back. Leftovers stay behind.
- **The shelf strip:** your stock with wilt pips, updating "→3" as you pick.
- **The clue:** words only, **never ticks**.
- **Long-press a find** for details: kind, how many nights it keeps, value, and its trait **only if the Notebook knows it**.
- The first pick of a species teaches its trait to the Notebook (the "new specimen" rule).
- **Deferred:** the "?" glow on unknown species, and the arc-into-basket animation.

## State and saves
- `GameState.today` holds the day's weather, offer, featured, others, finds, the chosen card, picks, event and results, plus `phase`.
- `lastSpotDay`.
- `log`: phase durations in ms, for the debug panel's haul-time target of under 30 s.
- **Save v2:** the v1 → v2 migration adds these and gives an empty shelf the validated starting stock.

## Debug
- `?debug` shows the phase timers.
- `?debug&day=N&seed=S` starts a seeded game and **bot-plays** to day N (planner picks), to test hauls on days 5 and 10 (roadmap M1).
- **Randomness** comes from named streams seeded by (seed, day, stream name), one per feature: `stream(state, name)` in `src/core/rng.js`, added 2026-10-13.
  - **The streams:** `day.weather`, `day.customers`, `day.finds`, `morning.offer`, `morning.card`, `event.draw`, `event.resolve`, `spot.order`.
  - **Why:** a new draw in one feature never shifts another. A test adds finds and checks that the weather, customers and morning offer stay put.
  - **A new random feature** takes a new stream name.
  - **One-time change:** the switch from numbered steps changed which days a given seed produces. Saved days in progress are unaffected.
  - **Open:** a statistical balance check by bot-play (many seeds × 20 days) is deferred until the game flow is defined (the user's decision).
