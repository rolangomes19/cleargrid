# Reduction plan (dry run)

Nothing is moved by this file. `reduce.ps1` runs the plan, dry run by default. Nothing is deleted.

| Item | Value |
|---|---|
| Files on disk (excl. `.git`, zip and tar members) | 161 |
| Unique contents (SHA-256) | 88 |
| keep | 55 |
| archive (unique file leaves the tree) | 33 |
| drop (extra byte-identical copy leaves the tree) | 73 |
| Files left in the working tree | 55 |
| Bytes moved | archive 1,050,133; drop 1,750,599 |
| Check | Every hash keeps exactly one copy outside `_duplicates`. No `.git` file moves. Verified in `plan.py` |

## Rules

| # | Rule |
|---|---|
| 1 | One canonical copy per hash. Priority: repo, then `CP/documents/`, then OneDrive root, then OneDrive `cleargrid-case-study/`, then `CP/` root, then `case-study-materials/`, then `.claude-crawl/` |
| 2 | Extra copies are `drop`: moved to `_archive/<date>/_duplicates/<same path>` on the same drive root. OneDrive copies stay inside OneDrive |
| 3 | Stale or cold unique files are `archive`: moved to `_archive/<date>/<same path>` |
| 4 | The script re-hashes each file and its canonical copy first. A mismatch skips the row |
| 5 | Git-tracked files and `.git` never move. Stale tracked files are flagged only |
| 6 | Zip and tar members follow their container |
| 7 | Project docs (10, unhashed) are manual |

## Archive (unique files)

| File | Hash | Size | Reason |
|---|---|---|---|
| `OD/design-rationale-simplified.md` | eba6dd6f | 7,086 | STALE. Puts AI contact in the top band (D26). Repo design-rationale.md is current |
| `CP/CLAUDE.md` | 8096abeb | 3,765 | STALE. Says 23/12.5/11.5 px; build is 12/13/16/24. Claude Code loads it when opened in the outer folder (this session loaded a copy with hash 8096abeb). Repo CLAUDE.md is current |
| `CP/TASKS.md` | 031eb930 | 2,285 | STALE. Repo TASKS.md (09f248f0) is current |
| `CP/case-study-materials/00-START-HERE.md` | 63a843ec | 20,921 | Digest with 4 wrong claims (hash 63a843ec). docs/Reference.md replaces it |
| `CP/case-study-materials/08-git-history/commit-log-with-full-diffs.txt` | 0102d9fe | 475,564 | 475 KB. Regenerate with git log -p. Not cited |
| `CP/cleargrid-v3-project.tar.gz` | 4bc64e74 | 64,489 | Snapshot of the repo before 22 Sep. Git history holds every commit |
| `CP/documents/cleargridborrowerprofile.html` | 1a0542bd | 67,502 | STALE 11 Sep snapshot with the DPD bar. Current build is the dist file |
| `CP/case-study-materials/10-portfolio-presentation-research/**` (26 files) | see manifest | 408,521 | Web crawl cache for portfolio-presentation advice. Unrelated to the redesign. Not read in this pass |

## Drop (extra copies)

