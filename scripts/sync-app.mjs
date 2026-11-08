#!/usr/bin/env node
// Pull an app's live App Store data into the site.
//   npm run sync-app -- <slug> [<slug>…]   sync specific apps
//   npm run sync-app -- --all              sync every app that has an appStoreId
//   add --text to also refresh the description/summary of apps that are already live
//
// When an app is found on the App Store it downloads the icon and screenshots,
// fills in price/age rating/release date, and switches status to "live".
// The description and summary are filled the first time an app goes live
// (or with --text), so later hand edits are kept.
import { existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import {
  APPS_DIR, IMAGES_DIR, readApp, writeApp, getField, setField, q, yamlList,
  descriptionToMarkdown, summaryFrom, lookup, download, resized, isSlug,
} from './lib.mjs';

const args = process.argv.slice(2);
const all = args.includes('--all');
const refreshText = args.includes('--text');
const slugs = all
  ? readdirSync(APPS_DIR).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3))
  : args.filter((a) => !a.startsWith('--'));

if (!slugs.length || slugs.some((s) => !isSlug(s))) {
  console.error('Usage: npm run sync-app -- <slug> [<slug>…] | --all  [--text]');
  process.exit(1);
}

const apps = slugs.map((slug) => ({ slug, ...readApp(slug) }));
const withId = apps.filter((a) => getField(a.fm, 'appStoreId'));
for (const a of apps.filter((a) => !getField(a.fm, 'appStoreId'))) {
  if (!all) console.log(`• ${a.slug}: no appStoreId yet — add it to src/content/apps/${a.slug}.md (App Store Connect › App Information › Apple ID).`);
}
if (!withId.length) process.exit(all ? 0 : 1);

const found = await lookup(withId.map((a) => getField(a.fm, 'appStoreId')));
let changed = 0;

for (const app of withId) {
  const id = getField(app.fm, 'appStoreId');
  const status = getField(app.fm, 'status') ?? 'live';
  const r = found.get(id);
  if (!r) {
    console.log(`• ${app.slug}: not on the App Store yet (status stays "${status}").`);
    continue;
  }

  const goingLive = status !== 'live';
  const dir = join(IMAGES_DIR, app.slug);
  mkdirSync(dir, { recursive: true });

  // Icon: 512px PNG for share cards / structured data, 256px WebP for display.
  await download(resized(r.artworkUrl512, '512x512bb.png'), join(dir, 'icon.png'));
  await download(resized(r.artworkUrl512, '256x256bb.webp'), join(dir, 'icon-256.webp'));
  // Screenshots as WebP (iPhone first, iPad if the app has no iPhone screenshots).
  const shotUrls = (r.screenshotUrls?.length ? r.screenshotUrls : r.ipadScreenshotUrls ?? []).slice(0, 6);
  const shots = [];
  for (const [i, u] of shotUrls.entries()) {
    const name = `shot-${i + 1}.webp`;
    await download(resized(u, '600x0w.webp'), join(dir, name));
    shots.push(`/images/apps/${app.slug}/${name}`);
  }
  for (const f of readdirSync(dir)) {
    const m = f.match(/^shot-(\d+)\.(jpg|webp)$/);
    if (m && (m[2] === 'jpg' || Number(m[1]) > shots.length)) rmSync(join(dir, f));
  }
  if (existsSync(join(dir, '.gitkeep'))) rmSync(join(dir, '.gitkeep'));

  let fm = app.fm;
  fm = setField(fm, 'status', 'live');
  fm = setField(fm, 'icon', `/images/apps/${app.slug}/icon.png`);
  fm = setField(fm, 'screenshots', yamlList(shots));
  fm = setField(fm, 'price', q(r.formattedPrice ?? 'Free'));
  if (r.contentAdvisoryRating) fm = setField(fm, 'ageRating', q(r.contentAdvisoryRating));
  if (r.releaseDate) fm = setField(fm, 'releaseDate', r.releaseDate.slice(0, 10));
  if (r.primaryGenreName) fm = setField(fm, 'storeGenre', q(r.primaryGenreName));
  if (r.bundleId) fm = setField(fm, 'bundleId', q(r.bundleId));

  let body = app.body;
  const summary = getField(fm, 'summary') ?? '';
  if (goingLive || refreshText || !body.trim()) body = descriptionToMarkdown(r.description ?? '');
  if (goingLive || refreshText || !summary || summary.startsWith('TODO')) fm = setField(fm, 'summary', q(summaryFrom(r.description ?? '')));
  if (goingLive && (getField(fm, 'name') ?? '').startsWith('TODO')) fm = setField(fm, 'name', q(r.trackName));

  writeApp({ path: app.path, fm, body });
  changed++;
  console.log(`✓ ${app.slug}: ${goingLive ? `now LIVE (was "${status}")` : 'refreshed'} — icon + ${shots.length} screenshots, v${r.version}`);
  if ((getField(fm, 'tagline') ?? '').startsWith('TODO')) {
    console.log(`  ! tagline is still TODO — Apple's API doesn't include the subtitle; copy it from App Store Connect.`);
  }
}

if (changed) {
  console.log(`\nReview the changes, then:\n  git add -A && git commit -m "Sync App Store data" && git push`);
}
