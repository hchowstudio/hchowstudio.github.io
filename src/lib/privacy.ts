// Reusable building blocks for per-app privacy policies.
// Add a key here, then list it in an app's `sdks:` or `permissions:` frontmatter.

export type Sdk = { name: string; use: string; href: string; ads?: boolean };

export const SDKS: Record<string, Sdk> = {
  admob: {
    name: 'Google AdMob',
    use: 'Shows ads. It may collect device identifiers, IP address and ad interaction data, and uses the advertising identifier only if you allow tracking.',
    href: 'https://policies.google.com/technologies/partner-sites',
    ads: true,
  },
  'meta-audience': {
    name: 'Meta Audience Network',
    use: 'Shows ads through ad mediation.',
    href: 'https://www.facebook.com/privacy/policy/',
    ads: true,
  },
  firebase: {
    name: 'Google Firebase (Analytics & Crashlytics)',
    use: 'Collects anonymous usage statistics and crash reports so we can fix bugs.',
    href: 'https://firebase.google.com/support/privacy',
  },
  revenuecat: {
    name: 'RevenueCat',
    use: 'Processes in-app purchase and subscription status. Payments themselves are handled by Apple.',
    href: 'https://www.revenuecat.com/privacy',
  },
};

export const PERMISSIONS: Record<string, { name: string; use: string }> = {
  camera: { name: 'Camera', use: 'Used only while you scan or use the camera feature. Images are processed on your device.' },
  photos: { name: 'Photo library', use: 'Used to import images you choose. The app cannot see photos you do not pick.' },
  'photos-add': { name: 'Save to Photos', use: 'Add-only access, used when you save your artwork or wallpaper. The app cannot read your library.' },
  health: { name: 'Apple Health', use: 'With your permission, completed workouts are written to Apple Health. Health data is never used for ads or shared with third parties.' },
  notifications: { name: 'Notifications', use: 'Optional reminders. You can turn them off in Settings.' },
};

export const resolveSdks = (keys: string[]) => keys.map((k) => SDKS[k]).filter(Boolean);
export const resolvePermissions = (keys: string[]) => keys.map((k) => PERMISSIONS[k]).filter(Boolean);
