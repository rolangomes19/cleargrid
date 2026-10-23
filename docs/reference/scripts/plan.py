"""Phase 5: add canonical_copy, action, reason to manifest.csv and write reduction-plan.md.
Run: python3 -I plan.py <out_dir>
Rules (first match wins). Nothing is deleted. archive = unique file moved out. drop = byte-identical extra copy moved out.
"""
import csv, sys, collections, os

OUT = sys.argv[1]
CP = 'C:\\cleargrid-profile\\'
OD = 'C:\\Users\\dell\\OneDrive\\Documents\\cleargrid\\'
RP = CP + 'cleargrid\\'

rows = list(csv.DictReader(open(os.path.join(OUT, 'manifest.csv'), newline='')))
base_cols = ['place', 'path', 'sha256', 'size_bytes', 'mtime_utc', 'duplicate_of', 'note']


def tier(p):
    """Lower wins as canonical copy of a hash group."""
    if p.startswith(RP):
        return 0
    if p.startswith(CP + 'documents\\'):
        return 1
    if p.startswith(OD + 'cleargrid-case-study\\'):
        return 3
    if p.startswith(OD):
        return 2
    if p.startswith(CP + 'case-study-materials\\'):
        return 5
    if p.startswith(CP + '.claude-crawl\\'):
        return 6
    return 4  # CP root files


# Unique-by-content files that leave the working tree. path -> reason.
ARCHIVE = {
    CP + 'CLAUDE.md': 'STALE. Says 23/12.5/11.5 px; build is 12/13/16/24. Claude Code loads it when opened in the outer folder (this session loaded a copy with hash 8096abeb). Repo CLAUDE.md is current',
    CP + 'TASKS.md': 'STALE. Repo TASKS.md (09f248f0) is current',
    CP + 'cleargrid-v3-project.tar.gz': 'Snapshot of the repo before 22 Sep. Git history holds every commit',
    CP + 'documents\\cleargridborrowerprofile.html': 'STALE 11 Sep snapshot with the DPD bar. Current build is the dist file',
    CP + 'case-study-materials\\00-START-HERE.md': 'Digest with 4 wrong claims (hash 63a843ec). docs/Reference.md replaces it',
    CP + 'case-study-materials\\08-git-history\\commit-log-with-full-diffs.txt': '475 KB. Regenerate with git log -p. Not cited',
    OD + 'design-rationale-simplified.md': 'STALE. Puts AI contact in the top band (D26). Repo design-rationale.md is current',
}
ARCHIVE_PREFIX = {
    CP + 'case-study-materials\\10-portfolio-presentation-research\\': 'Web crawl cache for portfolio-presentation advice. Unrelated to the redesign. Not read in this pass',
}
# Keep, but flag. Tracked repo files are never moved by a script: commit changes yourself.
FLAG = {
    RP + 'docs\\design-tokens.html': 'STALE (shows 23/12.5/11.5). Tracked: fix or delete via git',
    RP + 'docs\\figma-handoff.md': 'STALE (contradicts itself on weights). Tracked: fix or delete via git',
    RP + 'docs\\cleargrid-agent-journey-expansion.md': 'Untracked: run git add',
    RP + 'docs\\cleargrid-case-study-brief.md': 'Untracked: run git add',
    RP + 'docs\\cleargrid-decision-defensibility-audit.md': 'Untracked: run git add',
    CP + 'documents\\technical-round-prep.md': 'Partly stale (section 8 item 1, lines 305 and 342). See Reference L2-C',
    CP + 'documents\\interview-prep-guide.md': 'Partly stale (7 spine facts). See Reference L2-C',
    OD + 'this-is-an-ux-rosy-sketch.md': 'Raw original. Not read in this pass',
    OD + 'cleargrid-case-study\\showcase.html': 'Raw original. Not read in this pass',
    CP + 'documents\\cleargrid-interview-prep-context.md': 'Not read in this pass',
    CP + 'documents\\cleargrid-borrower-profile-v2.md': 'Not read in this pass',
    CP + 'documents\\cleargrid-borrower-profile-v2.html': 'History. Header bug (11,800 vs 16,000) lives only here',
}


def archive_reason(p):
    if p in ARCHIVE:
        return ARCHIVE[p]
    for k, v in ARCHIVE_PREFIX.items():
        if p.startswith(k):
            return v
    return None


def is_file_row(r):
    return r['place'] in ('C', 'OneDrive') and '!' not in r['path']


