# Scoobandi Homepage — Build & QA Report

**Deliverable:** `/home/user/workspace/scoobandi-site/index.html` — single static HTML bundle with inline CSS + JS.
**Status:** COMPLETE. NOT deployed (parent deploys per instruction).
**QA date:** 2026-07-03. Viewports tested: 1280×900 (desktop fold), 375×812, 390×844 (mobile).

---

## 1. Changed / created files

| File | Notes |
|------|-------|
| `index.html` | 613 lines, ~44KB. Full homepage (router). Inline CSS + JS, no external CSS/JS deps except Google Fonts + tracking scripts. |
| Images (14, all local, downloaded via curl / copied — no hotlinking) | See asset table below. |
| QA screenshots | `qa-1280-fold.png`, `qa-1280-full.png`, `qa-390-full.png` (regenerated after final edit). |

**Final edit applied (hero tightening) — verified in file:**
- `.hero` padding `40px 0 36px` (line 94)
- `.hero h1` `font-size:clamp(36px,5vw,62px); max-width:20ch` (line 99)
- `.pick-row` `margin:32px 0 22px` (line 102)

Result: hero is 3 lines on desktop; router starts at `top:504` within the 900px fold, so all 3 card images + eyebrow pills + titles are visible above the fold.

---

## 2. Assets used (all local, no hotlinks)

| File | Where used | Description |
|------|-----------|-------------|
| `geordi-airport-mobile.jpg` | Fix the Walk router card | B&W dog, loose leash, airport terminal |
| `dds-silhouette.png` | Digital Dog School router card | Person + seated dog silhouette, sunset over water |
| `consult-joel.jpg` | Book a Consult router card (216K optimized) | Joel crouched in woods with young shepherd |
| `joel-with-dog.jpg` | About Joel section | Joel kneeling in grass with brown dog |
| `proof-inky.png` | Proof strip + big proof grid (lightbox) | Inky Inkblot review (2 trainers + vet behaviorist) |
| `proof-tiktok.jpg` | Proof strip + big proof grid (lightbox) | TikTok comment |
| `proof-sonia.png` | Proof strip (lightbox) | Sonia Bologa / Sully review |
| `proof-different.png` | "Why my work is different" section (lightbox) | "Joel's way is different" review |
| `proof-emmylou.png` | Big proof grid (lightbox) | Emmylou treat-free transformation |
| `proof-ember-reynolds.png` | Big proof grid (lightbox) | Ember Reynolds DDS review |
| `proof-ember-kai.jpg` | Big proof grid (lightbox) | Bucky AKC obedience title |
| `proof-dogperson.png` | Big proof grid (lightbox) | "Joel is THE dog person" review |
| `geordi-airport.jpg` | (present, unused — larger crop) | — |

---

## 3. CTA map (buttons → destination)

| Location | Button label | Style | Destination |
|----------|-------------|-------|-------------|
| Router — Fix the Walk | "See the class →" | orange `.cta-solid` | `https://scoobandi.com/fix-the-walk/` |
| Router — Digital Dog School | "See what's inside →" | ink `.cta-ink` | `https://digitaldogschool.com/` |
| Router — Book a Consult | "Book a consult →" | orange `.cta-solid` | `https://scoobandi.com/consult/` |
| Router quiet fallback | "Not sure which one? Take the 60-second quiz" | small gray text link (no button) | `https://dogs.scoobandi.com/quiz-4061` |
| Final CTA — Walks | "Fix the Walk →" row | dark card row | `https://scoobandi.com/fix-the-walk/` |
| Final CTA — Full system | "Digital Dog School →" row | dark card row | `https://digitaldogschool.com/` |
| Final CTA — Complex case | "Book a Consult →" row | dark card row | `https://scoobandi.com/consult/` |
| Final CTA fallback | "Take the quiz" / "Browse free resources" | text links | quiz / `https://scoobandi.com/resources/` |
| Nav / footer | Consult, Resources, About, quiz | links | consult / resources / #about / quiz |

