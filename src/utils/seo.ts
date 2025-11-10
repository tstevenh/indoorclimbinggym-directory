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
 * @returns Optimized title
 */
export function generateGymTitle(gymName: string, city: string, region: string): string {
  return `${gymName} - Climbing Gym in ${city}, ${region}`;
}

/**
 * Generate SEO-optimized description for gym pages
 * @param gymName Name of the gym
 * @param city City name
 * @param climbingTypes Types of climbing offered
 * @param rating Rating out of 5
 * @returns Optimized description
 */
export function generateGymDescription(
  gymName: string,
  city: string,
  climbingTypes: string[],
  rating: number
): string {
  const types = climbingTypes.slice(0, 3).map(t => t.replace(/_/g, ' ')).join(', ');
  return `${gymName} in ${city} offers ${types}. Rated ${rating}★. View hours, prices, amenities, and directions. Find your next climb.`;
}

/**
 * Generate SEO-optimized title for city pages
 * @param city City name
 * @param state State name
 * @returns Optimized title
 */
export function generateCityTitle(city: string, state: string): string {
  return `Best Climbing Gyms in ${city}, ${state} | Indoor Climbing`;
}

/**
 * Generate SEO-optimized description for city pages
 * @param city City name
 * @param state State name
 * @param count Number of gyms
 * @param avgRating Average rating
 * @returns Optimized description
 */
export function generateCityDescription(
  city: string,
  state: string,
  count: number,
  avgRating: number
): string {
  return `Discover ${count} climbing gyms in ${city}, ${state}. Compare prices, hours, amenities, and ratings (avg ${avgRating}★). Find bouldering and rope climbing near you.`;
}

/**
 * Generate SEO-optimized title for state pages
 * @param state State name
 * @returns Optimized title
 */
export function generateStateTitle(state: string): string {
  return `Indoor Climbing Gyms in ${state} | Complete Directory`;
}

/**
 * Generate SEO-optimized description for state pages
 * @param state State name
 * @param cityCount Number of cities with gyms
 * @param gymCount Total gym count
 * @returns Optimized description
 */
export function generateStateDescription(
  state: string,
  cityCount: number,
  gymCount: number
): string {
  return `Find climbing gyms across ${cityCount} cities in ${state}. Browse ${gymCount} gyms with reviews, prices, and directions. Your complete guide to indoor climbing in ${state}.`;
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
 * @returns Optimized title with brand
 */
export function generateBlogPostTitle(postTitle: string): string {
  const brandSuffix = ' | IndoorClimbingGym';
  const maxLength = 60 - brandSuffix.length;

  if (postTitle.length > maxLength) {
    return postTitle.substring(0, maxLength - 3) + '...' + brandSuffix;
  }

  return `${postTitle}${brandSuffix}`;
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
