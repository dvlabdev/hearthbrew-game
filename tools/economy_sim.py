"""20-day economy simulation (M0c check 6). Numbers from design/economy.md + content-bible.md.

Three bots (weak / average / strong brewer) play 20 days, 300 seeded runs each.
Each evening a bot buys unlocked upgrades in priority order while it can afford them.
Prints the median day-by-day table for the average bot, then the economy.md section 5 checks.
"""
import random, statistics as st

DAYS = 20
CUSTOMERS = {d: 3 if d <= 3 else 4 if d <= 8 else 5 if d <= 14 else 6 for d in range(1, DAYS + 1)}
STAR_MULT = [0.25, 0.6, 1.0, 1.5]
BOTS = {  # probability of 0/1/2/3 stars per customer
    'weak':    [0.10, 0.35, 0.45, 0.10],
    'average': [0.05, 0.20, 0.45, 0.30],
    'strong':  [0.00, 0.05, 0.30, 0.65],
}
PRICE = {'potion': 15, 'tea': 10, 'salve': 24}  # raised from 10/7/16 after the first sim run (income was half the plan)
MARKET_PER_DAY = 6  # honey, salt, bases, restocks

# (name, price, unlock day, story_critical)
UPGRADES = [
    ('plot 3', 40, 2, False), ('cauldron slot 4', 60, 3, True), ('kettle', 80, 4, True),
    ('drying rack', 50, 5, False), ('compost bin', 30, 5, False), ('basket +2', 70, 6, False),
    ('trowel', 45, 7, False), ('salve pot', 120, 9, True), ('cauldron slot 5', 180, 10, True),
    ('lantern', 100, 12, False), ('plot 4', 60, 8, False), ('shelf +6', 40, 4, False),
    ('plot 5', 90, 11, False), ('plot 6', 120, 13, False),
    ('donation: bonfire wood', 50, 14, False), ('donation: cakes', 50, 14, False),
    ('donation: garlands', 50, 15, False), ('donation: hearth blessing', 50, 15, False),
]
# purchase priority: story-critical first as they unlock, then the rest in list order
PRIORITY = sorted(UPGRADES, key=lambda u: (not u[3], UPGRADES.index(u)))
DECOR = [15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80]
STORY_UNLOCKS = {1: 'brewing', 2: 'garden', 3: 'meadow', 4: 'kettle on sale', 5: 'drying, freshness, tonic',
                 6: "Marla's first story beat + lavender seed", 7: 'forest', 8: "Bramble's rhyme requests + Wren's letter",
                 9: 'salves', 10: '5th slot on sale', 11: 'glowcap night-bloom in the forest',
                 12: 'Sunwort seed, lantern', 13: 'cave', 14: 'festival announced, donations open',
                 15: 'festival prep', 16: 'regular beats', 17: 'regular beats', 18: 'regular beats',
                 19: 'harvest Sunwort', 20: 'Midsummer'}


def request_mix(day, owned):
    """Share of requests by good. Tea/salve requests need the station, otherwise they're served badly or lost."""
    # customers only ask for goods you can make (no lost customers: pillar 4)
    tea = 0.25 if 'kettle' in owned else 0
    salve = 0.25 if 'salve pot' in owned else 0
    return tea, salve


def play(bot, rng):
    coins, owned, log, decor_i = 0, set(), [], 0
    for day in range(1, DAYS + 1):
        earned = 0
        tea_share, salve_share = request_mix(day, owned)
        for c in range(CUSTOMERS[day]):
            s = rng.choices(range(4), BOTS[bot])[0]
            r = rng.random()
            if r < salve_share:
                base = PRICE['salve'] if 'salve pot' in owned else 0       # can't make it: customer leaves
            elif r < salve_share + tea_share:
                base = PRICE['tea'] if 'kettle' in owned else PRICE['tea'] * 0.6  # a potion instead of tea
            else:
                base = PRICE['potion']
            pay = base * STAR_MULT[s] * (2 if c == 0 else 1)            # first customer = featured
            earned += pay
        earned = round(earned) - (MARKET_PER_DAY if day > 1 else 0)
        coins += earned
        bought = []
        for name, price, unlock, crit in PRIORITY:
            if name in owned or day < unlock:
                continue
            if coins >= price:
                coins -= price; owned.add(name); bought.append(name)
            elif crit:
                break  # save up for the next story-critical item instead of buying extras
        # surplus goes to decor from day 8 (decor shop opens), keeping a cushion
        while day >= 8 and decor_i < len(DECOR) and coins - DECOR[decor_i] >= 50 + max([p for n, p, u, c in UPGRADES if c and n not in owned] or [0]):
            coins -= DECOR[decor_i]; bought.append(f'decor {DECOR[decor_i]}'); decor_i += 1
        remaining = [p for n, p, u, c in UPGRADES if n not in owned]
        log.append({'day': day, 'earned': earned, 'coins': coins, 'bought': bought,
                    'max_remaining': max(remaining) if remaining else 0, 'owned': set(owned)})
    return log


