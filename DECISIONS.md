# EvE Waste — Open Decisions

Running list of everything the site build could not settle on its own. Updated at
the end of each phase. Resolved items move to the log at the bottom rather than
being deleted, so the reasoning stays findable.

Last updated: 2026-09-14, after the stage-honesty pass (pre-seed positioning,
investors page, copy corrected to development stage).

---

## Still open — content

### 4. Waste Hauling Monitor Prototype — description and photograph
Nothing in the Drive export is identifiably this device. The card on
`use-cases.html` renders a heading and an empty photo frame.
**Needed:** a photo (installed, plus its data output on a screen) and a description.

### 5. AD System Prototype — written description
The photograph is live; the prose is not. The card shows a heading and image only.

### 16. Prototype photos staged but unplaced
`images/_candidates/` holds `ad-system-transport.jpg`, `build-night-team.jpg` and,
since 2026-10-17, the retired hero source `reactor-smoke-test.jpg`. Not committed —
unplaced images are the "dead repo weight" this project already cleaned out once.
(`ad-system-loading.jpg` was placed as the home hero.) The build-night photo shows
five people, only three of them founders: the other two would need to agree before
it is used anywhere.
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

---

---

## 32. Home stat panels — copy needs founder review
Hovering a figure on the home page opens a panel explaining what its basis label
means. That copy is derived from CONTENT.md §6b (Claims Review), which was written
as an internal note rather than as public marketing. It is accurate and it is
deliberately modest — the 19% panel says outright that EvE Waste has no clients
yet. **Worth a read-through before launch**; nothing there may become a measured
or client claim until one exists.

## 34. Two thresholds in the pilot success criteria — Brenden
Criterion 1 publishes **95%** telemetry completeness. Criterion 2 currently says the
accuracy tolerance is "stated in the pilot agreement" rather than naming a number,
because the prototype has not produced enough ground truth to state one. Both are
marked NEEDS INPUT in `use-cases.html`. Everything else in that list is a process
commitment, not a performance claim.

## 35. Phase 1 pricing — Ben
Free, subsidised or paid. The page carries **no pricing statement at all**, which is
deliberate: a hedge invites the question, silence lets the conversation start. Do not
add "contact us for pricing".

## 36. Three privacy facts still open
1. **Umami Cloud or self-hosted?** The CSP and the policy both currently assume
   Cloud. If self-hosted, swap the origin in `_headers` and replace one sentence in
   `privacy.html` with "we run Umami on our own infrastructure" — a stronger claim.
2. **A dedicated privacy mailbox.** The policy routes rights requests through the
   contact form, which is consistent with CONTENT.md's "no public email" rule. A
   `privacy@evewaste.com` address would be better practice.
3. **What unsubscribing does to the Google Sheet row** — delete it, or flag it. The
   current sentence is true either way, but if rows are only flagged, say so.

Resolved in the repo, for the record: **no CAPTCHA** is enabled on the contact form
(honeypot only), so the "no cookies at all" claim holds; and the newsletter writes to
a **Google Sheet via an Apps Script web app**, not a Google Form.

## 37. The 19% figure needs a source, not just a label
`CONTENT.md` carries **19% — "new economic value our process generates versus
landfilling", basis: Modeled** (§1 stats table, Pillar 2, and §6b). It renders on the
home page and in the Platform FAQ.

Tracing it: §6b shows it was the *resolution of a conflict* — the intake sheet
supplied "+20% average waste management cost reduction for our clients", which was
rejected because EvE has no clients, and 19% was kept from Pillar 2 instead. So the
number's provenance inside the repo is the founders' intake sheet, and **no model
document behind it has been identified.** "Modeled" is a basis label without a model
attached.

