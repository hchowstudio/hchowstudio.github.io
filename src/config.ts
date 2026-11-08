// Studio-wide settings. Edit these first.
export const SITE = {
  name: 'HChow Studio',
  // The GitHub Pages URL (or custom domain) this site is deployed to.
  url: 'https://hchowstudio.github.io',
  // Homepage <title> (aim for 50–60 characters) and default meta description (150–160).
  homeTitle: 'HChow Studio — iOS Coloring, Puzzle & Utility Apps',
  description:
    'HChow Studio makes iOS apps for iPhone, iPad and Apple Watch: relaxing coloring books, cozy jigsaw puzzles, the ScanDoc PDF scanner and the Roundly HIIT timer.',
  // Default share image (1200×630) and square logo for structured data.
  ogImage: '/og.png',
  logo: '/logo.png',
  githubUrl: 'https://github.com/hchowstudio',
  // Shown on Contact and in every privacy policy.
  supportEmail: 'hchow.dev@gmail.com',
  developerName: 'Hieu Chau',
  appStoreDeveloperUrl: 'https://apps.apple.com/us/developer/hieu-chau/id1256877261',
  privacyLastUpdated: '2026-11-08',
};

export const CATEGORIES = ['Coloring', 'Puzzles', 'Learning', 'Creativity', 'Wallpapers', 'Utilities', 'Apple Watch'] as const;

export const appStoreUrl = (id: string) => `https://apps.apple.com/us/app/id${id}`;
