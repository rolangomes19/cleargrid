# Borrower Profile v3 — Design Specification and Positional Defence

Planning document. Nothing here is built yet. Every layout decision below states what the section does, where it sits, why it sits there, what tier it occupies, what evidence supports it, and what breaks if it moves.

Written against: the case-study brief, the agent persona research, the design assumptions, the dense-UI research guide, the verified ClearGrid design reference, the four production screenshots, the three-layout wireframe (v1), the Console build (my v2), and the two ChatGPT prototypes with their analysis document.

---

## Part 0 — The one-sentence argument

**The current page fails because it renders three different scopes of data as one flat list of fields. v3 gives each scope its own column, and locks the facts that must never move into a band above all three.**

Everything downstream follows from that. If you only read one part of this document, read Part 2.

---

## Part 1 — What the screen is for

### 1.1 The user

Not a generic collections agent. ClearGrid automates roughly 95% of case volume, so a human is looking at this record because a bot could not or should not handle it. The agent is rarely the first voice the borrower has heard, is scored on the same QA rubric as the AI, and works under contact rules enforced at dispatch time rather than by memory.

### 1.2 Three modes, not one

| Mode | When | Attention | Click budget | Failure looks like |
|---|---|---|---|---|
| **Glance** | Live call | 1 to 3 seconds per look | Zero | Agent asks something the borrower already answered |
| **Review** | Before the call, between shifts | 30 to 90 seconds | Normal | Agent misses a dispute or a plan already in place |
| **Entry** | Immediately after the call | Sustained | Normal | Outcome logged wrong or not at all |

The ChatGPT pass optimised almost entirely for the pre-call scan. That framing is correct and I am adopting its vocabulary, but assumption 13 in the project file, which came from you directly, says the page is also a review surface as a first-class case. v3 serves all three modes without trading one against another, and the mechanism is in Part 2.

### 1.3 The agent's questions, in order

1. Who am I about to speak to, and in which language?
2. Why did this reach a person?
3. How much, and how late?
4. What was promised, and did it hold?
5. What has already been said, by the AI and by us?
6. Can I contact them right now, and on which channel?
7. Which obligation are we actually discussing?
8. What do I record afterwards?

Questions 1 to 6 are borrower-scope and must be answerable with zero clicks. Question 7 is where every previous version broke. Question 8 is where both my v2 and both ChatGPT versions are still weakest.

---

## Part 2 — The structural insight

### 2.1 Three scopes, currently conflated

Every field in the brief belongs to exactly one of three scopes:

| Scope | Cardinality | Fields |
|---|---|---|
| **Borrower** | 1 | Name (AR+EN), gender, nationality, DOB, Emirates ID, visa, language, deal owner, submit date, phone, email, escalation reason, contact eligibility, human/AI call counts and last-answered times, aggregate exposure |
| **Account** | 1..n | Reference, account reference, balance, total, overdue, due date, DPD, status, product, merchant, lender and ID, principal, interest/EMI, payment plan, schedule flags, PTP, broken promises, custom attributes, record metadata |
| **Event** | 0..m, each belonging to an account | Interaction logs, communication logs, timeline entries, tickets |

The production page renders all three as one vertical list. That is why "Financial Status" is ambiguous, why "Custom Attributes" is a grab-bag, and why a borrower with three debts has no coherent representation. Verified in both ChatGPT prototypes: v2.html shows Omar's header as AED 11,800 outstanding while its own deal table sums to AED 16,000, because the header is showing one account and labelling it as the borrower.

### 2.2 The fix

**One column per scope, plus a locked band for the facts that outrank all of them.**

```
┌──────────────────────────────────────────────────────────────────────────┐
│ NAV  │  SPINE  (locked, never scrolls, identical coordinates always)     │
│      ├──────────────────────────────────────────────────────────────────┤
│      │ BORROWER COLUMN │ ACCOUNT COLUMN      │ ACTIVITY COLUMN          │
│      │ scope: 1        │ scope: selected 1   │ scope: events            │
│      │                 │                     │                          │
│      │ totals          │ balance & terms     │ tabs + scope filter      │
│      │ account card ▸  │ payment plan        │ [log outcome]            │
│      │ account card ◂  │ promises            │ event                    │
│      │ account card    │ portfolio fields    │ event                    │
│      │ ...             │ record metadata     │ event                    │
│      │ borrower ref    │                     │ ...                      │
│      │ ⇅ scrolls       │ ⇅ scrolls           │ ⇅ scrolls                │
└──────────────────────────────────────────────────────────────────────────┘
```

