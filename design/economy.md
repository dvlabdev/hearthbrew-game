# Economy: M0b.3 (paper model, provisional)

**Goals**
- About one meaningful purchase every 1–2 days.
- No day where nothing is affordable *and* nothing is new.
- Coins stay secondary to knowledge (pillar 2).
- The M2 balance sim (a greedy bot over 20 days) enforces these goals.

## 1. Sources
| Source | Value |
|---|---|
| Sale | base price × star multiplier (0.25 / 0.6 / 1.0 / 1.5) × recipe bonus 1.2 × featured 2 |
| Base prices | potion 10c (×2 bottles), tea 7c (×3 cups), salve 16c (×2 jars) |
| Regular beat gifts | seed, ingredient bundle, or a 20% discount on one upgrade |

**Customers per day:**
| Days | Customers |
|---|---|
| 1–3 | 3 |
| 4–8 | 4 |
| 9–14 | 5 |
| 15–20 | 6 |

## 2. Expected income (an average player, ~2★ average, featured request served)
| Days | Income / day | Cumulative (end of block) |
|---|---|---|
| 1–3 | ~40c | ~120c |
| 4–8 | ~60c | ~420c |
| 9–14 | ~90c (salves) | ~960c |
| 15–20 | ~110c | ~1,620c |

A strong player (~2.6★) earns about +30% (≈2,100c). A weak player (~1.5★) earns about −30% (≈1,130c).

## 3. Sinks
| Category | Total |
|---|---|
| Upgrades and stations (content-bible §3) | ≈1,085c |
| Festival donations | 200c |
| Market (honey, salt, bases, restocks of starter herbs) | ~5–10c / day → ~150c |
| Shop decor (cosmetic, endless sink) | 15–80c per item, about 12 items |

- **Must-haves for the finale:** the 5th cauldron slot (180c) and the Sunwort seed (free) → about 400c of required spending.
- **Weak player:** can still reach the festival with all story-critical items by about day 16. They miss some optional upgrades and donations, which leads to a softer ending, not a failure.
- **Strong player:** buys everything by about day 17, after which decor absorbs the surplus. Endless mode adds decor sets and new request seasons.

## 4. Purchase timeline (an average player)
| Day | Affordable / new | Cumulative coins before buying |
|---|---|---|
| 2 | Garden plot +1 (40c) | 80 |
| 3 | Cauldron 4th slot (60c) | ~80 |
| 5 | Kettle (80c) **or** Drying rack (50c) + Compost (30c) | ~100 |
| 6–7 | The other choice from day 5, Trowel (45c), Basket (70c) | — |
| 9 | Salve pot (120c) | — |
| 10–11 | Cauldron 5th slot (180c) | — |
| 12 | Lantern (100c) | — |
| 13–16 | Plots up to 6, shelf, donations | — |
| 17–20 | Decor, remaining donations | — |

**Day 5 is a deliberate trade-off:** the kettle (more sales) or the drying rack + compost (less waste).

## 5. Checks the M2 sim must assert
1. No day 2–15 without either a new unlock or an affordable purchase.
2. The "average bot" can buy the 5th slot by day 12 and has Sunwort planted by day 13.
3. Coins on hand never exceed 2× the most expensive remaining item before day 15 (no runaway hoarding).
4. The "weak bot" (1.5★) still reaches the finale with the required items.
