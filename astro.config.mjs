// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';

// https://astro.build/config
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
    sitemap(),
    mdx(),
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
    // Note: /guides → /blog migration handled by actual page files:
    // - src/pages/guides/index.astro redirects /guides/ to /blog/
    // - src/pages/guides/[...slug].astro redirects /guides/* to /blog/*

    // Note: Pagination redirects handled by index.astro routes:
    // - src/pages/categories/[category]/index.astro redirects to /1/
    // - src/pages/[state]/[city]/index.astro redirects to /1/
  }
});