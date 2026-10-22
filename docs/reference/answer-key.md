# Phase 6a: answer key (written BEFORE Reference.md, from raw sources only)

Written: 2026-10-22, before Phase 4 started. Answers come from raw files, git, hashes and the Phase 3 run. Not from any digest.
A pass needs the checkable value in bold. Wording may differ.

| # | Question | Answer (checkable value) | Raw source |
|---|---|---|---|
| 1 | Which file is the current final build, and what pins it? | `cleargrid/dist/cleargrid-borrower-profile.html`, built from git `492a557`. SHA-256 starts **d2c296c7**. It is 99,241 bytes with CRLF line ends. A fresh build of HEAD src, converted to CRLF, is byte-identical | sha256sum of dist; git:492a557; Phase 3 rebuild |
| 2 | Which OneDrive HTML is the 12 Sep submission build, and which commit made it? | `OneDrive/.../cleargrid-case-study/redesign-preview.html`, 73,205 bytes, hash starts **33115154**. It equals a CRLF build of commit **9626d5f** | sha256sum; rebuild of git:9626d5f |
| 3 | Which CLAUDE.md is current and which is stale? | Repo `cleargrid/CLAUDE.md` (hash starts **e530ba8c**) is current. Outer `C:\cleargrid-profile\CLAUDE.md` (**8096abeb**) is stale: it says three tiers, 23 / 12.5 / 11.5 px | sha256sum; outer CLAUDE.md:52 |
| 4 | What is the core diagnosis and fix, in one sentence? | The old page renders three scopes (borrower, account, event) as one flat list. The fix is one column per scope plus a locked top band (the spine) that never scrolls | RP/docs/spec.md:11,50-64 |
| 5 | What type sizes does the build use? | Exactly **12, 13, 16 and 24 px** | Phase 3: computed font-size on 16 runs; RP/CLAUDE.md:65 |
| 6 | On the stress (Mohammed) record, how many coral elements are painted, how many containers hold them, and what does verify.js count? | **5** painted elements, **3** containers (band, two cards). verify.js counts **3** (`data-alert`) | Phase 3 json; RP/test/verify.js:17,32 |
| 7 | What breaks the Arabic build at 1280 px wide? | The language toggle shows only the active button. Clicking it does nothing. It works only after the nav collapse button is pressed. verify.js cannot see it | RP/src/app.js:78-79; RP/src/tokens.css:142-149; Phase 3 extra2 |
| 8 | How many facts does the spine hold: what do the docs say, what does the build have? | Docs say **7**. The build has **6** `data-g` regions (name, out, dpd, ptp, why, rail). Counted as fact nodes it is 8 plus 6 rail buttons | interview-prep-guide.md:167-169; RP/src/regions.js:32-62; Phase 3 |
| 9 | Is the "95% of cases automated" figure verified? Does the AED 11,800 vs 16,000 header bug appear in both ChatGPT prototypes? | 95%: **stated only**, from a web page that is not saved in any input. The bug: **v2 only**. v2.1 header 12,860 equals its deals 4,860 + 8,000 | persona-research.md:11; v2.html:135,141; v2.1.html:43-45 |
| 10 | Name two open decisions the owner must make. | Any two of: **Figma file** (brief requires it, none in inputs); what counts as a coral "element" (5 vs 3 on stress); whether "None on record" is a null (two null forms today); the single customisation line; the 7 vs 6 spine count wording | brief:345; RP/docs/design-rationale.md:44-53; technical-round-prep.md:338 |