files = [r for r in rows if is_file_row(r) and '\\.git\\' not in r['path'] and r['sha256']]
groups = collections.defaultdict(list)
for r in files:
    groups[r['sha256']].append(r['path'])

canon = {}
for h, ps in groups.items():
    ps.sort(key=lambda p: (tier(p), p))
    cold = [p for p in ps if archive_reason(p)]
    # a group is cold if any member is listed; then the best-tier copy is the one archived
    canon[h] = ps[0]
    if cold and ps[0] not in cold:
        # listed member is not the best-tier copy: archive that member's group at its best-tier copy
        pass

by_path = {}
for r in rows:
    p, h = r['path'], r['sha256']
    action = reason = canonical = ''
    if r['place'] == 'project':
        canonical = p
        if h and h != 'UNHASHED':
            action, reason = 'keep', 'Claude project file. Same bytes as the OneDrive screenshot. Script never touches it'
            canonical = [q for q in groups.get(h, []) if q.startswith(OD)][0] if h in groups else p
        else:
            action, reason = 'keep', 'Claude project doc, not on disk, unhashed. Manual: project_write docs/Reference.md there'
    elif r['place'] in ('zip', 'tar'):
        container = p.split('!')[0]
        if r['place'] == 'tar':
            canonical = CP + 'cleargrid-v3-project.tar.gz'
            action, reason = 'archive', 'Member of archived tarball'
        else:
            canonical = OD + 'cleargrid-case-study\\UX Redesign and Assessment.zip'
            action, reason = 'keep', 'Member of kept Figma Make zip'
    elif '\\.git\\' in p:
        canonical, action, reason = p, 'keep', 'Git internals. Never moved'
    else:
        c = canon[h]
        canonical = c
        cold_group = any(archive_reason(q) for q in groups[h])
        if p == c:
            ar = None
            for q in groups[h]:
                ar = ar or archive_reason(q)
            if ar:
                action, reason = 'archive', ar
            elif p.startswith(RP):
                action, reason = 'keep', FLAG.get(p, 'Working repo. Tracked or untracked by git; scripts never move it')
            else:
                action, reason = 'keep', FLAG.get(p, 'Canonical copy of its hash')
        else:
            action = 'drop'
            reason = 'Byte-identical to ' + os.path.basename(c) + ' (' + ('archived' if cold_group else 'kept') + ' copy). Moved to _duplicates, not deleted'
    by_path[p] = (canonical, action, reason)

cols = base_cols + ['canonical_copy', 'action', 'reason']
with open(os.path.join(OUT, 'manifest.csv'), 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=cols, lineterminator='\n')
    w.writeheader()
    for r in rows:
        c, a, why = by_path[r['path']]
        r.update(canonical_copy=c, action=a, reason=why)
        w.writerow({k: r.get(k, '') for k in cols})

# ---- self-checks ----
move_rows = [r for r in rows if r['action'] in ('archive', 'drop') and is_file_row(r)]
assert not any('\\.git\\' in r['path'] for r in move_rows), 'git file would move'
survivors = collections.defaultdict(int)
for r in files:
    if by_path[r['path']][1] in ('keep', 'archive'):
        survivors[r['sha256']] += 1
lost = [h for h in groups if survivors[h] != 1]
assert not lost, ('hash groups without exactly one surviving copy', lost[:3])
for r in move_rows:
    if r['action'] == 'drop':
        assert by_path[r['canonical_copy']][1] in ('keep', 'archive')
print('rows', len(rows), 'moves', len(move_rows), 'hash groups', len(groups), 'one survivor per hash: OK')

# ---- reduction-plan.md ----
def short(p):
    return (p.replace(RP, 'RP/').replace(CP, 'CP/').replace(OD, 'OD/')).replace('\\', '/')

kc = collections.Counter(r['action'] for r in rows)
fc = collections.Counter(r['action'] for r in rows if is_file_row(r) and '\\.git\\' not in r['path'])
size = collections.Counter()
for r in move_rows:
    size[r['action']] += int(r['size_bytes'] or 0)
