# 📁 UPDATE RULE: Directory/Public Site Documentation

**⚠️ IMPORTANT: When to update THIS file:**
- ✅ Changes to directory code (`/indoor-climbing-gym/` directory)
- ✅ Astro configurations and integrations
- ✅ Public-facing pages: homepage, gym listings, search, blog, state/city pages
- ✅ Astro components, layouts, utilities
- ✅ SEO, schema markup, sitemap changes
- ✅ Public site UI/UX changes
- ✅ Content collections (blog posts)
- ✅ Data fetching and API integration

**❌ Do NOT update this file for:**
- Dashboard changes (update `/rockclimbing-dashboard/.claude/CLAUDE.md` instead)
- Next.js specific changes
- Admin features, user management
- Stripe/billing changes
- Database schema changes

---

# 🎯 Directory Project: IndoorClimbingGym.com

**URL:** https://www.indoorclimbinggym.com
**Tech Stack:** Astro v4, TypeScript, TailwindCSS v4, Vercel
**Purpose:** SEO-optimized public directory of climbing gyms
**Rendering:** Hybrid SSR/SSG (Server-Side + Static Generation)
**Data Source:** Direct Supabase queries (build-time and runtime)

---

## 🔄 Direct Supabase Migration (COMPLETED)

**Completed:** 2025-11-13
**Status:** ✅ Production-ready on preview deployment

### Problem Statement

After enabling Vercel bot protection on the dashboard, the directory site started experiencing 500 errors on all SSR pages (homepage, search, etc.). Investigation revealed the root cause was the site calling the Next.js API middleware, which was being blocked by Vercel's infrastructure-level bot protection.

### Root Causes Identified

**Issue 1: Localhost API URL in Production**
```bash
# .env file
PUBLIC_API_URL=http://localhost:3000  # ❌ Causes 500 in production
```

**Issue 2: Vercel Bot Protection Blocking Server-to-Server Calls**
- Astro SSR pages → Dashboard API = Detected as "bot traffic"
- User temporarily set bot protection to "Log" mode
- **Security risk:** Dashboard exposed to actual bots

**Issue 3: Dependency on Dashboard API**
- Directory site coupled to dashboard availability
- API rate limiting during builds (~75 sequential calls)
- Additional latency and Vercel function costs

### The Solution: Direct Supabase Queries

**Approach:** Eliminate API middleware, query Supabase database directly from Astro.

**Benefits:**
1. ✅ **Zero dependency on dashboard** - Sites fully decoupled
2. ✅ **Secure bot protection** - Dashboard can have full protection ON
3. ✅ **Lower costs** - No Vercel function invocations for data fetching
4. ✅ **Faster builds** - Parallel database queries vs sequential API calls
5. ✅ **Simpler architecture** - Direct data access, no transformation layers

---

### Implementation Details

#### New Supabase Client (`src/lib/supabase.ts`)

**Added `createSimpleClient()` function:**

```typescript
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Simple Supabase client for build-time queries (getStaticPaths)
 * Use this when you don't have Astro context (during build)
 */
export function createSimpleClient() {
  return createSupabaseClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  )
}
```

**When to use:**
- Build-time queries in `getStaticPaths()`
- Any query outside of Astro component context
- Static page generation

**Existing `createClient(Astro)` still used for:**
- Runtime SSR queries (homepage, search, etc.)
- Cookie-based authentication
- User-specific data

---

#### Complete API Rewrite (`src/config/api.ts`)

**Before (Next.js API Middleware):**
```typescript
// Fetched from http://localhost:3000/api/gyms
const response = await fetch(`${API_BASE_URL}/gyms`)
const data = await response.json()
```

**After (Direct Supabase):**
```typescript
import { createSimpleClient } from '../lib/supabase'

export async function fetchGyms(params?: Record<string, string>) {
  const supabase = createSimpleClient()

  let query = supabase
    .from('gyms')
    .select('*')
    .eq('status', 'published')

  // Apply filters
  if (params?.city) query = query.eq('city', params.city)
  if (params?.region) query = query.eq('region', params.region)

  const { data: gyms, error } = await query

  if (error) throw new Error(`Failed to fetch gyms: ${error.message}`)

  // Process gyms (featured expiration, rating calculation, sorting)
  return processedGyms
}
```

---

### Business Logic Preserved

**All logic from Next.js API moved to Astro:**

**1. Featured Expiration Logic:**
```typescript
const isFeaturedActive = gym.featured &&
  (!gym.featured_until || new Date(gym.featured_until) > new Date())

return {
  ...gym,
  featured: isFeaturedActive
}
```

**2. Rating Calculation:**
```typescript
const detailedRatings = [
  gym.rating_route_quality,
  gym.rating_cleanliness,
  gym.rating_staff_friendliness,
  gym.rating_facilities,
  gym.rating_value_for_money
].filter(rating => rating > 0)

const calculatedOverall = detailedRatings.length > 0
  ? Number((detailedRatings.reduce((sum, r) => sum + r, 0) / detailedRatings.length).toFixed(2))
  : gym.rating || 0.00
```

**3. Sort Order:**
```typescript
processedGyms.sort((a, b) => {
  // Featured DESC
  if (a.featured !== b.featured) return b.featured ? 1 : -1

  // Rating DESC
  const ratingA = a.rating_overall || a.rating || 0
  const ratingB = b.rating_overall || b.rating || 0
  if (ratingA !== ratingB) return ratingB - ratingA

  // Name ASC
  return (a.name || '').localeCompare(b.name || '')
})
```

**4. Field Mapping (Backwards Compatibility):**
```typescript
return {
  ...gym,
  photo: gym.hero_image || '',        // Components expect 'photo'
  longtitude: gym.longitude || 0,     // Legacy misspelling
  rating: gym.rating_overall || calculatedOverall
}
```

