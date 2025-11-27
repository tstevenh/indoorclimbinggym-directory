// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.indoorclimbinggym.com',
  output: 'static', // SSG mode - only search page uses SSR with prerender: false
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
    }
  },
  integrations: [react(), sitemap()],
  build: {
    inlineStylesheets: 'auto', // Inline small CSS for better performance
  }
});