# 📁 UPDATE RULE: Directory/Public Site Documentation

**⚠️ IMPORTANT: When to update THIS file:**
- ✅ Changes to directory code (`/indoor-climbing-gym/` directory)
- ✅ Astro configurations and integrations
- ✅ Public-facing pages: homepage, gym listings, search, blog, state/city pages
- ✅ Astro components, layouts, utilities
- ✅ SEO, schema markup, sitemap changes
- ✅ Public site UI/UX changes
- ✅ Content collections (blog posts)

**❌ Do NOT update this file for:**
- Dashboard changes (update `/rockclimbing-dashboard/.Codex/AGENTS.md` instead)
- Next.js specific changes
- Admin features, user management
- Stripe/billing changes

---

# 🎯 Directory Project: IndoorClimbingGym.com

**URL:** https://www.indoorclimbinggym.com
**Tech Stack:** Astro v4, TypeScript, TailwindCSS v4, Vercel
**Purpose:** SEO-optimized public directory of climbing gyms
**Rendering:** Hybrid SSR/SSG (Server-Side + Static Generation)

## 📝 Weekly SEO Article Automation - 2026-06-22 Run (COMPLETED)

**Completed:** 2026-06-22
**Published:** 2026-06-24
**Status:** ✅ Three weekly blog drafts and hero images added, pushed to `main`, and verified live

### Overview

Added the required weekly article mix: one Climbro-focused affiliate article, one general climbing-gym article, and one training bridge article that naturally sends readers into the Climbro cluster.

### Files Added

1. `src/content/blog/hangboard-training-with-climbro.mdx`
2. `src/content/blog/top-rope-climbing-guide.mdx`
3. `src/content/blog/climbing-training-schedule.mdx`
4. `public/images/blog/hangboard-training-with-climbro.png`
5. `public/images/blog/top-rope-climbing-guide.png`
6. `public/images/blog/climbing-training-schedule.png`

### Implementation Notes

- DataForSEO was reachable this run. Selected topics used DataForSEO monthly volume plus DataForSEO Labs keyword difficulty and avoided duplicate coverage with existing beginner, cost, shoes, endurance, grades, hangboard, and Climbro buyer articles.
- Selected keyword metrics: `hangboard training` search volume 210, KD 0; `top rope climbing` search volume 4,400, KD 0; `climbing training schedule` search volume 320, KD 0.
- Climbro claims were limited to `/Users/tsth/Coding/rockclimbing/data-for-website/Affiliate-climbro/climbro_official_claims.md`.
- Climbro outbound CTAs use `ClimbroTrackedLink.astro` and `ClimbroAffiliateBlock.astro`; training bridge CTAs route methodology curiosity to internal Climbro explainer pages.
- Hero images are generated unbranded indoor climbing scenes with no visible brand names, logos, trademarks, watermarks, readable signage, or product branding.
- Validation: `npm run build` passed.
- Published in commit `87f6209` and verified live on `https://www.indoorclimbinggym.com/blog/hangboard-training-with-climbro/`, `https://www.indoorclimbinggym.com/blog/top-rope-climbing-guide/`, and `https://www.indoorclimbinggym.com/blog/climbing-training-schedule/`.

## 📝 Weekly SEO Article Automation - 2026-06-08 Run (COMPLETED)

**Completed:** 2026-06-08
**Status:** ✅ Three weekly blog drafts and hero images added

### Overview

Added the required weekly article mix: one Climbro-focused affiliate article, one general climbing-gym article, and one training bridge article that naturally sends readers into the Climbro cluster.

### Files Added

1. `src/content/blog/climbro-mini-home-training.mdx`
2. `src/content/blog/climbing-footwork-drills.mdx`
3. `src/content/blog/climbing-power-endurance-training.mdx`
4. `public/images/blog/climbro-mini-home-training.png`
5. `public/images/blog/climbing-footwork-drills.png`
6. `public/images/blog/climbing-power-endurance-training.png`

### Implementation Notes

