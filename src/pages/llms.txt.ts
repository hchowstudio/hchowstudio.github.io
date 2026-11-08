// /llms.txt — a plain-text summary of the studio and its apps for AI assistants and search.
import type { APIRoute } from 'astro';
import { liveApps } from '../lib/apps';
import { SITE } from '../config';

export const GET: APIRoute = async ({ site }) => {
  const apps = await liveApps();
  const url = (p: string) => new URL(p, site).href;
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    `${SITE.name} is run by ${SITE.developerName}, an independent iOS developer. Support: ${SITE.supportEmail}.`,
    '',
    '## Apps',
    '',
    ...apps.map((a) => `- [${a.data.name}](${url(`/apps/${a.id}/`)}): ${a.data.tagline}. ${a.data.category}, ${a.data.price}, ${a.data.platforms.join(' & ')}.${a.data.appStoreId ? ` App Store: https://apps.apple.com/app/id${a.data.appStoreId}` : ''}`),
    '',
    '## Policies & support',
    '',
    `- [Privacy Policy](${url('/privacy/')})`,
    `- [Terms of Use](${url('/terms/')})`,
    `- [Support](${url('/contact/')})`,
    `- [App Store developer page](${SITE.appStoreDeveloperUrl})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