def checks(log):
    day_of = {}
    for e in log:
        for b in e['bought']:
            day_of.setdefault(b, e['day'])
    dead = [e['day'] for e in log if 2 <= e['day'] <= 15 and not e['bought'] and e['day'] not in STORY_UNLOCKS]
    hoard = [e['day'] for e in log if e['day'] < 15 and e['max_remaining'] and e['coins'] > 2 * e['max_remaining']]
    return {
        'dead_days': dead,
        'slot5_day': day_of.get('cauldron slot 5'),
        'hoard_days': hoard,
        'all_critical_by_19': all(any(b == n for e in log if e['day'] <= 19 for b in e['bought'])
                                  for n, p, u, c in UPGRADES if c),
        'final_coins': log[-1]['coins'], 'day_of': day_of,
    }


if __name__ == '__main__':
    R = {}
    for bot in BOTS:
        runs = [play(bot, random.Random(seed)) for seed in range(300)]
        R[bot] = (runs, [checks(l) for l in runs])

    runs, ch = R['average']
    print('AVERAGE BOT, median over 300 runs')
    print(f"{'day':>3} {'earned':>7} {'coins':>6}  most common purchases / story")
    for d in range(DAYS):
        earned = st.median(l[d]['earned'] for l in runs)
        coins = st.median(l[d]['coins'] for l in runs)
        from collections import Counter
        cnt = Counter(b for l in runs for b in l[d]['bought'] if not b.startswith('decor'))
        common = [f'{k} ({v * 100 // len(runs)}%)' for k, v in cnt.most_common(3) if v / len(runs) >= 0.3]
        print(f"{d + 1:>3} {earned:>7.0f} {coins:>6.0f}  {', '.join(common) or '-'}   [{STORY_UNLOCKS.get(d + 1, '')}]")

    print('\nCHECKS (economy.md section 5)')
    for bot, (runs, ch) in R.items():
        slot5 = [c['slot5_day'] or 99 for c in ch]
        dead = sum(bool(c['dead_days']) for c in ch) / len(ch)
        deadlist = sorted({d for c in ch for d in c['dead_days']})
        hoard = sum(bool(c['hoard_days']) for c in ch) / len(ch)
        crit = sum(c['all_critical_by_19'] for c in ch) / len(ch)
        total = st.median(sum(e['earned'] for e in l) for l in runs)
        print(f"  {bot:<8} total earned {total:>5.0f} | 5th slot median day {st.median(slot5):>4.0f} (by day 12 in {sum(s <= 12 for s in slot5) / len(slot5):.0%}) | "
              f"runs with a dead day {dead:.0%} {deadlist[:6]} | runs hoarding {hoard:.0%} | all story items by day 19 {crit:.0%} | final coins {st.median(c['final_coins'] for c in ch):.0f}")
    a = R['average'][1]; w = R['weak'][1]
    print('\n  1. no dead days (avg bot)         ', 'PASS' if sum(bool(c['dead_days']) for c in a) / len(a) <= 0.1 else 'FAIL')
    print('  2. avg bot 5th slot by day 12       ', 'PASS' if sum((c['slot5_day'] or 99) <= 12 for c in a) / len(a) >= 0.8 else 'FAIL')
    print('  3. no hoarding before day 15 (avg) ', 'PASS' if sum(bool(c['hoard_days']) for c in a) / len(a) <= 0.1 else 'FAIL')
    print('  4. weak bot reaches the finale     ', 'PASS' if sum(c['all_critical_by_19'] for c in w) / len(w) >= 0.9 else 'FAIL')

    # garden vs expedition: ingredient units per action point
    print('\nGARDEN vs EXPEDITION (units per action point; garden = all plots for 1 AP, perennial harvest of 3 every 3 days)')
    for plots in (2, 3, 4, 6):
        print(f"  {plots} plots: garden ~{plots * 3 / 3:.1f} units/AP, steady, you choose the plant | expedition ~4.8 units/AP (6 picks, ~80% hit), random, 1-2 rare finds")