tot_files = len(files)
L = []
L.append('# Reduction plan (dry run)\n')
L.append('Nothing is moved by this file. `reduce.ps1` runs the plan, dry run by default. Nothing is deleted.\n')
L.append('| Item | Value |\n|---|---|')
L.append(f'| Files on disk (excl. `.git`, zip and tar members) | {tot_files} |')
L.append(f'| Unique contents (SHA-256) | {len(groups)} |')
L.append(f'| keep | {fc["keep"]} |')
L.append(f'| archive (unique file leaves the tree) | {fc["archive"]} |')
L.append(f'| drop (extra byte-identical copy leaves the tree) | {fc["drop"]} |')
L.append(f'| Files left in the working tree | {fc["keep"]} |')
L.append(f'| Bytes moved | archive {size["archive"]:,}; drop {size["drop"]:,} |')
L.append('| Check | Every hash keeps exactly one copy outside `_duplicates`. No `.git` file moves. Verified in `plan.py` |\n')
L.append('## Rules\n')
L.append('| # | Rule |\n|---|---|')
L.append('| 1 | One canonical copy per hash. Priority: repo, then `CP/documents/`, then OneDrive root, then OneDrive `cleargrid-case-study/`, then `CP/` root, then `case-study-materials/`, then `.claude-crawl/` |')
L.append('| 2 | Extra copies are `drop`: moved to `_archive/<date>/_duplicates/<same path>` on the same drive root. OneDrive copies stay inside OneDrive |')
L.append('| 3 | Stale or cold unique files are `archive`: moved to `_archive/<date>/<same path>` |')
L.append('| 4 | The script re-hashes each file and its canonical copy first. A mismatch skips the row |')
L.append('| 5 | Git-tracked files and `.git` never move. Stale tracked files are flagged only |')
L.append('| 6 | Zip and tar members follow their container |')
L.append('| 7 | Project docs (10, unhashed) are manual |\n')
L.append('## Archive (unique files)\n')
L.append('| File | Hash | Size | Reason |\n|---|---|---|---|')
arch_top = [r for r in move_rows if r['action'] == 'archive' and not r['path'].startswith(CP + 'case-study-materials\\10-')]
for r in sorted(arch_top, key=lambda r: r['path']):
    L.append(f'| `{short(r["path"])}` | {r["sha256"][:8]} | {int(r["size_bytes"]):,} | {r["reason"]} |')
a10 = [r for r in move_rows if r['action'] == 'archive' and r['path'].startswith(CP + 'case-study-materials\\10-')]
L.append(f'| `CP/case-study-materials/10-portfolio-presentation-research/**` ({len(a10)} files) | see manifest | {sum(int(r["size_bytes"]) for r in a10):,} | {ARCHIVE_PREFIX[CP + "case-study-materials\\10-portfolio-presentation-research\\"]} |\n')
L.append('## Drop (extra copies)\n')
L.append('| File | Hash | Kept copy |\n|---|---|---|')
for r in sorted([r for r in move_rows if r['action'] == 'drop'], key=lambda r: (r['canonical_copy'], r['path'])):
    L.append(f'| `{short(r["path"])}` | {r["sha256"][:8]} | `{short(r["canonical_copy"])}` |')
L.append('\n## Keep but flagged\n')
L.append('| File | Hash | Flag |\n|---|---|---|')
for r in rows:
    if r['action'] == 'keep' and r['path'] in FLAG:
        L.append(f'| `{short(r["path"])}` | {r["sha256"][:8]} | {r["reason"]} |')
L.append('\n## After you run it\n')
L.append('| Item | Detail |\n|---|---|')
L.append('| Where moved files go | `C:\\cleargrid-profile\\_archive\\<date>\\...` and `OneDrive\\Documents\\cleargrid\\_archive\\<date>\\...`. Same relative path. `moves.csv` in each lists from, to, hash |')
L.append('| Undo | `.\\reduce.ps1 -Undo <path to moves.csv> -Apply` |')
L.append('| Paths in Reference.md | A path marked archive or drop in `manifest.csv` now lives under `_archive`. Paths marked keep do not change |')
L.append('| Stale outer files | `CP/CLAUDE.md` and `CP/TASKS.md` leave the outer folder. Claude Code then stops loading the stale rules from there |')
L.append('| Backup | The repo has a GitHub remote (`RP/.git/config`). `documents/` is not in the repo. It has 3 copies now (C: documents, OneDrive, case-study-materials). After the run: C: documents, plus the OneDrive copy in `OD/_archive/<date>/_duplicates`. Only the OneDrive copy syncs |')
open(os.path.join(OUT, 'reduction-plan.md'), 'w').write('\n'.join(L) + '\n')
print(fc, size)
