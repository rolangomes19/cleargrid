# ClearGrid Borrower Profile — session changelog

Written from memory of the actual decisions made this session, not from the current
on-disk files — the user reported the working tree has been reverted to an old state
(confirmed: `components.js`, `core.js`, `data.js`, `regions.js`, `index.html` all carry
the original tar.gz extraction timestamp; `tokens.css`/`app.js`/`i18n.js` are newer but
still short of the final line counts this doc describes). This is the reference for
rebuilding, organized by final state, not by diff history — where something changed more
than once, only the last, intended version is described.

Where I'm not fully certain of an exact literal value, I've said so rather than guessing.

---

## 1. Behavioral tasks (TASKS.md v3.1 queue) — all four done

- **T1 — Spine promise stat scoped.** Multi-account records with an open promise show
  count-across-accounts, then amount, then account name — never just a bare amount.
  Always renders as exactly `eyebrow → t-display → sub` (2 elements after the eyebrow),
  same as the other two spine stats. This was a real bug fix, not just a feature: it used
  to sometimes render a 3rd row, which broke the spine's fixed height across records.
- **T2 — Account column header renamed.** `"Selected · CC-77102"` →
  `"Working account · Gulf Meridian Bank · Credit card · CC-77102"` (reference moved to
  the end). Drove by i18n key `nav.selected` (EN "Working account", AR "حساب العمل"),
  reused — same key, same string, no new key added.
- **T3 — Escalation-to-account link.** Flagged cards show a small coral dot before the
  lender name **only when the card's status/DPD badge isn't already coral for the same
  fact** (fallback, not addition — avoids double-marking one alert, spec 4.3.3), plus a
  quiet "Reason for assignment ↑" text line under the badge row (i18n key `reasonCue`).
- **T4 — Behavioral audit.** `behavChecks()` in `app.js` — a real per-record pass/fail
  list (not hardcoded) checking the facts each record's agent must reach: Omar (dispute
  is the escalation reason, disputed account has the dot+cue, WhatsApp shown restricted,
  AI summary in glance — *note: the AI-summary check was later removed along with the
  feature itself, see §4*), Aisha (hardship reason, open promise in glance, call
  available), Stress (largest account leads the rail, every account reachable in one
  click, compare reachable in one click), Sparse (nulls render as dash not blank, labels
  persist beside empty values, three-column layout holds). Rendered under the existing
  geometry metrics in the audit panel.

T5 (visual polish) is what most of this document is about. T6 (Figma export) is
partially done — see §9.

---

## 2. Design tokens — `src/tokens.css` (the file that changed the most)

### 2.1 Color
Same palette throughout, retuned once for depth: `--bg` #F7F8F9→**#F4F5F7**,
`--sunken` #F1F3F4→**#EDEFF2** (page background pulled slightly cooler/darker against
pure-white cards, so surfaces separate without needing shadows to do the work). Brand
teal `#069494` and coral `#DC4A3E` unchanged — these were already correct, verified
against `docs/cleargrid-design.md`. Added `--tealDeeper:#035854` and
`--coralDeep:#B23A30` as reserved tokens (not yet applied to any component).

### 2.2 Spacing — a real 10-step scale
```
--sp-1:2px  --sp-2:4px  --sp-3:6px  --sp-4:8px  --sp-5:10px
--sp-6:12px --sp-7:14px --sp-8:16px --sp-9:18px --sp-10:22px
```
Every padding/margin/gap in the file traces to one of these — this replaced a long tail
of free-floating px values accumulated across earlier passes. Built during the "design
system" pass after being asked to check for random/vague values.

### 2.3 Type scale — 6 named styles, audited down from 16
```
--fs-display:23px  --fs-display-sm:16px  --fs-title:16.5px  --fs-emphasis:12.5px
--fs-label:11.5px  --fs-eyebrow:10px     --fs-badge:10.5px  --fs-micro:9.5px
--fw-regular:400   --fw-medium:500       --fw-emphasis:600
```
**No weight 700 anywhere** — this was a deliberate late-session decision, not a
technical limit, except for one disclosed real constraint: JetBrains Mono ships no 600
weight file (only 400/500/700), so `.t-display` stays at `--fw-medium` (500) rather than
requesting a weight the font can't render.

