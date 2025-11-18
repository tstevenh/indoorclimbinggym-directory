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
  const amenitiesList = gym.amenities?.split('|') || [];

  return {
    '@context': 'https://schema.org',
    '@type': ['SportsActivityLocation', 'LocalBusiness'],
    '@id': pageUrl,
    name: gym.name,
    image: gym.photo,
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
    telephone: gym.phone,
    url: gym.website,
    priceRange: `$${gym.day_pass_price_local}`,
    openingHoursSpecification: openingHours,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: gym.rating_overall || gym.rating,
      reviewCount: gym.review_count || 0,
      bestRating: 5,
      worstRating: 1,
    },
    // Add detailed rating breakdown as additional properties
    ...(gym.rating_route_quality > 0 && {
      additionalProperty: [
        ...(gym.rating_route_quality > 0 ? [{
          '@type': 'PropertyValue',
          name: 'Route Quality Rating',
          value: gym.rating_route_quality,
          maxValue: 5,
          minValue: 0
        }] : []),
        ...(gym.rating_cleanliness > 0 ? [{
          '@type': 'PropertyValue',
          name: 'Cleanliness Rating',
          value: gym.rating_cleanliness,
          maxValue: 5,
          minValue: 0
        }] : []),
        ...(gym.rating_staff_friendliness > 0 ? [{
          '@type': 'PropertyValue',
          name: 'Staff Friendliness Rating',
          value: gym.rating_staff_friendliness,
          maxValue: 5,
          minValue: 0
        }] : []),
        ...(gym.rating_facilities > 0 ? [{
          '@type': 'PropertyValue',
          name: 'Facilities Rating',
          value: gym.rating_facilities,
          maxValue: 5,
          minValue: 0
        }] : []),
        ...(gym.rating_value_for_money > 0 ? [{
          '@type': 'PropertyValue',
          name: 'Value for Money Rating',
          value: gym.rating_value_for_money,
          maxValue: 5,
          minValue: 0
        }] : [])
      ].filter(Boolean)
    }),
    amenityFeature: amenitiesList.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity.replace(/_/g, ' '),
      value: true,
    })),
    sport: 'Rock Climbing',
    ...(gym.why_climbers_like_it && gym.why_climbers_like_it.length > 0 && {
      knowsAbout: gym.why_climbers_like_it
    }),
  };
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
        '@type': 'Place',
        name: gym.name,
        url: `https://www.indoorclimbinggym.com/gyms/${gym.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: gym.city,
          addressRegion: gym.region,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: gym.rating,
        },
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
 * @param post Blog post object with all necessary fields
 * @param pageUrl Full URL of the article page
 * @returns JSON-LD schema object
 */
export function generateArticleSchema(post: any, pageUrl: string) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.heroImage,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'IndoorClimbingGym.com',
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

  return hoursString.split('|').map(entry => {
    const colonIndex = entry.indexOf(':');
    const day = entry.substring(0, colonIndex);
    const timeRange = entry.substring(colonIndex + 1);
    const [opens, closes] = timeRange.split('-');

    return {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: dayMap[day.toLowerCase()] || day,
      opens: opens,
      closes: closes,
    };
  });
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
 * Serialize schema to JSON-LD script tag content
 * @param schema Schema object
 * @returns JSON string for script tag
 */
export function serializeSchema(schema: any): string {
  return JSON.stringify(schema, null, 0);
}
