"""Export reference results from the validated Python tools as JSON fixtures for the JS tests.
Run after any rule or content change:  python tools/export_fixtures.py
"""
import itertools, json, os, random
import solution_space as ss
import haul_sim as hs

OUT = os.path.join(ss.ROOT, 'tests', 'fixtures')
os.makedirs(OUT, exist_ok=True)

# 1. Random brews: expected vector and stars against a random target
rng = random.Random(2026)
names = [k for k in ss.I if k != 'empty']
brews = []
for _ in range(300):
    combo = [rng.choice(names) for _ in range(rng.randint(1, 5))]
    boil = rng.random() < 0.5
    target = [rng.randint(0, 7) for _ in range(4)]
    tol = rng.choice([0, 1, 2])
    vec = ss.brew(combo, boil)
    st, d = ss.stars(vec, target, tol)
    brews.append({'names': combo, 'boil': boil, 'vec': vec, 'target': target, 'tol': tol, 'stars': st, 'd': d})
json.dump(brews, open(os.path.join(OUT, 'brews.json'), 'w'), indent=1)

# 2. Scripted haul days (prototype C3 data) with the planner's picks and the results
stock = [dict(s) for s in hs.D['startStock']]
days = []
for day in hs.D['days']:
    d = dict(day); d['finds'] = [h for h, n in day['finds'].items() for _ in range(n)]
    picks = hs.s_planner(stock, d, random.Random(1))
    stock_before = [dict(s) for s in stock]
    stock, coins, served, rares, wilted = hs.play_day(stock, d, picks)
    days.append({'day': day['day'], 'weather': day['weather'], 'featured': day['featured'], 'others': day['others'],
                 'stockBefore': stock_before, 'picks': picks, 'coins': coins, 'served': served, 'rares': rares, 'wilted': wilted})
json.dump(days, open(os.path.join(OUT, 'haul_days.json'), 'w'), indent=1)

# 3. Midsummer Draught: number of distinct 3-star combinations (tol 2, no R7, 1-2 Sunwort, 5 slots, all ingredients)
pool = list(ss.I)
sols = set()
for combo in itertools.combinations_with_replacement(pool, 5):
    n = combo.count('sunwort')
    if n < 1 or n > 2:
        continue
    for boil in (False, True):
        st, _ = ss.stars(ss.brew(combo, boil), [5, 5, 5, 5], 2, harmonize=False)
        if st == 3:
            sols.add(tuple(c for c in combo if c != 'empty'))
json.dump({'threeStarCombos': len(sols)}, open(os.path.join(OUT, 'midsummer.json'), 'w'))
print(f'wrote {len(brews)} brews, {len(days)} haul days, midsummer={len(sols)} to tests/fixtures/')
