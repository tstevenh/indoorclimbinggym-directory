/**
 * Image Optimization Utilities
 * Functions for optimizing external Unsplash images and handling responsive images
 */

/**
 * Default placeholder image for gyms without photos
 */
export const PLACEHOLDER_IMAGE = '/placeholder-gym.webp';

/**
 * Returns placeholder image if URL is missing/invalid
 * @param url - Original image URL (can be null/undefined)
 * @returns Valid image URL or placeholder
 */
export function getImageUrl(url: string | null | undefined): string {
  if (!url || url.trim() === '') {
    return PLACEHOLDER_IMAGE;
  }
  return url;
}

/**
 * Optimizes Unsplash URLs with format and size parameters
 * Falls back to placeholder if URL is invalid
 * @param url - Original Unsplash image URL
 * @param width - Desired width in pixels
 * @param height - Desired height in pixels
 * @param quality - Image quality (1-100, default 75)
 * @returns Optimized URL with query parameters or placeholder
 */
export function optimizeUnsplashUrl(
  url: string | null | undefined,
  width: number,
  height: number,
  quality = 75
): string {
  // Handle missing/invalid URLs
  const validUrl = getImageUrl(url);
  if (validUrl === PLACEHOLDER_IMAGE) {
    return PLACEHOLDER_IMAGE;
  }

  // Only optimize Unsplash URLs
  if (!validUrl.includes('unsplash.com')) {
    return validUrl;
  }

  try {
    const urlObj = new URL(validUrl);

    // Set width and height for proper sizing
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('h', height.toString());

    // Use crop fit to ensure consistent dimensions
    urlObj.searchParams.set('fit', 'crop');

    // Auto format will serve WebP to supporting browsers
    urlObj.searchParams.set('auto', 'format');

    // Set quality for compression
    urlObj.searchParams.set('q', quality.toString());

    return urlObj.toString();
  } catch (error) {
    console.error('Error optimizing Unsplash URL:', error);
    return PLACEHOLDER_IMAGE; // Fallback to placeholder on error
  }
}

/**
 * Generates srcset for responsive images
 * Falls back to placeholder if URL is invalid
 * @param baseUrl - Base Unsplash URL (can be null/undefined)
 * @param sizes - Array of widths to generate (e.g., [400, 800, 1200])
 * @param aspectRatio - Height/width ratio (default 0.75 for 4:3)
 * @param quality - Image quality (default 75)
 * @returns Srcset string for use in img tags
 */
export function generateSrcset(
  baseUrl: string | null | undefined,
  sizes: number[],
  aspectRatio = 0.75,
  quality = 75
): string {
  // Handle missing/invalid URLs - return placeholder without srcset
  const validUrl = getImageUrl(baseUrl);
  if (validUrl === PLACEHOLDER_IMAGE) {
    return PLACEHOLDER_IMAGE;
  }

  return sizes
    .map((size) => {
      const height = Math.round(size * aspectRatio);
      const optimizedUrl = optimizeUnsplashUrl(validUrl, size, height, quality);
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
}

/**
 * Common image size presets
 */
export const IMAGE_SIZES = {
  // Card thumbnails (gym listing cards)
  CARD_THUMBNAIL: {
    width: 800,
    height: 600,
    sizes: [400, 800, 1200], // For srcset
    quality: 75,
  },

  // Hero images (gym detail pages)
  HERO: {
    width: 1600,
    height: 900,
    sizes: [800, 1200, 1600, 2400], // For srcset
    quality: 80,
  },

  // Related gym thumbnails (sidebar)
  SIDEBAR_THUMBNAIL: {
    width: 160,
    height: 160,
    sizes: [80, 160, 240], // For srcset
    quality: 75,
  },
};