- DataForSEO credentials were present, but API access failed from the sandbox because `api.dataforseo.com` could not resolve via DNS. No fresh keyword metrics were claimed.
- Topic selection avoided duplicates with the existing Climbro review, Mini vs Pro, rent/buy, rental/trial, app-guided training, smart hangboard, warm-up, workout, endurance, and finger-strength articles.
- Climbro claims were limited to `/Users/tsth/Coding/rockclimbing/data-for-website/Affiliate-climbro/climbro_official_claims.md`.
- Climbro outbound CTAs use `ClimbroTrackedLink.astro` and `ClimbroAffiliateBlock.astro`; training bridge CTAs route methodology curiosity to internal Climbro explainer pages.
- Hero images are generated unbranded indoor climbing scenes with no visible brand names, logos, trademarks, watermarks, readable signage, or product branding.
- Validation: `npm run build` passed.

## 📝 Weekly SEO Article Automation - 2026-06-01 Run (COMPLETED)

**Completed:** 2026-06-01
**Status:** ✅ Three weekly blog drafts and hero images added

### Overview

Added the required weekly article mix: one Climbro-focused affiliate article, one general climbing-gym article, and one training bridge article that naturally sends readers into the Climbro cluster.

### Files Added

1. `src/content/blog/climbro-app-guided-training.mdx`
2. `src/content/blog/rock-climbing-date-guide.mdx`
3. `src/content/blog/climbing-warm-up-routine.mdx`
4. `public/images/blog/climbro-app-guided-training.png`
5. `public/images/blog/rock-climbing-date-guide.png`
6. `public/images/blog/climbing-warm-up-routine.png`

### Implementation Notes

- DataForSEO credentials were present, but API access failed from the sandbox because `api.dataforseo.com` could not resolve via DNS. No fresh keyword metrics were claimed.
- Topic selection avoided duplicates with the existing Climbro review, Mini vs Pro, rent/buy, smart hangboard, training-plan, beginner, workout, endurance, and finger-strength articles.
- Climbro claims were limited to `/Users/tsth/Coding/rockclimbing/data-for-website/Affiliate-climbro/climbro_official_claims.md`.
- Climbro outbound CTAs use `ClimbroTrackedLink.astro` and `ClimbroAffiliateBlock.astro`.
- Hero images are generated unbranded indoor climbing scenes with no visible brand names, logos, trademarks, watermarks, readable signage, or product branding.
- Validation: `npm run build` passed.

## 🤖 LLM Crawl Index Files (COMPLETED)

**Completed:** 2026-05-28
**Status:** ✅ AI/LLM crawl index files added

### Overview

Added generated plain-text LLM index endpoints so AI assistants and LLM-oriented crawlers can discover the public directory's most important pages and cite canonical URLs more reliably.

### Files Added

1. `src/pages/llms.txt.ts`
2. `src/pages/llms-full.txt.ts`
3. `src/pages/llm.txt.ts`
4. `src/utils/llms.ts`

### Files Modified

1. `public/robots.txt`
2. `AGENTS.md`

### Implementation Notes

- `/llms.txt` generates a concise Markdown-style index of core pages, tools, blog categories/posts, state pages, city pages, category pages, city category pages, and gym profile pages.
- `/llm.txt` is a compatibility alias for `/llms.txt`.
- `/llms-full.txt` generates expanded crawl context with canonical URLs, summaries, structured gym facts, and full blog article bodies where available.
- Both endpoints are prerendered at build time and reuse the cached gym data fetch path.
- `robots.txt` advertises both LLM files with `LLM-Content` and `LLM-Full-Content` entries while preserving the sitemap reference.

## 📢 Google AdSense ads.txt Seller Record (COMPLETED)

**Completed:** 2026-05-22
**Status:** ✅ Google AdSense authorized seller record added

### Overview

Added the Google AdSense authorized digital seller record for publisher `pub-5430791047928776` so Google can verify the public site's ad inventory.

### Files Added

1. `public/ads.txt`

### Implementation Notes

- The file is served from the public root as `/ads.txt`.
- Current seller record:
  - `google.com, pub-5430791047928776, DIRECT, f08c47fec0942fa0`

## 📢 Google AdSense Site-Wide Head Snippet (COMPLETED)

**Completed:** 2026-05-20
**Status:** ✅ AdSense loader added to every public page

### Overview

Added the Google AdSense script for publisher `ca-pub-5430791047928776` to the shared site layout so AdSense can verify and prepare all public pages for ads.

### Files Modified

1. `src/layouts/BaseLayout.astro`

### Implementation Notes

- The script is loaded in the document `<head>` through `BaseLayout`.
- Because `BaseLayout` wraps public pages, the AdSense snippet is included site-wide.
- Script source:
  - `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5430791047928776`

## 🏙️ City Category Single-Gym Page Generation Fix (COMPLETED)

