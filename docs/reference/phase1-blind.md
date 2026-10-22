# Phase 1: blind pass

Inputs used: brief PDF (hash a494c715d24df885) and the 4 screenshots only.
Brief text: `docs/reference/brief.txt` (cited as brief:LINE).
Screenshots: `OneDrive/cleargrid-case-study/screenshots/01..04` (cited as s1..s4, display coordinates).
Provenance: all 4 screenshot files are pixel-identical to the images embedded in the PDF (pages 3 and 4). Verified.

## Problem statement (10 lines)

1. Collections agents use this page as their primary workspace (brief:43).
2. The page stacks 18 card fields, 18 custom attributes, a 9-column deal table and 2 log tables, all at one visual weight (s1, s3, s2).
3. Five disclosure sections sit between the cards and the table; four start closed (s2).
4. The same fact shows up to 3 times with 3 different labels and no scope (Total Amount 11,010 / Total Deal Value 11010 / Total Amount 11,010).
5. Nothing says why this case is with a human, how urgent it is, or what to do first. No status colour exists anywhere in the body.
6. Missing, zero and unknown look alike (N/A, -, empty cell). Dates appear in 4 formats. Amounts carry no currency.
7. Some figures disagree on one screen (Overdue 0.00 with 625 DPD; 1 human call against 2 human phone logs).
8. The brief asks for EN LTR and AR RTL desktop frames, clear hierarchy, reusable components and a short rationale (brief:119-140).
9. All listed data must appear (brief:146-147). Evaluation weights: UX 30, visual 25, Arabic 25, initiative 20 (brief:362-375). Time limit: 48 hours (brief:383).
10. The brief never says what the agent does in the first 10 seconds of a call. That must be inferred, not read.

## Measured defects in the original page

| # | Defect | Count / value | Evidence |
|---|---|---|---|
| D1 | Card fields, label above value | 7 + 5 + 6 = 18 | s1: Borrower & Loan Info (DOB, Nationality, Gender, Emirates ID, Submit Date, Deal Owner, Deal Stage), Financial Status (Total, Outstanding, Overdue, Last Due, DPD), PTP & Collections Log (6) |
| D2 | Custom Attributes grid | 18 fields, 4 columns | s3, rows of 4/4/4/4/2 |
| D3 | Disclosure sections | 5 chevrons, 4 closed on load, 1 open | s1 and s2 (Email open; Phone, Custom Attributes, Broken Promise, Timeline closed) |
| D4 | Concepts shown 2+ times | 9 concepts: Deal Stage, Deal Owner, Total, Outstanding, Last Due Date, DPD, Account Status, PTP date, PTP amount | s1, s2 table, s3. Plus 2 same-value pairs with different labels: Submit Date = Deal Created At (23/01/2026), Principal = Total Deal Value (11010) |
| D5 | Highest repeat | Total amount 3 times; Last Due Date 3 times | s1, s3, s2 table |
| D6 | PTP naming | 6 labels for 2 concepts: "PTP Via Interaction Log", "PTP Amount Via Interaction Log", "Ptp Date", "Ptp Amount", "Ptp Date A I", "Ptp Amount A I" | s1, s3 |
| D7 | Null conventions | 3: "N/A" (s1), "-" (s3), blank cell (Merchant Name, s2) | s1, s3, s2 |
| D8 | Date/time formats | 4: `17-08-1994`, `12/05/2024`, `23/01/2026 07:53 PM`, `25/01/2026 16:30` | s1 DOB, s1 Last Due, s1 call, s2 log |
| D9 | Number formats | 3: `11,010`, `11010`, `0.00` | s1, s3 |
| D10 | Currency on any amount | 0 of 5 amounts | s1, s2, s3 |
| D11 | Raw machine tokens shown to agent | 5: `RPC`, `Rpc`, `IN_COLLECTION`, `CREDIT_CARD`, `Arabic_speaker` (RPC vs Rpc differ in case) | s1, s2 |
| D12 | Colour-coded status elements in body | 0. Only a small red dot on the header phone icon (not a status) | s1 |
| D13 | Escalation reason / priority / AI outcome text | 0 | s1 to s4 |
| D14 | Label styles | 3: "Label:" with colon, bold label no colon, "Email 1" small caption. Also a truncated label ("Latest Human Call Ans.") beside a full one ("Latest AI Call Answered:") | s1, s3 |
| D15 | Action row order | SMS, Email, Call, WhatsApp, Email Inbox. Call is third. No channel shows a state | s1 |
| D16 | First screen contents | 3 cards, action row, Email Addresses. Phone Numbers is cut off at the fold. Table and logs start below | s1 (fold at y=1081) |
| D17 | Distance to deal table (Email open only) | about 1,407 px down at display scale, more than 1 viewport | s2: table head y=622, scroll offset 785 from the "Deal Stage" anchor (811 in s1, 26 in s2) |
| D18 | Empty states | "No broken promises found", "No activities found for this deal" take full-width blocks | s4 |

