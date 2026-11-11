// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';
import fs from 'node:fs';
import remarkAutolinkClimbroMentions from './src/utils/remarkAutolinkClimbroMentions.mjs';

// https://astro.build/config
// Noindexed city x category pages / hubs are recorded at build time by the pages (src/utils/cityCategoryManifest.ts).
let cityCategoryNoindexCache;
function loadCityCategoryNoindex() {
  if (cityCategoryNoindexCache) return cityCategoryNoindexCache;
  try {
    const m = JSON.parse(fs.readFileSync(new URL('./node_modules/.cache/city-category-noindex.json', import.meta.url), 'utf8'));
    cityCategoryNoindexCache = { prefixes: m.categoryPrefixes, hubs: new Set(m.hubPaths) };
  } catch {
    cityCategoryNoindexCache = { prefixes: [], hubs: new Set() };
  }
  return cityCategoryNoindexCache;
}

// Real lastmod values (gyms.updated_at aggregates), written by src/utils/buildCache.ts at build time.
let lastmodCache;
function loadLastmod() {
  if (lastmodCache) return lastmodCache;
  try {
    lastmodCache = JSON.parse(fs.readFileSync(new URL('./node_modules/.cache/sitemap-lastmod.json', import.meta.url), 'utf8'));
  } catch {
    lastmodCache = { gymsBySlug: {}, states: {}, cities: {}, all: '' };
  }
  return lastmodCache;
}

// Blog frontmatter dates: updatedDate ?? publishedDate (no fabricated dates).
let blogCache;
function loadBlogDates() {
  if (blogCache) return blogCache;
  const dir = new URL('./src/content/blog/', import.meta.url);
  const posts = {};
  const byCategory = {};
  let latest = '';
  for (const f of fs.readdirSync(dir)) {
    if (!/\.mdx?$/.test(f)) continue;
    const head = fs.readFileSync(new URL(f, dir), 'utf8').split(/^---\s*$/m)[1] || '';
    const get = (k) => (head.match(new RegExp('^' + k + ':\\s*["\']?([^"\'\\n]+?)["\']?\\s*$', 'm')) || [])[1];
    const raw = get('updatedDate') || get('publishedDate');
    const norm = raw && raw.replace(/^(\d{4})-(\d{1,2})-(\d{1,2})/, (_, y, m, d) => `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
    const d = norm ? new Date(norm) : null;
    if (!d || isNaN(d.getTime())) continue;
    const iso = d.toISOString();
    posts[f.replace(/\.mdx?$/, '')] = iso;
    const cat = get('category');
    if (cat && (!byCategory[cat] || iso > byCategory[cat])) byCategory[cat] = iso;
    if (iso > latest) latest = iso;
  }
  blogCache = { posts, byCategory, latest };
  return blogCache;
}

function lastmodFor(path) {
  const lm = loadLastmod();
  const blog = loadBlogDates();
  let m;
  if ((m = path.match(/^\/gyms\/([^/]+)\/$/))) return lm.gymsBySlug[m[1]];
  if (path === '/blog/') return blog.latest;
  if ((m = path.match(/^\/blog\/([^/]+)\/$/))) return blog.posts[m[1]] || blog.byCategory[m[1]];
  if (path === '/' || path === '/states/' || path.startsWith('/categories/')) return lm.all;
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 1) return lm.states['/' + parts[0] + '/'];
  if (parts.length >= 2) return lm.cities['/' + parts[0] + '/' + parts[1] + '/'];
  return undefined;
}

export default defineConfig({
  site: 'https://www.indoorclimbinggym.com',
  trailingSlash: 'always', // Enforce trailing slashes for canonical URL consistency
  output: 'static', // SSG mode - only search page uses SSR with prerender: false
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
    }
  },
  integrations: [
    react(),
    sitemap({
      // Only include canonical URLs.
      // We canonicalize listing page 1 to the base URL, and redirect /1/ → base.
      serialize(item) {
        try {
          const path = new URL(item.url).pathname;
          const lm = lastmodFor(path);
          if (lm) item.lastmod = lm;
        } catch {}
        return item;
      },
      filter: (page) => {
        try {
          const path = new URL(page, 'https://www.indoorclimbinggym.com').pathname;
          if (path.endsWith('/1/')) return false;
          const noindexed = loadCityCategoryNoindex();
          if (noindexed.hubs.has(path)) return false;
          if (noindexed.prefixes.some((prefix) => path.startsWith(prefix))) return false;
          // Pages that render noindex: blog pagination (/blog/2/...), category pagination (/categories/x/2/...)
          if (/^\/blog\/\d+\/$/.test(path)) return false;
          if (/^\/categories\/[^/]+\/\d+\/$/.test(path)) return false;
          // SSR pages (not prerendered, so no static HTML to index)
          if (path === '/search/' || path === '/fresh-routes-this-week/') return false;
          if (path === '/privacy/' || path === '/terms/' || path === '/404/') return false;
          return true;
        } catch {
          return true;
        }
      }
    }),
    mdx({
      remarkPlugins: [remarkAutolinkClimbroMentions],
    }),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto', // Inline small CSS for better performance
  },
  // 301 Redirects
  redirects: {
    // Deduplicated article redirects
    '/blog/climbing-shoe-fit-guide/': '/blog/climbing-shoes-fit/',
    '/blog/how-to-get-into-rock-climbing/': '/blog/how-to-start-rock-climbing/',

    // Consolidate removed Climbro drafts to active BOFU page
    '/blog/climbro-review-editorial-analysis/': '/blog/climbro-rent-vs-buy-which-is-better/',
    '/blog/climbro-alternatives-smart-vs-traditional-hangboard/': '/blog/climbro-rent-vs-buy-which-is-better/',

    // Note: /guides/* → /blog/* and legacy /<state-code>/* → /<state-slug>/* are real 301s in vercel.json.

    // Note: Listing pagination/canonicalization handled by:
    // - src/pages/[state]/[city]/index.astro (page 1)
    // - src/pages/[state]/[city]/[page].astro (page 2+)
    // - src/pages/categories/[category]/index.astro (page 1)
    // - src/pages/categories/[category]/[page].astro (page 2+)
  }
});
