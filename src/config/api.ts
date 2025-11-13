/**
 * Gym Data API - Direct Supabase Queries
 * Fetches gym data directly from Supabase database
 */

import { createSimpleClient } from '../lib/supabase'

/**
 * Fetch all gyms with optional filters
 * @param params Optional query parameters (city, region, limit, etc.)
 * @returns Array of gym objects
 */
export async function fetchGyms(params?: Record<string, string>) {
  try {
    const supabase = createSimpleClient()

    // Start building the query
    let query = supabase
      .from('gyms')
      .select('*')
      .eq('status', 'published')

    // Apply filters if provided
    if (params) {
      if (params.city) {
        query = query.eq('city', params.city)
      }

      if (params.region) {
        query = query.eq('region', params.region)
      }

      if (params.limit) {
        const limitNum = parseInt(params.limit, 10)
        if (!isNaN(limitNum) && limitNum > 0) {
          query = query.limit(limitNum)
        }
      }
    }

    // Execute query
    const { data: gyms, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      throw new Error(`Failed to fetch gyms: ${error.message}`)
    }

    // Process gyms: check featured expiration, calculate overall rating, and sort
    const processedGyms = (gyms || []).map(gym => {
      // Check if featured subscription has expired
      const isFeaturedActive = gym.featured &&
        (!gym.featured_until || new Date(gym.featured_until) > new Date())

      // Calculate rating_overall as average of 5 detailed ratings
      const detailedRatings = [
        gym.rating_route_quality,
        gym.rating_cleanliness,
        gym.rating_staff_friendliness,
        gym.rating_facilities,
        gym.rating_value_for_money
      ].filter(rating => rating > 0) // Exclude unrated (0.00)

      const calculatedOverall = detailedRatings.length > 0
        ? Number((detailedRatings.reduce((sum, r) => sum + r, 0) / detailedRatings.length).toFixed(2))
        : gym.rating || 0.00

      return {
        ...gym,
        featured: isFeaturedActive, // Update featured based on expiration
        rating_overall: gym.rating_overall || calculatedOverall, // Use stored or calculated
        rating: gym.rating_overall || calculatedOverall, // Legacy field for compatibility
      }
    })

    // Sort gyms: featured DESC, rating DESC, name ASC
    processedGyms.sort((a, b) => {
      // First sort by featured status
      if (a.featured !== b.featured) {
        return b.featured ? 1 : -1
      }

      // Then by rating (descending)
      const ratingA = a.rating_overall || a.rating || 0
      const ratingB = b.rating_overall || b.rating || 0
      if (ratingA !== ratingB) {
        return ratingB - ratingA
      }

      // Finally by name (ascending)
      return (a.name || '').localeCompare(b.name || '')
    })

    return processedGyms
  } catch (error) {
    console.error('Error fetching gyms:', error)
    throw error
  }
}

/**
 * Fetch a single gym by slug or UUID
 * @param identifier Gym slug or UUID
 * @returns Single gym object
 */
export async function fetchGymBySlug(identifier: string) {
  try {
    const supabase = createSimpleClient()

    // Try to find by slug first
    let { data: gym, error } = await supabase
      .from('gyms')
      .select('*')
      .eq('slug', identifier)
      .eq('status', 'published')
      .single()

    // If not found by slug, try by ID
    if (error && error.code === 'PGRST116') {
      const result = await supabase
        .from('gyms')
        .select('*')
        .eq('id', identifier)
        .eq('status', 'published')
        .single()

      gym = result.data
      error = result.error
    }

    if (error) {
      console.error('Supabase query error:', error)
      throw new Error(`Failed to fetch gym: ${error.message}`)
    }

    if (!gym) {
      throw new Error(`Gym not found: ${identifier}`)
    }

    // Process single gym (same logic as fetchGyms)
    const isFeaturedActive = gym.featured &&
      (!gym.featured_until || new Date(gym.featured_until) > new Date())

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

    return {
      ...gym,
      featured: isFeaturedActive,
      rating_overall: gym.rating_overall || calculatedOverall,
      rating: gym.rating_overall || calculatedOverall,
    }
  } catch (error) {
    console.error('Error fetching gym:', error)
    throw error
  }
}

/**
 * Extract unique metadata from gyms (for filters)
 * @param gyms Array of gym objects
 * @returns Object with unique cities, states, amenities, and climbing types
 */
export function extractGymMetadata(gyms: any[]) {
  const cities = [...new Set(gyms.map(g => g.city))].filter(Boolean).sort()
  const states = [...new Set(gyms.map(g => g.region))].filter(Boolean).sort()

  // Extract all unique amenities
  const amenitiesSet = new Set<string>()
  gyms.forEach(g => {
    if (g.amenities) {
      g.amenities.split('|').forEach((a: string) => amenitiesSet.add(a.trim()))
    }
  })
  const amenities = [...amenitiesSet].filter(Boolean).sort()

  // Extract all unique climbing types
  const climbingTypesSet = new Set<string>()
  gyms.forEach(g => {
    if (g.climbing_types) {
      g.climbing_types.split('|').forEach((t: string) => climbingTypesSet.add(t.trim()))
    }
  })
  const climbingTypes = [...climbingTypesSet].filter(Boolean).sort()

  return {
    cities,
    states,
    amenities,
    climbingTypes,
  }
}
