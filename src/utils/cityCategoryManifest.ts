import fs from 'node:fs';
import path from 'node:path';
import type { CityIndexInfo } from './cityCategory';

export const NOINDEX_MANIFEST = path.join(process.cwd(), 'node_modules', '.cache', 'city-category-noindex.json');

/** Build-time side channel: records noindexed city x category prefixes + hubs; the sitemap filter reads it. */
export function writeNoindexManifest(infos: CityIndexInfo[]) {
  const categoryPrefixes: string[] = [];
  const hubPaths: string[] = [];
  for (const info of infos) {
    for (const e of info.entries) if (!e.indexable) categoryPrefixes.push(e.path);
    if (!info.hubIndexable) hubPaths.push(`/${info.stateSlug}/${info.citySlug}/categories/`);
  }
  fs.mkdirSync(path.dirname(NOINDEX_MANIFEST), { recursive: true });
  fs.writeFileSync(NOINDEX_MANIFEST, JSON.stringify({ categoryPrefixes, hubPaths }));
}
