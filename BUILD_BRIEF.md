# EvE Waste — Site Build Brief
**Rev 2026-09-03 · Hard deadline: live before Climate Week NYC, Sep 20 2026 (17 days).**

Repo root: `C:\Users\kylak\eve_waste\eve_waste` (note the nested folder — the git repo
is the inner one). Remote: `github.com/kylafallis/eve_waste`.

Stack: static HTML/CSS/JS, no build step. Six pages: `index`, `about`, `platform`,
`team`, `use-cases`, `contact`. Design tokens already live in `css/theme.css` and are
good — **do not restructure that file**, only make the specific edits named below.

---

## Ground rules

1. **`CONTENT.md` is the only source of copy.** Never invent a number, a customer,
   a testimonial, a specification, a date, or a quote. Where `CONTENT.md` says
   `NEEDS INPUT`, apply the stated fallback and leave `<!-- NEEDS INPUT: ... -->`.
2. **One phase per commit.** After each phase: report what changed, what you could
   not complete and why, then stop for review.
3. **Never delete a file without saying so first.**
4. Preserve existing accessibility work (`aria-*`, focus handling in `js/main.js`).
5. Do not add a JS framework, a bundler, npm dependencies for the site itself, or a
   CSS framework. The only tooling addition is a local image script (Phase 4).

---

## Current state — audit findings

| # | Finding | Severity |
|---|---|---|
| 1 | Live `Lorem ipsum` on `index`, `about`, `contact` (24+ instances) | **Blocker** |
| 2 | Hero stats read `XX%` / "Lorem ipsum recovery rate" | **Blocker** |
| 3 | Contact page publishes a **Canadian** placeholder address | **Blocker** |
| 4 | Contact form is fake — `js/contact.js` runs a `setTimeout` and shows success. **Nothing is ever sent.** Any lead submitted so far is lost. | **Blocker** |
| 5 | Three non-existent emails published (hello@, engineering@, careers@) | **Blocker** |
| 6 | `Inter` loaded across the full 300–900 range plus italics — the single most recognizable "AI-built site" signal, and a heavy font payload | High |
| 7 | Zero JSON-LD, zero Open Graph tags on all six pages | High |
| 8 | `assets/` is empty but `index.html` links `assets/favicon.ico` → 404 on every page | Medium |
| 9 | `images/` holds 9 AI-generated PNGs totalling **~35 MB**, referenced by nothing. Dead repo weight. | Medium |
| 10 | No `sitemap.xml`, `robots.txt`, `llms.txt`, or 404 page | Medium |
| 11 | `.fade-up` reveal classes — verify content is not parked at `opacity: 0` awaiting an observer | Medium |

---

## PHASE 0 — Truth pass
*Goal: nothing false or placeholder remains. Do this before anything else.*

- [ ] Remove every `Lorem ipsum` string across all six pages. Where `CONTENT.md`
      supplies replacement copy, use it. Where it does not, **delete the element**
      rather than leaving filler.
- [ ] Replace the three home-page `XX%` stats per `CONTENT.md` §1, including the
      required basis labels (`Historical` / `Modeled` / `Industry data`).
- [ ] Delete `hello@`, `engineering@`, `careers@` mailto links from `contact.html`.
- [ ] Delete the `<address>` block containing `Canada` and the bracketed
      placeholders. Replace with `Columbus, Ohio`.
- [ ] Change the form success copy and the response-time promise to match
      `CONTENT.md` §6 (one week, not 1–2 business days).
- [ ] Add a visible `NEEDS INPUT` HTML comment anywhere content is still missing.
- [ ] Commit: `phase 0: remove placeholder content and unsubstantiated claims`

---

## PHASE 1 — Content load
*Goal: every page says what `CONTENT.md` says.*

- [ ] `index.html` — H1 → "Putting food waste back to work." Sub-headline, eyebrow,
      CTAs, four pillars, closing CTA per `CONTENT.md` §1.
- [ ] `about.html` — founding story verbatim; **three** value cards, not four.
- [ ] `team.html` — Ben and Brenden per §3. Use the initials-monogram fallback for
      headshots at the final photo aspect ratio so nothing shifts later.
- [ ] `platform.html` — H1, explainer, FAQ. **Build no spec table.** Render the
      "Full specifications ... available on request under NDA" block with a
      `Request specifications` button instead.
