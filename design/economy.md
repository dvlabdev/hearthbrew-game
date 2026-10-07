# Economy: M0b.3, validated by simulation in M0c

> **Validated 2026-10-07** with `python tools/economy_sim.py` (300 seeded runs per bot). The first run showed the paper numbers were about 2× too optimistic. Changes:
> - Prices raised to **potion 15, tea 10, salve 24**.
> - **Customers only ask for goods your stations can make.**
> - Bots save up for story-critical items.
> - **Decor shop opens day 8.**
> - Story beats fill days 6, 8, 11 and 14.
>
> Results:
>
> | Bot | Coins earned over 20 days | 5th slot bought (median) | Has every finale item |
> |---|---|---|---|
> | Weak (1.5★) | 1,343 | day 13 | 100% |
> | Average | 1,694 | day 12 | 100% |
> | Strong | 2,191 | day 10 | 100% |
>
> All 4 checks in §5 pass. The strong player ends with spare coins (~360), which the endless mode absorbs.


**Goals**
- About one meaningful purchase every 1–2 days.
- No day where nothing is affordable *and* nothing is new.
- Coins stay secondary to knowledge (pillar 2).
- The M2 balance sim (a greedy bot over 20 days) enforces these goals.

## 1. Sources
| Source | Value |
|---|---|
| Sale | base price × star multiplier (0.25 / 0.6 / 1.0 / 1.5) × recipe bonus 1.2 × featured 2 |
| Base prices | potion **15c** (×2 bottles), tea **10c** (×3 cups), salve **24c** (×2 jars) |
| Regular beat gifts | seed, ingredient bundle, or a 20% discount on one upgrade |

**Customers per day:**
| Days | Customers |
|---|---|
| 1–3 | 3 |
| 4–8 | 4 |
| 9–14 | 5 |
| 15–20 | 6 |

## 2. Income (from `tools/economy_sim.py`, median of 300 runs)
| Days | Average player income / day |
|---|---|
| 1–3 | ~56–62c |
| 4–8 | ~64–72c |
| 9–14 | ~80–93c (salves) |
| 15–20 | ~106–110c |

Totals over 20 days: weak 1,343c · average 1,694c · strong 2,191c.

## 3. Sinks
| Category | Total |
|---|---|
| Upgrades and stations (content-bible §3) | ≈1,085c |
| Festival donations | 200c |
| Market (honey, salt, bases, restocks of starter herbs) | ~5–10c / day → ~150c |
| Shop decor (cosmetic, endless sink) | 15–80c per item, about 12 items |

- **Must-haves for the finale:** the 5th cauldron slot (180c) and the Sunwort seed (free) → about 400c of required spending.
- **Weak player:** can still reach the festival with all story-critical items by about day 13 (sim median for the 5th slot). They miss some optional upgrades and donations, which leads to a softer ending, not a failure.
- **Strong player:** buys everything by about day 17, after which decor absorbs the surplus. Endless mode adds decor sets and new request seasons.

## 4. Purchase timeline (an average player)
| Day | Affordable / new | Cumulative coins before buying |
|---|---|---|
| 2 | Garden plot +1 (40c) | 80 |
| 3 | Cauldron 4th slot (60c) | ~80 |
| 4–5 | Kettle (80c) on day 4, then Drying rack (50c) + Compost (30c) | — |
| 6–7 | Trowel (45c), 4th plot | — |
| 9 | Salve pot (120c) | — |
| 10–11 | Cauldron 5th slot (180c) | — |
| 12 | Lantern (100c) | — |
| 13–16 | Plots up to 6, shelf, donations | — |
| 17–20 | Decor, remaining donations | — |

**Day 4–5 trade-off:** the kettle (more sales) or the drying rack + compost (less waste) first.

## 5. Checks the M2 sim must assert
1. No day 2–15 without either a new unlock or an affordable purchase.
2. The "average bot" can buy the 5th slot by day 12 and has Sunwort planted by day 13.
3. Coins on hand never exceed 2× the most expensive remaining item before day 15 (no runaway hoarding).
4. The "weak bot" (1.5★) still reaches the finale with the required items.
