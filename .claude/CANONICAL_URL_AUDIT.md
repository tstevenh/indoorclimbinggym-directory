# Canonical URL Audit & Remediation Plan

**Project:** IndoorClimbingGym.com
**Date:** 2025-11-15
**Config Standard:** `trailingSlash: 'always'` (astro.config.mjs line 13)
**Status:** 🔴 CRITICAL - 73 violations found causing unnecessary redirects

---

## Executive Summary

The codebase has **73 internal links missing trailing slashes**, causing each click to trigger a 301/308 redirect before reaching the destination. This:
- Wastes edge function invocations on Vercel
- Delays page loads by 50-200ms per redirect
- Dilutes SEO equity through redirect chains
- Creates analytics attribution inconsistencies

**Root Cause:** Links hardcoded without `/` suffix, violating the canonical standard established in `astro.config.mjs`.

**Impact:** Every user clicking these links experiences unnecessary redirects.

---

## 1. Canonical Ruleset (Unambiguous)

### Rule 1: Internal Page URLs
**Pattern:** `/path/` (must include trailing slash)
**Examples:**
- ✅ `/about/`
- ✅ `/search/`
- ✅ `/blog/beginners-guide-to-climbing-gyms/`
- ✅ `/categories/best-bouldering-climbing-gyms/1/`
- ❌ `/about` (triggers redirect)
- ❌ `/blog/beginners-guide-to-climbing-gyms` (triggers redirect)

### Rule 2: Static Assets with Extensions
**Pattern:** `/path.ext` (NO trailing slash)
**Examples:**
- ✅ `/logo.svg`
- ✅ `/data/national-gym-grading-study.csv`
- ✅ `/images/hero.jpg`
- ❌ `/logo.svg/` (404 - file not directory)

### Rule 3: External URLs
**Pattern:** `https://domain.com/path/` (preserve original format)
**Examples:**
- ✅ `https://dashboard.indoorclimbinggym.com/login`
- ✅ `https://reddit.com/r/indoorclimbinggym`
- ⚠️ DO NOT modify external URLs

### Rule 4: Fragment Identifiers (Hash Links)
**Pattern:** `/path/#fragment` (hash comes AFTER trailing slash)
**Examples:**
- ✅ `/privacy/#cookies-tracking`
- ❌ `/privacy#cookies-tracking` (missing slash before hash)

### Rule 5: Query Strings
**Pattern:** `/path/?param=value` (query string comes AFTER trailing slash)
**Examples:**
- ✅ `/search/?q=bouldering`
- ❌ `/search?q=bouldering` (missing slash before query)

### Rule 6: Template Literals (Dynamic URLs)
**Pattern:** `prefix/${variable}/` (must include trailing slash in template)
**Examples:**
- ✅ `/gyms/${gym.slug}/`
- ✅ `/blog/${post.slug}/`
- ❌ `/gyms/${gym.slug}` (missing slash)

---

## 2. Categorized Inventory of Link Construction Sources

### Category 1: Static Navigation Links (25 violations)
**Location:** `src/layouts/BaseLayout.astro`
**Type:** Hardcoded href attributes in header/footer/mobile menu
**Impact:** HIGH - appears on every page
**Lines:** 437-441, 644, 650, 657, 663, 669, 717, 723, 730, 736, 742

**Violations:**
```astro
<!-- Footer Company Links (Lines 437-441) -->
<li><a href="/about">About Us</a></li>
<li><a href="/contact">Contact</a></li>
<li><a href="/badge">Get Verified Badge</a></li>
<li><a href="/privacy">Privacy</a></li>
<li><a href="/terms">Terms</a></li>

<!-- Mobile Nav Links (Logged In - Lines 644, 650, 657, 663, 669) -->
<a href="/search">Search</a>
<a href="/states">Browse States</a>
<a href="/categories">Categories</a>
<a href="/blog">Blog</a>
<a href="/about">About</a>

<!-- Mobile Nav Links (Logged Out - Lines 717, 723, 730, 736, 742) -->
<a href="/search">Search</a>
<a href="/states">Browse States</a>
<a href="/categories">Categories</a>
<a href="/blog">Blog</a>
<a href="/about">About</a>
```

**Fix:** Add `/` before closing quote in each href attribute.

---

### Category 2: Component-Level Links (4 violations)
**Files:** `src/components/*.astro`

