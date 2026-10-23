# Verification report

Run: 22 Oct 2026. Target: `docs/Reference.md`, SHA-256 `20139ebc16222bd12ae18e482720528c5cb652571a04d9c50e1bfadb6d18ec23` (before this report was added).
Checker: `docs/reference/scripts/verify_reference.py`. Raw output: the run printed JSON; the figures below come from it.

## Result

| # | Check | Result | Detail |
|---|---|---|---|
| 1 | Every file has a hash | Pass | 317 manifest rows. 307 hashed. 10 unhashed are the Claude project docs (text came back inline, no bytes on disk) |
| 2 | Hashes match the files | Pass, 1 exception | 254 files and 48 zip or tar members re-hashed against the staged copies. All match except `RP/.git/index`. See note A |
| 3 | Manifest covers every file | Pass | 0 staged files are missing from the manifest. `node_modules` and `*.sample` hooks are excluded by design |
| 4 | Every cited path exists | Pass | 446 citations, 70 distinct paths, 0 missing |
| 5 | Every cited line is inside its file | Pass | 0 out of range. `brief:N` max 383, file has 413 lines |
| 6 | Cited commits exist | Pass | 6 of 6 (`ce57030 213f634 9626d5f 0630e3e 53b5742 492a557`) |
| 7 | Cited ledger ids exist | Pass | All resolve. `T12` is a TASKS.md task id, not a ledger row |
| 8 | Cited hash prefixes resolve | Pass | 18 of 18 match a manifest hash or a rebuilt commit build |
| 9 | No em dashes | Pass | 0 in `Reference.md` and every supporting file except `scripts/` |
| 10 | L0 fits one screen | Pass, soft | 60 lines, 5,944 characters |
| 11 | Fresh agent answers from L0 only | Pass after one fix | Run 1: 9 of 10. Run 2: 10 of 10. See table below |
| 12 | `reduce.ps1` | Pass on Linux PowerShell 7.4.6 | See below. Not run on Windows PowerShell 5.1 or the real folders |
| 13 | Build and tests | Pass | `bash build.sh` builds. `node test/verify.js` exits 0. Fresh build converted LF to CRLF is byte-identical to `dist` (d2c296c7) |

Note A. The staged `RP/.git/index` has a newer modified time (22 Oct 18:48 +0400) than the manifest (22 Sep). Git commands refresh the index. The manifest keeps the Phase 0 hash. Your real file was not touched. Nothing here writes to `.git`.

## Fresh-agent test (L0 only)

The agent read two files: the L0 text and the 10 questions. The answer key (`answer-key.md`) was written before `Reference.md` existed. It was not shown to the agent.

| Q | Topic | Run 1 | Run 2 |
|---|---|---|---|
| 1 | Final build and pin | Pass | Pass |
| 2 | 12 Sep submission build | Pass | Pass |
| 3 | Current vs stale CLAUDE.md | Pass | Pass |
| 4 | Core diagnosis and fix | Pass | Pass |
| 5 | Type sizes 12/13/16/24 | Pass | Pass |
| 6 | Stress coral: 5 painted, 3 containers, verify.js 3 | Pass | Pass |
| 7 | 1280 toggle defect | Pass | Pass |
| 8 | Spine: docs 7, build 6 | Pass | Pass |
| 9 | 95% stated only. Header bug in v2 only | **Fail** (not in L0) | Pass |
| 10 | Two open decisions | Pass | Pass |

Fixes made between runs: added a key line (`RP/`, `CP/`, `OD/`, `L1`, ledger ids), added contradiction rows 7 and 8 (the 95% claim and the v2 header bug), named the stress record, reworded open decision 3.
Edits after run 2, not retested: `docs/reference/` and `brief:N` added to the key line, "Outer `CP/CLAUDE.md`" label in contradiction row 2.
Run 2 reader still flagged: no definition of "spine" in L0, no build commands in L0, "23 checks" count not shown. Open.

## reduce.ps1 test (synthetic tree built from manifest.csv)

| Test | Result |
|---|---|
| Parse | 0 errors |
| Dry run | Lists 106 moves (33 archive, 73 drop). Tree unchanged |
| Apply | 106 moves. Every unique content kept exactly once outside `_duplicates`. 0 contents lost |
| Undo | Exact original tree restored |
| Edited drop-row file | Skipped ("changed") |
| Edited canonical copy | Its duplicates skipped ("no verified canonical copy") |
| `.git` files | Refused by rule. Plan has none |

## Not checked

| Item | Why |
|---|---|
| Web claims (R01 95%, benchmark claims) | Out of scope by instruction. Marked stated-only |
| Figma file | None in any input |
| 10 project docs | Unhashed. Read inline only |
| Arabic glyph rendering, pixel widths | Tajawal and JetBrains Mono not installed in the test browser |
| Real Chrome on your machine | Chromium only |
| Files listed in `Reference.md` L2-F as not read | Not read in this pass |
| `reduce.ps1` on Windows PowerShell 5.1 | No Windows host available |
