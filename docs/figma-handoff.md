# Borrower Profile v3 — Figma Handoff Pack

Source of truth: `cleargrid/src/tokens.css` + `regions.js` + `app.js` (the built, polished v3.1, not the original wireframe). Every value below is measured from the current source, not estimated. Build in the order given in Part 8.

**Revision note:** this pack was rewritten after the v3.1 polish pass. Changed since the original wireframe: radius scale tightened (3/6, was 4/5/6/7), a real spacing scale (`--sp-1`…`--sp-10`) and type scale (`--fs-*`) replace free-floating px values, display/primary weights are 700 (was 600), account-card and progress bars are always teal (the green "plan active" variant was removed — redundant with the badge beside it), the action rail dropped its inline status caption entirely (moved to a hover title tooltip — buttons are icon + label only, uniform height), a real logo mark and a Phosphor icon set were added throughout, and LTR-island values (phone/email/IDs) truncate with an ellipsis + hover title instead of wrapping.

---

## 1. Variables

### 1.1 Colour (one mode, light)

| Variable | Hex | Used for |
|---|---|---|
| `bg/page` | `#F4F5F7` | Frame background, column head background |
| `bg/surface` | `#FFFFFF` | Cards, blocks, spine, table body |
| `bg/sunken` | `#EDEFF2` | Totals row, tab track, avatar, table header, bar track |
| `text/primary` | `#0A0A08` | Values, names |
| `text/secondary` | `#5B6166` | Labels, meta, eyebrow |
| `text/muted` | `#8A9094` | Null glyph, sub-captions, empty states |
| `line/default` | `#E5E7E9` | Card and block borders, dividers |
| `line/strong` | `#D3D7DA` | Control borders, dashed proposed-field chip |
| `line/hairline` | `#F4F5F6` | Field-row dividers |
| `teal/base` | `#069494` | Primary action, selection ring, card accent (selected), **all progress bar fills (no green variant anymore)** |
| `teal/deep` | `#04716D` | Teal badge text, button hover fill |
| `teal/deeper` | `#035854` | Reserved (new token, not yet applied to a component) |
| `teal/wash` | `#EAF5F5` | Teal badge fill, AI log dot, entry form fill, row hover, button hover fill |
| `coral/base` | `#DC4A3E` | The only alert hue. Escalation band, flagged-card dot, alert badge text |
| `coral/deep` | `#B23A30` | Reserved (new token, not yet applied to a component) |
| `coral/wash` | `#FDEEEC` | Escalation band fill, alert badge fill |
| `green/base` | `#1E8E5A` | Plan-active badge text only (no longer used on bars) |
| `green/wash` | `#E9F5EF` | Plan-active badge fill |
| `amber/base` | `#B8790A` | Legal-status badge text (no longer used for action-button captions — those were removed) |
| `amber/wash` | `#FBF2E0` | Legal-status badge fill |
| `nav/bg` | `#14161A` | Left nav |

Nav text is white at three opacities: `1.0` active, `0.70` item, `0.36` group label. Active nav item is now a solid `rgba(6,148,148,.22)` fill, no left border accent.

**Rule:** `coral/base` and `coral/wash` are locked to the escalation channel. No other component may use them. Maximum three coral elements per frame. **No component uses a one-sided accent border anymore** — the card/escalation-band/nav/log accents that used to be a coloured left border are now either a small dot indicator or a solid background fill. Borders are uniform on all four sides everywhere.

### 1.2 Number

| Variable | Value | Used for |
|---|---|---|
| `radius/sm` | 3 | Badge, mini button, input, nav item, tab pill |
| `radius/md` | 6 | Action button, card, block, totals row, entry form, tab track |
| `space/1` … `space/10` | 2, 4, 6, 8, 10, 12, 14, 16, 18, 22 | A real 10-step scale (`--sp-1`…`--sp-10` in code) — every padding/margin/gap in the file traces to one of these. Do not snap to Figma's default 8-grid instead; use these exact steps. |
| `border/hair` | 1 | All borders, uniform on every side |
| `border/log` | 2 | AI-row dot diameter context (the dot itself is 6×6, not a border) |