**Completed:** 2026-05-20
**Status:** ✅ City category detail pages now generate for single matching gyms

### Overview

Fixed city category hub links that pointed to valid one-gym category combinations but 404ed because the detail route only generated pages for combinations with at least two matching gyms.

### Files Modified

1. `src/pages/[state]/[city]/categories/[category]/index.astro`

### Implementation Notes

- City category detail pages now use `MIN_GYMS_FOR_PAGE_GENERATION` only, which is currently `1`.
- This aligns detail page generation with city category hubs, which list categories with `count > 0`.
- Verified the previously missing `/colorado/centennial/categories/best-auto-belay-climbing-gyms/` output now builds.

## 📝 Weekly SEO Article Automation + First Article Set (COMPLETED)

**Completed:** 2026-05-20
**Status:** ✅ Weekly automation created and first three SEO/AEO article drafts added

### Overview

Created a recurring Codex automation that runs every Monday at 13:00 Asia/Jakarta to use DataForSEO keyword data from `dataforseo.env`, find low-competition/high-volume climbing keyword opportunities, avoid duplicate topics by checking published blog content, and create three SEO/AEO optimized articles with hero images.

### Current Keyword Thresholds

- Low competition: keyword difficulty `<= 30`
- High search volume: monthly search volume `>= 100`
- Categories are selected by keyword intent.
- Do not use or link to `https://climbingbusinessjournal.com/`.
- Articles should include relevant internal links across blog, search, category, state/city, tools, and other public pages where useful.

### Files Added

1. `src/content/blog/rock-climbing-classes-beginner-guide.mdx`
2. `src/content/blog/how-many-calories-does-rock-climbing-burn.mdx`
3. `src/content/blog/benefits-of-rock-climbing.mdx`
4. `public/images/blog/rock-climbing-classes-beginner-guide.png`
5. `public/images/blog/how-many-calories-does-rock-climbing-burn.png`
6. `public/images/blog/benefits-of-rock-climbing.png`

### Implementation Notes

- Selected this week's topics from DataForSEO results after checking the existing `src/content/blog` inventory.
- Primary keyword metrics used:
  - `rock climbing classes`: search volume 880, KD 6
  - `how many calories does rock climbing burn`: search volume 390, KD 1
  - `benefits of rock climbing`: search volume 390, KD 10
- Hero images were generated as ultra-realistic indoor climbing scenes and saved as project-local PNG assets.
- Automation is configured to leave weekly article files uncommitted for review until publishing quality is approved.

## 🔐 AvantLink Homepage Verification Tag Refresh (COMPLETED)

**Completed:** 2026-04-03
**Status:** ✅ Temporary homepage verification tag updated

### Overview

Replaced the older temporary AvantLink affiliate application verification script on the homepage with the latest `authResponse` token provided for the active application review.

### Files Modified

1. `src/pages/index.astro`

### Implementation Notes

- The script is injected only on the homepage through the `head` slot in `BaseLayout`.
- Current verification script source:
  - `http://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=a84e373bc4486d93f40ebeb237fcc51dc66a184a`
- This tag is intended to be temporary and can be removed after AvantLink confirms successful placement.

## 🔗 Climbro Mention Autolink Pass (COMPLETED)

**Completed:** 2026-04-03
**Status:** ✅ Plain-text Climbro brand mentions in key affiliate articles now render as outbound tracked links

### Overview

Added a targeted MDX remark transform that converts plain article-body mentions of `Climbro`, `Climbro Mini`, and `Climbro Pro` into outbound affiliate links for the current Climbro article cluster and adjacent support articles.

### Files Modified

1. `astro.config.mjs`
2. `src/utils/remarkAutolinkClimbroMentions.mjs`

### Implementation Notes

- Scope is intentionally limited to the specific blog article slugs in the current Climbro/support set.
- Existing internal article links are left alone.
- Existing explicit `ClimbroTrackedLink` components remain valid and are not replaced.
- Inline-code mentions such as ``Climbro Mini`` now become clickable while keeping the code-style visual treatment.
- Plain-text generic `Climbro` mentions route to `https://climbro.com/`.
- Plain-text `Climbro Mini` and `Climbro Pro` mentions route to their product pages and include the existing affiliate parameters and tracking attributes.

---

## 🔐 Cross-Subdomain Authentication & SSR/SSG Resolution (COMPLETED)

