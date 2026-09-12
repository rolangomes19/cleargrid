# Borrower Profile v3 — Design Rationale for Review

This document answers five questions about the current build: what it achieves against the
original brief, what it doesn't (and why), what was added beyond the brief, what's left on
the table, and what to ask stakeholders before calling this finished.

Written after the v3.2 pass (AI/human call history, broken-promise type, Email inbox,
contact-attempt sparkline). Companion documents: `spec.md` (full positional defence of the
layout), `figma-handoff.md` (token/component inventory).

---

## 1. What this design achieves from the original brief

**All six data-element groups (A–F) are represented and traced to a canonical field.**
Borrower/loan info, financial status, PTP & call logs, the multi-deal table (via Compare
all), account detail, and four of five action buttons are all present, verified live across
four test records (2-account dispute, 1-account hardship, 7-account stress case, and an
all-null sparse case) and both directions.

**Visual hierarchy is real, not decorative.** Three typographic tiers, a single alert colour
capped at three instances and never repeated for the same fact twice, spatial stability
across every record (same field, same coordinates, populated or not), and a computed "why
this reached you" line that turns raw status flags into a sentence an agent can read once.

**Component-based thinking.** Reusable atoms (badge, field row, block, bar, sparkline, icon)
assembled into the three-scope layout (borrower / account / activity), not one-off markup
per screen.

**Bilingual and RTL is a real build, not a mirrored skin.** Tajawal loaded and scoped
correctly, logical CSS properties throughout, LTR islands on IDs/phone/reference, Western
digits and Gregorian calendar pinned via `Intl`, dual/plural Arabic grammar on counted nouns,
and icon mirroring done by meaning (`scaleX`, not `rotate`) so asymmetric glyphs don't break.

**UX rationale exceeds the brief's ask.** Requirement asks for "2–4 bullet points or a short
Loom." This project has a 450-line positional defence (`spec.md`) plus this document, both
traceable to the two research documents you supplied (`dense-ui-design-guide.md`,
`cleargrid-agent-persona-research.md`).

---

## 2. What it does not achieve, and why

### 2.1 No Figma file yet — by sequencing choice, not oversight
The brief's deliverables table lists a Figma file as required. This project is a coded
prototype; the plan (confirmed with you) is to treat the HTML build as the source of truth
and transcribe it into Figma once the UI itself stops changing, using `figma-handoff.md` as
the component/token inventory for that pass. **Reasoning:** building Figma frames against a
UI that's still absorbing structural feedback (like this round) means redoing the Figma work
after every change. Sequencing it last means one clean transcription pass instead of several.
**Cost of this choice:** none if the review process accepts a coded prototype as the working
reference before Figma exists; real cost only if a Figma link is needed *before* the UI is
finalized.

