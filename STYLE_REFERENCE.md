# Scoob & I — Site Style Reference
Use this doc to build new pages that match the existing site exactly.

---

## Stack & File Structure

```
scoobandi/
├── index.html           ← Homepage (quiz, path cards, testimonials)
├── style.css            ← Shared stylesheet — load on every page
├── main.js              ← Homepage quiz engine only
├── the-playbook/
│   ├── index.html       ← Playbook sales page
│   ├── playbook.css     ← Page-specific styles (extends style.css)
│   └── playbook.js      ← FAQ accordion + scroll tracking
```

New pages go in their own subfolder: `scoobandi/[page-name]/index.html`
Each page gets its own `[page].css` for page-specific styles.
Always `<link rel="stylesheet" href="../style.css" />` first, then the page CSS.

**Deploy path:** `/home/user/workspace/scoobandi`
**Entry point:** `index.html`
**Always use** `should_validate=false` on deploy.

---

## Navigation Links (relative paths — no `/` absolute paths)

From a subfolder page like `the-playbook/index.html`:
- Home → `../index.html`
- The Playbook → `index.html` (self) or `../the-playbook/index.html`
- Book a Call → `/consult` (page not built yet, leave as-is)
- Digital Dog School → `https://digitaldogschool.com/` (external, target="_blank")

From homepage `index.html`:
- The Playbook → `the-playbook/index.html`

---

## Fonts

```html
<link rel="preconnect" href="https://api.fontshare.com" crossorigin />
<link href="https://api.fontshare.com/v2/css?f[]=boska@700,400&f[]=satoshi@400,500,700&display=swap" rel="stylesheet" />
```

- Display / headings: `'Boska'` — used for h1, h2, section headings, pull quotes
- Body / UI: `'Satoshi'` — used for everything else

CSS vars: `--font-display`, `--font-body`

---

## Color Tokens

The site is **dark by default**, light on `prefers-color-scheme: light`.

### Dark (default)
| Token | Value |
|---|---|
| `--color-bg` | `#0d0c0a` |
| `--color-surface` | `#131210` |
| `--color-surface-card` | `#191714` |
| `--color-divider` | `#222018` |
| `--color-border` | `#2c2a25` |
| `--color-text` | `#e4e0d9` |
| `--color-text-muted` | `#8c8880` |
| `--color-text-faint` | `#50504a` |
| `--color-primary` | `#c98438` |
| `--color-primary-hover` | `#b56e28` |
| `--color-primary-subtle` | `rgba(201,132,56,0.10)` |
| `--color-primary-border` | `rgba(201,132,56,0.22)` |
| `--color-success` | `#5fa54e` |
| `--color-error` | `#c94a4a` |

### Light (override)
| Token | Value |
|---|---|
| `--color-bg` | `#f6f3ee` |
| `--color-surface` | `#f9f7f2` |
| `--color-text` | `#201e1a` |
| `--color-text-muted` | `#706b64` |
| `--color-primary` | `#a86420` |

---

## Type Scale

```css
--text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem);
--text-sm:   clamp(0.875rem, 0.8rem  + 0.35vw, 1rem);
--text-base: clamp(1rem,     0.95rem + 0.25vw, 1.125rem);
--text-lg:   clamp(1.125rem, 1rem    + 0.75vw, 1.5rem);
--text-xl:   clamp(1.5rem,   1.2rem  + 1.25vw, 2.25rem);
--text-2xl:  clamp(2rem,     1.2rem  + 2.5vw,  3.5rem);
```

---

## Spacing Scale

```css
--space-1: 0.25rem  --space-2: 0.5rem   --space-3: 0.75rem
--space-4: 1rem     --space-5: 1.25rem  --space-6: 1.5rem
--space-8: 2rem     --space-10: 2.5rem  --space-12: 3rem
--space-16: 4rem    --space-20: 5rem    --space-24: 6rem
--space-32: 8rem
```

Section vertical padding pattern: `clamp(var(--space-20), 10vw, var(--space-32))`

---

## Border Radius

```css
--radius-sm: 0.375rem   --radius-md: 0.5rem    --radius-lg: 0.75rem
--radius-xl: 1rem       --radius-2xl: 1.5rem   --radius-full: 9999px
```