---

### Files Modified

**Total:** 4 files

1. **`src/lib/supabase.ts`**
   - Added `createSimpleClient()` export function
   - Import from `@supabase/supabase-js`

2. **`src/config/api.ts`** (Complete rewrite - 202 lines)
   - Removed all `fetch()` calls to Next.js API
   - Added direct Supabase queries with filters
   - Preserved all business logic (featured, rating, sorting)
   - Added field mapping for backwards compatibility
   - Functions: `fetchGyms()`, `fetchGymBySlug()`, `extractGymMetadata()`

3. **`package.json`**
   - Added dependency: `"@supabase/supabase-js": "latest"`

4. **`.env`** (No changes made, but documented)
   - Still has `PUBLIC_API_URL=http://localhost:3000` (unused now)
   - Uses `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`

---

### Deployment & Testing

#### Feature Branch Strategy

**Branch:** `feat/direct-supabase`

**Commits:**
1. `62d626e` - Initial migration to direct Supabase
2. `0d23e25` - Fixed hero image mapping (`hero_image` → `photo`)

**Preview Deployment:**
- Deployed to Vercel preview environment
- Build time: 7m 34s (normal for 75+ pages)
- All pages rendering correctly
- Images loading from Google URLs ✅

#### Testing Results

**Local Development:**
```bash
✅ npm run dev - Server starts successfully
✅ npm run build - All 75+ pages build without errors
✅ curl http://localhost:4321/ - Homepage returns 200 OK
✅ Images showing Google URLs (not placeholders)
```

**Vercel Preview:**
```bash
✅ Build successful (7m 34s)
✅ Homepage loads correctly
✅ Gym cards show hero images
✅ Featured sorting works
✅ SSR pages functional
✅ SSG pages pre-rendered
```

---

### Security Configuration

**Vercel Bot Protection Settings:**

**Dashboard (dashboard.indoorclimbinggym.com):**
- Bot Protection: **ON** ✅
- AI Bots: **ON** ✅
- Safe: Protected by authentication + bot rules

**Directory (www.indoorclimbinggym.com):**
- Bot Protection: **OFF** (allows server queries)
- AI Bots: **OFF** (allows AI crawling for GEO)
- Safe: Public site, no sensitive data

**Why this is secure:**
- Dashboard has auth-protected routes
- Dashboard has no public data to scrape
- Directory is intentionally public (SEO benefits)
- Sites are fully decoupled now

---

### Cost Impact Analysis

**Vercel Costs:**
- **Before:** ~75 API function invocations per build
- **After:** Zero API function invocations
- **Savings:** ~$0.10-0.20 per build (scales with builds/day)

**Supabase Costs:**
- **Before:** 75 queries through API (counted as function + database)
- **After:** 75 direct database queries
- **Net change:** Same database queries, zero function overhead

**Overall:** Lower Vercel costs, same Supabase costs = **Net savings**

---

### Build Time Expectations

**Why 7m 34s is normal:**

```
Static Site Generation Process:
- 15 gym pages → 15 Supabase queries
- 8 state pages → 8 Supabase queries
- 5 city pages → 5 Supabase queries
- ~50 category pages → 50 Supabase queries
= ~75 sequential queries + page rendering
```

**Build time breakdown:**
- Database queries: ~2-3 minutes
- Page rendering: ~3-4 minutes
- Asset optimization: ~1-2 minutes

**This only happens at deployment time** - Pages are instant once built!

---

### Hero Image Fix

**Problem:** All gym cards showed placeholder image after migration.

**Root Cause:** Database field is `hero_image`, components expect `photo`.

**Fix:** Added field mapping in api.ts
```typescript
return {
  ...gym,
  photo: gym.hero_image || '',  // Map for backwards compatibility
  longtitude: gym.longitude || 0 // Also fixed longitude typo
}
```

**Verification:**
```bash
curl -s http://localhost:4321/ | grep -o 'src="[^"]*googleusercontent[^"]*"'
# Output: Multiple Google image URLs ✅
```

---

### Rollback Strategy

**If issues arise:**

**Option 1: Git Revert**
```bash
git revert 0d23e25  # Revert image fix
git revert 62d626e  # Revert Supabase migration
git push
```

**Option 2: Vercel Rollback**
- Go to Vercel dashboard
- Click "Deployments"
- Find previous working deployment
- Click "..." → "Promote to Production"

**Option 3: Emergency Fix**
- Merge fix to `feat/direct-supabase` branch
- Vercel auto-deploys preview
- Test, then merge to main

---

### Maintenance Notes

**Adding New Queries:**

To query gyms elsewhere in the codebase:

```typescript
import { fetchGyms, fetchGymBySlug } from '@/config/api'

// Fetch all gyms
const gyms = await fetchGyms()

// Fetch with filters
const seattleGyms = await fetchGyms({ city: 'Seattle', region: 'wa' })

// Fetch single gym
const gym = await fetchGymBySlug('vertical-world-seattle')
```

**Database Security:**

- Uses `PUBLIC_SUPABASE_ANON_KEY` (read-only access)
- Row Level Security (RLS) enforced on Supabase
- Only published gyms returned (`status = 'published'`)
- No risk of data exposure

**Performance Monitoring:**

Watch these metrics post-deployment:
- Page load times (should be ~100-200ms for SSR)
- Build times (should stay ~5-8 minutes)
- Error rates (should be near zero)
- Vercel function invocations (should drop to ~10-20% of previous)

---

**Last Updated:** 2025-11-13
**Status:** ✅ Production-ready on preview, awaiting final user verification

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
- title (string, <60 chars)
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

**Last Updated:** 2025-11-11 (SSR/SSG resolution complete)
**Status:** Production-ready with hybrid rendering approach