### 2.2 "Accordions" and "collapsible" are deliberately absent
The brief's component list names accordions as an example of reusable components, and
requirement 2 asks for thinking about what's "prominent, grouped, collapsible, or tabbed."
This build bans accordions and disclosure controls outright (architecture rule #4).
**Reasoning:** the agent persona research and the design guide both converge on the same
finding — the agent's highest-stakes moment is mid-call, glance-mode, zero-click-budget, and
an accordion expand costs them the thread of what the borrower is saying. Nielsen's own
response-time framing (progressive disclosure defers *advanced or rarely used* features, not
the primary working set) plus the clinical alert-fatigue literature both argue against
hiding brief-mandated data behind a click. Tabs are used (Interactions/Messages/Timeline/
Tickets) because switching between *equally-weighted alternate views* is a different action
than *hiding data that should be visible*. This is a considered deviation from the brief's
literal wording, not a miss — but it's worth stating explicitly in whatever you submit, so a
reviewer scoring against the checklist sees the reasoning rather than an unexplained gap.

### 2.3 Fonts load from a CDN, not embedded
Tajawal / Inter / JetBrains Mono load from `fonts.googleapis.com`. An offline reviewer opening
the HTML file sees fallback fonts, particularly noticeable on Arabic.
**Why it's still open:** it's a mechanical fix (self-host or base64-embed at build time) that
wasn't prioritized this round in favor of the structural changes below. **Does this matter if
the design ends up in Figma?** No — this is purely an artifact of shipping a live HTML file.
Figma doesn't fetch fonts over a CDN at view time; it needs the three font families available
to the Figma editor (installed locally, or pulled from Figma's own font library/Google Fonts
integration) at the point someone opens the file, which is a one-time editor-side setup step,
not a deliverable-robustness problem the way it is for a self-contained HTML file. If the
final deliverable stays partly coded (e.g., a linked prototype alongside Figma frames), it's
worth fixing before that link goes to anyone outside the team.

### 2.4 Merchant name is not shown bilingually side-by-side
The brief lists "Merchant Name (Arabic/English)" with the same bilingual framing as
"Name (Arabic + English)" for the borrower. Borrower name renders both languages
simultaneously regardless of UI language (`Omar Al-Hassan عمر الحسن`); merchant name renders
in whichever language is currently active, not both at once. **This was a deliberate choice
to keep, not a gap** — see the comparison below.

| | Borrower name | Merchant name |
|---|---|---|
| **Appears** | Once per record, in the spine header — the single most-referenced identity fact on the page | Once per row, inside dense contexts: an account card, a field row, a compare-table cell |
| **Why it matters bilingually** | The agent may need to *say* the name to the borrower or read it off a second system in the other language — it's spoken, cross-referenced, and it's the thing everything else on the page is "about" | The agent reads it to identify a lender/BNPL provider, not to say it aloud to the borrower or cross-reference it against another system |
| **Space cost of dual-language** | One header, ~300px of width, paid once per page load | Dozens of instances per screen at scale (every account card, every compare-table row) — paying that cost per-row multiplies it by account count |
| **Precedent in ClearGrid's own product** | The agent-research doc confirms ClearGrid's own AI Voice view treats bilingual *identity* fields side-by-side | No equivalent precedent found for merchant/lender fields specifically |
| **Conclusion** | Side-by-side justified: one field, high reference value, fixed cost | Side-by-side not justified at this density: repeated field, lower reference value per instance, multiplies layout cost by account count |

If a future round wants merchant name bilingual too, the data already carries both languages
(`{en, ar}` per merchant) — it's a small, mechanical change, just not one that pays for itself
at the density this page currently runs.

### 2.5 DPD/status colour is escalation-driven, not portfolio-relative
The design guide's literal rule is "colour encodes deviation from the *portfolio median*, not
from zero." This build instead ties coral to categorical routing reasons (disputed / hardship
/ broken promise / first-human-contact) rather than a DPD-vs-median calculation.
**Decision: keep as-is.** The categorical approach ties coral directly to *why the case
reached a human in the first place*, which is the persona research's actual framing — an
agent doesn't need to know "this DPD is unusual for the queue," they need to know "this is why
you, specifically, are looking at it." A portfolio-median calculation would need a live
queue-wide DPD distribution the current record set doesn't model, for a signal that's a
weaker proxy for the same underlying question. Worth being able to explain this exact
trade-off if asked, since it's a literal departure from the guide's wording.

---

## 3. New features added beyond the brief, and why

