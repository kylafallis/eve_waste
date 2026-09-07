# EvE Waste — Content Deck
**Single source of truth for all site copy. Rev 2026-09-07b.**

> **Page map as of 2026-09-07:** index, platform, built, faq, team, contact, privacy.
> `about.html` is a canonical stub. `use-cases.html` (the pilot) is temporarily
> disabled and routed to 404 while the team confirms its data.
>
> **No em-dashes anywhere on the site.** Use a comma, a colon or a full stop.

> Rule for any agent working on this repo: **never invent a number, a customer, a
> testimonial, a specification, or a date.** If a value below is marked `NEEDS INPUT`,
> use the stated fallback and leave a `<!-- NEEDS INPUT: ... -->` comment in the HTML.

---

## 0. Global

| Field | Value |
|---|---|
| Legal name (footer) | EvE Waste LLC |
| Domain | evewaste.com |
| Location line | Columbus, Ohio |
| Public phone | **None.** Do not publish a phone number. |
| Public email | **None.** Route all contact through the form. This is also the privacy-contact route on `privacy.html`. |
| Form recipient | ben@evewaste.com |
| Response time promise | Within one week |
| Positioning | **Cost first.** Sustainability is the second argument, never the first. |
| Meta description | Revolutionizing food waste management through our bio-reactor. EvE Waste transforms food waste into clean energy and nutrient-rich fertilizer. |

### Team emails (team page only, not footer)
- Ben Rosenthal — ben@evewaste.com
- Brenden Fowler — brenden@evewaste.com
- Kyla Fallis — kylaevewaste@outlook.com 

### Social links (footer)
- LinkedIn — https://www.linkedin.com/company/108059157
- Facebook — https://www.facebook.com/EvEWasteSolutions/
- X — https://x.com/EvEWaste1
- Instagram — https://www.instagram.com/evewaste

### Vocabulary rules (apply everywhere)
- "Trash" = what goes to the landfill. "Waste" = extra material that still has value.
- Say "bio-reactor," not "digester unit" or "the platform."
- Say "the process of anaerobic digestion," not "AD" on first use.
- "Waste goes in, products come out."
- Delete every hedge: *may help, can potentially, is designed to, aims to.*
- No em-dash-heavy AI cadence. Short declarative sentences.

---

## 1. Home (`index.html`)

**H1 (hero headline)**
> Putting food waste back to work.

**Sub-headline**
> EvE Waste is revolutionizing the waste management industry by transforming food waste into clean energy and nutrient-rich fertilizer.

**Hero eyebrow**
> Modular bio-reactors · Columbus, Ohio

**Hero CTAs**
- Primary: `Request a pilot` → contact.html
- Secondary: `How it works` → platform.html

### Proof stats — READ THE WARNING

Replace the three `XX%` / Lorem ipsum stats with the following. **Every stat must
carry a basis label** so no claim reads as measured customer data. See §6 for why.

| # | Value | Unit | Label | Basis label (required, rendered) |
|---|---|---|---|---|
| 1 | 5,000+ | years | Without an economical change in how we process waste | Historical |
| 2 | 19% | — | New economic value our process generates versus landfilling | Modeled |
| 3 | 15% | — | Average annual increase in landfill tipping and hauling rates | Industry data |

Render the basis label as a small caps line beneath each stat, e.g. `MODELED`.

### Four pillars

**Pillar 1** — icon `pillar-revenue.svg`
> **Transforming food waste for cost, value, and impact**
> Our bio-reactor processes food waste more affordably than a landfill and derives more value from it. Through the process of anaerobic digestion, our system transforms food waste into clean energy and fertilizer.

**Pillar 2** — icon `pillar-modularity.svg`
> **Managing waste for less than a landfill charges**
> Our process generates up to 19% in new economic value compared to landfilling. That is enough for us to pass the savings to our clients.

**Pillar 3** — icon `pillar-engineering.svg`
> **First-of-its-kind waste tracking data**
> Our bio-reactor contains AI waste tracking software that produces waste reports. Clients use them to find additional savings upstream and to comply with organic waste mandates.

**Pillar 4** — icon `pillar-loop.svg`
> **Doing it all while protecting the Earth**
> Our systems put economics first and the Earth second. We retain nutrients for the next crop of food, and we create clean energy doing it.

### Closing CTA
> **Do you believe in a cleaner future?**
> Join us on the journey.
> Button: `Follow along` → newsletter signup (see BUILD_BRIEF Phase 3)

---

## 2. Why We Build (now on `platform.html`)

