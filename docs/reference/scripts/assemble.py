#!/usr/bin/env python3
"""Assemble docs/Reference.md from claims.csv, manifest.csv and fixed text. Re-run after any input changes.
usage: assemble.py OUT_DIR   (reads OUT_DIR/claims.csv, OUT_DIR/manifest.csv, writes OUT_DIR/Reference.md)"""
import csv, sys, collections
O = sys.argv[1]
claims = list(csv.DictReader(open(O + "/claims.csv", encoding="utf-8")))
man = list(csv.DictReader(open(O + "/manifest.csv", encoding="utf-8")))
def esc(s): return s.replace("|", "\\|")
cnt = collections.Counter(c["status"] for c in claims)
byarea = collections.defaultdict(collections.Counter)
for c in claims: byarea[c["area"]][c["status"]] += 1
def areatxt(a):
    d = byarea[a]; n = sum(d.values())
    return f"{n} claims: {d['verified']} verified, {d['contradicted']} contradicted, {d['stale']} stale, {d['stated-only']} stated-only"
tot = len(claims)

# manifest stats
places = collections.Counter(r["place"] for r in man)
hashed = [r for r in man if r["sha256"] and r["sha256"] != "UNHASHED"]
unh = [r for r in man if r["sha256"] == "UNHASHED"]
grp = collections.defaultdict(list)
for r in hashed: grp[r["sha256"]].append(r)
dupgroups = {h: v for h, v in grp.items() if len(v) > 1}
excess = sum(len(v) - 1 for v in dupgroups.values())
isf = lambda r: r["place"] in ("C", "OneDrive") and "\\.git\\" not in r["path"] and r["sha256"]
fa = collections.Counter(r["action"] for r in man if isf(r))
nfiles = sum(fa.values()); nuniq = len({r["sha256"] for r in man if isf(r)})

def table(head, rows):
    out = "| " + " | ".join(head) + " |\n|" + "|".join("---" for _ in head) + "|\n"
    for r in rows: out += "| " + " | ".join(esc(str(x)) for x in r) + " |\n"
    return out

