---
# draft    → pages exist for App Review but are hidden (not listed, noindex, not in sitemap)
# upcoming → shown on the homepage as "Coming soon"
# live     → fully listed. `npm run sync-app -- uremote` sets this once the app is on the App Store.
status: upcoming
name: "URemote"
shortName: "URemote"
tagline: "Universal TV remote & cast"
summary: "A universal remote for your TV. Control many different TVs from your iPhone and cast your photos and videos to the big screen."
# appStoreId: "1234567890"   # Apple ID from App Store Connect › App Information
category: "Utilities"          # Coloring | Puzzles | Learning | Creativity | Wallpapers | Utilities | Apple Watch
accent: "#0369A1"
# icon and screenshots are filled in by sync-app once live; or add your own:
# icon: /images/apps/uremote/icon.png
screenshots: []
platforms: [iPhone, iPad]
price: "Free"
order: 20
featured: false

# Privacy — keys from src/lib/privacy.ts. Check these match what the app ships!
sdks: [revenuecat]
permissions: [local-network, photos-cast, microphone-voice]
kids: false              # true adds child-directed (COPPA) wording
# privacyNotes: "Anything specific about this app's data."

faq: []
---

URemote turns your iPhone into a universal remote that works with many different TVs.

### What you can do

- Control many different TVs from one app
- Cast your photos and videos to the big screen
- Use your voice for search and commands
