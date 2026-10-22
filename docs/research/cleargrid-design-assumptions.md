# Design Assumptions — Borrower Profile Redesign

The ClearGrid team asked us to proceed on our best judgement rather than wait on answers. Below is the assumption we're designing against for each open question, the reasoning behind it, and what it means for the interface. Where evidence was thin, that's stated plainly rather than dressed up as fact.

Grounding: cleargrid.co (home, customers, customer-experience pages) and direct inspection of the four production screenshots. See `cleargrid-agent-persona-research.md` for full citations.

---

## Why the agent got this case

**1. Is the escalation reason recorded?**
**Assumption: yes, but not surfaced.** ClearGrid's own site describes a system that distinguishes six borrower states — inability, unwillingness, confusion, dispute, hardship, forgetfulness — and routes hardship/dispute cases to a human "with full account context." A system that routes based on a state almost certainly has that state as a stored value somewhere; it's not plausible the routing engine works blind. The likelier gap is a rendering gap, not a data gap: the four screenshots never display it, even though `Disputed: No` already exists as a field in Custom Attributes.
**Design consequence:** we design a header-level "reason for escalation" field as if it exists in the data model today. If it turns out not to, this becomes the single highest-leverage data-model ask to bring back to engineering — worth flagging as a placeholder in the rationale rather than a guess we're hiding.

**2. Does the agent get an AI handoff summary?**
**Assumption: no, not currently — this is the gap, not the norm.** The current screenshots show `Total AI Calls: 3` and `Latest AI Call Answered` as bare counters with zero outcome text attached. If a summary already existed, it's reasonable to expect it would show up somewhere in these four screens; it doesn't. We treat this as a real product gap rather than an existing feature we failed to notice.
**Design consequence:** we design a compact AI-outcome line next to the AI call stats (e.g., "Last AI contact: borrower requested callback") as a proposed addition, clearly labeled as new rather than presented as if it's already live.

**3. Custom Attributes vary by lender vertical?**
**Assumption: yes, functionally, even if the current UI doesn't reflect it.** ClearGrid runs ten sealed environments, each with its own database and policy set, across four different verticals with materially different risk signals (churn for telecom, repossession for auto, settlement authority for bank cards). A single fixed schema across all of that would be an odd design choice given how segmented everything else is. The "Custom Attributes" naming itself — generic, not domain-specific — reads like a catch-all built for exactly this kind of per-portfolio variation.
**Design consequence:** we build Custom Attributes as a flexible, label-driven grid rather than hardcoding today's eight fields, so it can absorb vertical-specific fields without a layout rework later.

---

## Data and fields

**4. Are Payment Plan Status / Schedule flags live today?**
**Assumption: irrelevant to this redesign, and we don't need to resolve it.** The brief says all listed data must be represented; whether the backend already populates a field or will do so later doesn't change what we're asked to design. We include these fields with the same dead-state treatment as every other optional field (a quiet em-dash, not a missing section), so the layout works correctly whether the data shows up on day one or day ninety.

**5. Deal Owner — how often is it changed by the agent themselves?**
**Assumption: rarely, by the agent; more often it's a supervisor/routing action.** Reassigning who owns a debt case is typically a workload-balancing or escalation decision, not something the person handling a live call decides mid-conversation. Nothing in ClearGrid's materials suggests agent self-reassignment is a frequent action — the emphasis throughout is on routing done *by the system* (state-based, automatic).
**Design consequence:** Deal Owner is shown as a static field, not a prominent editable control. If reassignment needs to remain possible from this screen, it gets a deliberately smaller, secondary affordance (e.g., an edit icon on hover) rather than the current UI's full-width dropdown sitting at equal visual weight to read-only data.

---

## Contact rules

**6. Warning before a blocked contact attempt?**
**Assumption: the system should warn before, not block after.** ClearGrid states contact windows, frequency caps, and do-not-contact rules are applied "at decision time," and cites a concrete stat — over 12,000 attempts stopped before dispatch — as a product strength. A product that markets pre-dispatch suppression as a differentiator is a product that should be showing that state at the point of action, not hiding it until the agent already tried and failed. Whether the current UI actually does this is unclear from the screenshots (no visible disabled-state or warning badge on the action buttons), so we treat this as an implementation gap to close.
**Design consequence:** Call/SMS/WhatsApp/Email buttons carry a visible eligibility state (enabled, disabled-with-reason, or warning) rather than firing blind.

