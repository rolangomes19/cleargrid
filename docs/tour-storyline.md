# Tour storyline: one agent, one shift, one case

The tour follows an agent from the moment they open the queue to the moment they log the call and move on. Every step answers a question the agent has at that point, then shows the part of the screen that answers it.

Sources: `docs/research/cleargrid-agent-persona-research.md` (ClearGrid's own pages, fetched 10 Sep 2026) and the four production screenshots in `docs/brief/`. Claims below tagged **[R]** come from that research; **[S]** is this design's own reading. The tour copy is a draft for the author to rewrite.

## Who the agent is

A collections specialist at a lender or a collections agency, working in English and Arabic. Call her Rabab (the fixture owner of the Stress record).

- **She only sees cases the automation passed to a person.** About 95% of contacts are automated and about 5% reach a human, because of a dispute, hardship, a broken promise or a sensitive situation **[R]**. She has probably not spoken to this borrower before: the AI made first contact **[R]**.
- **She works live, between sentences.** Paper notes and heavy multitasking on a call **[R]**. So the screen has two modes of attention: glance (who, how much, why me, may I call) and focused entry straight after the call **[R]**.
- **She is held to rules at decision time.** Contact windows, frequency caps and do-not-contact are enforced per channel **[R]**, and every outcome she logs is scored on the same rubric as the AI's calls **[R]**.
- **She is bilingual by default.** Borrowers answer in Arabic or English **[R]**.

## What she needs, in order

| # | Her question | Where the screen answers it | Tour step |
|---|---|---|---|
| 1 | "Which case is mine next, and why?" | Queue: one row per case, the reason on the row | 1 |
| 2 | "Why did this one reach me?" | The sentence under the borrower's name | 2 |
| 3 | "How much, how late, what was promised?" | The three figures in the header, each with its scope | 3 |
| 4 | "Can I call, text or WhatsApp, and why not?" | The channel buttons, each locked one with its rule | 4 |
| 5 | "Which account do I talk about?" | Account list, biggest first, the named one marked | 5 |
| 6 | "What exactly is owed on it?" | Balance and terms; the bar shows what is paid down | 6 |
| 7 | "What did the AI hear last?" | AI summary and last contact | 7 |
| 8 | "The borrower wants Arabic." | The same screen, mirrored, identifiers still left to right | 8 |
| 9 | "The call is over. Record it." | Outcome form between the accounts and the log | 9 |
| 10 | "Next case." | Back to the queue | 10 |
| 11 | "This one has almost no history." | Empty fields say so; the layout gives room to what exists | 11 |
| 12 | "Why is it built this way?" | Trade-offs and the decision log; **P** shows the prototype controls | 12 |

## Rules for the tour copy

- Written from her side: what she asks, what she sees. Not from the design's side.
- One question per step. The claim names the thing she will see highlighted.
- Nothing in a step depends on a click she has not been shown.
- Where a figure appears, its scope is in the sentence (this borrower, this account).
- The final step is the only one that argues for the design; the rest show it working.
