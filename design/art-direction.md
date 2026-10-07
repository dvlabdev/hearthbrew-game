# Art Direction (locked 2026-10-07)

- **Decision:** palette **A, Whisperwood Dusk**. The **Candlelit (night) variant is the primary look**, and the Day variant is secondary (morning/explore screens, or following the phone's light mode).
- **Reference:** `prototypes/art-tile.html` (live: https://claude.ai/artifact/Qwj6bgxEiaENJ1G8zedJe7)
- **Rejected:**
  - B, Midnight Indigo.
  - C, Heather & Honey. Interesting, but the user found its day mode too cool; they want warmth.

## Tokens
| Token | Candlelit (primary) | Day | Role |
|---|---|---|---|
| `--bg` | `#111915` | `#E9ECDF` | Ground |
| `--surface` | `#19241D` | `#F6F6EE` | Cards, panels |
| `--sunk` | `#0C120F` | `#DDE2D2` | Wells, empty bars |
| `--ink` | `#EEE7D7` | `#2C1F31` | Text and line art |
| `--muted` | `#A8A597` | `#5D5464` | Secondary text |
| `--moss` | `#86A976` | `#3E5C38` | Nature, plants |
| `--plum` | `#C99BD2` | `#6A3A6D` | Actions, Wren's handwriting |
| `--amber` | `#F0A63A` | `#B86A10` | Coins, fire, stars |
| `--wisp` | `#5FD3C7` | `#1B7F7B` | Magic, focus ring |
| `--iron` / `--iron-hi` | `#0A0C0B` / `#3A3F3B` | `#2A2830` / `#4A4752` | Cauldron |

**Trait colors** (Okabe-Ito based; fixed in every theme, always paired with a shape and a glyph):

| Trait | Shape | Candlelit | Day |
|---|---|---|---|
| Heat | triangle | `#EE7A3C` | `#C4520A` |
| Calm | circle | `#56B4E9` | `#0A6FAE` |
| Vigor | square | `#2BC08E` | `#007F5B` |
| Clarity | diamond | `#E29BC8` | `#A64C89` |

## Type
- **Display:** IM Fell English. Names, titles, the shop sign. Used sparingly.
- **Body:** Atkinson Hyperlegible. All game text, minimum 16px.
- **Notebook:** Kalam. Wren's notes and the player's discoveries.

## Illustration rules
- Flat fills.
- A 1.6–2px ink outline in `--ink`.
- One highlight shape per object.
- No gradients, except the soft glow on magical things (glowcap, wisps).
- Portraits share one construction: a head ellipse, a hair shape, and closed or simple eyes.
- Animation:
  - Simmer is lazy. Boil is a rolling boil: tall flames, a shaking pot, splashes, billowing steam.
  - Every animation has a static fallback for players who prefer reduced motion.