> **The About page was retired 2026-09-03.** The founding story lives at
> `platform.html#why` and the three values at `platform.html#values`.
> `about.html` is kept as a canonical redirect stub — **deliberately not noindex**,
> because noindex asks engines to drop the URL while the canonical asks them to
> consolidate it, and consolidation is what we want. `_redirects` 301s the old URL.


**Founding story** (use verbatim — this is founder voice, do not rewrite):

> Most people don't think much of trash. It is just something that kind of happens and is thrown out. Buried, never to be seen again. We at EvE quickly realized that something was wrong. All of the hard work and effort to create things just to be thrown out, just so we can make them all over again. Stripping the Earth to feed this cycle simply doesn't make sense. We realize composting works, but a more industrial solution is needed to keep up with the food waste we generate. We heard the call to fill that unrelenting "hole in the ground" with a waste revolution, and that led us to develop a solution that will rid the world of trash and help everyone understand the value in waste. Waste is not our fault, but it is our problem.

**Values — there are THREE. Delete the fourth card; do not invent one.**

1. **Maximizing Value** — Our most important value is to maximize the value we can derive from waste products.
2. **Eliminating Landfills** — Our motivation stems from the dangerous and faulty reliance on landfills.
3. **Protecting the Earth** — By reducing reliance on landfilling through waste valorization, we protect the Earth from the harms of mismanaged waste.

---

## 3. Team (`team.html`)

**Ben Rosenthal** — Founder & Chief Executive Officer — ben@evewaste.com
> Ben Rosenthal is a sustainability entrepreneur and the Founder and Chief Executive Officer of EvE Waste. Combining an Ohio State sustainability degree, a $60,000 award for designing a campus-wide composting program, and a relentless focus on waste economics, he leads commercial strategy and growth in waste-to-value systems.

**Brenden Fowler** — Founder & Chief Operating Officer — brenden@evewaste.com
> Brenden Fowler is a serial entrepreneur and a Founder of EvE Waste. Combining an Ohio State biochemistry degree, medical research experience in San Francisco, and a drive for venture creation, he leads continuous innovation in waste-to-energy systems.

> **RESOLVED 2026-09-03.** The intake sheet said "Founder / COO" and "COO
> [Founder]"; his supplied bio said "Founder and Chief Science Officer." Kyla
> settled it: **Founder & Chief Operating Officer**.

**Kyla Fallis** — Founder & Chief Information Officer — kylaevewaste@outlook.com
> Kyla Fallis is a chemical engineer and published researcher, and the Founder and Chief Information Officer of EvE Waste. She leads software, owning the architecture, database schema, and eighteen-month technical roadmap for a computer-vision system that estimates how full a waste container is before a truck is dispatched. Her research runs from compost-powered microbial fuel cells to deep-sea electrochemistry, with published work on dark oxygen flux and accepted work on machine learning for tidal energy site selection. She also founded FairGame Initiative.

> Rewritten 2026-09-03 at Kyla's direction to lead on research and software
> rather than NASA, FairGame and the UN. Every fact is drawn from her own media
> kit (*Bio Suite — Kyla Fallis*, v1.0, Aug 2026 — the "Speaker" and "Long form"
> entries), so nothing here is unsourced, but it is **no longer one of the kit's
> verbatim lengths**. Worth adding back into the kit as an approved variant.
>
> Title: **Founder & Chief Information Officer**, per her instruction. The media
> kit still says "Co-founder and Lead Software Developer" — update the kit.

**Headshots:** supplied 2026-09-03 and now live on the page. Ben Rosenthal (cut-out,
composited onto Forest Green), Brenden Fowler (grey studio), Kyla Fallis (NASA
Marshall). All three are cropped to 3:4 by `tools/build-images.mjs`. The three
backgrounds do not match each other — see `DECISIONS.md`.

---

## 4. Product (`platform.html`)

**H1**
> Waste goes in. Products come out.

