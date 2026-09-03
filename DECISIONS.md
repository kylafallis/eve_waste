# EvE Waste — Open Decisions

Running list of everything the site build could not settle on its own. Updated at
the end of each phase. Nothing here is blocking a deploy unless marked **BLOCKER**.

Last updated: end of Phase 5 (2026-09-03).

---

## BLOCKER — must be resolved before launch

### 1. Brenden's public title
Three sources disagree: the intake sheet says "Founder / COO" and "COO [Founder]";
his supplied bio says "Founder and Chief Science Officer."
**Currently rendered:** `Founder` only, per CONTENT.md's stated fallback.
**Needed:** one title, from Brenden.

### 2. Kyla's public title
Her media kit (Bio Suite v1.0, Aug 2026) says "Co-founder and Lead Software
Developer, EvE Waste." Her instruction on 2026-09-03 was "add me as CIO."
**Currently rendered:** `Co-founder & Chief Information Officer`.
**Needed:** confirm which is public, and update the media kit or the site so they agree.

### 3. WCAG colour corrections vs. the brand guide
Six brand-palette pairs failed WCAG AA and are overridden in `css/styles.css`
(theme.css untouched, deviation documented inline). Worst offenders were the stat
basis labels at 1.76:1 and the contact form field border at 1.3:1.

| Token | Guide value | Rendered | Why |
|---|---|---|---|
| `--bio-moss` | `#65976A` | `#3B5C40` | 2.55:1 on Clay Blue |
| `--primary` / `--secondary` | `#4B714F` | `#446849` | 4.19:1 on Clay Blue |
| `--outline` (label text) | `#C9C2BC` | `#5F5A55` | 1.76:1 on white |
| `--inverse-primary` / `--primary-fixed-dim` | `#65976A` | `#6EA574` | 3.96:1 on Forest Green |

**Needed:** Brenden's sign-off, or a revised brand guide. Reverting these
re-introduces axe violations at serious level.

---

## Content still missing

### 4. Waste Hauling Monitor Prototype — description and photograph
Nothing in the Drive export is identifiably this device. The card on
`use-cases.html` has a heading and an empty photo frame.
**Needed:** a photo (installed, plus its data output on a screen) and a description.

### 5. AD System Prototype — written description
The photograph is live; the prose is not. Card currently shows a heading and image only.

### 6. How a pilot works — every field
Site count, duration, data collected, success criteria, and what the host site
receives are all undefined. The section renders a heading, "We will scope this with
you," and a CTA.

### 7. "What is anaerobic digestion?" FAQ answer
Deliberately omitted rather than written on the founders' behalf. The FAQPage
JSON-LD contains only the one question that actually renders.

### 8. Feedstock refusal list
The intake sheet says "Manure?" with a question mark. Omitted entirely. No yield
figures (biogas or CH₄) are published anywhere until real numbers exist.

### 9. Kyla's company email
No `@evewaste.com` address supplied. Ben and Brenden both have one on the team
page; Kyla's card has none. The media kit lists only a personal address, which does
not belong on the company site.
**Needed:** create `kyla@evewaste.com` or confirm the card stays without one.

---

## Photography and brand

### 10. Team headshot backgrounds do not match
Ben is a cut-out composited onto Forest Green, Brenden is on a grey studio
gradient, Kyla is in front of the NASA seal and a US flag. All three are real and
all three are cropped to the same 3:4, but they read as three different shoots.
**Options:** accept it, re-shoot all three on one plain background (the original
brief asked for this), or apply a unifying treatment.

### 11. Brenden's headshot appears to be AI-processed
There is a four-point sparkle glyph in the bottom-right corner — the same marker
that appears on `Eve Background Photo.jpg`. Given this project deleted nine
AI-generated PNGs on exactly that basis, publishing an AI-retouched headshot of a
founder is worth a deliberate decision rather than an accident.
**Needed:** confirm it is acceptable, or supply an unprocessed original.

### 12. Brenden's headshot is low resolution
Source is 765×1024. The card renders up to 880×1173 on a retina display, so it is
being upscaled slightly. Ben (1350×1165) and Kyla (3818×5727) are fine.

### 13. `Eve Background Photo.jpg` — recommend rejecting
Carries the same AI sparkle marker and is an illustration, not a photograph. Not
used anywhere. Consistent with deleting the other nine AI images.

