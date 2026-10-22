# Brief: ClearGrid Case Study — for Claude Code

Give this file to Claude Code in the portfolio repo (`portfolio-5ada04ea570a` / `C:\portfolio`). It follows the repo's `CLAUDE.md`. Build the case study using `work/blueprint-design-system.html` as the template.

---

## 1. Legal clearance (already checked)

| Check | Result |
|---|---|
| NDA signed | No |
| Confidentiality clause (email or brief PDF) | None |
| Restriction on reuse/publication | None |
| Real borrower/business data in the work | No — all fabricated |
| ClearGrid's proprietary business logic exposed | No — standard CRM field layout, not their scoring/AI models |

Clear to publish, name ClearGrid directly, and use their real brand colors/logo (pulled from their public marketing site, not confidential material).

Two things to still do in the build:
- Recreate "before" screens as simplified wireframes rather than posting ClearGrid's raw screenshots (their real branded UI, unblurred, is the one soft spot — avoid it, it's also just weaker case study material than a clean before/after).
- State the origin plainly, once, near the top. Don't bury it and don't apologize for it.

## 2. Framing strategy: acknowledge it, don't hide it, don't inflate it

Research question was: how do other designers show interview/take-home work as portfolio pieces? Findings below, synthesized into what to actually do.

### What the sources say

