# Stage 2: Research & visual audit

**Status:** complete, 2026-10-09. Gate: ✅ techniques render at 360px; the four directions differ clearly. Phone performance is to be confirmed on the S23 with the study's stress test.

## 1. Competitive audit
| Game | Signature look | What makes it recognisable | Phone risks and lessons |
|---|---|---|---|
| **Potion Craft** | Etching/woodcut black linework on aged sepia with pops of colour; manuscript borders, a period typeface ([CGM](https://www.cgmagonline.com/review/game/potion-craft-alchemist-simulator-pc-mini-review), [TechRaptor](https://techraptor.net:443/gaming/reviews/potion-craft-alchemist-simulator-review)) | Total commitment: the UI, fonts and art all share one medieval-book language | Owns "engraving on parchment". **Lesson:** commit the whole UI to the style, not just the illustrations |
| **Wytchwood** | Storybook gouache; flat inked "paper-doll" characters over painted backgrounds; burnt orange, forest green, ink blue; inspired by Mary Blair and Eyvind Earle ([UAT](https://blog.uat.edu/analyzing-the-art-style-of-wytchwood), [Push Square](https://pushsquare.com/news/2021/08/bewitching_fairytales_feature_in_gothic_ps5_ps4_indie_wytchwood)) | Flatness, mid-century palette | Owns "storybook paper" |
| **Strange Horticulture** | Victorian botanical illustration in a dark, muted palette, with bright plants as accents ([Wikipedia](https://en.wikipedia.org/wiki/Strange_Horticulture)) | Dark room, glowing specimens | **Plants and text too tiny; cursive hard to read** ([Way Too Many Games](https://waytoomany.games/2022/08/03/review-strange-horticulture/)). **Lesson:** no detail-dependent gameplay at small sizes; handwriting only short and large |
| **Spiritfarer** | Hand-drawn watercolour-like art, warm and safe ([Gamereactor](https://www.gamereactor.eu/spiritfarer-review/)) | **Silhouettes recognisable "across a room"** | **Lesson:** every character and ingredient needs a distinctive silhouette |
| **Cozy Grove** | A pencil-line world, watercolour colour **returns as a reward** ([GameCritics](https://gamecritics.com/cody-bolster/cozy-grove-review/)) | Colour as progression | **Idea to borrow:** undiscovered Notebook entries as uncoloured sketches that gain colour when learned (pillar 2) |

## 2. Craft references and repositioned directions
Three of the four original directions sat next to a competitor (engraving → Potion Craft, paper-cut → Wytchwood, watercolour → Spiritfarer/Cozy Grove). They have been repositioned to stay distinct:

| Direction | Craft reference | Distinct because | Native fit |
|---|---|---|---|
| **1. Gilded Herbal** | Gilded apothecary jars, illuminated manuscripts, banknote engraving | Gold engraving **on ink-dark**, the inverse of Potion Craft's black on sepia | Candlelit theme, the luxury of a rare apothecary |
| **2. Shadow Theatre** | **Lotte Reiniger's** cut-paper silhouette films (*Prince Achmed*, 1926), shadow puppetry ([ACMI](https://www.acmi.net.au/stories-and-ideas/lasting-legacy-lotte-reiniger/)) | Black silhouettes against glowing backlit skies; no cozy game owns this | Fairy tale, Midsummer bonfire light, strong silhouettes |
| **3. Cyanotype Herbarium** | **Anna Atkins**, *Photographs of British Algae: Cyanotype Impressions* (1843): the first book illustrated with photographs, made by a botanist ([Public Domain Review](https://publicdomainreview.org/collections/cyanotypes-of-british-algae-by-anna-atkins-1843/), [Wikipedia](https://en.wikipedia.org/wiki/Anna_Atkins)) | Prussian blue world, pale photogram plants; unseen in games | Real herbal history, a calm night-blue mood |
| **4. Folk Woodcut / Riso** | Folk herbal woodcuts, English wood engraving and linocut; risograph zines (spot inks, misregistration, grain) ([Morphic](https://morphic.com/resources/images/risograph-illustration-image)) | Bold, playful printmaking; spot inks rarely used in cozy games | Handmade, warm, cheerful |

**Dropped:** ink & watercolour (too close to Spiritfarer/Cozy Grove). Its technique, hand-drawn wobble, is kept as a tool any direction can use.

## 3. Technique study
**Page:** `prototypes/technique-study.html`. One subject (a chamomile sprig) at 128 / 64 / 40 px. Screenshot: `shots/02-technique-study.png`.

| Technique | Core SVG | Result at 360px | Small-size (40px) legibility | Cost to produce one asset |
|---|---|---|---|---|
| Gilded | `<pattern>` hatching and stipple clipped to shapes, a gold gradient stroke | Elegant, unusual | ⚠️ hatching muddies; needs a simplified "seal" variant | Medium: each shape needs fill + hatch + outline |
| Shadow | Solid silhouette, a radial backlight | Strongest presence; most iconic | ✅ excellent | **Low:** one silhouette per asset |
| Cyanotype | Translucent stacked whites, a slight blur, a grain overlay | Soft, beautiful, calm | ✅ good | Low to medium |
| Riso | Offset multiply ink layers, `feTurbulence` grain, `feDisplacementMap` wobble | Cheerful, tactile | ✅ good | Medium: 2–3 ink layers per asset |

**Performance (measured on the S23 with the study's stress-test buttons; numbers to be logged):** displacement and turbulence filters (riso wobble, grain) are the costly ones. **Rule:** filters only on static layers or backgrounds, never on animated elements; grain as one shared overlay.

## 4. Carry into Stage 3 (style tiles)
- Each tile must show the **look-alike pair** (chamomile vs mayweed) to prove that gameplay differences stay visible in the style.
- Each direction needs a **colour plan for the trait badges** that holds up against its ground: cyanotype (blue ground) and shadow (dark silhouettes) are the hardest.
- Handwriting only for short notes, at 18px or more.