---

## Shadows

```css
--shadow-sm:   0 1px 2px rgba(0,0,0,0.35);
--shadow-md:   0 4px 20px rgba(0,0,0,0.45);
--shadow-lg:   0 20px 60px rgba(0,0,0,0.55);
--shadow-card: 0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px var(--color-border);
```

---

## Layout

```css
.container        /* max-width ~1200px, centered, fluid padding */
.container-narrow /* max-width ~720px, centered */
.centered         /* text-align: center */
```

Section alternation pattern (dark ↔ surface):
- Odd sections: `background: var(--color-bg)`
- Even sections: `background: var(--color-surface)` + `border-top/bottom: 1px solid var(--color-divider)`

---

## Shared Components (already in style.css)

### Buttons
```html
<a class="btn btn-primary">Primary amber CTA</a>
<a class="btn btn-primary btn-hero">Large hero CTA</a>
<a class="btn btn-primary btn-sm">Small nav CTA</a>
<a class="btn btn-outline btn-lg">Outline secondary</a>
<a class="btn btn-ghost-hero">Ghost / text CTA</a>
```

### Section headings
```html
<p class="eyebrow">Eyebrow label — uppercase, amber, small</p>
<h2 class="section-heading">Section heading — Boska, xl</h2>
<p class="section-body">Body paragraph — muted, readable width</p>
<a class="text-link">Inline amber link with underline</a>
```

### Review cards (testimonials)
```html
<figure class="review-card">
  <div class="review-stars">★★★★★</div>
  <blockquote class="review-quote">"Quote text"</blockquote>
  <figcaption class="review-attribution">Name / source</figcaption>
</figure>

<figure class="review-card review-card--image">
  <img src="..." alt="..." />
</figure>
```

### FAQ accordion
```html
<div class="faq-list" role="list">
  <div class="faq-item" role="listitem">
    <button class="faq-trigger" aria-expanded="false" aria-controls="faq1-answer">
      Question text
      <svg class="faq-icon">...</svg>  <!-- chevron down -->
    </button>
    <div class="faq-answer" id="faq1-answer" hidden>
      <p>Answer text</p>
    </div>
  </div>
</div>
```
FAQ JS is in `playbook.js` — copy or link to the same file.

---

## Header / Nav (copy exactly — uses shared CSS classes)

```html
<header class="site-header" role="banner">
  <div class="container header-inner">
    <a href="../index.html" class="logo" aria-label="Scoob and I homepage">
      <!-- SVG dog logo — copy from any existing page -->
      <span class="logo-text">Scoob <em>&amp;</em> I</span>
    </a>

    <nav class="nav-links" role="navigation" aria-label="Main navigation">
      <a href="../index.html" class="nav-link">Home</a>
      <a href="https://digitaldogschool.com/" class="nav-link" target="_blank" rel="noopener">Digital Dog School</a>
      <a href="../the-playbook/index.html" class="nav-link">The Playbook</a>
      <a href="/consult" class="nav-link" aria-current="page">Book a Call</a>
    </nav>

    <div class="header-actions">
      <a href="#cta" class="btn btn-primary btn-sm">Reserve My Spot</a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>

  <nav class="mobile-nav" id="mobile-nav" role="navigation" aria-label="Mobile navigation">
    <a href="../index.html" class="mobile-nav-link">Home</a>
    <a href="https://digitaldogschool.com/" class="mobile-nav-link" target="_blank" rel="noopener">Digital Dog School</a>
    <a href="../the-playbook/index.html" class="mobile-nav-link">The Playbook</a>
    <a href="/consult" class="mobile-nav-link">Book a Call</a>
    <a href="#cta" class="mobile-nav-link mobile-nav-cta">Reserve My Spot</a>
  </nav>
</header>
```

Nav JS is in `playbook.js` (handles hamburger toggle) — copy or link to same file.

---

## Footer (copy exactly)