A separate two-tier **type scale** now exists alongside these (`--fs-*`, see 1.3) — every `font-size` in the file resolves to one of its seven steps.

### 1.3 Type styles

Latin: **Inter**. Numerals, IDs, timestamps, eyebrows: **JetBrains Mono**. Arabic: **Tajawal**.

**Second revision — audited down to 6 named styles (was 16 immediately post-polish, briefly).**
The first Figma pass named a style per *component* it appeared in (`table-cell`, `log-meta`,
`nav-item`...) rather than per *rendered appearance*, so several were pixel-identical
duplicates under different names, and one (`nav-item`, 12px) was a stray magic number that
didn't even trace to a code token. Audited with `better-typography` + `apple-design`
("build hierarchy from weight + size + leading as a set, not size alone") and cut to:

| Style | Family | Size / line | Weight | Tracking | Colour |
|---|---|---|---|---|---|
| `display` | Mono, tabular | 23 / 25.3 (lg), 16 / 17.6 (sm) | **500** | **-0.01em** | text/primary |
| `title` | Inter | 16.5 / 19.8 | 600 | -0.01em | text/primary |
| `emphasis` | Inter | 12.5 / 18 | 600 | 0 | text/primary |
| `value` | Inter | 11.5 / 17 | 500 | 0 | text/primary |
| `label` | Inter | 11.5 / 17 | 400 | 0 | text/secondary |
| `eyebrow` | Mono | 10 / 14 | 500 | +0.06em, uppercase | text/secondary |

**Third revision — `value` and `eyebrow` removed, down to 4 named styles.** Tested live via
an A/B toggle in the code build (not yet redone here in Figma — this table is now stale for
those two rows, kept below for history until this file gets its own cleanup pass):
- `value` (11.5/500) → folded into `label` (11.5/400). A field-row value now renders exactly
  like its own label; only position (start vs. end of the row) tells them apart.
- `eyebrow` (10/500/mono/uppercase) → folded into `label` too, AND dropped mono + uppercase
  entirely in the same pass (a separate, unrelated correction: all-caps mono labels read
  slower and made the tool look like a code editor — see `CLAUDE.md`). A block heading like
  "Balance and terms" now renders identically to a field label like "Overdue".
- `title` was tested the same way (folding into `emphasis`) and **kept** — the name header
  needs its own size or it disappears into the row.
