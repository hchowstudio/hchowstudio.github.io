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