## On-screen disagreements (not resolved, shown as seen)

| # | Fact A | Fact B | Note |
|---|---|---|---|
| X1 | Overdue Amount 0.00 (s1) | DPD 625, Outstanding 9,010 (s1) | A past-due account with zero overdue. Cause unknown. |
| X2 | Total Human Calls 1; Latest Human Call Ans. 23/01/2026 07:53 PM (s1) | 2 Phone/Outgoing logs by the agent, 25/01/2026 16:30 and 24/01/2026 22:45 (s2, s4) | Logs may not equal answered calls. Cause unknown. |
| X3 | Latest AI Call Answered 27/11/2025 (s1) | Submit Date and Deal Created At 23/01/2026 (s1, s3) | AI call predates the deal. Cause unknown. |
| X4 | Gender "N/A" is a valid value (brief:159) | "N/A" also stands for null in PTP fields (s1) | One token, two meanings. |

## Derived finding (not raw)

| Item | Result |
|---|---|
| Date order of `12/05/2024` | The page never states it. DPD 625 resolves it. 12 May 2024 + 625 days = 27 Jan 2026, two days after the latest log (25/01/2026). 5 Dec 2024 + 625 days = 22 Aug 2026, after every timestamp on the page. So the page is DD/MM. |
| Screenshot date | About 27 Jan 2026. Derived from DPD, not stated. |

## Brief data elements not visible in the 4 screenshots

| Element | Brief | Status |
|---|---|---|
| Visa Status | brief:175 | Not shown on any screenshot. Unverified whether the product hides it or this borrower has none. |
| Name in Arabic and English | brief:156-157 | Only "Praveen CGD" (Latin) shown. |
| Group E: payment plan, interest/EMI, lender name and ID, schedule flags | brief:269-293 | Behind the "View" button (s2). Not captured. Not a defect, a gap in the evidence. |

## Gap: blind pass vs documented diagnosis

Documented diagnosis: `docs/spec.md:11` and `docs/spec.md:50-60` ("renders three different scopes of data as one flat list").

| Check | Result |
|---|---|
| Scope mixing visible in screenshots | Confirmed in part. "Borrower & Loan Info" holds borrower fields (DOB, Nationality, Gender, Emirates ID) and deal fields (Submit Date, Deal Owner, Deal Stage). s3 labels the same three as "Deal Created At", "Deal Owner", "Deal Stage". |
| Multi-account confusion (borrower total vs account total) | Not observable. The 4 screenshots hold one deal. The brief says multi-deal is possible (brief:235). The evidence for this defect is in the synthetic records and `spec.md:60`, not in production screenshots. |
| `spec.md:52` "Every field in the brief belongs to exactly one of three scopes" | Contradicted. `spec.md:56` lists escalation reason, preferred language, contact eligibility and aggregate exposure as brief fields. None appear in the brief (grep of brief:1-402 finds no "escalat", "eligib", "priority", "reason"). They are added fields, not brief fields. |
| `spec.md:56` places deal owner and submit date in Borrower scope | Conflicts with s3, which labels them as deal-level ("Deal Owner", "Deal Created At"). |
| Defects named by the diagnosis that the blind pass also found | Raw tokens (`spec.md:284`), mixed date formats (`spec.md:285`), currency (`spec.md:340`), repeated fields (`spec.md:87`). |
| Defects the blind pass found that the diagnosis does not name | 3 null conventions (D7), RPC vs Rpc casing (D11), 6 PTP labels (D6), 3 label styles (D14), on-screen contradictions X1 to X3. CLAUDE.md fixes nulls by rule (en dash). The original defect is not recorded as a defect. |
| Claim the blind pass cannot test | "About 95% of cases are automated" (`spec.md:21`). It is not in the brief or screenshots. It comes from the persona research. Goes to the Phase 2 ledger. |
| Brief item the build drops on purpose | Accordions (`design-rationale.md:55-68`) and Email Inbox in the rail (`spec.md:129`). `design-rationale.md:17` says "four of five action buttons". |

## Method limits

- Coordinates are display scale (x1.02 gives original pixels).
- Counts come from reading the images, not OCR. Recount on request.
- D17 is approximate (about 10 px).
