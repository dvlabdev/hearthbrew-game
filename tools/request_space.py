"""Full request-space analysis (M0c check 4).

Generates every request the riddle system can produce per tier (keywords x intensity words,
from design/data/content.json), then counts 3-star solutions for each with the ingredients
and cauldron slots available at that tier. Reports unsolvable/too-easy requests and
dominant/dead ingredients.

Usage:  python tools/request_space.py            # current content
        python tools/request_space.py --variant A  # test a candidate ingredient change
"""
import itertools, math, sys
from collections import Counter
import numpy as np
import solution_space as ss

VARIANTS = {
    'A': {'mint': [-2, 0, 0, 2]},
    'B': {'sage': [0, 0, 0, 3]},
    'C': {'mint': [-2, 0, 0, 2], 'sage': [0, 0, 0, 3]},
    # D: "starter = honest" -- simple starter ingredients, side effects live in forest/cave items
    'D': {'sage': [0, 0, 0, 3], 'fireroot': [3, 0, 0, 0], 'rosehip': [0, 0, 2, 0]},
    'E': {'sage': [0, 0, 0, 3], 'fireroot': [3, 0, 0, 0], 'rosehip': [0, 0, 2, 0], 'mint': [-2, 0, 0, 2]},
}
INV = {2: (7, 2), 3: (9, 2)}  # tier: (ingredient types in the basket, units of each)
TRAITS = ['heat', 'calm', 'vigor', 'clarity']
C = ss.CONTENT
STARTER = ['chamomile', 'lavender', 'mint', 'sage', 'fireroot', 'nettle', 'rosehip', 'honey']
FOREST = ['valerian', 'glowcap', 'pine', 'bilberry', 'angelica']
CAVE = ['brimstone', 'salt', 'quartz']
TIERS = [  # (tier, pool, slots, tol)
    (1, STARTER, 3, 1),
    (2, STARTER + FOREST, 4, 1),
    (3, STARTER + FOREST + CAVE, 5, 1),
]
INTENS = sorted({e['value'] for e in C['intensity']} | {3, 4, 6})


def apply_variant(name):
    for k, v in VARIANTS[name].items():
        ss.I[k] = (list(v), ss.I[k][1])


def kw_target(kw, intensity, tier):
    t = [0, 0, 0, 0]
    for trait, w in kw['traits'].items():
        if trait == 'heat' and kw.get('heatFromTier', 0) > tier:
            continue
        t[TRAITS.index(trait)] = min(10, math.ceil(intensity * w))
    return t


def requests(tier):
    kws = C['keywords']
    out = set()
    if tier == 1:
        for kw in kws:
            for i in INTENS:
                out.add(tuple(kw_target(kw, i, tier)))
        return sorted(out)
    for a, b in itertools.combinations(kws, 2):
        pa = max(a['traits'], key=a['traits'].get)
        pb = max(b['traits'], key=b['traits'].get)
        if pa == pb:
            continue
        for ia in INTENS:
            for ib in INTENS:
                t = [max(x, y) for x, y in zip(kw_target(a, ia, tier), kw_target(b, ib, tier))]
                if tier == 2:
                    out.add(tuple(t))
                else:
                    for av in C['avoid']:
                        z = [TRAITS.index(x) for x in av['zero']]
                        t2 = [0 if i in z else v for i, v in enumerate(t)]
                        if t2 != t and sum(1 for v in t2 if v) >= 1:
                            out.add(tuple(t2))
    return sorted(out)


def table(pool, slots):
    combos = list(itertools.combinations_with_replacement(pool + ['empty'], slots))
    combos = [c for c in combos if any(x != 'empty' for x in c)]
    vs = np.array([ss.brew(c, False) for c in combos])
    vb = np.array([ss.brew(c, True) for c in combos])
    def harm(v):
        s = np.sort(v, axis=1)
        return (s[:, 3] == s[:, 2]) & (s[:, 3] >= 4)
    names = [tuple(x for x in c if x != 'empty') for c in combos]
    return names, vs, vb, harm(vs), harm(vb)


def inventory_mask(names, inv):
    ok = []
    for n in names:
        c = Counter(n)
        ok.append(all(x in inv and c[x] <= inv[x] for x in c))
    return np.array(ok)