The page itself never scrolls. Only panes do.

### 2.3 Why this dissolves the duplication problem

v2_1 restates roughly fourteen record-bar facts in the "Pre-call context" grid directly beneath it. Chunks 1, 2 and 3 are verbatim repeats of the bar above; only chunk 4 adds anything. That is not carelessness. In a scrolling document the Tier 1 facts either scroll away or get restated next to the content they govern.

Remove the page scroll and the restatement has no job. The spine cannot leave the screen, so nothing needs to echo it. This recovers about one viewport of height and removes the repetition that the same analysis document lists as defect number one.

### 2.4 Why a frame rather than a document

| Argument | Source |
|---|---|
| Expert users build long-term memory of *where things live*, not of pixels. Previewing a layout gives no perceptual advantage; knowing coordinates does. | Wolfe on postattentive vision, via the research guide §2.4 |
| Interruptions (looking at paper notes and back) cause change blindness. A layout that has scrolled since the last look is a changed layout. | Research guide §2.5 |
| Overview plus detail, both regions visible, is the strongest of the four focus-plus-context techniques for this screen. Zooming, which is what accordions and page scroll do, is the weakest. | Cockburn, Karlson and Bederson, via §3 |
| Every serious daily-use tool for expert operators is a frame: IDEs, mail clients, trading terminals, DAWs. Documents are for reading once. | Convention, stated as convention |

---

## Part 3 — Region-by-region defence

Each section states: **Does / Scope / Position / Tier / Why here / Breaks if moved.**

### 3.1 Product navigation (unchanged)

- **Does:** platform-level navigation.
- **Scope:** application.
- **Position:** inline-start edge, full height, 184px, collapses to 64px icon rail below 1360px.
- **Tier:** 3.
- **Why here:** it already exists, agents already know it, and the research says do not move furniture that is working. The only change is deleting the "Explore ClearVoice" marketing card, which is an advertisement inside a tool someone stares at for eight hours.
- **Breaks if moved:** relearning cost for zero gain.

### 3.2 The spine

- **Does:** answers questions 1 to 6 without a click.
- **Scope:** borrower only. No account-level number appears here unless it carries its scope in the label.
- **Position:** full width below the top edge, above all three columns, approximately 150px, locked, never scrolls, identical coordinates on every record.
- **Tier:** 1.
- **Why here:** it is the only region read during a live call. Top-of-frame is the one coordinate an agent can find without searching. Locking it is what makes the other three columns safe to scroll.
- **Breaks if moved:** if it scrolls, glance mode dies and the design regresses to v2_1's duplication. If it becomes customisable, the team loses a shared vocabulary for handoffs, QA and training.

**Internal order, reading-direction left to right:**

| Slot | Contents | Why this slot |
|---|---|---|
| **Start** | Avatar, name in English and Arabic, then one line: stage, preferred language, deal owner | Identity is question 1 and takes the first fixation. Preferred language sits here because it changes the first word the agent says. Emirates ID is deliberately **not** here; it is reference data, not a glance fact, and it was cluttering my v2. |
| **Centre** | Three stats: **Outstanding** (labelled "across N accounts", with original total beneath), **Worst DPD** (attributed to the account by name), **Promise state** (roll-up: open promise, or broken count) | These are questions 3 and 4. Three stats, not six: the working-memory budget is four chunks, and both ChatGPT versions independently converged on three metrics here. Every figure carries its scope, which is the fix for the reconciliation bug in v2.html. |
| **End** | Action rail: Call (primary), SMS, WhatsApp, Email. Eligibility quiet by default; a caption appears only when a channel is restricted, capped, or time-bounded. | Question 6. Placing the eligibility state on the control it constrains is the difference between knowing and discovering. Adopted from the ChatGPT pass, which is right that "Eligible" printed four times is noise. Email Inbox is removed from this rail and becomes a tab in the activity column, because it is a place you read, not a channel you send on. |
| **Full-width band beneath** | Line 1: *Why this reached you* — computed escalation reason, coral accent. Line 2: *Last AI contact* — timestamp and outcome summary, neutral. | Question 2 and question 5. Two separate lines because they are two different facts, and conflating them was the sharpest criticism in the ChatGPT analysis. Full width because the escalation reason is the single highest-value sentence on the page and deserves the strongest horizontal run. |

