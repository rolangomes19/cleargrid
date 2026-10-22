# ClearGrid Borrower Profile — Agent Persona & UX Research Log

Sources: cleargrid.co (home, case studies, customer-experience pages, fetched 2026-09-10), plus direct inspection of four production screenshots of the current Borrower Profile page. No external assumptions or invented data — every claim below is tagged with where it came from.

---

## 1. Who is actually looking at this screen

ClearGrid's own numbers answer this more precisely than a guessed persona would.

**~95% of case volume is automated** (AI voice, SMS, journeys) and never touches this page in real time — the customer-experience page states <cite index="6-1">roughly 5% of cases escalated to human specialists</cite>, with <cite index="6-1">100% of sensitive cases handled by people</cite>. The home page independently confirms this split: <cite index="4-1">95% of operations automated, with humans on judgement calls</cite>.

**Consequence for the persona: the human agent viewing this page is not working a random slice of the portfolio.** They are looking at accounts that were *routed to a person specifically because a script or a bot couldn't or shouldn't handle it*. That changes what "quick scan" needs to surface — it's not "confirm this is business as usual," it's "understand why this stopped being automatable."

### What routes a case to a human, per the source pages
- <cite index="6-1">Hardship signals, dispute flags and sensitive situations route to human specialists automatically, with the full account context, inside minutes, never a cold transfer</cite>
- The engine distinguishes six borrower states and treats each differently: <cite index="6-1">inability, unwillingness, confusion, dispute, hardship and forgetfulness</cite>
- <cite index="4-1">Islamic-finance terminology and product sensitivity are enforced by policy, not by hoping agents remember</cite> — implying agents handle cases where policy/terminology nuance matters, not generic dunning

**Design implication:** the profile page's job is not just "show me the numbers" — it needs to surface *why this case is in front of a human right now* (dispute flag? hardship flag? broken promise? confused borrower who called back?) as a first-glance fact, not something buried in the interaction log. None of the four current screenshots show a visible "reason this is escalated" field. That's a gap the current design doesn't address and neither did my first wireframe pass — worth adding.

---

## 2. The agent's operating context (confirmed, not assumed)

### They are one channel among several, working alongside AI
- <cite index="4-1">AI voice, SMS, email or a human specialist — in Arabic or English, only inside the calling hours and contact limits you set</cite>
- The dialer module unifies <cite index="4-1">manual, campaign, inbound and AI calls in the same log on the same definitions</cite> — meaning the interaction log an agent sees is not "my calls," it's the full mixed history of bot and human contact for this borrower.

**Implication confirmed from the brief's own data**: the current screenshots show `Total Human Calls: 1` and `Total AI Calls: 3` as separate counters. The agent picking up this account has almost certainly not spoken to this borrower before — AI made first contact three times. The agent needs the AI's outcomes and any transcript/summary to avoid re-asking what the borrower already explained to a bot. This is a much sharper version of the "nobody remembers the last conversation" problem the home page calls out as Problem 03: <cite index="4-1">A borrower who explained their situation last week explains it again. Every repeat is a customer you already paid to acquire, deciding not to come back</cite>.

### They are measured on outcome quality, not call volume
- <cite index="4-1">Promises secured, right-party rate, active time against idle time, per agent — measured the same way for people as for the AI</cite>
- <cite index="4-1">Every call scored. AI and human, one rubric. Four bands instead of a pass mark, compliance failures counted separately</cite>

**Implication:** every action the agent takes on this page (SMS, WhatsApp, Email, logging an outcome) likely feeds a QA rubric scored against the AI's own rubric. The page needs the outcome-logging action to be fast and unambiguous — friction here isn't just a UX annoyance, it directly affects a metric the agent is evaluated on.

### They operate under hard compliance constraints at decision time, not just after the fact
- <cite index="4-1">Contact windows, frequency caps and do-not-contact applied at decision time on every channel, not left to training</cite>
- <cite index="4-1">12,904 attempts stopped before dispatch</cite> — contact suppression is enforced programmatically

**Implication:** the "Call / SMS / WhatsApp / Email" action buttons on the profile page are not neutral UI chrome — they are gated by contact-window and DNC rules. If a button is disabled or should warn the agent (e.g., "outside contact window," "DNC flag active"), that state needs to be visible at the point of action, not discovered as a rejected action afterward.

### Bilingual by default, not as an edge case
- <cite index="4-1">Arabic on the left, English on the right, policy on both</cite> — described for the AI voice module's live-call view
- <cite index="6-1">The engine picks the channel from what this borrower has actually answered before — not from what is cheapest to send</cite>, and messages are sent bilingually depending on borrower preference (confirmed by the matched Arabic/English SMS example appearing verbatim on both the homepage and customer-experience page)

**Implication for RTL work specifically:** ClearGrid's own product pattern for bilingual content is **side-by-side, not toggle-only** — Arabic and English are shown together in their AI Voice call view example. Worth considering whether the Borrower Profile's "RTL version" should be a genuinely separate mirrored frame (as the brief requests) or whether, for the agent-facing tool specifically, a side-by-side bilingual field (matching how the platform already treats bilingual content elsewhere) might better fit real usage. This is a design question to raise with stakeholders, not something to decide unilaterally.

---

## 3. The "multi-tasking, paper notes" behavior — what it implies structurally

You noted the agent takes notes on paper, not in the UI, while highly multi-tasking on a live call. Cross-referencing this against confirmed product facts:

- The platform explicitly separates **structured, policy-checked digital record** (interaction logs, QA-scored calls, compliance evidence — <cite index="4-1">Calls recorded and quality-scored, with role-based access and an audit trail your compliance team can reconstruct</cite>) from whatever the agent does on paper. The paper notes are almost certainly *personal working memory during the call* — not part of the compliance record — which the agent later needs to translate into a structured outcome (the "Add Interaction Log" action visible in the current screenshots).
- This means the screen has two distinct modes of attention: (1) **glance-and-absorb** during the live call — borrower identity, balance, DPD, last promise, escalation reason — read in short bursts between sentences; and (2) **focused data-entry** immediately after the call ends — logging outcome, setting a new PTP, updating status. These are different UI needs. Mode 1 wants maximum scannability and zero interaction cost (nothing to click, nothing to expand). Mode 2 can tolerate a short structured form.
- The current design's heavy reliance on collapsed accordions (Custom Attributes, Broken Promise Details, Deal Activity Timeline all closed by default, confirmed directly in screenshots 2–4) actively works against mode 1 — an agent mid-call cannot afford a click-and-wait during a live conversation. This reinforces, with real product context now, the layout conclusion from the earlier wireframe pass: identity, financial status, and PTP/escalation-reason need to be permanently visible, not behind a toggle.

---

## 4. Segment differentiation — the page probably needs to flex, not stay static

The case studies describe materially different borrower populations depending on lender vertical:
- Bank cards/personal loans: <cite index="5-1">early-bucket collections</cite>, high contact-rate sensitivity
- BNPL: <cite index="5-1">average balances too small for agency commissions to make sense</cite>, high volume, low-value accounts
- Telecom: <cite index="5-1">the debtor is also the subscriber</cite> — churn risk is a live variable the agent should probably see
- Auto finance: <cite index="5-1">borrowers who had missed two instalments, not abandoned the loan</cite>, repossession-adjacent urgency

**Implication:** the Borrower Profile page is used across at least four visibly different collections contexts (confirmed: <cite index="4-1">Banks & financial institutions, Fintech & BNPL, Telecom, Auto finance & mobility</cite> are named as distinct solution verticals) and <cite index="4-1">Ten environments</cite> exist, <cite index="4-1">each portfolio in its own sealed environment with its own database and policy set</cite>. A telecom agent may care about churn risk; an auto-finance agent may care about repossession-eligibility flags; a bank-card agent may care about settlement-offer authorization limits. The current data model (from the brief) has a generic `Custom Attributes` bucket — this is probably where per-vertical fields live today, which explains why that section reads as a grab-bag rather than a clean set. Worth confirming with the ClearGrid team whether per-lender field configuration is expected, since it affects whether "Custom Attributes" should be a fixed accordion or a genuinely dynamic per-portfolio panel.

---

## 5. Draft agent persona (synthesized, not invented — every trait traces to a numbered source above)

**Name for reference: "Escalation-handling collections specialist"**

| Trait | Evidence |
|---|---|
| Handles the ~5% of cases too sensitive, disputed, or complex for automation | §1, customer-experience page |
| Works alongside AI that already made contact — is rarely the first voice the borrower hears | §2, dialer module description |
| Is scored on the same rubric as the AI (right-party rate, promises secured, QA score) | §2, agent workspace module |
| Operates under real-time contact-window/DNC constraints enforced by the system, not memorized policy | §2, compliance module |
| Bilingual context is default, not exceptional — Arabic and English both in active use | §2, ClearVoice + customer-experience |
| Takes personal notes outside the system during the call; the system captures the *outcome*, not the live thought process | §3, inferred from your brief + product's structured-log pattern |
| Works across multiple lender verticals with different risk signals that matter (churn, repossession, settlement authority, etc.) | §4, case studies |
| Needs to know the *reason this case reached them* — hardship, dispute, broken promise, confusion — as fast as name and balance | §1, six-state distinction on customer-experience page |

### What "quick scan while multitasking" concretely requires, given this persona
1. **Escalation reason visible at header level** — not currently in the design at all (confirmed absent from all four screenshots and from my earlier wireframe). This is the single biggest gap this research surfaces.
2. **AI's last contact outcome/summary surfaced above the fold** — so the agent doesn't repeat questions the bot already asked. Currently the AI/Human call counts exist but no outcome summary is shown adjacent to them.
3. **Contact-window / DNC status visible at the action buttons**, not discovered on click.
4. **Balance, DPD, and stage — already correctly prioritized** in the current design and in ClearVoice's own live-call view pattern (stats up front, policy gates visible).
5. **Vertical-specific risk flag** (churn / repossession-eligible / settlement-authority-limit) as a configurable, not hardcoded, field — flag for stakeholder confirmation rather than designing blind.

---

## 6. Open questions to confirm with ClearGrid stakeholders before finalizing wireframes

- Is escalation reason (hardship/dispute/broken-promise/confusion) already captured as structured data anywhere in the system, or does the agent infer it from reading the interaction log? If it's not structured today, surfacing it prominently may require a data-model change, not just a UI change.
- Does "Custom Attributes" vary by lender vertical in the live product? If yes, the redesign should treat it as a dynamic panel, not a fixed accordion.
- Is there an existing AI-call transcript/summary agents currently reference before taking over a case, and if so, where does it live today?
- For RTL: does ClearGrid's internal tooling anywhere follow the side-by-side bilingual pattern used in borrower-facing messaging, or is full mirrored RTL (as the case-study brief specifies) the established convention for agent-facing tools specifically?

---

*Compiled from cleargrid.co/index.html, cleargrid.co/customers.html, cleargrid.co/customer-experience.html (fetched 2026-09-10) and direct inspection of the four provided Borrower Profile screenshots. All quoted claims are cited to source; all implications are marked as inference, not fact.*
