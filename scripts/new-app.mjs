#!/usr/bin/env node
// Scaffold a new app before release.
//   npm run new-app -- <slug> [--name "App Name"] [--id 1234567890] [--category Coloring]
// Creates src/content/apps/<slug>.md (status: draft) and public/images/apps/<slug>/,
// then prints the URLs to paste into App Store Connect.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, APPS_DIR, IMAGES_DIR, appPath, isSlug, printUrls, q, getField, readApp } from './lib.mjs';

// Categories come from src/config.ts so there's one list to edit.
const CATEGORIES = [...readFileSync(join(ROOT, 'src/config.ts'), 'utf8').match(/CATEGORIES = \[([^\]]+)\]/)[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const slug = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));

if (!isSlug(slug)) {
  console.error('Usage: npm run new-app -- <slug> [--name "App Name"] [--id 1234567890] [--category Coloring]');
  console.error('  slug: lowercase letters, numbers and dashes, e.g. "cozy-garden"');
  process.exit(1);
}
if (existsSync(appPath(slug))) {
  console.error(`src/content/apps/${slug}.md already exists.`);
  process.exit(1);
}

const name = flag('name') ?? slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
const id = flag('id');
const category = flag('category') ?? 'Coloring';
if (!CATEGORIES.includes(category)) {
  console.error(`--category must be one of: ${CATEGORIES.join(', ')}`);
  process.exit(1);
}
if (id && !/^\d+$/.test(id)) {
  console.error('--id must be the numeric Apple ID from App Store Connect (App Information › Apple ID).');
  process.exit(1);
}

const nextOrder =
  Math.max(0, ...readdirSync(APPS_DIR).filter((f) => f.endsWith('.md')).map((f) => Number(getField(readApp(f.slice(0, -3)).fm, 'order')) || 0)) + 1;

const md = `---
# draft    → pages exist for App Review but are hidden (not listed, noindex, not in sitemap)
# upcoming → shown on the homepage as "Coming soon"
# live     → fully listed. \`npm run sync-app -- ${slug}\` sets this once the app is on the App Store.
status: draft
name: ${q(name)}
shortName: ${q(name)}
tagline: "TODO: App Store subtitle"
summary: "TODO: one or two sentences shown in the hero."
${id ? `appStoreId: "${id}"` : '# appStoreId: "1234567890"   # Apple ID from App Store Connect › App Information'}
category: ${q(category)}          # ${CATEGORIES.join(' | ')}
accent: "#2F54EB"
# icon and screenshots are filled in by sync-app once live; or add your own:
# icon: /images/apps/${slug}/icon.png
screenshots: []
platforms: [iPhone, iPad]
price: "Free"
order: ${nextOrder}
featured: false

# Privacy — keys from src/lib/privacy.ts. Check these match what the app ships!
sdks: [admob]            # admob | meta-audience | firebase | supabase | revenuecat — [] for none
permissions: []          # camera | photos | photos-add | health | notifications
kids: false              # true adds child-directed (COPPA) wording
# privacyNotes: "Anything specific about this app's data."

faq: []
---
`;

writeFileSync(appPath(slug), md);
mkdirSync(join(IMAGES_DIR, slug), { recursive: true });
writeFileSync(join(IMAGES_DIR, slug, '.gitkeep'), '');

console.log(`✓ Created src/content/apps/${slug}.md (status: draft)`);
console.log(`✓ Created public/images/apps/${slug}/`);
console.log(`
Next:
  1. Fill in the TODOs and the privacy settings (sdks, permissions, kids).
  2. git add -A && git commit -m "Add ${name} (draft)" && git push
  3. Paste these into App Store Connect:`);
printUrls(slug);
console.log(`  After Apple approves it:  npm run sync-app -- ${slug}${id ? '' : '  (add appStoreId first)'}`);