**Completed:** 2025-11-11
**Status:** ✅ Working with hybrid rendering approach

### Problem Statement

After dashboard auth was fixed, directory site still showed "Login/Signup" even when logged in. Investigation revealed pages were **pre-rendered at build time (SSG)**, making cookies inaccessible during render.

### Root Cause: Static Site Generation (SSG)

**The Issue:**
- Pages had `export const prerender = true`
- Astro pre-renders these pages at BUILD time (no user visiting)
- At build time: No HTTP request = No cookies = No auth state
- `Astro.request.headers.get('cookie')` returns empty string
- All users see same pre-built HTML (always "Login/Signup")

**Build Log Evidence:**
```
[WARN] `Astro.request.headers` was used when rendering the route...
`Astro.request.headers` is not available on prerendered pages.
```

### The Solution: Hybrid SSR/SSG Rendering

**Approach:** Use Server-Side Rendering (SSR) for pages that need auth, keep Static Generation (SSG) for content pages.

**SSR Pages (render on each request - show auth):**
- Homepage (`/`)
- About, Contact, Privacy, Terms
- States listing (`/states`)
- Categories listing (`/categories`)  
- Blog index (`/guides`)
- Search page (`/search`)
- **Removed:** `export const prerender = true`

**SSG Pages (pre-render at build - no auth):**
- Individual gym pages (`/gyms/[slug]`)
- State pages (`/wa`, `/tx`, etc.)
- City pages (`/wa/seattle`, etc.)
- Category pages (`/categories/bouldering/1`, etc.)
- Individual blog posts (`/guides/[slug]`)
- **Kept:** `export const prerender = true`

### Why Hybrid Approach?

**Benefits:**
1. ✅ **Auth works where it matters** - Homepage and navigation show email
2. ✅ **Performance optimized** - Detail pages are fast (pre-built)
3. ✅ **Lower costs** - Fewer Vercel function invocations
4. ✅ **Scalability** - 400+ pages pre-built vs rendered on-demand

**Trade-offs:**
- ⚠️ Detail pages always show "Login/Signup" (same for all users)
- ⚠️ But content is public anyway (no personalization needed)

### Implementation Details

**Astro Config:**

File: `astro.config.mjs`

```javascript
export default defineConfig({
  site: 'https://www.indoorclimbinggym.com',
  output: 'server', // Enable SSR by default
  adapter: vercel(),
  // ... other config
});
```

**SSR Pages** (auth working):
- BaseLayout checks auth: `const { data: { user } } = await supabase.auth.getUser()`
- Shows email dropdown if logged in
- Shows Login/Signup if not logged in

**SSG Pages** (pre-rendered):
- Still use `export const prerender = true`
- Still use `getStaticPaths()` to generate pages
- Always show Login/Signup (built once without user context)

**Cookie Access:**

File: `src/lib/supabase.ts`

```typescript
export function createClient(Astro: any) {
  const isDevelopment = import.meta.env.DEV
  const cookieDomain = isDevelopment ? undefined : '.indoorclimbinggym.com'

  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          // Parse cookies from HTTP request header
          const cookieHeader = Astro.request.headers.get('cookie')
          if (!cookieHeader) return []

          return cookieHeader
            .split(';')
            .map(cookie => cookie.trim())
            .filter(cookie => cookie.length > 0)
            .map(cookie => {
              const [name, ...valueParts] = cookie.split('=')
              return {
                name: name.trim(),
                value: valueParts.join('=').trim()
              }
            })
            .filter(cookie => cookie.name && cookie.value)
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            Astro.cookies.set(name, value, {
              ...options,
              domain: cookieDomain,
            })
          })
        },
      },
    }
  )
}
```

### Files Modified

**17 files total:**

**Removed `prerender = true` (12 files - now SSR):**
1. `src/pages/index.astro` (homepage)
2. `src/pages/about.astro`
3. `src/pages/contact.astro`
4. `src/pages/404.astro`
5. `src/pages/states.astro`
6. `src/pages/categories/index.astro`
7. `src/pages/guides/index.astro`
8. `src/pages/guides/tips.astro`
9. `src/pages/guides/gear.astro`
10. `src/pages/guides/reviews.astro`
11. `src/pages/guides/industry.astro`
12. `src/pages/guides/guides.astro`

