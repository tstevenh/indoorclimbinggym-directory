/**
 * JSON-LD Schema Generators
 * Creates structured data for all page types per schema.org standards
 */

import { formatRating, stripRatingClaims, hasValue } from './display';
import { US_STATES } from './states';

export const SITE_NAME = 'IndoorClimbingGym';
export const SITE_URL = 'https://www.indoorclimbinggym.com';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Verified official social profile URLs for the Organization `sameAs` property.
 * Intentionally empty: ownership of the footer social accounts is unverified.
 * Add URLs here only once the owner confirms them; sameAs is emitted only when non-empty.
 */
export const ORGANIZATION_SAME_AS: string[] = [];

/** Minimal Organization reference by @id (name kept so validators show a label). */
const organizationRef = () => ({ '@type': 'Organization', '@id': ORGANIZATION_ID, name: SITE_NAME });

/**
 * Parse a US full address ("575 Degraw St, Brooklyn, NY 11217") into street + ZIP.
 * Returns only what it can parse with confidence; anything else is undefined.
 */
export function parseUSAddress(address: unknown): { streetAddress?: string; postalCode?: string } {
  if (typeof address !== 'string') return {};
  const clean = address.replace(/\s+/g, ' ').trim();
  if (!clean) return {};
  const parts = clean.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return {};

  // ZIP: a standalone 5-digit (optionally +4) token that follows a state code/name, searched from the end.
  let postalCode: string | undefined;
  for (let i = parts.length - 1; i >= 1; i--) {
    const m = parts[i].match(/(?:^|\s)(\d{5})(?:-(\d{4}))?(?:\s|$)/);
    if (m && /[A-Za-z]/.test(parts[i].replace(m[0], ''))) {
      postalCode = m[2] ? `${m[1]}-${m[2]}` : m[1];
      break;
    }
    if (m && /^\d{5}(-\d{4})?$/.test(parts[i]) && i > 1) {
      postalCode = parts[i];
      break;
    }
  }

  // Street: first segment, only if it looks like a street (starts with a number) -- suites stay in
  // following segments ("Ste 100") and are appended when they are before the city segment.
  const first = parts[0];
  let streetAddress: string | undefined;
  if (/^\d/.test(first)) {
    streetAddress = first;
    const second = parts[1];
    if (parts.length >= 4 && /^(suite|ste|unit|apt|#|floor|fl|building|bldg|space|spc)\b/i.test(second)) {
      streetAddress = `${first}, ${second}`;
    }
  }
  return { streetAddress, postalCode };
}

/** 2-letter USPS code from a full state name ("New York") or code ("NY"); undefined if unknown. */
export function stateToUSPS(region: unknown): string | undefined {
  if (typeof region !== 'string') return undefined;
  const r = region.trim().toLowerCase();
  if (!r) return undefined;
  if (US_STATES[r]) return US_STATES[r];
  const upper = r.toUpperCase();
  return Object.values(US_STATES).includes(upper) ? upper : undefined;
}

interface Gym {
  id: number;
  name: string;
  slug: string;
  full_address: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  latitude: number;
  longtitude: number; // Note: misspelled in schema
  phone: string;
  website: string;
  photo: string;
  rating: number;
  day_pass_price_local: number;
  working_hour: string;
  amenities: string;
  climbing_types: string;
  description_short: string;
  [key: string]: any;
}

function buildAddress(gym: Gym) {
  const { streetAddress, postalCode } = parseUSAddress(gym.address ?? gym.full_address);
  const region = stateToUSPS(gym.region);
  const addr: any = { '@type': 'PostalAddress' };
  if (streetAddress) addr.streetAddress = streetAddress;
  if (gym.city) addr.addressLocality = gym.city;
  if (region) addr.addressRegion = region;
  if (postalCode) addr.postalCode = postalCode;
  addr.addressCountry = 'US';
  return addr;
}

/**
 * Generate LocalBusiness + SportsActivityLocation schema for gym pages
 * @param gym Gym data object
 * @param pageUrl Full URL of the gym page
 * @returns JSON-LD schema object
 */
export function generateGymSchema(gym: Gym, pageUrl: string) {
  const openingHours = parseOpeningHours(gym.working_hour);
  const amenitiesList = gym.amenities?.split('|').map((a) => a.trim()).filter(Boolean) || [];

  const schema: any = {
    '@context': 'https://schema.org',
    '@type': ['SportsActivityLocation', 'LocalBusiness'],
    '@id': `${pageUrl.replace(/#.*$/, '')}#gym`,
    name: gym.name,
    description: stripRatingClaims(gym.about || gym.description_short) || undefined,
    address: buildAddress(gym),
    // For LocalBusiness, url is typically the official site; we keep gym.website here.
    // The schema @id is the canonical pageUrl.
    url: gym.website,
    sport: 'Rock Climbing',
  };

  if (hasValue(gym.latitude) && hasValue(gym.longtitude)) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: Number(gym.latitude),
      longitude: Number(gym.longtitude), // Note: uses misspelled field from schema
    };
  }

  if (gym.photo) schema.image = gym.photo;
  if (gym.phone) schema.telephone = gym.phone;

  // Avoid invalid placeholder values like "$null".
  if (typeof gym.day_pass_price_local === 'number' && gym.day_pass_price_local > 0) {
    schema.priceRange = `$${gym.day_pass_price_local}`;
  }

  if (openingHours.length) schema.openingHoursSpecification = openingHours;

  // No aggregateRating: the review counts come from Google Maps and the reviews are not hosted on
  // this site, which Google's review-snippet policy does not allow. Emit one first-party editorial
  // Review instead, only when an editorial rating exists (the same number the page displays).
  const editorial = formatRating(gym.rating_editorial);
  if (editorial) {
    schema.review = {
      '@type': 'Review',
      name: 'IndoorClimbingGym editorial rating',
      author: organizationRef(),
      reviewRating: {
        '@type': 'Rating',
        ratingValue: Number(editorial),
        bestRating: 5,
        worstRating: 1,
      },
    };
  }

  const ratingProps: any[] = [];
  if (gym.rating_route_quality > 0) ratingProps.push({ '@type': 'PropertyValue', name: 'Route Quality Rating', value: gym.rating_route_quality, maxValue: 5, minValue: 0 });
  if (gym.rating_cleanliness > 0) ratingProps.push({ '@type': 'PropertyValue', name: 'Cleanliness Rating', value: gym.rating_cleanliness, maxValue: 5, minValue: 0 });
  if (gym.rating_staff_friendliness > 0) ratingProps.push({ '@type': 'PropertyValue', name: 'Staff Friendliness Rating', value: gym.rating_staff_friendliness, maxValue: 5, minValue: 0 });
  if (gym.rating_facilities > 0) ratingProps.push({ '@type': 'PropertyValue', name: 'Facilities Rating', value: gym.rating_facilities, maxValue: 5, minValue: 0 });
  if (gym.rating_value_for_money > 0) ratingProps.push({ '@type': 'PropertyValue', name: 'Value for Money Rating', value: gym.rating_value_for_money, maxValue: 5, minValue: 0 });
  if (ratingProps.length) schema.additionalProperty = ratingProps;

  if (amenitiesList.length) {
    schema.amenityFeature = amenitiesList.map((amenity) => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity.replace(/_/g, ' '),
      value: true,
    }));
  }

  if (gym.why_climbers_like_it && gym.why_climbers_like_it.length > 0) {
    schema.knowsAbout = gym.why_climbers_like_it;
  }

  return schema;
}

