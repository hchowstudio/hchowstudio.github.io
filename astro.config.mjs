// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config.ts';

// Apps that aren't live yet stay out of the sitemap.
const appsDir = new URL('./src/content/apps/', import.meta.url);
const unreleased = readdirSync(appsDir)
  .filter((f) => f.endsWith('.md'))
  .filter((f) => /^status:\s*(draft|upcoming)\s*$/m.test(readFileSync(new URL(f, appsDir), 'utf8')))
  .map((f) => f.replace(/\.md$/, ''));

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !unreleased.some((slug) => new URL(page).pathname.startsWith(`/apps/${slug}/`)),
    }),
  ],
});
