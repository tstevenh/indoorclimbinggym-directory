#!/usr/bin/env tsx
/**
 * Migrate Google Images to Cloudinary for Duplicate Gyms
 *
 * Workflow:
 * 1. Parse gym_comparison_result.csv (DUPLICATE section)
 * 2. For each gym: check if hero_image is Google URL
 * 3. Get fresh photo URL from Outscraper CSV (by place_id/google_id)
 * 4. Download from Google → Upload to Cloudinary
 * 5. Update Supabase gyms.hero_image with Cloudinary URL
 */

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';

// ==================== CONFIGURATION ====================

const COMPARISON_CSV = '/Users/tsth/Coding/rockclimbing/gym_comparison_result.csv';
const OUTSCRAPER_CSV = '/Users/tsth/Coding/rockclimbing/Outscraper-20260118105518m27_rock_climbing_gym.csv';

// Supabase (from environment variables)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://yfdxgdnpyexumypcusie.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

// Cloudinary (from environment variables)
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
};

if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
  throw new Error('CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables are required');
}

cloudinary.config(cloudinaryConfig);

const CLOUDINARY_FOLDER = 'indoorclimbing-gym/gyms';

// ==================== TYPES ====================

interface DuplicateGym {
  name: string;
  name_for_emails: string;
  address: string;
  city: string;
  state: string;
  website: string;
  phone: string;
  rating: string;
  reviews: string;
  place_id: string;
  google_id: string;
  match_name: string;
  match_address: string;
  match_city: string;
  match_slug: string;
  match_id: string;
  match_reason: string;
}

interface OutscraperGym {
  name: string;
  place_id: string;
  google_id: string;
  photo: string;
  photos_count: string;
}

interface SupabaseGym {
  id: string;
  name: string;
  hero_image: string | null;
  slug: string;
}

// ==================== CSV PARSING ====================

function parseCSVLine(line: string, delimiter: string = ','): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseDuplicateGyms(content: string): DuplicateGym[] {
  const lines = content.split('\n');
  const gyms: DuplicateGym[] = [];
  let inDuplicateSection = false;
  let headers: string[] = [];
  let processedHeader = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check for DUPLICATE section header (case-insensitive)
    if (line.toUpperCase().includes('DUPLICATE GYMS')) {
      inDuplicateSection = true;
      continue;
    }

    // Exit duplicate section if we hit another section
    if (inDuplicateSection && (line.toUpperCase().includes('NOT PUBLISHED') || line.includes('====') || line.includes('---'))) {
      break;
    }

    if (!inDuplicateSection) continue;
    if (line === '') continue;

    // Process header row in duplicate section
    if (!processedHeader && line.startsWith('name,')) {
      headers = parseCSVLine(line.trim());
      processedHeader = true;
      continue;
    }

    if (!processedHeader) continue;

    const values = parseCSVLine(line.trim());
    if (values.length < headers.length) continue;

    const gym: any = {};
    headers.forEach((header, index) => {
      gym[header] = values[index] || '';
    });

    if (gym.match_id && gym.match_id.length > 10) {
      gyms.push(gym as DuplicateGym);
    }
  }

  return gyms;
}

function parseOutscraperGyms(content: string): Map<string, OutscraperGym> {
  const lines = content.split('\n');
  const gymMap = new Map<string, OutscraperGym>();
  const headers = parseCSVLine(lines[0], ';');  // Semicolon delimiter

  const placeIdx = headers.indexOf('place_id');
  const googleIdx = headers.indexOf('google_id');
  const nameIdx = headers.indexOf('name');
  const photoIdx = headers.indexOf('photo');
  const photosCountIdx = headers.indexOf('photos_count');

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i], ';');  // Semicolon delimiter
    if (values.length < headers.length) continue;

    const gym: OutscraperGym = {
      name: values[nameIdx] || '',
      place_id: values[placeIdx] || '',
      google_id: values[googleIdx] || '',
      photo: values[photoIdx] || '',
      photos_count: values[photosCountIdx] || '0',
    };

    // Index by both place_id and google_id
    if (gym.place_id) gymMap.set(`place:${gym.place_id}`, gym);
    if (gym.google_id) gymMap.set(`google:${gym.google_id}`, gym);
  }

  return gymMap;
}

// ==================== IMAGE FUNCTIONS ====================

function isGoogleImageUrl(url: string | null): boolean {
  if (!url) return false;
  return url.includes('googleusercontent.com') || url.includes('google.com');
}

function generateCloudinaryPublicId(name: string, city: string): string {
  const cleanName = name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  const cleanCity = city.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_');

  return `${cleanName}_${cleanCity}`;
}

async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToCloudinary(
  imageBuffer: Buffer,
  publicId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: CLOUDINARY_FOLDER,
        format: 'webp',
        quality: 'auto',
        fetch_format: 'webp',
        invalidate: true,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(imageBuffer);
  });
}

// ==================== MAIN PROCESS ====================

interface MigrationResult {
  gymId: string;
  gymName: string;
  oldImageUrl: string;
  newImageUrl: string;
  success: boolean;
  error?: string;
}

