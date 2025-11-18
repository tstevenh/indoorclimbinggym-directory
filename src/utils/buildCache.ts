/**
 * Build-Time Cache for Supabase Data
 *
 * Reduces API calls from ~110 per build to 1 per build
 * Saves ~1.3GB Supabase egress per deployment
 *
 * How it works:
 * - Module-level variables persist across imports during same build
 * - First fetchGyms() call populates cache
 * - Subsequent calls return cached data (zero egress)
 * - Cache lives only during ONE build (~60 seconds), then destroyed
 * - Each new build starts fresh with new data from Supabase
 *
 * Usage:
 * ```typescript
 * import { getCachedGyms, setCachedGyms } from './buildCache';
 *
 * const cached = getCachedGyms();
 * if (cached) return cached;
 *
 * const data = await fetchFromSupabase();
 * setCachedGyms(data);
 * ```
 */

// Module-level cache (persists during single build process)
let cachedGyms: any[] | null = null;
let cacheTimestamp: number = 0;

// Cache TTL for dev server (prevents constant refetching during HMR)
const CACHE_TTL_DEV = 1000 * 60 * 60; // 1 hour in development
const CACHE_TTL_PROD = 1000 * 60 * 5; // 5 minutes for SSR runtime

/**
 * Get cached gyms data if available
 * @returns Cached gyms array or null if cache is empty/expired
 */
export function getCachedGyms(): any[] | null {
  // Check if running in development mode
  const isDev = import.meta.env.DEV;

  if (isDev) {
    // Dev mode: cache with TTL to avoid constant refetching during HMR
    const now = Date.now();
    const ttl = CACHE_TTL_DEV;

    if (cachedGyms && (now - cacheTimestamp) < ttl) {
      console.log(`[BuildCache] ✅ Using cached gyms (${cachedGyms.length} gyms) - dev mode`);
      return cachedGyms;
    }

    if (cachedGyms && (now - cacheTimestamp) >= ttl) {
      console.log('[BuildCache] ⏰ Cache expired - will fetch fresh data');
      return null;
    }
  } else {
    // Production build: cache persists for entire build process
    if (cachedGyms) {
      console.log(`[BuildCache] ✅ Using cached gyms (${cachedGyms.length} gyms) - build mode`);
      return cachedGyms;
    }
  }

  return null;
}

/**
 * Store gyms data in cache
 * @param gyms Array of gym objects to cache
 */
export function setCachedGyms(gyms: any[]): void {
  cachedGyms = gyms;
  cacheTimestamp = Date.now();

  const isDev = import.meta.env.DEV;
  const mode = isDev ? 'dev' : 'build';

  console.log(`[BuildCache] 💾 Cached ${gyms.length} gyms (${mode} mode)`);

  // Log approximate data size
  const sizeInMB = (JSON.stringify(gyms).length / 1024 / 1024).toFixed(2);
  console.log(`[BuildCache] 📦 Cache size: ~${sizeInMB}MB`);
}

/**
 * Clear the cache (useful for testing)
 */
export function clearCache(): void {
  const hadCache = cachedGyms !== null;
  cachedGyms = null;
  cacheTimestamp = 0;

  if (hadCache) {
    console.log('[BuildCache] 🗑️  Cache cleared');
  }
}

/**
 * Get cache statistics (for debugging)
 */
export function getCacheStats() {
  return {
    hasCache: cachedGyms !== null,
    gymsCount: cachedGyms?.length || 0,
    cacheAge: cacheTimestamp > 0 ? Date.now() - cacheTimestamp : 0,
    cacheTimestamp,
    isDev: import.meta.env.DEV,
  };
}