**Kept `prerender = true` (5 files - still SSG):**
1. `src/pages/gyms/[slug].astro` (15 gym pages)
2. `src/pages/[state]/index.astro` (8 state pages)
3. `src/pages/[state]/[city]/[page].astro` (5 city pages)
4. `src/pages/categories/[category]/[page].astro` (14 category pages)
5. `src/pages/guides/[...slug].astro` (5 blog posts)

**Why These 5 Need `prerender = true`:**
- They use `getStaticPaths()` to generate multiple pages
- Without `prerender = true`, Astro doesn't know which pages to generate
- Results in 500 errors at runtime

### Performance Impact

**Before (Full SSG):**
- Build time: ~4s
- Page load: ~50ms (pre-built HTML)
- Zero function invocations

**After (Hybrid SSR/SSG):**
- Build time: ~3s (fewer pages to build)
- SSR pages: ~100-200ms (edge functions)
- SSG pages: ~50ms (pre-built HTML)
- Function invocations: ~10-20% of traffic

**Still very fast on Vercel Edge!**

### Testing Results

**✅ Working:**
- Homepage shows logged-in user email + dropdown
- All SSR pages show correct auth state
- Navigation shows personalized menu
- SSG pages load fast (pre-built)

**⚠️ Expected Behavior:**
- Gym detail pages show "Login/Signup" for everyone
- State/city pages show "Login/Signup" for everyone
- This is acceptable (public content, no personalization needed)

### Future Enhancement: Full SSR Conversion

**Status:** Not Implemented (Deferred)

**What it would do:**
- Remove all `export const prerender = true`
- Convert all dynamic pages to runtime rendering
- Every page shows personalized auth state

**How to implement:**
1. Remove `export const prerender = true` from 5 dynamic pages
2. Replace `getStaticPaths()` with runtime data fetching:

```typescript
// BEFORE (SSG)
export const prerender = true;
export async function getStaticPaths() {
  const gyms = await fetchGyms();
  return gyms.map(gym => ({
    params: { slug: gym.slug },
    props: { gym }
  }));
}
const { gym } = Astro.props;

// AFTER (SSR)
const { slug } = Astro.params;
const gyms = await fetchGyms();
const gym = gyms.find(g => g.slug === slug);

if (!gym) {
  return Astro.redirect('/404');
}
```

3. Deploy and test
4. Monitor performance and costs

**Pros:**
- ✅ Every page shows personalized auth
- ✅ Consistent user experience
- ✅ No "Login/Signup" on detail pages

**Cons:**
- ⚠️ Slower page loads (~200-300ms vs ~50ms)
- ⚠️ Higher Vercel function invocations
- ⚠️ Potentially higher costs

**Effort:** ~15-20 minutes
**Risk:** Low-medium (easy to revert)
**Decision:** User prefers current hybrid approach to save costs

---

## 📊 Project Overview

**Site:** https://www.indoorclimbinggym.com
**Status:** 95% Complete (19/20 tasks done)
**Pages:** 57 total (mix of SSR and SSG)
**Content:** ~70,000+ words

### Page Breakdown

**SSR Pages (12 pages - show auth):**
- 1 Homepage
- 4 Static pages (About, Contact, Privacy, Terms)
- 1 States index
- 1 Categories index
- 5 Blog category pages
- 1 Custom 404

**SSG Pages (47 pages - pre-rendered):**
- 15 Gym detail pages
- 5 State pages
- 5 City pages
- 14 Category listing pages
- 5 Blog posts
- 1 Search page (hybrid - SSR with prerender:false)

### Tech Stack

- **Framework:** Astro v4
- **Styling:** TailwindCSS v4 (via Vite plugin)
- **Deployment:** Vercel (with @astrojs/vercel adapter)
- **Rendering:** Hybrid SSR/SSG
- **API:** Next.js dashboard API (gym data source)
- **Auth:** Supabase (shared cookies with dashboard)

### Brand Colors

```css
@theme {
  --color-sage: #98a48b;    /* Primary brand color */
  --color-granite: #555;     /* Text color */
  --color-ivory: #f8f8f5;    /* Background */
}
```

---

## 🚀 Key Features

### SEO Optimization
- Comprehensive meta tags (titles, descriptions, keywords)
- JSON-LD schema markup (LocalBusiness, ItemList, FAQPage, etc.)
- Sitemap generation (52 URLs)
- robots.txt configuration
- OpenGraph and Twitter Cards
- Breadcrumb navigation with schema

