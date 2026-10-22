# ClearGrid Deep Research + Agent Journey Expansion

Companion to `cleargrid-case-study-brief.md`. Give both to Claude Code. This one answers: what does ClearGrid actually do, and what should the case study become now that the single-page redesign is done.

---

## 1. ClearGrid, the real company (new research, web-sourced)

Nothing here was in the original brief. It's public information, confirmed across multiple independent outlets.

| Fact | Detail | Source |
|---|---|---|
| Founded | May 2023 | [TechCrunch](https://techcrunch.com/2025/03/19/cleargrid-armed-with-10m-uses-ai-to-fix-debt-collection-in-mena/) |
| Founders | Mohammad Al Zaben (CEO), Khalid Bin Bader Al Saud, Mohammad Al-Khalili | TechCrunch |
| Founder background | Al Zaben previously founded Munch:On (food delivery), sold to Careem in 2022 | TechCrunch |
| Funding | $10M total — $3.5M pre-seed + $6.5M seed (announced March 2025) | [Maginative](https://www.maginative.com/article/cleargrid-raises-10m-to-modernize-menas-debt-collection-with-ai/), [MenaBytes](https://www.menabytes.com/cleargrid-10-million/) |
| Investors | Beco Capital, Nuwa Capital, Raed Ventures; angels include ex-YC's Anu Hariharan, Replit CEO Amjad Masad, ex-Marqeta CEO Jason Gardner, Twitch co-founder Justin Kan | [RAED Ventures](https://raed.vc/news/cleargrid-armed-with-a-fresh-10m-is-developing-ai-to-improve-debt-collection-in-mena/) |
| Business model | **Outcomes-as-a-service**, not SaaS. Revenue share on amounts actually recovered — "I get paid once you get paid" | [Dealroom](https://app.dealroom.co/news/note/outcomes-not-software-how-cleargrid-is-rebuilding-the-trillion-dollar-debt-market-with-dignity-and-voice-ai) |
| Scale | ~2.5 million calls/day across the platform, hybrid speech-model stack that switches mid-call for cases needing more reasoning or stricter compliance | Dealroom |
| Guiding principle | Deliberately **"dignity," not "empathy"** — AI applies uniform, compliant standards instead of subjective leniency calls that vary by agent mood | Dealroom |
| Borrower trust finding | Disclosing AI involvement to borrowers **improves** perception; once borrowers know it's AI, they forgive glitches more readily | Dealroom |
| Results claimed | 50% lower collection cost, 38–50% better resolution rates, debts resolved ~2× faster than traditional agencies, 60% higher borrower engagement, CSAT ~4.6/5 (never below 4.3) | Dealroom |
| Customers | Banks, fintechs, consumer lenders — 10+ major UAE fintechs/banks signed since 2024 launch | TechCrunch |

### The three product layers (this is the important structural finding)

Per Dealroom, ClearGrid isn't one tool — it's three:

1. **A full third-party collection agency** (human-driven, traditional recovery service)
2. **Command** — their AI-native CRM: built-in dialer, email, SMS, and AI calling, priced by consumption rather than per-seat
3. **Debt acquisition** — emerging securitization/portfolio-purchase business

**The Borrower Profile page you redesigned is a screen inside "Command."** This matters directly for the case study: you're not redesigning "a screen," you're redesigning the core workspace of ClearGrid's actual AI-native CRM product — the thing they're building the company around, per their own public statements. That's a stronger claim than the brief itself made, and it's true.

## 2. What this confirms and adds to your existing research

Your project already has excellent internal research (`cleargrid-agent-persona-research.md`, `cleargrid-design-assumptions.md`) built entirely from cleargrid.co's own site and the four screenshots. Cross-checking that against this new outside research:

| Your existing finding | Outside confirmation |
|---|---|
| ~95% of cases handled by AI, human on the ~5% escalations | Confirmed independently by Dealroom and TechCrunch — this is a public, repeated claim, not something you inferred |
| Agent works alongside AI that made first contact | Confirmed: "hybrid tech stack ... switch mid-call" and human contact "feeds insights back into the AI models" — the loop runs both directions, not just AI-to-human |
| Six borrower states drive routing (inability, unwillingness, confusion, dispute, hardship, forgetfulness) | Consistent with the "categorizes borrowers by ability and willingness to pay" framing in TechCrunch — your finer six-state breakdown is more detailed than what's public, so keep citing your own primary-source read of cleargrid.co rather than these secondary articles for that specific claim |
| Escalation reason isn't currently surfaced on the profile page (your identified gap) | Now has a sharper justification: if "dignity not empathy" is the actual operating philosophy, a human agent who doesn't know *why* a case escalated is more likely to import their own subjective judgment — which is precisely what the company says it's trying to engineer out. This turns your UX gap into a philosophy-alignment gap, which is a stronger argument to put in the case study. |
| Bilingual UAE/KSA context | Confirmed, plus new detail: KSA and UAE regulatory tightening on fair lending practices is cited as part of *why* ClearGrid exists at all — the redesign's RTL requirement isn't a checkbox, it's tied to the regulatory reason the company exists |

## 3. The "full agent journey" — what to actually build

You asked to go beyond the single page and show a whole agent journey. Given the ponytail principle of shipping the smallest thing that actually works: don't build five new screens. The Borrower Profile is the deepest, highest-fidelity artifact you have — it should stay the centerpiece. Add the minimum surrounding context that makes it a *journey* instead of a *page*.

### Recommended scope: 3 screens, not more

| # | Screen | Why this one | Effort vs. what you already have |
|---|---|---|---|
| 1 | **Queue / case list** (before) | Shows how a case *arrives* at the agent — the routing decision, the escalation reason visible at a glance across many cases, not just one. This is the natural "screen zero" that explains why the agent opens the Borrower Profile at all. | New, but small — a list view reusing the same design tokens and card/badge components already built for the profile page. Not a new design system. |
| 2 | **Borrower Profile** (the core) | Already built, already strong. This stays the centerpiece of the case study. | Already done |
| 3 | **Post-call outcome / wrap-up** (after) | Your own `dense-ui-design-guide.md` already identifies "glance mode" vs. "entry mode" as two distinct jobs (§1.1). The v3 prototype's inline entry form *is* this screen, just collapsed into the profile page. Pulling it out as its own beat in the journey makes the mode-switch — the actual UX insight — visible to a viewer instead of buried in interaction design they'd only notice by clicking. | Near-zero new work — the entry form already exists in `cleargrid-borrower-profile-v3.html`; this is a presentation/narrative move, not a new build. |

Deliberately **not** building: a full "Command" CRM clone, a supervisor/QA dashboard, an AI transcript viewer, a compliance/audit trail screen. Each is real and mentioned in the research, but building all of them turns a sharp case study into a sprawling one, and dilutes the thing that's actually excellent — the Borrower Profile itself. If asked in an interview follow-up "what else would you design," the queue and wrap-up screens plus this research doc *are* the answer — they don't all need to be shipped pixels.

### The journey framing (for the case study narrative)

```
Case escalates from AI → QUEUE (agent sees why, picks up the case)
                              ↓
                  BORROWER PROFILE (the redesigned page — glance mode, then entry mode)
                              ↓
                  OUTCOME LOGGED (wrap-up — feeds back into the AI/QA rubric)
```

This maps directly onto something you already have sourced and cited: your own persona research states the agent is scored "on the same rubric as the AI" and that human-agent outcomes feed back into ClearGrid's models (now doubly confirmed by Dealroom's "feeding insights back into the AI models" line). **The loop closing — human outcome data training the AI that will handle the next 95% — is the actual system-level insight**, and almost no other candidate's case study will have researched this deeply enough to show it. This is your single best differentiator versus a purely visual redesign.

## 4. Updated case study structure

Supersedes §3 of `cleargrid-case-study-brief.md` — same section list, three additions marked **NEW**.

| Section | Content |
|---|---|
| Eyebrow + title | Unchanged |
| Origin line | Unchanged |
| **NEW: About ClearGrid** | Short, factual, sourced: founded 2023, $10M raised, outcomes-as-a-service model, "dignity not empathy" philosophy, ~95% AI-automated. This is what elevates the piece from "I redesigned a screen" to "I understood the system I was redesigning a piece of." |
| The brief | Unchanged |
| Constraints | Unchanged |
| **NEW: The journey, not just the page** | One diagram (queue → profile → wrap-up) explaining why you expanded scope, tied explicitly to the AI-to-human-and-back loop described above. |
| **NEW: Screen 1 — the queue** | New, small build. Shows escalation reason as a first-class list column, reusing existing design tokens. |
| Process: exploring layout | Unchanged (wireframe comparison) |
| Key decisions (reasoning chain) | Unchanged, pull from v3 file's inline notes |
| The RTL approach | Unchanged |
| The design system | Unchanged |
| Final result (embed) | Unchanged — the v3 interactive prototype stays the hero embed |
| **NEW: Screen 3 — the wrap-up** | Presentation of the existing entry-mode UI as its own beat, explicitly narrated as "outcome data flowing back into the AI" |
| What I'd validate next | Unchanged, but can now reference the real metrics ClearGrid publishes (resolution rate, CSAT) as what you'd want to see move if this shipped — without inventing numbers, just naming their own stated success metrics as the ones you'd want visibility into |

## 5. Constraints reminder (unchanged from the first brief, repeating because this expands scope)

Everything in `cleargrid-case-study-brief.md` §4 (tokens only, logical properties, iframe embedding pattern, contrast, no fabricated metrics) applies identically to the two new screens. The queue screen especially: build it from the same `tokens.css` additions already made for the ClearGrid teal/coral palette — do not create a second, parallel set of colors for it.

## 6. Sources

- [ClearGrid raises $10 million to modernize and automate debt collection in the Middle East — MenaBytes](https://www.menabytes.com/cleargrid-10-million/)
- [ClearGrid Raises $10M to Modernize MENA's Debt Collection with AI — Maginative](https://www.maginative.com/article/cleargrid-raises-10m-to-modernize-menas-debt-collection-with-ai/)
- [ClearGrid, armed with a fresh $10M, is developing AI to improve debt collection in MENA — RAED Ventures](https://raed.vc/news/cleargrid-armed-with-a-fresh-10m-is-developing-ai-to-improve-debt-collection-in-mena/)
- [ClearGrid, armed with a fresh $10M, is developing AI to improve debt collection in MENA — TechCrunch](https://techcrunch.com/2025/03/19/cleargrid-armed-with-10m-uses-ai-to-fix-debt-collection-in-mena/)
- [Outcomes, Not Software: How ClearGrid Is Rebuilding the Trillion-Dollar Debt Market With Dignity and Voice AI — Dealroom](https://app.dealroom.co/news/note/outcomes-not-software-how-cleargrid-is-rebuilding-the-trillion-dollar-debt-market-with-dignity-and-voice-ai)
- Project-internal: `cleargrid-agent-persona-research.md`, `cleargrid-design-assumptions.md`, `dense-ui-design-guide.md`, `cleargrid-borrower-profile-redesign-brief.md` (all previously compiled in this project from cleargrid.co and the four production screenshots)