```html
<footer class="site-footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <a href="../index.html" class="logo" aria-label="Scoob and I homepage">
        <!-- SVG logo -->
        <span class="logo-text">Scoob <em>&amp;</em> I</span>
      </a>
      <p class="footer-tagline">Honest coaching for difficult dogs.</p>
    </div>
    <nav class="footer-nav" aria-label="Footer navigation">
      <a href="../index.html">Home</a>
      <a href="../the-playbook/index.html">The Playbook</a>
      <a href="https://digitaldogschool.com/" target="_blank" rel="noopener">Digital Dog School</a>
      <a href="/consult">Book a Call</a>
    </nav>
    <p class="footer-legal">&copy; 2026 Scoob &amp; I Dog Training. All rights reserved.</p>
  </div>
</footer>
```

---

## Meta Pixels (include on every page)

```html
<!-- Scoob & I -->
<script>
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '961888533447407');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=961888533447407&ev=PageView&noscript=1" /></noscript>

<!-- Digital Dog School -->
<script>
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '2113401182770587');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=2113401182770587&ev=PageView&noscript=1" /></noscript>
```

---

## External Services

| Service | Value |
|---|---|
| GHL Webhook | `https://services.leadconnectorhq.com/hooks/ILH4tVyH5NKhdoMewJqZ/webhook-trigger/YwsHepg0mFYjhz4LrFYS` |
| Playbook checkout | `https://checkout.digitaldogschool.com/jointheplaybook` |
| Meta Pixel — Scoob & I | `961888533447407` |
| Meta Pixel — Digital Dog School | `2113401182770587` |
| Image CDN base | `https://assets.cdn.filesafe.space/ILH4tVyH5NKhdoMewJqZ/media/` |

---

## Key Asset URLs

| Asset | URL |
|---|---|
| Joel hero (Playbook) | `.../6712d5be5f0d87d326b33543.jpeg` |
| Joel hero (Homepage) | `.../682297cfa20a2ac49d386a9b.jpeg` |
| Playbook review 1 | `.../6740e3af7776d52fef8fbad1.png` |
| Playbook review 2 | `.../668b05994a1876e04d2087cb.png` |
| Homepage review 1 | `.../698d243452c95231811df8c9.webp` |
| Homepage review 2 | `.../65a4713b28a68b20d7b2fd92.png` |
| Training GIF | `.../1513f696-b9cc-4a3f-941e-d003b11f8ffc.gif` |
| Founder photo | `.../65565c8df63b4d5e61f1bbb5.jpeg` |
| Bonus image 1 | `.../6936c987134cf440612025ec.png` |
| Bonus image 2 | `.../6936c987a54cc334b64e8b5c.png` |
| Bonus image 3 | `.../6936c9870bae9169533d1b27.png` |
| Bonus image 4 | `.../6936c988134cf4ec5a2025f0.png` |
| Bonus image 5 | `.../6936c987a54cc3e1e04e8b5b.png` |
| Bonus image 6 | `.../6936c98781eaa1f7e434a021.png` |

CDN base: `https://assets.cdn.filesafe.space/ILH4tVyH5NKhdoMewJqZ/media/`

---

## Tone & Copy Rules

- Dark, grounded, honest — not hype, not corporate
- No exclamation points
- Second person ("you / your dog"), direct address
- "live class" / "8-week live class" — never "cohort"
- Review ask: "Once you've gotten real value from the class, we'd love an honest review of your experience." — never "5-star review"
- GHL webhook forms for lead capture (not native HTML forms)

---

## Page CSS Template

Start every new page CSS file with this comment block, then add page-specific rules:

```css
/* =============================================================
   [PAGE NAME] — Page-Specific Styles
   Extends ../style.css (shared tokens, base, components)
============================================================= */
```

Section padding pattern:
```css
.pb-section {
  padding-block: clamp(var(--space-20), 10vw, var(--space-32));
  background: var(--color-bg); /* or var(--color-surface) for alternating */
}
```

---

## Deployed Site

- **Permanent URL:** https://www.perplexity.ai/computer/a/scoobandi-B4uE1S8iTzuZ_Lk8M5jlSA
- **Asset ID:** `078b84d5-2f22-4f3b-99fc-b93c3398e548`
- **Always deploy** the full `scoobandi/` folder, entry point `index.html`