/**
 * Generate BreadcrumbList schema
 * @param breadcrumbs Array of breadcrumb items
 * @returns JSON-LD schema object
 */
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ label: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.url,
    })),
  };
}

/**
 * ItemList for pages that list gyms. Pass ONLY the gyms rendered on this page.
 * Items are plain ListItems (position + absolute url + name): no nested business type
 * and no ratings (Google does not support ratings inside list markup).
 * @param startIndex 0-based offset of the first gym within the full list (pagination)
 */
export function generateItemListSchema(
  gyms: Gym[],
  listName: string,
  pageUrl: string,
  startIndex = 0
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: pageUrl,
    numberOfItems: gyms.length,
    itemListElement: gyms.map((gym, index) => ({
      '@type': 'ListItem',
      position: startIndex + index + 1,
      url: `https://www.indoorclimbinggym.com/gyms/${gym.slug}/`,
      name: gym.name,
    })),
  };
}

/** ItemList of plain links (e.g. states) - ListItem with absolute url + name only. */
export function generateLinkListSchema(
  items: Array<{ name: string; url: string }>,
  listName: string,
  pageUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: pageUrl,
    numberOfItems: items.length,
    itemListElement: items.map((it, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: it.url,
      name: it.name,
    })),
  };
}

/**
 * Generate ItemList schema for blog listing pages.
 * Uses BlogPosting items (NOT LocalBusiness).
 */
