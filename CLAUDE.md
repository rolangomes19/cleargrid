# ClearGrid Borrower Profile — working rules

Dense-UI redesign for collections agents. Desktop only, designed for 1366×768 and 1920×1080; 1024–1365 renders the 1366 layout scaled; below 1024 shows a fallback page. Plan: ../cleargrid-reinterview-plan.md (H0 + P1 done).
Two language builds: English LTR, Arabic RTL.

## Commands

```bash
./build.sh              # inline src/ into dist/cleargrid-borrower-profile.html
node test/verify.js     # headless check: every record × direction, no runtime errors
```

**Run both after every change.** `verify.js` catches blank renders, `undefined` in output,
broken reconciliation, and coral-budget violations in a few seconds. Never hand back
untested output.

## Files

| File | Holds | Touch when |
|---|---|---|
| `src/core.js` | Clock, formatters, state, selectors, escalation logic | Rarely |
| `src/i18n.js` | EN/AR dictionary | Any string change |
| `src/data.js` | The six test records (stress, omar, aisha, sparse, blocked, ksa) | Data changes only |
| `src/components.js` | Badge, field row, block, bars | New atom |
| `src/regions.js` | Spine, three columns, compare view | Most layout work |
| `src/story.js` | Tour steps, decision cards, log view, strip, spotlight, Why links | Tour or decision copy |
| `src/system.js` | Data dictionary, system states, component sheet | Dictionary, states, sheet |
| `src/harness.js` | In-browser harness and the How I'd test this page | Checks or study plan |
| `src/app.js` | Nav, render, events, URL state, reviewer bar | Interaction work |
| `src/tokens.css` | All styling | Visual work |

Read only the file you need. Do not read `dist/` — it is generated.

## Locked architecture — do not change without being asked

1. **Three scopes, one column each.** Borrower (1), account (1..n), event (0..m).
   Borrower column = totals, account cards, borrower reference.
   Account column = the selected account only.
   Activity column = events.
2. **The spine never scrolls and never moves.** The page does not scroll; panes do.
   This is the mechanism that keeps glance mode working. Do not soften it.
3. **Coral is the escalation channel only.** Maximum three coral elements on screen.
   Only the escalation band and the accounts it names may use it.
   Colour encodes deviation within this borrower's own book, not distance from zero.
4. **No accordions, no disclosure controls.** Nothing brief-mandated sits behind a click.
5. **Every figure carries its scope in the label.** "across 2 accounts", "on Gulf Meridian
   Bank". A borrower total and an account total must never look like the same number.
6. **One canonical home per field.** Repetition is allowed only across scopes, and only
   when both instances are labelled.
7. **Account sort is outstanding descending, always.** Never sorted by flag. A list that
   reorders as flags change destroys the positional memory it exists to build.

## Typography

Four named styles. This was six (audited down from an earlier 16), then tested live against
a further collapse to literal display/primary/secondary via an A/B toggle in the harness —
Value and Eyebrow lost that comparison and folded into Label; Title was tested the same way
and kept its own size, because a name is a recurring identity pattern and disappeared into
the row when folded into Emphasis. That toggle has been removed — this is the resolved system:

| Style | Spec | Job |
|---|---|---|
| `display` | Mono, 500, 24/28 (`.sm` = 16/24), tabular, -1% tracking | The numbers an agent reads aloud |
| `title` | Geist, 600, 14/20 (AR 16) | The borrower's name — spine header and queue rows, plus the queue page title |
| `emphasis` (`.t-pri`) | Geist, 600, 13/20 | Names/headline text inside a row — card lender, log outcome; buttons (md) |
| `label` (`.t-sec`, `.eyebrow`) | Geist, 400, 12/16 | Everything else: field labels, table headers, nav, log meta, badges, sub-captions |

