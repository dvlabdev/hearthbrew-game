# Expedition v1: trail choice + event cards (decided 2026-10-07)

**Replaces** the foraging grid (prototype C) and the herb walk (prototype C2). Both failed playtests; see validation.md. **Takes the lessons from both:**
- The morning needs a **goal**: gather for tomorrow's teased customer.
- It needs **readable information**: what a trail yields is shown up front.
- It needs **variety rather than a skill test**. In your words: "only if it's one of many minigames."
- Identification works as a **single quick moment with the difference shown visually**, not as a whole mini-game.

## Flow (the expedition is one of the 3 random morning cards; at most 1 per day)
1. **The trail is fixed by the morning card** (e.g. "Expedition: the Mill Path"). The card shows the **weather of the day** and the likely yield, plus Wren's hint when it suits tomorrow's teased customer. Choosing it over the other two cards is the first decision.
2. **Choose your haul** (added 2026-10-07; your idea, refined by a designer and editor brainstorm). See below. Target: under 30 s.
3. **Draw one event card** from the area's deck. Spot the herb appears at most 1 draw in 4, and never two days running.

## Choose your haul
The trail turns up **8 finds** (10 on rain days), grouped by kind ("Chamomile ×3"). **The basket holds 5 slots.** What you leave behind is gone for today; that's what makes it a choice. Nothing you already own is ever lost.

| Element | Rule |
|---|---|
| **Find tiles** | At most **2 badges**: **value** as a numbered coin ("◉ 2", gold ▲ when prime, grey ▼ when poor) and **rarity** glow. Details on long-press. |
| **Shelf strip** | Your stock with **wilt pips** ("Chamomile 2 · 1 wilts tonight"). As you pick, it updates *stock only* ("1 → 3"). |
| **Tomorrow as a clue** | The teased featured customer as words to interpret ("Marla: *something to quiet the mind*"). **No green ticks**: tomorrow's riddle stays yours to read (pillar 1). |
| **Weather (whole day, random)** | Five weathers. Each changes the finds (count and mix), **quality** (prime kinds give a **double dose** and +1 value; poor kinds −1 value and keep a night less), **rarity**, shelf life, and **which customers come**. Sun: flowers prime, mushrooms poor. Rain: +2 finds, mushrooms prime, flowers poor, wet herbs keep a night less, calm-seekers. Wind: +1 rare, fruit prime. Mist: 7 finds, rares ×2, mushrooms prime, leaves poor, clarity-seekers. Frost: roots prime, leaves poor, herbs keep a night longer, warming-seekers. |
| **Heavy finds** | Roots, quartz and glowcap clusters take **2 slots**. This is the main source of dilemmas: one rare root against two herbs you need. |
| **New specimen** | The first pick of a species fills its sketch in Wren's Notebook; unknown species show a "?" glow (a known gamble, never a hidden tile). |
| **Minimal juice** | Picked finds arc into the basket with a soft thunk. No "covers tomorrow" chime and no "perfect basket" sparkle, because both reveal the answer. |

**Generator rule:** every day at least 6 of the 8 finds are worth taking:
- at least 2 serve tomorrow's clue,
- 1 tops up a shelf item that's wilting,
- 1 is rare or heavy,
- the rest is filler.

**Why these, and what was left out:** a game designer proposed 14 features and an editor reviewed them; you settled the disagreements.
- **Kept:** the set above.
- **Later (v2 list):** bloom calendar, At its peak, pinned special orders, Mark the patch (a future payoff for leftovers), Wren's sets, basket and tool upgrades (only once basket size is tuned).
- **Cut:**
  - "Nothing wasted": it removes the tension.
  - Linger: wait until event cards prove fun.
  - A friend on the path: becomes an Encounter card.
- **Biggest risk (editor):** the haul becomes a solved chore by day 4. It's tested in prototype C3 over 5 days, and by `tools/haul_sim.py`.

## Event cards
| Event type | What happens | Pillar |
|---|---|---|
| **Spot the herb** | Two plants **side by side, with the telling feature circled** (a domed vs flat centre). Choose the useful one to gain a bonus or rare item. A wrong choice brings Wren's explanation over the same highlighted picture, and a field-guide entry. Never a penalty. | 2 |
| **Encounter** | A villager or creature with a small choice: help a stranded traveller (coins, or a relationship tip), follow a will-o'-wisp (a rare find or a pretty dead end), or a villager asking for one specific find. | 3, 4 |
| **Discovery** | A new seed, a page of Wren's notes, a hint about the festival. | 2, 3 |

## Content for v1
- 3 areas × 3 trails = **9 trails**.
- An event deck of about **12 cards**: 5 Spot the herb (chamomile/mayweed, nettle/dead-nettle, mint/ground-ivy, plus 2 forest/cave pairs), 4 Encounters, 3 Discoveries.
- Weighting: no repeat within 3 days; Discoveries follow the story pacing (content-bible §10).

## Decisions it creates
- **Which trail?** A known need for tomorrow vs a chance at a rare find.
- **Which morning card:** the expedition (weather-driven finds and rares, but untended plants pause) vs the garden (steady chosen herbs) vs market, errand or study (coins, relationships, knowledge). The day's random draw changes the answer.
- **Event choices:** small and low-stakes, flavour-rich.

## Validation
No separate prototype: this involves no dexterity or skill, so the risk is low. It's measured in the M1 vertical slice:
- Morning phase time (target 15–40 s).
- Whether you choose trails by need (a log of trail vs featured request).
- Your rating of the morning.

## Moved to the v2 list
A pool of **rotating micro-games** (identifying herbs with a visual comparison, digging roots with timing, catching a wisp), each optional and played at most once per morning. **Lessons from C and C2 to keep:** give a goal up front, show differences visually, a first time must be guided, and avoid a single repeated mini-game.
