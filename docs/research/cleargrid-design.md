# ClearGrid — Design System Reference

Compiled from a live DOM inspection of `cleargrid.co` (marketing site, both `/` and `/ar/index.html`) and the four uploaded product screenshots of the actual Borrower Profile Page. Every value below is either read directly from computed styles in the browser or observed pixel-for-pixel in the screenshots — nothing is guessed.

Two things worth naming up front, since they don't agree with each other:

- **Marketing site** = dark mode. Near-black background, teal accent, Geist typography, a "command center" aesthetic.
- **Product screenshots (actual app)** = light mode. White background, black sidebar text, no color-coding at all currently, plain system sans-serif, dense tables.

The user wants light mode for the Borrower Profile redesign. So this file separates "brand DNA to carry over" (color, type character, motion/density philosophy) from "dark-mode specifics that don't apply" (backgrounds, dark surfaces). The recommended light system is built at the bottom.

---

## 1. Logo & Mark

- Mark: a black (or white, on dark) square with a smaller white/negative-space square cut into the upper-right — like a "signal window" or grid cell. Reads as a `[ ▪ ]` glyph.
- Lockup: mark + "ClearGrid" wordmark (regular weight, tight tracking) stacked above the Arabic wordmark "كليرجريد" in every instance observed — even on the English site, the Arabic wordmark sits beneath as a permanent bilingual signature.
- On the Arabic site (`/ar/`), the entire lockup mirrors to the right side of the nav bar, RTL-native, not just flipped text.

## 2. Color — as used on the marketing site (dark mode reference)

Pulled via `getComputedStyle` on live elements, not estimated:

| Token | Value | Where observed |
|---|---|---|
| Background (base) | `rgb(10, 10, 8)` | `<body>` |
| Background (elevated panel) | `rgb(13, 16, 15)` / `rgba(13,16,15,.97)` | module/card panels |
| Background (deepest panel) | `rgb(7, 9, 8)` | nested inset panels |
| Text (primary) | `rgb(245, 246, 247)` | body copy, headings |
| Text (primary, 80%) | `rgba(245,246,247,0.8)` | secondary button label |
| Text (muted, 60–66%) | `rgba(245,246,247,0.6–0.66)` | supporting paragraph copy |
| Text (dim, 44%) | `rgba(245,246,247,0.44)` | tertiary/meta text |
| **Teal — primary accent** | `rgb(6, 148, 148)` | filled button bg ("Book a consultation") |
| **Teal — light accent** | `rgb(87, 183, 182)` | headline highlight word, active-state text |
| **Teal — dark accent** | `rgb(4, 113, 109)` | pressed/darker variant |
| Teal wash (12%) | `rgba(6,148,148,0.12)` | subtle highlight chip backgrounds |
| **Coral (secondary accent)** | `rgb(228, 104, 93)` | rare — alert/warning-adjacent highlight, used sparingly |
| Border (subtle) | `rgba(245,246,247,0.09–0.12)` | card/panel outlines |
| Border (visible) | `rgba(245,246,247,0.28)` | secondary button outline |
| Border (teal, active) | `rgba(6,148,148,0.3–0.4)` | active nav/tab underline or ring |

**Reading on the palette:** this is not a blue-based fintech palette (no `#2563EB` anywhere on the live site — that was a reasonable but incorrect guess in the earlier sketch plan). ClearGrid's actual identity color is a **desaturated teal**, closer to a deep cyan, used deliberately sparingly — most of the UI is grayscale, and teal is reserved for the single primary action and for numerals/data that matter. Coral appears once as a counter-accent, almost certainly for negative/flagged states.

## 3. Typography

Read directly from `font-family` computed values:

- **English UI font:** `Geist` (fallback: `"Helvetica Neue", -apple-system, Arial, sans-serif`) — a modern geometric-grotesk, used for everything: headings, body, buttons, nav.
- **Monospace / data font:** `"Geist Mono"` (fallback: `"SF Mono", ui-monospace, monospace`) — used for the small uppercase eyebrow labels ("THE CLEARGRID SOLUTION", "HOW IT WORKS", breadcrumbs like "CLEARGRID / FOR CUSTOMERS") and for numeric/reference data in the illustrative product UI (deal IDs, scores, timestamps). This mono-for-data, sans-for-prose split is a clear, intentional system.
- **Arabic UI font:** `Tajawal` (fallback: `"IBM Plex Sans Arabic"`, then `Geist`) — confirmed via `document.documentElement.lang="ar"` / `dir="rtl"` on the Arabic homepage. Tajawal is a geometric Arabic sans that pairs well with Geist's geometric character in mixed English/Arabic contexts (e.g. borrower names, merchant names) — good precedent to reuse.

