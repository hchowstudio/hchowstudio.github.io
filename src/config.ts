// Studio-wide settings. Edit these first.
export const SITE = {
  name: 'HChow Studio',
  // The GitHub Pages URL (or custom domain) this site is deployed to.
  url: 'https://hchowstudio.github.io',
  description:
    'Independent iOS studio making coloring books, cozy puzzles, a document scanner and an Apple Watch workout timer.',
  // Shown on Contact and in every privacy policy.
  supportEmail: 'hchow.dev@gmail.com',
  developerName: 'Hieu Chau',
  appStoreDeveloperUrl: 'https://apps.apple.com/us/developer/hieu-chau/id1256877261',
  privacyLastUpdated: '2026-11-08',
};

export const CATEGORIES = ['Coloring', 'Puzzles', 'Creativity', 'Utilities', 'Apple Watch'] as const;

export const appStoreUrl = (id: string) => `https://apps.apple.com/us/app/id${id}`;
