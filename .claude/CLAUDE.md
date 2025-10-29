# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🔄 CRITICAL RULE: Living Documentation

**Whenever you create, modify, or build any component, utility, page, or feature in this project, you MUST immediately update this CLAUDE.md file with:**
- What was built and where it's located
- How it works (if non-obvious)
- Any patterns or conventions used
- Integration points with other parts of the system

This ensures context is preserved when the chat is compacted. Treat this as a living document that grows with the codebase.

## Project Overview

**IndoorClimbingGym.com** is an SEO-optimized climbing gym directory built with Astro v4. This is the **public-facing Astro directory site** (Phase 1 of a dual-platform system). The companion Next.js dashboard for gym owners/climbers will be built separately at `dashboard.indoorclimbinggym.com`.

**Primary Goal:** Rank #1 for climbing gym keywords ("indoor climbing gym near me", "bouldering gym near me") within 30 days through aggressive SEO optimization.

**Site:** `https://www.indoorclimbinggym.com`
**Framework:** Astro v4 (Static Site Generation)
**Deployment:** Vercel

## Commands

```bash
# Development
npm run dev              # Start dev server at localhost:4321

# Production
npm run build            # Build static site to ./dist/
npm run preview          # Preview production build locally

# Utilities
npm run astro ...        # Run Astro CLI commands
npm run astro check      # Type-check the project
```

## Architecture Overview

### Data-Driven Static Generation

This site is **entirely data-driven** from a structured JSON schema. All pages are statically generated at build time.

**Data Source:** `/src/data/gyms.json`
Contains gym listings with 50+ structured fields per the **Climbspot Directory Schema v1.0** (see `/src/data/IndoorClimbingGym_schema_prompts.json` for full schema definition).

### Page Generation Strategy

The site generates three primary page types dynamically:

1. **Gym Detail Pages** (`/gyms/[slug]`)
   - One page per gym from `gyms.json`
   - 800-1200 words of rich content per page
   - Full JSON-LD schema markup (LocalBusiness + SportsActivityLocation)
   - Generated from gym data + content enrichment

2. **City Landing Pages** (`/[state-abbr]/[city]`)
   - Auto-generated from unique city/state combinations in gym data
   - 1,500-2,000 words per page
   - Filterable gym listings, maps, pricing comparisons, FAQs
   - Target keywords: "[city] climbing gym", "climbing gyms in [city]"

3. **State Landing Pages** (`/[state-abbr]`)
   - Roll-up pages showing all cities in a state
   - 2,000-2,500 words per page
   - Regional breakdowns, state-level statistics

### URL Structure

```
/                           # Homepage
/gyms/[slug]               # Gym detail (e.g., /gyms/vertical-world-seattle)
/[state]/[city]            # City page (e.g., /wa/seattle)
/[state]                   # State page (e.g., /wa)
/best-[category]           # Category pages (e.g., /best-bouldering-gyms)
/guides/[slug]             # Blog posts
/search                    # Search/browse page
```

All URLs are lowercase, hyphenated, SEO-friendly.

### SEO-First Architecture

**Critical:** Every page MUST include:
- Unique `<title>` (<60 chars, includes target keyword)
- Unique `<meta description>` (<160 chars)
- Canonical URL
- Open Graph tags (title, description, image, type)
- JSON-LD structured data (see schema requirements below)
- Proper heading hierarchy (single H1, logical H2-H6)

**Performance Requirements:**
- Lighthouse Performance: 95+
- Lighthouse SEO: 100
- Page load: <1.5 seconds
- Core Web Vitals: LCP <1.5s, FID <50ms, CLS <0.05

## Brand Voice & Content Guidelines

**Tagline:** "Find your next climb."

**Tone:** Approachable, informative, quietly adventurous. Professional but never arrogant. Peer-to-peer and guide-like.

**Preferred vocabulary:** Crag, beta, send, approach, pitch, route, gym, boulder problem, topo.
**Discouraged words:** Overly hyped terms like "epic" or "insane."

**Colors:**
- Sage: `#98a48b`
- Granite: `#555`
- Ivory: `#f8f8f5`

**Typography:** Modern sans-serif, medium weight, clean readability.

**Content style:**
- Blog = narrative
- Listings = concise
- Social = conversational
- Use contractions (you'll, it's)
- Short paragraphs, bullet lists, clear headings

