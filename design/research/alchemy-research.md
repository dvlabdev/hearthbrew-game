# Alchemy Research: short pass (M0b.1)

**Scope:** the starter ingredients and the first reaction rules only. The full deep research is scheduled before M3 (see roadmap).

> In-game effects are fictional. Nothing here is medical advice. The game never presents real dosages or remedies as instructions.

## 1. Preparation chemistry → game rules
| Real fact | Game rule | Tag |
|---|---|---|
| **Infusion** (steeping in hot, not boiling, water, covered) suits flowers and leaves rich in volatile essential oils, which evaporate if they're boiled or left uncovered. [1][2] | Simmer is the default. Delicate ingredients at Boil lose Calm/Clarity (R1). | 🧪 real |
| **Decoction** (boiling) is needed for roots, bark and rhizomes, where the active compounds are locked in woody tissue. Volatiles matter less there. [1][2] | Tough ingredients at Simmer lose 1 on their main trait (R2). Boil fixes that. | 🧪 real |
| **Drying** lowers essential oil content by roughly 8–50%; hot drying loses the most, gentle air-drying keeps the most. [5] | Dried ingredients never decay but have Clarity −1. The drying rack is "gentle," so the loss stays small. | 🧪 real |
| **Beeswax** binds oil and water in salves, but only up to about a 50/50 ratio; more water separates. [6] | Salves need oil + beeswax. Oil + water without wax becomes *Separated* (R6). | 🧪 real |
| **Salt** preserves by drawing out water (common knowledge). | Salt extends shelf life. ✨ Exaggerated: it also "draws forth" the brew's strongest trait (+1) (R5). | 🧪✨ |
| **Honey** soothes and sweetens harsh preparations (common knowledge). | Honey + a Heat ingredient gives +1 Calm (R4). | 🧪✨ |
| **Peppermint's menthol** gives its cooling sensation. [3] | Mint has a *negative* Heat value: it's the "cancel Heat" tool. | 🧪 real |

## 2. Ingredient anchors
| Ingredient | Traditional association | Game vector [H,C,V,Cl] |
|---|---|---|
| Chamomile | Calming, sleep; a classic infusion flower [1] | [0,3,0,0] delicate |
| Lavender | Calming, relaxing aroma | [0,2,0,1] delicate |
| Lemon balm (v2 candidate) | Mint family; used since the Middle Ages for stress, restlessness and sleep, often combined with chamomile [4] | — (reserved) |
| Peppermint | Cooling (menthol), refreshing, clears the head [3] | [−2,1,0,2] delicate |
| Sage | Folk "clear head", memory | [0,1,0,3] |
| Ginger → **Fireroot** (fictionalized) | Warming, spicy root | [3,0,1,0] tough |
| Nettle | "Jack of all trades" tonic, rich in minerals [3] | [1,0,3,0] |
| Rosehip | Rich in vitamin C; used against colds and spring fatigue [3] | [0,0,2,1] tough |
| Angelica root (forest root) | Warming digestive tonic | [2,0,1,1] tough (reduced from [2,0,2,1]: it was near-dominant) |
| Valerian (forest root) | A classic strong sedative herb, often combined with lemon balm [4] | [0,4,−1,−1] tough |
| St John's wort → **Sunwort** (fictionalized) | Picked on Midsummer Eve for protection and potency [7] | [1,1,1,1] ✨ festival ingredient |

**Why some names are fictionalized:** St John's wort has real drug interactions, so it appears only as the magical "Sunwort" and is never presented as medicine. Fireroot stands in for ginger to give the game its own identity.

## 3. Folklore for the frame
- Herbs gathered on **Midsummer / St John's Eve** were believed to be especially potent. St John's wort was picked before sunrise and passed through the bonfire smoke. [7]
- Midsummer herbs in tradition include vervain, mugwort, rue, yarrow, the rose and trefoil. This is a pool for festival content and v2. [7]
- In Irish tradition, seven protective herbs: St John's wort, vervain, speedwell, eyebright, mallow, yarrow and self-heal. This is an idea for a "seven herbs" festival collection goal. [7]

## 4. Implications for the design
1. Simmer/Boil is grounded in reality and easy to explain in one Notebook line. Keep it.
2. Negative trait values on cooling herbs are real and add depth (subtraction).
3. **Strong single-trait ingredients come with real side-effects:** valerian dulls the mind, glowcap unsettles the nerves. This creates the "cancel the side trait" puzzle.
4. The festival's **Sunwort** grows from the garden and must be harvested by day 19–20. It ties the garden to the story.

## Sources
1. [What are the differences between infusion, maceration and decoction? (Chic des Plantes)](https://www.chicdesplantes.fr/en/blogs/gazette-botanique/quelles-differences-entre-infusion-maceration-et-decoction)
2. [Herbal preparations part 1 (J. Carroll)](https://judsoncarroll.substack.com/p/herbal-preparations-part-1); [How to prepare an effective herbal tea (Soin et Nature)](https://blog.soin-et-nature.com/en/how-to-prepare-an-effective-herbal-tea-infusion-decoction-or-maceration/)
3. [The effect of peppermint and other herbal teas (CSS)](https://www.css.ch/en/private-customers/my-health/nutrition/nutrition-knowledge/peppermint-tea-effect.html); [Peppermint (Indie Lee)](https://indielee.com/blogs/ingredients/peppermint)
4. [Lemon balm (Mount Sinai)](https://mountsinai.org/health-library/herb/lemon-balm); [Lemon balm (Christopher Hobbs)](https://christopherhobbs.com/herbal-therapeutics-database/herb/lemon-balm/)
5. [Effect of drying on essential oils (Journal of Medicinal Plants, 2017)](https://jmp.ir/article-1-1459-en.html)
6. [Is beeswax considered an emulsifier? (Soap Making Forum)](https://soapmakingforum.com/threads/is-beeswax-considered-and-emulsifier.15130); [Use beeswax to make salves and balms (Hobby Farms)](https://hobbyfarms.com/?p=63105)
7. [Midsummer herbs (West Cork People)](https://westcorkpeople.ie/columnists/midsummer-herbs/); [Midsummer's Eve traditions part 2 (Our Merry Folk)](https://ourmerryfolk.substack.com/p/midsummers-eve-traditions-part-2)