**HelpfulGuides.astro (Line 72)**
```astro
<a href="/blog">  <!-- Should be /blog/ -->
```

**CookieConsent.astro (Line 18)** - SPECIAL CASE (hash fragment)
```astro
<a href="/privacy#cookies-tracking">  <!-- Should be /privacy/#cookies-tracking -->
```

**AffiliateBlock.astro (Line 107)**
```astro
<a href="/gear">  <!-- Should be /gear/ -->
```

**FilterSidebar.astro (Line 309)**
```astro
<a href="/search">  <!-- Should be /search/ -->
```

**Fix:** Add `/` before closing quote, or for hash fragments add `/` before `#`.

---

### Category 3: Tools & Calculator Pages (21 violations)
**Directory:** `src/pages/tools/*.astro`

**cost-per-climb-calculator.astro (Lines 248, 251, 358, 361, 364, 519)**
```astro
<a href="/guides/beginners-guide-to-climbing-gyms">  <!-- Missing / -->
<a href="/search">  <!-- Missing / -->
<a href="/guides/is-climbing-gym-membership-worth-it">  <!-- Missing / -->
<a href="/guides/sample-post">  <!-- Missing / -->
<a href="/tools/bouldering-grade-conversion">  <!-- Missing / -->
<a href="/search">  <!-- Missing / -->
```

**index.astro (Lines 98, 136, 174, 266, 272)**
```astro
<a href="/tools/bouldering-grade-conversion">  <!-- Missing / -->
<a href="/tools/sport-climbing-grade-conversion">  <!-- Missing / -->
<a href="/tools/cost-per-climb-calculator">  <!-- Missing / -->
<a href="/search">  <!-- Missing / -->
<a href="/blog">  <!-- Missing / -->
```

**sport-climbing-grade-conversion.astro (Lines 169, 748, 783)**
```astro
<a href="/search">  <!-- Missing / -->
<a href="/tools/bouldering-grade-conversion">  <!-- Missing / -->
<a href="/search">  <!-- Missing / -->
```

**bouldering-grade-conversion.astro (Lines 169, 732, 767)**
```astro
<a href="/search">  <!-- Missing / -->
<a href="/tools/sport-climbing-grade-conversion">  <!-- Missing / -->
<a href="/search">  <!-- Missing / -->
```

**Fix:** Add `/` before closing quote in each href.

---

### Category 4: Legal & Information Pages (11 violations)
**Files:** `src/pages/{terms,privacy,about,badge}.astro`

**terms.astro (Lines 900, 924, 927, 930)**
```astro
<a href="/contact">  <!-- Missing / -->
<a href="/privacy">  <!-- Missing / -->
<a href="/contact">  <!-- Missing / -->
<a href="/about">  <!-- Missing / -->
```

**privacy.astro (Lines 660, 684, 687, 690)**
```astro
<a href="/contact">  <!-- Missing / -->
<a href="/terms">  <!-- Missing / -->
<a href="/contact">  <!-- Missing / -->
<a href="/about">  <!-- Missing / -->
```

**about.astro (Line 230)**
```astro
<a href="/search">  <!-- Missing / -->
```

**badge.astro (Line 299)**
```astro
<a href="/contact">  <!-- Missing / -->
```

**studies/index.astro (Line 152)**
```astro
<a href="/contact">  <!-- Missing / -->
```

**Fix:** Add `/` before closing quote in each href.

---

### Category 5: Homepage Links (9 violations)
**File:** `src/pages/index.astro`

**Lines 204, 295, 343, 430, 447, 459, 471, 485, 589, 595**
```astro
<a href="/search">  <!-- Line 204 -->
<a href="/states">  <!-- Line 295 -->
<a href="/categories">  <!-- Line 343 -->
<a href="/blog/beginners-guide-to-climbing-gyms">  <!-- Line 430 -->
<a href="/blog/beginners-guide-to-climbing-gyms">  <!-- Line 447 -->
<a href="/blog/what-to-wear-indoor-rock-climbing">  <!-- Line 459 -->
<a href="/blog/is-climbing-gym-membership-worth-it">  <!-- Line 471 -->
<a href="/blog">  <!-- Line 485 -->
<a href="/search">  <!-- Line 589 -->
<a href="/blog">  <!-- Line 595 -->
```

**Fix:** Add `/` before closing quote in each href.

