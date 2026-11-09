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
  supabase: {
    name: 'Supabase',
    use: 'Runs online private rooms. The room code, the nickname you choose and your game moves are sent to the game server only to sync the match with the other players.',
    href: 'https://supabase.com/privacy',
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
  microphone: { name: 'Microphone', use: 'Used only while you record your voice to practice. Recordings stay on your device.' },
  speech: { name: 'Speech recognition', use: 'Turns your recorded voice into text so the app can compare it with the target phrase. Processed by Apple’s speech recognition service.' },
  'local-network': { name: 'Local Network', use: 'Used to find compatible TVs on your Wi-Fi network and to send them your remote commands and the content you choose to cast.' },
  'photos-cast': { name: 'Photo library', use: 'Used to cast the photos and videos you choose to your TV.' },
  'microphone-voice': { name: 'Microphone', use: 'Used only while you use voice search or voice commands for your TV.' },
  notifications: { name: 'Notifications', use: 'Optional reminders. You can turn them off in Settings.' },
};

export const resolveSdks = (keys: string[]) => keys.map((k) => SDKS[k]).filter(Boolean);
export const resolvePermissions = (keys: string[]) => keys.map((k) => PERMISSIONS[k]).filter(Boolean);
