// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.indoorclimbinggym.com',
  output: 'server', // SSR mode - pages opt-in to static with prerender: true
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: true,
      minify: 'esbuild',
    }
  },
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto', // Inline small CSS for better performance
  }
});