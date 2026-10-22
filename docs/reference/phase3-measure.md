# Phase 3: measure the build

Build under test: `cleargrid/` at HEAD `492a557`, copied to scratch. No `src/` edit.
Raw data: `docs/reference/measure.json` (16 runs). Scripts: `docs/reference/scripts/measure.js`, `extra.js`, `extra2.js`, `extra3.js`.

## Commands

| Step | Result |
|---|---|
| `bash build.sh` (LF copy) | Built. 93,535 chars. |
| Shipped `dist/cleargrid-borrower-profile.html` vs fresh build | Byte-identical after converting LF to CRLF. SHA-256 `d2c296c797939805312826915acc32f02a662334662d7444d6c184fd7d422760`. Pin this. |
| `node test/verify.js` | Exit 0. "ERRORS: none". 1.5 s. |
| Playwright, Chromium, 4 records x EN/AR x 1440x900 and 1280x900 | 16 runs. 0 page errors. |

## Environment limits

| Limit | Effect |
|---|---|
| Google Fonts and unpkg are blocked here. Tajawal and JetBrains Mono are not installed (`fc-list` finds 0). Inter is installed | Computed sizes, weights, colours, counts are valid. Pixel widths (spine stat x, wrapping) are approximate. Arabic glyph rendering is unverified |
| Phosphor icons did not load | Icon sizes not measured |
| Line endings | Working tree is CRLF. HEAD blobs are LF. `git diff --ignore-cr-at-eol` is empty. The 8 "modified" files are EOL only |
| `build.sh` in the CRLF tree | Under bash: `set -e\r` errors and `cd` fails. The python step still ran from the repo root and gave the same content. Run from another directory it would break |

## Measured vs CLAUDE.md (repo copy, hash e530ba8c)

