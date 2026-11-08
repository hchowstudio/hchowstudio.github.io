import { existsSync } from 'node:fs';
import { getCollection, type CollectionEntry } from 'astro:content';

export type App = CollectionEntry<'apps'>;

const byOrder = (a: App, b: App) => a.data.order - b.data.order;

/** Every app, any status. Use for routes that must exist before launch (privacy, support). */
export const allApps = async () => (await getCollection('apps')).sort(byOrder);

/** Apps shown publicly in lists. */
export const liveApps = async () => (await allApps()).filter((a) => a.data.status === 'live');
export const upcomingApps = async () => (await allApps()).filter((a) => a.data.status === 'upcoming');

export const isLive = (a: App) => a.data.status === 'live';
/** Draft pages are reachable by URL (App Review) but hidden from search engines. */
export const isHidden = (a: App) => a.data.status === 'draft';

export const initials = (name: string) =>
  name.replace(/[^A-Za-z0-9 ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

/** Prefer the small WebP icon that sync-app downloads next to icon.png. */
export function displayIcon(icon?: string) {
  if (!icon) return undefined;
  const webp = icon.replace(/icon\.png$/, 'icon-256.webp');
  return webp !== icon && existsSync(`public${webp}`) ? webp : icon;
}

const GENRE_TO_CATEGORY: Record<string, string> = {
  Games: 'GameApplication',
  Business: 'BusinessApplication',
  Productivity: 'BusinessApplication',
  'Health & Fitness': 'HealthApplication',
  'Graphics & Design': 'DesignApplication',
  Entertainment: 'EntertainmentApplication',
  Education: 'EducationalApplication',
  Utilities: 'UtilitiesApplication',
};

/** schema.org MobileApplication for a live app (JSON-LD). */
export function appSchema(app: App, site: URL) {
  const d = app.data;
  const os = d.platforms.includes('Apple Watch') ? 'iOS, watchOS' : 'iOS';
  return {
    '@type': 'MobileApplication',
    name: d.name,
    url: new URL(`/apps/${app.id}/`, site).href,
    ...(d.icon && { image: new URL(d.icon, site).href }),
    description: d.summary || d.tagline,
    operatingSystem: os,
    applicationCategory: GENRE_TO_CATEGORY[d.storeGenre ?? ''] ?? 'MobileApplication',
    ...(d.appStoreId && { installUrl: `https://apps.apple.com/app/id${d.appStoreId}` }),
    offers: { '@type': 'Offer', price: d.price === 'Free' ? '0' : d.price.replace(/[^0-9.]/g, ''), priceCurrency: 'USD' },
  };
}