**Escalation line rules:**
- Computed from existing fields: `disputed = yes`, `broken_promise_count > 0`, `ai_calls > 0 and human_calls = 0`, hardship flag.
- Named to the account it belongs to: "Borrower disputes the Tabby account, raised 3 August."
- At most two conditions shown, plus a count of the rest. This is what enforces the three-alert budget (see 4.3).
- Carries a visible "proposed field" marker in the prototype. See the open question in Part 9.

### 3.3 Borrower column (inline-start, 288px)

Three stacked blocks in one column because all three are borrower-scope.

**3.3.1 Totals row**

- **Does:** restates aggregate exposure at the head of the account list so the sum and its parts are adjacent.
- **Position:** top of the column, pinned.
- **Tier:** 1.
- **Why here:** this is the one permitted repetition on the page. The spine states the total as a decision fact; here it states the total as the *sum of the list beneath it*. Different job, same number, and adjacency is what makes the arithmetic checkable.
- **Breaks if moved:** the agent has to hold the total in memory while reading the parts.

**3.3.2 Account cards**

- **Does:** this is the brief's section D deal table, rendered as the page's navigation.
- **Scope:** one card per account.
- **Position:** middle of the borrower column, scrolls internally.
- **Tier:** 1 for the flagged and worst cards, 2 for the rest.
- **Card anatomy:** lender or merchant name, product type and reference, outstanding in display size, "of total", proportion bar, status, DPD, plan or promise marker, and a coral inline-start accent only if the escalation line names it.
- **Sort:** outstanding descending, always, deterministic, same order every visit. **Not** sorted by flag. Flags are carried by the accent, not by position, because a list that reorders itself as flags change destroys the spatial memory the rail exists to build.
- **Why here:** a table is a comparison instrument. Agents rarely compare accounts; they work one account while holding the borrower total in mind. Using a table as the navigation spine is what forced both ChatGPT prototypes to hardcode `deals[0]` and leave the second obligation unreachable. Cards solve selection; the table remains available for comparison (3.6).
- **Breaks if moved:** put this in the centre and the account column has no stable neighbour to select it. Put it after the detail and the causal order reverses.
- **Keyboard:** digits 1 to 9 select. No animation on selection; it is a many-times-a-day action.

**3.3.3 Borrower reference**

- **Does:** phone, email, DOB, gender, nationality, Emirates ID, visa status, submit date.
- **Position:** bottom of the borrower column, below the accounts.
- **Tier:** 2 for contact details, 3 for demographics.
- **Why here:** it is borrower-scope, so scope integrity says it belongs in this column and nowhere else. It sits below the accounts because the agent does not read a phone number, they press Call. The brief requires these fields; requiring them does not make them first-class.
- **Breaks if moved:** in the account column it implies these fields belong to the selected account. In the spine it steals Tier 1 space, which is what my v2 did with Emirates ID.

### 3.4 Account column (centre, ~420px)

Everything here belongs to the selected account and nothing else. This is the brief's section E.

Block order, top to bottom, by how much each changes what the agent says next:

| # | Block | Tier | Contents | Why this position |
|---|---|---|---|---|
| 1 | **Balance and terms** | 1 | Outstanding vs total with proportion bar, DPD with bucket scale (30/60/90/180/365/720), overdue, last due date, status, product, lender, reference, account reference | The numbers the agent says out loud. First position because the account column is read mid-call for exactly these. |
| 2 | **Payment plan** | 1 when present | EMI, next instalment, paid X of Y, schedule flags | When a plan exists it changes the entire conversation from collection to confirmation. When absent it collapses to a single line and keeps its position, so the layout never shifts. |
| 3 | **Promises on this account** | 1 | PTP amount, date, state; broken promises with type, date and count | The brief asks for type, date and count, which the production page does not deliver. Account-scope, not borrower-scope, which is why it is here and not only in the spine. |
| 4 | **Portfolio fields** | 2 | Dynamic, label-driven: dispute state and reason, lender verification, settlement authority, repossession eligibility, churn risk | A genuine container, not a grab-bag and not a single string. Ten sealed environments across four verticals means the field set varies by portfolio, so it is built label-driven rather than hardcoded. |
| 5 | **Record metadata** | 3 | Created and updated by and at, lender ID | Audit data. Last because nobody has ever needed it mid-call. |