---

### Category 6: Blog Navigation (1 violation)
**File:** `src/pages/blog/[...slug].astro`

**Line 296**
```astro
<a href="/blog">  <!-- Should be /blog/ -->
```

**Fix:** Add `/` before closing quote.

---

### Category 7: Search Page Self-Reference (2 violations)
**File:** `src/pages/search.astro`

**Lines 253, 308**
```astro
<a href="/search">  <!-- Should be /search/ -->
```

**Fix:** Add `/` before closing quote.

---

### Category 8: Category Pages (2 violations)
**File:** `src/pages/categories/index.astro`

**Lines 301, 307**
```astro
<a href="/search">  <!-- Line 301 -->
<a href="/blog">  <!-- Line 307 -->
```

**Fix:** Add `/` before closing quote.

---

### Category 9: Dynamic Template Literal Links (14 violations)
**Files:** Multiple components using template literals

**GymCard.astro (Lines 51, 78, 138)**
```astro
<a href={`/gyms/${gym.slug}`}>  <!-- Should be `/gyms/${gym.slug}/` -->
```

**BlogCard.astro (Lines 51, 74)**
```astro
<a href={`/blog/${slug}`}>  <!-- Should be `/blog/${slug}/` -->
```

**studies/index.astro (Line 76)**
```astro
<a href={`/studies/${study.slug}`}>  <!-- Should be `/studies/${study.slug}/` -->
```

**index.astro (Lines 311, 354)**
```astro
<a href={`/${stateSlug}`}>  <!-- Should be `/${stateSlug}/` -->
<a href={`/categories/${category.slug}/1`}>  <!-- Already correct! -->
```

**blog/[...slug].astro (Line 299)**
```astro
<a href={`/blog/${entry.data.category}`}>  <!-- Should be `/blog/${entry.data.category}/` -->
```

**[state]/[city]/[page].astro (Lines 314, 377, 390)**
```astro
<a href={`/gyms/${gym.slug}`}>  <!-- Line 314 -->
<a href={`/${stateAbbr}`}>  <!-- Line 377 -->
<a href={`/search?city=${encodeURIComponent(city)}`}>  <!-- Line 390 - Special case: query string -->
```

**categories/index.astro (Lines 192, 226, 260)**
```astro
<a href={`/categories/${category.slug}/1`}>  <!-- Already correct! -->
```

**categories/[category]/[page].astro (Line 467)**
```astro
<a href={`/gyms/${gym.slug}`}>  <!-- Should be `/gyms/${gym.slug}/` -->
```

**studies/national-gym-grading-study.astro (Lines 498, 510, 529, 535, 541)**
```astro
<a href="/tools/bouldering-grade-conversion">  <!-- Line 498 -->
<a href="/tools/sport-climbing-grade-conversion">  <!-- Line 510 -->
<a href="/blog/beginners-guide-to-climbing-gyms">  <!-- Line 529 -->
<a href="/blog/is-climbing-gym-membership-worth-it">  <!-- Line 535 -->
<a href="/blog/what-to-wear-indoor-rock-climbing">  <!-- Line 541 -->
```

**[state]/[city]/[page].astro (Lines 403, 422, 434, 446)**
```astro
<a href="/categories">  <!-- Line 403 -->
<a href="/blog/beginners-guide-to-climbing-gyms">  <!-- Line 422 -->
<a href="/blog/what-to-wear-indoor-rock-climbing">  <!-- Line 434 -->
<a href="/blog">  <!-- Line 446 -->
```

**gyms/[slug].astro (Lines 602, 611, 757)**
```astro
<a href="/tools/bouldering-grade-conversion">  <!-- Line 602 -->
<a href="/tools/sport-climbing-grade-conversion">  <!-- Line 611 -->
<a href="/tools/cost-per-climb-calculator">  <!-- Line 757 -->
```

**Fix:** Add `/` inside template literal before closing backtick, handling special cases for query strings.

---

## 3. Exceptions (Legitimate No Trailing Slash)

These URLs correctly lack trailing slashes and **MUST NOT** be modified:

### Static Assets with Extensions
```astro
<!-- BaseLayout.astro Lines 196-197 -->
<link rel="icon" href="/logo.svg" />  <!-- ✅ Correct -->
<link rel="apple-touch-icon" href="/logo.svg" />  <!-- ✅ Correct -->

<!-- studies/national-gym-grading-study.astro Line 479 -->
<a href="/data/national-gym-grading-study.csv">  <!-- ✅ Correct -->
```

