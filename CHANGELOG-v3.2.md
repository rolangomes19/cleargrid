# ClearGrid Borrower Profile — v3.2 session changelog

**Written from conversation memory, not from the current on-disk files.** The working tree
has been reverted again during this session — `components.js`, `core.js`, `data.js`,
`regions.js`, and `index.html` all sit back at the original tar.gz extraction timestamp
(11 Sep, 19:48), and `tokens.css`/`app.js`/`i18n.js` carry newer timestamps but stale,
pre-v3.1 content (uppercase-mono eyebrow labels, no Phosphor icons, the old `dpdScale` bucket
bar still wired up). This is the same corruption fingerprint the existing root
`CHANGELOG.md` already documented from an earlier session — it has apparently recurred and
this time took every edit made in this session with it. **None of the work below currently
exists in the working tree.** This document is the rebuild reference, in the order decisions
were actually made, not a diff of what's on disk.

This session picked up at v3.1 — the state the prior session's `CHANGELOG.md` and the
then-current `CLAUDE.md` describe (T1–T4 behavioral tasks done, four-tier typography
resolved, Phosphor icons in place). Everything below is new on top of that baseline.

---

## 1. Brief-compliance review

**Reference:** `docs/cleargrid-borrower-profile-redesign-brief.md` (top-level `docs/`, the
original case-study brief).

**Method:** ran `build.sh` + `test/verify.js`, then inspected the live build in the Browser
pane at 1440×900 in both EN and AR, across all four test records (Omar/2 accts, Aisha/1 acct,
stress/7 accts, sparse), including the Compare-all deal table.

**Findings reported (no code changed at this stage):**
- All six data-element groups (A–F) traced to a canonical field and confirmed rendering.
- Gap: no Figma file/frames exist — only the coded prototype and an admittedly-stale
  `docs/figma-handoff.md`; `TASKS.md`'s T6 (Figma export) was still unstarted.
- Gap: the architecture's no-accordion rule (`CLAUDE.md` rule 4) is a literal departure from
  the brief's own wording ("collapsible", "accordions" named as an example component).
- Gap: "Email Inbox" (brief §F) had no dedicated action — only a compose-style Email button.
- Gap: action buttons (Call/SMS/WhatsApp/Email) were visually gated but had no click handlers.
- Gap: broken-promise "type" (brief §C) wasn't modeled — only count + last-broken date.
- Minor: fonts loaded from the Google Fonts CDN, not embedded.
- Minor: `docs/spec.md`'s own decision log had an open question (which record(s) go in the
  submitted EN/AR frames).

---

## 2. Design-guide and persona-research review

**References:** `docs/dense-ui-design-guide.md` (perception/cognition-sourced design
guidance) and `docs/cleargrid-agent-persona-research.md` (who actually uses this screen and
why, sourced from cleargrid.co and the four original production screenshots).

**Method:** cross-checked the live build against each guide rule directly in source
(`core.js`, `components.js`, `regions.js`, `tokens.css`) and confirmed behavior in the
browser and via `test/verify.js`'s audit output.

**Confirmed matches (no code changed):** the computed "why this reached you" escalation line,
the coral alert budget (max 3, never repeated for the same fact — verified `statusBadge`
is called with `flag=false` everywhere except the one card that should carry the alert),
never-color-alone badges, absolute spatial stability, inline field-row labels, the
bullet-graph-style outstanding/DPD bars, motion reserved for genuinely new events only (with
`prefers-reduced-motion` honored), compliance state surfaced on the action buttons themselves,
side-by-side bilingual borrower name, per-vertical configurable "Portfolio fields", and the
built-in squint/greyscale/behavioral-audit self-test harness.

