# EvE Waste — Open Decisions

Running list of everything the site build could not settle on its own. Updated at
the end of each phase. Resolved items move to the log at the bottom rather than
being deleted, so the reasoning stays findable.

Last updated: 2026-09-03, after the home/platform/pilot redesign round.

---

## Still open — content

### 4. Waste Hauling Monitor Prototype — description and photograph
Nothing in the Drive export is identifiably this device. The card on
`use-cases.html` renders a heading and an empty photo frame.
**Needed:** a photo (installed, plus its data output on a screen) and a description.

### 5. AD System Prototype — written description
The photograph is live; the prose is not. The card shows a heading and image only.

### 7. "What is anaerobic digestion?" FAQ answer
Deliberately omitted rather than written on the founders' behalf. The Platform FAQ
now runs to seven questions, all answered from copy that already existed in
CONTENT.md; this one still has no source. The FAQPage JSON-LD mirrors exactly what
renders — keep the two in sync if you add more.

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

## 23. Analytics — Umami

Umami is the chosen provider. **The CSP in `_headers` has been opened for Umami
Cloud already** (`https://cloud.umami.is` in `script-src` and `connect-src`, plus
`https://api-gateway.umami.dev` in `connect-src`).

**If you self-host Umami, change those entries to your own instance's origin** or
the script is blocked silently, with only a console error.

The snippet itself is NOT in the pages yet, because it needs your website ID:

```html
<script defer src="https://cloud.umami.is/script.js"
        data-website-id="YOUR-WEBSITE-ID"></script>
```

Paste it just above `</head>` on the six real pages. Then deploy, load the site,
and check the browser console — a CSP violation names any origin still missing.

The rule for any provider: **allowlist the origin in `_headers` in the same commit
as the snippet.** The CSP has no `'unsafe-inline'`.

---

## 30. Privacy policy and terms of service — you probably need one page, not two

**Terms of service: not required.** A marketing site with no accounts, no payments
and no user-generated content has nothing to set terms over. Skip it.

**Privacy policy: yes, add one — and it is a short one.** Two reasons, neither
about Umami's cookie behaviour:

1. **The contact form and newsletter.** These collect a name and an email address
   and send them to Web3Forms and a Google Apps Script. That is personal data
   handled by third-party processors, and it is what actually creates the
   obligation. Even a US-only business gets asked about this in diligence.
2. **Umami itself.** Umami is cookieless and does not collect personal data by
   default, so you do **not** need a cookie consent banner for it. But GDPR
   Article 13 still expects you to say what you collect and why if anyone in the
   EU can reach the site, and a policy is the place to say it.

What the page needs to say, roughly: what the contact form and newsletter collect,
who processes it (Web3Forms, Google, Umami), that analytics are cookieless and
aggregate, how long you keep enquiries, and how to ask for deletion. It is one
page and it is mostly boilerplate — but the specifics above have to be accurate,
so it is a NEEDS INPUT item, not something to generate.

Link it from the footer next to the copyright line once it exists.

---

## 31. Pilot timeline copy is structural only
`use-cases.html` now has a five-stage timeline — site count, duration, data
collected, success criteria, what you receive. Those are the five fields
CONTENT.md §5 lists as undefined. Each panel currently says what the stage covers
and "We will scope this with you." **The structure is real; the values are not
written.** Fill the `<p>` in each panel when the founders decide.

## 32. Home stat panels — copy needs founder review
Hovering a figure on the home page opens a panel explaining what its basis label
means. That copy is derived from CONTENT.md §6b (Claims Review), which was written
as an internal note rather than as public marketing. It is accurate and it is
deliberately modest — the 19% panel says outright that EvE Waste has no clients
yet. **Worth a read-through before launch**; nothing there may become a measured
or client claim until one exists.

## 33. "Why EvE Waste" section — three options offered
The four-box pillar grid is unchanged pending a choice between three
alternatives. See the accompanying message.

---

## Resolved

| # | Decision | Outcome |
|---|---|---|
| 1 | Brenden's title | **Founder & Chief Operating Officer.** Rendered on the team page; the NEEDS INPUT comment is gone. |
| 2 | Kyla's title | **Founder & Chief Information Officer.** Note the media kit still says "Co-founder and Lead Software Developer" — update the kit so the two agree. |
| 3 | WCAG colour corrections vs. brand guide | **Keep the corrections.** The six overrides in `css/styles.css` stand; `theme.css` still records the guide values. |
| 8 | Feedstock refusal list | **Removed permanently.** Not a pending item any more — no refusal list is published, and none gets added without a source. |
| 9 | Kyla's company email | **`kylaevewaste@outlook.com`.** Set 2026-09-03. Not an @evewaste.com address — swap it if a company mailbox is ever created. |
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
| — | Menu had no way out and no Home link | **Fixed.** `.site-header` is `position:fixed` with a `z-index`, which makes it its own stacking context — the close X and the logo were painted *under* the open overlay, invisible and unclickable, with Escape the only way out. The header is now lifted above the overlay while the menu is open. Home and Contact were added to the menu; About was removed. |
| — | About page | **Retired.** Founding story → `platform.html#why`, values → `platform.html#values`. `about.html` is now a noindex stub with a canonical to Platform, and `_redirects` 301s the old URL. Removed from the menu, the footer, the sitemap and llms.txt. **The stub file can be deleted once nothing links to it — say the word.** |
| — | Product specifications on Platform | **Removed as a section.** The "available under NDA" copy survives as an FAQ answer and as the hover panel on the AD prototype photo, so nothing was lost. Platform now leads on market opportunity, why we build, values, and the FAQ. |
| — | Platform FAQ was one question | **Now seven.** Every added answer is copy that already existed in CONTENT.md — feedstock, cost vs landfill, data output, specifications, location, response time. None was written on the founders' behalf. "What is anaerobic digestion?" is still omitted. |
| — | Kyla's bio and email | **Rewritten** to lead on research and software, with FairGame in one clause and no NASA or UN. All facts still come from her own media kit. Email is now kylaevewaste@outlook.com. |
