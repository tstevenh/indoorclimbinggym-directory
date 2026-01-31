/**
 * JSON-LD Schema Generators
 * Creates structured data for all page types per schema.org standards
 */

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
    '@id': pageUrl,
    name: gym.name,
    description: gym.about || gym.description_short,
    address: {
      '@type': 'PostalAddress',
      streetAddress: gym.full_address,
      addressLocality: gym.city,
      addressRegion: gym.region,
      postalCode: gym.postal_code,
      addressCountry: gym.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: gym.latitude,
      longitude: gym.longtitude, // Note: uses misspelled field from schema
    },
    // For LocalBusiness, url is typically the official site; we keep gym.website here.
    // The schema @id is the canonical pageUrl.
    url: gym.website,
    sport: 'Rock Climbing',
  };

  if (gym.photo) schema.image = gym.photo;
  if (gym.phone) schema.telephone = gym.phone;

  // Avoid invalid placeholder values like "$null".
  if (typeof gym.day_pass_price_local === 'number' && gym.day_pass_price_local > 0) {
    schema.priceRange = `$${gym.day_pass_price_local}`;
  }

  if (openingHours.length) schema.openingHoursSpecification = openingHours;

  // Only include aggregateRating if we have reviews (Google requires reviewCount > 0)
  if (gym.review_count && gym.review_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: gym.rating_overall || gym.rating,
      reviewCount: gym.review_count,
      bestRating: 5,
      worstRating: 1,
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
 * Generate ItemList schema for city/state pages showing multiple gyms
 * @param gyms Array of gym objects
 * @param listName Name of the list (e.g., "Climbing Gyms in Seattle")
 * @param pageUrl URL of the page
 * @returns JSON-LD schema object
 */
export function generateItemListSchema(
  gyms: Gym[],
  listName: string,
  pageUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    url: pageUrl,
    numberOfItems: gyms.length,
    itemListElement: gyms.map((gym, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: gym.name,
        url: `https://www.indoorclimbinggym.com/gyms/${gym.slug}/`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: gym.city,
          addressRegion: gym.region,
        },
        // Only include aggregateRating if we have reviews (Google requires reviewCount > 0)
        ...(gym.review_count && gym.review_count > 0 && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: gym.rating_overall || gym.rating,
            reviewCount: gym.review_count,
            bestRating: 5,
            worstRating: 1,
          },
        }),
      },
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
    publisher: {
      '@type': 'Organization',
      name: 'IndoorClimbingGym.com',
      url: 'https://www.indoorclimbinggym.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.indoorclimbinggym.com/logo.png',
      },
    },
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
    name: 'IndoorClimbingGym',
    url: 'https://www.indoorclimbinggym.com',
    logo: 'https://www.indoorclimbinggym.com/logo.png',
    description:
      'Find the best indoor climbing gyms near you. Search by location, amenities, and climbing type. Reviews, prices, and directions for climbers.',
    sameAs: [
      // Add social media URLs when available
    ],
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
    url: 'https://www.indoorclimbinggym.com',
    name: 'IndoorClimbingGym',
    description: 'Find your next climb. Indoor climbing gym directory.',
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
      name: study.author || 'IndoorClimbingGym.com Research Team',
      url: 'https://www.indoorclimbinggym.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'IndoorClimbingGym.com',
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
      name: dataset.creator || 'IndoorClimbingGym.com',
      url: 'https://www.indoorclimbinggym.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'IndoorClimbingGym.com',
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