export function generateBlogItemListSchema(
  posts: Array<{ title: string; slug: string; description?: string; heroImage?: string }>,
  listName: string,
  pageUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: pageUrl,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'BlogPosting',
        headline: post.title,
        url: `https://www.indoorclimbinggym.com/blog/${post.slug}/`,
        ...(post.description && { description: post.description }),
        ...(post.heroImage && { image: post.heroImage }),
      },
    })),
  };
}

/**
 * Generate FAQPage schema
 * @param faqs Array of FAQ items
 * @returns JSON-LD schema object
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article schema for blog posts
 * Enhanced for AI citation and search engine optimization
 * @param post Blog post object with all necessary fields
 * @param pageUrl Full URL of the article page
 * @returns JSON-LD schema object
 */
export function generateArticleSchema(post: any, pageUrl: string) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'BlogPosting'],
    '@id': pageUrl,
    headline: post.title,
    description: post.description,
    image: {
      '@type': 'ImageObject',
      url: post.heroImage,
      ...(post.heroImageAlt && { caption: post.heroImageAlt })
    },
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://www.indoorclimbinggym.com'
    },
    publisher: organizationRef(),
    datePublished: post.publishedDate,
    dateModified: post.updatedDate || post.publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    ...(post.category && { articleSection: post.category }),
  };

  // Add optional fields if available
  if (post.wordCount) {
    schema.wordCount = post.wordCount;
  }

  if (post.tags && post.tags.length > 0) {
    schema.keywords = post.tags.join(', ');
  }

  return schema;
}

/**
 * Generate Organization + WebSite schema for homepage
 * @returns JSON-LD schema object
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: SITE_NAME,
    url: 'https://www.indoorclimbinggym.com',
    logo: 'https://www.indoorclimbinggym.com/logo.png',
    description:
      'Find the best indoor climbing gyms near you. Search by location, amenities, and climbing type. Reviews, prices, and directions for climbers.',
    ...(ORGANIZATION_SAME_AS.length > 0 && { sameAs: ORGANIZATION_SAME_AS }),
  };
}

/**
 * Generate WebSite schema with SearchAction for homepage
 * @returns JSON-LD schema object
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: 'https://www.indoorclimbinggym.com',
    name: SITE_NAME,
    description: 'Find your next climb. Indoor climbing gym directory.',
    publisher: { '@id': ORGANIZATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate:
          'https://www.indoorclimbinggym.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Helper: Parse working hours string to OpeningHoursSpecification array
 * Format: "mon:06:00-22:00|tue:06:00-22:00|..."
 * @param hoursString Pipe-delimited hours string
 * @returns Array of OpeningHoursSpecification objects
 */
function parseOpeningHours(hoursString: string) {
  if (!hoursString) return [];

  const dayMap: { [key: string]: string } = {
    mon: 'Monday',
    tue: 'Tuesday',
    wed: 'Wednesday',
    thu: 'Thursday',
    fri: 'Friday',
    sat: 'Saturday',
    sun: 'Sunday',
  };

  return hoursString
    .split('|')
    .map((entry) => {
      const colonIndex = entry.indexOf(':');
      if (colonIndex < 0) return null;

      const day = entry.substring(0, colonIndex);
      const timeRange = entry.substring(colonIndex + 1);
      const [opens, closes] = timeRange.split('-');

      if (!opens || !closes) return null;

      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayMap[day.toLowerCase()] || day,
        opens,
        closes,
      };
    })
    .filter(Boolean);
}

/**
 * Generate HowTo schema for step-by-step guides
 * @param title Title of the how-to guide
 * @param description Description of what will be accomplished
 * @param steps Array of step objects with name and text
 * @param totalTime Optional total time in ISO 8601 duration format (e.g., "PT30M" for 30 minutes)
 * @returns JSON-LD schema object
 */
