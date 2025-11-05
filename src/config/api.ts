/**
 * API Configuration and Helper Functions
 * Centralized API calls to Next.js backend
 */

export const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Transform API gym object to match Astro site's expected format
 * Maps database schema to legacy JSON format
 */
function transformGym(apiGym: any): any {
  return {
    // Basic info
    id: apiGym.id, // UUID (was numeric in JSON)
    name: apiGym.name,
    slug: apiGym.slug,
    verified: apiGym.verified || false,
    claimed: apiGym.claimed || false,
    featured: apiGym.featured || false,
    status: apiGym.status || 'open',

    // Location
    full_address: apiGym.address || '',
    postal_code: apiGym.postal_code || '',
    latitude: apiGym.latitude || 0,
    longtitude: apiGym.longitude || 0, // Note: keeping misspelling for compatibility
    city: apiGym.city,
    region: apiGym.region,
    country: apiGym.country || 'US',
    timezone: apiGym.timezone || 'America/Los_Angeles',

    // Contact
    phone: apiGym.phone || '',
    email: apiGym.email || '',
    website: apiGym.website || '',
    location_link: apiGym.location_link || '',
    street_view: apiGym.street_view || '',

    // Media
    photo: apiGym.hero_image || '', // Map hero_image to photo
    logo: apiGym.logo || '',

    // Features
    amenities: apiGym.amenities || '',
    custom_amenities: apiGym.custom_amenities || '',
    working_hour: apiGym.working_hour || '', // Working hours in pipe-delimited format
    rating: apiGym.rating || 0,
    review_count: apiGym.review_count || 0,

    // Descriptions
    description_short: apiGym.description_short || `Premier climbing gym in ${apiGym.city}`,
    description_long: apiGym.description_long || '',

    // Climbing info
    climbing_types: apiGym.climbing_types || '',
    grade_system: apiGym.difficulty_grades || '', // Map difficulty_grades to grade_system for backwards compatibility
    route_style: apiGym.climbing_types || '', // Derive from climbing_types
    route_reset_frequency: apiGym.route_reset_frequency || '',
    total_problems: apiGym.total_routes || 0, // Map total_routes to total_problems for backwards compatibility
    total_routes: apiGym.total_routes || 0, // Keep original field name for consistency
    wall_height_meters: apiGym.wall_height_meters || 0,
    difficulty_grades: apiGym.difficulty_grades || '',

    // Training
    crowd_peak_notes: apiGym.crowd_peak_notes || '',
    training_facilities: apiGym.training_facilities || '',
    gear_rental: apiGym.rental_equipment || '', // Map rental_equipment to gear_rental

    // Features
    beginner_friendly: apiGym.beginner_friendly || false,
    access_notes: apiGym.access_notes || '',

    // Pricing
    day_pass_price_local: apiGym.day_pass_price_local || 0,
    student_discount: apiGym.student_discount || false,
    membership_from_local: apiGym.membership_from_local || 0,
    currency: apiGym.currency || 'USD',
    price_type: apiGym.price_type || 'day_pass',
    label: apiGym.label || 'Day Pass',
    amount_local: apiGym.day_pass_price_local || 0,
    conditions: apiGym.conditions || '',
    group_rates: apiGym.group_rates || false,

    // Additional fields
    section: apiGym.section || '',
    discipline: apiGym.discipline || '',
    grade_range: apiGym.grade_range || '',
    problems_or_routes: apiGym.total_routes || 0, // Map total_routes to problems_or_routes
    last_reset_date: apiGym.last_reset_date || '',
    next_reset_expectation: apiGym.route_reset_frequency || '',

    // Custom Content Fields
    about: apiGym.about || null,
    faq: apiGym.faq || null,
    why_climbers_like_it: apiGym.why_climbers_like_it || null,

    // Detailed Ratings (replaces legacy rating field)
    rating_overall: apiGym.rating_overall || apiGym.rating || 0,
    rating_route_quality: apiGym.rating_route_quality || 0,
    rating_cleanliness: apiGym.rating_cleanliness || 0,
    rating_staff_friendliness: apiGym.rating_staff_friendliness || 0,
    rating_facilities: apiGym.rating_facilities || 0,
    rating_value_for_money: apiGym.rating_value_for_money || 0,
  };
}

/**
 * Fetch all gyms with optional filters
 * @param params Optional query parameters (city, region, limit, etc.)
 * @returns Array of gym objects
 */
export async function fetchGyms(params?: Record<string, string>) {
  try {
    const url = new URL(`${API_BASE_URL}/api/gyms`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, value);
        }
      });
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch gyms: ${response.statusText}`);
    }

    const data = await response.json();
    const gyms = data.gyms || [];

    // Transform each gym to match expected format
    return gyms.map(transformGym);
  } catch (error) {
    console.error('Error fetching gyms:', error);
    throw error;
  }
}

/**
 * Fetch a single gym by slug or UUID
 * @param identifier Gym slug or UUID
 * @returns Single gym object
 */
export async function fetchGymBySlug(identifier: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/gyms/${identifier}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch gym: ${response.statusText}`);
    }

    const data = await response.json();
    return transformGym(data.gym);
  } catch (error) {
    console.error('Error fetching gym:', error);
    throw error;
  }
}

/**
 * Extract unique metadata from gyms (for filters)
 * @param gyms Array of gym objects
 * @returns Object with unique cities, states, amenities, and climbing types
 */
export function extractGymMetadata(gyms: any[]) {
  const cities = [...new Set(gyms.map(g => g.city))].sort();
  const states = [...new Set(gyms.map(g => g.region))].sort();

  // Extract all unique amenities
  const amenitiesSet = new Set<string>();
  gyms.forEach(g => {
    if (g.amenities) {
      g.amenities.split('|').forEach((a: string) => amenitiesSet.add(a));
    }
  });
  const amenities = [...amenitiesSet].sort();

  // Extract all unique climbing types
  const climbingTypesSet = new Set<string>();
  gyms.forEach(g => {
    if (g.climbing_types) {
      g.climbing_types.split('|').forEach((t: string) => climbingTypesSet.add(t));
    }
  });
  const climbingTypes = [...climbingTypesSet].sort();

  return {
    cities,
    states,
    amenities,
    climbingTypes,
  };
}