- **Two weights survive system-wide: 400/600** (500 no longer needed anywhere except
  `display`'s font-limitation case below).

This Figma page (built in an earlier T6 session) still reflects the pre-A/B six-style system
below — it needs the same fold applied before it's trusted as a handoff reference again.

**No 700 anywhere — three weights system-wide (400/500/600) — historical, see above.** `emphasis` and `title` moved
from 700 to 600; that's also `badge`'s weight, so nothing Inter-based is bolder than Semi
Bold. **`display` is the one disclosed exception to the *intent*, not the rule**: JetBrains
Mono ships no 600 weight file at all (only 400/500/700 — confirmed via
`listAvailableFontsAsync`), so hitting exactly 600 for a mono style is impossible without a
different font. Rather than fall back to Bold (700, the nearer available weight) and quietly
break the "no 700" rule, `display` sits at Medium (500) — a real font limitation, disclosed,
not a design choice smuggled in.

**Absorbed into `label`** (identical spec, different component, no reason to be separate):
`secondary`, `table-cell`, `sub`, `log-meta`, `log-time` (keep the `.mono`/tabular *modifier*
on top of `label`'s size for timestamps — don't give it a separate named style), `nav-item`
(was a stray 12px, now correctly 11.5), the Arabic-name subtitle (was `name-alt` at 13).

**Absorbed into `eyebrow`** (same job — a small uppercase tracked label — at two different
sizes 9.5/10 for no functional reason): `table-head`, `nav-group`.

**Kept as a component-level size, not a named style:** `badge` (Inter, 600, 10.5 — a chip
reads at its own compact scale everywhere it appears; doesn't need to be a reusable text
style since it only ever lives inside the Badge component). `nav-item`'s active-state weight
bump to 600, and the tiny `kbd`/`proposed-field-chip` hints at 9.5, are the same kind of
component detail, not a 7th tier.

**Kept as its own style despite single-instance-per-screen (`title`):** a borrower name
header is a recurring *pattern* across every record (Aisha, Mohammed, etc. all hit it), even
though only one instance renders on any given screen — that's a legitimate reason to keep
a dedicated slot, unlike the merges above which were true duplicates.

**Six tiers, not three.** `CLAUDE.md` used to claim "three tiers only" while the code had already grown to 8 font-size tokens — that claim was aspirational, not real, so it's now documented honestly as six (table above). `value` (11.5/500) exists specifically because giving all ~30 field-row values in the account column the same weight as true emphasis (hero numbers, badges, names) made nothing stand out — restraint in weight is what makes emphasis mean something.

**Arabic overrides — apply to every style in the Arabic frame:**

| Property | Value | Why |
|---|---|---|
| Family | Tajawal 400 / 500 / 700 | Inter has no Arabic glyphs; the fallback is inconsistent |
| Line height | ×1.7 (multiply every value above) | Diacritics and descenders clip at 1.45 |
| Tracking | 0 on everything | Tracking breaks the connected script |
| Case | Never uppercase | Arabic has no case; `eyebrow` becomes Tajawal 11 sentence case |
| Italic | Never | No Arabic italic; Figma would fake-slant it |
| Weight | Never below 400 | Thin Arabic is illegible at UI sizes |

---

## 2. Component inventory

Build as components with variant properties. Property names in `code`.

### 2.1 Badge
`style` = quiet / alert / success / warning / teal · `dot` = true / false

| style | Fill | Text | Used for |
|---|---|---|---|
| quiet | bg/sunken | text/secondary | In collection, DPD, broken count, disputed=Yes in the detail block |
| alert | coral/wash | coral/base | Disputed status on a flagged card only |
| success | green/wash | green/base | Payment plan active, instalment amount, open promise |
| warning | amber/wash | amber/base | With legal |
| teal | teal/wash | teal/deep | Deal stage in the spine |

Padding 4 / 8 (`--sp-2` / `--sp-4`). Radius/sm (3). Dot 5×5 circle, `currentColor`, gap 4.

### 2.2 Stat
`size` = display / display-sm · `state` = filled / empty

Vertical stack: `eyebrow` → value (`display` or `display-sm`) → `sub` (optional) → bar (optional slot). Empty state replaces the value with the null string in text/muted. Alignment: end in the spine, start in the account column.

**All three spine stats now use `display` (not `display-sm`).** The promise-state stat used to be smaller "because it holds a string, not only a number" — that was an unexplained size mismatch across three parallel, equal-weight facts, and was corrected. It's also always exactly `eyebrow → value → sub` now, never a 4th row, regardless of record — a promise-state stat that grows a line breaks the spine's fixed height across records. Each spine stat also gets a shared `min-width: 104` so the three don't render at visibly different widths depending on content length.

### 2.3 Field row
`state` = filled / empty · `value` = text / number / badge / id · `width` = full / half

Label at inline-start, 46% width, `label` style. Value at inline-end, `value` style (weight 500 — not `emphasis`/600, see the 1.3 note on why field values stay one weight below true emphasis), end-aligned. Divider `line/hairline` below, none on last. Padding-block 6 (`--sp-3`).
- `value=number`: Mono tabular.
- `value=id`: Mono, always left-to-right, even in the Arabic frame.
- `state=empty`: value is the null glyph, label drops to 60% opacity. **The label never disappears.**

### 2.4 Account card
`state` = default / selected / flagged / selected-flagged

| Part | Spec |
|---|---|
| Container | Surface, radius/md (6), border 1 line/default uniform on all sides, padding 12 (`--sp-6`) |
| Flag indicator | **No border accent anymore.** A 6×6 coral dot before the lender name (Line 1), shown only when the card is flagged **and** its status/DPD badge isn't already coral for the same fact — never both, that was double-marking one alert. |
| Selected | Ring: `0 0 0 1px` teal/base, background pure white. No border-accent interaction with the flag: the ring and the dot are independent and can both show. |
| Line 1 | Flag dot (if applicable) + Lender name, `emphasis` (600) |
| Line 2 | Product · Reference, `secondary`, reference in Mono LTR, ellipsis-truncates with a hover title if it overflows |
| Line 3 | Outstanding `display-sm` at start, "of total" `secondary` at end |
| Bar | 5px, radius 3, track bg/sunken, fill **teal/base always** — the green "plan active" variant was removed, it's redundant with the success badge already on the card |
| Line 4 | Badge row, gap 4 (`--sp-2`): status, DPD, broken count, instalment |
| Reason cue | If flagged: a muted text line below the badges, "Reason for assignment ↑", pointing back to the escalation band |
| Key hint | Mono 9.5, text/muted, top inline-end corner |

Height at default content: **~120–130px** (grew slightly from the spacing-scale pass — padding/gaps are more generous than the original wireframe). Margin-block-end 8 (`--sp-4`).

### 2.5 Action button
`kind` = primary / default / disabled

**The inline caption is gone.** Icon + label only, single row, no second line — every button in the rail is now the same height regardless of state. Contextual info (capped, paused, windowed, the reason a channel is disabled) moved to a native hover tooltip (`title` attribute in code). In Figma, model this as a tooltip annotation on the component, not a visible sub-label — the point was exactly to stop it being visible by default (progressive disclosure: not every fact needs to be upfront).

Padding 10 / 12 (`--sp-5` / `--sp-6`). Radius/md (6). Min width 74. Icon 1em (~12px) + label `emphasis`-weight (600) at 12px, gap 6.
- primary: teal/base fill, white text, icon inherits white.
- default: surface fill, line/strong border; hovers to teal/wash fill + teal border.
- disabled: bg/sunken fill, text/muted, **dashed** border, `disabled` state (no caption, no colour cue beyond the muted/dashed treatment — the reason lives in the tooltip).

Row height: **~34–36px**, uniform across all four buttons (was 43px with the caption row).

### 2.6 Block
Header: padding 7 / 10, `eyebrow` at start, optional slot at end, 1px bottom border.
Body: padding 10 / 12 (`--sp-5` / `--sp-6`). Radius/md (6), margin-block-end 10 (`--sp-5`).
No collapse control. No chevron. Blocks never close.

### 2.7 Tab bar
Track: bg/sunken, radius/md (6), padding 4 (`--sp-2`), gap 4.
Tab: padding 6 / 10 (`--sp-3` / `--sp-5`), radius/sm (3), `secondary`, icon + label. Active: white fill, text/primary, weight 600.

### 2.8 Mini button
`kind` = default / primary. Padding 4 / 8 (`--sp-2` / `--sp-4`), radius/sm (3), 11px, icon + label gap 6. Default: surface + line/strong + text/secondary, hovers to teal border + teal/deep text. Primary: teal fill, white, 600, hovers to teal/deep fill.

### 2.9 Log row
`source` = human / ai / system · `state` = normal / new

Grid: a leading 6×6 dot slot (empty for non-AI rows, so the time column still aligns), then time column 92px fixed (`log-time`), then content. Padding-block 8 (`--sp-4`), gap 8, bottom hairline.
Content: outcome `emphasis`, then source · direction `label`, then note, then `label` (muted) author line — was `log-meta`, merged, identical spec.
- `ai`: a teal 6×6 dot in the leading slot — **no border accent** (was a 2px teal/wash inline-start border).
- `new`: teal/wash background, radius/sm corners, plus a brief 700ms flat colour flash on entry (white → teal/wash, no glow/box-shadow ring). **Persistent, not a toast.**

### 2.10 Entry form
Border 1px teal/base, fill teal/wash, radius/md (6), padding 10 / 12 (`--sp-5` / `--sp-6`), margin-block-end 10, elevation `shadow/md` (a soft, neutral-tinted drop shadow — the one deliberate elevation in the whole file, since this is the active write surface).
Row 1: outcome select + note input. Row 2: label + amount + date + Save (primary mini) + Cancel (default mini). Field gap 8, row gap 6.
Inputs: 12px, padding 6 / 8 (`--sp-3` / `--sp-4`), radius/sm (3), line/strong border (teal on focus), white fill. Amount and date inputs are always LTR.

### 2.11 Table
Header cell: bg/sunken, `table-head`, padding 6 / 8, 1px bottom border, sticky.
Body cell: padding 6 / 8, `table-cell`, hairline bottom border.
Numeric cells: end-aligned, Mono tabular. Row hover: teal/wash.

### 2.12 Bars
- **Progress bar:** 5px, radius 3, track bg/sunken, fill **teal/base always** (the green variant was removed — a "payment plan active" fact already has its own success badge next to the bar; colouring the bar too was two channels for one fact). Encodes outstanding ÷ total, or instalments paid ÷ total, identically everywhere it appears.
- **DPD bucket scale:** 6px, radius 3, track bg/sunken, fill coral/base at 70% opacity. Six 1px white ticks at 30/60/90/180/365 of a 760-day span. Fill starts at the reading edge, so it grows right-to-left in the Arabic frame.

These are the only two components allowed to encode a quantity as length. That channel is fully spent.

### 2.13 Escalation band
`state` = alert / calm

alert: coral/wash fill, 3px coral/base inline-start accent, padding 5 / 10. Contains the alert badge "Why this reached you", then the reason sentence in 600, then a second reason in 400, then the proposed-field chip.
calm: bg/sunken fill, line/strong accent, single sentence.

### 2.14 AI line
Padding 2 / 10 / 0, `secondary`. Eyebrow, timestamp, summary, proposed-field chip. Empty variant puts the summary text in text/muted.

### 2.15 Proposed-field chip
9.5px, text/muted, 1px **dashed** line/strong, padding 0 / 4, radius 3. Never wraps.

### 2.16 Null glyph
En dash `–` in text/muted. One character, one component. Never a blank cell, never "N/A", never `0`.

### 2.18 Logo mark (new — did not exist in the original wireframe)
A 20×20 glyph: a square with one corner (bottom-inline-end) cut to a diagonal, filled white on the dark nav (the "signal window" mark from `cleargrid-design.md`). Vector path in a 24×24 box: `M2,2 H22 V14 L14,22 H2 Z`. Sits beside a two-line wordmark — "ClearGrid" (14px/600) stacked above كليرجريد (10px/400, 50% opacity, Tajawal) — always stacked, even in the English frame, per brand spec. **Never mirrors, never recolours** in the Arabic frame.

### 2.19 Icon (new — did not exist in the original wireframe)
`name` = phone / chat / wa / mail / dash / users / wallet / chartbar / robot / megaphone / flow / pencil / columns / timeline / ticket

Real Phosphor (MIT-licensed) outline paths, not hand-drawn — sourced from the library, not invented. 1em square (sizes with its surrounding text: ~12px in nav items, ~14px inline with button/tab labels), 16-unit stroke weight on a 256 viewBox, round caps/joins, `currentColor` stroke (two icons — wallet, robot — have a small filled dot accent using the same colour). Always **decorative**, paired with an existing visible text label; never the only cue for what a control does. In Figma, import as vector components with `aria-hidden` noted in the description, not as a separate icon font.

### 2.17 Nav item
`state` = default / active · `mode` = full / collapsed
Icon (15×15) + label, gap 10 (`--sp-5`). Padding 6 / 8 (`--sp-3` / `--sp-4`), radius/sm (3), 12px. Active: solid `rgba(6,148,148,.22)` fill, white text, weight 600 — **no border accent** (this used to be a 2px teal inline-start border; removed along with every other one-sided accent border in the file). Hover (non-active): 6% white fill. Collapsed mode hides the label and the group headings, centres the icon.

---

## 3. Frame list

All frames 1440 × 900. The dark harness bar in the HTML is a test instrument and **is not part of any frame**.

| # | Frame | Record | Direction | Shows |
|---|---|---|---|---|
| F1 | Borrower profile — default | Omar, 2 accounts | EN, LTR | The submitted primary frame |
| F2 | Borrower profile — default | Omar, 2 accounts | AR, RTL | The mirrored build |
| F3 | Compare all accounts | Omar | EN | Section D table as a separate instrument |
| F4 | Log outcome open | Omar | EN | Entry mode, inline, list pushed down |
| F5 | Single account, hardship | Aisha | EN | One account, open promise, one broken |
| F6 | Density proof | Mohammed, 7 accounts | EN | Rail scrolls, spine does not, coral stays at 3 |

F1 to F4 are the submission. F5 and F6 are supporting evidence; include if there is room.

Plus one **annotation layer** above F1, toggled off by default, carrying the positional arguments from the spec document.

---

## 4. Layout skeleton

```
1440 × 900
├─ Nav          184  (64 below 1360)
└─ Stack       1256
   ├─ Spine    1256 × 172        locked, never scrolls
   └─ Columns  1256 × 727
      ├─ Borrower  288   scope: the borrower
      ├─ Account   480   scope: the selected account (widened from 420 — this is where every
      │                  field row lives, and it was the column actually short on room;
      │                  references were truncating while Activity sat mostly empty)
      └─ Activity  488   scope: events        (flex, min 340)
```

At 1280 the nav collapses to 64 and the activity column absorbs the difference at 428. Below 1280 is out of scope.

Column separators: 1px `line/default` on the inline-end edge of the borrower and account columns. None on the last.

---

## 5. Redlines

### 5.1 Spine (~180–190 tall — grew slightly with the spacing pass; no longer a fixed 172)

| Element | Value |
|---|---|
| Padding | 14 top / 18 sides / 12 bottom (`--sp-7` / `--sp-9` / `--sp-6`) |
| Avatar | 36 × 36, circle, bg/sunken, initials `emphasis` (600) |
| Avatar → name gap | 12 |
| Name row | `name-lg` (16.5) + `name-alt`, baseline aligned, gap 8 |
| Identity line | margin-top 4, gap 8, `secondary`: stage badge, Language, Owner |
| Stats group | pushed to inline-end, gap 22, text aligned end, **each stat min-width 104** |
| Stat internals | eyebrow → value → sub, no gap (line-height carries it) |
| Band | margin-top 10 — **the AI line is gone.** Only the escalation band renders in the band area now (deferred feature, see note in `regions.js`) |
| Action rail | margin-top 10, gap 6, height ~34–36 (no longer 43 — the caption row is gone) |
| Bottom border | 1px line/default |

**All three stats use `display` now**, including promise state — see 2.2.

### 5.2 Column head (sticky, ~28 tall)
Padding 7 / 12 / 6. bg/page. 1px bottom border. Eyebrow at start, control at end.

### 5.3 Column body
Padding 10 / 12 / 36. The 36 at the bottom clears the audit panel and gives the last block breathing room.

### 5.4 Borrower column
Totals row: bg/sunken, radius/md (6), padding 10 / 12 (`--sp-5` / `--sp-6`), margin-bottom 10, eyebrow at start and Mono value at end.
Cards: as 2.4, gap 7.
Reference block: standard block, full-width field rows.

### 5.5 Account column
Five blocks, gap 8, in this order and no other:
1. Balance and terms
2. Payment plan
3. Promises on this account
4. Portfolio fields
5. Record metadata

Block 1 opens with a hero: two stats side by side, gap 20, padding-bottom 8, hairline underneath. Stat A is outstanding with a progress bar. Stat B is DPD with the bucket scale. Below the hero, ten field rows in a 2-column grid, column gap 16, row gap 0.

Blocks 2 and 3 collapse to a single `secondary` line when empty and **keep their position and height allowance**.

### 5.6 Activity column
Head: tab bar at start; scope button and Log outcome button at end, gap 6.
Body: entry form (when open) then log rows.

---

## 6. RTL build rules

Figma has no direction property. Build F2 as a real mirror, not a flipped image.

| Do | Detail |
|---|---|
| Reverse every horizontal auto-layout | Nav moves to the right edge, stats to the left, action rail to the left |
| Flip inline-start accents to the right edge | Card accent, escalation band accent, log-row accent, active nav border |
| Set text alignment to right | Labels, values, headings. Field-row values align left (they were end-aligned) |
| Swap the type styles | Tajawal, ×1.7 line height, 0 tracking, sentence case |
| Grow the DPD fill from the right | The bucket scale reads with the text |

| Do not mirror | Reason |
|---|---|
| Emirates ID, phone, email, reference, account reference, lender ID | LTR data islands. `784-1988-4471209-3` reversed is a different number |
| Amounts and dates | Come from the formatter already correct; the currency marker sits after the amount by itself |
| Clock, search, checkmark icons | No directional meaning |
| ClearGrid logo | Never |
| The three `display` numerals | Digits are LTR in both frames |

**Digits stay Western in both frames.** One numeral system per user, everywhere, including placeholders.

---

## 7. Content for F1 and F2

Type these exactly. Do not invent values; the arithmetic reconciles.

### Borrower

| Field | EN | AR |
|---|---|---|
| Name | Omar Al-Hassan | عمر الحسن |
| Stage | In dispute | قيد الاعتراض |
| Language | Arabic | العربية |
| Owner | Faisal Noor | Faisal Noor |
| Total outstanding | AED 12,860 | ‏12,860 د.إ.‏ |
| Sub | across 2 accounts · of AED 18,500 | على حسابين · من ‏18,500 د.إ.‏ |
| Worst days past due | 146 | 146 |
| Sub | on Gulf Meridian Bank · as of 11 Sep 2026 | على بنك الخليج ميريديان · حتى 11 سبتمبر 2026 |
| Promise state | AED 1,420 | ‏1,420 د.إ.‏ |
| Sub | promised 6 Oct 2026 | موعود 6 أكتوبر 2026 |
| Escalation | Borrower disputes the Gulf Meridian Bank account, raised 26 Aug 2026. | المدين يعترض على حساب بنك الخليج ميريديان، سُجل في 26 أغسطس 2026. |
| ~~Last AI contact~~ | **Removed from the build — deferred feature, do not include in the frame.** The data still exists in `data.js` (`calls.ai_sum`) for a future reintroduction, but nothing renders it today. | — |
| Channels | Call, SMS, Email — icon + label, no caption. WhatsApp shown disabled (muted/dashed), reason "paused, dispute open" is a **hover tooltip only**, not visible text in the frame | نفس الشيء بالعربية |
| Phone / Email / EID | +971 55 321 7740 · omar.h@example.com · 784-1988-4471209-3 | identical, LTR |
| DOB / Gender / Nationality / Visa / Submitted | 5 Nov 1988 · Male · JOR · Resident · 30 Apr 2026 | 5 نوفمبر 1988 · ذكر · JOR · مقيم · 30 أبريل 2026 |

### Accounts, sorted by outstanding descending

| | Card 1 | Card 2 |
|---|---|---|
| Lender | Gulf Meridian Bank | Gulf Meridian Bank |
| Product · Reference | Personal loan · PL-11833 | Credit card · CC-77102 |
| Outstanding / Original | AED 8,000 of AED 11,500 | AED 4,860 of AED 7,000 |
| Bar fill | 70%, teal (bars are always teal now — the plan-badge already says "active") | 69%, teal |
| Badges | Payment plan active (success), 128 d (quiet), AED 1,420/mo (success) | **Disputed (alert)**, 146 d (quiet) |
| Flag dot | none (not flagged) | **none** — the Disputed badge is already coral for this fact, so the fallback dot doesn't render (one coral reference per fact, not two) |
| State in F1 | default | **selected + flagged**, plus a "Reason for assignment ↑" cue line below the badges |

The disputed card sorts second but is selected by default, because the escalation line names it. Sort order is fixed; selection is not.

### Selected account detail (CC-77102)

Overdue AED 4,860 · Last due 18 Apr 2026 · Principal AED 6,500 · Interest 2.99% monthly · Status Disputed (quiet badge) · Product Credit card · Lender Gulf Meridian Bank · Merchant `–` · Reference CC-77102 · Account reference AC-33011-GMB.
Payment plan: "No payment plan on this account."
Promises: "None on record."
Portfolio fields: Disputed Yes (quiet) · Dispute reason Transaction not recognised · Lender verification No · Settlement authority Blocked while disputed · Churn risk `–` · Repossession `–` · Hardship `–` · Employer `–`.
Record metadata: System · 30 Apr 2026 · Faisal Noor · 26 Aug 2026 · GMB-021.

### Activity, Interactions tab, this account

| Time | Outcome | Source | Note | By |
|---|---|---|---|---|
| 9 Sep, 20:15 | Dispute raised | AI voice · Outgoing | Borrower repeated that the transaction is not his and asked for the investigation result. | ClearVoice (AI accent) |
| 27 Aug, 16:20 | Reached borrower | Phone · Outgoing | Explained the review takes up to 14 days. No payment requested on this account. | Faisal Noor |
| 26 Aug, 14:05 | Dispute raised | Portal · Inbound | Dispute filed through the borrower portal. | Borrower |

**Coral count in F1: two.** Escalation band, and the Disputed badge on card 2. Under the budget of three.

---

## 8. Build order

| Step | Do |
|---|---|
| 1 | Colour and number variables (Part 1.1, 1.2) |
| 2 | Text styles, Latin set, then the Arabic set as a second collection (Part 1.3) |
| 3 | Atoms: badge, null glyph, proposed-field chip, mini button, bars |
| 4 | Molecules: field row, stat, action button, tab bar, log row, nav item |
| 5 | Organisms: account card, block, escalation band, entry form, table |
| 6 | Skeleton frame: nav, spine, three columns with the widths in Part 4 |
| 7 | F1 with the content in Part 7 |
| 8 | F2 by duplicating F1, reversing auto-layouts, swapping the type collection, then walking the Part 6 do-not-mirror list |
| 9 | F3, F4, then F5 and F6 if there is room |
| 10 | Annotation layer above F1 |

---

## 9. Checks before export

| Check | Pass |
|---|---|
| Coral elements per frame | ≤ 3 |
| Field rows with an empty value | Label still present, value is the en dash |
| Every amount | Carries AED |
| Every derived figure | Carries "as of" or a date |
| Arabic frame | No Inter anywhere, no tracking, no uppercase, line heights ×1.7 |
| Arabic frame | Emirates ID, phone, email and all references still read left to right |
| Arabic frame | No English strings left in any label |
| Spine | Identical coordinates in F1, F3, F4, F5, F6 |
| Account column | Same five blocks, same order, in every frame |
| Greyscale export | Every status still readable |
| Overlay F1 and F2 | Mirror is complete; the do-not-mirror list is intact |
