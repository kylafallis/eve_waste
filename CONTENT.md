# EvE Waste — Content Deck
**Single source of truth for all site copy. Rev 2026-09-03.**

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
| Public email | **None.** Route all contact through the form. |
| Form recipient | ben@evewaste.com |
| Response time promise | Within one week |
| Positioning | **Cost first.** Sustainability is the second argument, never the first. |
| Meta description | Revolutionizing food waste management through our bio-reactor. EvE Waste transforms food waste into clean energy and nutrient-rich fertilizer. |

### Team emails (team page only, not footer)
- Ben Rosenthal — ben@evewaste.com
- Brenden Fowler — brenden@evewaste.com

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

## 2. About (`about.html`)

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

**Brenden Fowler** — `NEEDS INPUT: title conflict` — brenden@evewaste.com
> Brenden Fowler is a serial entrepreneur and a Founder of EvE Waste. Combining an Ohio State biochemistry degree, medical research experience in San Francisco, and a drive for venture creation, he leads continuous innovation in waste-to-energy systems.

> **CONFLICT — resolve before launch.** The intake sheet lists Brenden as
> "Founder / COO" and "COO [Founder]", but his supplied bio says "Founder and Chief
> Science Officer." Pick one. Fallback until resolved: render the title as
> **"Founder"** only, and use the bio above with the officer title removed.

**Kyla Fallis** — Co-founder & Chief Information Officer — `NEEDS INPUT: no @evewaste.com address`
> Kyla Fallis is an engineering student at Ohio State and a researcher at NASA's Marshall Space Flight Center. She founded FairGame Initiative, which has brought science fair to more than 1,000 students, and co-founded EvE Waste, where she leads software. She has represented Ohio State at a UN climate conference and competed at ISEF.

> Source: the approved "Short — 54 words" entry in *Bio Suite — Kyla Fallis*
> (Media Kit v1.0, August 2026), used **verbatim** as that document instructs
> ("Use these verbatim. They are checked. Rewriting them introduces errors").
>
> **TITLE CONFLICT — resolve before launch.** The same media kit lists her EvE
> title as "Co-founder and Lead Software Developer." The site renders
> "Co-founder & Chief Information Officer" per her direct instruction on
> 2026-09-03. Pick one and make the media kit and the site agree.

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
- **Not accepted:** `NEEDS INPUT` — the intake sheet lists "Manure?" with a question
  mark. Omit the refusal list entirely until confirmed. Do not guess.
- **Units:** publish as-received (per tonne as-received), not per-tonne-VS.
- **Yield framing:** use **biogas** in marketing copy and on the home page. On this
  page only, give both biogas and CH₄ once actual figures exist. Until then, publish
  no yield figures at all.

### FAQ
1. **How does your system work?** — answer above.
2. **What is anaerobic digestion?** — `NEEDS INPUT`. Fallback: omit this question
   rather than writing an answer on the founders' behalf. Leave an HTML comment.

---

## 5. Pilots (`use-cases.html` → retitle "How a pilot works")

This page has **no customers and no case studies.** Do not invent company names,
logos, quotes, or results. Rebuild it as a pilot-program explainer with two sections:

**Section A — How a pilot works**
Fields to fill: site count, duration, data collected, success criteria, what the host
site receives. All are `NEEDS INPUT`. Fallback: render the section headings with a
short "we will scope this with you" line and a `Request a pilot` CTA — no numbers.

**Section B — What we have built** (this is real, use it)
1. **AD System Prototype** — `NEEDS INPUT: description`
2. **Waste Hauling Monitor Prototype** — `NEEDS INPUT: description`

Both need photographs. See BUILD_BRIEF §"Photography" — this is the single highest
impact item on the whole project.

---

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