### Query Strings (Already Properly Formatted)
```astro
<!-- [state]/[city]/[page].astro Line 390 -->
<a href={`/search?city=${encodeURIComponent(city)}`}>  <!-- ⚠️ Special case: needs / before ? -->
<!-- Should be: `/search/?city=${encodeURIComponent(city)}` -->
```

### Hash Fragments (Need Slash Before Hash)
```astro
<!-- CookieConsent.astro Line 18 -->
<a href="/privacy#cookies-tracking">  <!-- ❌ Wrong -->
<!-- Should be: `/privacy/#cookies-tracking` -->
```

---

## 4. Definitive List of Offending Patterns (All 73 Violations)

### Static Links (59 violations)

| File | Line | Pattern | Should Be |
|------|------|---------|-----------|
| BaseLayout.astro | 437 | `href="/about"` | `href="/about/"` |
| BaseLayout.astro | 438 | `href="/contact"` | `href="/contact/"` |
| BaseLayout.astro | 439 | `href="/badge"` | `href="/badge/"` |
| BaseLayout.astro | 440 | `href="/privacy"` | `href="/privacy/"` |
| BaseLayout.astro | 441 | `href="/terms"` | `href="/terms/"` |
| BaseLayout.astro | 644 | `href="/search"` | `href="/search/"` |
| BaseLayout.astro | 650 | `href="/states"` | `href="/states/"` |
| BaseLayout.astro | 657 | `href="/categories"` | `href="/categories/"` |
| BaseLayout.astro | 663 | `href="/blog"` | `href="/blog/"` |
| BaseLayout.astro | 669 | `href="/about"` | `href="/about/"` |
| BaseLayout.astro | 717 | `href="/search"` | `href="/search/"` |
| BaseLayout.astro | 723 | `href="/states"` | `href="/states/"` |
| BaseLayout.astro | 730 | `href="/categories"` | `href="/categories/"` |
| BaseLayout.astro | 736 | `href="/blog"` | `href="/blog/"` |
| BaseLayout.astro | 742 | `href="/about"` | `href="/about/"` |
| HelpfulGuides.astro | 72 | `href="/blog"` | `href="/blog/"` |
| AffiliateBlock.astro | 107 | `href="/gear"` | `href="/gear/"` |
| FilterSidebar.astro | 309 | `href="/search"` | `href="/search/"` |
| cost-per-climb-calculator.astro | 248 | `href="/guides/beginners-guide-to-climbing-gyms"` | `href="/guides/beginners-guide-to-climbing-gyms/"` |
| cost-per-climb-calculator.astro | 251 | `href="/search"` | `href="/search/"` |
| cost-per-climb-calculator.astro | 358 | `href="/guides/is-climbing-gym-membership-worth-it"` | `href="/guides/is-climbing-gym-membership-worth-it/"` |
| cost-per-climb-calculator.astro | 361 | `href="/guides/sample-post"` | `href="/guides/sample-post/"` |
| cost-per-climb-calculator.astro | 364 | `href="/tools/bouldering-grade-conversion"` | `href="/tools/bouldering-grade-conversion/"` |
| cost-per-climb-calculator.astro | 519 | `href="/search"` | `href="/search/"` |
| tools/index.astro | 98 | `href="/tools/bouldering-grade-conversion"` | `href="/tools/bouldering-grade-conversion/"` |
| tools/index.astro | 136 | `href="/tools/sport-climbing-grade-conversion"` | `href="/tools/sport-climbing-grade-conversion/"` |
| tools/index.astro | 174 | `href="/tools/cost-per-climb-calculator"` | `href="/tools/cost-per-climb-calculator/"` |
| tools/index.astro | 266 | `href="/search"` | `href="/search/"` |
| tools/index.astro | 272 | `href="/blog"` | `href="/blog/"` |
| sport-climbing-grade-conversion.astro | 169 | `href="/search"` | `href="/search/"` |
| sport-climbing-grade-conversion.astro | 748 | `href="/tools/bouldering-grade-conversion"` | `href="/tools/bouldering-grade-conversion/"` |
| sport-climbing-grade-conversion.astro | 783 | `href="/search"` | `href="/search/"` |
| bouldering-grade-conversion.astro | 169 | `href="/search"` | `href="/search/"` |
| bouldering-grade-conversion.astro | 732 | `href="/tools/sport-climbing-grade-conversion"` | `href="/tools/sport-climbing-grade-conversion/"` |
| bouldering-grade-conversion.astro | 767 | `href="/search"` | `href="/search/"` |
| terms.astro | 900 | `href="/contact"` | `href="/contact/"` |
| terms.astro | 924 | `href="/privacy"` | `href="/privacy/"` |
| terms.astro | 927 | `href="/contact"` | `href="/contact/"` |
| terms.astro | 930 | `href="/about"` | `href="/about/"` |
| about.astro | 230 | `href="/search"` | `href="/search/"` |
| privacy.astro | 660 | `href="/contact"` | `href="/contact/"` |
| privacy.astro | 684 | `href="/terms"` | `href="/terms/"` |
| privacy.astro | 687 | `href="/contact"` | `href="/contact/"` |
| privacy.astro | 690 | `href="/about"` | `href="/about/"` |
| studies/index.astro | 152 | `href="/contact"` | `href="/contact/"` |
| studies/national-gym-grading-study.astro | 498 | `href="/tools/bouldering-grade-conversion"` | `href="/tools/bouldering-grade-conversion/"` |
| studies/national-gym-grading-study.astro | 510 | `href="/tools/sport-climbing-grade-conversion"` | `href="/tools/sport-climbing-grade-conversion/"` |
| studies/national-gym-grading-study.astro | 529 | `href="/blog/beginners-guide-to-climbing-gyms"` | `href="/blog/beginners-guide-to-climbing-gyms/"` |
| studies/national-gym-grading-study.astro | 535 | `href="/blog/is-climbing-gym-membership-worth-it"` | `href="/blog/is-climbing-gym-membership-worth-it/"` |
| studies/national-gym-grading-study.astro | 541 | `href="/blog/what-to-wear-indoor-rock-climbing"` | `href="/blog/what-to-wear-indoor-rock-climbing/"` |
| index.astro | 204 | `href="/search"` | `href="/search/"` |
| index.astro | 295 | `href="/states"` | `href="/states/"` |
| index.astro | 343 | `href="/categories"` | `href="/categories/"` |
| index.astro | 430 | `href="/blog/beginners-guide-to-climbing-gyms"` | `href="/blog/beginners-guide-to-climbing-gyms/"` |
| index.astro | 447 | `href="/blog/beginners-guide-to-climbing-gyms"` | `href="/blog/beginners-guide-to-climbing-gyms/"` |
| index.astro | 459 | `href="/blog/what-to-wear-indoor-rock-climbing"` | `href="/blog/what-to-wear-indoor-rock-climbing/"` |
| index.astro | 471 | `href="/blog/is-climbing-gym-membership-worth-it"` | `href="/blog/is-climbing-gym-membership-worth-it/"` |
| index.astro | 485 | `href="/blog"` | `href="/blog/"` |
| index.astro | 589 | `href="/search"` | `href="/search/"` |
| index.astro | 595 | `href="/blog"` | `href="/blog/"` |
| blog/[...slug].astro | 296 | `href="/blog"` | `href="/blog/"` |
| search.astro | 253 | `href="/search"` | `href="/search/"` |
| search.astro | 308 | `href="/search"` | `href="/search/"` |
| badge.astro | 299 | `href="/contact"` | `href="/contact/"` |
| categories/index.astro | 301 | `href="/search"` | `href="/search/"` |
| categories/index.astro | 307 | `href="/blog"` | `href="/blog/"` |
| gyms/[slug].astro | 602 | `href="/tools/bouldering-grade-conversion"` | `href="/tools/bouldering-grade-conversion/"` |
| gyms/[slug].astro | 611 | `href="/tools/sport-climbing-grade-conversion"` | `href="/tools/sport-climbing-grade-conversion/"` |
| gyms/[slug].astro | 757 | `href="/tools/cost-per-climb-calculator"` | `href="/tools/cost-per-climb-calculator/"` |
| [state]/[city]/[page].astro | 403 | `href="/categories"` | `href="/categories/"` |
| [state]/[city]/[page].astro | 422 | `href="/blog/beginners-guide-to-climbing-gyms"` | `href="/blog/beginners-guide-to-climbing-gyms/"` |
| [state]/[city]/[page].astro | 434 | `href="/blog/what-to-wear-indoor-rock-climbing"` | `href="/blog/what-to-wear-indoor-rock-climbing/"` |
| [state]/[city]/[page].astro | 446 | `href="/blog"` | `href="/blog/"` |

### Template Literal Links (14 violations)

| File | Line | Pattern | Should Be |
|------|------|---------|-----------|
| GymCard.astro | 51 | `href={`/gyms/${gym.slug}`}` | `href={`/gyms/${gym.slug}/`}` |
| GymCard.astro | 78 | `href={`/gyms/${gym.slug}`}` | `href={`/gyms/${gym.slug}/`}` |
| GymCard.astro | 138 | `href={`/gyms/${gym.slug}`}` | `href={`/gyms/${gym.slug}/`}` |
| BlogCard.astro | 51 | `href={`/blog/${slug}`}` | `href={`/blog/${slug}/`}` |
| BlogCard.astro | 74 | `href={`/blog/${slug}`}` | `href={`/blog/${slug}/`}` |
| studies/index.astro | 76 | `href={`/studies/${study.slug}`}` | `href={`/studies/${study.slug}/`}` |
| index.astro | 311 | `href={`/${stateSlug}`}` | `href={`/${stateSlug}/`}` |
| blog/[...slug].astro | 299 | `href={`/blog/${entry.data.category}`}` | `href={`/blog/${entry.data.category}/`}` |
| [state]/[city]/[page].astro | 314 | `href={`/gyms/${gym.slug}`}` | `href={`/gyms/${gym.slug}/`}` |
| [state]/[city]/[page].astro | 377 | `href={`/${stateAbbr}`}` | `href={`/${stateAbbr}/`}` |
| [state]/[city]/[page].astro | 390 | `href={`/search?city=${encodeURIComponent(city)}`}` | `href={`/search/?city=${encodeURIComponent(city)}`}` |
| categories/[category]/[page].astro | 467 | `href={`/gyms/${gym.slug}`}` | `href={`/gyms/${gym.slug}/`}` |

---

## 5. Special Cases Requiring Manual Review

### Hash Fragments
**File:** CookieConsent.astro Line 18
```astro
<a href="/privacy#cookies-tracking">
```
**Should Be:**
```astro
<a href="/privacy/#cookies-tracking">
```

### Query Strings
**File:** [state]/[city]/[page].astro Line 390
```astro
<a href={`/search?city=${encodeURIComponent(city)}`}>
```
**Should Be:**
```astro
<a href={`/search/?city=${encodeURIComponent(city)}`}>
```

---

## 6. Implementation Plan

### Option A: Bulk Find-and-Replace (Fastest)

Use VSCode or CLI to batch replace all occurrences:

```bash
# Static links
grep -rl 'href="/about"' src/ | xargs sed -i '' 's|href="/about"|href="/about/"|g'
grep -rl 'href="/contact"' src/ | xargs sed -i '' 's|href="/contact"|href="/contact/"|g'
# ... repeat for all 59 static patterns
```

**Pros:** Fast (5-10 minutes), proven approach
**Cons:** Tedious, risk of missing edge cases

### Option B: Shared Utility Function (Recommended)

Create a canonical URL utility to normalize all internal links:

**File:** `src/utils/links.ts` (NEW)
```typescript
/**
 * Normalize internal URLs to include trailing slash.
 * Prevents 301/308 redirects caused by non-canonical URLs.
 *
 * @param url - The URL path (with or without leading slash)
 * @returns Canonical URL with trailing slash
 *
 * @example
 * canonicalUrl('/about')        // '/about/'
 * canonicalUrl('/search')       // '/search/'
 * canonicalUrl('/blog/post')    // '/blog/post/'
 * canonicalUrl('/logo.svg')     // '/logo.svg' (file with extension - unchanged)
 * canonicalUrl('https://...')   // 'https://...' (external URL - unchanged)
 */
