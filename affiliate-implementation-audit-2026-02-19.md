# Affiliate Implementation Audit (Conversion Priority)
Date: 2026-02-19
Scope: Full site audit of affiliate execution with emphasis on blog conversion pathways and new Week-3 articles.

## Executive Summary
Primary finding: affiliate infrastructure is present and functional, but conversion performance is uneven due to placement timing, inconsistent intent-product matching, and limited inline disclosure/CTA framing at the article level.

Biggest upside this week:
1. Add/standardize **inline affiliate disclosure** near first affiliate module in commercial pages.
2. Improve **above-the-fold and early-mid CTA framing** for high-intent articles.
3. Tighten **product relevance mapping** (intent -> offer) on shoe/gear/birthday pages.
4. Strengthen **internal linking into affiliate-heavy pages** from informational pages with commercial adjacency.

---

## Deliverable A: 5 Completed Conversion-Optimized Article Files
1. `src/content/blog/rock-climbing-harness-guide.mdx`
2. `src/content/blog/rock-climbing-holds-guide.mdx`
3. `src/content/blog/rock-climbing-birthday-party-guide.mdx`
4. `src/content/blog/bouldering-grades-explained.mdx`
5. `src/content/blog/bouldering-shoes-guide.mdx`

All five include:
- affiliate module(s)
- stronger direct-response CTA framing near modules
- internal links to core conversion pages
- FAQ + SEO frontmatter

---

## Deliverable B: Full Affiliate Audit

## 1) Where AffiliateBlock appears / missing

### Pages with AffiliateBlock (high-level)
Affiliate blocks are implemented across major money pages and many evergreen guides, including new week-3 pages.

### Blog content missing AffiliateBlock (current list)
- adaptive-climbing-programs-accessibility.md
- aloha-rock-gym-mauis-first-indoor-climbing-gym.md
- bouldering-vs-rope-climbing.md
- climbing-grades-explained.md
- climbing-gym-design-and-layout.md
- climbing-gym-equipment-technology-innovations.md
- climbing-gym-franchise-scaling-nationwide.md
- climbing-gym-industry-consolidation.md
- climbing-gym-market-analysis-location-strategy.md
- climbing-gym-operations-team-building.md
- climbing-gym-safety-liability-guide.md
- climbing-shoe-fit-guide.md
- climbing-shoes-fit.md
- how-to-break-in-climbing-shoes.md
- how-to-choose-first-climbing-gym.md
- how-to-clean-climbing-shoes.md
- ifsc-world-cup-2026.md
- para-climbing-la-paralympics-2028.md
- pro-bouldering-tour-comes-to-london.md
- socks-with-climbing-shoes.md
- what-is-bouldering.md
- world-climbing-ifsc-rebrand-explained.md

Note: several are news/industry pages where monetization may be optional. Prioritize commercial-adjacent evergreen pages first.

## 2) Placement quality audit (above fold / mid / end)

Observed pattern:
- Strong: gear hub pages with multiple blocks (e.g., `rock-climbing-gear-guide-complete.mdx`).
- Mixed: many evergreen pages place first block in later sections (mid-to-late), leaving high-intent users unserved early.
- Week-3 updates: new pages now include stronger pre-block direct-response copy and intent-matched modules.

Placement scoring rubric used:
- Above fold/early: excellent for high-intent pages
- Mid article: acceptable baseline
- End-only: weak for conversions (user drop-off)

Recommendation:
- Commercial intent pages: first module by 20–35% scroll depth
- Informational pages: first soft CTA by 35–50%
- Add second “decision CTA” near FAQ/end where relevant

## 3) Product relevance by article intent

### Strong matches
- Harness guide -> harness + belay + chalk bag
- Holds guide -> chalk/skin/finger training support
- Bouldering shoes guide -> shoe lineup with fit framing

### Needs improvement
- Some informational pages use generic product groupings without intent segmentation (beginner vs performance vs local event intent).
- Birthday party page currently uses practical gift-oriented picks (good), but can improve with “host checklist bundle” framing.

Recommendation:
- Add a per-article product intent map:
  - **Commercial gear** -> direct product bundle
  - **Informational training** -> low-friction starter tools
  - **Local/party intent** -> event checklist + simple gift picks

