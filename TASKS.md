# Task queue

One task per Claude Code session. Paste the block, then run `./build.sh && node test/verify.js`.

## v3.1 — behavioural pass (architecture frozen)

### T1 · Scope the promise stat  [src/regions.js, src/i18n.js]
The spine promise stat shows an amount with no scope. On Omar it reads "AED 1,420 promised
6 Oct 2026" while the working account (the disputed card) shows "None on record". Two figures
on screen contradict each other.
Change the stat to: count across accounts, then amount, then the account it belongs to.
  EN: "1 open across 2 accounts" / "AED 1,420 · Personal loan"
  AR: "وعد قائم واحد على حسابين" / "‏1,420 د.إ.‏ · قرض شخصي"
Single-account records keep the short form: "AED 1,000 · 18 Sep 2026".
Keep `display-sm`. Do not add a fourth spine stat.

### T2 · Name the working account  [src/regions.js, src/i18n.js]
The account column head reads "Selected · CC-77102". Change to
"Working account · Gulf Meridian Bank · Credit card", reference moving to the end.
Same string key drives the Arabic build.

### T3 · Make the escalation-to-account link visible  [src/regions.js, src/i18n.js]
A flagged card currently carries only a coral accent. Add a short text cue tying it to the
escalation line, e.g. "Reason for assignment". Quiet styling: the card already spends one
coral element on its status badge. Must not push the coral count above three on the stress record.

### T4 · Task-success checks in the audit  [src/app.js]
The audit measures geometry only. Add a per-record behavioural check listing the facts the
agent must reach for that record, and whether each is visible in the first screen:
  Omar     dispute · disputed account identified · WhatsApp restriction · investigation context
  Aisha    hardship · open promise · call available
  Mohammed largest account · switch · compare
  Sparse   spatial vocabulary intact with nulls everywhere
Render as a short pass/fail list under the existing metrics.

## Later

### T5 · Visual polish pass  [src/tokens.css only]
Do not touch structure. Colour tuning, spacing rhythm, icon set, microcopy.

### T6 · Figma export frames
F1 EN Omar · F2 AR Omar · F3 compare · F4 entry open · F5 Aisha · F6 stress.
See the Figma handoff pack for redlines.

## v4 — agent journey (done)

### T7 · Queue screen  [src/regions.js, src/core.js, src/i18n.js]
New `S.mode` state (`queue|profile|compare|wrapup`) replaces `S.compare`/`S.entry`. Queue
reuses the four fixtures, sorted by escalation severity then exposure. See spec.md §11.

### T8 · Wrap-up screen  [src/regions.js, src/app.js, src/i18n.js]
Replaces the inline entry form. Reuses the `compare` grid shape so spine + account cards
stay visible while writing. Save keeps the old mutation; "Return to queue" closes the loop.

### T9 · Visual/contrast pass  [src/tokens.css, src/components.js]
`-Text` tokens for coral/green/amber/muted badge and caption text (was failing 4.5:1 AA on
the wash, per the defensibility audit). Focus-visible on every interactive element, keyboard
support on cards/queue rows, `--shadow-sm` finally used, `.t-title` promoted from a one-off
inline rule, one `pluralAr` helper replacing five duplicated Arabic ternary chains.

### T10 · verify.js real assertions  [test/verify.js]
Coral-budget and reconciliation checks now actually fail the script instead of only
printing — plus queue-row-count/order and wrap-up save/return coverage.

### T11 · System consolidation pass (Refined)  [src/tokens.css, regions.js, components.js, core.js, i18n.js]
13 font sizes → 4 tokens (12/13/16/24), 4px spacing grid, radii 4/6, fixed control heights,
centred buttons with channel icons (lock on restricted), fixed 44px column heads. Log outcome
moved to the spine rail (the activity head overflowed at 1280–1440). Queue is one table with a
sticky header; the escalation cell leads with the reason's type badge + a detail line. Totals
strip and contact sparkline removed (duplicate / unreadable). -Text colours re-measured to ≥5:1;
primary fill → tealDeep; wrap-up fields got real labels. Nav now actually narrows to 64px under
1360px (it hid its labels but stayed 184px wide, pushing the activity column off-screen).
Figma page and docs/design-tokens.html still describe the old sizes.

### T12 · Brand, hover, disabled reasons, form controls  [app.js, components.js, tokens.css, build.sh]
Nav uses the shipped assets/ webp files untouched (lockup expanded, icon collapsed, same in RTL);
build.sh inlines them. Why-band label lost its white chip. Every control has a hover state;
restricted channels are aria-disabled (still focusable) with a plain-language tooltip. Wrap-up
outcome + promise date are shadcn-style Select and Popover Calendar (hidden input keeps .value,
keyboard: arrows/Home/End/Enter/Escape, RTL-aware arrows, Monday weeks, past days unselectable).