| File | Hash | Kept copy |
|---|---|---|
| `CP/case-study-materials/04-v3-spec-and-build/CLAUDE-root-original-ruleset.md` | 8096abeb | `CP/CLAUDE.md` |
| `CP/.claude-crawl/reads/01-uxdesign-critique.md` | 316aa477 | `CP/case-study-materials/10-portfolio-presentation-research/reads/01-uxdesign-critique.md` |
| `CP/.claude-crawl/reads/02-uxplanet-prep.md` | 1b500030 | `CP/case-study-materials/10-portfolio-presentation-research/reads/02-uxplanet-prep.md` |
| `CP/.claude-crawl/reads/04-thecrit-presentation.md` | 461c4ff5 | `CP/case-study-materials/10-portfolio-presentation-research/reads/04-thecrit-presentation.md` |
| `CP/.claude-crawl/reads/05-thecrit-mistakes.md` | d2547aed | `CP/case-study-materials/10-portfolio-presentation-research/reads/05-thecrit-mistakes.md` |
| `CP/.claude-crawl/reads/06-interviewlane.md` | 8f32623f | `CP/case-study-materials/10-portfolio-presentation-research/reads/06-interviewlane.md` |
| `CP/.claude-crawl/reads/07-penroll-designlead.md` | e1916d54 | `CP/case-study-materials/10-portfolio-presentation-research/reads/07-penroll-designlead.md` |
| `CP/.claude-crawl/reads/08-hirevire-senior.md` | 5e5e485c | `CP/case-study-materials/10-portfolio-presentation-research/reads/08-hirevire-senior.md` |
| `CP/.claude-crawl/reads/09-nngroup-casestudy.md` | 31a9663e | `CP/case-study-materials/10-portfolio-presentation-research/reads/09-nngroup-casestudy.md` |
| `CP/.claude-crawl/reads/10-interns-substack.md` | 2b22d9e9 | `CP/case-study-materials/10-portfolio-presentation-research/reads/10-interns-substack.md` |
| `CP/.claude-crawl/reads/11-juliezhuo-substack.md` | faecf679 | `CP/case-study-materials/10-portfolio-presentation-research/reads/11-juliezhuo-substack.md` |
| `CP/.claude-crawl/reads/12-productinterview-conflict.md` | fe5b368a | `CP/case-study-materials/10-portfolio-presentation-research/reads/12-productinterview-conflict.md` |
| `CP/.claude-crawl/reads/13-finalroundai.md` | 743e8aff | `CP/case-study-materials/10-portfolio-presentation-research/reads/13-finalroundai.md` |
| `CP/.claude-crawl/reads/14-juliezhuo-critique-original.md` | b77574a9 | `CP/case-study-materials/10-portfolio-presentation-research/reads/14-juliezhuo-critique-original.md` |
| `CP/.claude-crawl/reads/15-cutscope.md` | 5d754d87 | `CP/case-study-materials/10-portfolio-presentation-research/reads/15-cutscope.md` |
| `CP/.claude-crawl/searches/ddg1.md` | 872dfb37 | `CP/case-study-materials/10-portfolio-presentation-research/searches/ddg1.md` |
| `CP/.claude-crawl/searches/ddg10.md` | 547e82ac | `CP/case-study-materials/10-portfolio-presentation-research/searches/ddg10.md` |
| `CP/.claude-crawl/searches/ddg11.md` | fd175770 | `CP/case-study-materials/10-portfolio-presentation-research/searches/ddg11.md` |
| `CP/.claude-crawl/searches/ddg2.md` | 9c3edbd5 | `CP/case-study-materials/10-portfolio-presentation-research/searches/ddg2.md` |
| `CP/.claude-crawl/searches/ddg3.md` | 1d038778 | `CP/case-study-materials/10-portfolio-presentation-research/searches/ddg3.md` |
| `CP/.claude-crawl/searches/ddg4.md` | 5a1c050d | `CP/case-study-materials/10-portfolio-presentation-research/searches/ddg4.md` |
| `CP/.claude-crawl/searches/ddg5.md` | d59ac386 | `CP/case-study-materials/10-portfolio-presentation-research/searches/ddg5.md` |
| `CP/.claude-crawl/searches/ddg6.md` | 8f5fabff | `CP/case-study-materials/10-portfolio-presentation-research/searches/ddg6.md` |
| `CP/.claude-crawl/searches/ddg7.md` | b5f37188 | `CP/case-study-materials/10-portfolio-presentation-research/searches/ddg7.md` |
| `CP/.claude-crawl/searches/ddg8.md` | f66198a6 | `CP/case-study-materials/10-portfolio-presentation-research/searches/ddg8.md` |
| `CP/.claude-crawl/searches/ddg9.md` | 59949bb5 | `CP/case-study-materials/10-portfolio-presentation-research/searches/ddg9.md` |
| `CP/.claude-crawl/searches/g1.md` | ed3bb6b4 | `CP/case-study-materials/10-portfolio-presentation-research/searches/g1.md` |
| `CP/case-study-materials/04-v3-spec-and-build/CHANGELOG-v3.2.md` | 7bd1cfe9 | `RP/CHANGELOG-v3.2.md` |
| `CP/case-study-materials/04-v3-spec-and-build/CHANGELOG.md` | 0896ceef | `RP/CHANGELOG.md` |
| `CP/case-study-materials/07-design-system-refinement-sep22/CLAUDE-current-ruleset.md` | e530ba8c | `RP/CLAUDE.md` |
| `CP/case-study-materials/07-design-system-refinement-sep22/TASKS.md` | 09f248f0 | `RP/TASKS.md` |
| `CP/case-study-materials/09-final-product/cleargrid-borrower-profile.html` | d2c296c7 | `RP/dist/cleargrid-borrower-profile.html` |
| `CP/case-study-materials/05-case-study-planning-docs/cleargrid-agent-journey-expansion.md` | 9f0174bc | `RP/docs/cleargrid-agent-journey-expansion.md` |
| `CP/case-study-materials/05-case-study-planning-docs/cleargrid-case-study-brief.md` | 313c088f | `RP/docs/cleargrid-case-study-brief.md` |
| `CP/case-study-materials/05-case-study-planning-docs/cleargrid-decision-defensibility-audit.md` | 901fa2c2 | `RP/docs/cleargrid-decision-defensibility-audit.md` |
| `OD/design-rationale.md` | 6819e934 | `RP/docs/design-rationale.md` |
| `CP/case-study-materials/04-v3-spec-and-build/design-rationale.md` | 6819e934 | `RP/docs/design-rationale.md` |
| `CP/documents/design-rationale.md` | 6819e934 | `RP/docs/design-rationale.md` |
| `CP/case-study-materials/07-design-system-refinement-sep22/design-tokens.html` | a7bdf5c5 | `RP/docs/design-tokens.html` |
| `CP/case-study-materials/04-v3-spec-and-build/figma-handoff.md` | 17f1225e | `RP/docs/figma-handoff.md` |
| `CP/case-study-materials/04-v3-spec-and-build/spec-current-with-part11-agent-journey.md` | 493b2949 | `RP/docs/spec.md` |
| `OD/borrower-profile-wireframe.html` | 00bfda27 | `CP/documents/borrower-profile-wireframe.html` |
| `CP/case-study-materials/03-early-iterations-sketch-v1-v2/borrower-profile-wireframe.html` | 00bfda27 | `CP/documents/borrower-profile-wireframe.html` |
| `OD/cleargrid-agent-persona-research.md` | 48436525 | `CP/documents/cleargrid-agent-persona-research.md` |
| `CP/case-study-materials/02-research-and-strategy/cleargrid-agent-persona-research.md` | 48436525 | `CP/documents/cleargrid-agent-persona-research.md` |
| `OD/cleargrid-borrower-profile-analysis-and-v2-decisions.docx` | f7a51bf0 | `CP/documents/cleargrid-borrower-profile-analysis-and-v2-decisions.docx` |
| `CP/case-study-materials/03-early-iterations-sketch-v1-v2/cleargrid-borrower-profile-analysis-and-v2-decisions.docx` | f7a51bf0 | `CP/documents/cleargrid-borrower-profile-analysis-and-v2-decisions.docx` |
| `OD/cleargrid-borrower-profile-console-v2-claude.html` | 8912de7c | `CP/documents/cleargrid-borrower-profile-console-v2-claude.html` |
| `CP/case-study-materials/03-early-iterations-sketch-v1-v2/cleargrid-borrower-profile-console-v2-claude.html` | 8912de7c | `CP/documents/cleargrid-borrower-profile-console-v2-claude.html` |
| `OD/cleargrid-case-study/cleargrid-borrower-profile-redesign-brief.md` | 527e6c1a | `CP/documents/cleargrid-borrower-profile-redesign-brief.md` |
| `CP/case-study-materials/01-original-brief/cleargrid-borrower-profile-redesign-brief.md` | 527e6c1a | `CP/documents/cleargrid-borrower-profile-redesign-brief.md` |
| `OD/cleargrid-borrower-profile-v2.1.html` | 10549528 | `CP/documents/cleargrid-borrower-profile-v2.1.html` |
| `CP/case-study-materials/03-early-iterations-sketch-v1-v2/cleargrid-borrower-profile-v2.1.html` | 10549528 | `CP/documents/cleargrid-borrower-profile-v2.1.html` |
| `OD/cleargrid-borrower-profile-v2.html` | cc531a81 | `CP/documents/cleargrid-borrower-profile-v2.html` |
| `CP/case-study-materials/03-early-iterations-sketch-v1-v2/cleargrid-borrower-profile-v2.html` | cc531a81 | `CP/documents/cleargrid-borrower-profile-v2.html` |
| `OD/cleargrid-borrower-profile-v2.md` | 743131b4 | `CP/documents/cleargrid-borrower-profile-v2.md` |
| `CP/case-study-materials/03-early-iterations-sketch-v1-v2/cleargrid-borrower-profile-v2.md` | 743131b4 | `CP/documents/cleargrid-borrower-profile-v2.md` |
| `OD/cleargrid-borrower-profile-v3-spec.md` | c3893d42 | `CP/documents/cleargrid-borrower-profile-v3-spec.md` |
| `CP/case-study-materials/04-v3-spec-and-build/v3-spec-original-11sep.md` | c3893d42 | `CP/documents/cleargrid-borrower-profile-v3-spec.md` |
| `OD/cleargrid-borrower-profile-v3.html` | 727d9531 | `CP/documents/cleargrid-borrower-profile-v3.html` |
| `CP/case-study-materials/04-v3-spec-and-build/v3-html-original-11sep.html` | 727d9531 | `CP/documents/cleargrid-borrower-profile-v3.html` |
| `OD/cleargrid-design-assumptions.md` | 92f5ef57 | `CP/documents/cleargrid-design-assumptions.md` |
| `CP/case-study-materials/02-research-and-strategy/cleargrid-design-assumptions.md` | 92f5ef57 | `CP/documents/cleargrid-design-assumptions.md` |
| `OD/cleargrid-design.md` | e7fc13b7 | `CP/documents/cleargrid-design.md` |
| `CP/case-study-materials/02-research-and-strategy/cleargrid-design.md` | e7fc13b7 | `CP/documents/cleargrid-design.md` |
| `OD/cleargrid-interview-prep-context.md` | 3690b847 | `CP/documents/cleargrid-interview-prep-context.md` |
| `CP/case-study-materials/06-interview-prep-and-mock-interview/cleargrid-interview-prep-context.md` | 3690b847 | `CP/documents/cleargrid-interview-prep-context.md` |
| `OD/cleargridborrowerprofile.html` | 1a0542bd | `CP/documents/cleargridborrowerprofile.html` |
| `CP/case-study-materials/04-v3-spec-and-build/v3.1-snapshot-11sep-932pm-superseded.html` | 1a0542bd | `CP/documents/cleargridborrowerprofile.html` |
| `OD/dense-ui-design-guide.md` | a7b9b730 | `CP/documents/dense-ui-design-guide.md` |
| `CP/case-study-materials/02-research-and-strategy/dense-ui-design-guide.md` | a7b9b730 | `CP/documents/dense-ui-design-guide.md` |
| `CP/case-study-materials/06-interview-prep-and-mock-interview/interview-prep-guide.md` | de568a75 | `CP/documents/interview-prep-guide.md` |
| `CP/case-study-materials/06-interview-prep-and-mock-interview/technical-round-prep.md` | b065a9d3 | `CP/documents/technical-round-prep.md` |

