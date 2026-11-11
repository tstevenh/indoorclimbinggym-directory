// Usage: node scripts/generate-city-category-keep.mjs <gsc_90d_pages.json> [minClicks=3]
// Writes src/data/cityCategoryKeep.json: city x category paths with >= minClicks clicks.
import fs from 'node:fs';
const [, , input, min = '3'] = process.argv;
const rows = JSON.parse(fs.readFileSync(input, 'utf8'));
const re = /^https?:\/\/[^/]+(\/[^/]+\/[^/]+\/categories\/[^/]+\/)$/;
const paths = rows
  .filter((r) => r.clicks >= Number(min))
  .map((r) => (r.keys[0].match(re) || [])[1])
  .filter(Boolean);
const out = [...new Set(paths)].sort();
fs.writeFileSync(new URL('../src/data/cityCategoryKeep.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log(out.length, 'keep-list paths');