- **Why the centre column:** proximity and mapping. Selecting a card in the borrower column changes the pane immediately beside it. A control should sit next to what it affects.
- **Breaks if moved:** swapping this with the activity column puts three columns of distance between the selector and the thing selected, and the causal link stops being visible.
- **Nothing here is behind a disclosure control.** Four of the five production accordions are closed by default and contain brief-mandated data. An accordion expand mid-sentence is not a 0.1 second operation; it costs the agent the thread of the conversation.

### 3.5 Activity column (inline-end, flexible, ~450 to 550px)

- **Does:** every event, plus the post-call write.
- **Scope:** events, filtered to the selected account by default.
- **Position:** inline-end, widest flexible column.
- **Tier:** 1 for the most recent AI outcome (also lifted into the spine), 2 for the rest.
- **Header:** tabs (Interactions, Messages, Timeline, Tickets), a scope filter (This account / All accounts), and **Log outcome** as the primary action.
- **Why here:** it is touched twice, before the call and after it, and it is the only region that needs width for prose. Putting the write action at the top of the column that already holds the read history is what makes the read-to-write transition one movement rather than a hunt.
- **Breaks if moved:** in the centre it displaces the account facts the agent reads aloud; in the borrower column it has no room for text.
- **AI events carry a visual mark** so bot contact is distinguishable from human contact without reading the source field. The agent's core risk is repeating what a bot already asked.
- **Scope filter matters:** "all accounts" is the view a borrower with three debts forces on you the moment they say "I paid you last week."

**3.5.1 Entry mode — the part both prior versions left undesigned**

Both ChatGPT prototypes stop at `alert()`. My v2 has a stub form. This is half the agent's job and it is where QA scoring lands, so v3 designs it properly:

- Opens **inline at the top of the activity column**, pushing the list down. Not a modal. A modal would hide the record the agent is transcribing from.
- Fields: outcome (fixed taxonomy, short category labels), optional free-text note, optional promise (amount and date), optional status change.
- The outcome list is a dropdown because a QA rubric that scores humans and AI on one scale needs comparable structured values. Free text sits beside it, not instead of it.
- Saving appends a row to the list above, visibly, with a persistent marker rather than a toast. A toast that fades in four seconds is invisible to someone who looks down at paper notes.
- Setting a promise here updates the spine's promise stat and the account card. One write, three synchronised reads, no duplicate entry points.

### 3.6 Compare view

- **Does:** the full section D column set, every account side by side.
- **Position:** replaces the account and activity columns when invoked; the borrower column stays.
- **Tier:** 2.
- **Why here:** comparison is a real task with a real trigger ("I can pay 5,000, where should it go?"), and it deserves a real instrument. It is not the default because navigation and comparison are different jobs.
- **Breaks if moved:** as the default, it becomes the production page's problem again.

---

## Part 4 — Cross-cutting rules

### 4.1 Canonical placement — every brief field, exactly once