That is the one place on the site where the basis rule is satisfied in form but not
in substance. **Needed:** the calculation, or a decision to pull the figure.
It appears in `index.html` (stat block 2), `platform.html` (FAQ "How does the cost
compare with a landfill?" and the market card) and `llms.txt`.

---

## 38. The pilot page is temporarily switched off
`use-cases.html` is disabled at Kyla's request so the team can confirm its details
and data before any of it is public. The content is intact; the page is turned off
by routing, not deletion:
* `noindex, nofollow` plus a meta refresh to `404.html` in its head
* a `/use-cases.html -> /404.html 404` rule in `_redirects`
* removed from the menu, the footers and `sitemap.xml`

**To bring it back**, the four steps are written in a comment at the top of the
file. Nothing else needs touching.

## 39. Values and the comparison block: alternatives on the shelf
Two sections were redesigned without a formal choice being offered, so the
alternatives are recorded here rather than lost:
* **Comparison (home).** Now two stacked lists with cross/check marks. The other
  candidates were a single-line-per-row two-column strip, and keeping a table but
  cutting it to four rows. The marks version was chosen because it is the format
  people actually scan.
* **Values (platform).** Now full-width bands with an outlined numeral. The other
  candidates were an offset/staggered stack and a single sentence per value with no
  headings at all.

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
| 15 | Home hero | **Real photograph, replaced 2026-10-17.** The reactor smoke test read as a dark grey blur when cropped wide. Now the loading photo (two of the team in suits feeding the prototype), shown whole and uncropped in a 3:4 frame on the right, lightly tinted Sprout Green and faded into the Digestate Green ground; the headline sits on solid green beside it. Stacks under the copy on phones. Source in `images/source/hero/`, built uncropped at 640/960/1440 by `tools/build-images.mjs`. |
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
| — | Pilot timeline values | **Resolved by research, not by asking.** Reframed as Phase 1: a 90-day monitoring pilot at 3 sites, per the Workstream II one-sheeter. Five process stages, a published data-category list, six falsifiable success criteria and eight things the host keeps. Two thresholds still open (item 34). |
| — | FAQ beyond seven | **Eighteen now.** Eleven added, sourced to Ohio EPA, OAC, Ohio Dept. of Agriculture, 40 CFR 503 and EPA. `tools/sync-faq.mjs` regenerates the FAQPage schema from the rendered HTML so the two can never drift. |
| — | Landfill vs EvE ledger | **Built**, on the home page. Eight rows, every figure carrying its year in the cell. Midwest tipping average cited rather than national, since the audience is Ohio. The CO₂e figure from the EPA report is deliberately NOT reproduced — that report renders it with a unit error. |
| — | Privacy policy | **Written and live** at `privacy.html`, linked from every footer and in the sitemap. No unfilled brackets. Discloses that Web3Forms' spam filtering (CleanTalk, Akismet) receives submitter IP and email — the most substantive thing in it. Terms of service: not needed. |
| — | Google Fonts | **Removed.** Archivo is self-hosted from `assets/fonts/` as one 34 KB variable file. That deletes two origins from the CSP, a render-blocking third-party request, and the disclosure of every visitor's IP to Google. |
| — | Home "our approach" panel | **Fixed.** The green panel used to open on top of the headline. The headline now steps aside and the panel runs from the edge of the number block to the container edge. |
| — | Landfill vs EvE ledger | **Cut down.** The eight-row table with a row-header column is gone; it is now two stacked lists of one-line claims with cross/check marks, plus the honesty note. |
| — | Platform market opportunity | **Two numbers on a diagonal**, one sentence each. The third card ("Mandates") is gone: it was a word pretending to be a figure. |
| — | Why we build / values layout | **Reworked.** Heading and rule on one side with the prose on the other; values are full-width bands with an outlined numeral rather than three boxes. |
| — | FAQ and What we've built | **Now their own pages** (`faq.html`, `built.html`), both in the menu. `tools/sync-faq.mjs` follows the FAQ to its new home. |
| — | Em-dashes | **Removed site-wide**, 71 of them, each replaced with the punctuation the sentence actually wanted rather than deleted. This matches the vocabulary rule already in CONTENT.md. |
| — | Kyla's bio and email | **Rewritten** to lead on research and software, with FairGame in one clause and no NASA or UN. All facts still come from her own media kit. Email is now kylaevewaste@outlook.com. |
| — | Copy claimed a product that is not built yet | **Corrected site-wide, 2026-09-14.** The company is pre-product: second-stage bio-reactor, waste-tracking model in development, raising pre-seed and applying for grants. Removed every "our clients" (there are none), the AI software described as shipped, the savings "passed to our clients", and the present-tense hero claim. Added a "Where we are" section on the home page (the hero scroll cue now lands on it), a status section on `built.html`, a stage note on `platform.html`, a first FAQ answer, and a Stage block in `llms.txt`. Approach: state the stage plainly once per page, then keep the product copy declarative, rather than hedging every sentence. |
| — | Investors page | **Built** at `investors.html`, in the menu and the footer, and the home hero's primary CTA now points at it instead of offering a pilot (the pilot page is still disabled). Carries the raise, the stage, what the round funds, why now, the basis-label discipline as a diligence argument, and the three founders. **No round size, instrument, valuation, close date, allocation, milestone date or grant name is published** — each is a `NEEDS INPUT` comment in the HTML. The CTA promises a conversation, not a document. |
| — | "Request Demo" and "Request a pilot" | **Retired, 2026-09-14.** Both promised something deployable. The menu CTA is now `Start a conversation` → contact, and the hero's primary is `For investors`. |
| — | Home footer linked the disabled pilot page | **Fixed.** The "Pilot Program" column pointed at `use-cases.html`, which `_redirects` serves as a 404. It is now the same "Our Work" column the other pages carry. |
| — | Boxed card grids | **Replaced with full-bleed bands, 2026-10-17**, chosen from a mocked-up set of two options per section. Home and What We've Built "Where we are" → a full-width stage rail (shared, `styles.css`). Investors stage cards → a Done / Not yet split; use of funds → a Forest Green band with outlined numerals; Why now → two full-bleed number halves. Prototypes → zig-zag photo bands, the missing monitor photo shown as a hatched "Photograph to come" frame. Team → expanding founder panels (`js/team.js`). Partnerships → full-width display-type rows linking to the form. The `--bleed-pad` token in `theme.css` keeps band copy on the container's left line. Not yet converted: the founders row on `investors.html`. Also: the menu overlay now scrolls on short screens. |
| — | Sections already worked on, taken full width | **Done, 2026-10-17**, picked as 1A 2B 3B 4A 5B 6A 7B 8B 9A 10B 11B 12B from widen-or-redesign mockups. Home: approach figures as full-width columns, each opening its provenance panel in place; pillars as four full-screen sticky panels (CSS only; the scroll script is gone); the comparison as a paired two-column table; the newsletter headline spanning the screen over a one-bar form. Platform: the bio-reactor paragraph drawn as a four-step process flow, the diagonal edge to edge, the founder story as a two-column manifesto ending on its closing line, values as three colour stripes. FAQ rows edge to edge. Contact split into a dark facts half and a form half (the one-week reply line moved there). Investors: the opening line at display size, the four basis labels as a strip, founders as name rows linking to `team.html#<founder>`, which opens that panel. Supersedes the shelved alternatives in item 39. |
| — | Contact inquiry types | **Five now.** `Investor or grant inquiry` added, value `investor`, preselected by `investors.html` linking `contact.html?inquiry=investor`. |
