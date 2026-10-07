# Expedition v1: trail choice + event cards (decided 2026-10-07)

**Replaces** the foraging grid (prototype C) and the herb walk (prototype C2). Both failed playtests; see validation.md. **Takes the lessons from both:**
- The morning needs a **goal**: gather for tomorrow's teased customer.
- It needs **readable information**: what a trail yields is shown up front.
- It needs **variety rather than a skill test**. In your words: "only if it's one of many minigames."
- Identification works as a **single quick moment with the difference shown visually**, not as a whole mini-game.

## Flow (1 action point, about 15–25 s)
1. **Choose a trail:** three trail cards for each unlocked area.
   - Each card shows its name, a small vignette, and its likely yield (**"Mostly: chamomile, mint · Sometimes: lavender"**).
   - When a trail matches tomorrow's teased featured request, the card carries **Wren's hint** ("Marla will want sleep again. The Mill Path is thick with chamomile.").
2. **Gather:** the basket fills automatically from the trail's table (4–6 items, or 6–8 with a bigger basket). A short pleasant animation shows the items dropping in.
3. **Draw one event card** from the area's deck:

| Event type | What happens | Pillar |
|---|---|---|
| **Spot the herb** | Two plants **side by side, with the telling feature circled** (a domed vs flat centre). Choose the useful one to gain a bonus or rare item. A wrong choice brings Wren's explanation over the same highlighted picture, and a field-guide entry. Never a penalty. | 2 |
| **Encounter** | A villager or creature with a small choice: help a stranded traveller (coins, or a relationship tip), or follow a will-o'-wisp (a rare find or a pretty dead end). | 3, 4 |
| **Discovery** | A new seed, a page of Wren's notes, a hint about the festival. | 2, 3 |

## Content for v1
- 3 areas × 3 trails = **9 trails**.
- An event deck of about **12 cards**: 5 Spot the herb (chamomile/mayweed, nettle/dead-nettle, mint/ground-ivy, plus 2 forest/cave pairs), 4 Encounters, 3 Discoveries.
- Weighting: no repeat within 3 days; Discoveries follow the story pacing (content-bible §10).

## Decisions it creates
- **Which trail?** A known need for tomorrow vs a chance at a rare find.
- **Expedition vs garden vs market:** the action-point trade-off (checked in check 6: expeditions win early, the garden late).
- **Event choices:** small and low-stakes, flavour-rich.

## Validation
No separate prototype: this involves no dexterity or skill, so the risk is low. It's measured in the M1 vertical slice:
- Morning phase time (target 15–40 s).
- Whether you choose trails by need (a log of trail vs featured request).
- Your rating of the morning.

## Moved to the v2 list
A pool of **rotating micro-games** (identifying herbs with a visual comparison, digging roots with timing, catching a wisp), each optional and played at most once per morning. **Lessons from C and C2 to keep:** give a goal up front, show differences visually, a first time must be guided, and avoid a single repeated mini-game.
