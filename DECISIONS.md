# EvE Waste — Open Decisions

Running list of everything the site build could not settle on its own. Updated at
the end of each phase. Resolved items move to the log at the bottom rather than
being deleted, so the reasoning stays findable.

Last updated: 2026-09-03, after the decisions round.

---

## Still open — content

### 4. Waste Hauling Monitor Prototype — description and photograph
Nothing in the Drive export is identifiably this device. The card on
`use-cases.html` renders a heading and an empty photo frame.
**Needed:** a photo (installed, plus its data output on a screen) and a description.

### 5. AD System Prototype — written description
The photograph is live; the prose is not. The card shows a heading and image only.

### 6. How a pilot works — every field
Site count, duration, data collected, success criteria, and what the host site
receives are all undefined. The section renders a heading, "We will scope this with
you," and a CTA.

### 7. "What is anaerobic digestion?" FAQ answer
Deliberately omitted rather than written on the founders' behalf. The FAQPage
JSON-LD contains only the one question that actually renders.

### 16. Three prototype photos staged but unplaced
`images/_candidates/` holds `ad-system-loading.jpg`, `ad-system-transport.jpg`,
`build-night-team.jpg`. Not committed — unplaced images are the "dead repo weight"
this project already cleaned out once.
**Needed:** a placement for each, or a decision to drop them.

### 27. `assets/favicon.svg` is stale and unreferenced
It is the old hand-drawn leaf, and no page links to it. Every other icon is now
derived from the real lockup by `tools/build-brand.mjs`, but that script cannot
produce an SVG from a raster source.
**Needed:** either supply the logo as vector artwork so favicon.svg can be
regenerated to match, or delete the file. Harmless as-is, just inconsistent.

---

## Still open — verification that needs a real browser

Not doable in the build environment. These are yours to run.

### 19. Keyboard walk-through of all six pages
A skip link, a `:focus-visible` ring for light and dark surfaces, and
`type="button"` on the menu toggle are in place, and the overlay's focus trap was
reviewed by hand. Not yet walked with an actual Tab key.
**How:** load each page, press Tab from the top. First stop should be "Skip to
content". Every link and button must be reachable, in visual order, with a ring
you can see. Open the menu and confirm Tab cycles inside it and Escape closes it.

### 20. axe DevTools on each page
Static audit done and everything it surfaced is fixed. A real run is still needed
to close out "zero violations at serious or critical."
**How:** install the axe DevTools browser extension, open each page, Scan.

### 21. Responsive walk at 375 / 768 / 1440
Needed for the three new photo layouts specifically: the hero, the prototype card
on `use-cases.html`, and the three-up team grid.
**How:** DevTools device toolbar at each width. Watch for the hero headline
colliding with the CTAs at 375, and the team grid at 768.

### 22. Lighthouse mobile on all six pages
Targets: performance ≥ 90, accessibility ≥ 95, best practices ≥ 95, SEO 100.
**How:** DevTools → Lighthouse → Mobile → Analyze. Run against the deployed URL,
not `file://` — several checks need real headers.

### 26. Domain and TLS
`evewaste.com` must resolve over HTTPS with a valid certificate.

---

## 23. Analytics — how to add it

Nothing is measuring the site right now. No provider was chosen, and shipping a
snippet with a placeholder token would just break silently.

**Recommendation: Cloudflare Web Analytics.** Free, cookieless, no consent banner,
and you are already on Cloudflare Pages. Two steps:

**1. Turn it on.** Cloudflare dashboard → Web Analytics → Add a site → pick the
Pages project. Cloudflare gives you a token and can auto-inject the beacon, so
there is no snippet to paste. If you prefer to paste it yourself, it looks like:

```html
<script defer src="https://static.cloudflareinsights.com/beacon.min.js"
        data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

**2. Open the CSP for it, or it will be blocked.** In `_headers`, add the origin
to `script-src` and `connect-src`:

```
script-src 'self' 'sha256-/x7W7R75k8Roq0WaVRQX9blP4OufE5xbAdzklGxsgpw=' https://static.cloudflareinsights.com;
connect-src 'self' https://api.web3forms.com https://script.google.com https://script.googleusercontent.com https://cloudflareinsights.com;
```

Deploy, load the site, and check the browser console. A CSP violation there means
an origin is still missing — the message names it.

**If you pick Google Analytics instead:** it sets cookies, so you need a consent
banner for EU visitors, and the CSP needs `https://www.googletagmanager.com` in
`script-src` plus `https://*.google-analytics.com` in `connect-src`. Plausible and
Fathom are cookieless like Cloudflare's, but both are paid.

The rule for any provider: **allowlist the origin in `_headers` in the same commit
as the snippet.** The CSP has no `'unsafe-inline'`, so anything unlisted fails with
nothing but a console error.

---

## Resolved

| # | Decision | Outcome |
|---|---|---|
| 1 | Brenden's title | **Founder & Chief Operating Officer.** Rendered on the team page; the NEEDS INPUT comment is gone. |
| 2 | Kyla's title | **Founder & Chief Information Officer.** Note the media kit still says "Co-founder and Lead Software Developer" — update the kit so the two agree. |
| 3 | WCAG colour corrections vs. brand guide | **Keep the corrections.** The six overrides in `css/styles.css` stand; `theme.css` still records the guide values. |
| 8 | Feedstock refusal list | **Removed permanently.** Not a pending item any more — no refusal list is published, and none gets added without a source. |
| 9 | Kyla's company email | **`kylakayf@gmail.com` for now.** Swap it when `kyla@evewaste.com` exists — one line in `team.html`. |
| 10 | Team headshot backgrounds don't match | **Accepted as-is.** |
| 11 | Brenden's headshot appears AI-processed | **Disregarded**, published as supplied. |
| 12 | Brenden's headshot is low resolution | **Disregarded.** 765×1024 source, slightly upscaled on retina. |
| 13 | `Eve Background Photo.jpg` | **Rejected.** A real photograph is used instead. |
| 14 | Real logo | **Used site-wide.** Header and footer lockup, favicon, touch icon, `.ico`, JSON-LD logo, and all six OG cards now derive from `images/source/brand/eve-logo.png` via `tools/build-brand.mjs`. |
| 15 | Home hero | **Real photograph.** The reactor smoke test, art-directed 16:9 on desktop and 3:4 on handsets, with a scrim that holds the white headline at 5.66:1. |
| 17 | HEIC originals | **Disregarded.** |
| 18 | `Bennett Dial Headshot.jpeg` | **Disregarded.** Not on the site. |
| 24 | Newsletter | **Works.** Confirmed. |
| 25 | Contact form | **Works.** Confirmed. |
| 28 | HSTS was set to one year | **Fixed.** Now `max-age=86400`, no `includeSubDomains`, no `preload`, with the ramp-up steps written into `_headers`. |
| 29 | CSS/JS could not be cached hard | **Fixed.** `tools/stamp-assets.mjs` appends a content hash to every css/js reference (`styles.css?v=d2a939e5`), so the URL changes only when the bytes do. `/css/*` and `/js/*` are now `immutable` for a year. **Run `npm run stamp` after any css/js edit** — `npm run build` does it for you. |
| — | "CSP will silently block anything new" | Removed as a decision; it is documented at the top of `_headers` and under item 23 instead. |
