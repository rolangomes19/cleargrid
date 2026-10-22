import os,json,hashlib,csv,zipfile,datetime,sys
SP=sys.argv[1]
U='/mnt/user-data/uploads'
def sha(p):
    h=hashlib.sha256()
    with open(p,'rb') as f:
        for b in iter(lambda:f.read(1<<20),b''): h.update(b)
    return h.hexdigest()
def iso(ms): return datetime.datetime.fromtimestamp(ms/1000,datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
# device mtimes from C: listing
lst=json.load(open('/root/.claude/projects/-home-claude/9f807fee-24de-5990-83c6-edfb2de837f9/tool-results/mcp-remote-devices-device_list_dir-1792679477470.txt'))
cm={e['name']:e['mtimeMs'] for e in lst['entries'] if e['type']=='file'}
od={
'borrower-profile-wireframe.html':1789106516849,'cleargrid-agent-persona-research.md':1789106528406,
'cleargrid-borrower-profile-analysis-and-v2-decisions.docx':1789118223126,'cleargrid-borrower-profile-console-v2-claude.html':1789124047470,
'cleargrid-borrower-profile-redesign-brief.pdf':1789028391068,'cleargrid-borrower-profile-v2.1.html':1789120635140,
'cleargrid-borrower-profile-v2.html':1789118240379,'cleargrid-borrower-profile-v2.md':1789120608376,
'cleargrid-borrower-profile-v3-spec.md':1789126018206,'cleargrid-borrower-profile-v3.html':1789126398013,
'cleargrid-design-assumptions.md':1789109384945,'cleargrid-design.md':1789106596260,'cleargrid-interview-prep-context.md':1789537299101,
'cleargridborrowerprofile.html':1789147972770,'dense-ui-design-guide.md':1789108323950,'design-rationale-simplified.md':1789172467049,
'design-rationale.md':1789171178329,'this-is-an-ux-rosy-sketch.md':1789040411597,
'cleargrid-case-study/cleargrid-borrower-profile-redesign-brief.md':1789034332505,'cleargrid-case-study/redesign-preview.html':1789197951748,
'cleargrid-case-study/showcase.html':1789198140212,'cleargrid-case-study/UX Redesign and Assessment.zip':1789039987330,
'cleargrid-case-study/screenshots/01-main-borrower-info.png':1789034274289,'cleargrid-case-study/screenshots/02-deal-activity-interaction-logs.png':1789034274369,
'cleargrid-case-study/screenshots/03-custom-attributes-extended-details.png':1789034274442,'cleargrid-case-study/screenshots/04-deal-timeline-communication-history.png':1789034274521,
'cleargrid-case-study/screenshots/cleargrid-logo.png':1789034274206}
rows=[]
def add(place,path,fp,mt,note=''):
    rows.append(dict(place=place,path=path,sha256=sha(fp) if fp else 'UNHASHED',size=os.path.getsize(fp) if fp else '',mtime_utc=mt,duplicate_of='',note=note,_fp=fp))
root=U+'/cleargrid-profile'
for d,_,fs in os.walk(root):
    for f in fs:
        fp=os.path.join(d,f); rel=os.path.relpath(fp,root).replace(os.sep,'/')
        add('C','C:'+chr(92)+'cleargrid-profile'+chr(92)+rel.replace('/',chr(92)),fp,iso(cm[rel]) if rel in cm else '')
root=U+'/cleargrid'
for d,_,fs in os.walk(root):
    for f in fs:
        fp=os.path.join(d,f); rel=os.path.relpath(fp,root).replace(os.sep,'/')
        add('OneDrive',chr(92).join(['C:','Users','dell','OneDrive','Documents','cleargrid'])+chr(92)+rel.replace('/',chr(92)),fp,iso(od[rel]) if rel in od else '')
# archive members
for d,tag,src in [(SP+'/zip','zip','OneDrive:cleargrid-case-study/UX Redesign and Assessment.zip!'),(SP+'/tar','tar','C:cleargrid-v3-project.tar.gz!')]:
    for dd,_,fs in os.walk(d):
        for f in fs:
            fp=os.path.join(dd,f); rel=os.path.relpath(fp,d).replace(os.sep,'/')
            add(tag,src+rel,fp,'',note='archive member')
# project
PT='/root/.claude/projects/-home-claude/9f807fee-24de-5990-83c6-edfb2de837f9/tool-results/'
for n,local in [('01mainborrowerinfo.png','project-file-642401b6-f79e-4f0a-8c2e-01ecacc8a43a-01mainborrowerinfo.png'),
 ('02dealactivityinteractionlogs.png','project-file-dd289531-be88-4c85-950b-d428d3af8da9-02dealactivityinteractionlogs.png'),
 ('03customattributesextendeddetails.png','project-file-5a1f7004-521e-42ed-8bfe-bab54ef4f97a-03customattributesextendeddetails.png'),
 ('04dealtimelinecommunicationhistory.png','project-file-1a206080-8446-4fdc-9425-b9571dee695f-04dealtimelinecommunicationhistory.png')]:
    add('project','project:'+n,PT+local,'2026-09-10T11:39:11Z')
for n,ct in [('claude/cleargrid-decision-defensibility-audit.md','2026-09-22T14:23:08Z'),('claude/cleargrid-agent-journey-expansion.md','2026-09-22T14:16:58Z'),
 ('cleargrid-borrower-profile.html','2026-09-16T04:35:31Z'),('cleargrid-borrower-profile-v3.html','2026-09-11T11:33:23Z'),('cleargrid-design-assumptions.md','2026-09-11T06:50:09Z'),
 ('dense-ui-design-guide.md','2026-09-11T06:33:53Z'),('cleargrid-design.md','2026-09-11T06:03:35Z'),('borrower-profile-wireframe.html','2026-09-11T06:02:56Z'),
 ('cleargrid-agent-persona-research.md','2026-09-11T06:02:56Z'),('cleargrid-borrower-profile-redesign-brief.md','2026-09-10T11:38:53Z')]:
    add('project','project:'+n,None,ct+'(created_at)','text returned inline by Projects tool, not on disk; hash not computable. See ledger/phase notes')
# duplicate_of: lowest priority key wins
def key(r):
    p=r['path']
    if r['place']=='C':
        BS=chr(92)
        P='C:'+BS+'cleargrid-profile'+BS
        if p.startswith(P+'cleargrid'+BS+'.git'): k=0.5
        elif p.startswith(P+'cleargrid'+BS): k=0
        elif p.startswith(P+'documents'): k=1
        elif p.startswith(P+'case-study-materials'): k=2
        else: k=3
    else: k={'OneDrive':4,'zip':5,'tar':6,'project':7}[r['place']]
    return (k,p)
by={}
for r in rows:
    if r['sha256']!='UNHASHED': by.setdefault(r['sha256'],[]).append(r)
for h,g in by.items():
    g.sort(key=key)
    for r in g[1:]: r['duplicate_of']=g[0]['path']
rows.sort(key=key)
with open(SP+'/out/manifest.csv','w',newline='',encoding='utf-8') as f:
    w=csv.writer(f); w.writerow(['place','path','sha256','size_bytes','mtime_utc','duplicate_of','note'])
    for r in rows: w.writerow([r['place'],r['path'],r['sha256'],r['size'],r['mtime_utc'],r['duplicate_of'],r['note']])
json.dump([{k:v for k,v in r.items() if k!='_fp'} for r in rows],open(SP+'/out/manifest.json','w'))
hashed=[r for r in rows if r['sha256']!='UNHASHED']
print('rows',len(rows),'hashed',len(hashed),'unique hashes',len(by),'dup rows',sum(1 for r in rows if r['duplicate_of']))
