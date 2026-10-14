# The night: recap, ledger, tomorrow (2026-10-14)

This implements `game-flow.md` decisions **D4** (Improve is a ledger on the night screen) and **D6** (tomorrow's featured customer is teased at night).
- **Pillar 2:** what the Notebook learned today is named.
- **Pillar 3:** the night always points at tomorrow and at something to save up for.
- **Pillar 4:** nothing on the ledger can be lost or wasted.

## Screen order
1. **Recap:** the customers served (happy or tired), the day's takings, what wilted, the shelf.
2. **Ledger:**
   - **Notebook today:** each herb learned today (with its trait) and each rule;
   - **coins on hand;**
   - **Garden & festival:** what can be bought now;
   - **Coming with the brewing bench:** what is unlocked but waits for brewing, greyed with its price;
   - **one line naming the next unlock** ("Next: Kettle on day 4").
3. **Tomorrow at the shop:** the featured customer's portrait and clue.
4. **Sleep.**

## The catalogue (`content.ledger`)
Each item has a name, kind, price, unlock day (`from`), optional `requires`, and **either** `effects` (it works now) **or** `soon` (why it waits). Prices and days come from content-bible §3 and §8 and the economy sim.

**The user's decision (2026-10-14): only what works now can be bought.**

| Works now | Waits for brewing |
|---|---|
| Plots 3–6: 40 / 60 / 90 / 120c, from days 2 / 8 / 11 / 13, each needing the previous one | Cauldron slots 4 and 5, kettle, shelf +6, drying rack, compost bin, trowel, salve pot, lantern |
| Donations: bonfire wood (Pell) and cakes (Marla) from day 14; garlands (Fennick) and hearth blessing (Bramble) from day 15; 50c each. Recorded for the finale | |

Decor (from day 8) waits for its art.

**Rules:**
- Items unlock on their day.
- Each is bought once.
- An item that `requires` another waits for it.
- You can't spend more than you have.

## Plots and seeds
- **The garden is real plots.** The game starts with 2 plots planted with **chamomile** and **mint** (`content.start.garden`). The garden card (`harvestGarden`) harvests every planted plot, in order. With the starting plots that's the same chamomile + mint as before.
- **Buying a plot asks which seed to plant** (the user's decision). The choices are the herbs that can grow in a garden (an ingredient with `grow` and a forage facet) **and** that you already grow or your Notebook knows. That's always at least chamomile and mint.
- **Interim:** a plot harvests every time you tend the garden. Growth days, watering and the 3-day regrowth (content-bible §4) come with the garden's own pass.

## Donations
A donation is recorded in `state.donations` (the regular it's linked to). The finale reads it; until then, the ledger shows what has been given.

## Tomorrow's teaser
`tomorrow(state)` runs the day generator for **day + 1** with tomorrow's weather and customer streams.
- **Why it's exact:** the featured customer doesn't depend on the shelf, so the teaser is exactly who `startDay` produces tomorrow. Nothing is stored.
- **Next morning:** the morning screen shows the same customer again as "At the shop this afternoon".

## Code
- **Buying:** `src/core/ledger.js` (`available`, `buy`, `seedChoices`).
- **Day loop:** the `buy` action in `ACTIONS` (night only; it **stays** in the night phase) and `tomorrow()` in `src/core/day.js`.
- **Notebook record:** `today.learned` lists `herb:<id>` / `rule:<id>` entries, filled wherever the Notebook learns.
- **Screen:** `src/ui/screens/shop.js` → `nightRecap`.
- **Save v4:** plots get their plants, and `donations` is added.