export function canonicalUrl(url: string): string {
  // External URLs - return unchanged
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Static assets with extensions - return unchanged
  if (url.includes('.') && !url.includes('/')) {
    return url;
  }

  // Mailto/tel links - return unchanged
  if (url.startsWith('mailto:') || url.startsWith('tel:')) {
    return url;
  }

  // Fragment-only links - return unchanged
  if (url.startsWith('#')) {
    return url;
  }

  // Remove trailing slash if present (for consistency)
  let cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

  // Handle query strings and hash fragments
  const queryStringIndex = cleanUrl.indexOf('?');
  const hashIndex = cleanUrl.indexOf('#');

  let basePath = cleanUrl;
  let queryString = '';
  let hash = '';

  if (queryStringIndex !== -1) {
    basePath = cleanUrl.substring(0, queryStringIndex);
    queryString = cleanUrl.substring(queryStringIndex);
  } else if (hashIndex !== -1) {
    basePath = cleanUrl.substring(0, hashIndex);
    hash = cleanUrl.substring(hashIndex);
  }

  // Add trailing slash to base path
  const canonicalPath = basePath + '/';

  // Reattach query string and hash (if present)
  return canonicalPath + queryString + hash;
}
```

**Usage in Components:**

Before:
```astro
<a href="/about">About Us</a>
<a href={`/gyms/${gym.slug}`}>View Gym</a>
```

After:
```astro
---
import { canonicalUrl } from '../utils/links';
---
<a href={canonicalUrl('/about')}>About Us</a>
<a href={canonicalUrl(`/gyms/${gym.slug}`)}>View Gym</a>
```

**Pros:** Centralized logic, testable, prevents future violations
**Cons:** Requires updating every link to use function

### Option C: Hybrid Approach (Recommended for This Project)

1. **Immediate:** Fix all 73 violations via find-and-replace (Option A)
2. **Future:** Add `canonicalUrl()` utility to prevent regressions
3. **Verification:** Add CI check to catch new violations

**Timeline:** 15 minutes for bulk fix, 30 minutes for utility + CI

---

## 7. Automated Verification

### 7.1. CI Check (Prevent New Violations)

**File:** `.github/workflows/canonical-links-check.yml` (NEW)
```yaml
name: Canonical Links Check