| Brief field | Canonical home | Appears anywhere else? |
|---|---|---|
| Name (AR + EN) | Spine, identity | No |
| Gender, nationality, DOB, Emirates ID, visa, submit date | Borrower column, reference | No |
| Preferred language | Spine, identity line | No (proposed field) |
| Deal owner | Spine, identity line | No. Read-only; reassignment is a secondary hover affordance, not a full-width dropdown sitting at the same weight as read-only data |
| Deal stage | Spine, identity line | No |
| Total amount | Spine (borrower sum) **and** account column block 1 (this account) | Yes, deliberately: different scopes, both labelled |
| Outstanding | Spine (sum, labelled "across N") + totals row (sum, as list head) + account card + account column block 1 | Four appearances, three scopes, each labelled. This is the one field where repetition is load-bearing |
| Overdue, last due date | Account column block 1 | No |
| DPD | Spine (worst, attributed) + account card + account column block 1 with bucket scale | Yes, scoped |
| Account status | Account card + account column block 1 | **Not** in the spine. "In collection" is true of every record in a collections CRM and carries zero information |
| PTP amount / date | Spine (roll-up) + account column block 3 | Yes, scoped |
| Broken promises (type, date, count) | Account column block 3 | Count also in spine roll-up |
| Human/AI call counts, last answered | Spine (AI line) + activity column | Counts in spine, detail in activity |
| AI handoff outcome | Spine, line 2 | No (proposed field) |
| Interaction / communication logs | Activity column tabs | No |
| Timeline entries | Activity column tab | No |
| Tickets | Activity column tab | No |
| Deal table columns (section D) | Account cards + compare view | Same data, two instruments |
| Payment plan, interest/EMI, lender + ID, principal, schedule flags | Account column blocks 1, 2, 5 | No |
| Custom attributes | Account column block 4 | No |
| Call, SMS, WhatsApp, Email | Spine action rail | No |
| Email Inbox | Activity column, Messages tab | No |

Anything not in this table does not render. If a field cannot be assigned a canonical home, that is a signal the field is redundant, not a licence to put it in two places.

### 4.2 Typographic hierarchy — three tiers, applied without exception

| Tier | Treatment | Used for |
|---|---|---|
| Display | 23px, 600, mono, tabular | The three spine stats, account card balance, account column hero values. Nothing else. |
| Primary | 12.5px, 600, `--text-primary` | Values that change the next sentence |
| Secondary | 11.5px, 400, `--text-secondary` | Labels, meta, everything else |

Every one of the ~45 fields gets assigned a tier before anything is drawn. Inline labels throughout (label at start, value at end), never labels-above, except for the display tier. Salesforce measured 30 to 40% more information in the same vertical space from that single change, and that recovered space is what pays for having no accordions.

**Three habits to avoid, flagged by the frontend-design guidance and over-used in my v2:**
- Uppercase mono eyebrows belong on region and block headings only, not above every field. Arabic has no case, so eyebrows in the Arabic build are sentence case and never mono.
- Middle-dot meta strings ("A · B · C") are capped at one per line and only where the items are genuinely peers.
- Mono is for numerals, IDs, references, timestamps and amounts. Not for text labels.

### 4.3 The alert channel

One hue, coral, one meaning, and a hard cap:

1. Only the escalation band and the account cards it names may render coral. Maximum three coral elements on screen, enforced in code.
2. Colour encodes deviation **within this borrower's own set**, not distance from zero. DPD 546 is not an emergency in a book where that is normal; it is coral only on the account the escalation line points at.
3. No repeated alert for the same fact. The spine names the dispute; the account card marks it; the detail block states it quietly. Three references, one alert.
4. Status true of every record is quiet metadata. "In collection" never gets a badge.
5. Never colour alone. Every flagged element carries a text label and a dot.

This rule was validated the hard way: my v2 rendered nine coral elements on the seven-account record before the audit caught it, and the ChatGPT analysis independently listed coral overuse as a v1 defect.

### 4.4 Nulls, enums, dates, numbers

- One null glyph, an en dash, rendered muted. A null must never look like a zero: `Overdue –` and `Overdue AED 0` mean different things.
- Labels persist when values are empty. The label is the structural skeleton that keeps coordinates stable across records.
- Where the emptiness is the point, say it in words: "No promise on record" beats a dash.
- Every database enum maps to a human label at the presentation layer. `IN_COLLECTION` becomes "In collection", `RPC` becomes "Right party contact", `Arabic_speaker` becomes "Arabic speaker". Raw token stays available on hover for operations.
- One date format everywhere, unambiguous by construction: `12 May 2024`.
- Every amount carries AED. Every derived figure carries an "as of". Tabular numerals in every numeric column.
- Casing of dirty source data (`AGENT PRAVEEN aGENT`) is normalised on display. The interface cannot fix the data but it can stop looking broken.

### 4.5 Agent-configurable layout — considered, then cut

You asked whether an agent could rearrange the page to their own preference. The answer is yes, it is buildable, and it is **not going in this submission**. The reasoning is worth more than the feature.

**The version that would have shipped.** A locked zone (spine, three-column structure, account card anatomy, account sort) and a flexible zone (order and visibility of the five account-column blocks, default activity tab, density). Personal and persistent server-side per agent, reorder within a stack rather than free placement on a canvas, never auto-adapting, reset to team default one click away, supervisors own the default.

