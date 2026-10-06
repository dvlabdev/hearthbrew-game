import itertools
I={ # name: (vec, tag)
'chamomile':([0,3,0,0],'d'),'lavender':([0,2,0,1],'d'),'mint':([-2,1,0,2],'d'),'sage':([0,1,0,3],''),
'fireroot':([3,0,1,0],'t'),'nettle':([1,0,3,0],''),'rosehip':([0,0,2,1],'t'),'honey':([0,1,1,0],'h'),
'valerian':([0,4,-1,-1],'t'),'glowcap':([0,-1,0,4],'t'),'pine':([2,0,0,1],''),'bilberry':([0,1,2,1],'d'),
'angelica':([2,0,1,1],'t'),'salt':([0,0,0,0],'salt'),'quartz':([0,0,0,0],'q'),'sunwort':([1,1,1,1],'d'),'empty':([0,0,0,0],'')}
def MAIN(v): return max(range(4),key=lambda i:v[i])
def brew(combo,boil):
    s=[0,0,0,0]
    for n in combo:
        v,t=list(I[n][0]),I[n][1]
        if t=='d' and boil:
            if v[1]>0: v[1]-=1
            if v[3]>0: v[3]-=1
        if t=='t' and not boil: v[MAIN(v)]-=1
        s=[a+b for a,b in zip(s,v)]
    if 'honey' in combo and any(I[n][0][0]>0 for n in combo): s[1]+=1
    if boil and s[0]>=8: s=[s[0]]+[x-1 for x in s[1:]]
    if 'salt' in combo: m=MAIN(s); s[m]+=1
    if 'quartz' in combo:
        nz=[i for i in range(4) if s[i]>0]
        if nz: s[min(nz,key=lambda i:s[i])]=0
    return [min(10,max(0,x)) for x in s]
def stars(b,T,tol):
    d=sum(abs(x-y) for x,y in zip(b,T))
    st=3 if d<=tol else 2 if d<=tol+2 else 1 if d<=tol+4 else 0
    top=sorted(b,reverse=True)
    if top[0]==top[1] and top[0]>=4 and st<3: st+=1  # R7 Harmonized
    return st,d
def solve(T,tol,slots,pool):
    res={}
    for combo in itertools.combinations_with_replacement(pool,slots):
        for boil in (False,True):
            b=brew(combo,boil); st,d=stars(b,T,tol)
            key=(tuple(c for c in combo if c!='empty'),'boil' if boil else 'simmer',tuple(b))
            if st==3: res[key]=d
    return res
start=['chamomile','mint','sage','fireroot','honey','empty']
v1=list(I)
for name,T,tol,slots,pool in [
 ('Marla sleep',[0,6,0,0],2,3,start),('Pell warm',[4,0,4,0],2,3,start+['nettle']),
 ('Fennick exam',[0,3,0,4],2,3,start),('Midsummer',[5,5,5,5],3,5,v1)]:
    r=solve(T,tol,slots,pool)
    combos={k[0] for k in r}
    print(name,'3-star distinct combos:',len(combos))
    for k,d in sorted(r.items(),key=lambda x:x[1])[:4]: print('   d=%d'%d,k)
