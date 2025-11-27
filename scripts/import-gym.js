#!/usr/bin/env node

/**
 * Import Gym Script
 *
 * Imports a gym from JSON file to Supabase database
 * Usage: node scripts/import-gym.js path/to/gym.json
 *
 * Features:
 * - Validates all gym data
 * - Auto-generates unique slugs
 * - Transforms state codes to full names
 * - Checks for duplicate slugs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

// State code to full name mapping (all 50 US states)
const STATE_CODES = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'DC': 'District Of Columbia'
};

// Initialize Supabase client with service role key (bypasses RLS)
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in environment variables');
  console.error('   Make sure PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Generate slug from gym name and city
 * Format: gym-name-city (lowercase, hyphenated)
 */
function generateSlug(name, city) {
  const gymSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .trim();

  const citySlug = city
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  return `${gymSlug}-${citySlug}`;
}

/**
 * Check if slug exists and generate unique one if needed
 */
async function generateUniqueSlug(name, city) {
  const baseSlug = generateSlug(name, city);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    // Check if slug exists
    const { data, error } = await supabase
      .from('gyms')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw new Error(`Database error checking slug: ${error.message}`);
    }

    // If no match, slug is unique
    if (!data) {
      return slug;
    }

    // Try next number
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

/**
 * Transform region code to full state name
 */
function transformRegion(region) {
  // If already full name, return as-is
  if (Object.values(STATE_CODES).includes(region)) {
    return region;
  }

  // If state code, transform
  const upperRegion = region.toUpperCase();
  if (STATE_CODES[upperRegion]) {
    return STATE_CODES[upperRegion];
  }

  throw new Error(`Invalid state code: ${region}. Must be 2-letter code (e.g., HI) or full name (e.g., Hawaii)`);
}

/**
 * Transform country to database format
 */
function transformCountry(country) {
  if (!country) return 'United States of America';

  const normalized = country.toLowerCase();
  if (normalized === 'usa' || normalized === 'us' || normalized === 'united states') {
    return 'United States of America';
  }

  return country;
}

/**
 * Validate required fields
 */
function validateGym(gym) {
  const errors = [];

  // Required fields
  if (!gym.name) errors.push('name is required');
  if (!gym.address) errors.push('address is required');
  if (!gym.city) errors.push('city is required');
  if (!gym.region) errors.push('region is required');

  // Validate coordinates
  if (gym.latitude !== null && gym.latitude !== undefined) {
    if (typeof gym.latitude !== 'number' || gym.latitude < -90 || gym.latitude > 90) {
      errors.push('latitude must be a number between -90 and 90');
    }
  }
  if (gym.longitude !== null && gym.longitude !== undefined) {
    if (typeof gym.longitude !== 'number' || gym.longitude < -180 || gym.longitude > 180) {
      errors.push('longitude must be a number between -180 and 180');
    }
  }

  // Validate URL format
  if (gym.website) {
    try {
      new URL(gym.website);
    } catch {
      errors.push('website must be a valid URL');
    }
  }

  // Validate email format
  if (gym.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(gym.email)) {
      errors.push('email must be a valid email address');
    }
  }

  return errors;
}

/**
 * Transform and prepare gym data for database
 */
async function prepareGymData(gym) {
  const errors = validateGym(gym);
  if (errors.length > 0) {
    throw new Error(`Validation errors:\n  - ${errors.join('\n  - ')}`);
  }

  // Transform region and country
  const region = transformRegion(gym.region);
  const country = transformCountry(gym.country);

  // Generate unique slug
  const slug = await generateUniqueSlug(gym.name, gym.city);

  console.log(`   Generated slug: ${slug}`);
  console.log(`   Transformed region: ${gym.region} → ${region}`);
  console.log(`   Transformed country: ${gym.country || 'null'} → ${country}`);

  // Prepare data for insertion
  return {
    name: gym.name,
    slug: slug,
    address: gym.address,
    city: gym.city,
    region: region,
    country: country,
    latitude: gym.latitude || null,
    longitude: gym.longitude || null,
    timezone: gym.timezone || null,
    phone: gym.phone || null,
    email: gym.email || null,
    website: gym.website || null,
    hero_image: gym.hero_image || null,
    logo: gym.logo || null,
    google_maps_url: gym.google_maps_url || null,
    climbing_types: gym.climbing_types || null,
    difficulty_grades: gym.difficulty_grades || null,
    total_routes: gym.total_routes || null,
    wall_height_meters: gym.wall_height_meters || null,
    amenities: gym.amenities || null,
    custom_amenities: gym.custom_amenities || null,
    training_facilities: gym.training_facilities || null,
    rental_equipment: gym.rental_equipment || null,
    day_pass_price_local: gym.day_pass_price_local || null,
    membership_from_local: gym.membership_from_local || null,
    currency: gym.currency || 'USD',
    student_discount: gym.student_discount || false,
    working_hour: gym.working_hour || null,
    route_reset_frequency: gym.route_reset_frequency || null,
    beginner_friendly: gym.beginner_friendly || false,
    group_rates: gym.group_rates || false,
    about: gym.about || null,
    faq: gym.faq || null,
    why_climbers_like_it: gym.why_climbers_like_it || null,
    rating_overall: gym.rating_overall || 0.00,
    rating_route_quality: gym.rating_route_quality || 0.00,
    rating_cleanliness: gym.rating_cleanliness || 0.00,
    rating_staff_friendliness: gym.rating_staff_friendliness || 0.00,
    rating_facilities: gym.rating_facilities || 0.00,
    rating_value_for_money: gym.rating_value_for_money || 0.00,
    status: 'published', // Auto-publish imported gyms
  };
}

/**
 * Import gym to database
 */
async function importGym(filePath) {
  console.log('🏋️  Importing gym...\n');

  // Read JSON file
  let gymData;
  try {
    const fileContent = readFileSync(resolve(filePath), 'utf-8');
    gymData = JSON.parse(fileContent);
    console.log(`✅ Read file: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error reading file: ${error.message}`);
    process.exit(1);
  }

  // Validate and transform data
  let preparedData;
  try {
    console.log('\n🔍 Validating and transforming data...');
    preparedData = await prepareGymData(gymData);
    console.log('✅ Validation passed');
  } catch (error) {
    console.error(`\n❌ ${error.message}`);
    process.exit(1);
  }

  // Insert to database
  console.log('\n💾 Inserting to database...');
  const { data, error } = await supabase
    .from('gyms')
    .insert(preparedData)
    .select('id, name, slug, city, region')
    .single();

  if (error) {
    console.error(`\n❌ Database error: ${error.message}`);
    console.error('Details:', error);
    process.exit(1);
  }

  // Success!
  console.log('\n✅ Success! Gym imported successfully\n');
  console.log('📋 Details:');
  console.log(`   ID: ${data.id}`);
  console.log(`   Name: ${data.name}`);
  console.log(`   Slug: ${data.slug}`);
  console.log(`   Location: ${data.city}, ${data.region}`);
  console.log(`   URL: https://indoorclimbinggym.com/${data.region.toLowerCase().replace(/\s+/g, '-')}/${data.city.toLowerCase().replace(/\s+/g, '-')}/1`);
  console.log('');
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node scripts/import-gym.js path/to/gym.json');
  process.exit(1);
}

importGym(args[0]);