- [ ] `use-cases.html` — retitle to **"How a pilot works"**, update the nav label and
      `<title>` on every page. Rebuild as §5: pilot explainer + the two real
      prototypes. Delete any invented customer names, logos, quotes or results.
- [ ] `contact.html` — replace the inquiry-type `<select>` options with exactly the
      four in §6.
- [ ] Update every `<title>` and `<meta name="description">` to be page-specific.
- [ ] Commit: `phase 1: load real content from CONTENT.md`

---

## PHASE 2 — Identity
*Goal: stop looking generated. Typeface change is the highest-leverage edit here.*

### 2.1 Typefaces — Verdana body, Archivo headings

In every page `<head>`, replace the Inter `<link>` with:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&display=swap">
```

In `css/theme.css`, replace the six font-family tokens with:

```css
--font-headline: 'Archivo', Verdana, Geneva, 'DejaVu Sans', sans-serif;
--font-body:     Verdana, Geneva, 'DejaVu Sans', sans-serif;
--font-sans:     Verdana, Geneva, 'DejaVu Sans', sans-serif;
--font-label:    'Archivo', Verdana, Geneva, sans-serif;
--font-serif:    'Archivo', Verdana, Geneva, sans-serif;
--font-mono:     ui-monospace, 'Cascadia Mono', Consolas, monospace;
```

**Verdana runs wide.** It has a larger x-height and wider advance widths than Inter,
so text set at the same size will occupy roughly 5–8% more horizontal space and every
button, card and line length will shift. Compensate in `theme.css`:

```css
--text-body:    0.9375rem;   /* was 1rem */
--text-body-lg: 1.0625rem;   /* was 1.125rem */
--text-sm:      0.8125rem;   /* was 0.875rem */
```

and add to `styles.css`:

```css
body { letter-spacing: -0.005em; }
h1, h2, h3, h4, .type-headline-xl, .type-headline-lg {
  font-family: var(--font-headline);
  letter-spacing: var(--tracking-tight);
}
```

Then **walk all six pages at 375px, 768px and 1440px** and fix anything that wrapped
badly, overflowed a button, or broke a grid. This is the step people skip; it is the
step that decides whether the change reads as deliberate.

### 2.2 Other identity work
- [ ] Footer: legal name `EvE Waste LLC`, `Columbus, Ohio`, © year rendered from a
      build-time literal (not JS), and the four social links from `CONTENT.md` §0.
      Social icons: inline SVG only — no icon font, no third-party script.
- [ ] Remove the `--radius-*` tokens that are all `0px` down to one `--radius: 0px`
      if nothing else references the rest; otherwise leave them. Do not change the
      sharp-corner decision — it is deliberate and it is working.
- [ ] Vary card treatment by role. Right now every card is likely identical padding,
      border and elevation. Lift only the primary CTA card and the stat block;
      leave secondary cards flat.
- [ ] Commit: `phase 2: typeface change to Verdana + Archivo, footer, identity pass`

---

## PHASE 3 — Wire up the things that are currently fake

### 3.1 Contact form → Web3Forms
`js/contact.js` currently simulates a send. Replace the simulation with a real POST.
Keep the existing client-side validation and error classes.

```html
<!-- add inside <form> -->
<input type="hidden" name="access_key" value="7ce5dad0-ba27-4f15-a17e-71395a906e8e">
<input type="hidden" name="subject" value="New evewaste.com enquiry">
<input type="hidden" name="from_name" value="evewaste.com">
<!-- honeypot: bots fill it, humans never see it -->
<input type="checkbox" name="botcheck" class="hidden" style="display:none"
       tabindex="-1" autocomplete="off">