## Schema Markup Requirements

Every gym page MUST implement this JSON-LD structure:

```typescript
{
  "@context": "https://schema.org",
  "@type": ["SportsActivityLocation", "LocalBusiness"],
  "name": "{{name}}",
  "image": "{{photo}}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{full_address}}",
    "addressLocality": "{{city}}",
    "addressRegion": "{{region}}",
    "postalCode": "{{postal_code}}",
    "addressCountry": "{{country}}"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "{{latitude}}",
    "longitude": "{{longtitude}}"  // Note: field is misspelled in schema
  },
  "telephone": "{{phone}}",
  "url": "{{website}}",
  "priceRange": "${{day_pass_price_local}}",
  "openingHoursSpecification": [/* parsed from working_hour */],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{rating}}",
    "reviewCount": "{{review_count}}"
  },
  "amenityFeature": [/* from amenities pipe-delimited field */]
}
```

Additional schema types needed:
- **BreadcrumbList** (every page)
- **FAQPage** (city/state/category pages)
- **Article** (blog posts)
- **ItemList** (city/state pages showing multiple gyms)
- **Organization** + **WebSite** (homepage)

## Data Schema Field Types

The gym data schema uses specific field types:

- **string** - Standard text
- **integer** - Whole numbers (id, total_problems)
- **number** - Decimals (latitude, longtitude, rating, prices)
- **boolean** - TRUE/FALSE (verified, beginner_friendly, student_discount)
- **enum** - Single value from allowed_values (status, price_type, discipline)
- **pipe_list** - Multiple values separated by `|` (amenities, climbing_types, training_facilities)
- **url** - Full HTTPS URLs
- **date** - ISO format YYYY-MM-DD

**Important:** The longitude field is misspelled as "longtitude" in the schema. Use this spelling consistently.

## Content Generation Requirements

### Gym Detail Pages (800-1,200 words)
Structure:
1. Hero image with schema photo field
2. Quick facts sidebar (hours, phone, address, price)
3. About section (description_long + enrichment)
4. Climbing types & grades (climbing_types, grade_system, route_style)
5. Amenities grid (from amenities field)
6. Pricing table (all price-related fields)
7. Location/access info (access_notes)
8. Reviews summary (rating, review_count)
9. FAQ section (unique per gym, 5-10 questions)
10. Related gyms (same city)

### City Pages (1,500-2,000 words)
Structure:
1. H1: "Best Climbing Gyms in {{city}}, {{state}}"
2. Intro paragraph (150-200 words)
3. Quick stats (total gyms, avg rating, price range)
4. Interactive map with all gyms
5. Filter bar (type, amenities, price, rating)
6. Top rated section (top 5 by rating)
7. Neighborhood breakdowns (H2 sections)
8. Pricing comparison table
9. "Best for" subsections (beginners, bouldering, etc.)
10. FAQ (10 questions specific to city)

### Target Keywords by Page Type

**Homepage:** "climbing gym near me", "find climbing gyms"
**Gym pages:** "[gym name] [city]", "[gym name] reviews", "[gym name] prices"
**City pages:** "[city] climbing gym", "climbing gyms in [city]", "best climbing gym [city]"
**State pages:** "[state] climbing gyms", "climbing gyms in [state]"
**Category pages:** Match URL (e.g., "best bouldering climbing gyms")

## Internal Linking Strategy

**Every gym page links to:**
- Breadcrumb: Home → State → City → Gym
- Its city page
- Its state page
- 3-5 nearby gyms (sidebar)
- 2 relevant category pages
- 1-2 relevant blog posts

**Every city page links to:**
- All gyms in that city
- The state page
- 3-5 neighboring city pages
- 2-3 relevant category pages

**Footer (sitewide):**
- Popular Cities (top 10)
- Popular States (top 5)
- Categories
- Blog
- About/Contact

## Image Optimization

All images MUST be:
- WebP format with JPEG fallback
- Responsive (srcset attribute)
- Lazy loaded (`loading="lazy"`)
- Properly alt-texted (include gym name + city)
- Hero images: 1600x900px optimized to <150KB
- Logos: SVG preferred, or PNG <50KB

## Future Integration Notes

This Astro site will eventually integrate with:
- **Next.js dashboard** (`dashboard.indoorclimbinggym.com`) for user auth, gym submissions, reviews
- **Supabase** for production database (currently using local JSON)
- **API endpoint** in Next.js to serve gym data at build time

