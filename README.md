# Steep

A personal coffee brewing guide (French press and Moka pot to start) for iPhone and Android. Local-only data, no accounts. Working name; the name may change.

Product docs are in `docs/`, the approved design in `docs/design/`. Recipes and brewers are plain JSON in `src/content/` and are validated by `src/content/schema.ts`.

## Run it on your iPhone (Mac)

One-time setup:
1. Install **Xcode** from the App Store, open it once, accept the licence, and install the iOS platform when asked.
2. Install **Node 20 or newer** (https://nodejs.org).
3. In Xcode: Settings → Accounts → add your Apple ID (a free account is fine).
4. On the iPhone: Settings → Privacy & Security → turn on **Developer Mode** (it restarts the phone). Connect it to the Mac with a cable and tap Trust.

Build and install:
```bash
git clone https://github.com/ArnavParmaj/steep.git
cd steep
npm install
npx expo run:ios --device
```
Pick your iPhone when asked. The first build takes several minutes. If Xcode complains about signing, open `ios/Steep.xcworkspace`, select the Steep target → Signing & Capabilities, tick "Automatically manage signing" and choose your Personal Team. If the bundle ID is taken, change it to something unique like `com.<yourname>.steep` in `app.json` and run `npx expo prebuild --clean`.

First launch: on the iPhone go to Settings → General → VPN & Device Management → your Apple ID → Trust.

**Free Apple accounts expire builds after 7 days.** To renew, re-run `npx expo run:ios --device` with the phone plugged in. Your data stays on the phone while the app is reinstalled over itself.

## Develop
```bash
npm test          # recipe data and database tests
npm run typecheck
npx expo start    # dev server
```
`ios/` and `android/` are generated (not committed) by `expo run:ios` or `npx expo prebuild`.

## Layout
```
src/app/       screens (Expo Router)
src/content/   built-in brewers and recipes as JSON + schema
src/data/      SQLite, migrations, seeding, repositories
src/engine/    recipe engine (next phase)
src/ui/        design tokens (Dark Roast)
tests/         Jest
```