| Style | Selector | Spec | Job |
|---|---|---|---|
| display | `.t-display` (+ `.sm`) | Mono, 500, 23px/16px, tabular, −1% tracking | The numbers an agent reads aloud |
| title | `.names .n1` | Inter, 600, 16.5px, −1% tracking | The borrower's own name header |
| emphasis | `.t-pri` | Inter, 600, 12.5px | Card lender name, log outcome, other row headlines |
| value | `.row .v` | Inter, 500, 11.5px | Field-row values — deliberately not 600, or every one of the ~30 rows on screen is "emphasized" and none of them are |
| label | `.t-sec` | Inter, 400, 11.5px, `text2` color | Everything else: field labels, table cells, nav items, log meta, sub-captions |
| eyebrow | `.eyebrow` | Inter, 500, 10px, **sentence case, no tracking** | Block headings, stat labels, table headers, nav group labels |

**Important, not yet reflected in `CLAUDE.md`'s typography table**: eyebrow used to be
Mono + uppercase + tracked (that's what the doc currently says). Removed both in a later
round — all-caps mono labels read slower (word-shape recognition lost) and made a
collections tool look like a code editor. Content strings in `i18n.js` were already
sentence case (`'Total outstanding'`, `'Balance and terms'`, etc.) — the shouting was
pure `text-transform: uppercase`, no copy changes were needed to fix it. **The
`CLAUDE.md` table still needs its eyebrow row corrected to say Inter/sentence-case/no
tracking** — that edit didn't happen.

`.t-title` and `.t-val` classes were found to be **dead code** (defined but never
applied to markup — `.names .n1` and `.row .v` duplicated their specs directly) and were
deleted. Don't recreate them; style those two selectors directly if rebuilding.

### 2.4 Shape & elevation
`--r-sm:3px`, `--r-md:6px` (tightened from an earlier 4px/7px pass, per "enterprise,
serious, no glow" direction). `--shadow-sm` and `--shadow-md` are both tinted to a cool
grey (`rgba(16,24,28,...)`), never pure black, never a soft glow-bloom. `--focus-ring`
is a 2-layer box-shadow (surface-color ring + teal ring) for `:focus-visible`.

### 2.5 No one-sided accent borders anywhere
This was a specific, direct instruction and required real rework. Every place a
colored `border-inline-start` used to signal state now uses either a small dot or a
solid background fill instead:
- Flagged account card: coral dot before the lender name (see T3), not a border.
- Selected account card: the existing full `box-shadow: 0 0 0 1px teal` ring alone —
  no border-accent stacked on top of it.
- Escalation band (`.why`): coral-wash **background** only, no border.
- Nav active item: solid `rgba(6,148,148,.22)` background fill, no border.
- Activity log AI-sourced row: a small teal dot in a leading slot (not a border); the
  slot renders empty (not collapsed) for non-AI rows so the timestamp column still
  aligns.
- Newly-saved log row: teal-wash background + a brief flat-color pulse animation on
  entry (700ms, white→wash), still no border.

### 2.6 Bars — one color, one meaning
Progress bars (account-card outstanding-ratio, payment-plan installment-progress) are
**always teal**. The earlier green "plan active" variant was removed — it was redundant
with the "Payment plan active" badge already sitting next to the bar (same fact via two
visual channels). `.bar.plan` class stopped being referenced in CSS; harmless if the
class is still emitted by markup, but it does nothing.

### 2.7 Field-row grid consistency (the "dangling cell" fixes)
`.rows.grid2` is a 2-column CSS Grid. A `.row.wide` modifier (`grid-column:1/-1`) lets
a row span both columns for genuinely long prose values (lender/merchant names, dispute
reasons, settlement text, schedule flags). The bug: if a wide row follows a narrow row
that hasn't completed its pair, Grid bumps the wide row to a fresh line and strands the
preceding narrow row alone with an empty cell beside it. Fixed by reordering each
block's fields so all narrow (pairable) fields come first, wide fields last, and
promoting the trailing item to `wide` whenever a block has an odd count of narrow
fields (Instalments paid, Last broken, Lender ID all got promoted this way). Verified
with an actual Grid-placement simulation script, not by eyeballing.

The **Borrower reference block stays single-column** (`.rows`, no `.grid2`) — this is a
deliberate, width-driven exception, not an inconsistency: at 288px that column only has
~56px of label space, and labels like "Emirates ID" / "Date of birth" need ~64–75px, so
a 2-column split would wrap them. Documented with an inline code comment so it doesn't
read as an oversight later.

### 2.8 LTR-island overflow
`.ltr` (phone/email/EID/reference spans) now truncates with `text-overflow: ellipsis`
instead of wrapping mid-character, with the full value on a native `title` tooltip.
Required `.row .v{flex:1; min-inline-size:0}` — flex children don't shrink below their
content's intrinsic width by default, which was silently defeating the ellipsis.

### 2.9 Spacing/alignment corrections (measured, not eyeballed)
- `.why{align-items:flex-start}` → **`center`** — the escalation-band badge was a
  taller padded pill than the single-line text next to it; top-aligning left it ~5.8px
  low relative to the text's vertical center.
- `.hero{align-items:flex-end}` → **`flex-start`** — the account column's two stat
  labels ("Outstanding" / "Days past due") were bottom-aligned, so whichever one had the
  taller bar/DPD-scale beneath it pushed its own label ~8.7px out of line with the
  other's.
- `.spine-row{align-items:flex-start}` → **`center`** — the identity block (avatar +
  name) is shorter than the 3-line KPI stats beside it; centering reads more balanced
  than pinning both to the top.
- Account column widened **420px → 480px**, activity column correspondingly narrowed
  **548px → 488px** (borrower column unchanged at 288px) — fixed a real truncation bug
  where "AC-33011-GMB" (account reference) was ellipsis-clipping; the account column,
  where every field row lives, was the one actually short on room while the activity
  column sat mostly empty.

### 2.10 Nav rail — largest single structural addition
```
.nav               flex column, background #14161A
  .nav-scroll      flex:1, overflow:auto (overflow-x:hidden when collapsed) — logo, group
                   labels, item list
  .nav-bottom      flex:0 0 auto, border-top — ClearVoice promo card + agent profile row
                   (pinned, never scrolls away — same mechanism as the locked spine)
  .nav-foot        flex:0 0 auto, border-top — just the collapse/expand toggle button,
                   always visible regardless of state
```
- **Logo**: cut-corner "signal window" mark (inline SVG path
  `M2,2 H22 V14 L14,22 H2 Z`, 20×20, white fill on dark nav) + stacked bilingual
  wordmark ("ClearGrid" bold 14px, "كليرجريد" beneath at 50% opacity) — this pairing is
  real ClearGrid brand spec (`docs/cleargrid-design.md`), not invented.
- **Nav items**: real Phosphor icon (see §3) + label, `.gl` group-label divs above each
  group ("Platform" / "Support" / "Tools").
- **ClearVoice promo card** (`.nav-promo`): title/subtitle + a black pill button with a
  mic icon. i18n keys `nav.voiceTitle/voiceSub/voiceBtn`.
- **Agent profile row** (`.nav-profile`): teal avatar circle "R", name "rabab.abbas",
  email "rabab.abbas@cleargrid.com", trailing caret icon. Static placeholder data, not
  wired to any record.
- **Version number was added then removed** — don't re-add it; neither expanded nor
  collapsed state shows one.
- **Collapsed state** (`.nav.collapsed`, or the pre-existing `@media(max-width:1360px)`
  breakpoint — both trigger the *same* rule bodies, duplicated on purpose since CSS has
  no clean "media OR class" selector):
  - Nav width 64px.
  - Logo: **only the mark icon**, the whole `.logo .word` div (wordmark + Arabic
    subtitle) is hidden — not just the Arabic line.
  - Nav items: icon-only, **padding bumped to `var(--sp-5) var(--sp-3)`** (10px/6px, up
    from the expanded state's 6px/8px) for a more generous touch target.
  - Group labels (`.gl`) become 1px hairline dividers (`font-size:0; height:1px;
    background:rgba(255,255,255,.1)`) instead of vanishing outright, so the grouping
    cue survives collapse.
  - **Voice promo card is fully hidden** (`display:none`) — not shrunk to a circular
    icon button (that was tried and explicitly rejected: "doesn't add value or
    communicate" as just an icon).
  - Agent profile row: avatar only, name/email/caret hidden.
  - `overflow-x:hidden` on `.nav-scroll` to guarantee no horizontal scrollbar.
  - Collapse toggle icon flips (`transform:scaleX(-1)`) to point the other direction;
    there's a compensating flip for `html[dir="rtl"]` so it's never backwards in Arabic.
- **Collapse toggle** (`#b-navcollapse`, icon = `dcaret`): lives in `.nav-foot`, bottom
  of the sidebar, always visible. State is `S.navCollapsed` (boolean, in `core.js`),
  persists across re-renders, toggled via a click handler in `wire()`. This position
  was a deliberate move — it started inline in the logo row (easy to miss) and was
  relocated after the user pointed at a reference screenshot showing a persistent
  bottom-corner toggle.
- **Hover flyout on collapsed icons** (`#nav-flyout`, single shared element, added as
  a direct child of `<body>` in `index.html`, **not** nested under `.nav-scroll`):
  shows the hovered item's own label in a small dark floating pill to its right (left,
  in RTL). **This had a real bug in its first version**: implemented as a per-item CSS
  `:hover` + `position:absolute` child — it rendered completely invisible in practice
  because `.nav-scroll` has `overflow:auto`, which silently clips any
  absolutely-positioned descendant that poküst past its own edge. Fixed by making it a
  single `position:fixed` element positioned via JS (`wireNavFlyout()` in `app.js`,
  wired inside `wire()`) on `mouseenter`/`mouseleave`, reading `getBoundingClientRect()`
  of the hovered item and setting `top` + `insetInlineStart`/`insetInlineEnd`
  (direction-aware) directly. Verified working with a **real mouse hover in actual
  Chrome**, not just simulated — the first, broken version had looked "probably fine"
  under JS-only testing, which is exactly what made the clipping bug easy to miss.
  Adapted from a reference screenshot that showed *nested* section flyouts (parent items
  expanding to reveal children); this app's nav is flatter (group labels + flat items,
  no drill-down), so each icon reveals its own label rather than a submenu — flagged to
  the user as a scope adaptation, not asked to build true nested sections.

### 2.11 Icon atom
```
.icon{inline-size:1em; block-size:1em; vertical-align:-0.15em}
.icon path,line,polyline,rect,circle,polygon{fill:none; stroke:currentColor;
  stroke-width:16; stroke-linecap:round; stroke-linejoin:round}
.icon .dot{fill:currentColor; stroke:none}   /* for the 2 icons with a filled accent dot */
```
Sizes with surrounding text (~12–15px depending on context). See §3 for the icon set
itself.

### 2.12 Font smoothing & root
```
body{... -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
  text-rendering:optimizeLegibility}
```
Added during the typography refinement pass — a small, always-safe legibility fix.

### 2.13 Harness cleanup
Notes and Greyscale checkboxes removed from the harness bar entirely (both markup and
their `chk()` JS wiring in `app.js`). **Squint stays.** The `.note` yellow
dev-annotation boxes and their `body.notes` toggle mechanism were made unreachable
earlier in the session (body no longer starts with the `notes` class, and the Notes
checkbox that could re-enable it is now gone) — this was traced back as the actual root
cause of an earlier "the polish isn't visible" complaint: those boxes were rendering by
default in every screenshot.

### 2.14 A/B experiment left in place — pending your call
A harness checkbox **"3-tier type"** toggles `body.t-3tier`, which collapses the
6-style system down to the literal original "three tiers only" claim
(display/primary/secondary) by overriding:
```
body.t-3tier .names .n1{font-size:var(--fs-emphasis); font-weight:var(--fw-emphasis); letter-spacing:0}
body.t-3tier .row .v{font-weight:var(--fw-regular)}
body.t-3tier .eyebrow{font-size:var(--fs-label); font-weight:var(--fw-regular)}
```
This was built explicitly as a live comparison, not a decision — **no verdict was
recorded before the session moved on to other feedback.** If rebuilding, decide whether
to (a) keep the toggle as a permanent harness instrument, (b) remove it and keep the
6-style system, or (c) commit to the pure 3-tier system and delete the 6-style rules
instead. The code comment on this block in `tokens.css` spells out exactly what each
fold costs (Title loses its own size, Value's weight regresses toward "everything
bold" again, Eyebrow becomes typographically identical to a field label).

---

## 3. Icon set — `src/components.js`

Real **Phosphor** icon paths (MIT-licensed), fetched from source and inlined as raw
SVG path data — not hand-drawn, not an icon font/library dependency. An `ICONS` object
maps name → inner-SVG markup, and `icon(name, cls)` wraps it in
`<svg class="icon ...">`.

Final icon set: `phone`, `chat` (SMS/Interactions), `wa` (WhatsApp — Phosphor's own
phone-in-speech-bubble glyph, deliberately **not** the trademarked WhatsApp brand mark),
`mail`, `dash` (dashboard), `users` (borrowers), `wallet` (accounts), `chartbar`
(reports), `robot` (AI agents), `megaphone` (campaigns), `flow` (workflows), `pencil`
(log outcome), `columns` (compare), `timeline`, `ticket`, `mic` (ClearVoice promo),
`caret` (up/down chevron pair, used on the agent-profile row), `dcaret` (left/right
double-chevron, used on the nav collapse toggle — flips via CSS transform for
expand/collapse and RTL).

`row(k, v, mono, wide)` in this file also gained the 4th `wide` parameter (§2.7).

---

## 4. `src/app.js`

- `nav()` rewritten per §2.10 (logo, promo card, profile row, collapse toggle, no
  version number).
- `MARK` constant holds the logo glyph's inline SVG.
- `wireNavFlyout()` — new function, positions and shows/hides the shared `#nav-flyout`
  element on hover (see §2.10).
- `render()` now toggles the `.collapsed` class on `#nav` based on `S.navCollapsed`
  before re-injecting its `innerHTML`.
- `wire()` gained: the nav-collapse click handler, a call to `wireNavFlyout()`. Lost:
  the `c-notes`/`c-grey` checkbox handlers (elements no longer exist).
- **The "Last AI contact" line was removed from the spine entirely** (deferred feature,
  per direct instruction — "not needed... keep for later"). The underlying data
  (`r.calls.ai_sum` etc.) was deliberately left in `data.js`/`i18n.js` untouched so it's
  easy to reintroduce. Consequences of the removal, all applied:
  - `G` (the glance-audit geometry array) dropped `'ai'` — now 6 entries, not 7.
  - `behavChecks()`'s Omar check list dropped the "Investigation context (AI outcome) in
    glance" row.
  - The audit panel's caption text was corrected to stop listing "last AI outcome" among
    the glance-set facts.
- `behavChecks()` (T4) — see §1, unchanged since first written except for the AI-line
  removal above.

---

## 5. `src/core.js`

- `S` (app state) gained `navCollapsed:false`.
- `ltr(s)` helper: now emits `title="${esc(s)}"` on the span, pairing with the CSS
  ellipsis-truncation in §2.8 so a truncated value's full form is always one hover away.
- Everything else in this file (clock, formatters, `reasons()`, `hot()`, sort/selection
  logic) is untouched this session.

---

## 6. `src/i18n.js`

New/changed keys only (both EN and AR were kept in sync throughout):
- `nav.selected` repurposed from "Selected" → **"Working account"** (T2).
- `reasonCue` added — "Reason for assignment ↑" (T3).
- `nav.voiceTitle`, `nav.voiceSub`, `nav.voiceBtn`, `nav.agent`, `nav.collapse`,
  `nav.expand` added (nav promo card + profile + toggle tooltips).
- **`f.merchant` was added — this was fixing a real bug**, not a new feature. The key
  existed under `tbl.merchant` (used only by the compare table) but was **missing
  entirely** from the `f` object used by field rows, so the Merchant row's label
  rendered the literal string `"undefined"`. Both EN ("Merchant") and AR ("التاجر")
  added, matching the existing `tbl.merchant` translation.
- No other content strings changed — all the "shouting" removed from labels (§2.3) was
  pure CSS; the underlying strings were already sentence case.

---

## 7. `src/index.html`

- `<body class="notes">` → `<body>` (no default classes).
- Notes and Greyscale checkboxes removed from the harness. Squint checkbox kept,
  unchanged, now the only remaining harness toggle besides "3-tier type" (added later,
  see §2.14) and record/direction switches.
- Audit panel: `class="audit open"` → `class="audit"` (starts collapsed).
- Font `<link>` gained extra weights during an earlier pass (Inter 800, JetBrains Mono
  700) that were **later made moot** by the "no 700 anywhere" decision (§2.3) — if
  rebuilding cleanly, the `<link>` only needs Inter 400/500/600/700 (700 for anything
  still using it, if anything), Tajawal 400/500/700, JetBrains Mono 400/500 (**not**
  700, since display stays at 500 and nothing else needs mono above that). Worth
  double-checking what's actually referenced before trimming the font request.
- `#nav-flyout` div added as a direct child of `<body>`, after the `#audit` panel,
  **not** nested inside `#nav` — required for the fixed-position flyout fix (§2.10).
- `#c-3tier` checkbox added to the harness (§2.14).

---

## 8. `docs/figma-handoff.md` — rewritten to match current build

This doc was originally written against the pre-polish wireframe and had drifted badly
stale by mid-session (old radii, the removed action-button caption, the removed green
bar variant, old spacing values). Rewritten in place, section by section:
- **§1.1/1.2 tokens**: new hex values, `radius/sm`+`radius/md` (was
  badge/control/action/card, 4 separate radii), the real 10-step spacing scale, noted
  "no one-sided accent border anywhere" as a hard rule now.
- **§1.3 type styles**: weights/sizes updated to the 6-style system (§2.3), a note added
  explaining the deliberate `field-value` (500-weight) exception.
- **§2.2 Stat / §2.4 Account card / §2.5 Action button**: updated for "all three spine
  stats use full `display` size," "bars always teal, flag-dot not border," and "caption
  removed entirely, moved to hover tooltip, uniform button height" respectively.
- **§2.9 Log row**: updated for the dot-not-border AI marker and the flat-pulse (not
  glow) new-row animation.
- **§2.17 Nav item**: updated for the solid-fill (not border) active state.
- **New §2.18 Logo mark, §2.19 Icon** component entries added — neither existed in the
  original wireframe.
- **§4 Layout skeleton**: Account column 420→**480**, Activity 488 (was 548).
- **§5.1 Spine redlines**: height is now "~180–190, not a fixed 172," avatar 36px (was
  34), the AI-line row removed from the redline list, action-rail height ~34–36px (was
  43, tied to the now-gone caption row), all three stats confirmed `display` not
  `display-sm`.
- **§7 Content table**: the "Last AI contact" row struck through and marked
  removed/deferred, so whoever builds frames from this doc doesn't include a feature
  that no longer renders.

---

## 9. Figma — separate deliverable, genuinely partial

Built in the user's own Figma file (not a new one): **file key
`SYWQC44O4CgJzPzgrl846g`**, on a **new page named "v3.1 — Design System + Frames"**
(existing pages/frames in that file — "Frame 1", "ClearGrid — Borrower Profile
Wireframe", two "ClearGrid — Borrower Profile v3" capture frames — were left untouched).

**Done, verified with screenshots at each step:**
- Color variable collection ("Color"): 21 variables (`bg/page`, `bg/surface`,
  `bg/sunken`, `text/primary`, `text/secondary`, `text/muted`, `line/default`,
  `line/strong`, `line/hairline`, `teal/base`, `teal/deep`, `teal/deeper`, `teal/wash`,
  `coral/base`, `coral/deep`, `coral/wash`, `green/base`, `green/wash`, `amber/base`,
  `amber/wash`, `nav/bg`), each with an explicit scope (not the `ALL_SCOPES` default)
  and a `WEB` code-syntax binding back to its CSS variable name.
- Number variable collection ("Number"): 13 variables (`radius/sm`, `radius/md`,
  `space/1`…`space/10`, `border/hair`).
- **16 text styles** — built *before* the later type-system audit down to 6 (§2.3).
  **These have not been reconciled with that decision** — the Figma file's text styles
  still reflect the pre-audit 16, including the two confirmed duplicate pairs
  (`secondary`≡`table-cell`, `sub`≡`log-meta`). If continuing the Figma work, redo this
  step against the 6-style system, not the 16.
- 2 effect styles (`shadow/sm`, `shadow/md`), matching the CSS elevation tokens.
- **Frame F1** ("Borrower profile — default", Omar/EN/LTR): nav rail (logo, all 9
  items, group labels) and the **complete spine** (identity block, all three stats,
  escalation band, action rail) built as real components/auto-layout, bound to the
  variables above — not a flattened screenshot. A real bug was caught and fixed while
  building this: nav item rows inherited Figma's default white frame fill, which
  combined with white label text made every non-active item invisible until the fills
  were explicitly set to transparent.

**Not done:** F1's three columns (borrower/account/activity — the bulk of the content),
and all of F2–F6. Paused here at the user's explicit choice ("pause here for review"),
not because of a blocker — picking this back up means building the borrower column
(totals + account cards + reference block), the account column (5 blocks), the activity
column (tabs + log rows + entry form), then duplicating for F2 (AR mirror) through F6
per the frame list in `docs/figma-handoff.md` §3.

---

## 10. `test/verify.js`

One fix: the "undefined/NaN in output" detector regex,
`/.{50}(undefined|NaN|\[object Object\]).{30}/`, was missing the `s` (dotAll) flag, so
`.` never matched a newline and the check silently missed any bad token preceded by a
line break within 50 characters — which is exactly how the real `f.merchant` bug (§6)
sat undetected through multiple "ERRORS: none" runs. Fixed by adding `/s`. **This is a
test-infrastructure fix that must not be lost** — without it, this whole class of bug
can hide again silently.

---

## 11. Known outstanding items (not done, worth doing)

1. **`build.sh` Windows/Python encoding bug — never actually patched.** `python3`'s
   default `cp1252` codec chokes on the Unicode (Arabic, en-dash) characters in the
   source files, throwing `UnicodeDecodeError`. Worked around all session by running
   `PYTHONUTF8=1 ./build.sh`, but the script itself was never edited to set this (e.g.
   via `encoding='utf-8'` in the two `read_text()`/`write_text()` calls, or setting
   `PYTHONUTF8` inside the script). Do this if anyone on Windows runs the bare command.
2. **`CLAUDE.md`'s eyebrow row is stale** (§2.3) — still says Mono/uppercase/tracked;
   should say Inter/sentence-case/no-tracking.
3. **The 3-tier toggle has no verdict** (§2.14) — needs a decision, then either removal
   or promotion.
4. **Figma text styles (16) don't match the audited 6-style system** (§9) — needs
   redoing if Figma work continues.
5. **Figma F1's three columns, and F2–F6, are unbuilt** (§9).
6. `--tealDeeper` and `--coralDeep` CSS tokens exist but aren't used by any component
   yet (reserved, not dead — just not yet spent).

---

*Written for a git repo currently at `C:\cleargrid-profile\cleargrid` (the extracted
project; `C:\cleargrid-profile` itself just holds the outer docs/tarball/CLAUDE.md
copy). Cross-reference this against `git log`/`git diff` if the repo's history survived
the corruption — this document describes intended final state, not a literal patch.*
