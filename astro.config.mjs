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
  // 301 Redirects for /guides → /blog migration (2025-11-28)
  redirects: {
    '/guides': '/blog',
    '/guides/[...slug]': '/blog/[...slug]',
  }
});