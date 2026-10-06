import solution_space, itertools
from collections import Counter
solution_space.I['angelica']=([2,0,1,1],'t')
def run(tol,cap):
    sols=set();two=set();use=Counter()
    for combo in itertools.combinations_with_replacement(solution_space.v1,5):
        n=combo.count('sunwort')
        if n<1 or n>cap: continue
        for boil in (False,True):
            b=solution_space.brew(combo,boil); d=sum(abs(x-5) for x in b)
            k=tuple(c for c in combo if c!='empty')
            if d<=tol: sols.add(k)
            if d<=tol+2: two.add(k)
    for s in sols:
        for c in set(s): use[c]+=1
    print(f'tol={tol} cap={cap}: 3star={len(sols)} 2star+={len(two)}  ingredient use in 3star:',use.most_common(8))
    for s in sorted(sols)[:6]: print('   ',s)
for tol in (1,2): run(tol,2)