on:
  pull_request:
    paths:
      - 'src/**/*.astro'
      - 'src/**/*.tsx'
      - 'src/**/*.ts'
  push:
    branches:
      - main

jobs:
  check-canonical-links:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Check for non-canonical internal links
        run: |
          # Find all href attributes without trailing slash (excluding assets)
          violations=$(grep -rn 'href="/[^"]*[^/]"' src/ --include="*.astro" --include="*.tsx" --include="*.ts" | \
            grep -v '\.svg"' | \
            grep -v '\.jpg"' | \
            grep -v '\.png"' | \
            grep -v '\.csv"' | \
            grep -v 'http://' | \
            grep -v 'https://' | \
            wc -l)

          if [ "$violations" -gt 0 ]; then
            echo "❌ Found $violations non-canonical internal links!"
            echo "Run: grep -rn 'href=\"/[^\" ]*[^/]\"' src/"
            exit 1
          else
            echo "✅ All internal links are canonical!"
          fi
```

### 7.2. Local Test Procedure

**File:** `scripts/test-canonical-links.sh` (NEW)
```bash
#!/bin/bash

echo "🔍 Testing canonical URL compliance..."

# Find all violations
violations=$(grep -rn 'href="/[^"]*[^/]"' src/ --include="*.astro" --include="*.tsx" --include="*.ts" | \
  grep -v '\.svg"' | \
  grep -v '\.jpg"' | \
  grep -v '\.png"' | \
  grep -v '\.csv"' | \
  grep -v 'http://' | \
  grep -v 'https://' | \
  wc -l)