**7. Per-channel independent eligibility?**
**Assumption: yes.** A DNC flag or contact-hour rule for voice calls doesn't logically extend to text-based channels in every jurisdiction or policy configuration — treating all four channels as one blanket toggle would be a simplification that doesn't match how contact-preference rules typically work (borrower-set channel preference is explicitly mentioned in ClearGrid's materials as something the system already tracks).
**Design consequence:** each action button gets its own independent state, not one shared "contact allowed/blocked" flag for the whole borrower.

---

## Logging after a call

**8. Outcome — fixed list or free text?**
**Assumption: fixed list, from a small taxonomy.** The current screenshots show outcome values like `Rpc`, `Arabic_speaker`, `No answer` — these read as enum values (inconsistent casing, short, category-like), not free-form sentences. A QA-scoring system that grades human and AI calls on "one rubric" (stated on ClearGrid's site) needs comparable, structured outcomes to score against; free text would undermine that comparison.
**Design consequence:** the logging control is a dropdown/select-style component sized for short category labels, not a text area. We allow an optional free-text notes field alongside it for anything the fixed list doesn't capture, since some nuance will always fall outside a taxonomy.

**9. Time pressure on logging (auto-dialer)?**
**Assumption: yes, mild time pressure exists, but this doesn't change the profile page design.** Outbound collections operations commonly use predictive/power dialers that move to the next call quickly. Even if true, this affects the dialer/queue software, not the Borrower Profile screen's layout — we don't need this answered to finish the current brief. Noted for completeness, not acted on.

---

## Arabic and English

**10. Mirrored RTL vs. side-by-side — which matches real usage?**
**Assumption: full mirrored RTL, built as a genuinely separate frame. We checked the side-by-side idea against outside precedent and it didn't hold up, so we dropped it.**

Earlier we floated a "side-by-side" option because ClearGrid's own AI Voice call view is described as showing Arabic on one side and English on the other, live, together. That's a real fact, but it's one data point from one screen, and we generalized it further than the evidence supported. A closer look at that specific screen: it's almost certainly a scrolling transcript pane, where showing both languages side-by-side works because you're reading a sequential stream, not scanning a dense grid. That context doesn't transfer to the Borrower Profile, which is already a dense, multi-card data screen — doubling every label and value into two languages side-by-side would add density to a page whose core problem is already too much competing for attention.

We also checked whether side-by-side is a broader, established pattern for dense bilingual interfaces — enterprise BI tools (Tableau, SAP), UAE/Dubai government portals, and dedicated Arabic-UX guidance all converge on the same approach instead: two complete, separately-designed layouts (one LTR, one RTL) switched with a toggle, not two languages sharing one screen. Nothing we found supports side-by-side as a norm for this kind of interface.

**Decision: full mirrored RTL as a separate, properly-built frame — not a flipped copy of the English version.** This matches both what the brief explicitly asks for and what real precedent supports. If ClearGrid's side-by-side transcript pattern is worth carrying elsewhere in the product, that's a fair question to raise with the team later, framed as an observation about that specific screen, not as a recommendation for this one.

**11. Borrower's preferred language shown to the agent?**
**Assumption: not currently, and it should be.** Nothing in the four screenshots shows a language-preference field, and Nationality (e.g., "IND") doesn't reliably indicate language preference. ClearGrid's messaging system clearly tracks channel and language preference well enough to send bilingual SMS correctly — that data exists somewhere in the system. It not reaching the agent's screen looks like an oversight, not an intentional omission.
**Design consequence:** we add a language-preference field near the top of Borrower & Loan Info, similar priority to Nationality, since it's a fast, low-cost addition with a real payoff (agent doesn't open in the wrong language).

---

## How the page gets used

**12. Typical call length?**
**Assumption: not needed to answer.** Doesn't change a layout decision for a desktop screen. Skipped.

**13. Used outside live calls too?**
**Assumption: yes, and this is a first-class use case, not a secondary one.** This was the correction you gave us directly — the page is also used for reviewing updates and case status outside of a live call. We're designing for two reading modes rather than optimizing purely for the mid-call glance:
- **Glance mode** (live call): zero-click, header-level facts — identity, balance, DPD, escalation reason, contact eligibility.
- **Review mode** (before/after a call, between shifts): a slightly slower, more complete read — interaction history, deal table, timeline — that doesn't need to be crammed into the first screen's worth of pixels, but also shouldn't be buried three accordions deep.

This is why the layout keeps identity/financial/escalation permanently visible at the top (serves glance mode) while keeping deal history and logs one scroll or one click away rather than hidden (serves review mode) — both modes get a screen that works, neither is sacrificed for the other.

---

## Summary table

| # | Question | Assumption | Confidence |
|---|---|---|---|
| 1 | Escalation reason recorded? | Yes, but not surfaced — data gap unlikely, rendering gap likely | Medium |
| 2 | AI handoff summary exists? | No — genuine product gap | Medium-high |
| 3 | Custom Attributes vary by vertical? | Yes, functionally | Medium |
| 4 | Are unlisted brief fields live? | Doesn't matter for this design | High (moot) |
| 5 | How often is Deal Owner changed by agent? | Rarely — supervisor/system action more often | Low-medium |
| 6 | Warning before blocked contact? | Should warn before, not block after | Medium |
| 7 | Per-channel independent eligibility? | Yes | Medium |
| 8 | Outcome fixed list or free text? | Fixed list + optional notes | Medium-high |
| 9 | Time pressure on logging? | Doesn't change this design | High (moot) |
| 10 | Mirrored RTL vs side-by-side? | Full mirrored RTL only — side-by-side idea checked against outside precedent and dropped | High |
| 11 | Borrower language shown to agent? | Not currently, should be added | Medium |
| 12 | Typical call length? | Doesn't change this design | High (moot) |
| 13 | Used outside live calls? | Yes — first-class second use case | High (your direct input) |

---

*These are working assumptions for the redesign, not verified facts. Each is stated with its reasoning so the ClearGrid team can correct any that are wrong without us having to re-derive the logic from scratch.*