**Scale observed:**
- Hero H1: 96px / 600 weight / 100.8px line-height (marketing-only, not applicable to app UI)
- Section/module heading: 19px / 600 weight (this is closer to what an app section header should look like)
- Eyebrow/label: small, uppercase, mono, teal or dim-gray, tracked wide

**Weight usage:** primarily 500–600. No evidence of a light/300 weight in use — ClearGrid leans slightly heavier and more confident than typical fintech-thin type.

## 4. Component Patterns (from the live "Command Modules" product showcase)

The homepage has a scroll-driven section explicitly labeled "ILLUSTRATIVE DATA" that renders mocked-up screens of ClearGrid's actual product modules (Reporting, Borrower data, Inbound support, Dialer, Agent workspace, etc.) inside a browser-chrome-style frame with a left sidebar labeled "COMMAND MODULES." This is the single most relevant reference for the Borrower Profile redesign, since it's ClearGrid's own illustration of its product surface. Patterns observed:

- **KPI/stat cards:** uppercase gray micro-label → large bold number (mono-leaning) → small muted sublabel underneath. Cards sit in a horizontal row, thin border, no heavy shadow, subtle background differentiation from page.
- **Data tables:** dense, left-aligned, uppercase column headers in small gray text, teal horizontal bar as an inline visual encoding (e.g. "call pickup score" rendered as a mini progress bar next to the number, not a separate chart).
- **Status/callout chips:** pill-shaped, dark background, thin teal border, small dot indicator + label (e.g. "● Top window 18:00–20:00 GST"), used to annotate specific data points contextually rather than in a legend.
- **Primary button:** solid teal fill, white text, ~8–10px border radius, medium weight label, compact padding (~10px 14px).
- **Secondary button:** transparent fill, 1px semi-transparent white/gray border, same radius.
- **Tabs:** simple underline or filled-pill active state; active tab in teal.
- **Delta/trend badges:** small green pill for positive deltas (e.g. "+12.4%") sitting inline next to a stat label — distinct from the teal brand accent, so positive/negative movement gets its own semantic color separate from brand color.
- **Sidebar nav (in the illustrative product mock):** grouped sections with small uppercase gray group labels (HOME / BORROWERS / INBOUND SUPPORT / DIALER / WORKFLOWS / WORKSPACE / GOVERNANCE), each item with a small square icon bullet, active item highlighted with a filled teal-tinted background and left accent bar.
- **Numbered step indicators:** small square marker + "01" in teal mono type + bold label — used for process/workflow steps, and could translate well to a timeline component.

## 5. RTL Behavior (verified on live Arabic site)

- Root `<html dir="rtl" lang="ar">` — standard, correct RTL declaration.
- Full mirror, not just text-align flip: logo/lockup moves from left to right of the nav bar; primary CTA button moves from right to left of the nav bar; the entire nav item order reverses; the accent vertical bar on quote/callout blocks flips from left-edge to right-edge.
- Typography swaps wholesale to Tajawal — this is not "Geist with Arabic characters," it's a genuinely different, RTL-appropriate typeface family, which is the correct approach (Geist has no Arabic glyph support to speak of).
- Numerals stayed as Western/Arabic numerals in what I could see (not Eastern Arabic-Indic digits) — worth confirming with a native speaker/regional convention, but matches UAE/KSA fintech norms where Western digits are standard in financial contexts.

## 6. What This Means for a Light-Mode Borrower Profile Redesign

The brief asks for light mode. The marketing site is dark, so we're not copying its surfaces — we're extracting the **identity layer** (color role logic, type pairing, component character, RTL discipline) and rebuilding it on light surfaces, which is also what's actually closer to the current product screenshots you have (which are already light).

### Recommended light-mode token set