| Rule | CLAUDE.md | Measured | Result |
|---|---|---|---|
| Type sizes | 12, 13, 16, 24 only (:65) | Exactly {12,13,16,24} in all 16 runs. 0 off-scale | Match |
| Weights | 400/600, mono display 500 (:75) | {400,500,600}. 500 only on JetBrains Mono. 0 other | Match |
| Control heights | 32 / 28 / 24 / 20, column head 44 (:67-68) | `.act` 32, `.mini` 28, `.badge` 20, `.colhead` 44 in all runs. Tab buttons not measured | Match |
| Page does not scroll (:37) | scrollHeight 900 = viewport 900; scrollWidth = viewport at both widths | Match |
| Spine does not move on pane scroll | Scrolled a pane 200 px in every run. Spine rect unchanged | Match |
| Spine same place on every record (spec.md:119) | Outer rect identical across the 4 records per direction and width (e.g. 1440 EN `[184,0,1256,173]`) | Match |
| Spine inner positions | The three stats move per record. Outstanding x at 1440 EN: omar 715, aisha 804, stress 727, sparse 888. Cause: `.stats{margin-inline-start:auto}` (tokens.css:170) with content-sized stats | **Mismatch** with "identical coordinates" (spec.md:119) and the positional-memory rationale (spec.md:95). Pixel values approximate (fonts) |
| Spine height | EN 173 px, AR 182 px at both widths | Differs by 9 px between languages. Columns below shift 9 px in AR. Note, not a rule break |
| No accordions or disclosure (:42) | 0 of `details, summary, [aria-expanded], [aria-controls], .accordion, [data-toggle]` in all runs | Match |
| Account sort outstanding descending (:47) | `sortedDesc` true on all 4 records (stress: 7 cards) | Match |
| Nav width (spec.md:110) | 184 at 1440, 64 at 1280 | Match |
| Harness removed (:117) | 0 hits for squint, audit, harness in dist | Match |
| Physical `left/right` in tokens.css (:99-100) | grep finds 0 | Match |
| Arabic: tracking 0, no italics, no weight under 400 (:98) | 0 / 0 / 0 on 139 Arabic-glyph elements (1440) | Match |
| Arabic: line height x1.7 on every tier (:69, :98) | 8 elements with Arabic glyphs sit at 1.17 or 1.5. Money in the display tier (`د.إ.`): 24 px at 28 px line height, 16 px `.sm` at 24 px. Cause: `html[lang="ar"]` resets only meta, body, title (tokens.css:34); `--lh-display` is not reset (tokens.css:19, :44) | **Mismatch** with CLAUDE.md:69 ("swaps the px line-heights for x1.7 through the same tokens") |
| Arabic: Tajawal (:97) | 8 Arabic-glyph elements per AR run use the JetBrains Mono stack: 5 money values and 3 log timestamps with Arabic month names (`.when num`, e.g. "9 سبتمبر، 20:15"). Mono has no Arabic glyphs, so the browser falls back to a system face. Tajawal is not in that stack | **Mismatch** with "Tajawal, loaded" for those 8 elements. Rendering unverified here |
| LTR islands (:101) | Emirates ID, phone, email, case ref, account ref, lender ID are inside `.ltr` in every record. `.ltr` is `display:inline-block` (9 of 9), CLAUDE.md says "inline spans only" | Match on content. Wording gap: inline-block vs inline. The agent's own nav email `rabab.abbas@cleargrid.com` is outside `.ltr` |
| Nulls: one glyph, en dash, muted (:109) | en dash present. Stress and sparse also show a sentence, "None on record" / "لا يوجد وعد مسجل", in the spine promise slot (i18n.js:17, :87) | **Mismatch**: two null forms on screen |
| Nulls: AA contrast | En dash is `--muted #8A9094` on `#FFF` = **3.23:1** at 12 to 13 px (tokens.css:3, :51). Fails 4.5:1, passes 3:1. 128 hits over 16 runs. tokens.css:50 says this is deliberate | Known trade. `docs/cleargrid-decision-defensibility-audit.md:56` leaves the dash out of the readable-copy fix ("if used as readable copy, not just a dash"). No doc states the 3:1 result outright |
| Contrast, other | Nav avatar white on teal `#069494` = **3.70:1** at 12 px (tokens.css:108). 16 hits | Fails 4.5:1. Only other failing pair. Contrast on every other text element passes |
| Coral maximum three (:39) | See coral table | **Mismatch or ambiguous** |
| Language build reachable at 1280 | At 1280x900 the toggle shows only EN. A real click on it does nothing (`.collapsed` class is absent, so app.js:78-79 sets the same language). It works only after the user presses the nav collapse button first. Reproduced in `extra.js`, `extra2.js` | **Defect**. `verify.js` cannot see it (jsdom has no media queries). CLAUDE.md:3 requires 1280 and two languages |
| Email Inbox (spec.md:129, design-rationale.md:17) | Rail holds 6 buttons: Call, SMS, WhatsApp, Email, **Email Inbox**, Log outcome (regions.js:62) | **Mismatch**: spec says Inbox left the rail; rationale says 4 of 5 channels. The build has all 5 |

## Coral count

CLAUDE.md:39 says "maximum three coral elements". `verify.js` counts `[data-alert="1"]` (verify.js:17, :32). I also counted every element painted with a coral token (background, border, own text colour).

| Record | `data-alert` (what verify.js asserts) | Painted elements (outermost) | Containers (band + cards) | Queue screen `data-alert` |
|---|---|---|---|---|
| omar | 2 | 2 (band, Disputed badge) | 2 | 3 |
| aisha | 1 | 3 (band, flag dot, "Reason for assignment" cue) | 2 | 3 |
| stress | 3 | **5** (band, flag dot, "678 d" badge, cue, Disputed badge) | 3 (band, card 3, card 4) | 3 |
| sparse | 0 | 0 | 0 | 3 |

Reading:
- `verify.js` undercounts. Aisha shows 1 against 3 painted. Stress shows 3 against 5.
- Whether stress breaks the cap depends on the word "element". By container it is 3. By painted element it is 5.
- Identical on EN and AR, at 1440 and 1280.
- The decision belongs to the user. Not resolved here.

## Spine fact count

| Measure | Count |
|---|---|
| `data-g` regions in `.spine` | 6: name, out, dpd, ptp, why, rail |
| Fact nodes | name 1, stage 1, language 1, owner 1, stats 3, why 1 = 8 |
| Rail buttons | 6 (5 channels + Log outcome) |

The prep doc's "6, not 7" (technical-round-prep.md section 8) is tested in Phase 2 against these.

## Not measured

- Motion timings. Tab-button height (24). 4 px grid. "Deviation within own book" colour logic.
- Pixel-accurate Arabic rendering (font not available).
- Real Chrome on the user's machine.