Body text is 13/20. **Four sizes per script as `--fs-*` tokens: EN 12/13/14/24, AR 14/16/16/24
(P2: goals 2.1 + DualKit Arabic floor). Nothing smaller than 12.** Spacing is Atlassian steps
(`--space-025..--space-600` = 2/4/6/8/12/16/24/32/48), radii `--radius-sm:3` / `--radius-md:6` / 50%.
Control heights (Primer): 32 (`.act`), 28 (`.mini`), 24 (xs), 20 (badges). Column heads are a fixed
44px so the three share a baseline; tabs are underlines sitting on that rule.
Arabic swaps the px line-heights for ×1.7 through the same tokens.

Tokens are three layers in `tokens.css`: palette -> roles (`--text-muted`, `--action-primary`,
`--escalation-fg`...) -> components. Components use roles only. `verify.js` fails the build
below 90% token use (currently about 98%).

`.eyebrow` still exists as a class but renders like `.t-sec`; a group heading (`.blk-h .eyebrow`)
is the same size at weight 600 in text colour.

Two weights: 400 / 600, plus 500 on mono display figures (`--fw-figure`).

Mono for numerals, IDs, timestamps, amounts. Never for text labels — not even as
uppercase+tracked "eyebrow" styling. All-caps mono labels were tried and removed: they read
slower (word-shape recognition is lost) and made the tool look like a code editor rather
than a collections console.
At most one middle-dot meta string per line.

**Consolidation discipline**: a new visual need is a modifier on one of the four (swap to
mono, drop to muted color), not a 5th named style. If two things render identically, they're
the same style even if they sit in different components — that's exactly how Value and
Eyebrow got cut.

**Figma is out of sync with this.** The A/B pass and this table update were done in code
only, by request — the design-system Figma page (colors/type/spine, from an earlier T6
session) still reflects the six-style system and needs a cleanup pass before it's trusted
as a handoff reference again.

## Arabic rules

- IBM Plex Sans Arabic (400/600, real 600 weight). Never Geist for Arabic. Opposite-language spans carry `lang`.
- Arabic size floor (DualKit): meta 14, body 16, title 16, display 24, via `html[lang=ar]` tokens.
- Line height ×1.7. Tracking 0 on anything with Arabic glyphs. No italics. No weight below 400.
- Logical CSS properties only (`margin-inline-start`, `border-inline-end`, `text-align: start`).
  A physical `left`/`right` in `tokens.css` is a bug.
- LTR islands on **inline** spans only: Emirates ID, phone, email, reference, account reference,
  lender ID. A reversed Emirates ID is a data-integrity bug.
- Western digits, Gregorian calendar, both pinned. Money and dates come from `Intl`;
  never hand-concatenate a currency symbol.
- Counted-noun agreement: dual for 2, plural for 3–10, singular for 11+.

## Surfaces and colour (P2)

Columns sit on the canvas; each group is a white bordered panel with a ruled head; field rows,
log rows, table rows and queue rows carry a hairline; account cards are bordered panels; tabs are
underlines. **Do not remove the panels or row hairlines**: P2 tried spacing-only rows and labels and
values read as floating (user review, 23 Oct 2026: usability and legibility over a cleaner look).
Hue meanings: teal = interactive, coral = why this reached you (`data-role=escalation` only),
amber = account needs care, green = plan running. Status badges only for minority states.
One `stat()` component for every label/value/sub figure; a null value renders in body text, never at hero size.

## Story mode and decision log (P3)

The tour is an overlay on the live product: same DOM, same fixtures. A step only sets
`fx`, `lang`, `mode` and spotlights a selector; no state exists only in the tour. Story motion
uses `--story-*` tokens and never animates a product component. Tour claims and card answers are
drafts until the author rewrites them.
The tour follows one agent's shift (queue, pick, glance, channels, accounts, balance, last contact, Arabic, wrap-up, next case); the persona and flow are in `docs/tour-storyline.md`. A first visit opens on the queue.
The agent screen must read as finished UI: no "proposed" tags on it by default. Proposed fields
are disclosed in the tour, the decision log and the reviewer bar's "Proposed fields" switch (`?prop=1`).
The six in-context Why links are off by default too (`?ann=1` or the "Why links" switch). `verify.js` walks all 12 steps and checks every target exists.

## Figures and fields (P6)

