# Designing the Borrower Profile: A Research Guide to Data-Dense Interfaces

**Scope.** Everything here is aimed at one screen: ClearGrid's Borrower Profile Page, read by a collections specialist during or immediately after a live call. General principles are included only where they change a decision on this page.

**Method.** Perception and cognition claims come from primary sources (Healey's review of preattentive processing, Cowan on working memory, Endsley on situation awareness, Cockburn et al. on focus+context, the clinical alert-fatigue literature). Practice claims come from named design systems (NN/g, Adobe Spectrum, Salesforce SLDS, W3C). Claims about the current ClearGrid screen come from direct inspection of the four production screenshots. Every source is listed at the end. Where evidence is weak or vendor-supplied, it says so.

---

## 0. The thesis in one paragraph

The problem with the current page is uniformity, not volume. Every value renders at the same size, weight, and colour, so the agent's visual system has no way to find the three facts that matter without reading all thirty-nine. The fix has two halves. Give each field a visual weight proportional to how much it changes what the agent says next. Then compress everything else hard enough that keeping it on screen costs almost nothing. Removing data and burying it in accordions both fail, for reasons the rest of this document sets out.

---

## Part 1: What this screen actually is

### 1.1 Two modes, two different interfaces

Per the agent research in this project, the specialist takes notes on paper during a live call and enters structured data after it. That splits the screen into two jobs that have opposite requirements.

| | **Glance mode** (live call) | **Entry mode** (wrap-up) |
|---|---|---|
| Attention | Fragmented, 1 to 3 seconds per look | Sustained, 30 to 90 seconds |
| Interaction budget | Zero clicks. A click mid-sentence costs the conversation. | Clicks are fine |
| Needs | Identity, balance, DPD, last promise, escalation reason, what the AI already said | Outcome logging, new PTP, status change |
| Failure mode | Agent asks a question the borrower already answered | Agent logs the wrong outcome or skips it |

**Design consequence.** Anything needed in glance mode cannot live behind a disclosure control. Four of the five accordions on the current page (Custom Attributes, Broken Promise Details, Deal Activity Timeline, Phone Numbers) are collapsed by default and contain brief-mandated data. Nielsen's response-time thresholds make this concrete: 0.1 seconds is the ceiling for an interaction to feel direct, 1 second for the user's train of thought to survive it. An accordion expand plus a fetch plus a reflow, mid-sentence, on a live call, is not a 0.1-second operation, and the cost is not measured in milliseconds. It is measured in the agent losing the thread of what the borrower is saying.

### 1.2 The agent needs Level 2, and the page only gives Level 1

Endsley's model of situation awareness has three levels: **perception** of the raw elements (Level 1), **comprehension** of what they mean together (Level 2), and **projection** of what happens next (Level 3). The model is hierarchical. A failure at perception makes comprehension impossible.

Endsley's design principles include "organise information around goals," "present Level 2 information directly," "support Level 3 projection," and "make critical cues for schema activation salient."

The current page is almost purely Level 1. It shows:

- `Days Past Due (DPD): 625`
- `Total AI Calls: 3`
- `PTP Via Interaction Log: N/A`
- `Overdue Amount: 0.00`

Every one of those requires the agent to do the comprehension step in their own head, under time pressure, while talking. The Level 2 versions are:

- `625 days past due. Deep bucket. Second oldest in your queue.`
- `AI reached this borrower 3 times. Last answered 27 Nov. Outcome: [summary].`
- `No promise on record. Last promise attempt: never.`
- `Overdue 0.00 while 9,010 outstanding and 625 DPD. Check this.`

That last one matters. The screenshot shows `Overdue Amount: 0.00` sitting next to `Days Past Due: 625` and `Outstanding Amount: 9,010`. Either "overdue" carries a narrow technical meaning the agent is expected to know, or the value is wrong. The current UI hides the definition behind a hover tooltip (the ⓘ icon next to the three financial fields) and never surfaces the contradiction. Both are Level 2 failures.

**Rule.** For every field in the redesign, ask: is the agent reading a number, or reading a meaning? If they have to convert it, the interface should have converted it.

### 1.3 A formula for what deserves prominence

Furnas's generalised fisheye formula is the cleanest available model for prioritising a record page:

> `DOI(x | y) = API(x) − D(x, y)`

Degree of interest in item `x`, given current focus `y`, equals the item's **a priori importance** minus its **distance from the current focus**.

Translated to the Borrower Profile: a field earns prominence from two things. How much it matters in general (Emirates ID always matters less than outstanding balance), and how close it is to what the agent is doing right now (a dispute flag is background noise until the borrower says "I never bought that," at which point it is the most important object on screen).

The current design sets `D(x,y)` to a constant. Every field is equally distant from every task. The redesign should let at least some of it move: a dispute flag that rises when the agent opens the dispute workflow, a payment-plan block that surfaces when a PTP is being set.

---

## Part 2: The perceptual budget

This section is the physics. It constrains what is possible, not just what is tasteful.

### 2.1 Preattentive processing: what gets seen in one look

A task is called preattentive if it can be completed on a large multi-element display in **under 200 to 250 milliseconds**, which is roughly the time it takes to initiate an eye movement. In that window, the visual system processes the whole field in parallel.

Features that work this way include hue, luminance/intensity, size, length and width, orientation, curvature, closure, density and contrast, spatial position, flicker, direction of motion, and velocity of motion.

**Rule.** Every fact that must be absorbed in a single glance has to be encoded in one of those channels, not in text. "IN_COLLECTION" is text. A coral status dot is hue. "625" is text. A bar that is 90% full is length.

### 2.2 Conjunction search: the hard limit on how many things can pop

A target defined by a **unique** feature pops out. A target defined by a **combination** of features that each appear in distractors does not, and forces a slow serial scan.

The canonical example: finding a red circle among red squares and blue circles is slow, because red alone returns the squares and circular alone returns the blue circles. Neither channel isolates the target.

**This is the single most violated rule in enterprise dashboards.** Once you colour-code status AND size-code amounts AND weight-code recency, "the overdue account with a broken promise" is a conjunction target, and the agent is back to serial reading. You have spent your entire salience budget and bought nothing.

**Rule.** Pick **one** attribute to carry "this needs your attention right now" across the whole page, and let nothing else use that attribute. On this page, that attribute should be the coral wash (`#DC4A3E` / `#FDEEEC` from the design system). Nothing else on the page is allowed to be coral. Not a delete button, not a logo, not a chart series.

### 2.3 Feature hierarchy: some channels drown others

The visual system ranks channels, and the interference is **asymmetric**:

- **Colour dominates form.** Random background variation in colour destroys the ability to see shape patterns. Random variation in shape does not affect the ability to see colour patterns.
- **Luminance dominates hue.**
- **Hue dominates texture.**

The conclusion drawn directly in the source: the most important data attributes should be displayed with the most salient visual features, and the mapping must avoid situations where secondary data masks what the viewer wants to see.

**Rule for ClearGrid.** The most important variable gets hue. The second gets luminance/weight. Shape and icon come third and cannot be relied on to carry anything urgent. A "dispute" icon rendered in the same grey as everything else is invisible, not because it is small, but because hue is holding still and form cannot break through on its own.

### 2.4 Postattentive vision: staring at the screen does not help

Wolfe's postattentive vision work is uncomfortable and important. Participants who were shown a display for up to 300 milliseconds **before** being told what to look for performed as slowly as participants who saw it for the first time. Repeated search over the same display, up to 350 times, still cost 20 to 50 milliseconds per object. Previewing a scene provides no advantage for finding a conjunction target.

The caveat that rescues us: this held for **arbitrary, non-semantic** targets that could not be committed to long-term memory. Long-term memory can be queried near-instantaneously, compared to 40 to 50 milliseconds per item for visual or short-term memory search.

**Rule.** An agent who opens this page four hundred times a month builds no perceptual advantage from familiarity with the *pixels*. They build a large advantage from long-term memory of **where things live**. Therefore: absolute spatial stability. The outstanding balance occupies the same coordinates on every borrower, on every deal, whether the field is populated or empty. Do not reflow, do not collapse empty sections out of the layout, do not reorder cards by relevance. A layout that rearranges itself destroys the only compounding advantage an expert user has.

This is the strongest argument against "smart" adaptive layouts on this particular screen.

### 2.5 Change blindness: the agent will not see the update

An interruption in what is being seen, including a blink, a saccade, or a blank interval, renders viewers blind to significant changes that occur during the interruption. Change blindness is a failure of attentional guidance, not of acuity.

The ClearGrid agent looks down at paper notes, back up at the screen, down again. Every one of those is an interruption. If the record updates while they are looking away, they will not notice.

**Rule.** Changes need **persistent** markers, not transient ones. A toast that fades after four seconds is invisible to this user. Use a durable state change: a "updated 12s ago" chip that stays until acknowledged, a row that keeps a left accent bar until clicked. And never silently mutate a value in place.

### 2.6 Motion is the strongest notification channel, and the cheapest one is flicker

Bartram, Ware and Calvert (2002) tested notification while users were engaged in a separate attention-demanding task. Applying **motion** to a static glyph was significantly easier to recognise than changing the glyph's colour or shape. This held both at the centre of focus and in the periphery. Ranked by how distracting a secondary motion cue was judged to be: **flicker was least distracting**, then oscillating motion, then divergence, then movement over long distances.

**Rule.** Reserve motion for one thing only: a genuinely new event arriving while the agent is mid-call (an inbound SMS reply, a payment posting, a supervisor note). A single brief pulse on the affected element. Not a slide-in panel, not a bouncing badge, not anything that moves a long distance. And honour `prefers-reduced-motion` with a non-motion fallback, since this is a compliance-adjacent workspace.

---

## Part 3: Highlighting without hiding

This is the core question of the brief. Cockburn, Karlson and Bederson's ACM Computing Surveys review gives a clean four-way taxonomy of ways to hold focus and context at once. All four are available on a desktop CRM page, and the current design only uses the worst-suited one.

| Technique | Mechanism | Fit for Borrower Profile |
|---|---|---|
| **Overview + detail** | Spatial separation. Two regions, both visible. | **Strong.** A persistent summary rail plus a scrolling detail region. |
| **Zooming** | Temporal separation. One view replaces another. | **Weak.** This is what accordions and tab switches do. Context is destroyed at the moment of transition. |
| **Focus + context** | Focus rendered *within* context in one continuous view (fisheye). | **Limited.** Geometric distortion is wrong for financial data. |
| **Cue** | Modify how items are depicted: highlight, suppress, de-emphasise, without moving or removing them. | **Strongest.** This is the answer. |

### 3.1 Cue techniques: the toolkit

The cue category "modifies the way in which items are depicted in order to highlight, suppress, or contextualise them." Search results can be highlighted, or non-results visually de-emphasised.

The insight worth internalising: **de-emphasis is cheaper than emphasis.** If you push twelve fields down instead of pulling one field up, the one field wins by contrast, you have not spent any of the salience budget, and nothing has left the screen. Concretely, in ascending order of cost:

1. **Weight suppression.** Secondary fields at 400 weight and `--text-secondary` (`#5B6166`), primary at 600 and `--text-primary` (`#0A0A08`). No colour spent at all. This alone would fix most of the current page.
2. **Size suppression.** Labels at 11px uppercase mono, values at 13px, hero values at 24px mono. Three tiers, not one.
3. **Scale amplification.** Only the top three or four values on the page get display size. Everything else is body size. Size is preattentive, so this creates a real pop-out.
4. **Semantic colour, used once.** Coral for "this will hurt you," success green for "this is working," teal only for interactive affordances. One hue per meaning, one meaning per hue.
5. **Positional encoding.** The most reliable quantitative channel in the preattentive set is 2-D position, followed by line length. A DPD bucket bar, or a paid-versus-outstanding bar, encodes a number in the channel humans read most accurately.
6. **Brushing and linking.** Hovering an interaction log row highlights the deal it belongs to. Cheap to build, and it keeps both objects visible.
7. **Density collapse, not removal.** A block with nothing in it becomes a single line ("No promises on record"), not a collapsed accordion and not an empty grid of dashes. The label stays as a structural landmark so the layout does not shift.

### 3.2 The one thing to build: a computed "why is this on my screen" line

The agent research in this project identified the biggest gap as the absence of an escalation reason. Endsley's Level 2 principle says the same thing from theory: present comprehension directly.

Proposal: a single line at the top of the page, generated from data the system already holds, that states in plain language why this account is in front of a human. `Disputed = Yes` produces "Borrower disputes this debt." `Broken Promise Count > 0` produces "Broke a promise on [date]." `Total AI Calls > 0 and Total Human Calls = 0` produces "First human contact. AI reached them 3 times."

This costs one row of vertical space and replaces maybe fifteen seconds of the agent reading logs at the start of every call. It is also the highest-scoring thing available under the brief's "Initiative & Ownership" criterion, because it is a product idea, not a styling choice.

**Raise this with stakeholders:** the agent research flags that escalation reason may not exist as structured data in the system today. If it does not, this is a data-model proposal, not just a UI proposal. Say so in the rationale rather than pretending the field exists.

---

## Part 4: Density as a discipline

### 4.1 The case against whitespace on this screen

Enterprise practitioners make a specific argument that modern minimalism backfires at high density: a user who needs twenty values visible at once is forced to scroll when generous whitespace is applied, and the answer is "density with clarity" achieved through strict grids and firm typographic hierarchy rather than fewer elements.

Take it as a hypothesis with a mechanism rather than a proven law, but the mechanism is sound and it matches the Salesforce evidence below.

### 4.2 Label placement is worth 30 to 40% of the page

Salesforce ships two density settings. **Comfy** places labels above fields with more spacing. **Compact** places labels on the same line as the value with less spacing. Salesforce's own developer blog puts the gain at **30% more information density**; third-party measurements of a record page put it at roughly **40% more information in the same vertical space**. Salesforce's design system explicitly notes that compact improves efficiency with large data sets and reduces scrolling on data-heavy screens.

The current ClearGrid page uses labels-above throughout: `Date of Birth:` on one line, `17-08-1994` on the next, for all seven fields in the first card, and again for all eighteen fields in Custom Attributes.

**Rule.** Use inline labels (label left, value right, or label left in a fixed column) for all reference fields. Reserve stacked label-above-value for the three or four hero metrics where the value gets display size. This single change buys back roughly a third of the vertical space, which is the space you need to stop hiding things in accordions.

Salesforce also treats density as a **user preference** rather than a designer's decision, and designs both settings to work. Shipping a compact/comfortable toggle is a defensible stretch feature for this brief, and it signals that you understand agents work eight-hour shifts on the same screen.

### 4.3 Chunking is the real lever, not an item count

Miller's 7±2 is routinely misquoted as a cap on interface elements. Miller himself treated seven as rhetorical. Cowan's reanalysis puts the true limit closer to **four chunks** when rehearsal and long-term memory support are blocked. The reconciliation offered in the literature: four is the capacity in maximally compressed units, seven is the length of an uncompressed sequence of typical complexity.

The design lever is not the number. It is that **working memory counts chunks, and you decide how big a chunk is.** Expertise is partly the development of increasingly complex chunks: a chess master sees configurations, not thirty-two pieces.

**Rule.** Build the page so an experienced agent can learn to read it as **four chunks**, not thirty-nine fields:

1. **Who and why** (identity, escalation reason, stage)
2. **What is owed** (balance, overdue, DPD, account status)
3. **What was promised and what happened** (PTP, broken promises, AI and human contact history)
4. **What I can do now** (channel actions, gated by compliance state)

The chunk boundaries must be visually unambiguous and must never move. That is what lets a chunk become a single unit in memory.

### 4.4 Grouping: whitespace first, borders only when whitespace cannot do it

NN/g's guidance on the two relevant Gestalt principles:

- **Proximity.** Items close together are perceived as part of the same group. Proximity can overpower competing cues like colour or shape similarity.
- **Common region.** A clear boundary is a strong cue that **can overpower proximity**, useful when adjusting whitespace is not possible.

And the caution: when whitespace alone can create clear groupings it reduces visual complexity, whereas borders added out of caution produce busy, cluttered designs. Before adding borders and backgrounds, ask whether they are necessary to understand the grouping.

There is a counter-pressure specific to dense layouts: when a layout cannot rely on space, common region takes over.

**Rule for this page.** Use a small number of surface containers for the four top-level chunks (common region, because whitespace is scarce). Inside each container use whitespace and alignment only. No nested cards, no inner borders, no dividers between every field row. The current page has a horizontal rule under *every* field in the top three cards, which is roughly nineteen unnecessary lines doing work that a consistent 8px gap would do better.

One more failure mode worth naming: squeeze everything together uniformly and you trigger **grouping collapse**, where every element clusters with every other element, which is the same as no grouping at all. That is an accurate description of the Custom Attributes grid as it currently renders: eighteen fields, four columns, uniform spacing, no subgrouping.

---

## Part 5: The alert economy

If the redesign introduces colour, it needs a budget and a governance rule, or it will degrade into the state the clinical literature documents.

### 5.1 The evidence

Clinical decision support is the best-studied high-alert environment. Reported alert override rates range from **49% to 96%**. Some studies of specific alert types report 77% to 90%.

The mechanism matters. A retrospective cohort of 112 ambulatory clinicians tested two competing hypotheses and found: clinicians became **less likely to accept alerts as they received more of them, particularly more repeated alerts**. There was no evidence of a workload effect per se, and no evidence of desensitisation over time for a newly deployed alert. The authors conclude that **reducing within-patient repeats** is the promising target.

Read that carefully. It was not total volume and it was not time-in-service. It was **repetition of the same alert on the same subject**.

### 5.2 What this means for a collections queue

Every account in this portfolio is in collection. Almost every account is past due. If `IN_COLLECTION` renders as a red badge and `625 DPD` renders as a red badge, the agent sees those two red badges on every single account, all day, and within a week they are furniture. Meanwhile the one account where `Disputed = Yes` gets a third red badge that is now indistinguishable from the wallpaper.

**Rules.**

1. **Colour encodes deviation from the portfolio, not deviation from zero.** DPD 625 in a book where the median is 600 is not an emergency, it is Tuesday. Reserve the alert channel for values that are unusual *for this queue*.
2. **Status that is true of every record is not a status.** `IN_COLLECTION` for a borrower inside a collections CRM carries zero information. Render it as quiet metadata, or drop it from the primary view. Spend the badge on `DISPUTED`, `DNC`, `HARDSHIP`, `PAYMENT PLAN ACTIVE`, which are true of a minority.
3. **Cap the salience budget.** At most **three** attention-grabbing elements visible at once. If a fourth condition is true, the design has to arbitrate, not stack.
4. **No repeated alert for the same fact.** Do not show the DPD badge in the header, again in the financial card, and again in the deals table row. That is exactly the within-patient repetition the study identifies as the driver.
5. **Non-interruptive by default.** The literature's direction of travel is toward passive decision support that lowers alert burden. Put compliance state *on the control it constrains* (a disabled Call button with "Outside contact window until 18:00 GST") rather than firing a modal after the click.

### 5.3 Never colour alone

WCAG 2.x Success Criterion 1.4.1 (Level A) requires that colour is never the only visual means of conveying information. Roughly **8% of men and 0.5% of women** have some form of colour vision deficiency, with red-green being the most common type. The practical test: remove all colour from the page, and check whether every user can still understand it and operate it.

**Rule.** Every status chip carries a text label and, where it adds discrimination, a shape or dot. A coral dot beside the word "Disputed" is accessible. A coral dot alone is not. This also protects the design against the very common deployment reality of a washed-out office monitor.

---

## Part 6: Component-level specifications

### 6.1 Numbers

- **Right-align numeric data related to magnitude** (amounts, counts, percentages). Left-align text. Left-align numeric data not related to magnitude (dates, IDs, phone numbers). Align headers to match their column.
- **Use tabular figures.** When every digit has the same advance width, columns of numbers line up and become scannable. The ClearGrid design reference already specifies Geist Mono (or JetBrains Mono) for reference IDs, Emirates ID, phone numbers, monetary amounts, timestamps, and DPD counts. Use it, and use `font-variant-numeric: tabular-nums` on any proportional font that has to show a number.
- **Consistent decimal places within a column.** `9,010` and `0.00` in the same visual group, as the current page does, is a small but real scanning cost.
- **Always attach the unit.** `11,010` with no currency, on a page serving UAE and KSA, is ambiguous by default. `AED 11,010`.

### 6.2 Null and empty values

Adobe Spectrum's table guidance is explicit: **use a dash for missing values**, and do not print the word "null" in every empty cell. Government style guidance takes the stricter position that you should explain *why* a cell has no value ("no data", "0", "n/a"), while practitioners note that writing "no data" in a table with many gaps makes it harder to read than leaving it visually quiet.

The current page mixes three conventions on a single screen: `N/A` in the PTP card, `-` in Custom Attributes, and `0.00` in Financial Status. Those are three different meanings rendered as three different tokens with no key.

**Rules.**

1. Pick one glyph for "no value on record" (an en dash) and use it everywhere.
2. Render it in `--text-muted`, lighter than real values. An empty field should be visibly emptier than a populated one, which the current design does not do.
3. **Never let a null look like a zero.** `Overdue Amount: 0.00` means something completely different from `Overdue Amount: –`. Keep them typographically distinct.
4. Keep the label. The label is the structural skeleton that makes the layout stable across records (see 2.4). Do not remove empty rows from the flow.
5. Where an empty value is itself the interesting fact, say so in words. "No promise on record" beats a dash next to `PTP Amount`.

### 6.3 Tables

- **Freeze the header** when the table scrolls.
- **Match row style to density.** Grid lines (horizontal and vertical) give maximum separation and suit dense, data-heavy tables, at the cost of visual noise.
- **Do not centre-align.** Centre alignment disrupts scanning and makes inconsistencies harder to spot.
- **Do not repeat identical values down a column.** The current deals table has one row, so the issue is latent, but with five deals from one merchant it will bite.
- **Hide the machinery when it is not needed.** The current page renders "Page 1 of 1 | Total 1 records" with Previous and Next buttons for a single row, plus a Columns configuration control and a search field. That is four controls for one record.

### 6.4 Machine tokens

`IN_COLLECTION`, `CREDIT_CARD`, `RPC`, `Rpc`, `Arabic_speaker` all appear in the production screenshots. These are database enum values that leaked into the presentation layer. They force the agent to do a translation step that the interface should have done, which is a Level 1 situation-awareness failure by Endsley's definition.

**Rule.** Map every enum to a human label at the presentation layer. `In collection`. `Credit card`. `Right party contact`. `Arabic speaker`. Keep the raw token available on hover or in an export if operations needs it.

The same applies to `AGENT PRAVEEN aGENT`, which is dirty source data currently rendered at full fidelity. The interface cannot fix the data, but it can normalise casing on display so the screen does not look broken.

### 6.5 Timestamps and staleness

Derived values need an "as of." `Days Past Due: 625` is computed against some reference date, and the screen does not say which. Checking the arithmetic: 12 May 2024 plus 625 days lands on 27 January 2026, and the record's `Deal Updated At` is 25 January 2026. The DPD shown is consistent with a value computed at last sync rather than at page load. That may be entirely correct, but from the UI there is no way to tell, and on a call where the agent says the number out loud, the difference matters.

**Rule.** Any computed or synced figure carries a relative timestamp (`as of 2h ago`). If it is live, say `live`. Agents should never have to guess whether a number is current.

### 6.6 Dates

The current page shows `17-08-1994` (DOB) and `23/01/2026` (Submit Date) in adjacent cards. Two separators, and `12/05/2024` is genuinely ambiguous between DD/MM and MM/DD without doing the DPD arithmetic to resolve it.

**Rule.** One format, everywhere, unambiguous by construction. `12 May 2024` removes the ambiguity at a cost of three characters. If space forces numerics, use a single consistent DD/MM/YYYY and never mix separators.

### 6.7 Encoding quantities in space, not just digits

Two of the preattentive channels carry quantitative information with real precision: **2-D position** and **line length**. Everything else (hue, size, area, curvature) is good for categories and rough magnitudes and poor for exact values. Few's two space-efficient components exploit exactly those two channels, and both fit this page.

**Bullet graph** (Few's replacement for the dashboard gauge). A thin horizontal bar showing one value against a target, with banded shading behind it for qualitative ranges. It reads preattentively through line length, occupies one text line, and does what a gauge does in a fraction of the space.

Fits on this page for:
- **Outstanding against total.** `AED 9,010 of AED 11,010` is two numbers the agent has to subtract. A bar that is 82% filled is a proportion they see. The banded version adds "how much of this book usually gets recovered at this stage."
- **DPD against bucket boundaries.** Bands at 30 / 60 / 90 / 180 / 365+ turn `625` from a raw integer into a position in a known scale, which is the Level 2 conversion from §1.2.

**Sparkline** (Tufte's, adopted by Few for dashboards). A word-sized line chart with no axes, read for shape rather than value.

Fits on this page for:
- **Contact history over time.** A sparkline of contact attempts across the last 90 days, with answered attempts marked, tells the agent at a glance whether this borrower has been going quiet or has just started engaging. The current design gives them four separate counters and timestamps to assemble that from.
- **Balance trajectory.** Flat for eighteen months versus stepping down says completely different things about the conversation about to happen.

ClearGrid's own marketing site already uses an inline teal bar inside a table cell as a visual encoding next to a number (observed in the product showcase and recorded in the project design reference), so this is consistent with their existing pattern rather than an import.

**Two cautions.** First, these are the "initiative" moves in this brief, and initiative is weighted at 20%, so they are worth doing. Second, they spend the line-length channel, so per §2.2 nothing else on the page may use bar length for anything.

### 6.8 Read versus write

The Custom Attributes section mixes read-only text (`Total Deal Value: 11010`) with live editable dropdowns (`Deal Owner`, `Lender Verification Required`, `Disputed`) in the same four-column grid, with the only difference being the presence of a chevron.

**Rule.** Controls that change data must be visually distinct from facts that display data, at a glance, without reading. This matters more in a compliance-audited workspace than in most software: an agent should never change a field they thought they were reading.

---

## Part 7: Bilingual and RTL

The brief weights Arabic support at 25%, which is the second-highest single criterion. Most candidates will mirror the layout and stop. The following is where the marks actually are.

### 7.1 The non-negotiables

- **Declare an Arabic font.** This is the single most-missed item. A Latin-first font stack silently falls back to inconsistent OS fonts for Arabic. ClearGrid's own Arabic site uses **Tajawal**, which is verified in this project's design reference, so use it rather than substituting. Set `<html dir="rtl" lang="ar">` at the root: `lang` drives font fallback and screen-reader voice selection, not just `dir`.
- **Never apply letter-spacing to anything containing Arabic.** Arabic is a connected script. Negative tracking crushes the letter joins into a blur; positive tracking disconnects letters that must join. This includes mixed spans like «625 يوم», which contain Arabic glyphs. If the Latin design uses tight tracking on numerals, scope it to pure-Latin elements only.
- **Line-height ≥ 1.6 for Arabic body text**, and never `leading-tight`. Arabic ascenders, descenders and diacritics clip at the line-heights that look fine in Latin. The most-missed spot is the large display number ending in an Arabic suffix, which inherits a sub-1.6 default.
- **No italics on Arabic.** There is no italic tradition and browsers fake-slant it. Use weight or colour for emphasis.
- **Use logical CSS properties** (`margin-inline-start`, `padding-inline-end`, `text-align: start`) rather than physical left/right, even in an always-RTL build. Audit for leaks: badges with `mr-1`, absolutely positioned adornments with `left-*`, inline `marginLeft`.

### 7.2 The parts most candidates get wrong

**Digits.** Both Eastern (٠١٢٣) and Western (0123) numerals are correct Arabic, and CLDR's default varies by locale: `ar-EG`, `ar-SA` and `ar-IQ` resolve Eastern, `ar-MA`, `ar-TN` and `ar-DZ` resolve Western. ClearGrid operates in UAE and KSA. The design reference in this project observed Western digits on ClearGrid's own Arabic site, which matches UAE and KSA fintech norms. **The non-negotiable is consistency: one numeral system per user per view**, including tooltips, validation messages and inline examples. Mixing Eastern digits in error copy with Western digits in a field is a real observed failure.

**Currency.** Never hand-concatenate a symbol and an amount. Arabic locales render the currency marker **after** the amount and prepend a right-to-left mark so the token embeds correctly. Let the formatter place it.

**Calendar.** The `ar-*` calendar default varies by engine and ICU version. Pin the one you intend (Gregorian for a collections system, almost certainly) rather than inheriting it.

**Mixed-direction islands.** Emirates ID, phone numbers, reference IDs like `CV5V22`, account references like `337-1fffd-5ea9-4ea7-885a-ee643_Tamara`, and email addresses are inherently LTR and need `dir="ltr"` on an **inline** span (not a block, which also flips the alignment edge). This page is full of them. Get it wrong and the Emirates ID renders with its segments in the wrong order, which is a data-integrity bug wearing a typography costume.

**Icon mirroring by meaning.** Mirror forward/back arrows, chevrons, send, reply, undo. **Do not mirror** the clock, search, checkmarks, media controls, logos, or anything containing Latin glyphs. Standardise flips on `scaleX(-1)` rather than `rotate(180deg)`, because rotation happens to work for symmetrical chevrons and silently breaks asymmetric glyphs like Send.

**Trend indicators.** A diagonal up-right arrow implies an LTR timeline. In RTL the timeline-correct diagonal is up-left. Where the flipped diagonal would collide with a flow meaning in the product's iconography, drop the diagonal and use vertical-only indicators or sign plus colour.

### 7.3 A judgement call worth raising rather than deciding

The agent research in this project notes that ClearGrid's own product pattern for bilingual content is **side by side** (Arabic and English shown together in the ClearVoice live-call view), not toggle-only. The brief asks for two mirrored frames. Both can be true: mirrored frames for the interface chrome, side-by-side for specific bilingual **data fields** like borrower name and merchant name, which the brief itself specifies as "Arabic + English."

Present this as an observation about their existing pattern with a recommendation, not as a unilateral departure from the brief. That reads as product judgement. Silently ignoring the brief reads as not having read it.

---

## Part 8: Audit of the current screen

Findings from direct inspection of the four production screenshots. Each is checkable against the images.

### 8.1 Seven fields are rendered two or three times

| Field | Location A | Location B |
|---|---|---|
| Deal Stage | Borrower & Loan Info card | Custom Attributes |
| Deal Owner | Borrower & Loan Info card | Custom Attributes (as a dropdown) |
| Account Status | (implied by page context) | Custom Attributes |
| Days Past Due | Financial Status card | Custom Attributes |
| Last Due Date | Financial Status card | Custom Attributes |
| Total Amount / Total Deal Value | Financial Status card | Custom Attributes |
| PTP Date and PTP Amount | PTP & Collections Log card | Custom Attributes (×2 pairs, human and AI) |

Beyond the wasted space, this is exactly the within-record repetition that the alert-fatigue literature identifies as the specific driver of users tuning content out.

### 8.2 The most decision-relevant flag is the least visible thing on the page

`Disputed: No` and `Lender Verification Required: No` sit at the bottom of the Custom Attributes accordion, which is collapsed by default, styled identically to `Deal Updated By: SYSTEM`. Per the agent research, dispute is one of the six borrower states the engine distinguishes and one of the conditions that routes a case to a human in the first place. The reason the case is on the agent's screen is the hardest thing on the screen to find.

### 8.3 There is no visual hierarchy at all

Verified across all three top cards: labels render at the same size and colour, values render at the same size and weight. `Gender: N/A` has identical visual weight to `Days Past Due (DPD): 625`. The brief's own problem statement calls this out, and the screenshots confirm it precisely.

### 8.4 Empty states consume more space than data

Screenshot 4 shows "No broken promises found" followed by the Deal Activity Timeline showing a clock icon and "No activities found for this deal," together occupying roughly 40% of the viewport. Two blank sections outrank every populated field on the screen for real estate.

### 8.5 The action bar is in the wrong place and carries no state

`SMS / Email / Call / WhatsApp / Email Inbox` sits below the three cards, mid-page, and scrolls out of view. Per the agent research, these actions are gated at decision time by contact-window, frequency-cap and do-not-contact rules enforced programmatically. None of that state is visible on the buttons. The agent discovers a suppression by attempting the action.

### 8.6 Smaller items

- **Contact details in two separate accordions.** `Email Addresses` and `Phone Numbers` are separate collapsible sections holding one value each.
- **Name inconsistency.** The page header reads `Praveen CGD`. It is unclear whether this is the borrower's name, a test record, or a truncation.
- **Marketing inside the tool.** A "Explore Clear Voice / Visit our AI Powered voice platform" promo card is pinned in the left sidebar of a production workspace an agent looks at for eight hours a day.
- **No colour coding anywhere.** Confirmed in the design reference and visible in all four screenshots. This is an opportunity, not just a defect: the semantic colour channel is completely unspent, so introducing it carefully will produce a large, immediate perceived improvement.

---

## Part 9: The decisions this implies

A punch list, ordered by impact per unit of effort.

1. **Three typographic tiers, applied ruthlessly.** Hero (24px mono, 600), primary (13px, 600, `--text-primary`), secondary (12px, 400, `--text-secondary`). Assign every one of the thirty-nine fields to a tier before drawing anything.
2. **Switch to inline labels.** Recovers roughly a third of vertical space (Salesforce measured 30% to 40%). This is what pays for step 3.
3. **Nothing that matters during a call is behind a disclosure control.** Spend the recovered space on un-collapsing Custom Attributes, phone, and email.
4. **Delete the duplicates.** Each field appears exactly once. Custom Attributes becomes genuinely custom (per-vertical fields plus audit metadata), not a second copy of the page.
5. **Add the computed "why is this escalated" line.** Flag it as a data-model dependency if it is one.
6. **One alert colour, capped at three instances, encoding deviation from the portfolio.** Text label plus colour, never colour alone.
7. **Persistent sticky header** carrying identity, the escalation line, balance, DPD, and the action bar with compliance state on the controls.
8. **Human-readable enums everywhere.** One format for dates, one glyph for nulls, units on every amount.
9. **Absolute spatial stability across records.** Same field, same coordinates, populated or not.
10. **RTL as a real build, not a mirror.** Tajawal, `lang="ar"`, zero letter-spacing on Arabic, 1.6+ line-height, LTR islands on IDs and phone numbers, icons mirrored by meaning.

---

## Part 10: How to evaluate the result

Testable checks, usable on a static Figma frame.

| Test | Method | Pass condition |
|---|---|---|
| **Squint test** | Blur the frame until text is unreadable | Three to five distinct shapes remain, and they are the right ones |
| **Greyscale test** | Remove all colour (WCAG 1.4.1) | Every status is still legible |
| **Five-second test** | Show the frame for 5s, then ask: how much do they owe, how late are they, why is this on your screen | All three answered from memory |
| **Conjunction audit** | List every visual attribute in use and what it encodes | No attribute encodes more than one meaning |
| **Repetition audit** | Ctrl+F every value | Each appears exactly once |
| **Zero-click audit** | List everything reachable without clicking | Covers the full glance-mode set from §1.1 |
| **Empty-record test** | Render with every optional field null | Layout does not shift; nothing looks broken |
| **Worst-record test** | Render with 5 deals, 12 broken promises, 40 log rows | Still works; nothing overflows |
| **RTL diff** | Overlay LTR and RTL frames | Mirror is complete; clock/search/logo not mirrored; IDs not reversed |
| **Salience count** | Count elements competing for attention | ≤ 3 |

---

## Myths to avoid, and what to say instead

Several of these circulate widely in design writing and will appear in competing submissions.

| Claim | Reality |
|---|---|
| "Users process visuals 60,000× faster than text" | Untraceable to any study. It appears in SEO content attributed to NN/g but has no primary source. Do not cite it. The defensible version is the 200 to 250ms preattentive threshold, which is measured. |
| "Miller's law: max 7 items" | Miller treated seven as rhetorical and said the specific limit was probably a coincidence. Cowan's reanalysis puts capacity near four. Chunking is the lever, not the count. |
| "Minimalism reduces cognitive load" | For high-frequency expert users it can increase it, by forcing navigation through multiple levels to reach information that used to be visible. |
| "Progressive disclosure is always right" | Nielsen's own framing is that it defers **advanced or rarely used** features. Nothing in that licenses hiding the primary working set of an expert tool. |
| "Accordions reduce cognitive load" | They move it. Design-system guidance is consistent: accordions increase interaction cost, users have to decide what to click, and content behind them is often missed. |
| "The 3-click rule" | No empirical basis. Clicks are not the cost; uncertainty is. |
| "Users don't scroll" | Long dead as a general claim, and irrelevant to a daily-use internal tool where the user knows the page. |

---

## Sources

**Perception and cognition**
- Healey, C. G. *Perception in Visualization*, North Carolina State University. Preattentive thresholds, feature table, conjunction search, feature hierarchy, postattentive vision, change blindness, Bartram et al. on motion. https://www.csc2.ncsu.edu/faculty/healey/PP/ (extended version published in IEEE TVCG)
- Cowan, N. (2001). *The magical number 4 in short-term memory: A reconsideration of mental storage capacity.* Behavioral and Brain Sciences. https://www.cambridge.org/core/services/aop-cambridge-core/content/view/44023F1147D4A1D44BDC0AD226838496/S0140525X01003922a.pdf
- Cowan / Miller debate review: *Modelling Working Memory Capacity: Is the Magical Number Four, Seven, or Does it Depend on What You Are Counting?* Journal of Cognition. https://pmc.ncbi.nlm.nih.gov/articles/PMC11259112/
- Endsley's three-level SA model and design principles, summarised with the principle table in: *Cognitive States Matter: Design Guidelines for Driving Situation Awareness in Smart Vehicles.* https://ncbi.nlm.nih.gov/pmc/articles/PMC7287818
- Cockburn, A., Karlson, A., Bederson, B. (2008). *A Review of Overview+Detail, Zooming, and Focus+Context Interfaces.* ACM Computing Surveys. Four-way taxonomy and Furnas's DOI formula. https://faculty.cc.gatech.edu/~stasko/7450/Papers/cockburn-surveys08.pdf

**Alert fatigue**
- Ancker et al. (2017). *Effects of workload, work complexity, and repeated alerts on alert fatigue in a clinical decision support system.* BMC Medical Informatics and Decision Making. https://link.springer.com/article/10.1186/s12911-017-0430-8
- Override-rate ranges (49% to 96%): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8864797/ and https://pmc.ncbi.nlm.nih.gov/articles/PMC7657729/

**Interface practice**
- Nielsen, J. *Response Times: The 3 Important Limits* (after Miller 1968). https://www.nngroup.com/articles/response-times-3-important-limits/
- Nielsen, J. *Progressive Disclosure.* https://www.nngroup.com/articles/progressive-disclosure/
- NN/g. *The Principle of Common Region: Containers Create Groupings.* https://www.nngroup.com/articles/common-region/
- NN/g. *Proximity Principle in Visual Design.* https://www.nngroup.com/articles/gestalt-proximity/
- NN/g. *Maximize the Content-to-Chrome Ratio.* "Out of sight is truly out of mind." https://www.nngroup.com/articles/content-chrome-ratio/
- NN/g. *Anchors OK? Re-Assessing In-Page Links.* On accordion discoverability. https://www.nngroup.com/articles/in-page-links/
- CMS Design System, *Accordion.* Interaction cost and when to avoid. https://design.cms.gov/components/accordion/
- European Commission Component Library, *Accordion.* "Don't hide important information that should be present at all times." https://ec.europa.eu/component-library/v2.39.0/ec/components/accordion/usage
- Salesforce Lightning Design System 2, *Display Density.* https://www.lightningdesignsystem.com/2e1ef8501/p/805bbe
- Salesforce Developers, *New Density Settings for the Lightning Experience UI in Winter '19.* 30% density increase. https://developer.salesforce.com/blogs/2018/08/new-density-settings-for-the-lightning-experience-ui-in-winter-19
- Adobe Spectrum table guidance on en dashes for null values (via design-system documentation corpus).
- *The Ultimate Guide to Designing Data Tables.* Alignment, tabular numerals, row density. https://medium.com/design-with-figma/the-ultimate-guide-to-designing-data-tables-7db29713a85a
- Stephanie Walter, *Enterprise UX: essential resources to design complex data tables.* https://stephaniewalter.design/blog/essential-resources-design-complex-data-tables/
- Few, S. *Information Dashboard Design: Displaying Data for At-a-Glance Monitoring*, 2nd ed. Bullet graphs, sparklines, data-ink reduction, grouping into logical sections, highlighting what matters.

**Accessibility**
- W3C WCAG 2.x Success Criterion 1.4.1, Use of Color (Level A). Colour-vision-deficiency prevalence figures of ~8% of men and ~0.5% of women. https://www.thewcag.com/criteria/1.4.1

**Bilingual and RTL**
- `designing-arabic-frontends` skill (fonts, line-height, digits and CLDR locale defaults, currency formatting, calendar pinning, mixed-direction boundaries, logical properties, icon mirroring, RTL charts).
- `arabic-design` skill (letter-spacing prohibition, Arabic font stacks, diacritic clearance, bidi leaks).

**Project-internal**
- `cleargrid-borrower-profile-redesign-brief.md` (requirements, data elements, evaluation weights).
- `cleargrid-agent-persona-research.md` (escalation-handling persona, 5% human-escalation rate, AI-first contact, compliance gating, bilingual defaults, vertical differentiation).
- `cleargrid-design.md` (verified brand palette, Geist / Geist Mono / Tajawal, light-mode token set, RTL behaviour on cleargrid.co/ar).
- Four production screenshots of the Borrower Profile Page (all §8 findings).

**Deliberately excluded**
Vendor marketing content claiming agent-productivity percentages, AHT reductions, and application-switching counts was reviewed and left out. It is uncontrolled, self-interested, and none of it changes a design decision here.

---

*Compiled 11 September 2026. Claims about the current interface are traceable to the four screenshots. Claims about perception are traceable to the cited primary literature. Where an inference is mine rather than a finding, it says so.*