L = []
L.append(f"""# ClearGrid Borrower Profile: Reference

One reference for the whole project. Checked on 22 Oct 2026 against raw files, git, SHA-256 hashes and a headless browser run. Read L0 first. Go deeper only when L0 does not answer.

**Paths.** `RP/` = `C:\\cleargrid-profile\\cleargrid\\` (git repo). `CP/` = `C:\\cleargrid-profile\\`. `OD/` = `C:\\Users\\dell\\OneDrive\\Documents\\cleargrid\\`. `git:<sha>` = a commit in RP. `brief:N` = line N of `docs/reference/brief.txt` (text of the brief PDF). `M` = `docs/reference/measure.json`. Every citation is `path:line`.
**Status.** verified, stated-only (no raw source in the inputs), contradicted, stale. **Evidence.** raw (opened or measured), derived (computed from raw), from-memory (rests on someone's recall).

---

## L0: read this first

**Key.** `RP/` = repo `C:\\cleargrid-profile\\cleargrid\\`. `CP/` = `C:\\cleargrid-profile\\`. `OD/` = OneDrive `Documents\\cleargrid\\`. `L1`, `L2` = later sections of this file. IDs such as D36, P08, R01 are rows in the claim ledger (L2-B). `git:xxxxxxx` = commit in RP. `docs/reference/` = `RP/docs/reference/` (supporting files). `brief:N` = line N of `docs/reference/brief.txt`.

### Problem
- Collections agents run calls from the Borrower Profile page. The original stacks 18 card fields, 18 custom attributes, a 9-column deal table and 2 log tables at one weight. Five chevron sections hide the rest (`docs/reference/phase1-blind.md`).
- Documented diagnosis: it renders three scopes (borrower, account, event) as one flat list (`RP/docs/spec.md:11`).
- Brief asks for EN LTR and AR RTL desktop frames, hierarchy, reusable components, a short rationale and a Figma file in 48 h (`brief:119-140,345,383`).

### Approach
- One column per scope. A locked top band (the spine) never scrolls. Coral marks escalation only. No accordions. Every figure names its scope. Accounts sort by outstanding, high to low (`RP/CLAUDE.md:31-48`).
- A coded HTML prototype is the source of truth. Figma follows (`RP/docs/design-rationale.md:44-53`).
- Added beyond the brief: a case queue and a wrap-up screen (added in commit `git:0630e3e`).

### Current status
""")
L.append(table(["Item", "State", "Where"], [
 ["Final build", "`RP/dist/cleargrid-borrower-profile.html`, git `492a557` (22 Sep). SHA-256 `d2c296c797939805312826915acc32f02a662334662d7444d6c184fd7d422760`", "L2-E"],
 ["Build and tests", "`build.sh` runs. `verify.js` exits 0. A fresh build of src matches dist byte for byte (after CRLF)", "D35"],
 ["Rules vs build", "Table rows checked against `RP/CLAUDE.md`: 13 match, 7 mismatch, 2 AA contrast fails, 1 note", "`docs/reference/phase3-measure.md`"],
 ["Claims tested", f"{tot}: {cnt['verified']} verified, {cnt['contradicted']} contradicted, {cnt['stale']} stale, {cnt['stated-only']} stated-only", "L2-B"],
 ["Figma file", "Not in any input", "D28"],
 ["Repo state", "Working tree differs from HEAD by line endings only (8 files). 3 docs untracked. `src/` not edited by this work. Remote `origin` is GitHub. Local `design-system-refined` equals its last-fetched remote ref (`492a557`). Local `master` (`53b5742`) is 1 commit ahead of `origin/master` (`0630e3e`). Last-fetch state, not live", "git status; `RP/.git/config`; `RP/.git/refs/`"],
 ["File sprawl", f"{nfiles} files hold {nuniq} unique contents. Plan: keep {fa['keep']}, archive {fa['archive']}, drop {fa['drop']}. Nothing is deleted. Dry run first", "`docs/reference/reduction-plan.md`, `docs/reference/reduce.ps1`"],
]))
L.append("""
### Where things live
""")
L.append(table(["Need", "File"], [
 ["Current build", "`RP/dist/cleargrid-borrower-profile.html`"],
 ["Source, rules, spec", "`RP/src/` (7 files), `RP/CLAUDE.md`, `RP/TASKS.md`, `RP/docs/spec.md`, `RP/docs/design-rationale.md`"],
 ["Original brief", "`OD/cleargrid-borrower-profile-redesign-brief.pdf`. Text: `docs/reference/brief.txt`"],
 ["4 original screenshots", "`OD/cleargrid-case-study/screenshots/01..04`. Same pixels as the PDF images"],
 ["Submission build (12 Sep)", "`OD/cleargrid-case-study/redesign-preview.html` (= `git:9626d5f`)"],
 ["Research and early prototypes", "`CP/documents/`: persona research, dense-UI guide, wireframe, v2, v2.1, console v2, v3"],
 ["Evidence", "`docs/reference/`: `manifest.csv` (hash, canonical copy, action), `claims.csv`, `measure.json`, `phase1-blind.md`, `phase3-measure.md`, `answer-key.md`, `verification-report.md`, `reduction-plan.md`, `reduce.ps1`, `scripts/`"],
 ["Stale, do not use", "`CP/CLAUDE.md`, `CP/TASKS.md`, `CP/documents/cleargridborrowerprofile.html`, `CP/case-study-materials/00-START-HERE.md` (4 claims wrong)"],
]))
L.append("""
### Known contradictions and unverified claims (top 8; full list L2-B)
""")
L.append(table(["#", "Docs say", "Raw says", "ID"], [
 ["1", "dist equals OneDrive redesign-preview (`CP/documents/technical-round-prep.md:342`). 09-final-product is the 73 KB submission build (`CP/case-study-materials/00-START-HERE.md:62`)", "Preview is `git:9626d5f`, 73 KB. dist and 09-final-product are `git:492a557`, 99 KB", "P08, P09"],
 ["2", "Outer `CP/CLAUDE.md` (not the repo one): three tiers, 23 / 12.5 / 11.5 px (`CP/CLAUDE.md:52`)", "Build is 12 / 13 / 16 / 24. Repo CLAUDE.md matches the build", "D11"],
 ["3", "Spine holds 7 facts (`CP/documents/interview-prep-guide.md:167`). Email Inbox left the rail (`RP/docs/spec.md:129`)", "6 `data-g` regions. The rail has Email Inbox (`RP/src/regions.js:62`)", "D25, D14"],
 ["4", "Coral cap is 3 and `verify.js` enforces it", "The stress record (Mohammed, 7 accounts) paints 5 coral elements in 3 containers. `verify.js` counts 3", "D04, D05"],
 ["5", "Two languages at 1280 (`RP/CLAUDE.md:3`)", "The EN/AR toggle does nothing at 1280 until the nav collapse button is pressed", "D36"],
 ["6", "Arabic: Tajawal, 1.7 line height, one null glyph (`RP/CLAUDE.md:97,98,109`)", "Money and dates use the mono stack. Display lines sit at 1.17. Two null forms", "D37 to D39"],
 ["7", "About 95% of cases are automated (`CP/documents/cleargrid-agent-persona-research.md:11`)", "Stated only. The web page behind it is saved in no input", "R01"],
 ["8", "The AED 11,800 vs 16,000 header bug is in both ChatGPT prototypes (`RP/docs/spec.md:60`)", "v2 only (`CP/documents/cleargrid-borrower-profile-v2.html:135,141`). v2.1 header 12,860 equals its deals (`CP/documents/cleargrid-borrower-profile-v2.1.html:43-45`)", "P01, P02"],
]))
L.append("""
### Open decisions (owner)
""")
L.append(table(["#", "Decision", "Why it matters"], [
 ["1", "Figma file: build it, or submit the HTML as the deliverable", "Brief requires Figma (`brief:345`). None exists in the inputs"],
 ["2", "Define a coral \"element\": painted mark or container", "Decides if stress breaks the cap (5 vs 3)"],
 ["3", "Which file to present. Whether to re-export the OneDrive preview from dist", "Preview is 3 commits behind: no queue, no wrap-up, old type system"],
 ["4", "Is \"None on record\" a null? If yes, one form only", "`RP/CLAUDE.md:109` allows one glyph"],
 ["5", "Fix the 1280 language toggle and the Arabic font and line height", "Defects. `src/` was not touched here"],
]))

