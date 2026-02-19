# Affiliate Optimization Sprint Plan (Week of 2026-02-19)

## Goal
Increase affiliate revenue by improving click-through and purchase intent flow from content pages.

## KPI Targets (7 days)
- +25% affiliate outbound clicks
- +15% CTR on affiliate blocks
- +10% clicks from blog pages to /gear and commercial guides

## Execution Plan

### Phase 1 — Conversion Copy (Day 1)
1. Replace weak CTA text globally:
   - "See details" -> "Check price on Amazon"
2. Add trust + compliance inline disclosure inside affiliate blocks.
3. Upgrade default affiliate block copy on blog template by category intent.

### Phase 2 — Placement & Relevance (Day 1-2)
1. Optimize 5 new week-sprint articles with stronger pre-block copy and intent-fit products.
2. Ensure high-intent pages have affiliate module by early-mid depth and decision CTA near end.
3. Tighten product mapping:
   - shoes pages -> shoes products
   - harness pages -> harness/belay products
   - birthday/parents pages -> practical gift bundle

### Phase 3 — Internal Traffic Flow (Day 2-3)
1. Add contextual internal links from informational pages to money pages:
   - /blog/rock-climbing-gear-guide-complete
   - /blog/how-to-choose-climbing-shoes
   - /gear
2. Add one commerce-oriented CTA sentence in conclusion sections of top pages.

### Phase 4 — Tracking & Optimization Loop (Day 3-7)
1. Add outbound affiliate click tracking event (`affiliate_click`) to affiliate links.
2. Report top clicked products + top clicked source pages daily.
3. A/B test two CTA labels:
   - "Check price on Amazon"
   - "See latest deal"

## Done in this execution batch
- Conversion copy updates in 5 new articles
- Affiliate implementation audit report completed
- Global AffiliateBlock CTA upgraded to stronger copy
- Inline affiliate disclosure added in AffiliateBlock
- Affiliate click event tracking added
- Blog template affiliate block now category-intent aware

## Next immediate actions
1. Validate pages in dev and confirm no rendering regressions.
2. Ship to review branch (no merge until Tim review).
3. Start top-traffic page pass for additional internal-link monetization flow.
