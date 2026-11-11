/**
 * Build-time intrinsic size lookup for images served from /public.
 * Server-only (uses sharp + fs at build). Falls back to the given default for remote/missing files.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const cache = new Map<string, { width: number; height: number }>();

export async function getPublicImageSize(
  src: string,
  fallback: { width: number; height: number } = { width: 1200, height: 675 }
): Promise<{ width: number; height: number }> {
  if (!src || !src.startsWith('/')) return fallback;
  const hit = cache.get(src);
  if (hit) return hit;
  try {
    const file = path.join(process.cwd(), 'public', decodeURIComponent(src.split('?')[0]));
    if (!fs.existsSync(file)) return fallback;
    const meta = await sharp(file).metadata();
    if (!meta.width || !meta.height) return fallback;
    const size = { width: meta.width, height: meta.height };
    cache.set(src, size);
    return size;
  } catch {
    return fallback;
  }
}