When the dashboard is ready, Astro build will:
1. Fetch gym data from Supabase via API
2. Generate static pages
3. Deploy to Vercel edge network

**Current approach:** Build from local `/src/data/gyms.json` for rapid iteration.

## Key Technical Decisions

- **Static Site Generation (SSG)** over SSR for maximum speed and SEO
- **TailwindCSS v4** for styling (Vite plugin, not PostCSS)
- **No client-side JavaScript** where possible (Astro islands architecture)
- **Sitemap auto-generated** via `@astrojs/sitemap` integration
- **Mobile-first design** (70% of searches are mobile)

## Critical SEO Success Factors

1. **Launch with volume** - 150+ pages minimum at launch, 300+ by week 2
2. **Perfect technical SEO** - Schema, speed, mobile cannot be compromised
3. **Rich content** - No thin content; gym pages minimum 800 words
4. **Mobile experience** - Must be flawless (70% of searches are mobile)
5. **Internal linking** - Every page linked logically in hub-and-spoke model
6. **Backlinks immediately** - Start building links day 1
7. **Monitoring** - Check Google Search Console daily for indexing issues

## Common Patterns

### Importing Gym Data
```typescript
import gyms from '../data/gyms.json';

// Filter by city
const seattleGyms = gyms.filter(gym => gym.city === 'Seattle');

// Get unique cities for a state
const waCities = [...new Set(gyms.filter(g => g.region === 'Washington').map(g => g.city))];
```

### Parsing Amenities (Pipe-Delimited)
```typescript
const amenitiesList = gym.amenities?.split('|') || [];
// Returns: ['showers', 'lockers', 'cafe', 'wifi', 'parking']
```

### Parsing Hours
```typescript
// Format: "mon:06:00-22:00|tue:06:00-22:00|..."
const hours = gym.working_hour?.split('|').map(entry => {
  const [day, time] = entry.split(':');
  return { day, time };
});
```

### Generating Breadcrumbs
```typescript
const breadcrumbs = [
  { label: 'Home', url: '/' },
  { label: gym.region, url: `/${gym.region.toLowerCase().replace(/\s+/g, '-')}` },
  { label: gym.city, url: `/${stateAbbr}/${gym.city.toLowerCase().replace(/\s+/g, '-')}` },
  { label: gym.name, url: `/gyms/${gym.slug}` }
];
```

## Deployment

Deploy to Vercel:
1. Push to GitHub
2. Connect Vercel to repo
3. Configure: Framework = Astro, Build command = `npm run build`, Output = `dist`
4. Set custom domain: `www.indoorclimbinggym.com`
5. Automatic deployments on push to main

Post-deployment:
- Submit sitemap to Google Search Console
- Verify in Bing Webmaster Tools
- Set up Google Analytics 4
- Monitor Core Web Vitals

## Built Components & Utilities

### BaseLayout (`/src/layouts/BaseLayout.astro`)

**Purpose:** Foundation layout for all pages with comprehensive SEO and accessibility features.

**Props Interface:**
```typescript
{
  title: string;           // Page title (auto-truncated to 60 chars)
  description: string;     // Meta description (auto-truncated to 160 chars)
  canonical?: string;      // Canonical URL (auto-generated if not provided)
  ogImage?: string;        // Open Graph image (defaults to /og-default.jpg)
  ogType?: 'website' | 'article';  // OG type
  keywords?: string[];     // SEO keywords array
  noindex?: boolean;       // Prevent indexing
  nofollow?: boolean;      // Prevent following links
  schema?: any;            // JSON-LD schema object(s)
  breadcrumbs?: Array<{label: string; url: string}>;  // Auto-generates breadcrumb schema
}
```

