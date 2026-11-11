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
      filter: (page) => {
        try {
          const path = new URL(page, 'https://www.indoorclimbinggym.com').pathname;
          if (path.endsWith('/1/')) return false;
          const noindexed = loadCityCategoryNoindex();
          if (noindexed.hubs.has(path)) return false;
          if (noindexed.prefixes.some((prefix) => path.startsWith(prefix))) return false;
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

    // Note: /guides → /blog migration handled by actual page files:
    // - src/pages/guides/index.astro redirects /guides/ to /blog/
    // - src/pages/guides/[...slug].astro redirects /guides/* to /blog/*

    // Note: Listing pagination/canonicalization handled by:
    // - src/pages/[state]/[city]/index.astro (page 1)
    // - src/pages/[state]/[city]/[page].astro (page 2+)
    // - src/pages/categories/[category]/index.astro (page 1)
    // - src/pages/categories/[category]/[page].astro (page 2+)
  }
});