```

```js
const res = await fetch('https://api.web3forms.com/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify(Object.fromEntries(new FormData(form)))
});
const data = await res.json();
if (data.success) { /* show success message */ }
else { /* show a real error state — never a fake success */ }
```

- [ ] The success state must only appear after a `success: true` response.
- [ ] On failure, show an error with a fallback: "Something went wrong. Email us at
      ben@evewaste.com."
- [ ] Support `?inquiry=information` in the URL to preselect the inquiry type (the
      product page's spec-request button links there).

### 3.2 Newsletter → provider embed
The home page `Follow along` button needs a real list. Use the provider Kyla sets up
(see runbook). Implement as a single email input + button posting to the provider's
form endpoint. No third-party JS widget — it costs a render-blocking request and
leaks visitors to another origin.

### 3.3 Missing files
- [ ] `assets/favicon.ico` + `assets/favicon-32.png` + `assets/apple-touch-icon.png`
      generated from the existing EvE leaf SVG in the header markup.
- [ ] `404.html` matching site styling, with links back to home and contact.
- [ ] Commit: `phase 3: real form submission, newsletter, favicon, 404`

---

## PHASE 4 — Rigor

### 4.1 Structured data and discovery
- [ ] `Organization` JSON-LD on every page (name `EvE Waste LLC`, url, logo,
      `areaServed` Columbus OH, `sameAs` the four social URLs). **No `telephone`
      property** — there is no public phone number.
- [ ] `FAQPage` JSON-LD on `platform.html` for the FAQ that actually exists.
- [ ] Open Graph + Twitter card tags on all six pages. Create one 1200×630 OG image
      per page family; do not ship a page without one.
- [ ] `sitemap.xml`, `robots.txt`, and `llms.txt` at the site root.
- [ ] In `robots.txt`, explicitly allow `GPTBot`, `PerplexityBot`, `ClaudeBot`,
      `Google-Extended`. EvE Waste wants to be cited in AI answers; blocking them
      removes the site from those results entirely.

### 4.2 Images
- [ ] **Delete the nine PNGs in `images/`.** They are AI-generated stock
      (`trash_example.png`, `green_earth_example.png`, `environmental_example.png`
      and variants), total ~35 MB, and are referenced by nothing. Confirm with Kyla
      before deleting, then `git rm` them.
- [ ] Add `tools/build-images.mjs` using `sharp` as a **devDependency only** — it
      runs locally and emits static files; the site itself gains no dependency.
      Emit AVIF + WebP at 640 / 1280 / 1920 for every real photograph.
- [ ] Every `<img>` gets explicit `width` and `height`. Hero images:
      `loading="eager" fetchpriority="high"`. Everything else: `loading="lazy"`.

### 4.3 Accessibility and motion
- [ ] Verify `.fade-up` has a **visible resting state**. If it starts at
      `opacity: 0` and depends on an IntersectionObserver, content disappears when
      JS fails and for some screen-reader users. Fix so the base state is visible and
      the animation is a progressive enhancement.
- [ ] Tab through all six pages with no mouse. Every interactive element reachable,
      logical order, visible focus ring. Fix the overlay menu focus trap if broken.
- [ ] Run axe DevTools on each page; resolve everything at serious or critical.
- [ ] Confirm Forest Green `#15342D` on Clay Blue `#DAE1DE` and Seedling Green
      `#4B714F` on white both clear 4.5:1 for body text. Fix any that do not.
- [ ] Commit: `phase 4: structured data, image pipeline, accessibility`

---

## PHASE 5 — Ship
Kyla handles the account setup (see the runbook); this phase is the code side.

- [ ] Add `_headers` for Cloudflare Pages with a sensible CSP, `X-Content-Type-Options`,
      `Referrer-Policy: strict-origin-when-cross-origin`, and long cache lifetimes on
      `/assets/*`, `/css/*`, `/js/*`, `/images/*`.
- [ ] Add the analytics snippet Kyla chooses, in the `<head>` of all six pages.
- [ ] Run Lighthouse on mobile for all six pages. Targets: performance ≥ 90,
      accessibility ≥ 95, best practices ≥ 95, SEO 100.
- [ ] Commit: `phase 5: deployment headers, analytics, launch readiness`

---

## Photography — the highest-impact item on this project

The site currently displays **no photographs at all**, and the only images in the repo
are AI-generated. A waste-technology company with no picture of its technology reads
as pre-product no matter how good the copy is.

Before Sep 20, photograph:
1. The **AD System Prototype** — wide shot, detail shot, and one with a person for scale.
2. The **Waste Hauling Monitor Prototype** — installed, and its data output on a screen.
3. Ben and Brenden — plain background, natural light, same framing for both.

A phone photo of the real prototype beats any stock or generated image on this site.
Nothing in this brief substitutes for it.

---

## Definition of done
- Zero `Lorem ipsum`, zero `XX%`, zero bracketed placeholders in shipped HTML.
- Zero published claims that cannot be sourced; every stat carries a basis label.
- Contact form delivers a real email to ben@evewaste.com and is tested end to end.
- Lighthouse mobile: performance ≥ 90, accessibility ≥ 95, SEO 100 on all six pages.
- Zero axe violations at serious or critical.
- Every page keyboard-operable with a visible focus ring.
- `evewaste.com` resolves over HTTPS with a valid certificate.