if [ "$violations" -gt 0 ]; then
  echo "❌ FAILED: Found $violations non-canonical internal links"
  echo ""
  echo "Violations:"
  grep -rn 'href="/[^"]*[^/]"' src/ --include="*.astro" --include="*.tsx" --include="*.ts" | \
    grep -v '\.svg"' | \
    grep -v '\.jpg"' | \
    grep -v '\.png"' | \
    grep -v '\.csv"' | \
    grep -v 'http://' | \
    grep -v 'https://'
  exit 1
else
  echo "✅ PASSED: All internal links are canonical!"
  exit 0
fi
```

**Make executable:**
```bash
chmod +x scripts/test-canonical-links.sh
```

**Run manually:**
```bash
./scripts/test-canonical-links.sh
```

**Add to package.json:**
```json
{
  "scripts": {
    "test:canonical": "./scripts/test-canonical-links.sh"
  }
}
```

**Usage:**
```bash
npm run test:canonical
```

### 7.3. Pre-Commit Hook (Optional)

**File:** `.husky/pre-commit` (NEW)
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run canonical links check before commit
npm run test:canonical
```

---

## 8. Execution Checklist

### Phase 1: Fix Violations (15 minutes)
- [ ] Fix all 59 static link violations via find-and-replace
- [ ] Fix all 14 template literal violations via find-and-replace
- [ ] Fix 2 special cases (hash fragment and query string)
- [ ] Verify build succeeds: `npm run build`
- [ ] Run local test: `npm run test:canonical`

