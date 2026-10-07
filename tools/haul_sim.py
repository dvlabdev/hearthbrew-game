"""Dominance check for "Choose your haul" (prototype C3). Rules: design/expedition.md + design/data/haul-toy.json.

Plays 5 consecutive days x N random runs with several picking strategies and checks that
the choice has no obvious answer:
  1. a stock-aware planner beats every single-factor strategy by >= 10%
  2. each single-factor strategy is the best of the three in some runs
  3. in >= 50% of hauls the single-factor strategies disagree on at least one pick
Also replays the 5 scripted prototype days (for the browser cross-check).
"""
import itertools, json, os, random, statistics as st

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, 'design', 'data', 'haul-toy.json'), encoding='utf-8'))
H, CUST, W = D['herbs'], D['customers'], D['weather']
TRAITS = ['heat', 'calm', 'vigor', 'clarity']
NAMES = list(H)


# ---------- core rules (mirrored in prototypes/haul.html) ----------
def serve(stock, need_trait, units):
    """Use the stock items of that trait that wilt soonest. Returns (served, value_used, new_stock)."""
    cand = sorted([s for s in stock if H[s['herb']]['trait'] == need_trait], key=lambda s: (s['nights'], -s.get('units', H[s['herb']]['units'])))
    got, used = 0, []
    for s in cand:
        if got >= units:
            break
        used.append(s); got += s.get('units', H[s['herb']]['units'])
    if got < units:
        return False, 0, stock
    rest = [s for s in stock if not any(s is u for u in used)]  # identity, not equality: twin items must not vanish together
    return True, sum(s.get('value', H[s['herb']]['value']) for s in used), rest


def resolve(stock, featured, others):
    """Tomorrow's shop: featured first, then the others in order."""
    coins, served = 0, []
    for i, c in enumerate([featured] + others):
        ok, val, stock = serve(stock, CUST[c['who']]['trait'], c['units'])
        if ok:
            coins += (D['pay']['featured'] if i == 0 else D['pay']['other']) + val
        served.append(ok)
    return coins, served, stock


def night(stock):
    """Every item loses a night; items at 0 are wilted (gone)."""
    out = [dict(s, nights=s['nights'] - 1) for s in stock]
    return [s for s in out if s['nights'] > 0], [s['herb'] for s in out if s['nights'] <= 0]


def slots(picks):
    return sum(H[p]['slots'] for p in picks)


def picked_item(p, wkey):
    w = W[wkey]
    prime, poor = H[p]['kind'] in w['prime'], H[p]['kind'] in w.get('poor', [])
    return {'herb': p, 'prime': prime, 'poor': poor,
            'nights': D['freshNights'] + w['nights'] - (1 if poor else 0),
            'units': H[p]['units'] + (1 if prime else 0),
            'value': max(0, H[p]['value'] + (1 if prime else 0) - (1 if poor else 0))}


def play_day(stock, day, picks):
    stock = [dict(s) for s in stock] + [picked_item(p, day['weather']) for p in picks]
    coins, served, stock = resolve(stock, day['featured'], day['others'])
    stock, wilted = night(stock)
    rares = sum(H[p]['rarity'] == 'rare' for p in picks)
    return stock, coins, served, rares, wilted


# ---------- random day generator (generator rule from expedition.md) ----------
def gen_day(rng, stock):
    wkey = rng.choice(list(W)); w = W[wkey]
    def pick_cust():
        if w['skew'] and rng.random() < 0.5:
            return rng.choice([c for c in CUST if CUST[c]['trait'] == w['skew']])
        return rng.choice(list(CUST))
    fw = pick_cust()
    featured = {'who': fw, 'units': rng.choice([1, 2, 2])}
    ftrait = CUST[fw]['trait']
    finds = []
    serving = [h for h in NAMES if H[h]['trait'] == ftrait]
    finds += rng.choices(serving, k=2)                              # >= 2 serve tomorrow's clue
    wilting = [s['herb'] for s in stock if s['nights'] == 1]
    finds.append(rng.choice(wilting) if wilting else rng.choice(NAMES))   # 1 tops up a wilting item
    special = [h for h in NAMES if H[h]['rarity'] == 'rare' or H[h]['slots'] > 1]
    finds.append(rng.choice(special))                               # 1 rare or heavy
    weights = [(3 if H[h]['kind'] in w['boost'] else 1) * (0.4 * w['rareMult'] if H[h]['rarity'] == 'rare' else 1) for h in NAMES]
    while len(finds) < w['finds']:
        finds.append(rng.choices(NAMES, weights)[0])
    for _ in range(w['extraRare']):
        finds.append(rng.choice([h for h in NAMES if H[h]['rarity'] == 'rare']))
    others = [{'who': pick_cust(), 'units': rng.choice([1, 1, 2])} for _ in range(2)]
    return {'weather': wkey, 'featured': featured, 'finds': finds, 'others': others}


# ---------- strategies: each returns a list of picked herbs within the basket ----------
def fill(order):
    picks = []
    for h in order:
        if slots(picks) + H[h]['slots'] <= D['basket']:
            picks.append(h)
    return picks


def s_need(stock, day, rng):
    t = CUST[day['featured']['who']]['trait']
    return fill(sorted(day['finds'], key=lambda h: (H[h]['trait'] != t, -H[h]['units'] / H[h]['slots'])))


