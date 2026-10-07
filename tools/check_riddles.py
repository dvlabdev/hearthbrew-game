"""Count 3-star and 2-star solutions for each prototype-B riddle (M0c check 4, partial)."""
import json, os
from solution_space import solve, brew, stars, ROOT
import itertools

with open(os.path.join(ROOT, 'design', 'data', 'riddles-toy.json'), encoding='utf-8') as f:
    R = json.load(f)
pool = R['pool'] + ['empty']

for slots in (3, 4):
    print(f'--- {slots} slots ---')
    for r in R['riddles']:
        three, two = set(), set()
        for combo in itertools.combinations_with_replacement(pool, slots):
            for boil in (False, True):
                st, d = stars(brew(combo, boil), r['target'], r['tol'])
                k = tuple(c for c in combo if c != 'empty')
                if st == 3: three.add((k, boil))
                if st >= 2: two.add(k)
        combos3 = {k for k, _ in three}
        flag = 'OK' if 2 <= len(combos3) <= 6 else ('TOO FEW' if len(combos3) < 2 else 'generous')
        ex = sorted(three, key=lambda x: len(x[0]))[:2]
        print(f"#{r['id']:>2} t{r['tier']} {r['who']:<9} 3*={len(combos3):>3} 2*+={len(two):>3} {flag:<8} e.g. {[(list(k), 'boil' if b else 'simmer') for k, b in ex]}")
