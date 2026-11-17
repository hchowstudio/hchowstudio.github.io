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

// Renamed apps: `aliases: [old-slug]` in an app's .md keeps its old URLs working.
const redirects = {};
for (const f of readdirSync(appsDir).filter((f) => f.endsWith('.md'))) {
  const slug = f.replace(/\.md$/, '');
  const list = readFileSync(new URL(f, appsDir), 'utf8').match(/^aliases:\s*\[([^\]]*)\]/m)?.[1] ?? '';
  for (const old of list.split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)) {
    redirects[`/apps/${old}`] = `/apps/${slug}/`;
    redirects[`/apps/${old}/privacy`] = `/apps/${slug}/privacy/`;
  }
}

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',
  redirects,
  integrations: [
    sitemap({
      filter: (page) => !unreleased.some((slug) => new URL(page).pathname.startsWith(`/apps/${slug}/`)),
    }),
  ],
});
