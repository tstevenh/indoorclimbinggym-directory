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
- Dashboard changes (update `/rockclimbing-dashboard/.claude/CLAUDE.md` instead)
- Next.js specific changes
- Admin features, user management
- Stripe/billing changes

---

# 🎯 Directory Project: IndoorClimbingGym.com

**URL:** https://www.indoorclimbinggym.com
**Tech Stack:** Astro v4, TypeScript, TailwindCSS v4, Vercel
**Purpose:** SEO-optimized public directory of climbing gyms
**Rendering:** Hybrid SSR/SSG (Server-Side + Static Generation)

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