**Major finding:** `data.js` fully populates `calls.h`, `calls.ai`, `calls.lastH`,
`calls.lastAi`, and `calls.ai_sum` for every record, but a repo-wide search showed the only
read of `r.calls` anywhere in the rendering code was one boolean check in `core.js`'s
`reasons()` — the counts, timestamps, and AI outcome summary were never displayed. Both
reference documents independently name this the single biggest opportunity (the guide's own
worked Level-2 example is almost word-for-word this exact field; the persona research ranks
it item #2, right under the escalation line).

**Minor findings:** merchant name doesn't get the same side-by-side bilingual treatment as
borrower name; no sparkline existed for contact-attempt history over time (guide names this
an "initiative" opportunity); DPD/status coloring is escalation-driven rather than
portfolio-median-relative (a literal departure from the guide's wording, flagged as a
judgment call rather than a defect).

---

## 3. Consolidated punch list

A 9-item list was compiled from both reviews above, each with a plain-language description
and a rough cost estimate, delivered as a standalone message with **no code changes** —
purely descriptive, per the user's explicit request not to enforce anything at that point.

---

## 4. User decisions on the punch list, and what was built

| # | Item | Decision | Outcome |
|---|---|---|---|
| 1 | AI/human call history not rendered | Fix it | Implemented — see §5 |
| 2 | No Figma file | Defer until UI is finalized | No code change; documented as a sequencing decision |
| 3 | No dedicated Email Inbox action | Add it, remove Email compose | Implemented (later revised — see §6) |
| 4 | Merchant name not bilingual | Keep single-locale; document why | No code change; comparison table written into `docs/design-rationale.md` |
| 5 | No-accordion deviates from brief wording | Document the decision | No code change; rationale written into `docs/design-rationale.md` |
| 6 | No contact-history sparkline | Add it | Implemented — see §5 |
| 7 | Broken-promise "type" not modeled | Add it | Implemented — see §5 |
| 8 | Fonts load from CDN | Question: does this matter for Figma? | Answered directly (no — Figma doesn't fetch fonts over a CDN at view time; this is purely an HTML-deliverable concern) and documented; no code change |
| 9 | DPD coloring is escalation-driven, not portfolio-relative | Keep as-is | No code change; reasoning documented |

---

## 5. Implementation pass 1 — files and exact changes

- **`src/i18n.js`** — new keys added to both the `en` and `ar` dictionaries: `noContact`,
  `emailInbox`, `blk.calls` ("Contact history" / "سجل التواصل"), `f.humanCalls`, `f.aiCalls`,
  `f.lastHuman`, `f.aiSummary`, `f.brokenType`, and the `e.brokenType` enum
  (`missed`/`partial`/`noContact`, each with an EN and AR label).
- **`src/data.js`** — added `brokenType:'missed'` to Aisha's `DL-20481` account. Extended the
  stress-record's seed-array generator with a 10th tuple field for broken-promise type:
  `FB-8802` → `missed`, `ET-8820` → `partial`, `EN-8841` → `noContact`, `PP-8855` → `missed`;
  the three accounts with `broken:0` got `null`.
- **`src/components.js`** — added `sparkline(logs)`: buckets the last 10 weeks of interaction
  logs, sizes each bar by attempt count, and marks weeks containing an "answered" outcome
  (`rpc`/`promise`/`plan`/`kept`) in teal via an `ANSWERED` set.
- **`src/regions.js`** —
  - New "Contact history" block inserted in `borrowerCol()` between the account cards and the
    borrower-reference block: human/AI call counts in a 2-column grid, last-human/last-AI
    contact timestamps, an AI-outcome summary rendered as a full-width prose paragraph (not
    a label/value row — see the CSS note below), the sparkline underneath, and a
    `.emptyline` fallback ("No contact history on record.") for the all-null sparse case.
  - Added a `brokenType` field row to the account column's "Promises on this account" block,
    paired alongside `brokenLast`.
  - Replaced the action rail's `Email` button with a dedicated `Email inbox` button
    (`id="b-inbox"`).
- **`src/app.js`** — wired `b-inbox`: sets `S.compare=false`, `S.tab='m'`, `S.scope='all'`,
  then re-renders — jumps straight to the Messages tab across every account.
- **`src/tokens.css`** — added `.spark`/`.spark i`/`.spark i.ans` rules for the sparkline
  (flex row of height-varying bars); added `.row.prose` so the AI-outcome sentence wraps as a
  normal start-aligned paragraph instead of inheriting the field-row default (46%-width label
  column + right-aligned, half-width value) that every other "wide" row uses — that default
  is fine for short phrases (settlement authority, dispute reason) but produced an ugly
  ragged, narrow wrap for a full sentence.
- **`cleargrid/docs/design-rationale.md`** (new file) — the five-section rationale document
  requested by the user: what the design achieves from the brief, what it doesn't and why,
  new features added with a one-sentence justification each, features still open, and seven
  questions for the review team. Includes the merchant-name bilingual comparison table
  (§2.4 of that document) and the reasoning for keeping the no-accordion architecture and the
  escalation-driven (not portfolio-median) coloring model.

Verification after this pass: `build.sh` + `test/verify.js` clean (zero errors) across all
four records × both directions; live checks in the Claude Browser pane confirmed the new
block's content, the sparkline's bar/highlight count, the Email-inbox button's tab/scope
side effects, and the broken-promise-type text in both languages via direct DOM/state
inspection (`document.body.innerText`, `S.tab`, `S.scope`, `R.stress.accts[...].brokenType`).

---

## 6. Round 2 — annotated screenshot review, five fixes

The user reviewed the live build in-browser (Aisha's record) and marked up a screenshot with
five requested changes:

1. **Removed the "proposed field" chip** from the escalation band in `regions.js` — both the
   flagged (`rs.length` truthy) and calm branches of the `band` template lost the trailing
   `<span class="prop">${T_.proposed}</span>`.
2. **Restored a separate Email (compose) button** alongside Email inbox, since routing
   "Email" straight to Messages left no way to compose one — the rail went back to 5 actions:
   Call / SMS / WhatsApp / Email / Email inbox.
3. **Removed the DPD bucket-scale bar** (`dpdScale()`) from the account column's "Balance and
   terms" block — flagged as adding no value — and resized the Days-past-due stat's number
   from `.t-display.sm` to the same `.t-display` size as Outstanding, so the two stats read
   as structurally identical (label, number, sub-caption), differing only in that Outstanding
   keeps its proportion bar (which does carry information). The now-unused `dpdScale()`
   function and its `BUCK` constant were deleted from `components.js`, and the `.dpdbar` /
   `.dpdbar i` / `.dpdbar u` rules deleted from `tokens.css`, rather than left as dead code.
4. **Widened the borrower column (col 1)** from 288px to 320px — both `.cols` and
   `.cols.compare` grid-template-columns in `tokens.css` — and updated the explanatory code
   comment in `regions.js` that referenced the old 288px pixel math for label-wrapping.
5. **Removed mono/tabular-number styling from phone and email fields** — `core.js`'s `ltr()`
   helper gained an optional `plain` parameter (`ltr(s, plain)`) that skips the `.num` class;
   `regions.js`'s calls for `r.phone` and `r.mail` were updated to pass `true`. Emirates ID,
   references, and lender ID kept the mono/tabular treatment, since those are genuine IDs
   rather than phone/email text.

`docs/design-rationale.md` was sent to the user as a file via the file-delivery tool at this
point, per their request.

Verification: `build.sh` + `test/verify.js` clean; live browser checks confirmed the button
label list (`Call, SMS, WhatsApp, Email, Email inbox`), `document.querySelector('.prop')` and
`.dpdbar` both returning `null`, `#c-bor`'s computed width at 320px, and the phone field's
class list reduced to `ltr` (no `num`) — all read directly via `javascript_tool` against the
live page rather than inferred from a screenshot.

---

## 7. Round 3 — Balance-and-terms stat split

One more live-review fix: the Outstanding and Days-past-due stats inside "Balance and terms"
were sticking together instead of splitting evenly. Added a scoped rule,
`.hero .stat{flex:1 1 0;min-inline-size:0}`, in `tokens.css` — deliberately scoped to `.hero`
only, since the base `.stat{flex:0 0 auto}` rule is shared with the spine's own three-stat
row (Total outstanding / Worst DPD / Promise state), which should keep sizing to its content
rather than being forced to split evenly. Verified via
`getBoundingClientRect()` in the live browser: both stats measured 48% of the hero container's
width (the remaining ~4% is the flex gap), confirming an even split.

---

## 8. This document

Written after discovering, via the harness's own file-change notices, that `tokens.css` and
`app.js` had reverted to pre-v3.1 content, and that `components.js` / `core.js` / `data.js` /
`regions.js` / `index.html` were sitting at the original extraction timestamp — meaning every
change described in §5–§7 is currently absent from the working tree. This is the same
corruption fingerprint already documented once before, in the existing root `CHANGELOG.md`,
from an earlier session. Per the user's instruction, this document was written from
conversation memory rather than by reading (or trusting) the current on-disk state.

**Files referenced throughout this session:** `docs/cleargrid-borrower-profile-redesign-brief.md`,
`docs/dense-ui-design-guide.md`, `docs/cleargrid-agent-persona-research.md` (top-level `docs/`,
supplied reference material); `cleargrid/CLAUDE.md`, `cleargrid/TASKS.md`,
`cleargrid/docs/spec.md`, `cleargrid/docs/figma-handoff.md`, `cleargrid/README.md` (project's
own working docs); `src/core.js`, `src/i18n.js`, `src/data.js`, `src/components.js`,
`src/regions.js`, `src/app.js`, `src/tokens.css`, `src/index.html` (source, per the file
table in `CLAUDE.md`); `build.sh` / `test/verify.js` (build and verification, run after every
change per `CLAUDE.md`'s own instruction); `cleargrid/docs/design-rationale.md` (created this
session); the existing root `CHANGELOG.md` (an earlier session's own recovery document,
referenced here as evidence this is a recurring environment issue, not a one-off).

**Not addressed by this document:** restoring the working tree to match the state described
above. That would be a separate, substantial task — re-applying §5–§7 file-by-file — and
wasn't what was asked for here.
