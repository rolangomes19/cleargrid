import csv,hashlib,os,sys
src,dst=sys.argv[1],sys.argv[2]
CP='C:\\cleargrid-profile\\'; OD='C:\\Users\\dell\\OneDrive\\Documents\\cleargrid\\'
def tr(p): return p.replace(CP,'/tmp/t/CP/').replace(OD,'/tmp/t/OD/').replace('\\','/')
rows=list(csv.DictReader(open(src)))
newh={}
out=[]
for r in rows:
    if r['place'] in('C','OneDrive') and '.git' not in r['path'] and r['sha256']:
        h=r['sha256']; data=('content-'+h).encode(); nh=hashlib.sha256(data).hexdigest(); newh[h]=nh
        p=tr(r['path']); os.makedirs(os.path.dirname(p),exist_ok=True); open(p,'wb').write(data)
for r in rows:
    if r['place'] in('C','OneDrive'):
        r['path']=tr(r['path']); r['canonical_copy']=tr(r['canonical_copy'])
        if r['sha256'] in newh: r['sha256']=newh[r['sha256']]
    out.append(r)
w=csv.DictWriter(open(dst,'w',newline=''),fieldnames=list(rows[0].keys()),lineterminator='\n'); w.writeheader(); w.writerows(out)