async function migrateImages(): Promise<void> {
  console.log('🚀 MIGRATING GOOGLE IMAGES TO CLOUDINARY');
  console.log('='.repeat(60));

  // Initialize Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  // Parse CSV files
  console.log('📂 Parsing CSV files...');

  const comparisonContent = fs.readFileSync(COMPARISON_CSV, 'utf-8');
  const duplicateGyms = parseDuplicateGyms(comparisonContent);
  console.log(`   ✅ Found ${duplicateGyms.length} duplicate gyms in comparison CSV`);

  const outscraperContent = fs.readFileSync(OUTSCRAPER_CSV, 'utf-8');
  const outscraperMap = parseOutscraperGyms(outscraperContent);
  console.log(`   ✅ Parsed ${outscraperMap.size} gyms from Outscraper CSV`);

  // Get match IDs from duplicate gyms
  const matchIds = duplicateGyms.map(g => g.match_id).filter(Boolean);
  console.log(`   📋 ${matchIds.length} unique gym IDs to check`);

  // Query Supabase in batches (max 100 IDs per query)
  console.log('\n📊 Querying Supabase for gyms with Google images...');

  const batchSize = 100;
  let allGyms: SupabaseGym[] = [];

  for (let i = 0; i < matchIds.length; i += batchSize) {
    const batch = matchIds.slice(i, i + batchSize);
    const { data, error } = await supabase
      .from('gyms')
      .select('id, name, hero_image, slug')
      .in('id', batch);

    if (error) {
      console.error(`❌ Batch ${i / batchSize + 1} error:`, error);
    } else if (data) {
      allGyms.push(...data);
    }
  }

  console.log(`   ✅ Found ${allGyms.length} gyms in Supabase`);

  // Filter gyms with Google images
  const gymsNeedingMigration = (allGyms || []).filter(gym =>
    isGoogleImageUrl(gym.hero_image)
  );

  console.log(`   📸 ${gymsNeedingMigration.length} gyms have Google image URLs\n`);

  if (gymsNeedingMigration.length === 0) {
    console.log('✨ No gyms need migration!');
    return;
  }

  // Create a lookup map for duplicate gyms
  const duplicateMap = new Map<string, DuplicateGym>();
  for (const gym of duplicateGyms) {
    if (gym.match_id) {
      duplicateMap.set(gym.match_id, gym);
    }
  }

  // Process each gym
  const results: MigrationResult[] = [];
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (let i = 0; i < gymsNeedingMigration.length; i++) {
    const gym = gymsNeedingMigration[i];
    const duplicateGym = duplicateMap.get(gym.id);

    if (!duplicateGym) {
      console.log(`⚠️  [${i + 1}/${gymsNeedingMigration.length}] No match found for ${gym.name}`);
      skipCount++;
      continue;
    }

    console.log(`\n[${i + 1}/${gymsNeedingMigration.length}] ${gym.name}`);
    console.log(`   Current: ${gym.hero_image?.substring(0, 60)}...`);

    // Find photo in Outscraper CSV
    let outscraperGym: OutscraperGym | undefined;
    if (duplicateGym.place_id) {
      outscraperGym = outscraperMap.get(`place:${duplicateGym.place_id}`);
    }
    if (!outscraperGym && duplicateGym.google_id) {
      outscraperGym = outscraperMap.get(`google:${duplicateGym.google_id}`);
    }

    if (!outscraperGym || !outscraperGym.photo) {
      console.log(`   ⚠️  No photo found in Outscraper CSV`);
      skipCount++;
      continue;
    }

    console.log(`   📷 Found photo in Outscraper CSV`);
    console.log(`   Source: ${outscraperGym.photo.substring(0, 60)}...`);

    // Download and upload
    try {
      const imageBuffer = await downloadImage(outscraperGym.photo);
      console.log(`   ✅ Downloaded ${imageBuffer.length} bytes`);

      const publicId = generateCloudinaryPublicId(gym.name, duplicateGym.city || '');
      console.log(`   ☁️  Uploading to Cloudinary: ${publicId}`);

      const cloudinaryUrl = await uploadToCloudinary(imageBuffer, publicId);
      console.log(`   ✅ Uploaded: ${cloudinaryUrl}`);

      // Update Supabase
      const { error: updateError } = await supabase
        .from('gyms')
        .update({ hero_image: cloudinaryUrl })
        .eq('id', gym.id);

      if (updateError) {
        console.log(`   ❌ Failed to update Supabase: ${updateError.message}`);
        errorCount++;
        results.push({
          gymId: gym.id,
          gymName: gym.name,
          oldImageUrl: gym.hero_image || '',
          newImageUrl: cloudinaryUrl,
          success: false,
          error: updateError.message,
        });
      } else {
        console.log(`   ✅ Updated Supabase`);
        successCount++;
        results.push({
          gymId: gym.id,
          gymName: gym.name,
          oldImageUrl: gym.hero_image || '',
          newImageUrl: cloudinaryUrl,
          success: true,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.log(`   ❌ Error: ${errorMessage}`);
      errorCount++;
      results.push({
        gymId: gym.id,
        gymName: gym.name,
        oldImageUrl: gym.hero_image || '',
        newImageUrl: '',
        success: false,
        error: errorMessage,
      });
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Successfully migrated: ${successCount} gyms`);
  console.log(`⏭️  Skipped: ${skipCount} gyms`);
  console.log(`❌ Errors: ${errorCount} gyms`);
  console.log(`📁 Total processed: ${gymsNeedingMigration.length} gyms`);
  console.log('='.repeat(60));

  // Write results to file
  const resultsPath = '/tmp/migration-results.json';
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to: ${resultsPath}`);
}

// Run migration
migrateImages().catch(console.error);