**How it works** (FAQ answer 1, also the page's explainer):
> Our system uses the natural, microbial process of anaerobic digestion to break down food waste into digestate while producing biogas. The digestate is processed into fertilizer, and the biogas is converted into clean energy. The fertilizer is sold to agricultural and landscaping sectors, and the clean energy reduces our client's energy bill.

### Specifications — DO NOT BUILD A SPEC TABLE
No specification values exist yet. Do not publish a table of "available on request"
rows. Instead render a single block:

> **Full specifications**
> Throughput, footprint, retention time, biogas yield, methane content, digestate
> output, utility connections, and commissioning timelines are available on request
> under NDA.
> Button: `Request specifications` → contact.html?inquiry=information

### Feedstock
- **Accepted:** all food waste.
- **Not accepted:** **RESOLVED 2026-09-03 — no refusal list is published, and this
  is now a settled decision rather than a pending one.** Do not add one later
  without a source; "Manure?" from the intake sheet stays unpublished.
- **Units:** publish as-received (per tonne as-received), not per-tonne-VS.
- **Yield framing:** use **biogas** in marketing copy and on the home page. On this
  page only, give both biogas and CH₄ once actual figures exist. Until then, publish
  no yield figures at all.

### FAQ
1. **How does your system work?** — answer above.
2. **What is anaerobic digestion?** — `NEEDS INPUT`. Fallback: omit this question
   rather than writing an answer on the founders' behalf. Leave an HTML comment.

---

## 5. Pilots (`use-cases.html` — "How a pilot works")

**RESOLVED 2026-09-07.** The five fields were never blocked on the founders; they
were blocked on the framing. EvE runs a **two-phase pilot**, which is documented in
`EvE_Waste_Workstream_II_One_Sheeter.docx` v1.0 (2026-05-11):

- **Phase 1 — a 90-day monitoring pilot at 3 sites.** This is what the page describes.
- **Phase 2 — digester deployment**, scoped only for sites that graduate. Target
  graduation rate ≥ 40% in 12 months. **No digester throughput, footprint or payback
  figure goes on this page** — those are spec-table rows under the basis rule.

| Field | Value | Basis |
|---|---|---|
| Site count | Three | One-Sheeter v1.0 |
| Duration | 90 days monitored, ~2 weeks survey before, ~2 weeks reporting after | One-Sheeter + proposed bookends |
| Data collected | Categories published, not the schema. See the page. | One-Sheeter, Germination Protocol §6 |
| Success criteria | Six, all falsifiable. See the page. | Proposed |
| What the host receives | Eight items, framed as what they **keep**. See the page. | Proposed |

**Why 90 days** (background for sales, compressed on the page): a performance-based
waste audit samples 60–90 days; hauling invoices are monthly and three cycles is the
least that distinguishes a pattern from an anomaly; and for graduating sites a
mesophilic digester reaches steady state in roughly three HRTs, which lands in the
same window. **Do not publish an HRT number** — Brenden owns that row.

**Two thresholds still need Brenden:** the 95% data-completeness figure, and the
ground-truth accuracy tolerance. Both are marked `NEEDS INPUT` in the HTML. The
accuracy criterion currently names the pilot agreement as where the tolerance is
fixed, which is honest and still falsifiable.

**Pricing is deliberately absent.** Whether Phase 1 is free, subsidised or paid is
Ben's call. The page carries **no pricing statement at all** — not even "contact us
for pricing". A hedge invites the question; silence lets the conversation start.
`NEEDS INPUT — Ben`

### Section B — What we have built (this is real, use it)
1. **AD System Prototype** — photograph live; written description still `NEEDS INPUT`.
2. **Waste Hauling Monitor Prototype** — `NEEDS INPUT: description and photograph`.

## 6. Contact (`contact.html`)

**Form fields** — all of these, in this order:
| Field | Required |
|---|---|
| First name | yes |
| Last name | yes |
| Work email | yes |
| Company / organization | no |
| Inquiry type (select) | yes |
| Message | yes |

**Inquiry type options — replace the existing list with exactly these:**
- Information inquiry
- Set up a meeting
- Sales inquiry
- Media request

**Submissions go to:** ben@evewaste.com

**Success message:**
> Thanks for reaching out! We will be in touch soon.

**Response time line (visible near the form):**
> We reply to every message within one week.

**Delete from this page:**
- hello@evewaste.com, engineering@evewaste.com, careers@evewaste.com — these
  addresses do not exist.
- The entire `<address>` block. It currently says **Canada** with bracketed
  placeholders. Replace with the single line `Columbus, Ohio`.
- The "within 1-2 business days" promise — it contradicts the one-week promise.

---

## 6b. CLAIMS REVIEW — read before publishing any number

Three problems in the supplied stats. Resolve with the founders; do not paper over them.

1. **"Average waste management cost reduction for our clients: +20%"**
   EvE Waste has no clients. Publishing a client average is a claim that cannot be
   substantiated and is the kind of thing a diligence process finds. It also conflicts
   with the Pillar 2 figure of 19%. **Resolution used above:** one figure (19%),
   labeled *Modeled*, described as value generated versus landfilling — not as a
   client result.

2. **"Annual increase in tipping fees: -15%"**
   The label describes an *increase* but the number carries a minus sign. Published
   as **15%** with the word "increase" in the label.

3. **"+5,000 years"**
   Reads as a claim about human history, which is defensible, but the supplied
   sentence is ungrammatical ("No change ... have proved"). Rewritten above.

Every stat on the site renders with a basis label: `Historical`, `Modeled`,
`Industry data`, or `Measured`. Nothing gets published as `Measured` until it is.
