import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORIES } from './config';

const apps = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/apps' }),
  schema: z.object({
    name: z.string(),
    shortName: z.string(),
    tagline: z.string(),
    summary: z.string(),
    appStoreId: z.string(),
    bundleId: z.string().optional(),
    category: z.enum(CATEGORIES),
    storeGenre: z.string().optional(),
    accent: z.string().default('#2F54EB'),
    icon: z.string(),
    screenshots: z.array(z.string()).default([]),
    platforms: z.array(z.string()).default(['iPhone']),
    price: z.string().default('Free'),
    ageRating: z.string().optional(),
    releaseDate: z.coerce.date(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    // Set true when src/pages/apps/<slug>/index.astro provides a hand-made landing page.
    customLanding: z.boolean().default(false),
    // Privacy: keys from src/lib/privacy.ts
    sdks: z.array(z.string()).default([]),
    permissions: z.array(z.string()).default([]),
    kids: z.boolean().default(false),
    privacyNotes: z.string().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

export const collections = { apps };