def analyse(tier, pool, slots, tol, verbose=True, inv_samples=0, seed=7):
    names, vs, vb, hs, hb = table(pool, slots)
    reqs = requests(tier)
    counts, share, cover = [], Counter(), Counter()
    total_solutions = 0
    for T in reqs:
        T = np.array(T)
        ds, db = np.abs(vs - T).sum(1), np.abs(vb - T).sum(1)
        ok = (ds <= tol) | ((ds <= tol + 2) & hs) | (db <= tol) | ((db <= tol + 2) & hb)
        sol = {names[i] for i in np.nonzero(ok)[0]}
        counts.append(len(sol))
        total_solutions += len(sol)
        used = set()
        for s in sol:
            for ing in set(s):
                share[ing] += 1
                used.add(ing)
        for ing in used:
            cover[ing] += 1
    c = np.array(counts)
    res = {
        'tier': tier, 'requests': len(reqs), 'slots': slots,
        'unsolvable': int((c == 0).sum()), 'one': int((c == 1).sum()),
        'target_2_6': int(((c >= 2) & (c <= 6)).sum()), 'generous_7_15': int(((c >= 7) & (c <= 15)).sum()),
        'very_generous_16plus': int((c >= 16).sum()), 'median': float(np.median(c)),
        'share': {ing: share[ing] / max(1, total_solutions) for ing in pool},
        'cover': {ing: cover[ing] / len(reqs) for ing in pool},
        'reqs': reqs, 'counts': counts,
    }
    if verbose:
        print(f"\nTIER {tier}: {len(reqs)} requests, {slots} slots, tol {tol}, pool {len(pool)}")
        print(f"  3* solutions per request: unsolvable={res['unsolvable']}  exactly1={res['one']}  "
              f"2-6={res['target_2_6']}  7-15={res['generous_7_15']}  16+={res['very_generous_16plus']}  median={res['median']}")
        flags = []
        for ing in pool:
            sh, cv = res['share'][ing], res['cover'][ing]
            tag = 'DOMINANT' if sh > 0.6 else 'dead' if sh < 0.05 else ''
            flags.append(f"{ing}:{sh:.0%}/{cv:.0%}{'('+tag+')' if tag else ''}")
        print('  ingredient share of solutions / requests covered:')
        print('   ', '  '.join(flags))
        unsolv = [r for r, n in zip(reqs, counts) if n == 0]
        if unsolv:
            print('  unsolvable targets (first 8):', unsolv[:8])
    if inv_samples and tier in INV:
        k, units = INV[tier]
        rng = np.random.default_rng(seed)
        buckets = Counter()
        for _ in range(inv_samples):
            inv = {x: units for x in rng.choice(pool, size=min(k, len(pool)), replace=False)}
            m = inventory_mask(names, inv)
            T = np.array(reqs[rng.integers(len(reqs))])
            ds, db = np.abs(vs - T).sum(1), np.abs(vb - T).sum(1)
            ok = ((ds <= tol) | ((ds <= tol + 2) & hs) | (db <= tol) | ((db <= tol + 2) & hb)) & m
            two = ((ds <= tol + 2) | (db <= tol + 2)) & m
            n3 = len({names[i] for i in np.nonzero(ok)[0]})
            n2 = len({names[i] for i in np.nonzero(two)[0]})
            buckets['3star:' + ('0' if n3 == 0 else '1' if n3 == 1 else '2-6' if n3 <= 6 else '7+')] += 1
            buckets['2star_reachable' if n2 else '2star_unreachable'] += 1
        if verbose:
            print(f"  WITH A REAL BASKET ({k} kinds x {units} each, {inv_samples} random days):",
                  '  '.join(f'{b}={v / inv_samples:.0%}' for b, v in sorted(buckets.items())))
    return res


if __name__ == '__main__':
    if '--variant' in sys.argv:
        v = sys.argv[sys.argv.index('--variant') + 1]
        apply_variant(v)
        print(f'=== VARIANT {v}: {VARIANTS[v]} ===')
    else:
        print('=== CURRENT CONTENT ===')
    for tier, pool, slots, tol in TIERS:
        analyse(tier, pool, slots, tol, inv_samples=400)
