/**
 * Image Optimization Utilities
 * Functions for optimizing external Unsplash images and handling responsive images
 */

/**
 * Optimizes Unsplash URLs with format and size parameters
 * @param url - Original Unsplash image URL
 * @param width - Desired width in pixels
 * @param height - Desired height in pixels
 * @param quality - Image quality (1-100, default 75)
 * @returns Optimized URL with query parameters
 */
export function optimizeUnsplashUrl(
  url: string,
  width: number,
  height: number,
  quality = 75
): string {
  if (!url.includes('unsplash.com')) {
    return url;
  }

  try {
    const urlObj = new URL(url);

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
    return url;
  }
}

/**
 * Generates srcset for responsive images
 * @param baseUrl - Base Unsplash URL
 * @param sizes - Array of widths to generate (e.g., [400, 800, 1200])
 * @param aspectRatio - Height/width ratio (default 0.75 for 4:3)
 * @param quality - Image quality (default 75)
 * @returns Srcset string for use in img tags
 */
export function generateSrcset(
  baseUrl: string,
  sizes: number[],
  aspectRatio = 0.75,
  quality = 75
): string {
  return sizes
    .map((size) => {
      const height = Math.round(size * aspectRatio);
      const optimizedUrl = optimizeUnsplashUrl(baseUrl, size, height, quality);
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