L.append(f"""
---

## L1: one section per stage

### L1-1 Brief
""".rstrip() + "\n")
L.append("""**What it asks.** Redesign the Borrower Profile for agents. EN LTR and AR RTL. Desktop only.

| Item | Fact | Source |
|---|---|---|
| Five issues named | visual hierarchy, data grouping, layout efficiency, component scalability, bilingual support | `brief:48-80` |
| Data groups | A borrower and loan (9 fields), B financial (6), C PTP and call logs (8), D deal table (9 columns), E account detail (7), F actions (5) | `brief:150-312` |
| Deliverables | Figma file with EN and AR frames, UX rationale (bullets or Loom) | `brief:340-352` |
| Weights | UX thinking 30, visual clarity 25, Arabic and RTL 25, initiative 20 | `brief:357-375` |
| Time | 48 hours | `brief:383` |
| Not in the brief | escalation reason, preferred language, contact eligibility, currency | grep of `docs/reference/brief.txt` |
| Provenance | PDF made by WeasyPrint 66.0, no author, no date. Who rendered it is unverified. Its 4 images equal the 4 screenshot files pixel for pixel | P17, P16 |

**Original defects, measured from the 4 screenshots** (`docs/reference/phase1-blind.md`):

| Defect | Count |
|---|---|
| Card fields, label above value | 18 (7 + 5 + 6) |
| Custom Attributes fields | 18 |
| Chevron sections, closed on load | 5, 4 closed |
| Concepts shown 2 or more times | 9. Total amount shows 3 times |
| Null forms | 3 (N/A, hyphen, blank) |
| Date and time formats | 4 |
| Amounts with a currency | 0 of 5 |
| Raw machine tokens | 5 (RPC, Rpc, IN_COLLECTION, CREDIT_CARD, Arabic_speaker) |
| Status colour in the body | 0 |
| Escalation reason, AI outcome text | 0 |
| On-screen contradictions | 3: Overdue 0.00 with 625 DPD; 1 human call vs 2 human phone logs; AI call before deal creation |

**Read next:** `OD/cleargrid-borrower-profile-redesign-brief.pdf`, `docs/reference/brief.txt`, `docs/reference/phase1-blind.md`.

### L1-2 Research
""")
L.append(f"**Status:** {areatxt('research')}.\n\n")
L.append(table(["File", "Hash", "Holds"], [
 ["`CP/documents/cleargrid-agent-persona-research.md`", "48436525", "Who uses the page. 95% automation. Six borrower states. Escalation reason gap. Sources are web pages fetched 10 Sep and not saved"],
 ["`CP/documents/dense-ui-design-guide.md`", "a7b9b730", "Literature base: Cowan, Healey, Wolfe, Cockburn, alert fatigue. Salience cap of 3 has no derivation (`:235`)"],
 ["`CP/documents/cleargrid-design-assumptions.md`", "92f5ef57", "13 assumptions with confidence. Read in an earlier pass, not ledgered"],
 ["`CP/documents/cleargrid-design.md`", "e7fc13b7", "Brand tokens from the live site. Not ledgered"],
 ["`RP/docs/cleargrid-decision-defensibility-audit.md`", "901fa2c2", "Decision ledger and metric ledger method. Contrast math. 2 of its numbers fail recompute (R16, R17)"],
]))
L.append("""
**What holds.** Everything read off the screenshots, and the arithmetic. **What does not.** Every claim about ClearGrid as a company is stated-only. The web pages are not in the inputs, and the web was not searched.
**Read next:** the persona research `:11-20,90`, the guide `:185,221,235`, the audit `:31-58`.

### L1-3 Prototypes
""")
L.append(f"**Status:** {areatxt('prototype')}.\n\n")
L.append(table(["Dubai time", "Artefact", "Hash", "What it is"], [
 ["11 Sep 10:01", "`CP/documents/borrower-profile-wireframe.html`", "00bfda27", "Wireframe v1, 3-layout toggle"],
 ["11 Sep 13:17", "`CP/documents/cleargrid-borrower-profile-v2.html`", "cc531a81", "ChatGPT v2. Header 11,800 vs deals 16,000. Reads deals[0]"],
 ["11 Sep 13:57", "`CP/documents/cleargrid-borrower-profile-v2.1.html`", "10549528", "ChatGPT v2.1. Reconciles (12,860)"],
 ["11 Sep 14:54", "`CP/documents/cleargrid-borrower-profile-console-v2-claude.html`", "8912de7c", "Claude console v2"],
 ["11 Sep 15:33", "`CP/documents/cleargrid-borrower-profile-v3.html`", "727d9531", "First v3 build"],
 ["11 Sep 19:52", "`CP/cleargrid-v3-project.tar.gz`", "4bc64e74", "v3 project packed before git. Dist 57,110 B"],
 ["11 Sep 21:32", "`CP/documents/cleargridborrowerprofile.html`", "1a0542bd", "v3.1 snapshot. Has the DPD bar. Stale"],
 ["12 Sep 11:25", "`OD/cleargrid-case-study/redesign-preview.html`", "33115154", "Submission build = `git:9626d5f`"],
 ["22 Sep 22:23", "`RP/dist/cleargrid-borrower-profile.html`", "d2c296c7", "Current build = `git:492a557`"],
]))
L.append("""
**Read next:** the git table in L2-D, and `CP/documents/cleargrid-borrower-profile-analysis-and-v2-decisions.docx` (V1 issues, paragraphs 18-35).

### L1-4 Final output
**Build:** `./build.sh` joins `RP/src/` into one HTML file. `node test/verify.js` runs 4 records x 2 directions in jsdom. Both pass. The browser run (16 combinations of record, language, width) is in `docs/reference/phase3-measure.md`.

""")
L.append(table(["Rule (RP/CLAUDE.md)", "Measured", "Result"], [
 ["Three scopes, one column each (`:33`)", "c-bor, c-acc, c-act at 1440 and 1280", "Match"],
 ["Spine never scrolls, never moves (`:37`)", "Page does not scroll. Spine unmoved by pane scroll. Stat positions shift per record", "Match, with 1 mismatch (D03)"],
 ["Max three coral elements (`:39`)", "2 / 3 / 5 / 0 painted. 2 / 2 / 3 / 0 containers", "Mismatch or ambiguous (D04)"],
 ["No accordions (`:42`)", "0 found", "Match"],
 ["Account sort by outstanding (`:47`)", "Descending on all 4 records", "Match"],
 ["Type sizes 12, 13, 16, 24 (`:65`)", "Exactly those, 16 runs", "Match"],
 ["Arabic line height x1.7, Tajawal (`:97-98`)", "Display tier 1.17. Mono stack on money and log dates", "Mismatch (D37, D38)"],
 ["One null glyph (`:109`)", "En dash plus the sentence \"None on record\"", "Mismatch (D39)"],
 ["Desktop 1440, degrade to 1280 (`:3`)", "No overflow. Language toggle dead at 1280", "Mismatch (D36)"],
 ["Contrast", "Null dash 3.23:1. Nav avatar 3.70:1. All other text passes 4.5:1", "2 fails"],
]))
L.append("""
**Source files** (`RP/src/`): core.js 54 lines, i18n.js 152, data.js 126, components.js 55, regions.js 318, app.js 255, tokens.css 345, index.html 29.
**Read next:** `RP/CLAUDE.md`, `docs/reference/phase3-measure.md`, `RP/src/regions.js:3-62` (spine), `RP/test/verify.js`.

### L1-5 Decisions
""")
L.append(f"**Status:** {areatxt('decision')}.\n\n")
dec = {c["id"]: c for c in claims}
rows = []
for i in ["D01","D02","D06","D08","D09","D13","D29","D30","D35","D03","D04","D14","D24","D36","D37","D38","D39","D40","D11","D12","D41"]:
    c = dec[i]; rows.append([i, c["claim"], c["status"]])