export function generateHowToSchema(
  title: string,
  description: string,
  steps: Array<{ name: string; text: string; image?: string }>,
  totalTime?: string
) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: description,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image })
    }))
  };

  if (totalTime) {
    schema.totalTime = totalTime;
  }

  return schema;
}

/**
 * Generate ScholarlyArticle schema for research studies
 * @param study Study metadata object
 * @param pageUrl Full URL of the study page
 * @returns JSON-LD schema object
 */
export function generateScholarlyArticleSchema(study: {
  title: string;
  description: string;
  publishedDate: string;
  updatedDate: string;
  author?: string;
  keywords?: string[];
  citation?: string;
  gymsAnalyzed?: number;
}, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    '@id': pageUrl,
    headline: study.title,
    abstract: study.description,
    author: {
      '@type': 'Organization',
      name: study.author || 'IndoorClimbingGym Research Team',
      url: 'https://www.indoorclimbinggym.com'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: 'https://www.indoorclimbinggym.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.indoorclimbinggym.com/logo.png'
      }
    },
    datePublished: study.publishedDate,
    dateModified: study.updatedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl
    },
    ...(study.keywords && { keywords: study.keywords.join(', ') }),
    ...(study.citation && { citation: study.citation }),
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    ...(study.gymsAnalyzed && {
      about: {
        '@type': 'Thing',
        name: `Climbing Gym Grading Analysis of ${study.gymsAnalyzed} facilities`
      }
    })
  };
}

/**
 * Generate Dataset schema for downloadable research data
 * @param dataset Dataset metadata
 * @param pageUrl Full URL of the dataset/study page
 * @returns JSON-LD schema object
 */
export function generateDatasetSchema(dataset: {
  name: string;
  description: string;
  datePublished: string;
  dateModified: string;
  creator?: string;
  keywords?: string[];
  variablesMeasured?: string[];
  spatialCoverage?: string;
  temporalCoverage?: string;
}, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    '@id': `${pageUrl}#dataset`,
    name: dataset.name,
    description: dataset.description,
    creator: {
      '@type': 'Organization',
      name: dataset.creator || SITE_NAME,
      url: 'https://www.indoorclimbinggym.com'
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: 'https://www.indoorclimbinggym.com'
    },
    datePublished: dataset.datePublished,
    dateModified: dataset.dateModified,
    license: 'https://creativecommons.org/licenses/by/4.0/',
    isAccessibleForFree: true,
    inLanguage: 'en-US',
    ...(dataset.keywords && { keywords: dataset.keywords }),
    ...(dataset.variablesMeasured && { variablesMeasured: dataset.variablesMeasured }),
    ...(dataset.spatialCoverage && { spatialCoverage: dataset.spatialCoverage }),
    ...(dataset.temporalCoverage && { temporalCoverage: dataset.temporalCoverage })
  };
}

/**
 * Generate ItemList schema for study index pages
 * @param studies Array of study objects
 * @param pageTitle Title of the collection
 * @param pageUrl Full URL of the index page
 * @returns JSON-LD schema object
 */
export function generateStudyListSchema(studies: Array<{
  title: string;
  slug: string;
  description: string;
}>, pageTitle: string, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    description: 'Research studies and data analysis about climbing gyms',
    url: pageUrl,
    numberOfItems: studies.length,
    itemListElement: studies.map((study, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'ScholarlyArticle',
        '@id': `${pageUrl}/${study.slug}`,
        name: study.title,
        description: study.description,
        url: `${pageUrl}/${study.slug}`
      }
    }))
  };
}

/**
 * Generate VideoObject schema for embedded YouTube videos
 * @param videoId YouTube video ID
 * @param title Video title (optional, defaults to generic)
 * @param description Video description (optional)
 * @returns JSON-LD schema object
 */
export function generateVideoSchema(
  videoId: string,
  title?: string,
  description?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    '@id': `https://www.youtube.com/watch?v=${videoId}`,
    name: title || 'Climbing Guide Video',
    description: description || 'Educational video about indoor climbing',
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    embedUrl: `https://www.youtube.com/embed/${videoId}`,
    uploadDate: new Date().toISOString(),
    contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
  };
}

/**
 * Serialize schema to JSON-LD script tag content
 * @param schema Schema object
 * @returns JSON string for script tag
 */
export function serializeSchema(schema: any): string {
  return JSON.stringify(schema, null, 0);
}