**Why it is cut.**

1. **It answers a UX problem with a settings panel.** If the block order is wrong for some agents, the honest fix is to find the right order, not to make the wrong order rearrangeable. Shipping both admits we did not decide.
2. **The variation we have evidence for is by portfolio, not by person.** Telecom agents need churn, auto needs repossession eligibility, cards need settlement authority. That is configuration, and the label-driven portfolio-fields block already delivers it. We have no evidence that two agents on the *same* portfolio want different orders.
3. **Personalisation costs the shared vocabulary.** A supervisor looking over a shoulder, a QA reviewer, and a training session all depend on the escalation reason being in the same place on every screen. That cost is real; the benefit is speculative.
4. **It is a 48-hour brief.** A feature that needs persistence, a permission model, a team default and a reset path is not a thing to demonstrate in a case study. Restraint is the more defensible signal.

**Consequence for the design.** The account-column block order in 3.4 is now a fixed, defended order rather than a user-adjustable default. It has to be right on its own merits, and 3.4 argues it on those terms.

**What would change the decision.** Evidence that two agents working the same portfolio want different block orders, or a measured difference in handling time between orders. Until then, one order, argued.

**The position if it comes up in review:** personalisation is fine when it is personal, persistent, bounded to secondary content, and never automatic. The moment a layout rearranges itself on the system's judgement, the only compounding advantage an expert user has, knowing where things live, is gone.

### 4.6 Motion

Almost none. This is a tool someone uses four hundred times a month.

| Action | Treatment |
|---|---|
| Account selection, tab switch, keyboard actions | No animation. Instant. |
| Button press | `scale(0.97)`, 120ms, ease-out. Feedback on pointer-down, not on release. |
| Entry form open | 180ms ease-out, height and opacity. It is occasional, and it needs to show what changed. |
| New event arriving mid-call | One brief pulse on the affected row, then a persistent marker that stays until acknowledged. Motion is the strongest notification channel while someone is task-focused, and flicker is the least distracting form of it. |
| Everything else | Nothing. |

`prefers-reduced-motion` replaces all of the above with opacity-only transitions.

---

## Part 5 — Bilingual and RTL

25% of the grade, and the place where both ChatGPT prototypes and the original wireframe all stop at the same point: switching to Arabic changes the direction and nothing else, leaving every label in English. In v2_1 the rule `.rtl body` can never match, because the class is applied to `body` itself, so Tajawal reaches only `.label`. Neither file loads the webfont.

v3 builds the Arabic view as a real build:

| Requirement | Implementation |
|---|---|
| Strings | One dictionary, both languages, written before any markup. Every visible string resolves through it. The Arabic view is generated, not mirrored. |
| Font | Tajawal, actually loaded, matching ClearGrid's own Arabic site. Weights 400/500/700, never lighter. |
| Root | `<html dir="rtl" lang="ar">`. `lang` drives font fallback and screen-reader voice, not just `dir`. |
| Layout | Logical properties throughout (`margin-inline-start`, `border-inline-end`, `text-align: start`), so the mirror is structural rather than a set of overrides. Audited for physical-property leaks. |
| Tracking | Zero on anything containing Arabic glyphs, including mixed spans like «625 يوم». Negative tracking crushes the letter joins; positive tracking breaks them. |
| Leading | 1.7 for Arabic body, including the display-size stat lines, which are the most commonly clipped. |
| Italics | Never. No Arabic italic tradition; browsers fake-slant it. |
| Digits | Western, pinned product-wide, matching ClearGrid's Arabic site and UAE/KSA financial convention. One numeral system per user per view, including error copy and placeholders. |
| Currency | `Intl.NumberFormat` with `style: 'currency'`. Arabic locales place the marker after the amount and prepend an RLM; that output is never wrapped in `dir="ltr"`, which would fight the formatter. |
| Calendar | Gregorian, pinned explicitly, because the `ar-*` default varies by engine. |
| LTR islands | Emirates ID, phone, email, reference IDs, account references, all on **inline** spans with `dir="ltr"`. On a block it would also flip the alignment edge. Get this wrong and the Emirates ID renders with its segments in the wrong order, which is a data-integrity bug wearing a typography costume. |
| Icons | Mirrored by meaning. Chevrons, back, send, reply flip via `scaleX(-1)`. Clock, search, checkmarks and anything containing Latin glyphs do not. |
| Grammar | Arabic counted-noun agreement: dual form for 2, plural for 3 to 10, singular for 11+. "وعدا سداد" for two, "3 وعود" for three. |