L.append(table(["ID", "Decision or claim", "Status"], rows))
L.append("""
**Read next:** `RP/CLAUDE.md`, `RP/docs/spec.md:48-100`, `RP/docs/design-rationale.md:42-115`, `CP/documents/technical-round-prep.md:311-343`.

### L1-6 Trade-offs
""")
L.append(f"**Status:** {areatxt('trade-off')}.\n\n")
L.append(table(["ID", "Trade-off", "Status"], [[c["id"], c["claim"], c["status"]] for c in claims if c["area"] == "trade-off"]))
L.append("""
**Read next:** `RP/docs/design-rationale.md:42-160`, `CP/documents/interview-prep-guide.md` section 5 (decision table), `CP/documents/technical-round-prep.md:359`.

---

## L2: evidence

### L2-A Manifest
""")
L.append(f"`docs/reference/manifest.csv`: {len(man)} rows. Columns: place, path, sha256, size_bytes, mtime_utc, duplicate_of, canonical_copy, action, note. By place: " + ", ".join(f"{k} {v}" for k, v in places.most_common()) + f". {len(hashed)} hashed. {len(unh)} project docs are UNHASHED (their text came back inline and cannot be written to disk). {len(dupgroups)} hashes occur more than once ({excess} extra copies). `.git` objects are listed and hashed. Every file row also carries `canonical_copy`, `action` (keep, archive, drop) and `reason`. Totals for files outside `.git`: keep {fa["keep"]}, archive {fa["archive"]}, drop {fa["drop"]}. Plan and rules: `docs/reference/reduction-plan.md`. `node_modules` and git `*.sample` hooks are excluded.\n")
L.append(f"""
### L2-B Claim ledger
{tot} rows. Raw sources are `path:line`. The same table is `docs/reference/claims.csv`.

""")
L.append("| id | claim | raw source (path:line) | type | status | note |\n|---|---|---|---|---|---|\n")
for c in claims:
    L.append("| " + " | ".join(esc(x) for x in (c["id"], c["claim"], c["raw_source"], c["evidence_type"], c["status"], c["note"])) + " |\n")
