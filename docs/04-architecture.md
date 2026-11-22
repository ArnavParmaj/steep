# Technical Architecture (DRAFT v0.1)

Goal: simple, low cost, easy for Claude to build and maintain while AP reviews. No backend.

## 1. Stack
- Expo / React Native, TypeScript, Expo Router for navigation.
- Development build (not Expo Go), because Live Activity needs a native iOS extension. AP builds with Xcode on the Mac.
- expo-sqlite for local data with numbered migrations; small data-access layer.
- Zustand (or similar) for in-memory UI state.
- Pure TypeScript recipe engine (no UI dependencies) so it can be unit tested heavily with Jest. This is where accuracy lives.
Library names are candidates and will be confirmed in the spike.

## 2. Modules
- `engine`: scaling, grind, bean adjustments, dial-in rules, milk steps. Input: brewer + recipe + context. Output: brew plan.
- `data`: SQLite, repositories, migrations, export/import.
- `brew-session`: runs a plan, owns timer state.
- `notifications`: local notifications, Live Activity bridge, Android ongoing notification.
- `ui`: screens and design system (design tokens are added after the design discussion).
- `content`: built-in brewers and recipes as JSON, validated at build time.

## 3. Timers
- Timer state is absolute timestamps (end time per step), never a ticking counter, so it is correct after backgrounding or lock.
- On brew start, schedule a local notification for each step end so alerts arrive even if the app is suspended.
- Foreground: keep screen awake (short brews), play sound and haptic at each step end.
- iPhone: Live Activity shows current step and countdown using a native countdown timer, which does not need background execution.
- Android: ongoing notification with chronometer.
- Long brews (long French press, milk steps) rely on notifications.

## 4. iOS Live Activity
Requires a SwiftUI widget extension target. Free Apple account: extensions are allowed but each app and extension consumes an App ID against a weekly limit, and builds expire after 7 days. Phase 0 spike must prove: install, Live Activity start/update/end locally, and re-signing workflow.

## 5. Distribution
- iOS: Xcode run on device with AP's free account, re-sign weekly. Friends with iPhones would need their own Mac + Xcode (or a paid developer account / TestFlight); flag to AP.
- Android: build a release APK (local Gradle build or EAS free tier), share the file; friends allow install from unknown sources.

## 6. Quality
Unit tests for the engine (every recipe at several sizes and roasts), data migration tests, and manual on-device checklists for timers and notifications (screen locked, app killed, silent mode).

## 7. Security and privacy
No accounts, no network calls, no analytics. All data stays on the device; export is user-initiated.

## 8. Decisions needing AP
1. Accept Expo dev build + Xcode workflow (vs plain React Native).
2. Friends on iPhone: accept that they need their own signing, or consider a paid account later.
