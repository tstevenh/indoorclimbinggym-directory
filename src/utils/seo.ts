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

// State abbreviation helper for shorter titles
function getStateAbbreviation(state: string): string | null {
  const stateMap: Record<string, string> = {
    'washington': 'WA', 'california': 'CA', 'texas': 'TX',
    'colorado': 'CO', 'new york': 'NY', 'florida': 'FL',
    'oregon': 'OR', 'arizona': 'AZ', 'utah': 'UT', 'nevada': 'NV',
    'georgia': 'GA', 'north carolina': 'NC', 'virginia': 'VA',
    'massachusetts': 'MA', 'pennsylvania': 'PA', 'ohio': 'OH',
    'illinois': 'IL', 'michigan': 'MI', 'minnesota': 'MN',
    'wisconsin': 'WI', 'tennessee': 'TN', 'missouri': 'MO',
  };
  return stateMap[state.toLowerCase()] || null;
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

  // Ensure title is under 60 characters
  const finalTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;

  // Ensure description is under 160 characters
  const finalDescription = description.length > 160
    ? description.substring(0, 157) + '...'
    : description;

  // Construct robots meta
  const robotsDirectives = [];
  if (noindex) robotsDirectives.push('noindex');
  if (nofollow) robotsDirectives.push('nofollow');
  const robots = robotsDirectives.length > 0
    ? robotsDirectives.join(', ')
    : 'index, follow';

  return {
    title: finalTitle,
    description: finalDescription,
    canonical,
    keywords: keywords.join(', '),
    robots,
    ogTitle: finalTitle,
    ogDescription: finalDescription,
    ogImage,
    ogType,
    ogUrl: canonical,
    twitterCard: 'summary_large_image',
    twitterTitle: finalTitle,
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
  rating?: number
): string {
  // Rating-forward formula for higher CTR
  if (rating && rating > 0) {
    const ratingStr = rating.toFixed(1);
    const title = `${ratingStr}★ ${gymName} | ${city} Climbing Gym`;
    if (title.length <= 60) return title;
  }
  // Fallback: shorter format
  const fallback = `${gymName} | ${city} Climbing Gym`;
  return fallback.length > 60 ? fallback.substring(0, 57) + '...' : fallback;
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
  const ratingStr = rating.toFixed(1);
  const types = climbingTypes.slice(0, 2).map(t => t.replace(/_/g, ' ')).join(' & ');
  let desc = `Rated ${ratingStr}★ by climbers. ${gymName} offers ${types}`;
  if (topAmenity) desc += ` + ${topAmenity}`;
  if (dayPassPrice && dayPassPrice > 0) desc += `. Day pass from $${dayPassPrice}`;
  desc += `. Hours, directions & photos inside.`;
  return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
}

/**
 * Generate SEO-optimized title for city pages
 * @param city City name
 * @param state State name
 * @param count Optional gym count for CTR boost
 * @returns Optimized title
 */
export function generateCityTitle(city: string, state: string, count?: number): string {
  if (count && count > 0) {
    const stateAbbr = getStateAbbreviation(state) || state;
    const title = `${count} Best Climbing Gyms in ${city}, ${stateAbbr}`;
    if (title.length <= 60) return title;
  }
  return `Best Climbing Gyms in ${city}, ${state}`;
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
  let desc = `Compare ${count} climbing gyms in ${city}. Avg rating ${avgRating.toFixed(1)}★`;
  if (priceMin && priceMax && priceMin > 0) {
    desc += `. Day passes $${priceMin}-$${priceMax}`;
  }
  desc += `. Bouldering, lead & top rope. Find your perfect gym today.`;
  return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
}

/**
 * Generate SEO-optimized title for state pages
 * @param state State name
 * @param gymCount Optional gym count
 * @param cityCount Optional city count
 * @returns Optimized title
 */
export function generateStateTitle(state: string, gymCount?: number, cityCount?: number): string {
  if (gymCount && cityCount && gymCount > 0) {
    const title = `${gymCount} Climbing Gyms in ${state} | ${cityCount} Cities`;
    if (title.length <= 60) return title;
  }
  return `Climbing Gyms in ${state} | Complete Directory`;
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
  let desc = `Find ${gymCount} climbing gyms across ${cityCount} cities in ${state}`;
  if (topGymName && topGymRating) {
    desc += `. Top-rated: ${topGymName} (${topGymRating.toFixed(1)}★)`;
  }
  desc += `. Compare prices, amenities & locations.`;
  return desc.length > 160 ? desc.substring(0, 157) + '...' : desc;
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
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
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
 * @returns Optimized title without brand suffix
 */
export function generateBlogPostTitle(postTitle: string): string {
  const maxLength = 60;

  if (postTitle.length > maxLength) {
    return postTitle.substring(0, maxLength - 3) + '...';
  }

  return postTitle;
}

/**
 * Generate SEO-optimized description for blog posts
 * @param excerpt Excerpt from the blog post
 * @returns Optimized description under 160 chars
 */
export function generateBlogPostDescription(excerpt: string): string {
  const maxLength = 160;

  if (excerpt.length <= maxLength) {
    return excerpt;
  }

  return excerpt.substring(0, maxLength - 3) + '...';
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