L.append("""
### L2-C Supersession map
""")
L.append(table(["Item (hash)", "State", "Replaced by", "Evidence"], [
 ["`CP/CLAUDE.md` (8096abeb)", "stale", "`RP/CLAUDE.md` (e530ba8c)", "D11. Same hash as the copy loaded into a session opened in the outer folder"],
 ["`CP/TASKS.md` (031eb930)", "stale", "`RP/TASKS.md` (09f248f0)", "D12"],
 ["`CP/documents/cleargrid-borrower-profile-v3-spec.md` (c3893d42, 450 lines)", "history", "`RP/docs/spec.md` (493b2949, adds Part 11)", "D32, D34"],
 ["`CP/documents/design-rationale.md` and `RP/docs/design-rationale.md` (6819e934)", "same file, 2 copies", "keep the RP copy", "D33. Line 17 is wrong (D15)"],
 ["`OD/design-rationale-simplified.md` (eba6dd6f)", "stale", "`RP/docs/design-rationale.md`", "D26. Says AI contact sits in the top band"],
 ["`RP/docs/figma-handoff.md` (17f1225e)", "stale", "`RP/CLAUDE.md` type table", "D27. Contradicts itself on weights"],
 ["`RP/docs/design-tokens.html` (a7bdf5c5)", "stale", "tokens in `RP/src/tokens.css`", "D41"],
 ["`CP/documents/technical-round-prep.md` (b065a9d3, 20 Sep)", "partly stale", "this file", "Section 8 build items: 1 stale, 7 still true, 1 untested (Figma). Lines 305 and 342 stale (P08, P19)"],
 ["`CP/documents/interview-prep-guide.md` (de568a75)", "partly stale", "this file", "D25. Says 7 spine facts"],
 ["`CP/case-study-materials/00-START-HERE.md` (63a843ec)", "digest, 4 claims wrong", "this file", "P09, P16, P02 (via line 99), D10"],
 ["`CP/documents/cleargridborrowerprofile.html` (1a0542bd)", "stale", "`RP/dist/...`", "P10. Has the DPD bar"],
 ["Git builds ce57030 to 9626d5f", "history", "`git:0630e3e`, `git:53b5742`, `git:492a557` (current)", "L2-D"],
 ["`OD/cleargrid-case-study/redesign-preview.html` (33115154)", "submission build, behind dist", "`RP/dist/...` (d2c296c7)", "P07, P08"],
 ["`OD/cleargrid-case-study/UX Redesign and Assessment.zip` (b6126b55)", "Figma Make export, not the brief", "none", "P17. Holds a Vite starter, AGENTS.md, an empty CLAUDE.md"],
]))
L.append("""
### L2-D Timeline from git (Dubai time)
""")
L.append(table(["SHA", "When", "Subject", "Files", "Build bytes (CRLF)", "Build hash"], [
 ["`ce57030`", "12 Sep 08:47", "Initial commit: baseline snapshot", "19 files, +3,074", "59,460", "3596d148"],
 ["`213f634`", "12 Sep 09:43", "Rebuild v3.1 and v3.2 from changelogs after tree reversion", "10 files, +1,036 -151", "73,255", "a918af2f"],
 ["`9626d5f`", "12 Sep 09:44", "Address review annotations: rail comments, promise size, nav icons, avatar", "2 files, +8 -3", "73,205", "33115154 (submission)"],
 ["`0630e3e`", "22 Sep 19:25", "Add agent journey: queue and wrap-up screens", "9 files, +402 -100", "86,388", "5963a6ce"],
 ["`53b5742`", "22 Sep 20:26", "Real Phosphor icons, real logo mark, queue-row alignment", "6 files, +32 -37", "85,740", "77a13c01"],
 ["`492a557`", "22 Sep 22:23", "Consolidate design system (Refined), polish interactions", "11 files, +566 -428", "99,241", "d2c296c7 (current)"],
]))
L.append("""
Other anchors (file mtimes): brief PDF 10 Sep 12:19. Screenshots 13:57. Figma Make zip 15:33. v3 spec 11 Sep 15:26. Prep guide 16 Sep 13:13. Technical prep 20 Sep 16:02. Gap between `9626d5f` and `0630e3e`: 10 days 9 h 40 min.

### L2-E Build pin
| Item | Value |
|---|---|
| File | `RP/dist/cleargrid-borrower-profile.html` |
| SHA-256 | `d2c296c797939805312826915acc32f02a662334662d7444d6c184fd7d422760` |
| Size | 99,241 bytes, CRLF line ends |
| Built from | `git:492a557` src. A fresh build of that src, converted LF to CRLF, is byte-identical |
| Also stored at | `CP/case-study-materials/09-final-product/cleargrid-borrower-profile.html` (same hash) |
| To check | `sha256sum dist/cleargrid-borrower-profile.html` (Windows: `Get-FileHash`) |
| Remote | `origin` = `https://github.com/rolangomes19/cleargrid.git` (`RP/.git/config:12`). Ref `origin/design-system-refined` = `492a557`. Last fetch, not checked live |
| Caveat | dist is not self-contained: Google Fonts and unpkg icons load from the network (D23, D24) |

### L2-F Limits
- No web research. Every external claim is stated-only.
- 10 project docs are unhashed. Their text was read inline.
- Not read in this pass: `CP/documents/cleargrid-interview-prep-context.md`, `cleargrid-borrower-profile-v2.md`, `OD/this-is-an-ux-rosy-sketch.md`, `OD/cleargrid-case-study/showcase.html`, `CP/case-study-materials/10-portfolio-presentation-research/`, `CHANGELOG*.md` (only their commit-level role), `RP/docs/cleargrid-case-study-brief.md`, `RP/docs/cleargrid-agent-journey-expansion.md`.
- Browser run used Chromium with Google Fonts and unpkg blocked. Tajawal and JetBrains Mono were not installed. Pixel widths and Arabic glyph rendering are unverified. Sizes, weights, colours and counts are valid.
- After `reduce.ps1 -Apply`, a path marked archive or drop in `manifest.csv` lives under `<root>\\_archive\\<run date>\\` (drops under `_duplicates\\`). `moves.csv` lists each move. Paths marked keep do not change. Citations in this file point to pre-run paths.
- `reduce.ps1` was syntax-checked and run (dry run, apply, undo, changed-file skip) with PowerShell 7.4.6 on Linux against a synthetic tree built from `manifest.csv`. It was not run on Windows PowerShell 5.1 or on the real folders.
- `docs/reference/scripts/` holds the scripts that produced this evidence. They contain sandbox paths. Edit them before reuse.
- The brief PDF's origin is unverified. The reversion incidents are self-reported.
""")
open(O + "/Reference.md", "w", encoding="utf-8").write("".join(L))
print("written", sum(len(x) for x in L), "chars")
