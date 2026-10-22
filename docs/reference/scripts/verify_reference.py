"""Phase 6b checks on the delivered tree.
usage: python3 -I verify_reference.py DELIVER_DIR HIST_DIR
 1 hash coverage + re-hash of every manifest row against the staged originals
 2 reverse coverage: staged files missing from the manifest
 3 every RP/CP/OD/docs path in Reference.md and claims.csv exists, and cited lines are inside the file
 4 git SHAs, ledger ids and hash tokens in Reference.md resolve
 5 em dashes, L0 length
Writes DELIVER_DIR/../checks.json and prints a summary."""
import csv, hashlib, io, json, os, re, sys, tarfile, zipfile, glob

D, HIST = sys.argv[1], sys.argv[2]
UP = '/mnt/user-data/uploads'
STAGE = {'CP': UP + '/cleargrid-profile', 'RP': UP + '/cleargrid-profile/cleargrid', 'OD': UP + '/cleargrid'}
WIN = [('C:\\Users\\dell\\OneDrive\\Documents\\cleargrid\\', STAGE['OD'] + '/'), ('C:\\cleargrid-profile\\', STAGE['CP'] + '/')]
REF = D + '/cleargrid/docs/Reference.md'
RDIR = D + '/cleargrid/docs/reference'
res = {}


def sha(b): return hashlib.sha256(b).hexdigest()


def stage_path(p):
    for a, b in WIN:
        if p.startswith(a):
            return b + p[len(a):].replace('\\', '/')


man = list(csv.DictReader(open(RDIR + '/manifest.csv', newline='', encoding='utf-8')))
claims = list(csv.DictReader(open(RDIR + '/claims.csv', newline='', encoding='utf-8')))

# 1 hash coverage and re-hash
cov = {'rows': len(man), 'unhashed_ok': 0, 'missing_hash': [], 'rehash_ok': 0, 'rehash_bad': [], 'missing_on_disk': [], 'member_ok': 0, 'member_bad': []}
zf = zipfile.ZipFile(UP + '/cleargrid/cleargrid-case-study/UX Redesign and Assessment.zip')
tf = tarfile.open(UP + '/cleargrid-profile/cleargrid-v3-project.tar.gz')
for r in man:
    h, p, pl = r['sha256'], r['path'], r['place']
    if pl == 'project':
        if h == 'UNHASHED': cov['unhashed_ok'] += 1
        elif not h: cov['missing_hash'].append(p)
        continue
    if not h:
        cov['missing_hash'].append(p); continue
    if pl in ('C', 'OneDrive'):
        sp = stage_path(p)
        if not sp or not os.path.isfile(sp): cov['missing_on_disk'].append(p); continue
        (cov['rehash_ok'] if sha(open(sp, 'rb').read()) == h else cov['rehash_bad']).append(p) if False else None
        if sha(open(sp, 'rb').read()) == h: cov['rehash_ok'] += 1
        else: cov['rehash_bad'].append(p)
    elif pl == 'zip':
        name = p.split('!', 1)[1]
        try: ok = sha(zf.read(name)) == h
        except KeyError: ok = False
        if ok: cov['member_ok'] += 1
        else: cov['member_bad'].append(p)
    elif pl == 'tar':
        name = p.split('!', 1)[1]
        try: ok = sha(tf.extractfile(name).read()) == h
        except Exception: ok = False
        if ok: cov['member_ok'] += 1
        else: cov['member_bad'].append(p)
res['coverage'] = cov

# 2 reverse coverage
listed = {stage_path(r['path']) for r in man if r['place'] in ('C', 'OneDrive')}
extra = []
for root in (UP + '/cleargrid-profile', UP + '/cleargrid'):
    for d, ds, fs in os.walk(root):
        if '/cowork-folders' in d or 'node_modules' in d: continue
        for f in fs:
            fp = os.path.join(d, f)
            if fp.endswith('.sample'): continue
            if fp not in listed: extra.append(fp)
res['staged_not_in_manifest'] = sorted(set(extra))[:20]
res['staged_not_in_manifest_n'] = len(set(extra))