### 14. Real logo supplied but not yet used in the page chrome
`images/source/brand/eve-logo.png` is the real lockup — cream `#FBE6AC` leaf plus
wordmark, 1740×574, transparent, built for dark backgrounds. The site header still
draws a hand-built inline SVG leaf plus the text "EvE".
**Needed:** decide whether to swap the header, footer, favicon and OG cards to the
real lockup. Recommended — it is the actual brand mark.

### 15. Home hero is still a black gradient
No photograph. The strongest remaining visual win on the site. Candidates staged
locally in `images/_candidates/`: unit loading via funnel, unit loaded on a truck,
team on build night.
**Needed:** pick one, or decide the gradient stays.

### 16. Three more prototype photos staged but unplaced
`images/_candidates/` holds `ad-system-loading.jpg`, `ad-system-transport.jpg`,
`build-night-team.jpg`. Not committed — unplaced images are the "dead repo weight"
this project already cleaned out once.
**Needed:** a placement for each, or a decision to drop them.

### 17. HEIC originals cannot be processed on another machine
26 of the 42 Drive photos are HEIC. `sharp` cannot decode them — its bundled
libheif has no HEVC decoder. They were converted locally with `ffmpeg`, which will
not be present in CI or on a teammate's laptop.
**Needed:** re-export the keepers from Drive as JPEG.

### 18. `Bennett Dial Headshot.jpeg`
A third person's headshot is in the Drive export. Not in CONTENT.md, not on the
site. **Needed:** confirm whether this person belongs on the team page.

---

## Verification that still needs a real browser

These could not be done in the build environment — there is no browser available.

### 19. Keyboard walk-through of all six pages
A skip link, a `:focus-visible` ring for light and dark surfaces, and
`type="button"` on the menu toggle are all in place, and the overlay's focus trap
was reviewed by hand. Not yet walked with an actual Tab key.

### 20. axe DevTools on each page
Static audit done and everything it surfaced is fixed. A real axe run is still
required to close out the brief's "zero violations at serious or critical."

### 21. Responsive walk at 375 / 768 / 1440
Needed for the two new photo layouts specifically: the prototype card on
`use-cases.html` and the three-up team grid, which went from two columns to three.

### 22. Lighthouse mobile on all six pages
Targets: performance ≥ 90, accessibility ≥ 95, best practices ≥ 95, SEO 100.

---

## Deployment (Phase 5)

### 23. Analytics provider — **not installed**
No provider chosen, so no snippet was added. Nothing is measuring the site right now.
**When you pick one:** add the snippet to the `<head>` of all six pages *and*
extend the CSP in `_headers` — `script-src` for the script origin, `connect-src`
for wherever it beacons to. Until both are done it will be blocked silently.
A self-hosted or cookieless provider (Plausible, Fathom, Cloudflare Web Analytics)
avoids a cookie banner; Google Analytics does not.

### 27. CSP will silently block anything new
The policy is allowlist-only, with no `'unsafe-inline'` and no `'unsafe-eval'`.
That is the right posture, but it means any future embed, widget, font, or
analytics tag fails with nothing but a console error. `_headers` documents this at
the top. If a new inline `<script>` is ever added it needs its own sha256 hash.

### 28. `Strict-Transport-Security` is set to one year
`max-age=31536000; includeSubDomains`. Once a browser sees this it will refuse
plain HTTP for evewaste.com and every subdomain for a year. Make sure every
subdomain you intend to use can serve HTTPS before this goes live. No `preload`
directive was added — that is much harder to reverse.

### 29. CSS and JS are deliberately not cached `immutable`
This site has no build step, so `styles.css` keeps its filename forever. Marking it
immutable would strand returning visitors on a stale stylesheet for a year.
They are set to `max-age=3600, stale-while-revalidate=86400` instead. Images and
`/assets/*` carry their size in the filename and are cached hard for a year.
**If filename fingerprinting is ever added, move css/js to immutable.**

### 24. Newsletter provider endpoint
Wired in Phase 3. Confirm the list is live and a signup actually lands.

### 25. Contact form end-to-end test
Web3Forms is wired and the success state only shows on `success: true`. Needs one
real submission confirmed as delivered to ben@evewaste.com.

### 26. Domain and TLS
`evewaste.com` must resolve over HTTPS with a valid certificate.
