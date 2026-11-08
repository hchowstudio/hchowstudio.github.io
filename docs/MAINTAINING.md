# Maintaining the HChow Studio site

Static Astro site: app landing pages, per-app privacy policies, support page, and `app-ads.txt` for AdMob.

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
npm run preview
```

## Where things live

| What | File |
|---|---|
| Studio name, support email, site URL | `src/config.ts` |
| AdMob / Meta seller records | `public/app-ads.txt` (served at `/app-ads.txt`) |
| One file per app | `src/content/apps/<slug>.md` |
| Release scripts | `scripts/new-app.mjs`, `scripts/sync-app.mjs` |
| App images | `public/images/apps/<slug>/` (`icon.png`, `shot-1.jpg`…) |
| Privacy text for each SDK / permission | `src/lib/privacy.ts` |
| Pages | `src/pages/` |

## Releasing a new app

Apple needs a working **Privacy Policy URL** and **Support URL** before you submit,
so an app's pages go up before launch but stay hidden until it's live.

Each app has a `status` in its `.md` file:

| status | Landing + privacy + support pages | Homepage | Search engines / sitemap |
|---|---|---|---|
| `draft` | yes, with a "Coming soon" badge | hidden | hidden (`noindex`) |
| `upcoming` | yes, with a "Coming soon" badge | "Coming soon" row | hidden |
| `live` | full page with App Store button | listed in All apps | included |

### 1. Before submitting to App Review

```bash
npm run new-app -- cozy-garden --name "Cozy Garden" --category Puzzles --id 1234567890
```

- It creates `src/content/apps/cozy-garden.md` with `status: draft`, plus `public/images/apps/cozy-garden/`.
- Fill in the TODOs (`tagline`, `summary`) and **check the privacy settings** (`sdks`, `permissions`, `kids`).
- Commit and push, then paste the printed Marketing, Support and Privacy URLs into App Store Connect.
- `--id` is the Apple ID shown in App Store Connect › App Information. You can add `appStoreId` later instead.
- Optional: set `status: upcoming` to tease it on the homepage.

### 2. When Apple approves it

```bash
npm run sync-app -- cozy-garden
```

This looks the app up on the App Store. If it's live, it downloads the icon and screenshots,
fills in the description, summary, price, age rating and release date, and sets `status: live`.
If the app isn't live yet, it tells you and changes nothing. Review the changes, then commit and push.

### Keeping live apps fresh

```bash
npm run sync-app -- --all          # new icons/screenshots/prices for every app
npm run sync-app -- --all --text   # also overwrite descriptions with the App Store text
```

Without `--text`, descriptions you've edited by hand are kept.
`tagline` (the App Store subtitle) isn't available from Apple's API, so set it yourself.

## Custom HTML/CSS landing page

For an app that deserves its own animated page:

1. Set `customLanding: true` in its `.md` file.
2. Create `src/pages/apps/<slug>/index.astro` — write normal HTML and CSS (and `<script>` for motion).
   `src/pages/apps/scandoc/index.astro` is a working example. Reuse `<AppSections app={app} />` for the screenshots, FAQ and footer links.

Utilities: add `class="reveal"` to any element to fade it in on scroll (`style="--d:.1s"` delays it). Animations are disabled automatically for people who turn on Reduce Motion.

## Privacy policies

Each app's policy is generated from its frontmatter:

```yaml
sdks: [admob]                 # keys from src/lib/privacy.ts → SDKS
permissions: [camera, photos] # keys from src/lib/privacy.ts → PERMISSIONS
kids: true                    # adds COPPA / child-directed wording
privacyNotes: "Anything specific to this app."
```

Check these against what each app actually ships before going live.

## Deploy (GitHub Pages)

1. Create a repo named `<username>.github.io` and push this folder to `main`.
2. Repo Settings → Pages → Source: **GitHub Actions**.
3. Set `url` in `src/config.ts` to the final address.

`.github/workflows/deploy.yml` builds and deploys on every push.