### Performance
- Optimized images with Unsplash CDN
- Responsive srcset generation
- Lazy loading below-fold images
- CSS code splitting
- Minimal JavaScript (mostly static)
- 70-88% bandwidth savings

### Internal Linking
- 500+ internal links across all pages
- Dynamic category links on gym pages
- Related gym suggestions
- Helpful guides sections
- Cross-page navigation

### Content
- 15 detailed gym pages (800-1200 words each)
- 5 state landing pages (2000-2500 words each)
- 5 city landing pages (1500-2000 words each)
- 14 category pages (1200-1800 words each)
- 5 blog posts (1500-3100 words each)

---

## 🔗 Cross-Domain Integration

### Dashboard Integration

**Dashboard URL:** https://dashboard.indoorclimbinggym.com
**Shared Components:**
- Supabase auth cookies (domain: `.indoorclimbinggym.com`)
- Gym data API
- User profiles

**Authentication Flow:**
1. User logs in on dashboard
2. Cookies set with `.indoorclimbinggym.com` domain
3. Visits www site
4. SSR pages read cookies from request headers
5. Shows personalized navigation (email + dropdown)

**Automatic Rebuilds:**
- Dashboard triggers Vercel webhook on gym data changes
- Directory site rebuilds automatically (~2-3 minutes)
- Keeps content in sync

---

## 📝 Content Collections

### Blog System

**Location:** `/src/content/blog/`
**Schema:** Defined in `/src/content/config.ts`

**Fields:**
- title (string, used for visible post title/H1)
- seoTitle (string, optional, <=70 chars recommended for title tag)
- description (string, 150-160 chars)
- publishedDate (Date)
- updatedDate (Date, optional)
- author (string)
- category ('guides' | 'tips' | 'reviews' | 'industry' | 'gear')
- tags (string[], 5-6 tags)
- featured (boolean, default: false)
- heroImage (string, path to image)
- heroImageAlt (string, accessibility)
- wordCount (number, optional)
- readingTime (number, optional minutes)

### Content Validation Note

- Blog post frontmatter is build-blocking if it violates the schema in `/src/content/config.ts`
- `description` remains capped at 160 characters
- `title` is no longer hard-capped for SEO; use optional `seoTitle` when the visible H1 can be longer than the preferred browser/search title
- Title tags should prioritize the full query/topic and only append the brand when it fits without truncating the main phrase
- Recent SEO update on 2026-03-17: the 4 Climbro blog posts were retitled to match search intent more directly and reduce low-CTR phrasing like "official pages" in title tags

**Blog Posts:**
1. Cost guide (2,150 words)
2. Bouldering vs rope climbing (2,047 words)
3. Beginners guide (3,119 words)
4. What to wear (2,647 words)
5. Membership worth it (2,992 words)

---

## 🎨 Components

### Reusable Components

- **GymCard.astro** - Gym listing card
- **OptimizedImage.astro** - Responsive image with srcset
- **CategoryLinks.astro** - Dynamic category pills
- **HelpfulGuides.astro** - Blog post recommendations
- **FilterSidebar.astro** - Search filters
- **SearchBar.astro** - Search input
- **GymMap.astro** - Interactive map component

### Layouts

- **BaseLayout.astro** - Foundation with SEO, schema, auth checking

---

## 🔧 Utilities

### SEO Utilities (`/src/utils/seo.ts`)

- `generateSEO()` - Master SEO generator
- `generateGymTitle()` - Gym page titles
- `generateGymDescription()` - Gym descriptions
- `generateCityTitle()` - City page titles
- `generateStateTitle()` - State page titles
- `generateBlogPostTitle()` - Blog titles

### Schema Utilities (`/src/utils/schema.ts`)

- `generateGymSchema()` - LocalBusiness + SportsActivityLocation
- `generateItemListSchema()` - For listings
- `generateFAQSchema()` - FAQ structured data
- `generateBreadcrumbSchema()` - Navigation breadcrumbs
- `generateArticleSchema()` - Blog articles
- `generateOrganizationSchema()` - Site-level organization

### Image Utilities (`/src/utils/imageUtils.ts`)

- `optimizeUnsplashUrl()` - Unsplash CDN optimization
- `generateSrcSet()` - Responsive srcset generation
- Predefined sizes for cards, heroes, thumbnails

---

**Last Updated:** 2026-03-17 (blog title-tag strategy updated; Climbro blog metadata optimized)
**Status:** Production-ready with hybrid rendering approach