| Feature | Brief requirement it extends | Why it was added |
|---|---|---|
| **Computed "why this reached you" line** | Not requested; brief lists dispute/status fields as flat data | Both research documents independently identify this as the single biggest gap in the current production page — it converts raw flags into the one sentence an agent needs before saying anything on a call |
| **Contact history block** (human/AI call counts, last-answered timestamps, AI outcome summary) | Brief §C: Total Human/AI Calls, Latest Human/AI Call Answered | The data existed in the model but nothing rendered it; without it an agent risks re-asking a question the AI already asked, which the persona research names as the costliest failure mode for this specific role |
| **Contact-attempt sparkline** | Not requested | A word-sized shape (10 weekly bars, answered weeks highlighted) answers "has this borrower gone quiet or just started engaging" faster than reading four separate counters and comparing dates |
| **Broken-promise type** (missed / partial payment / no contact) | Brief §C: "Type, date, and count of broken PTPs" — type was previously missing | Closes a literal brief field that was only partially modeled (count + date existed, type didn't) |
| **Dedicated Email inbox action** (replacing the compose-only Email button) | Brief §F: Email Inbox — "View received emails" | The brief lists Email and Email Inbox as two separate actions; only compose existed. Inbox now jumps straight to the Messages tab across all accounts, which is where received messages already live |
| **Coral budget + no-repeated-alert rule** (max 3 coral elements; same fact never colored twice) | Not requested; brief shows heavy flat colour-coding in the original screenshots | Directly answers the alert-fatigue literature cited in the design guide — repeated identical alerts are the documented driver of agents tuning out warnings entirely |
| **Side-by-side bilingual borrower name** | Brief: "Name (Arabic + English)" | Matches ClearGrid's own confirmed pattern (side-by-side bilingual identity fields in their AI Voice view) rather than toggling between two mirrored frames for the one field that's read aloud |
| **Per-vertical configurable "Portfolio fields" block** (churn / repossession / settlement authority / hardship, shown per lender vertical) | Brief §E: "Custom Attributes: lender verification, dispute status, etc." | The persona research flags that ClearGrid serves four different verticals with different risk signals; a fixed generic grid would read as a grab-bag, so the block is explicitly labelled as configuration-driven |
| **Compliance state on the control itself** (disabled Call/SMS/WhatsApp button with a tooltip reason, e.g. "paused, dispute open") | Brief §F lists the actions with no state model | Persona research confirms contact-window/DNC rules are enforced at decision time; surfacing that on the button avoids the agent discovering a suppression only after attempting the action |
| **Live self-test harness** (squint blur, greyscale filter, and an audit panel reporting glance-facts-in-view, coral count, and per-record task-success checks) | Not requested | Builds the design guide's own evaluation methodology (squint test, greyscale test, salience count) directly into the page, so the design's claims are measured, not asserted, on every record and in both directions |
| **Motion pulse on newly-logged entries only** | Not requested | Matches the guide's "reserve motion for one thing: a genuinely new event" rule, and honours `prefers-reduced-motion` |
| **Dual/plural Arabic grammar on counted nouns** (e.g. "وعدان قائمان" for 2 vs "٣ وعود قائمة" for 3) | Brief asks for "proper RTL execution" generally | Goes past mirroring into actual Arabic grammatical correctness, which a native reader notices immediately when it's missing |

---

## 4. Features that could still be added, not currently in this design

- **Portfolio-relative DPD colouring** — computing an actual queue-wide DPD distribution and
  flagging deviation from it, instead of (or alongside) the current escalation-driven
  approach. Would need a modeled "queue" of records to compare against, which doesn't exist
  yet in this four-record test set.
- **Compact/comfortable density as a real user preference**, not just a harness toggle.
  Salesforce's own data suggests this is worth shipping as a setting, but it was deliberately
  cut from the submission and kept as a documented talking point (`spec.md` §4.5).
- **Brushing/linking** — hovering an interaction-log row highlighting the account it belongs
  to. Cheap to build, not yet done.
- **Balance-trajectory sparkline** — flat-for-18-months vs. stepping-down tells a different
  story about the conversation ahead; only contact-attempt history got a sparkline this round.
- **Embedded/self-hosted fonts** instead of the Google Fonts CDN, for a fully offline-safe
  HTML deliverable (moot once the canonical deliverable is Figma — see §2.3).
- **A genuinely separate Email Inbox view**, filtered to email-only messages, rather than
  jumping to the general Messages tab (which mixes SMS/WhatsApp/email). The current version
  satisfies "view received emails" but doesn't isolate them.
- **Dynamic per-vertical field configuration**, where the "Portfolio fields" block's shape is
  driven by actual lender-vertical config rather than being hand-authored per test record.
- **Merchant name side-by-side bilingual treatment**, if a future review decides the repeated-
  instance cost (§2.4) is worth paying anyway.
- **Figma frames and redlines** (`TASKS.md` T6) — deliberately sequenced last; see §2.1.

---

## 5. Questions worth raising with the review team

1. **Is a coded, interactive prototype acceptable as the primary submission, with Figma
   frames following once the UI is stable** — or is a Figma file/link required at submission
   time regardless of the prototype's existence?
2. **Does "escalation reason" exist as structured data in ClearGrid's system today**, or is
   the computed "why this reached you" line (built from existing status flags) a UI-only
   read, or does it require a data-model change? This affects how the feature should be
   pitched — a design idea vs. an engineering ask.
3. **Is there an existing AI-call transcript/summary agents already reference** before taking
   over a case, and if so, where does it live? The "AI outcome" field added this round uses a
   short synthesized summary — worth confirming this matches (or should be sourced from) a
   real system field rather than being invented per record.
4. **Does "Custom Attributes" vary by lender vertical in the live product?** If yes, the
   "Portfolio fields" block should be treated as a dynamic per-portfolio panel rather than a
   fixed set of fields per test record, which is how it's currently built.
5. **Is full mirrored RTL (as built) the right convention for agent-facing tools specifically**,
   or does ClearGrid's internal tooling follow the side-by-side bilingual pattern used in
   borrower-facing messaging? The borrower-name field already takes the side-by-side approach
   as a middle ground — worth confirming that's the right call for this tool.
6. **Does the invented broken-promise taxonomy (no payment / partial payment / no contact
   after due date) match categories ClearGrid actually tracks?** This was added to satisfy the
   brief's literal "type" field with no existing enum to draw from.
7. **If the accordion/collapsible language in the brief is being scored literally**, should
   the rationale document (this one) accompany the submission directly, so the no-disclosure
   architecture reads as a decision rather than an omission?