**On using design challenges as case studies directly:**
Designers who do this successfully treat the challenge as a legitimate case study format, not a lesser one, but only when they go further than the original ask. [UXfolio](https://blog.uxfol.io/ux-design-challenges/) is explicit: "the secret to showing challenges in your portfolio is that you must go the extra mile to make them look fantastic." Their recommended structure for a single comprehensive challenge mirrors a real case study — overview, process, outcome, learnings — with one substitution: the overview introduces *the challenge itself* (what was the prompt, where did it come from, what were the constraints) instead of a real product brief. Team and stakeholder sections get dropped since they don't apply.

[Mentie Omotejowho](https://medium.com/@Jowho/using-design-challenges-as-case-studies-for-my-portfolio-f5b0010fe8f9), writing about her own practice, does something specifically worth copying: she doesn't stop at the assignment's original scope. She takes the challenge further than what was asked, and where possible brings in feedback from real users or other designers to add a validation layer the original brief never had. That's the move that turns "leftover interview homework" into "a designer showing initiative."

**On presenting restricted/sensitive-adjacent work (the NDA literature, useful even without an NDA):**
[Presenting Confidential Design Work Under NDA](https://gooddesigner.substack.com/p/presenting-confidential-design-work) makes a distinction worth adopting even in a no-NDA case: redact the identifying specifics that don't matter to the story (exact real screenshots, unnecessary internal jargon), keep everything that shows *your* thinking (methodology, research approach, the reasoning chain behind each decision). The line they use is close to the right posture: "your approach needs to shine through" — the value is in the process, not in whose logo is on it.

[Show, not tell](https://dataanddesign.substack.com/p/show-not-tell-how-to-make-use-of) adds a specific tactic worth using here even though it's aimed at scrapped/restricted work: abstract the specifics into a generalizable narrative ("a bilingual collections CRM" as the category, ClearGrid as the named instance) so the case study reads as a transferable skill demonstration, not a name-drop.

**On what interviewers actually evaluate (why the "why" matters more than the origin):**
[Figma's guide to portfolio presentations](https://www.figma.com/blog/five-steps-to-nailing-your-portfolio-presentation-in-design-interviews/) is blunt about what a hiring panel is actually testing: "the hiring committee will challenge your design reasoning, your choice in color, your research, and a million other things, to see what informed your decisions." They are not grading whether the brief came from a real client or an interview process — they're grading whether you can defend every decision. This is the strongest argument for embracing the origin rather than concealing it: a design challenge with a stated real brief, real constraints (bilingual RTL/LTR, dense CRM data, 48-hour timeline), and a documented decision trail is *more* legible to an evaluator than a vague "personal project," because the constraints are externally verifiable, not self-invented.

**On restraint (when not to publish a project at all):**
[Not Every Project Is Your Portfolio Piece](https://saffronavenue.substack.com/p/letters-vol02-not-every-project-is) frames portfolio inclusion as a curation decision, not an archive decision — a portfolio should represent the designer's intended direction, and the one hard rule that transfers directly here: if something is conceptual rather than a shipped real-world engagement, "make it clear they are conceptual and not real clients." Applied here: make it unambiguous, once, that this was an interview design exercise, not a shipped ClearGrid product feature. Never let it read like ClearGrid commissioned or endorsed this.

### The strategy, synthesized

1. **State the origin once, early, plainly.** Not an apology, not a footnote buried at the bottom. A single clear line near the top of the case study: this was a 48-hour design challenge for a real fintech company's real product page, done as part of an interview process.
2. **Go further than the original brief asked.** The brief only required a redesign + rationale bullets. You built: three wireframe layout options with a live A/B toggle, a working bilingual EN/AR interactive prototype with four synthetic borrower records, an inline "layout audit" panel that measures your own hierarchy decisions live (glance-facts count, scroll ratio, click depth, escalation-color budget). That range is already past what was asked — the case study should say so directly, because it's true and it's the single most persuasive fact in the piece.
3. **Show the reasoning chain, not just the artifact.** The two HTML files already contain inline `.note` annotations explaining *why* each layout choice was made (e.g., "sorted by outstanding, never by flag: a list that reorders as flags change destroys the positional memory it exists to build"). That reasoning is the actual deliverable. Pull it into the case study prose, don't just link the file and hope someone reads the annotations.
4. **Recreate, don't screenshot, the "before" state.** Use the wireframe file's own `wf` mode (already built — a checkbox that swaps real values for `████` placeholder blocks) as the "before" visual, instead of the original ClearGrid product screenshots. This is strictly better craft anyway: it demonstrates you can abstract a layout problem from its real data, which is a harder skill to show than "I copied their screen."
5. **Anonymize where specificity doesn't earn its place.** Keep ClearGrid named (there's no reason to hide a real, verifiable brief). But describe the product category generically where it helps readability: "a debt-collections CRM operating across UAE/KSA in Arabic and English" rather than repeating internal ClearGrid terminology verbatim throughout.
6. **Never imply outcome.** No line about whether you got the job, got rejected, or what ClearGrid thought of it. The case study is about the work, full stop. Any hint of "so here's what they missed" reads as bitterness and undermines the whole piece, regardless of how the process actually went.

## 3. Content structure (drop into `work/blueprint-design-system.html`'s template)

Follow `docs/CONTENT-GUIDE.md`'s existing case-study pattern. Section order:

| Section | Content | Source material already in hand |
|---|---|---|
| Eyebrow + title | `05 — Selected work` style eyebrow; title: "Borrower Profile Redesign — ClearGrid" | — |
| Origin line | One sentence, plain: "48-hour product design challenge, completed as part of an interview process for ClearGrid, a UAE/KSA debt-collections platform." | Email + brief PDF |
| The brief | What was asked: redesign a dense CRM borrower page, EN+AR, agent-efficiency focus, 48hr window. Pull directly from the brief PDF's "Current State Analysis" table (visual hierarchy, data grouping, layout efficiency, component scalability, bilingual support). | `cleargrid-borrower-profile-redesign-brief.md` (project doc) |
| Constraints | Bulleted, not prose: dense data (5 field groups, 10+ data points per account), multi-account borrowers, bilingual RTL/LTR with full mirroring (not just text-align flip), agent workflow speed as the success metric. | Brief PDF pages 6–11 |
| Process: exploring layout | Show the 3-layout wireframe comparison tool (command bar / sidebar split / tri-panel), each with its stated trade-off. Use the wireframe-mode toggle screenshot/embed as the "before" visual instead of real screenshots. | `borrower-profile-wireframe.html` |
| Key decisions (the reasoning chain) | Pull 4-6 of the strongest inline `.note` annotations from the v3 file and turn each into a named decision: e.g. "Accounts sort by outstanding balance, never by alert flag" with the actual rationale sentence from the file. | `cleargrid-borrower-profile-v3.html` inline notes |
| The RTL approach | Explain: dictionary-driven translation (not string-reversal), real Arabic pluralization rules, Tajawal typeface swap, full layout mirroring via logical properties, Western numerals per UAE fintech convention. Show EN/AR toggle. | `cleargrid-borrower-profile-v3.html`, `cleargrid-design.md` §5 |
| The design system | Brief note: colors/typography extracted from ClearGrid's own public marketing site (cite it: cleargrid.ai), not invented — a deliberate choice to match their actual brand rather than impose a generic one. | `cleargrid-design.md` |
| Final result (embed) | Embed or link the live interactive `cleargrid-borrower-profile-v3.html` prototype directly — this is the strongest asset, let people click through the EN/AR toggle and different borrower records themselves. | `cleargrid-borrower-profile-v3.html` |
| What I'd validate next | 2-3 sentences: what you'd test with real agents if this continued past the interview stage (e.g., does the escalation-reasoning line actually reduce call-prep time; does the audit panel's click-depth metric hold up with real data volume). | New — write fresh, don't invent fake metrics |

## 4. Repo constraints Claude Code must follow (from CLAUDE.md — non-negotiable)

- **No raw values.** Every color/spacing/font-size in the new case study section must reference `tokens.css` custom properties. If the ClearGrid teal/coral palette needs new tokens, add them to `tokens.css` first, then use them — don't inline hex codes.
- **Logical properties only.** No `margin-left/right`, `left/right`, `text-align: left/right`. This matters doubly here since the case study is *about* RTL work — the case study's own page must itself use logical properties throughout.
- **Embedding the HTML prototypes:** the two files (`borrower-profile-wireframe.html`, `cleargrid-borrower-profile-v3.html`) are self-contained standalone documents with their own `<html>`/`<style>`/`<script>`. Do not inline their CSS into the site's `styles.css`. Embed via `<iframe>` with a fixed aspect-ratio wrapper and explicit `width`/`height` (or `loading="lazy"` if below the fold) to avoid layout shift, and give the iframe a descriptive `title` attribute for screen readers. Provide a visible text link to open the prototype in a new tab as a fallback (`rel="noopener noreferrer"`, `target="_blank"`) since iframes are not a reliable accessibility pattern for interactive content.
- **Alt text / accessible names:** any static screenshots used (e.g., a preview thumbnail of the wireframe tool) need meaningful `alt`. The card-link pattern applies if this becomes a project tile on the work index.
- **Contrast check:** the ClearGrid teal (`#069494`) and coral (`#DC4A3E`) tokens were already checked for AA on white in `cleargrid-design.md` §6 — reuse those values, don't re-derive.
- **Motion:** the prototype's own internal animations (card open transitions, etc.) already respect `prefers-reduced-motion` inside that file. Nothing extra needed there. Any *new* motion added to the case study page itself (e.g., a reveal-on-scroll for the decision list) must follow the same repo rule.
- **No invented metrics.** The brief PDF and email contain no outcome data (no interview result, no adoption numbers). Do not write a fabricated "reduced handling time by X%" line. If a placeholder is needed, mark it `<!-- PLACEHOLDER -->` per repo convention.
- **Run before done:** `docs/ACCESSIBILITY-RTL-CHECKLIST.md`, plus a keyboard-only pass on the new embedded iframe/toggle, plus Lighthouse.

## 5. Assets available (all already in the ClearGrid UX Redesign project, portable to this repo)

- `cleargrid-borrower-profile-v3.html` — final interactive redesign (EN/AR, 4 synthetic records, audit panel)
- `borrower-profile-wireframe.html` — 3-layout comparison + wireframe-mode toggle (use for "before" visuals)
- `cleargrid-design.md` — design tokens extracted from ClearGrid's public site + screenshot analysis, with sources cited
- `cleargrid-borrower-profile-redesign-brief.md` — the original brief content, for pulling exact requirement language
- `cleargrid-agent-persona-research.md`, `cleargrid-design-assumptions.md`, `dense-ui-design-guide.md` — supporting research docs, pull from these for the "process" narrative if more depth is wanted