## 4) CTA copy strength + friction points

### Current strengths
- Affiliate modules already include structured title/subtitle and curated products.
- New week-3 pages now use stronger action language near modules.

### Key friction points
1. CTA language often descriptive rather than action-driving.
2. Inconsistent “why buy now” context (decision urgency / confidence framing).
3. Limited risk-reversal language (e.g., “start simple; upgrade later”).
4. No standardized “best for X climber” micro-copy near products in all contexts.

## 5) Disclosure / compliance checks

### What exists
- Footer disclosure in `BaseLayout.astro`
- Privacy + Terms include Amazon Associate disclosure language

### Gap
- In-article affiliate disclosure is not consistently visible near first affiliate module.

Recommendation (quick win):
- Standardize an inline note above first affiliate block on monetized pages:
  - “Disclosure: This section contains affiliate links. If you buy through them, we may earn a commission at no extra cost to you.”

## 6) Internal linking flow to affiliate-heavy pages

Current inbound examples (blog-to-blog):
- `/blog/rock-climbing-gear-guide-complete` referenced by ~6 posts
- `/blog/how-to-choose-climbing-shoes` referenced by ~4 posts
- `/blog/rock-climbing-shoes-beginners-guide` referenced by ~3 posts
- `/blog/what-to-wear-indoor-rock-climbing` referenced by ~7 posts
- `/blog/how-to-start-rock-climbing` referenced by ~5 posts

Opportunity:
- Expand links from high-traffic informational pages (grades/what-is/how-to) into commercial gear pages with contextual anchor text (“best beginner harness setup”, “shoe fit picks by climbing style”).

---

## Prioritized Fixes

## Quick wins (this week)
1. Add inline disclosure above first AffiliateBlock in all commercial/gear evergreen posts.
2. Add one early-mid conversion CTA sentence before first block in top 10 money pages.
3. On shoe/harness pages, add explicit “best for beginner / budget / performance” framing in module subtitles.
4. Add one “decision CTA” after FAQ in 5 highest-intent pages.
5. Strengthen internal links from informational pages to 2–3 affiliate-heavy destination pages.

## Medium-term (2–6 weeks)
1. Build reusable `AffiliateDisclosureInline` component for consistent compliance styling.
2. Build intent-based module variants (Beginner, Budget, Performance, Parent/Party).
3. Add conversion instrumentation (scroll depth, block visibility, outbound affiliate click tracking).
4. Create comparison tables for top-converting pages (shoes/harness/chalk systems).
5. Build sitewide affiliate QA checklist integrated into content publishing workflow.

---

## Deliverable C: Concrete Copy Rewrites (ready to deploy)

## 1) Generic weak CTA -> stronger direct-response

Before:
- “Here are some recommended products.”

After:
- “If you want a reliable setup without overbuying, start with these three picks and upgrade only when your climbing demands it.”

## 2) Shoes page module intro

Before:
- “These options map cleanly to common bouldering needs.”

After:
- “Pick one model matched to your current climbing style and commit for 6–8 weeks—this is the fastest way to improve without wasting money on constant shoe switching.”

## 3) Harness page module intro

Before:
- “Solid harness and essentials for most gym climbers.”

After:
- “Get your first gym-safe harness setup now: comfort-first harness + trusted belay device so you can climb confidently this week.”

## 4) Holds page module intro

Before:
- “Support gear for better hold sessions.”

After:
- “Protect your skin and keep grip quality high so your hold setup actually translates into more quality attempts.”

## 5) Birthday page module intro

Before:
- “Climbing-themed gift ideas for party guests.”

After:
- “Skip throwaway favors—share these practical gift picks parents can use on a real return gym visit.”

## 6) Inline disclosure copy (standardized)

Recommended block text:
- “Disclosure: This section contains affiliate links. If you purchase through these links, we may earn a commission at no extra cost to you.”

Placement:
- Immediately above first AffiliateBlock on monetized pages.

---

## Implementation Status for This Sprint
- 5 new articles are drafted and conversion-optimized for affiliate framing.
- PR intentionally **not opened** per updated priority.
- Affiliate audit report completed with prioritized fix roadmap and copy rewrites.
