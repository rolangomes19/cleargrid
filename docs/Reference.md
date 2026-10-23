# ClearGrid Borrower Profile: Reference

One reference for the whole project. Checked on 22 Oct 2026 against raw files, git, SHA-256 hashes and a headless browser run. Read L0 first. Go deeper only when L0 does not answer.

**Paths.** `RP/` = `C:\cleargrid-profile\cleargrid\` (git repo). `CP/` = `C:\cleargrid-profile\`. `OD/` = `C:\Users\dell\OneDrive\Documents\cleargrid\`. `git:<sha>` = a commit in RP. `brief:N` = line N of `docs/reference/brief.txt` (text of the brief PDF). `M` = `docs/reference/measure.json`. Every citation is `path:line`.
**Status.** verified, stated-only (no raw source in the inputs), contradicted, stale. **Evidence.** raw (opened or measured), derived (computed from raw), from-memory (rests on someone's recall).

---

## L0: read this first

**Key.** `RP/` = repo `C:\cleargrid-profile\cleargrid\`. `CP/` = `C:\cleargrid-profile\`. `OD/` = OneDrive `Documents\cleargrid\`. `L1`, `L2` = later sections of this file. IDs such as D36, P08, R01 are rows in the claim ledger (L2-B). `git:xxxxxxx` = commit in RP. `docs/reference/` = `RP/docs/reference/` (supporting files). `brief:N` = line N of `docs/reference/brief.txt`.

### Problem
- Collections agents run calls from the Borrower Profile page. The original stacks 18 card fields, 18 custom attributes, a 9-column deal table and 2 log tables at one weight. Five chevron sections hide the rest (`docs/reference/phase1-blind.md`).
- Documented diagnosis: it renders three scopes (borrower, account, event) as one flat list (`RP/docs/spec.md:11`).
- Brief asks for EN LTR and AR RTL desktop frames, hierarchy, reusable components, a short rationale and a Figma file in 48 h (`brief:119-140,345,383`).

### Approach
- One column per scope. A locked top band (the spine) never scrolls. Coral marks escalation only. No accordions. Every figure names its scope. Accounts sort by outstanding, high to low (`RP/CLAUDE.md:31-48`).
- A coded HTML prototype is the source of truth. Figma follows (`RP/docs/design-rationale.md:44-53`).
- Added beyond the brief: a case queue and a wrap-up screen (added in commit `git:0630e3e`).

### Current status
| Item | State | Where |
|---|---|---|
| Final build | `RP/dist/cleargrid-borrower-profile.html`, git `492a557` (22 Sep). SHA-256 `d2c296c797939805312826915acc32f02a662334662d7444d6c184fd7d422760` | L2-E |
| Build and tests | `build.sh` runs. `verify.js` exits 0. A fresh build of src matches dist byte for byte (after CRLF) | D35 |
| Rules vs build | Table rows checked against `RP/CLAUDE.md`: 13 match, 7 mismatch, 2 AA contrast fails, 1 note | `docs/reference/phase3-measure.md` |
| Claims tested | 88: 41 verified, 20 contradicted, 7 stale, 20 stated-only | L2-B |
| Figma file | Not in any input | D28 |
| Repo state | Working tree differs from HEAD by line endings only (8 files). 3 docs untracked. `src/` not edited by this work. Remote `origin` is GitHub. Local `design-system-refined` equals its last-fetched remote ref (`492a557`). Local `master` (`53b5742`) is 1 commit ahead of `origin/master` (`0630e3e`). Last-fetch state, not live | git status; `RP/.git/config`; `RP/.git/refs/` |
| File sprawl | 161 files hold 88 unique contents. Plan: keep 55, archive 33, drop 73. Nothing is deleted. Dry run first | `docs/reference/reduction-plan.md`, `docs/reference/reduce.ps1` |

### Where things live
| Need | File |
|---|---|
| Current build | `RP/dist/cleargrid-borrower-profile.html` |
| Source, rules, spec | `RP/src/` (7 files), `RP/CLAUDE.md`, `RP/TASKS.md`, `RP/docs/spec.md`, `RP/docs/design-rationale.md` |
| Original brief | `OD/cleargrid-borrower-profile-redesign-brief.pdf`. Text: `docs/reference/brief.txt` |
| 4 original screenshots | `OD/cleargrid-case-study/screenshots/01..04`. Same pixels as the PDF images |
| Submission build (12 Sep) | `OD/cleargrid-case-study/redesign-preview.html` (= `git:9626d5f`) |
| Research and early prototypes | `CP/documents/`: persona research, dense-UI guide, wireframe, v2, v2.1, console v2, v3 |
| Evidence | `docs/reference/`: `manifest.csv` (hash, canonical copy, action), `claims.csv`, `measure.json`, `phase1-blind.md`, `phase3-measure.md`, `answer-key.md`, `verification-report.md`, `reduction-plan.md`, `reduce.ps1`, `scripts/` |
| Stale, do not use | `CP/CLAUDE.md`, `CP/TASKS.md`, `CP/documents/cleargridborrowerprofile.html`, `CP/case-study-materials/00-START-HERE.md` (4 claims wrong) |

### Known contradictions and unverified claims (top 8; full list L2-B)
| # | Docs say | Raw says | ID |
|---|---|---|---|
| 1 | dist equals OneDrive redesign-preview (`CP/documents/technical-round-prep.md:342`). 09-final-product is the 73 KB submission build (`CP/case-study-materials/00-START-HERE.md:62`) | Preview is `git:9626d5f`, 73 KB. dist and 09-final-product are `git:492a557`, 99 KB | P08, P09 |
| 2 | Outer `CP/CLAUDE.md` (not the repo one): three tiers, 23 / 12.5 / 11.5 px (`CP/CLAUDE.md:52`) | Build is 12 / 13 / 16 / 24. Repo CLAUDE.md matches the build | D11 |
| 3 | Spine holds 7 facts (`CP/documents/interview-prep-guide.md:167`). Email Inbox left the rail (`RP/docs/spec.md:129`) | 6 `data-g` regions. The rail has Email Inbox (`RP/src/regions.js:62`) | D25, D14 |
| 4 | Coral cap is 3 and `verify.js` enforces it | The stress record (Mohammed, 7 accounts) paints 5 coral elements in 3 containers. `verify.js` counts 3 | D04, D05 |
| 5 | Two languages at 1280 (`RP/CLAUDE.md:3`) | The EN/AR toggle does nothing at 1280 until the nav collapse button is pressed | D36 |
| 6 | Arabic: Tajawal, 1.7 line height, one null glyph (`RP/CLAUDE.md:97,98,109`) | Money and dates use the mono stack. Display lines sit at 1.17. Two null forms | D37 to D39 |
| 7 | About 95% of cases are automated (`CP/documents/cleargrid-agent-persona-research.md:11`) | Stated only. The web page behind it is saved in no input | R01 |
| 8 | The AED 11,800 vs 16,000 header bug is in both ChatGPT prototypes (`RP/docs/spec.md:60`) | v2 only (`CP/documents/cleargrid-borrower-profile-v2.html:135,141`). v2.1 header 12,860 equals its deals (`CP/documents/cleargrid-borrower-profile-v2.1.html:43-45`) | P01, P02 |

### Open decisions (owner)
| # | Decision | Why it matters |
|---|---|---|
| 1 | Figma file: build it, or submit the HTML as the deliverable | Brief requires Figma (`brief:345`). None exists in the inputs |
| 2 | Define a coral "element": painted mark or container | Decides if stress breaks the cap (5 vs 3) |
| 3 | Which file to present. Whether to re-export the OneDrive preview from dist | Preview is 3 commits behind: no queue, no wrap-up, old type system |
| 4 | Is "None on record" a null? If yes, one form only | `RP/CLAUDE.md:109` allows one glyph |
| 5 | Fix the 1280 language toggle and the Arabic font and line height | Defects. `src/` was not touched here |

---

## L1: one section per stage

### L1-1 Brief
**What it asks.** Redesign the Borrower Profile for agents. EN LTR and AR RTL. Desktop only.

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
**Status:** 18 claims: 5 verified, 2 contradicted, 1 stale, 10 stated-only.

| File | Hash | Holds |
|---|---|---|
| `CP/documents/cleargrid-agent-persona-research.md` | 48436525 | Who uses the page. 95% automation. Six borrower states. Escalation reason gap. Sources are web pages fetched 10 Sep and not saved |
| `CP/documents/dense-ui-design-guide.md` | a7b9b730 | Literature base: Cowan, Healey, Wolfe, Cockburn, alert fatigue. Salience cap of 3 has no derivation (`:235`) |
| `CP/documents/cleargrid-design-assumptions.md` | 92f5ef57 | 13 assumptions with confidence. Read in an earlier pass, not ledgered |
| `CP/documents/cleargrid-design.md` | e7fc13b7 | Brand tokens from the live site. Not ledgered |
| `RP/docs/cleargrid-decision-defensibility-audit.md` | 901fa2c2 | Decision ledger and metric ledger method. Contrast math. 2 of its numbers fail recompute (R16, R17) |

**What holds.** Everything read off the screenshots, and the arithmetic. **What does not.** Every claim about ClearGrid as a company is stated-only. The web pages are not in the inputs, and the web was not searched.
**Read next:** the persona research `:11-20,90`, the guide `:185,221,235`, the audit `:31-58`.

### L1-3 Prototypes
**Status:** 21 claims: 12 verified, 4 contradicted, 2 stale, 3 stated-only.

| Dubai time | Artefact | Hash | What it is |
|---|---|---|---|
| 11 Sep 10:01 | `CP/documents/borrower-profile-wireframe.html` | 00bfda27 | Wireframe v1, 3-layout toggle |
| 11 Sep 13:17 | `CP/documents/cleargrid-borrower-profile-v2.html` | cc531a81 | ChatGPT v2. Header 11,800 vs deals 16,000. Reads deals[0] |
| 11 Sep 13:57 | `CP/documents/cleargrid-borrower-profile-v2.1.html` | 10549528 | ChatGPT v2.1. Reconciles (12,860) |
| 11 Sep 14:54 | `CP/documents/cleargrid-borrower-profile-console-v2-claude.html` | 8912de7c | Claude console v2 |
| 11 Sep 15:33 | `CP/documents/cleargrid-borrower-profile-v3.html` | 727d9531 | First v3 build |
| 11 Sep 19:52 | `CP/cleargrid-v3-project.tar.gz` | 4bc64e74 | v3 project packed before git. Dist 57,110 B |
| 11 Sep 21:32 | `CP/documents/cleargridborrowerprofile.html` | 1a0542bd | v3.1 snapshot. Has the DPD bar. Stale |
| 12 Sep 11:25 | `OD/cleargrid-case-study/redesign-preview.html` | 33115154 | Submission build = `git:9626d5f` |
| 22 Sep 22:23 | `RP/dist/cleargrid-borrower-profile.html` | d2c296c7 | Current build = `git:492a557` |

**Read next:** the git table in L2-D, and `CP/documents/cleargrid-borrower-profile-analysis-and-v2-decisions.docx` (V1 issues, paragraphs 18-35).

### L1-4 Final output
**Build:** `./build.sh` joins `RP/src/` into one HTML file. `node test/verify.js` runs 4 records x 2 directions in jsdom. Both pass. The browser run (16 combinations of record, language, width) is in `docs/reference/phase3-measure.md`.

| Rule (RP/CLAUDE.md) | Measured | Result |
|---|---|---|
| Three scopes, one column each (`:33`) | c-bor, c-acc, c-act at 1440 and 1280 | Match |
| Spine never scrolls, never moves (`:37`) | Page does not scroll. Spine unmoved by pane scroll. Stat positions shift per record | Match, with 1 mismatch (D03) |
| Max three coral elements (`:39`) | 2 / 3 / 5 / 0 painted. 2 / 2 / 3 / 0 containers | Mismatch or ambiguous (D04) |
| No accordions (`:42`) | 0 found | Match |
| Account sort by outstanding (`:47`) | Descending on all 4 records | Match |
| Type sizes 12, 13, 16, 24 (`:65`) | Exactly those, 16 runs | Match |
| Arabic line height x1.7, Tajawal (`:97-98`) | Display tier 1.17. Mono stack on money and log dates | Mismatch (D37, D38) |
| One null glyph (`:109`) | En dash plus the sentence "None on record" | Mismatch (D39) |
| Desktop 1440, degrade to 1280 (`:3`) | No overflow. Language toggle dead at 1280 | Mismatch (D36) |
| Contrast | Null dash 3.23:1. Nav avatar 3.70:1. All other text passes 4.5:1 | 2 fails |

**Source files** (`RP/src/`): core.js 54 lines, i18n.js 152, data.js 126, components.js 55, regions.js 318, app.js 255, tokens.css 345, index.html 29.
**Read next:** `RP/CLAUDE.md`, `docs/reference/phase3-measure.md`, `RP/src/regions.js:3-62` (spine), `RP/test/verify.js`.

### L1-5 Decisions
**Status:** 41 claims: 21 verified, 14 contradicted, 4 stale, 2 stated-only.

| ID | Decision or claim | Status |
|---|---|---|
| D01 | Three scopes, one column each: borrower, account, activity | verified |
| D02 | The page never scrolls; the spine does not move when panes scroll | verified |
| D06 | No accordions or disclosure controls | verified |
| D08 | Account cards sort by outstanding, descending | verified |
| D09 | Four type sizes: 12, 13, 16, 24 | verified |
| D13 | The dev harness (top bar, squint toggle, audit panel) is gone from the product | verified |
| D29 | T1 to T4 are done (scoped promise, named working account, escalation cue, behavioural checks) | verified |
| D30 | Queue and wrap-up screens were added beyond the brief | verified |
| D35 | dist is built from src | verified |
| D03 | The spine is at identical coordinates on every record | contradicted |
| D04 | Maximum three coral elements on screen | contradicted |
| D14 | Email Inbox leaves the action rail and becomes a tab | contradicted |
| D24 | The single-file build stays self-contained | contradicted |
| D36 | The page works in English and Arabic at 1280 | contradicted |
| D37 | Tajawal for Arabic, never another face | contradicted |
| D38 | Arabic line height is x1.7 on every tier | contradicted |
| D39 | Nulls use one glyph, an en dash, in muted | contradicted |
| D40 | Outstanding appears four times across three scopes, each labelled, incl. a totals row | contradicted |
| D11 | Root CLAUDE.md (8096abeb) holds the current rules | stale |
| D12 | Root TASKS.md is the task queue | stale |
| D41 | docs/design-tokens.html is the current token reference | stale |

**Read next:** `RP/CLAUDE.md`, `RP/docs/spec.md:48-100`, `RP/docs/design-rationale.md:42-115`, `CP/documents/technical-round-prep.md:311-343`.

### L1-6 Trade-offs
**Status:** 8 claims: 3 verified, 0 contradicted, 0 stale, 5 stated-only.

| ID | Trade-off | Status |
|---|---|---|
| T01 | No accordions. Cost: a busier first screen. A rare field could get disclosure back | stated-only |
| T02 | Figma is sequenced last. Cost is none unless a Figma link is needed before the UI settles | stated-only |
| T03 | CDN fonts accepted. Offline Arabic falls back. Fix is mechanical | verified |
| T04 | Merchant name is not bilingual side by side; borrower name is | stated-only |
| T05 | Coral follows escalation reason, not portfolio median. A departure from the team's own research | stated-only |
| T06 | Muted null dash is kept quiet on purpose | verified |
| T07 | Customisation: three different answers (16 Sep answer, spec, prep guide) | stated-only |
| T08 | Nav avatar text fails AA | verified |

**Read next:** `RP/docs/design-rationale.md:42-160`, `CP/documents/interview-prep-guide.md` section 5 (decision table), `CP/documents/technical-round-prep.md:359`.

---

## L2: evidence

### L2-A Manifest
`docs/reference/manifest.csv`: 317 rows. Columns: place, path, sha256, size_bytes, mtime_utc, duplicate_of, canonical_copy, action, note. By place: C 228, zip 30, OneDrive 27, tar 18, project 14. 307 hashed. 10 project docs are UNHASHED (their text came back inline and cannot be written to disk). 65 hashes occur more than once (89 extra copies). `.git` objects are listed and hashed. Every file row also carries `canonical_copy`, `action` (keep, archive, drop) and `reason`. Totals for files outside `.git`: keep 55, archive 33, drop 73. Plan and rules: `docs/reference/reduction-plan.md`. `node_modules` and git `*.sample` hooks are excluded.

### L2-B Claim ledger
88 rows. Raw sources are `path:line`. The same table is `docs/reference/claims.csv`.

| id | claim | raw source (path:line) | type | status | note |
|---|---|---|---|---|---|
| R01 | About 95% of cases are automated, about 5% go to humans | CP/documents/cleargrid-agent-persona-research.md:11; RP/docs/spec.md:21; RP/docs/cleargrid-decision-defensibility-audit.md:97 | from-memory | stated-only | Quotes a web page fetched 10 Sep. The page is not saved in any input. Web not checked by instruction. Audit line 97 says Dealroom and TechCrunch agree: not checked. |
| R02 | The engine distinguishes six borrower states (inability, unwillingness, confusion, dispute, hardship, forgetfulness) | CP/documents/cleargrid-agent-persona-research.md:17; RP/docs/cleargrid-decision-defensibility-audit.md:85 | from-memory | stated-only | Same web source as R01. |
| R03 | Agents are scored on the same rubric as the AI | CP/documents/cleargrid-agent-persona-research.md:34 | from-memory | stated-only | Same web source as R01. |
| R04 | Contact windows, caps and do-not-contact are enforced at decision time | CP/documents/cleargrid-agent-persona-research.md:39-42 | from-memory | stated-only | Same web source as R01. Build treats only `review` and `dnc` as off (RP/src/regions.js:20). |
| R05 | Screenshots show Total Human Calls 1 and Total AI Calls 3 | CP/documents/cleargrid-agent-persona-research.md:30; OD/cleargrid-case-study/screenshots/01-main-borrower-info.png (img) | raw | verified | Read from the image. |
| R06 | No escalation reason appears in any of the 4 screenshots | CP/documents/cleargrid-agent-persona-research.md:90; OD/cleargrid-case-study/screenshots/01..04 (img) | raw | verified | Blind pass D13: 0 hits. The brief also has no such field (grep of brief text). |
| R07 | Custom Attributes, Broken Promise Details and Deal Activity Timeline are closed by default, 'confirmed in screenshots 2-4' | CP/documents/cleargrid-agent-persona-research.md:58; OD/cleargrid-case-study/screenshots/02-deal-activity-interaction-logs.png (img) | raw | verified | True from screenshot 2 only. Screenshots 3 and 4 show them open. Phone Numbers is also closed by default. Email Addresses is open by default. |
| R08 | Working memory holds about 4 chunks (Cowan), not 7 | CP/documents/dense-ui-design-guide.md:185,459 | from-memory | stated-only | The guide says it. The paper was not fetched. |
| R09 | Clinical alert override rates run 49% to 96% | CP/documents/dense-ui-design-guide.md:221; RP/docs/cleargrid-decision-defensibility-audit.md:105 | from-memory | stated-only | Source (Ancker et al.) not fetched. |
| R10 | Postattentive vision: previewing a layout gives no search advantage (Wolfe) | CP/documents/dense-ui-design-guide.md:102-104; RP/docs/spec.md:95 | from-memory | stated-only | Guide text exists. The paper was not fetched. |
| R11 | Overview+detail beats zooming for this screen (Cockburn, Karlson, Bederson) | CP/documents/dense-ui-design-guide.md:130,462; RP/docs/spec.md:97 | from-memory | stated-only | Source not fetched. |
| R12 | The cap of three salient elements comes from research | CP/documents/dense-ui-design-guide.md:235; RP/docs/cleargrid-decision-defensibility-audit.md:64,72 | derived | verified | It does not. The guide gives no derivation. The audit relabels it a designer budget (4 chunks minus 1 for the live call). Sources agree on that. |
| R13 | Salesforce density gain is 30% (dev blog) vs about 40% (third party) | RP/docs/cleargrid-decision-defensibility-audit.md:86,103 | from-memory | stated-only | Not fetched. |
| R14 | ClearGrid's own /ar/ site uses Western digits | RP/docs/cleargrid-decision-defensibility-audit.md:89 | from-memory | stated-only | Audit calls it a single-source observation. The build pins Western digits: M shows '12,860' in AR. |
| R15 | Teal on white is 3.70:1 and coral on white is 4.12:1 | RP/docs/cleargrid-decision-defensibility-audit.md:37-38 | derived | verified | Recomputed from hex with the WCAG formula: 3.70 and 4.12. |
| R16 | Muted #8A9094 on the page background is 3.04:1 | RP/docs/cleargrid-decision-defensibility-audit.md:42; RP/src/tokens.css:2-3 | derived | contradicted | Recomputed on --bg #F4F5F7 it is 2.96. On white it is 3.23. The audit does not name its background hex. |
| R17 | #71787C clears 4.5:1 on white | RP/docs/cleargrid-decision-defensibility-audit.md:49-56 | derived | contradicted | Recomputed 4.487. Misses 4.5 by 0.013. The #D93D30 proposal gives 4.51 and passes. |
| R18 | Corrected text tokens are #D93D30, #1D8756, #A36B09 | RP/docs/cleargrid-decision-defensibility-audit.md:53-55; RP/src/tokens.css:11-13 | derived | stale | Build uses darker tokens #B8342A, #17744A, #8A5A06 (git:492a557). On their own washes: 5.23, 5.17, 5.32. The audit values were replaced. |
| P01 | ChatGPT v2.html header shows AED 11,800 outstanding while its deal table sums to 16,000 | RP/docs/spec.md:60; CP/documents/technical-round-prep.md:352; CP/documents/cleargrid-borrower-profile-v2.html:135,141 | raw | verified | Line 135: outstanding 11800. Line 141: balances 11800 + 4200 = 16000 (my sum). |
| P02 | The same bug is 'verified in both ChatGPT prototypes' (v2 and v2.1) | RP/docs/spec.md:60; CP/case-study-materials/00-START-HERE.md:99-101; CP/documents/cleargrid-borrower-profile-v2.1.html:43-45 | raw | contradicted | v2.1 shows Omar outstanding AED 12,860 and its deals are 4,860 + 8,000 = 12,860. It reconciles. The bug is in v2 only. |
| P03 | v2 hardcodes deals[0], leaving the second account unreachable | CP/case-study-materials/00-START-HERE.md:99-100; CP/documents/cleargrid-borrower-profile-v2.html:200 | raw | verified | True for v2. v2.1 has no deals[0] (grep). |
| P04 | v2.1 restates about 14 record-bar facts in 'Pre-call context' | RP/docs/spec.md:87; CP/documents/cleargrid-borrower-profile-v2.1.html:78-82 | derived | stated-only | Chunks 1 to 3 hold 13 items (4+5+4). The record bar was not counted. |
| P05 | The analysis doc lists repetition as defect number one | RP/docs/spec.md:89; CP/documents/cleargrid-borrower-profile-analysis-and-v2-decisions.docx (paragraphs 21-24) | raw | contradicted | In its V1 issues table, repetition is item 2. Item 1 is 'Escalation reason is incorrect'. The docx has no line numbers. |
| P06 | 625 DPD beside AED 0 overdue is a known contradiction | CP/documents/cleargrid-borrower-profile-analysis-and-v2-decisions.docx (paragraphs 31-32); OD/cleargrid-case-study/screenshots/01-main-borrower-info.png (img) | raw | verified | Blind pass X1 found it independently on screenshot 1. The docx found it too. |
| P07 | OneDrive redesign-preview.html is the submission build | CP/case-study-materials/00-START-HERE.md:62; OD/cleargrid-case-study/redesign-preview.html (mtime 12 Sep 07:25 UTC = 11:25 Dubai) | derived | verified | Hash 33115154074a equals a fresh build of git:9626d5f converted to CRLF. Submitted build = 9626d5f. |
| P08 | dist/ is the same file as OneDrive redesign-preview.html | CP/documents/technical-round-prep.md:342 | derived | stale | Now false. dist = git:492a557 (d2c296c7). Preview = git:9626d5f (33115154). Three commits apart. |
| P09 | 09-final-product holds the submission-ready build, about 73 KB | CP/case-study-materials/00-START-HERE.md:62,221-223; CP/case-study-materials/09-final-product/cleargrid-borrower-profile.html | derived | contradicted | The file is 99,241 B, hash d2c296c7, the 22 Sep build (git:492a557). The 73 KB file is the OneDrive preview (P07). |
| P10 | documents/cleargridborrowerprofile.html is a stale v3.1 snapshot that still has the DPD bar | CP/documents/technical-round-prep.md:342; CP/case-study-materials/00-START-HERE.md:118-120 | raw | verified | grep finds 'dpdbar' (4) and 'dpdScale' (2) in the file. Matches no git build (pre-git). |
| P11 | The tarball holds the v3 state packed 11 Sep 7:48 PM, before git | CP/case-study-materials/00-START-HERE.md:53; CP/cleargrid-v3-project.tar.gz | derived | verified | Its dist is 57,110 B, smaller than the first commit's build (58,575 B). Its app.js is 5,277 B vs 14,508 B now. No git build matches it. |
| P12 | The repo has 6 commits | CP/case-study-materials/00-START-HERE.md:214 | raw | verified | git log --all: ce57030, 213f634, 9626d5f, 0630e3e, 53b5742, 492a557. |
| P13 | Git was initialised 12 Sep 8:47 AM with a baseline snapshot | CP/case-study-materials/00-START-HERE.md:59 | raw | verified | git:ce57030, 2026-09-12 08:47:47 +0400. |
| P14 | There is a 10-day gap between the 12 Sep and 22 Sep commits | CP/case-study-materials/00-START-HERE.md:214-217 | derived | verified | git:9626d5f 12 Sep 09:44 to git:0630e3e 22 Sep 19:25 = 10 days 9 h 40 min. |
| P15 | The submission build landed 47h06m after the brief was saved | CP/case-study-materials/00-START-HERE.md:46,62 | derived | verified | Arithmetic holds: PDF mtime 10 Sep 12:19 Dubai to preview mtime 12 Sep 11:25 Dubai. 'Received' time is a file mtime, not a message time. Unverified. |
| P16 | The 4 production screenshots are not in the filesystem | CP/case-study-materials/00-START-HERE.md:76-78,259-260 | raw | contradicted | True inside CP only. They exist in OD/cleargrid-case-study/screenshots/ and inside the brief PDF (pages 3 and 4). All 4 pixel-identical to the PDF images. |
| P17 | The brief PDF is the brief as ClearGrid sent it | OD/cleargrid-borrower-profile-redesign-brief.pdf (metadata) | raw | stated-only | pdfinfo: Producer WeasyPrint 66.0, no Author, no CreationDate. The text matches the .md copy. Who rendered it is unknown. The zip is a Figma Make export, not the brief. |
| P18 | CHANGELOGs were written from memory after the working tree reverted, and the work was rebuilt from them | CP/case-study-materials/00-START-HERE.md:129-131,254-258; git:213f634 | raw | verified | The commit message says it rebuilt from both changelogs. The reversion itself is self-reported. No independent record. |
| P19 | About 1,080 lines of source, one 73 KB HTML, 3 commits | CP/documents/technical-round-prep.md:305 | derived | stale | Now 1,334 src lines (app 255, components 55, core 54, data 126, i18n 152, regions 318, tokens 345, index 29), dist 99,241 B, 6 commits. |
| P20 | Claude Code ran 15.5 h (about 7 h hands-on), 49 prompts, 11 Sep 8:02 PM to 12 Sep 11:32 AM | CP/documents/technical-round-prep.md:300-304 | from-memory | stated-only | Session logs are not in the inputs. Git shows first commit 12 Sep 08:47, consistent but not proof. |
| P21 | START-HERE timeline times come from file times | CP/case-study-materials/00-START-HERE.md:42-66 | derived | verified | 5 anchors match manifest mtimes (UTC+4): brief PDF 10 Sep 12:19, screenshots 13:57, Figma Make zip 15:33, v3 spec 11 Sep 15:26, submission preview 12 Sep 11:25. Tarball: START-HERE says 19:48, file says 19:52. Times are file mtimes, not event times. |
| D01 | Three scopes, one column each: borrower, account, activity | RP/CLAUDE.md:33-36; RP/docs/spec.md:50-64 | raw | verified | M: columns c-bor, c-acc, c-act at 1440 (320/480/456 px) and 1280 (320/480/416 px) on all records. |
| D02 | The page never scrolls; the spine does not move when panes scroll | RP/CLAUDE.md:37-38 | raw | verified | M: scrollHeight 900 = viewport 900, scrollWidth = viewport, spine rect unchanged after a 200 px pane scroll. 16 runs. |
| D03 | The spine is at identical coordinates on every record | RP/docs/spec.md:119; RP/CLAUDE.md:37 | raw | contradicted | Outer rect identical on all 4 records. The 3 stats shift: Outstanding x at 1440 EN is 715 (omar), 804 (aisha), 727 (stress), 888 (sparse). Cause: RP/src/tokens.css:170. Pixels approximate (fonts not loaded). |
| D04 | Maximum three coral elements on screen | RP/CLAUDE.md:39 | raw | contradicted | Painted coral elements: omar 2, aisha 3, stress 5, sparse 0. By container (band + cards): 2, 2, 3, 0. Rule holds only if 'element' means container. The user decides the definition. |
| D05 | verify.js enforces the coral cap | RP/CLAUDE.md:13-14; RP/test/verify.js:17,32 | raw | contradicted | It counts [data-alert='1'] only: 2, 1, 3, 0. Painted: 2, 3, 5, 0 (D04). |
| D06 | No accordions or disclosure controls | RP/CLAUDE.md:42; RP/docs/design-rationale.md:55-68 | raw | verified | M: 0 matches for details, summary, aria-expanded, aria-controls, .accordion, data-toggle on 16 runs. |
| D07 | Every figure carries its scope in the label | RP/CLAUDE.md:43-44 | raw | verified | Spine: 'across N accounts', 'on <lender>', 'N open across 2 accounts' (RP/src/regions.js:47-55). Spot check on omar only. |
| D08 | Account cards sort by outstanding, descending | RP/CLAUDE.md:47-48 | raw | verified | M: sortedDesc true on all 4 records (stress has 7 cards). Order held after flags: stress selected card is the 4th of 7, not the first. |
| D09 | Four type sizes: 12, 13, 16, 24 | RP/CLAUDE.md:65-69 | raw | verified | M: computed sizes are exactly {12,13,16,24} on all 16 runs. 0 off-scale. Weights {400,500,600}; 500 only on mono display. |
| D10 | Type history: how many sizes before consolidation | RP/CLAUDE.md:52; CP/case-study-materials/08-git-history/commit-messages-and-stats.md:7; CP/case-study-materials/00-START-HERE.md:37-38,198; CP/documents/technical-round-prep.md:334 | raw | contradicted | CLAUDE.md says 16 down to 6 down to 4. The commit says 13 sizes to 4 tokens. START-HERE says 16, 6, 4. Prep says three text tiers. Both counts shown, not resolved. |
| D11 | Root CLAUDE.md (8096abeb) holds the current rules | CP/CLAUDE.md:52; CP/case-study-materials/04-v3-spec-and-build/CLAUDE-root-original-ruleset.md:52 | derived | stale | It says three tiers: display 23px, primary 12.5/600, secondary 11.5/400. The build measures 24/13/12 (D09). Repo CLAUDE.md (e530ba8c) is current. A session started in the outer folder loads the stale rules. |
| D12 | Root TASKS.md is the task queue | CP/TASKS.md:36-43; RP/TASKS.md:5-75 | derived | stale | Root (031eb930, 2,285 B) stops at T6. Repo (09f248f0, 4,886 B) runs T1 to T12 with T7 to T12 marked done. |
| D13 | The dev harness (top bar, squint toggle, audit panel) is gone from the product | RP/CLAUDE.md:117-125 | raw | verified | grep of dist for squint, audit, harness: 0 hits. verify.js drives real nav controls (RP/test/verify.js:9-11). |
| D14 | Email Inbox leaves the action rail and becomes a tab | RP/docs/spec.md:129; RP/src/regions.js:62; RP/src/app.js:143 | raw | contradicted | The rail holds 6 buttons: Call, SMS, WhatsApp, Email, Email inbox, Log outcome. Email inbox opens the Messages tab. |
| D15 | Four of five action buttons are present | RP/docs/design-rationale.md:17 | raw | contradicted | All five channels are present, plus Log outcome (RP/src/regions.js:60-64). |
| D16 | The reason a paused channel is paused never shows | CP/documents/technical-round-prep.md:319 | raw | stale | Fixed by git:492a557 (message: 'disabled channels are aria-disabled with a plain-language tooltip'). M-extra: omar WhatsApp data-tip = 'Paused while the dispute is open' (RP/src/regions.js:23, RP/src/tokens.css:82-83). |
| D17 | Aisha's capped Call and Khalid's time-windowed Call look fully available | CP/documents/technical-round-prep.md:320; RP/src/data.js:54,82; RP/src/regions.js:20 | raw | verified | Only 'review' and 'dnc' render as off. Aisha and Khalid show no caption or lock. Still true. |
| D18 | The coral count is counted, not seen: audit 2/1/3/0, people see 2/3/5/0 | CP/documents/technical-round-prep.md:321 | raw | verified | M reproduces both rows exactly: data-alert 2/1/3/0, painted 2/3/5/0. |
| D19 | Mohammed opens on First Abu Dhabi while the top reason names Tamara | CP/documents/technical-round-prep.md:322 | raw | verified | M: stress selected card First Abu Dhabi; band text 'Borrower disputes the Tamara account'. |
| D20 | Khalid's Gender shows a bold dash while other empties are muted | CP/documents/technical-round-prep.md:323; RP/src/i18n.js:70 | raw | verified | Gender 'na' is the string en dash, rendered in .v, not .empty. DOM: Gender row value is plain. |
| D21 | 'None on record' at display size reads like a value | CP/documents/technical-round-prep.md:324; RP/src/i18n.js:17 | raw | verified | Sparse: .t-display.empty, 24px, muted, text 'None on record'. |
| D22 | Call, SMS, WhatsApp, Email do nothing on click | CP/documents/technical-round-prep.md:325; RP/src/app.js:122-159 | raw | verified | Handlers wired: b-compare, b-scope, b-entry, b-inbox, w-*, b-navcollapse. None on the four channel buttons. |
| D23 | Fonts load from Google, not embedded | CP/documents/technical-round-prep.md:326; RP/docs/design-rationale.md:70-72; RP/src/index.html:7-9 | raw | verified | Google Fonts links at index.html:7-9. Offline, Arabic falls back. |
| D24 | The single-file build stays self-contained | CP/case-study-materials/08-git-history/commit-messages-and-stats.md:49-51; RP/src/index.html:10 | raw | contradicted | The logo is inlined. Phosphor icons load from unpkg (index.html:10). dist is not self-contained: fonts and icons need the network. |
| D25 | The spine carries 7 facts | CP/documents/interview-prep-guide.md:167-169; CP/documents/technical-round-prep.md:333 | raw | contradicted | Build has 6 data-g regions (name, out, dpd, ptp, why, rail). Counting facts: 8 nodes (name, stage, language, owner, 3 stats, why) plus 6 rail buttons. Count depends on the rule used. |
| D26 | Latest AI contact and outcome sit in the top band | OD/design-rationale-simplified.md:30,145; CP/documents/technical-round-prep.md:335 | raw | contradicted | The spine has no AI-contact element (data-g list above). Doc is stale. |
| D27 | figma-handoff.md type weights | RP/docs/figma-handoff.md:5,17,23; CP/documents/technical-round-prep.md:336 | raw | verified | Line 5 says 700, line 17 says 400/600, line 23 says 400/500/600. It contradicts itself. Build measures {400,500,600}. |
| D28 | A hand-built Figma file exists (16 Sep) | CP/case-study-materials/00-START-HERE.md:63; OD/cleargrid-borrower-profile-redesign-brief.pdf (brief:345 requires Figma, docs/reference/brief.txt) | from-memory | stated-only | No Figma file or link in any input. The zip is a Figma Make export, not the user's design file. Not checked via the Figma connector. |
| D29 | T1 to T4 are done (scoped promise, named working account, escalation cue, behavioural checks) | RP/TASKS.md:5-34; RP/test/verify.js:44-69 | raw | verified | DOM: omar promise '1 open across 2 accounts · Personal loan'. Account head 'Working account · Gulf Meridian Bank · Credit card · CC-77102'. Aisha cue 'Reason for assignment'. verify.js passes. |
| D30 | Queue and wrap-up screens were added beyond the brief | git:0630e3e; RP/TASKS.md:45-55; RP/test/verify.js:94-111 | raw | verified | verify.js runs the full save and return round trip. Exit 0. |
| D31 | All six brief data groups A to F are represented and traced | RP/docs/design-rationale.md:15; RP/docs/spec.md:245-246 | derived | stated-only | Keyword probe on omar and stress found every group. Gaps in labels: Deal stage is an unlabelled badge; Custom Attributes is renamed Portfolio fields; the compare table has 9 columns and no Action column (brief:265, docs/reference/brief.txt). A full field trace was not done. |
| D32 | spec.md was extended with Part 11 for the agent journey | CP/case-study-materials/00-START-HERE.md:113-116; RP/docs/spec.md:432 | raw | verified | Part 11 at line 432. Repo spec 506 lines, hash 493b2949. |
| D33 | design-rationale.md is identical in documents/ and cleargrid/docs/ | CP/case-study-materials/00-START-HERE.md:249-251 | raw | verified | Both hash 6819e934. mtimes differ (23:42 and 23:59 on 11 Sep UTC). |
| D34 | The original v3 spec is 450 lines | CP/case-study-materials/00-START-HERE.md:108 | raw | verified | CP/documents/cleargrid-borrower-profile-v3-spec.md: 450 lines, hash c3893d42. |
| D35 | dist is built from src | RP/build.sh; RP/dist/cleargrid-borrower-profile.html | raw | verified | Fresh build of HEAD src, converted to CRLF, is byte-identical to the shipped dist. SHA-256 d2c296c7...d422760. Shipped dist was built on Windows (CRLF). |
| D36 | The page works in English and Arabic at 1280 | RP/CLAUDE.md:3; RP/src/app.js:78-79; RP/src/tokens.css:142-149 | raw | contradicted | At 1280 only the EN button shows. A real click does nothing (no .collapsed class). It works after the nav collapse button is pressed. verify.js cannot see it (jsdom has no media queries). |
| D37 | Tajawal for Arabic, never another face | RP/CLAUDE.md:97 | raw | contradicted | 8 Arabic-glyph elements per AR run use the JetBrains Mono stack: 5 money values (د.إ.) and 3 log dates with Arabic month names (.when.num). Tajawal is not in that stack. Rendering unverified (fonts blocked here). |
| D38 | Arabic line height is x1.7 on every tier | RP/CLAUDE.md:69,98; RP/src/tokens.css:19,34,44 | raw | contradicted | Display money with Arabic glyphs sits at 28/24 (1.17) and 16 sm at 24/16 (1.5). html[lang=ar] resets meta, body and title only. |
| D39 | Nulls use one glyph, an en dash, in muted | RP/CLAUDE.md:109; RP/src/i18n.js:17,87 | raw | contradicted | Stress and sparse also show a sentence ('None on record', 'لا يوجد وعد مسجل') in the promise slot. |
| D40 | Outstanding appears four times across three scopes, each labelled, incl. a totals row | RP/docs/spec.md:233; git:492a557 (message: 'Remove duplicate totals strip') | raw | contradicted | Omar now: spine sum once, card once, account column twice (display 4,860 and field row 4,860). Totals row is gone. Two same-scope instances in one column conflict with RP/CLAUDE.md:45-46. |
| D41 | docs/design-tokens.html is the current token reference | CP/case-study-materials/00-START-HERE.md:206-208; RP/docs/design-tokens.html:97,115,124 | raw | stale | It still lists display 23px, primary 12.5px, secondary 11.5px. The build is 24/13/12. Last changed 12 Sep 11:04, before the 22 Sep consolidation. START-HERE asked for this check. |
| T01 | No accordions. Cost: a busier first screen. A rare field could get disclosure back | CP/documents/technical-round-prep.md:359; RP/docs/design-rationale.md:55-68 | from-memory | stated-only | The cost is named. It was not measured. |
| T02 | Figma is sequenced last. Cost is none unless a Figma link is needed before the UI settles | RP/docs/design-rationale.md:44-53; OD/cleargrid-borrower-profile-redesign-brief.pdf (brief:345, docs/reference/brief.txt) | from-memory | stated-only | Brief lists a Figma file as required. No Figma file is in any input (D28). The condition for real cost may already be live. |
| T03 | CDN fonts accepted. Offline Arabic falls back. Fix is mechanical | RP/docs/design-rationale.md:70-81 | raw | verified | Tajawal and JetBrains Mono were not installed in the test sandbox and CDNs were blocked. Computed families as declared. Rendered glyphs unverified. |
| T04 | Merchant name is not bilingual side by side; borrower name is | RP/docs/design-rationale.md:83-100 | from-memory | stated-only | Design judgement. Not tested. |
| T05 | Coral follows escalation reason, not portfolio median. A departure from the team's own research | RP/docs/design-rationale.md:102-114; CP/documents/technical-round-prep.md:339 | from-memory | stated-only | Logic not tested. |
| T06 | Muted null dash is kept quiet on purpose | RP/src/tokens.css:50; RP/docs/cleargrid-decision-defensibility-audit.md:56 | raw | verified | 3.23:1 on white. Fails 4.5, passes 3. Audit leaves the dash out of its readable-copy fix. No doc names the 3:1 result. 128 hits over 16 runs. |
| T07 | Customisation: three different answers (16 Sep answer, spec, prep guide) | CP/documents/technical-round-prep.md:338 | from-memory | stated-only | Open. User must pick one line. |
| T08 | Nav avatar text fails AA | RP/src/tokens.css:108 | raw | verified | White on teal #069494 = 3.70:1 at 12 px. 16 hits. Newly surfaced. No doc mentions it. |

### L2-C Supersession map
| Item (hash) | State | Replaced by | Evidence |
|---|---|---|---|
| `CP/CLAUDE.md` (8096abeb) | stale | `RP/CLAUDE.md` (e530ba8c) | D11. Same hash as the copy loaded into a session opened in the outer folder |
| `CP/TASKS.md` (031eb930) | stale | `RP/TASKS.md` (09f248f0) | D12 |
| `CP/documents/cleargrid-borrower-profile-v3-spec.md` (c3893d42, 450 lines) | history | `RP/docs/spec.md` (493b2949, adds Part 11) | D32, D34 |
| `CP/documents/design-rationale.md` and `RP/docs/design-rationale.md` (6819e934) | same file, 2 copies | keep the RP copy | D33. Line 17 is wrong (D15) |
| `OD/design-rationale-simplified.md` (eba6dd6f) | stale | `RP/docs/design-rationale.md` | D26. Says AI contact sits in the top band |
| `RP/docs/figma-handoff.md` (17f1225e) | stale | `RP/CLAUDE.md` type table | D27. Contradicts itself on weights |
| `RP/docs/design-tokens.html` (a7bdf5c5) | stale | tokens in `RP/src/tokens.css` | D41 |
| `CP/documents/technical-round-prep.md` (b065a9d3, 20 Sep) | partly stale | this file | Section 8 build items: 1 stale, 7 still true, 1 untested (Figma). Lines 305 and 342 stale (P08, P19) |
| `CP/documents/interview-prep-guide.md` (de568a75) | partly stale | this file | D25. Says 7 spine facts |
| `CP/case-study-materials/00-START-HERE.md` (63a843ec) | digest, 4 claims wrong | this file | P09, P16, P02 (via line 99), D10 |
| `CP/documents/cleargridborrowerprofile.html` (1a0542bd) | stale | `RP/dist/...` | P10. Has the DPD bar |
| Git builds ce57030 to 9626d5f | history | `git:0630e3e`, `git:53b5742`, `git:492a557` (current) | L2-D |
| `OD/cleargrid-case-study/redesign-preview.html` (33115154) | submission build, behind dist | `RP/dist/...` (d2c296c7) | P07, P08 |
| `OD/cleargrid-case-study/UX Redesign and Assessment.zip` (b6126b55) | Figma Make export, not the brief | none | P17. Holds a Vite starter, AGENTS.md, an empty CLAUDE.md |

### L2-D Timeline from git (Dubai time)
| SHA | When | Subject | Files | Build bytes (CRLF) | Build hash |
|---|---|---|---|---|---|
| `ce57030` | 12 Sep 08:47 | Initial commit: baseline snapshot | 19 files, +3,074 | 59,460 | 3596d148 |
| `213f634` | 12 Sep 09:43 | Rebuild v3.1 and v3.2 from changelogs after tree reversion | 10 files, +1,036 -151 | 73,255 | a918af2f |
| `9626d5f` | 12 Sep 09:44 | Address review annotations: rail comments, promise size, nav icons, avatar | 2 files, +8 -3 | 73,205 | 33115154 (submission) |
| `0630e3e` | 22 Sep 19:25 | Add agent journey: queue and wrap-up screens | 9 files, +402 -100 | 86,388 | 5963a6ce |
| `53b5742` | 22 Sep 20:26 | Real Phosphor icons, real logo mark, queue-row alignment | 6 files, +32 -37 | 85,740 | 77a13c01 |
| `492a557` | 22 Sep 22:23 | Consolidate design system (Refined), polish interactions | 11 files, +566 -428 | 99,241 | d2c296c7 (current) |

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
- After `reduce.ps1 -Apply`, a path marked archive or drop in `manifest.csv` lives under `<root>\_archive\<run date>\` (drops under `_duplicates\`). `moves.csv` lists each move. Paths marked keep do not change. Citations in this file point to pre-run paths.
- `reduce.ps1` was syntax-checked and run (dry run, apply, undo, changed-file skip) with PowerShell 7.4.6 on Linux against a synthetic tree built from `manifest.csv`. It was not run on Windows PowerShell 5.1 or on the real folders.
- `docs/reference/scripts/` holds the scripts that produced this evidence. They contain sandbox paths. Edit them before reuse.
- The brief PDF's origin is unverified. The reversion incidents are self-reported.