| Token | Value | Rationale |
|---|---|---|
| `--bg-page` | `#F7F8F9` | Soft off-white, not pure white — matches current app's light gray-white field, reduces glare for 8hr shifts |
| `--bg-surface` | `#FFFFFF` | Card/panel surface |
| `--bg-surface-sunken` | `#F1F3F4` | Recessed areas (e.g. table header row, code/mono blocks) |
| `--text-primary` | `#0A0A08` | Matches the marketing site's near-black, inverted for light bg |
| `--text-secondary` | `#5B6166` | ~60% gray, mirrors the `.6` opacity pattern from dark mode |
| `--text-muted` | `#8A9094` | ~44% opacity equivalent |
| `--border-subtle` | `#E5E7E9` | Card/table borders |
| `--border-visible` | `#D3D7DA` | Input borders, secondary button outline |
| `--accent-teal` | `#069494` | Primary brand teal, used as-is from dark mode — it works on light backgrounds too (tested contrast: passes AA on white for large text/icons; use `--accent-teal-deep` for small text) |
| `--accent-teal-deep` | `#04716D` | For small-text links/labels needing AA contrast on white |
| `--accent-teal-wash` | `#EAF5F5` | Light teal tint for active/selected row backgrounds, chip fills |
| `--accent-coral` | `#DC4A3E` | Reserve for negative/overdue/flagged states — darkened slightly from the marketing `#E4685D` for AA contrast on white |
| `--accent-coral-wash` | `#FDEEEC` | Light coral tint for overdue/danger badges |
| `--accent-success` | `#1E8E5A` | Not on marketing site but needed for PTP-kept/settled states; standard green, kept desaturated to sit quietly next to teal |
| `--accent-warning` | `#B8790A` | For DPD warning tiers, dispute flags |

### Typography carryover

- **English:** Inter as the practical substitute if Geist isn't licensed/available in your design tool — same geometric-grotesk character, same weight range (500/600), free and widely available. If Geist is accessible (it's open-source, SIL license), use it directly for full brand fidelity.
- **Arabic:** Tajawal, exactly as ClearGrid uses it. Free on Google Fonts, pairs correctly with Inter/Geist.
- **Mono/data:** Geist Mono (or JetBrains Mono as substitute) for: reference IDs, Emirates ID, phone numbers, monetary amounts, timestamps, DPD counts. This is a real ClearGrid pattern, not an invented one — carry it into the redesign for all the numeric/ID fields in sections A–E of the brief.
- **Eyebrow/label style:** uppercase, mono, letter-spaced, small — use for section headers like "BORROWER & LOAN INFO," "FINANCIAL STATUS," matching ClearGrid's own section-label convention ("THE CLEARGRID SOLUTION," "HOW IT WORKS").

### Component carryover

- KPI cards → use for the Financial Status zone (Total/Outstanding/Overdue amounts, DPD) exactly as ClearGrid's own illustrative dashboard does: label small-caps gray, value large mono/bold, optional inline trend or status dot.
- Status chips with dot indicator → use for Deal Stage, Account Status, DPD tier badges.
- Progress/score bar inline in a table cell → could be repurposed for a "days until next action" or PTP-likelihood visual if you want a stretch/initiative touch, though it's not required by the brief.
- Numbered step marker → good fit for the Deal Activity Timeline component (section E).
- Sidebar grouped nav with active teal highlight + left bar → directly matches what's already in the current product screenshots (ClearGrid's real sidebar), so keep that structure unchanged and just refine spacing/type.

### What NOT to carry over

- Dark backgrounds, dark panel elevation system — brief explicitly wants light mode.
- 96px hero type scale — that's marketing, not application UI; keep app headings in the 16–24px range as seen in the product screenshots and illustrative dashboard (19px section headers).
- The animated wave/gradient background — decorative marketing texture, no place in a dense data-entry CRM screen.

---

## Sources

- `https://cleargrid.co/` — homepage, live DOM inspection (colors, fonts, buttons, "Command Modules" illustrative product showcase)
- `https://cleargrid.co/ar/index.html` — Arabic homepage, RTL verification (`dir`, `lang`, Tajawal font stack, mirrored layout)
- `https://cleargrid.co/for-customers.html` — borrower-facing page, breadcrumb/heading pattern
- Four uploaded product screenshots of the actual (light-mode) Borrower Profile Page — used to confirm current typography density, lack of existing color-coding, and real data field layout