Decision on side-by-side: rejected, as recorded in the assumptions document. ClearGrid's own side-by-side pattern is a scrolling transcript pane, and that does not transfer to a dense grid. Two complete mirrored builds, as the brief asks.

---

## Part 6 — Test data

Three records, each proving something different. All arithmetic reconciles against a fixed clock.

| Record | Proves | Shape |
|---|---|---|
| **Aisha Rahman** — hardship, 1 account | The common case. Escalation reason that is not a dispute, an open promise, AI handoff present, all channels available. Adopted from the ChatGPT personas. | 1 account, short history |
| **Omar Al-Hassan** — dispute, 2 accounts | The scope problem. Borrower-level status contradicts account-level status. Disputed obligation must be identifiable. WhatsApp restricted while other channels are open. | 2 accounts, mixed status, mixed eligibility |
| **Mohammed Al Suwaidi** — 7 accounts, 34 log rows | The stress case. Rail scrolls, spine does not. Alert budget holds at three. Compare view earns its existence. | 7 accounts, four verticals, long history |
| **Sparse record** | Empty-state stability. Nulls everywhere, no history, no promises. Layout must not shift or look broken. | 1 account, almost nothing populated |

Aisha and Omar are the two frames for submission. The other two are internal tests. Every DPD is derived from its due date against a single clock rather than hardcoded, so no figure can silently contradict another.

---

## Part 7 — Verification, run as instruments not opinions

The prototype carries a live audit panel. These are the pass conditions:

| Test | Method | Pass |
|---|---|---|
| Glance coverage | Count Tier 1 facts inside the first viewport | 6/6 on every record |
| Page scroll | `scrollHeight / innerHeight` | 1.0 exactly |
| Clicks to all brief data | Count gated elements plus account switches | Tabs and account switches only; zero accordions |
| Salience | Count coral elements | ≤ 3 on every record including the 7-account case |
| Repetition | Every field against the Part 4.1 table | Each appears only where the table says, with its scope labelled |
| Greyscale | Remove all colour | Every status still legible |
| Squint | Blur until text is unreadable | Three to five distinct shapes, and they are the right ones |
| Five-second | Show, hide, ask: who, why, how much, how late, what promised, can I call | All six from memory |
| Empty record | Render the sparse record | No layout shift, no misleading blanks |
| Worst record | Render the 7-account record | Nothing overflows, alert budget holds |
| RTL diff | Overlay the two frames | Mirror complete; clock, search and logo not mirrored; IDs not reversed; no English strings left |
| Read-to-write | Log an outcome and set a promise | Spine stat and account card update; one entry point |

---

## Part 8 — What we are deliberately not doing

- No visual polish pass. Colour tuning, iconography and microcopy are a later step, as you specified.
- No mobile or tablet layout. The brief says desktop only.
- No auto-adaptive or relevance-ranked layout. Section 4.5 explains why.
- No sparklines or bullet graphs beyond the two already spent channels (the proportion bar and the DPD bucket scale). Line length is one channel and it is fully allocated.
- **No agent-configurable layout.** Cut deliberately; see 4.5 for the full reasoning and the position to take if asked.
- **No density toggle as a product feature.** Compact is the shipped density. A comfortable variant exists in the prototype harness as a test instrument, not as a setting an agent sees.
- No claim that the proposed fields exist in production. They are marked and listed in Part 9.

**A note on the prototype harness.** The record switcher, direction switcher, greyscale and squint toggles and the audit panel are evaluation instruments, not product UI. They render in visibly different chrome (dark bar, top of frame) so no reviewer mistakes them for part of the design.

---

## Part 9 — Data-model asks, to be flagged in the rationale

Four fields the design needs that the four screenshots do not show. Each is presented as a product proposal, not a pretence:

1. **Escalation reason, structured.** The engine already distinguishes six borrower states and routes on them, so the value almost certainly exists; the gap looks like rendering, not storage. If it does not exist, this is the highest-leverage engineering ask on the page.
2. **AI handoff summary.** Counts exist today with no outcome text attached. This is a genuine product gap, not something we overlooked.
3. **Preferred language.** The messaging system already sends correct bilingual SMS, so the data exists somewhere. Nationality is not a proxy for it.
4. **Per-channel contact eligibility, exposed to the UI.** Suppression is enforced at dispatch and marketed as a differentiator. Surfacing it on the button is a read of state that already exists.

---

## Part 10 — Build plan for the next session

| Step | Output | Notes |
|---|---|---|
| 1 | String dictionary, both languages | Written first. Everything renders from it. |
| 2 | Token layer | ClearGrid light set, already verified. Type scale, spacing, radii. |
| 3 | Data layer | Four records, derived DPD, one clock, one formatter per locale |
| 4 | Component set | Badge, stat, field row, account card, action button, module block, tab bar, table, log row, entry form, bars, chip |
| 5 | Regions | Spine, borrower column, account column, activity column, compare view |
| 6 | Interaction | Selection, tabs, scope filter, entry form, keyboard |
| 7 | RTL pass | Dictionary swap, logical-property audit, LTR island audit, tracking audit, grammar check |
| 8 | Audit panel | The Part 7 instruments, live |
| 9 | Headless verification | Every layout × record × direction, checking for empty renders, broken tokens and runtime errors |
| 10 | Figma handoff notes | Component inventory, variant matrix, token table, the two frames, redlines |

Estimated: one session for steps 1 to 8, verification included.

**Figma deliverable note.** The brief asks for a Figma file. The prototype's job is to be the build reference for it, which means step 10 matters as much as the code: a component inventory with named variants and states, so the Figma build is transcription rather than redesign.

---

## Decisions recorded

| # | Question | Decision | Date |
|---|---|---|---|
| 1 | Which record goes in which submitted frame | **Open.** See below. | |
| 2 | Do proposed fields look native in the Figma frames | **Pending your review.** Default stands: visibly marked in the HTML prototype, clean in Figma with a separate annotation layer, named explicitly in the UX rationale. | |
| 3 | Viewport floor | **1440×900, degrading to 1280 by collapsing the nav to an icon rail.** Agents work from ClearGrid offices or from home with a monitor or at minimum a laptop screen. Below 1280 is out of scope. | Confirmed |
| 4 | Ship customise mode | **No.** Cut from the submission, kept as a talking point. Full reasoning in 4.5. | Confirmed |

### The one still open

My question 1 was about the two **submitted frames**, not the two ChatGPT files. The brief asks for an English (LTR) layout and an Arabic (RTL) layout, and the choice is whether they show the same borrower or different ones:

- **Option A, same borrower in both.** The reviewer can overlay the two frames and check the mirror directly. Cleanest demonstration of RTL quality, which carries 25% of the grade.
- **Option B, different borrowers.** English frame shows Aisha, one account, hardship. Arabic frame shows Omar, two accounts, dispute, one restricted channel. Shows more of the design's range, but the mirror is harder to verify at a glance.

**Recommendation: Option A, using Omar.** Same borrower in both frames, and make it the two-account dispute case. It gives the reviewer a clean mirror comparison *and* puts the multi-account handling in front of them, because Omar is the record that proves the three-scope structure was necessary. Aisha then appears as a third frame in the English flow if there is room, showing the layout with one account and an open promise, which is the empty-ish case.

*Sources: cleargrid-borrower-profile-redesign-brief.md, cleargrid-agent-persona-research.md, cleargrid-design-assumptions.md, dense-ui-design-guide.md (and the primary literature cited there), cleargrid-design.md, the four production screenshots, borrower-profile-wireframe.html, cleargrid-borrower-profile-console-v2.html, cleargrid-borrower-profile-v2.html, cleargrid-borrower-profile-v2_1.html, cleargrid-borrower-profile-v2.md, cleargrid-borrower-profile-analysis-and-v2-decisions.docx, and the skills arabic-design, designing-arabic-frontends, apple-design, emil-design-eng, frontend-design, first-principles, humanizer, prototype. Claims about the two ChatGPT prototypes were verified by executing them headlessly, not by reading them.*