**Features Included:**
- ✅ Complete SEO meta tags (title, description, keywords, robots)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Canonical URL (auto-generated or custom)
- ✅ JSON-LD schema injection via props
- ✅ Automatic breadcrumb schema generation
- ✅ Accessibility (skip link, semantic HTML, ARIA labels)
- ✅ Brand colors (Sage #98a48b, Granite #555, Ivory #f8f8f5)
- ✅ Header with navigation
- ✅ Footer with sitemap links
- ✅ Responsive container layout
- ✅ TailwindCSS global styles imported

**Usage Example:**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { generateGymSchema } from '../utils/schema';

const gymSchema = generateGymSchema(gym, pageUrl);
const breadcrumbs = [
  { label: 'Home', url: '/' },
  { label: gym.city, url: `/city/${gym.city}` },
  { label: gym.name, url: `/gyms/${gym.slug}` }
];
---

<BaseLayout
  title="Vertical World Seattle - Climbing Gym"
  description="Premier climbing gym in Seattle..."
  schema={gymSchema}
  breadcrumbs={breadcrumbs}
>
  <!-- Page content goes here -->
</BaseLayout>
```

**Header Links:**
- / (logo)
- /search
- /guides
- /about

**Footer Structure:**
- Column 1: Brand (logo + tagline)
- Column 2: Explore (search, guides, categories)
- Column 3: Popular Cities (Seattle, Austin, Denver)
- Column 4: About (about, contact, privacy)
- Bottom: Copyright

**Accessibility Features:**
- Skip to main content link (keyboard accessible)
- Semantic HTML5 elements
- ARIA labels where needed
- Focus states on interactive elements

### GymCard Component (`/src/components/GymCard.astro`)

**Purpose:** Reusable card component for displaying gym listings in grid layouts.

**Props:**
```typescript
{
  gym: Gym object with all schema fields
  showCity?: boolean  // Show city name (default: true)
}
```

**Features:**
- Responsive card with image, title, rating, description
- Hover effects and transitions
- "Beginner Friendly" badge (if applicable)
- Star rating display (5-star visual)
- Climbing types display
- Amenities tags (first 3)
- Day pass price display
- "View Gym" CTA button
- Lazy-loaded images
- Proper alt text for SEO

**Usage:**
```astro
<GymCard gym={gymObject} showCity={true} />
```

### SearchBar Component (`/src/components/SearchBar.astro`)

**Purpose:** Search input for finding gyms by location or name.

**Props:**
```typescript
{
  placeholder?: string;    // Default: "Search by city, state, or gym name..."
  initialValue?: string;   // Pre-fill search value
  large?: boolean;         // Use larger size for hero (default: false)
}
```

**Features:**
- Responsive search form
- Search icon with button
- GET request to /search with ?q= param
- Keyboard accessible
- ARIA labels
- Auto-complete support (placeholder for future enhancement)

**Usage:**
```astro
<SearchBar large={true} />  <!-- For hero sections -->
<SearchBar />               <!-- Regular size -->
```

### FilterSidebar Component (`/src/components/FilterSidebar.astro`)

**Purpose:** Comprehensive filtering controls for search/browse pages.

**Props:**
```typescript
{
  showLocationFilter?: boolean;   // Show state/city dropdowns (default: true)
  showTypeFilter?: boolean;       // Show climbing type checkboxes (default: true)
  showAmenityFilter?: boolean;    // Show amenity checkboxes (default: true)
  showPriceFilter?: boolean;      // Show price range radio (default: true)
  showRatingFilter?: boolean;     // Show min rating filter (default: true)
}
```

**Filter Options:**
- **Location:** State dropdown + City dropdown (auto-populated from gym data)
- **Climbing Type:** Bouldering, Top Rope, Lead, Speed (checkboxes)
- **Amenities:** Showers, Lockers, Cafe, WiFi, Parking, Sauna, Kids Zone, Pro Shop (checkboxes)
- **Price Range:** Under $20, $20-25, $25-30, $30+ (radio buttons)
- **Min Rating:** 4.5★, 4.0★, 3.5★, 3.0★ & up (radio buttons)
- **Special Features:** Beginner Friendly, Student Discount (checkboxes)

**Features:**
- Sticky positioning (stays visible on scroll)
- "Apply Filters" button
- "Clear All" button with reset functionality
- Form submission to /search with query params
- Client-side clear functionality

**Usage:**
```astro
<FilterSidebar />  <!-- All filters -->
<FilterSidebar showLocationFilter={true} showTypeFilter={true} />
```

### Homepage (`/src/pages/index.astro`)

**Purpose:** Main landing page optimized for SEO and conversions.

**Sections:**
1. **Hero** - Gradient background, main heading, tagline, large search bar, stats (gyms, cities, states)
2. **Featured Gyms** - Grid of top 6 rated gyms using GymCard component
3. **Popular Cities** - 6 clickable city cards linking to search results
4. **Features** - 3 value propositions (search, reviews, info) with icons
5. **CTA** - Call-to-action with "Explore Gyms" button

**SEO Features:**
- Organization + WebSite schemas (combined)
- Optimized title + description
- SearchAction schema for search engines
- Proper heading hierarchy (H1 → H2)
- Internal links to /search pages

**Stats Display:**
- Dynamically counts gyms, cities, and states from data
- Real numbers shown (not hardcoded)

## Built Components & Utilities

### SEO Utilities (`/src/utils/seo.ts`)

**Purpose:** Generate SEO meta tags, titles, descriptions for all page types.

**Key Functions:**
- `generateSEO(props)` - Master function that generates complete meta tag object including title, description, canonical, OG tags, Twitter cards
- `generateGymTitle()` - Creates SEO-optimized titles for gym pages
- `generateGymDescription()` - Creates descriptions under 160 chars
- `generateCityTitle()` / `generateCityDescription()` - For city pages
- `generateStateTitle()` / `generateStateDescription()` - For state pages
- `generateGymKeywords()` - Creates keyword arrays from gym data
- `truncateText()` - Helper to ensure length limits
- `slugify()` - Creates URL-safe slugs

**Usage Pattern:**
```typescript
import { generateSEO, generateGymTitle, generateGymDescription } from '../utils/seo';

const seoData = generateSEO({
  title: generateGymTitle(gym.name, gym.city, gym.region),
  description: generateGymDescription(gym.name, gym.city, types, gym.rating),
  canonical: `https://www.indoorclimbinggym.com/gyms/${gym.slug}`,
  keywords: generateGymKeywords(gym.name, gym.city, types)
});
```

**Conventions:**
- All titles auto-truncated to 60 chars
- All descriptions auto-truncated to 160 chars
- Includes robots directives (noindex/nofollow support)
- Generates OG and Twitter card tags automatically

### Schema Utilities (`/src/utils/schema.ts`)

**Purpose:** Generate JSON-LD structured data for all page types per schema.org standards.

**Key Functions:**
- `generateGymSchema(gym, pageUrl)` - LocalBusiness + SportsActivityLocation for gym pages
- `generateBreadcrumbSchema(breadcrumbs)` - BreadcrumbList for navigation
- `generateItemListSchema(gyms, listName, pageUrl)` - ItemList for city/state pages
- `generateFAQSchema(faqs)` - FAQPage schema
- `generateArticleSchema(...)` - Article schema for blog posts
- `generateOrganizationSchema()` - Organization schema for homepage
- `generateWebSiteSchema()` - WebSite + SearchAction for homepage
- `serializeSchema(schema)` - Converts schema object to JSON string for script tags

**Usage Pattern:**
```typescript
import { generateGymSchema, generateBreadcrumbSchema } from '../utils/schema';

const gymSchema = generateGymSchema(gym, pageUrl);
const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

// In Astro component:
<script type="application/ld+json" set:html={serializeSchema(gymSchema)} />
```

**Important Notes:**
- Uses misspelled "longtitude" field from schema (not "longitude")
- Parses pipe-delimited fields (amenities, working_hour)
- Working hours format: "mon:06:00-22:00|tue:06:00-22:00|..."
- Amenities parsed to LocationFeatureSpecification objects
- All schemas include proper @context and @type

**Schema Types Implemented:**
- ✅ LocalBusiness + SportsActivityLocation (gym pages)
- ✅ BreadcrumbList (all pages)
- ✅ ItemList (city/state pages)
- ✅ FAQPage (city/state/category pages)
- ✅ Article (blog posts)
- ✅ Organization (homepage)
- ✅ WebSite + SearchAction (homepage)

## Related Documentation

- **Astro PRD:** `/Users/tsth/Coding/rockclimbing/Astro PRD.md`
- **Full PRD:** `/Users/tsth/Coding/rockclimbing/PRD.md`
- **Brand Blueprint:** `/Users/tsth/Coding/rockclimbing/IndoorClimbingGym Brand BluePrint.txt`
- **Schema Definition:** `/src/data/IndoorClimbingGym_schema_prompts.json`
- **Next.js PRD:** `/Users/tsth/Coding/rockclimbing/Next.js PRD.md` (future phase)
