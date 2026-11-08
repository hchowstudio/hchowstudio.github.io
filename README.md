# HChow Studio — app portfolio site

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
| App images | `public/images/apps/<slug>/` (`icon.png`, `shot-1.jpg`…) |
| Privacy text for each SDK / permission | `src/lib/privacy.ts` |
| Pages | `src/pages/` |

## Add an app (Markdown)

1. Copy any file in `src/content/apps/`, rename it to the new slug.
2. Fill in the frontmatter (`name`, `tagline`, `appStoreId`, `category`, `sdks`, `permissions`, …). The body is the long description in Markdown.
3. Put `icon.png` and screenshots in `public/images/apps/<slug>/`.

You get `/apps/<slug>/` and `/apps/<slug>/privacy/` automatically, and the app appears on the homepage.

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

## Moving AdMob to the new domain

AdMob reads `app-ads.txt` from the domain in each app's **Marketing / Support URL** in App Store Connect — currently `wallzstudio.github.io`.

1. Deploy, then confirm `https://<new-site>/app-ads.txt` loads.
2. Update the Marketing URL, Support URL and Privacy Policy URL of every app in App Store Connect
   (support: `/contact/?app=<slug>`, privacy: `/apps/<slug>/privacy/`).
3. Keep `wallzstudio.github.io/app-ads.txt` online until AdMob shows every app as verified on the new domain.
