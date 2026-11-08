---
# draft    → pages exist for App Review but are hidden (not listed, noindex, not in sitemap)
# upcoming → shown on the homepage as "Coming soon"
# live     → fully listed. `npm run sync-app -- memogo` sets this once the app is on the App Store.
status: upcoming
name: "MemoGo: Match Pairs Game"
shortName: "MemoGo"
tagline: "Play online in private rooms"
summary: "A classic memory game with a twist: flip cards, match pairs and challenge friends in your own private online room."
# appStoreId: "1234567890"   # Apple ID from App Store Connect › App Information
category: "Puzzles"          # Coloring | Puzzles | Learning | Creativity | Wallpapers | Utilities | Apple Watch
accent: "#7E22CE"
# icon and screenshots are filled in by sync-app once live; or add your own:
# icon: /images/apps/memogo/icon.png
screenshots: []
platforms: [iPhone, iPad]
price: "Free"
order: 19
featured: false

# Privacy — keys from src/lib/privacy.ts. Check these match what the app ships!
sdks: [admob, supabase]            # admob | meta-audience | firebase | supabase | revenuecat — [] for none
permissions: []          # camera | photos | photos-add | health | notifications
kids: false              # true adds child-directed (COPPA) wording
# privacyNotes: "Anything specific about this app's data."

faq:
  - q: "How do private rooms work?"
    a: "Create a room, share its code with friends, and play the same board together. Only people with the code can join."
---

MemoGo brings the classic memory game to your iPhone, then lets you play it with friends.

### How it works

- Flip two cards at a time and find every matching pair
- Create a private online room and share the code with friends
- Play together and see who finds the most pairs
