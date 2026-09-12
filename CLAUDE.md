# ClearGrid Borrower Profile — working rules

Dense-UI redesign for collections agents. Desktop only, 1440×900, degrading to 1280.
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
| `src/data.js` | The four test records | Data changes only |
| `src/components.js` | Badge, field row, block, bars | New atom |
| `src/regions.js` | Spine, three columns, compare view | Most layout work |
| `src/app.js` | Nav, render, audit, events | Interaction work |
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
| `display` | Mono, 500, 23/16 (lg/sm), tabular, -1% tracking | The numbers an agent reads aloud |
| `title` | Inter, 600, 16.5 | The borrower's own name header — the one deliberately-kept exception |
| `emphasis` (`.t-pri`) | Inter, 600, 12.5 | Names/headline text inside a row — card lender, log outcome |
| `label` (`.t-sec`, `.eyebrow`) | Inter, 400, 11.5 | Everything else: field labels, field-row **values**, table cells/headers, nav, log meta, block headings/stat labels, sub-captions |

`.eyebrow` still exists as a class (many templates already reference it) but its declaration
is intentionally identical to `.t-sec` now, not a fork — a block heading and a field label
render the same, and position/spacing is what tells them apart, not typography.

Two weights system-wide: 400 / 600. **No 500, no 700** — one disclosed exception: JetBrains
Mono ships no 600 weight file (only 400/500/700), so `display` stays at 500 rather than
requesting a weight the font can't render — a real font limitation, not a design choice.

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

- Tajawal, loaded. Never Inter for Arabic.
- Line height ×1.7. Tracking 0 on anything with Arabic glyphs. No italics. No weight below 400.
- Logical CSS properties only (`margin-inline-start`, `border-inline-end`, `text-align: start`).
  A physical `left`/`right` in `tokens.css` is a bug.
- LTR islands on **inline** spans only: Emirates ID, phone, email, reference, account reference,
  lender ID. A reversed Emirates ID is a data-integrity bug.
- Western digits, Gregorian calendar, both pinned. Money and dates come from `Intl`;
  never hand-concatenate a currency symbol.
- Counted-noun agreement: dual for 2, plural for 3–10, singular for 11+.

## Nulls

One glyph, an en dash, in `text/muted`. The label always stays. A null must never look like a zero.

## Motion

Near none. Button press `scale(0.97)` 120ms. Entry form open 180ms. Everything else instant.
Account selection and tab switches get no animation.

## Harness is not product

The dark top bar, greyscale/squint toggles and the audit panel are test instruments.
They never appear in a design frame.