# 3 citations
text = open(REF, encoding='utf-8').read()
alltxt = text + '\n' + '\n'.join(' '.join(c.values()) for c in claims)
ZIP = 'OD/cleargrid-case-study/UX Redesign and Assessment.zip'
alltxt = alltxt.replace(ZIP, 'OD/cleargrid-case-study/UX_ZIP')
tok = re.compile(r'(?<![\w/])((?:RP|CP|OD)/[^\s`;,:)|<>\'"]*|docs/Reference\.md|docs/reference/[^\s`;,:)|<>\'"]*)(?::(\d+(?:[-,]\d+)*))?')


def resolve(path):
    if path.startswith('docs/'):
        return D + '/cleargrid/' + path
    if '/' not in path:
        return STAGE[path]
    pre, rest = path.split('/', 1)
    if path.startswith('RP/docs/reference') or path == 'RP/docs/Reference.md':
        return D + '/cleargrid/' + path[3:]
    return STAGE[pre] + '/' + rest


seen, bad, skipped, linebad = {}, [], [], []
for m in tok.finditer(alltxt):
    path, lines = m.group(1).rstrip('.:'), m.group(2)
    if path.endswith('UX_ZIP'): path = path.replace('UX_ZIP', 'UX Redesign and Assessment.zip')
    if '*' in path or path.endswith('..') or re.search(r'/\d\d\.\.\d\d$', path):
        skipped.append(path); path = re.sub(r'/?[\d.*]+$|/\*\*$', '', path) or path
    if path.endswith('/'): path = path.rstrip('/')
    fp = resolve(path)
    if not os.path.exists(fp): bad.append(path); continue
    if lines and os.path.isfile(fp):
        n = len(open(fp, 'rb').read().splitlines())
        nums = [int(x) for x in re.split(r'[-,]', lines)]
        if max(nums) > n: linebad.append(f'{path}:{lines} (file has {n})')
    seen[path] = seen.get(path, 0) + 1
res['paths'] = {'distinct_checked': len(seen), 'citations': sum(seen.values()), 'missing': sorted(set(bad)), 'line_out_of_range': sorted(set(linebad)), 'wildcard_dir_checks': len(skipped)}

# brief:N
bn = len(open(RDIR + '/brief.txt', encoding='utf-8').read().splitlines())
bl = [int(x) for m in re.finditer(r'brief:([\d,\-]+)', alltxt) for x in re.split(r'[-,]', m.group(1)) if x]
res['brief_lines'] = {'max_cited': max(bl), 'file_lines': bn, 'ok': max(bl) <= bn}

# 4 shas, ids, hashes
shas = set(re.findall(r'git:([0-9a-f]{7})', alltxt))
known = {d for d in os.listdir(HIST)}
res['git_shas'] = {'cited': sorted(shas), 'unknown': sorted(shas - {k[:7] for k in known})}
ids = set(re.findall(r'\b([RPDT]\d{2})\b', text))
have = {c['id'] for c in claims}
res['ledger_ids'] = {'cited': len(ids), 'missing': sorted(ids - have)}
allowed = {r['sha256'] for r in man if r['sha256'] and r['sha256'] != 'UNHASHED'}
for f in glob.glob(HIST + '/*/dist/*.html'):
    b = open(f, 'rb').read()
    allowed.add(sha(b.replace(b'\r\n', b'\n').replace(b'\n', b'\r\n')))
hx = set(re.findall(r'`([0-9a-f]{8})`|\(([0-9a-f]{8})[,)]|\b([0-9a-f]{64})\b', text))
toks = {x for t in hx for x in t if x}
unres = sorted(t for t in toks if not any(h.startswith(t) for h in allowed))
res['hash_tokens'] = {'cited': len(toks), 'unresolved': unres}

# 5 style
ed = [os.path.relpath(f, D) for f in glob.glob(D + '/**/*', recursive=True) if os.path.isfile(f) and '/scripts/' not in f and '\u2014' in open(f, encoding='utf-8', errors='ignore').read()]
l0 = text[text.index('## L0'):text.index('## L1')].splitlines()
res['style'] = {'files_with_em_dash': ed, 'l0_lines': len(l0), 'l0_chars': sum(len(x) for x in l0)}
res['reference_sha256'] = sha(open(REF, 'rb').read())
json.dump(res, open(D + '/../checks.json', 'w'), indent=1)
print(json.dumps(res, indent=1)[:6000])
