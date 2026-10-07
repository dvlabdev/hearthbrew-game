"""Solution-space analysis for Hearthbrew brewing (M0c check 4).

Loads design/data/content.json and brute-forces every ingredient combination
x Simmer/Boil to count how many brews score 3 stars for a request.
Rules implemented: R1, R2, R3, R4, R5, R7, R8 (see design/brew-math.md).
"""
import itertools, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
with open(os.path.join(ROOT, 'design', 'data', 'content.json'), encoding='utf-8') as f:
    CONTENT = json.load(f)

I = {k: (list(v['vec']), set(v['tags'])) for k, v in CONTENT['ingredients'].items()}
I['empty'] = ([0, 0, 0, 0], set())
BANDS = CONTENT['scoring']['starBands']


def main_trait(v):
    return max(range(4), key=lambda i: v[i])


def brew(combo, boil):
    s = [0, 0, 0, 0]
    for n in combo:
        v, tags = list(I[n][0]), I[n][1]
        if 'delicate' in tags and boil:            # R1
            if v[1] > 0: v[1] -= 1
            if v[3] > 0: v[3] -= 1
        if 'tough' in tags and not boil:           # R2
            v[main_trait(v)] -= 1
        s = [a + b for a, b in zip(s, v)]
    if 'honey' in combo and any(I[n][0][0] > 0 for n in combo):  # R4
        s[1] += 1
    if boil and s[0] >= 8:                         # R3
        s = [s[0]] + [x - 1 for x in s[1:]]
    if any('mod-salt' in I[n][1] for n in combo):  # R5
        s[main_trait(s)] += 1
    if any('mod-purify' in I[n][1] for n in combo):  # R8
        nz = [i for i in range(4) if s[i] > 0]
        if nz: s[min(nz, key=lambda i: s[i])] = 0
    return [min(10, max(0, x)) for x in s]


def stars(b, T, tol, harmonize=True):
    d = sum(abs(x - y) for x, y in zip(b, T))
    st = 3 if d <= tol + BANDS[0] else 2 if d <= tol + BANDS[1] else 1 if d <= tol + BANDS[2] else 0
    top = sorted(b, reverse=True)
    if harmonize and top[0] == top[1] and top[0] >= 4 and st < 3:  # R7
        st += 1
    return st, d


def solve(T, tol, slots, pool, harmonize=True):
    res = {}
    for combo in itertools.combinations_with_replacement(pool, slots):
        for boil in (False, True):
            b = brew(combo, boil)
            st, d = stars(b, T, tol, harmonize)
            if st == 3:
                key = (tuple(c for c in combo if c != 'empty'), 'boil' if boil else 'simmer', tuple(b))
                res[key] = d
    return res


start = ['chamomile', 'mint', 'sage', 'fireroot', 'honey', 'empty']
v1 = list(I)

if __name__ == '__main__':
    for name, T, tol, slots, pool in [
        ('Marla sleep', [0, 6, 0, 0], 2, 3, start),
        ('Pell warm', [4, 0, 4, 0], 2, 3, start + ['nettle']),
        ('Fennick exam', [0, 3, 0, 4], 2, 3, start),
    ]:
        r = solve(T, tol, slots, pool)
        print(name, '3-star distinct combos:', len({k[0] for k in r}))
        for k, d in sorted(r.items(), key=lambda x: x[1])[:4]:
            print('   d=%d' % d, k)
