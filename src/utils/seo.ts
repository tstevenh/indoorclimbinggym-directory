import { hasValue, formatPrice, formatRating, joinList } from './display';
import { getStateCode, getStateName } from './states';
/**
 * SEO Utility Functions
 * Generates meta tags, Open Graph, Twitter Cards for all pages
 */

export interface SEOProps {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  keywords?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

const RECOMMENDED_TITLE_MAX = 70;

export const TITLE_TARGET = 60;
export const TITLE_HARD_MAX = 70;
export const DESCRIPTION_MAX = 160;

/** "1 gym" / "2 gyms". `plural` defaults to singular + "s". */
export function pluralize(n: number, singular: string, plural?: string): string {
  return n === 1 ? singular : (plural ?? `${singular}s`);
}

/** "1 gym" / "3 gyms" (count included). */
export function countOf(n: number, singular: string, plural?: string): string {
  return `${n} ${pluralize(n, singular, plural)}`;
}

/** Collapse accidentally doubled adjacent words ("best best", "Gyms gyms") and extra spaces. */
export function dedupeWords(text: string): string {
  return text
    .replace(/\b([A-Za-z][A-Za-z']*)(\s+)\1\b/gi, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Strip a leading "Best "/"Top " superlative ("Best Bouldering Gyms" -> "Bouldering Gyms"). */
export function stripSuperlative(text: string): string {
  return text.replace(/^(best|top)\s+/i, '');
}

/** Lowercase the first letter only when the word is not an acronym / proper noun-ish ("Best" -> "best"). */
function lowerFirst(text: string): string {
  // Lowercase every plain Capitalized word ("Bouldering Climbing Gyms" -> "bouldering climbing gyms") so the
  // phrase reads naturally mid-sentence; keep acronyms / mixed-case words (WiFi, BBQ) untouched.
  return text.replace(/\b[A-Z][a-z]+\b/g, (w) => w.toLowerCase());
}

/** Cut text at the last word boundary <= max, dropping dangling connectors/punctuation. Never adds an ellipsis. */
function cutAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  let cut = text.slice(0, max + 1);
  const space = cut.lastIndexOf(' ');
  cut = space > 0 ? cut.slice(0, space) : cut.slice(0, max);
  return cut
    .replace(/\s+(and|or|the|a|an|in|of|for|with|to|at|by|&|\||-|–|\+)$/i, '')
    .replace(/[\s,;:|&+\-–(]+$/, '')
    .trim();
}

/**
 * Pick the first candidate title that fits TITLE_TARGET. Candidates must be ordered from most to
 * least complete (drop optional segments: brand suffix first, then qualifier, then secondary phrases).
 * Otherwise take the first candidate within the hard max; as a last resort cut the shortest candidate
 * at a word boundary. Never emits "…" / "...".
 */
export function buildTitle(candidates: string[], target = TITLE_TARGET, hardMax = TITLE_HARD_MAX): string {
  const list = candidates.map(dedupeWords).filter(Boolean);
  const fit = list.find((t) => t.length <= target);
  if (fit) return fit;
  const loose = list.find((t) => t.length <= hardMax);
  if (loose) return loose;
  const shortest = [...list].sort((a, b) => a.length - b.length)[0] ?? '';
  return cutAtWord(shortest, hardMax);
}

/**
 * Trim a meta description to <= max chars: keep the whole thing if it fits, else cut at the last
 * sentence end (if that keeps a reasonable amount of text), else at a word boundary. No ellipsis.
 */
export function trimDescription(text: string, max = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const window = clean.slice(0, max + 1);
  const sentenceEnd = Math.max(window.lastIndexOf('. '), window.lastIndexOf('! '), window.lastIndexOf('? '));
  if (sentenceEnd >= max * 0.5) return clean.slice(0, sentenceEnd + 1);
  const cut = cutAtWord(clean, max - 1);
  return /[.!?]$/.test(cut) ? cut : `${cut}.`;
}

/** Two-letter state code for titles ("Colorado" -> "CO"; codes pass through). */
export function stateAbbr(state: string): string {
  return getStateCode(state) || state;
}

/** Brand suffix used on pages that have room for it. */
const BRAND = 'IndoorClimbingGym';

/** City + state qualifier, e.g. "Denver, CO". */
export function cityStateLabel(city: string, state: string): string {
  return `${city}, ${stateAbbr(state)}`;
}

/** True when the gym name already mentions the city (avoid "Foo Denver | Denver Climbing Gym"). */
function nameMentionsCity(name: string, city: string): boolean {
  return !!city && name.toLowerCase().includes(city.toLowerCase());
}

/**
 * Generate complete SEO meta tags for a page
 * @param props SEO properties
 * @returns Object with all meta tag properties
 */
export function generateSEO(props: SEOProps) {
  const {
    title,
    description,
    canonical,
    ogImage = 'https://www.indoorclimbinggym.com/og-default.jpg',
    ogType = 'website',
    keywords = [],
    noindex = false,
    nofollow = false,
  } = props;

  // Ensure description is <= 160 characters (cut at a sentence/word boundary, no ellipsis)
  const finalDescription = trimDescription(description);

  // Construct robots meta
  const robotsDirectives = [];
  if (noindex) robotsDirectives.push('noindex');
  if (nofollow) robotsDirectives.push('nofollow');
  const robots = robotsDirectives.length > 0
    ? robotsDirectives.join(', ')
    : 'index, follow';

  return {
    title,
    description: finalDescription,
    canonical,
    keywords: keywords.join(', '),
    robots,
    ogTitle: title,
    ogDescription: finalDescription,
    ogImage,
    ogType,
    ogUrl: canonical,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: finalDescription,
    twitterImage: ogImage,
  };
}

/**
 * Generate SEO-optimized title for gym pages
 * @param gymName Name of the gym
 * @param city City name
 * @param region State/region
 * @param rating Optional rating for CTR boost
 * @returns Optimized title
 */
export function generateGymTitle(
  gymName: string,
  city: string,
  region: string,
  rating?: number,
  qualifier?: string
): string {
  // `qualifier` (e.g. street) is passed only when two listings share a name in the same city.
  if (qualifier) gymName = `${gymName} - ${qualifier}`;
  const ratingStr = rating && rating > 0 ? `${rating.toFixed(1)}★ ` : '';
  const mentionsCity = nameMentionsCity(gymName, city);
  const tail = mentionsCity ? 'Climbing Gym' : `${city} Climbing Gym`;
  const stateTail = mentionsCity ? '' : `${city}, ${stateAbbr(region)}`;
  return buildTitle([
    `${ratingStr}${gymName} | ${tail}`,
    `${gymName} | ${tail}`,
    stateTail ? `${gymName} | ${stateTail}` : '',
    gymName,
  ]);
}

/**
 * Generate SEO-optimized description for gym pages
 * @param gymName Name of the gym
 * @param city City name
 * @param climbingTypes Types of climbing offered
 * @param rating Rating out of 5
 * @param dayPassPrice Optional day pass price
 * @param topAmenity Optional top amenity to highlight
 * @returns Optimized description
 */
export function generateGymDescription(
  gymName: string,
  city: string,
  climbingTypes: string[],
  rating: number,
  dayPassPrice?: number,
  topAmenity?: string
): string {
  const ratingStr = formatRating(rating);
  const types = joinList(climbingTypes.slice(0, 2).map(t => t.replace(/_/g, ' ')), ' & ');
  let desc = ratingStr ? `Rated ${ratingStr}★ by climbers. ` : '';
  if (types) {
    desc += `${gymName} in ${city} offers ${types}`;
    if (topAmenity) desc += ` + ${topAmenity}`;
  } else if (topAmenity) {
    desc += `${gymName} in ${city} offers ${topAmenity}`;
  } else {
    desc += `${gymName} is an indoor climbing gym in ${city}`;
  }
  const priceStr = formatPrice(dayPassPrice);
  if (priceStr) desc += `. Day pass from ${priceStr}`;
  desc += `. Hours, directions & photos inside.`;
  return trimDescription(desc);
}

/**
 * Generate SEO-optimized title for city pages
 * @param city City name
 * @param state State name
 * @param count Optional gym count for CTR boost
 * @returns Optimized title
 */
export function generateCityTitle(city: string, state: string, count?: number): string {
  const place = cityStateLabel(city, state);
  const n = count ?? 0;
  if (n >= 2) {
    return buildTitle([
      `${n} Best Climbing Gyms in ${place}`,
      `Best Climbing Gyms in ${place}`,
      `Climbing Gyms in ${place}`,
    ]);
  }
  // One gym (or unknown count): no superlative, singular noun.
  return buildTitle([
    n === 1 ? `Climbing Gym in ${place}` : `Climbing Gyms in ${place}`,
    `Climbing in ${place}`,
  ]);
}

/**
 * Generate SEO-optimized description for city pages
 * @param city City name
 * @param state State name
 * @param count Number of gyms
 * @param avgRating Average rating
 * @param priceMin Optional minimum price
 * @param priceMax Optional maximum price
 * @returns Optimized description
 */
export function generateCityDescription(
  city: string,
  state: string,
  count: number,
  avgRating: number,
  priceMin?: number,
  priceMax?: number
): string {
  const place = cityStateLabel(city, state);
  let desc = count === 1
    ? `Find the indoor climbing gym in ${place}.`
    : `Compare ${count} climbing gyms in ${place}.`;
  const avgStr = formatRating(avgRating);
  if (avgStr) desc += count === 1 ? ` Rated ${avgStr}★` : ` Avg rating ${avgStr}★`;
  if (hasValue(priceMin) && hasValue(priceMax)) {
    desc += priceMin === priceMax
      ? `. Day pass ${formatPrice(priceMin)}`
      : `. Day passes ${formatPrice(priceMin)}-${formatPrice(priceMax)}`;
  }
  desc += count === 1
    ? `. Hours, climbing types & directions.`
    : `. Bouldering, lead & top rope. Find your perfect gym today.`;
  return trimDescription(desc.replace(/\.\./g, '.'));
}

/**
 * Generate SEO-optimized title for state pages
 * @param state State name
 * @param gymCount Optional gym count
 * @param cityCount Optional city count
 * @returns Optimized title
 */
export function generateStateTitle(state: string, gymCount?: number, cityCount?: number): string {
  const name = state.length === 2 ? (getStateName(state) || state) : state;
  if (gymCount && cityCount && gymCount > 0) {
    return buildTitle([
      `${countOf(gymCount, 'Climbing Gym')} in ${name} | ${countOf(cityCount, 'City', 'Cities')}`,
      `${countOf(gymCount, 'Climbing Gym')} in ${name}`,
      `Climbing Gyms in ${name} | Complete Directory`,
      `Climbing Gyms in ${name}`,
    ]);
  }
  return buildTitle([`Climbing Gyms in ${name} | Complete Directory`, `Climbing Gyms in ${name}`]);
}

/**
 * Generate SEO-optimized description for state pages
 * @param state State name
 * @param cityCount Number of cities with gyms
 * @param gymCount Total gym count
 * @param topGymName Optional top gym name
 * @param topGymRating Optional top gym rating
 * @returns Optimized description
 */
export function generateStateDescription(
  state: string,
  cityCount: number,
  gymCount: number,
  topGymName?: string,
  topGymRating?: number
): string {
  let desc = cityCount === 1
    ? `Find ${countOf(gymCount, 'climbing gym')} in ${state}`
    : `Find ${countOf(gymCount, 'climbing gym')} across ${cityCount} cities in ${state}`;
  if (topGymName && hasValue(topGymRating)) {
    desc += `. Top-rated: ${topGymName} (${topGymRating.toFixed(1)}★)`;
  }
  desc += `. Compare prices, amenities & locations.`;
  return trimDescription(desc);
}

/**
 * Generate keyword array from gym data
 * @param gymName Gym name
 * @param city City
 * @param climbingTypes Types offered
 * @returns Array of keywords
 */
export function generateGymKeywords(
  gymName: string,
  city: string,
  climbingTypes: string[]
): string[] {
  const keywords = [
    gymName,
    `${gymName} ${city}`,
    `climbing gym ${city}`,
    `${city} climbing gym`,
    ...climbingTypes.map(type => `${type} ${city}`),
    ...climbingTypes.map(type => `${city} ${type}`),
  ];
  return keywords;
}

/**
 * Truncate text to specified length with ellipsis
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : cutAtWord(text, maxLength);
}

/**
 * Smart truncate at word boundaries
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text at word boundary
 */
export function truncateAtWord(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : cutAtWord(text, maxLength);
}

/**
 * Add brand suffix to title if it fits
 * @param title Base title
 * @param brand Brand name (default: IndoorClimbingGym)
 * @returns Title with brand suffix if it fits
 */
export function addBrandSuffix(title: string, brand: string = BRAND): string {
  const withBrand = `${title} | ${brand}`;
  return withBrand.length <= RECOMMENDED_TITLE_MAX ? withBrand : title;
}

/**
 * Create slug from text
 * @param text Text to slugify
 * @returns URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate SEO-optimized title for blog posts
 * @param postTitle Title of the blog post
 * @param addBrand Whether to add brand suffix (default: true)
 * @returns Optimized title with brand suffix
 */
export function generateBlogPostTitle(
  postTitle: string,
  seoTitle?: string,
  addBrand: boolean = true
): string {
  if (seoTitle?.trim()) {
    return seoTitle.trim();
  }

  if (!addBrand) {
    return postTitle;
  }

  return addBrandSuffix(postTitle, 'IndoorClimbingGym');
}

/**
 * Generate SEO-optimized description for blog posts
 * @param excerpt Excerpt from the blog post
 * @returns Optimized description under 160 chars
 */
export function generateBlogPostDescription(excerpt: string): string {
  return trimDescription(excerpt);
}

/**
 * Generate keyword array for blog posts
 * @param tags Post tags
 * @param category Post category
 * @returns Array of SEO keywords
 */
export function generateBlogKeywords(tags: string[], category: string): string[] {
  const baseKeywords = [
    'climbing gym',
    'indoor climbing',
    'rock climbing',
    'bouldering',
    category,
  ];

  return [...baseKeywords, ...tags];
}

/**
 * Generate SEO-optimized title for category pages
 * @param categoryName Name of the category
 * @param currentPage Page number (default: 1)
 * @returns Optimized title with brand suffix
 */
export function generateCategoryTitle(categoryName: string, currentPage: number = 1): string {
  const page = currentPage > 1 ? ` - Page ${currentPage}` : '';
  return buildTitle([
    `${categoryName}${page} | ${BRAND}`,
    `${categoryName}${page}`,
  ]);
}

/**
 * Generate SEO-optimized description for category pages
 * @param categoryName Name of the category
 * @param gymCount Number of gyms in category
 * @param currentPage Page number (default: 1)
 * @returns Optimized description
 */
export function generateCategoryDescription(categoryName: string, gymCount: number, currentPage: number = 1): string {
  const noun = stripSuperlative(categoryName);
  let description: string;
  if (currentPage > 1) {
    description = `${categoryName} - Page ${currentPage}. Browse ${countOf(gymCount, 'climbing gym')} with detailed reviews, amenities, pricing, and directions.`;
  } else if (gymCount === 1) {
    description = `Find the ${lowerFirst(noun)} in our directory, with ratings, amenities, prices, and directions.`;
  } else {
    description = `Find the best ${lowerFirst(noun)}. Compare ${gymCount} climbing gyms by ratings, amenities, prices, and location. Expert reviews and directions included.`;
  }
  return trimDescription(dedupeWords(description));
}

/**
 * Generate pagination title suffix
 * @param currentPage Page number
 * @param format Format style ('long' = 'Page N', 'short' = 'P{N}')
 * @returns Pagination suffix string
 */
export function getPaginationSuffix(currentPage: number, format: 'long' | 'short' = 'short'): string {
  if (currentPage <= 1) return '';

  return format === 'long'
    ? ` - Page ${currentPage}`
    : ` (P${currentPage})`;
}