## Keep but flagged

| File | Hash | Flag |
|---|---|---|
| `RP/docs/cleargrid-agent-journey-expansion.md` | 9f0174bc | Untracked: run git add |
| `RP/docs/cleargrid-case-study-brief.md` | 313c088f | Untracked: run git add |
| `RP/docs/cleargrid-decision-defensibility-audit.md` | 901fa2c2 | Untracked: run git add |
| `RP/docs/design-tokens.html` | a7bdf5c5 | STALE (shows 23/12.5/11.5). Tracked: fix or delete via git |
| `RP/docs/figma-handoff.md` | 17f1225e | STALE (contradicts itself on weights). Tracked: fix or delete via git |
| `CP/documents/cleargrid-borrower-profile-v2.html` | cc531a81 | History. Header bug (11,800 vs 16,000) lives only here |
| `CP/documents/cleargrid-borrower-profile-v2.md` | 743131b4 | Not read in this pass |
| `CP/documents/cleargrid-interview-prep-context.md` | 3690b847 | Not read in this pass |
| `CP/documents/interview-prep-guide.md` | de568a75 | Partly stale (7 spine facts). See Reference L2-C |
| `CP/documents/technical-round-prep.md` | b065a9d3 | Partly stale (section 8 item 1, lines 305 and 342). See Reference L2-C |
| `OD/cleargrid-case-study/showcase.html` | f41208da | Raw original. Not read in this pass |
| `OD/this-is-an-ux-rosy-sketch.md` | 4fbc242d | Raw original. Not read in this pass |

## After you run it

| Item | Detail |
|---|---|
| Where moved files go | `C:\cleargrid-profile\_archive\<date>\...` and `OneDrive\Documents\cleargrid\_archive\<date>\...`. Same relative path. `moves.csv` in each lists from, to, hash |
| Undo | `.\reduce.ps1 -Undo <path to moves.csv> -Apply` |
| Paths in Reference.md | A path marked archive or drop in `manifest.csv` now lives under `_archive`. Paths marked keep do not change |
| Stale outer files | `CP/CLAUDE.md` and `CP/TASKS.md` leave the outer folder. Claude Code then stops loading the stale rules from there |
| Backup | The repo has a GitHub remote (`RP/.git/config`). `documents/` is not in the repo. It has 3 copies now (C: documents, OneDrive, case-study-materials). After the run: C: documents, plus the OneDrive copy in `OD/_archive/<date>/_duplicates`. Only the OneDrive copy syncs |