def s_value(stock, day, rng):
    return fill(sorted(day['finds'], key=lambda h: -picked_item(h, day['weather'])['value'] / H[h]['slots']))


def s_rarity(stock, day, rng):
    rank = {'rare': 0, 'uncommon': 1, 'common': 2}
    return fill(sorted(day['finds'], key=lambda h: (rank[H[h]['rarity']], -H[h]['value'])))


def s_random(stock, day, rng):
    f = day['finds'][:]; rng.shuffle(f); return fill(f)


def s_planner(stock, day, rng, samples=8):
    """Stock-aware: tries every basket; scores the known featured customer exactly and the unknown
    others by sampling; small credit for fresh leftovers (next days)."""
    best, best_score = [], -1
    idx = range(len(day['finds']))
    seen = set()
    for r in range(0, len(day['finds']) + 1):
        for combo in itertools.combinations(idx, r):
            picks = tuple(sorted(day['finds'][i] for i in combo))
            if picks in seen or slots(picks) > D['basket']:
                continue
            seen.add(picks)
            tot = 0
            for _ in range(samples):
                others = [{'who': rng.choice(list(CUST)), 'units': rng.choice([1, 1, 2])} for _ in range(2)]
                st2 = [dict(s) for s in stock] + [picked_item(p, day['weather']) for p in picks]
                coins, _, left = resolve(st2, day['featured'], others)
                tot += coins + 3 * sum(H[s['herb']]['units'] for s in left if s['nights'] > 1)
            score = tot / samples + D['rareWeight'] * sum(H[p]['rarity'] == 'rare' for p in picks)
            if score > best_score:
                best, best_score = list(picks), score
    return best


STRATS = {'need': s_need, 'value': s_value, 'rarity': s_rarity, 'random': s_random, 'planner': s_planner}


def run(seed, days=5):
    rng = random.Random(seed)
    start = [dict(s) for s in D['startStock']]
    stocks = {k: [dict(s) for s in start] for k in STRATS}
    score = {k: 0 for k in STRATS}
    disagree = 0
    for _ in range(days):
        day = gen_day(rng, stocks['planner'])
        picks = {k: f(stocks[k], day, random.Random(rng.random())) for k, f in STRATS.items()}
        if len({tuple(sorted(picks[k])) for k in ('need', 'value', 'rarity')}) > 1:
            disagree += 1
        for k in STRATS:
            stocks[k], coins, _, rares, _ = play_day(stocks[k], day, picks[k])
            score[k] += coins + D['rareWeight'] * rares
    return score, disagree / days


if __name__ == '__main__':
    N = 300
    res = [run(s) for s in range(N)]
    mean = {k: st.mean(r[0][k] for r in res) for k in STRATS}
    print(f'Mean 5-day score over {N} random runs (coins + {D["rareWeight"]} x rares):')
    for k in sorted(mean, key=mean.get, reverse=True):
        print(f'  {k:<8} {mean[k]:7.1f}')
    singles = ['need', 'value', 'rarity']
    wins = {k: sum(1 for r in res if r[0][k] == max(r[0][s] for s in singles)) / N for k in singles}
    dis = st.mean(r[1] for r in res)
    c1 = all(mean['planner'] >= 1.10 * mean[k] for k in singles)
    c2 = all(wins[k] > 0.05 for k in singles)
    c3 = dis >= 0.5
    print('\nChecks:')
    pm = mean['planner']
    margins = ', '.join('%s +%.0f%%' % (k, (pm / mean[k] - 1) * 100) for k in singles)
    print(f"  1. planner beats every single-factor strategy by >= 10%: {'PASS' if c1 else 'FAIL'} ({margins})")
    print(f"  2. each single-factor strategy is best in some runs:      {'PASS' if c2 else 'FAIL'} "
          f"({', '.join(f'{k} {wins[k]:.0%}' for k in singles)})")
    print(f"  3. strategies disagree on >= 50% of hauls:                {'PASS' if c3 else 'FAIL'} ({dis:.0%})")

    # 4. weather plays a role: same finds/customers, different weather -> does the best haul change?
    rng = random.Random(99); changed = 0; trials = 60
    for t in range(trials):
        stock = [dict(x) for x in D['startStock']]
        day = gen_day(rng, stock)
        best = set()
        for wk in W:
            best.add(tuple(sorted(s_planner(stock, dict(day, weather=wk), random.Random(t)))))
        changed += len(best) > 1
    c4 = changed / trials >= 0.5
    print(f"  4. weather changes the best haul (same finds, other weather): {'PASS' if c4 else 'FAIL'} ({changed / trials:.0%} of days)")

    print('\nScripted prototype days, planner picks (for the browser cross-check):')
    stock = [dict(s) for s in D['startStock']]
    for day in D['days']:
        d = dict(day); d['finds'] = [h for h, n in day['finds'].items() for _ in range(n)]
        picks = s_planner(stock, d, random.Random(1))
        stock, coins, served, rares, wilted = play_day(stock, d, picks)
        print(f"  day {day['day']} {day['weather']:<4} picks {sorted(picks)} -> coins {coins}, served {served}, rares {rares}, wilted {wilted}")