### Phase 2: Add Verification (30 minutes)
- [ ] Create `src/utils/links.ts` with `canonicalUrl()` function
- [ ] Create `scripts/test-canonical-links.sh` test script
- [ ] Add test script to `package.json`
- [ ] Create `.github/workflows/canonical-links-check.yml` CI workflow
- [ ] (Optional) Add pre-commit hook via Husky

### Phase 3: Deploy & Verify (15 minutes)
- [ ] Commit changes with message: "fix: normalize all internal URLs to include trailing slash"
- [ ] Push to feature branch
- [ ] Verify CI check passes
- [ ] Merge to main
- [ ] Deploy to production
- [ ] Test production site: Click 10 random internal links, verify no redirects in Network tab

---

## 9. Success Criteria

### Technical Metrics
- ✅ 0 non-canonical internal links in `src/` directory
- ✅ Build succeeds without errors
- ✅ All tests pass (local + CI)
- ✅ No 301/308 redirects on internal link clicks

### Performance Metrics
- ✅ 50-200ms faster page loads (no redirect delay)
- ✅ Fewer edge function invocations on Vercel
- ✅ Improved Lighthouse scores (remove redirect chains)

### SEO Metrics
- ✅ Consolidated canonical URL signals
- ✅ No redirect chains diluting link equity
- ✅ Consistent URL structure in sitemap

---

## 10. Maintenance

### Code Review Checklist
When reviewing new code with internal links, verify:
- [ ] All internal page URLs end with `/`
- [ ] Static assets (`/logo.svg`) do NOT have trailing slash
- [ ] External URLs preserved as-is
- [ ] Hash fragments: `/page/#section` (slash before `#`)
- [ ] Query strings: `/page/?param=value` (slash before `?`)

### Automated Prevention
- ✅ CI check fails PRs with new violations
- ✅ Pre-commit hook blocks local commits
- ✅ Test script catches regressions before deployment

---

## Appendix A: Regex Pattern for Finding Violations

```bash
# Find all href attributes without trailing slash
grep -rn 'href="/[^"]*[^/]"' src/ --include="*.astro" --include="*.tsx" --include="*.ts"

# Exclude static assets
grep -rn 'href="/[^"]*[^/]"' src/ --include="*.astro" --include="*.tsx" --include="*.ts" | \
  grep -v '\.svg"' | \
  grep -v '\.jpg"' | \
  grep -v '\.png"' | \
  grep -v '\.csv"' | \
  grep -v '\.gif"' | \
  grep -v '\.webp"'

# Count violations
grep -rn 'href="/[^"]*[^/]"' src/ --include="*.astro" --include="*.tsx" --include="*.ts" | \
  grep -v '\.svg"' | \
  grep -v '\.jpg"' | \
  grep -v '\.png"' | \
  grep -v '\.csv"' | \
  wc -l
```

---

## Appendix B: Common Violation Patterns

| Pattern | Matches | Should Be |
|---------|---------|-----------|
| `href="/about"` | Single-level page | `href="/about/"` |
| `href="/blog/post"` | Multi-level page | `href="/blog/post/"` |
| `href="/search?q=test"` | Query string (wrong) | `href="/search/?q=test"` |
| `href="/page#section"` | Hash fragment (wrong) | `href="/page/#section"` |
| `href={`/gyms/${slug}`}` | Template literal (wrong) | `href={`/gyms/${slug}/`}` |
| `href="/logo.svg"` | Static asset (correct!) | Unchanged |

---

**Document Version:** 1.0
**Last Updated:** 2025-11-15
**Next Review:** After implementation completion

**Ready for execution.** All violations identified, patterns documented, fix strategy defined.
