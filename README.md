# ClearGrid Borrower Profile redesign

Coded prototype, English and Arabic. **Self-graded**: no agents, experts or users have tested it yet.
**Fixtures only**: every name, ID and amount is invented; the clock is fixed at 11 Sep 2026 (Dubai).

<!-- DRAFT: rewrite the opener, the bullets, the 12 tour claims (src/story.js STEPS) and the 17 card answers (CARDS) in your own words (plan decision 11) -->
**30-second opener (draft).** An agent gets the 5% of cases that need judgement. The profile answers
the five questions they ask first (why me, owed and how late, promise and record, last thing said,
which channels and why not) with zero clicks, in English and Arabic.

- **D1 Spine + scope columns.** The five answers sit in one pinned strip; below it, one column each for person, account and activity.
- **D2 Why this reached you.** Computed from fields that exist today. It does not exist in the system yet: the agent screen shows it as finished UI, and the tour, decision log and the reviewer bar's "Proposed fields" switch (`?prop=1`) disclose it.
- **D4 Compliance before the click.** Each restricted channel shows its reason and rule source (CBUAE Rulebook 5.2.5, SAMA Debt Collection Regulations, current text) or "Client policy" where no regulation was found.
- **D9 One dictionary, full mirror.** Arabic is generated from the same dictionary, with Arabic size tokens (14/16px), Western digits and isolated IDs.

## Links

- Live link: _add after the repo is on GitHub Pages_ (also set `og:url` and `og:image` in `src/index.html`)
- Guided tour: 12 steps over the live product (`?step=1`); opens by itself on a first visit with a bare link. Esc or "Explore freely" leaves it; browser Back steps back.
- Decision log: `?view=log` (17 cards: hardest question, draft 30-second answer, linked evidence, trade-off). `?view=log&card=D4` opens one card.
- Six "Why" links on the product open their card. Off by default so the agent screen reads as finished UI; the reviewer bar's "Why links" switch turns them on (`?ann=1`). The tour's own Why link is always there.
- Components: `?view=sheet`: live specimens of every component, the state matrix, role tokens and the data dictionary.
- System states: `?state=loading|stale|savefail|blocked` (blocked: click an allowed channel; savefail: try to save an outcome).
- How I'd test this: `?view=test` (reviewer bar "Testing"). "Run the harness" loads 42 hidden frames (6 fixtures × EN/AR × 1366/1920/2560, plus 1280/1024/390 fallbacks) and checks glance Q1-Q5, T1, type sizes, coral, mono weights, clipping, axe contrast and axe WCAG 2.2 A/AA, with report.json to download. Below it: the pre-registered study (hypotheses, methods, rubric, decision rules). Last run (Chrome, 23 Oct 2026): every check 36/36 except T1 29/36; fallbacks 6/6.
- URL state: `?lang=en|ar&fx=stress|omar|aisha|sparse|blocked|ksa&acct=<ref>&tab=i|m|t|k&scope=acct|all&view=queue`
- `?debug=1` shows the T1 layout check (no column scrolls while another is more than 25% empty).
  Last run: 29/36 pass (6 fixtures × EN/AR × 1366/1920/2560). Known fails: Sparse at 1366 (EN, AR); at 1920 Omar EN,
  Aisha AR, Sparse AR, Blocked AR (short history beside an account column that overflows slightly); Stress EN at 2560
  (34-row history scrolls beside spare room). Bordered panels and row hairlines cost 3 passes; kept for legibility.

## Disclaimers

- The Arabic is not native-reviewed. Rule checks (DualKit, which is in beta) show rule compliance, not copy quality.
- KSA rules are cited to articles of the current SAMA text (4(3), 5(1), 6(4)) as read by a reviewer from a summary; check them against the PDF. UAE rules rest on secondary sources, the CBUAE rulebook returned 403.
- Emirates ID masking is a privacy default, not a legal requirement found in UAE or KSA PDPL.

## Build

    ./build.sh && node test/verify.js

`dist/` is the GitHub Pages root (`index.html`, `404.html`). `src/` holds the six modules, `test/` the headless checks.
Read `CLAUDE.md` for the locked rules and `../cleargrid-reinterview-plan.md` for the plan.