A progress bar fills with what has been **paid down** (the convention); the figure beside it says what is **owed**, and its caption says `% paid of <original>`.
Field grids (`.grid2`) use equal `minmax(0,1fr)` tracks, a hairline above every row except the first line, and the hero stats share those columns. A long value drops under its label instead of squeezing it.
The ID reveal swaps text in place (`#eid-v`), never re-renders, so the column keeps its scroll position.

## System proof (P4)

The queue owns no CSS: it is the panel, compare table, `stat`, badge and button (`verify.js` fails on any
`.q*`/`#queue` rule). Account card and log row are single functions (`acctCard`, `logRow`) that the
component sheet also renders. An editable field is `rowEdit()` (a small select), never plain text.
Mono values use weight 500: Geist Mono ships 400/500 here and a 600 request gets faux-bolded (blurry).
Every number has a dictionary entry in `system.js`; saving an outcome updates call totals with the log.

Council review (23 Oct 2026, five isolated Claude reviewers, same-model, `CLAUDE.md` leaked into some contexts) drove: promise/date values never break mid-token
(`.row:not(.wide) .v` is nowrap), KSA open complaint blocks every channel (SAMA Art. 6(4)), SAMA cites the current text not 2018, Arabic day plurals (`t().days`), typed
Arabic digits normalised on input, Latin names tagged `lang=en` (`lat()`), mono stack falls back to the Arabic face, spotlight snaps after its travel time, harness counts painted
coral from live tokens. Second pass (CLAUDE.md withheld from the reviewers) drove: an amount that is not a number marks the field invalid and logs nothing, Promise taken needs amount and date and warns once
on a disputed account, the full ID exists in the page only while revealed (15 s, then masked), a channel with no address (no email) is off with its reason, a stage never says "Not contactable"
while a channel is open, Arabic plurals come from `Intl.PluralRules` (`pluralAr`), the wrap-up form sits between the accounts and the interaction log, and the coral harness checks every border edge,
outline, shadow and pseudo-element against a three-component allowlist. Not done: Q3 "best next action" (scope), UAE primary-source check (CBUAE rulebook 403), native Arabic copy review,
loading and pending states, the 1024-1365 scale-to-fit versus the Arabic size floor (a design trade-off), one button family, DOB masking, WhatsApp consent as data, new outcomes (refused, voicemail, do-not-contact).

`?view=test` → "Run the harness" is the real-browser check (layout, fonts, axe). Run it after visual
changes; `verify.js` cannot see layout. Last run: all checks 36/36 except T1 29/36.

## Nulls

One glyph, an en dash, in `text/muted`. The label always stays. A null must never look like a zero.

## Motion

Near none. Button press `scale(0.97)` 120ms. Entry form open 180ms. Everything else instant —
including the nav collapse and a newly logged row (static `tealWash`, no pulse).
Account selection and tab switches get no animation.

## Reviewer bar (replaces "No harness in the shipped page")

**The bar is hidden by default.** `P` or `Shift+P` toggles it (never while typing in a field or with Ctrl/Cmd/Alt); `?bar=1` opens it. It is still in the DOM, so `verify.js` drives its buttons. Its Arabic text is 14px (`--chrome-fs` under `html[lang=ar]`).

The re-interview plan (H0) adds a 36px dark bar labelled "Prototype controls, not product UI": fixture switcher, EN/ع, fixture-clock note, Self-graded badge. `?debug=1` adds the T1 layout check (`cgT1()` in the console). Everything below is the earlier history.

### Earlier: no harness

The dev-only top bar (record/direction switcher, squint toggle) and the live layout-audit
panel were removed from the product entirely — they're not just visually separated anymore,
the markup, CSS and JS are gone. Record and direction switching now happen through real
product UI: the queue screen for picking a case, the nav's own English/العربية toggle for
language. `test/verify.js` drives those same controls (`[data-nav="queue"]`, `[data-q]`,
`.nav-lang button`) rather than a harness, and asserts the coral budget, reconciliation and
per-record behavioural checks directly instead of only rendering them for someone to look at.
