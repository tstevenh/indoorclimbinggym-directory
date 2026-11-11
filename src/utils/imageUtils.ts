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
 * Cloudinary helpers
 * Inserts an on-the-fly transformation (f_auto,q_auto,w_<n>,c_limit) after /upload/.
 * c_limit never upscales; f_auto serves WebP/AVIF; q_auto picks quality.
 * URLs that already carry a transformation segment (anything other than v<digits>) are left unchanged.
 */
export function isCloudinaryUrl(url: string): boolean {
  return /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url);
}

export function optimizeCloudinaryUrl(url: string, width: number): string {
  if (!isCloudinaryUrl(url)) return url;
  const marker = '/image/upload/';
  const idx = url.indexOf(marker) + marker.length;
  const rest = url.slice(idx);
  if (!/^v\d+\//.test(rest)) return url; // already transformed / unknown shape
  return `${url.slice(0, idx)}f_auto,q_auto,w_${Math.round(width)},c_limit/${rest}`;
}

/**
 * Host-aware URL optimizer: Unsplash and Cloudinary get resized, anything else passes through unchanged.
 */
export function optimizeImageUrl(
  url: string | null | undefined,
  width: number,
  height: number,
  quality = 75
): string {
  const validUrl = getImageUrl(url);
  if (validUrl === PLACEHOLDER_IMAGE) return validUrl;
  if (validUrl.includes('unsplash.com')) return optimizeUnsplashUrl(validUrl, width, height, quality);
  if (isCloudinaryUrl(validUrl)) return optimizeCloudinaryUrl(validUrl, width);
  return validUrl;
}

/** True when we can generate resized variants for this host (srcset is meaningful). */
export function supportsResponsiveSrcset(url: string): boolean {
  return url.includes('unsplash.com') || isCloudinaryUrl(url);
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
      const optimizedUrl = optimizeImageUrl(validUrl, size, height, quality);
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
    sizes: [360, 480, 640, 800, 1200], // For srcset
    quality: 75,
  },

  // Hero images (gym detail pages)
  HERO: {
    width: 1600,
    height: 900,
    sizes: [640, 960, 1280, 1600], // For srcset
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