---

## 4. Link map (all money links — SACRED, verified present, none broken/changed)

- `https://scoobandi.com/fix-the-walk/` — ×3 occurrences
- `https://digitaldogschool.com/` — ×3
- `https://scoobandi.com/consult/` — ×5
- `https://dogs.scoobandi.com/quiz-4061` — ×3
- `https://scoobandi.com/resources/` — ×3

**Forbidden checkout URLs confirmed ABSENT from router** (per instruction): `checkout.digitaldogschool.com/fixthewalk-page` and `checkout.digitaldogschool.com/joindds` are NOT used.

---

## 5. Requirement compliance checklist

| Requirement | Status |
|-------------|--------|
| Single `index.html`, inline CSS + JS | PASS |
| NOT deployed (parent deploys) | PASS — not deployed |
| Router = 3-card chooser (Fix the Walk / DDS / Free Consult) | PASS |
| All 3 router cards visible above desktop fold (1280×900) | PASS — router top:504, cards+titles in view |
| Board & train + private lessons come THROUGH consult (not separate offers) | PASS — Consult card: "Also the starting point for private lessons and board & train." No separate B&T/private offers listed. |
| Quiz is a QUIET FALLBACK (small gray text link, not a button) | PASS — "Not sure which one? Take the 60-second quiz", no button class |
| Geordi NOT referenced as owned; NOT in About Joel | PASS — 0 occurrences of "Geordi" anywhere; 0 "my dog"/"Joel's dog" |
| About Joel = experience over story (credentials, case volume, virtual specialization, method) | PASS — no memoir; years, thousands of dogs worldwide, virtual-by-design rationale, Trust to Train method, 3 stats |
| Money links unchanged/unbroken | PASS |
| All images downloaded (no hotlink) | PASS — 14 local files |
| Lightbox modal for proof images | PASS — `.zoomable` buttons open `#lb`; close via ×, click-outside, Escape (all tested) |
| Mobile-first responsive, test at 375/390/1280 | PASS — no horizontal overflow at 375 or 390; hero stacks; correct mobile crop `geordi-airport-mobile.jpg` used |
| Tracking (Meta Pixel 961888533447407, GA4 G-945PBSRQBE, Clarity w90zj569xx, UTM preservation, CTA click tracking) | PASS — present in `<head>` |

---

## 6. Functional QA performed

- **Lightbox open**: clicked first proof (`.zoomable`) → `#lb` opened with correct enlarged image + alt (Inky Inkblot). PASS.
- **Lightbox close (Escape)**: pressed Escape → modal closed (`is-open` = false). PASS.
- **Scroll reveals**: IntersectionObserver `.reveal` → `.is-in` fires on gradual scroll (reduced-motion fallback adds `is-in` immediately). PASS.
- **Mobile overflow**: `scrollWidth === clientWidth` at both 375 and 390 (no horizontal scroll). PASS.

## 7. Visual QA — defect classes checked and NOT found

- No text overflow/clipping in cards or headings at 1280/390/375.
- No off-token colors — palette consistent (bg #F7F2EA, accent #B3512F, ink #1A1613).
- No squished mobile layout — cards stack full-width, images keep 4/3 crop.
- No placeholder content or missing images — all 13 in-use images load.
- No missing logo — inline "SCOOB & I" wordmark (Archivo Black, & in accent) in topbar + footer.
- Router cards render premium (photo-fill top, eyebrow pill overlay, hover-lift on desktop ≥860px).

## 8. Notes / minor observations (non-blocking)

- On mobile, top nav collapses to show only "Consult" (About/Resources hidden) — deliberate responsive choice; all destinations still reachable via footer + final CTA.
- `geordi-airport.jpg` (larger crop) remains in the directory unused — harmless; left in place per no-cleanup rule.

**READY FOR PARENT TO DEPLOY.**
