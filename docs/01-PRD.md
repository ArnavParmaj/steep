# Coffee App — Product Requirements Document (DRAFT v0.1)

Status: APPROVED by AP on 2026-11-22 (v0.1 baseline). No code or repo exists. Date: 2026-11-22.
Companion docs: 02-brewing-logic-spec, 03-data-model, 04-architecture, 05-roadmap.

## 1. Problem
Generic AI and web advice on coffee is vague, inconsistent and not tied to the gear AP actually owns. AP wants a trustworthy, nerd-grade brewing guide that knows the French press, Moka pot and grinder, walks through each brew with timers, explains why each step matters, remembers what was brewed, and tells you how to fix a bad cup.

## 2. Users
- Primary: AP (iPhone). Brews one batch at a time, about 5 to 6 cups a day, drinks black and with milk (added and frothed, no sugar).
- Secondary: a few friends (mix of iPhone and Android) who sideload the app. Same features, no accounts.

## 3. Goals
1. Accurate, repeatable starting recipes per brewer, scaled to batch size.
2. Guided brew with timers and a short "why" for every step.
3. Fast logging (ratings, sliders, tags) with minimal typing.
4. Dial-in suggestions that change one variable at a time and adapt to bean, roast and freshness.
5. Quick "brew again" and favourites for the daily routine.
6. Premium look and feel, no generic AI styling.
7. New brewers and recipes added as data, without rewriting the app.

## 4. Non-goals (v1)
Accounts, cloud sync, social features, caffeine or stats dashboards, water temperature tracking or sensors, smart scale or Bluetooth, other languages or imperial units, in-app store, espresso machines.

## 5. Features and priority
P0 = must ship in v1, P1 = v1 if time allows, Later = after v1.

| # | Feature | Pri |
|---|---|---|
| 1 | Brewers: French press (900 ml) and Moka pot (6 cup) | P0 |
| 2 | Brew setup: batch size (ml), strength slider (mild / standard / strong), black or milk mode, bean choice, outputs dose, water, grind clicks, water temperature | P0 |
| 3 | Guided brew timer with step "why", sound + visual alerts, screen-awake, background timing with notification | P0 |
| 4 | iPhone Live Activity timer; Android ongoing notification | P0 |
| 5 | Milk step (handheld frother, French press frothing) | P0 |
| 6 | Rate: stars, sliders (sour to bitter, weak to strong, body), flavour tags, optional short note | P0 |
| 7 | Fix-it suggestion by symptom, one change at a time, bean-aware | P0 |
| 8 | Brew log with history and "actual vs planned" amounts | P0 |
| 9 | Beans (optional): name, roast level, roast date, origin; freshness feeds recipe | P0 |
| 10 | Brew again, favourites | P0 |
| 11 | Grinder calibration: per-brewer baseline clicks the user can override | P0 |
| 12 | Recipe variants per brewer; duplicate and edit own recipes | P1 |
| 13 | Recipe import and export as file (also lets friends swap) | P1 |
| 14 | Full data export and backup file | P0 |
| 15 | Side-by-side brew comparison | Later |
| 16 | Water hardness notes | Later |
| 17 | New brewers (AeroPress, V60, etc.) | Later |

## 6. Key user flows
**Daily brew.** Home → pick brewer (or tap a favourite / Brew again) → setup (size, strength, milk or black, bean) → review computed dose, water, grind, temp → Start → guided steps with timer → optional milk step → rate → fix-it suggestion if rated poorly → saved to log.

**Fix a bad cup.** Rate screen → choose symptom → app proposes one change with the reason → "Brew again with this change" prefills setup and marks the change so the log shows it.

**Add a bean.** Beans → add name, roast level, roast date, origin → choose when brewing; days since roast shown.

**Add a recipe.** Recipe → Duplicate → edit ratio, grind, temp, steps, why text → save as own recipe (or import a recipe file).

## 7. Acceptance criteria (samples)
- Given 750 ml French press, standard strength, the app shows dose = water / ratio, rounded to 0.5 g, and refuses a dose above the grinder capacity (60 g).
- Timer keeps correct time after the app is backgrounded or the phone locks for the whole brew, and an alert fires at each step end.
- During a brew on iPhone a Live Activity shows the current step and countdown.
- The Moka recipe never offers partial volume; it fixes water at the pot's fill line.
- A suggestion changes exactly one variable and always cites the symptom and the reason.
- A log entry stores planned and actual values, bean, grind clicks, recipe version and ratings.
- All data works offline and survives app restart; export produces a file that can be imported on a new phone.
- Units are always g, ml, °C.

## 8. Design direction
PLACEHOLDER. To be chosen with AP in a separate discussion (reference apps pending). Constraint: premium, restrained, no generic AI-looking UI.

## 9. Risks
- Free Apple account: 7-day re-signing, limit on App IDs per week (the Live Activity extension adds one). Mitigated by an early feasibility spike.
- Recipe accuracy: starting values are heuristics; mitigated by grinder calibration and dial-in loop.
- Background timers differ between iOS and Android; test on real devices.

## 10. Open questions
Answered 2026-11-22: cup = 250 to 300 ml (default 250); Moka basket about 20 g; frothing uses the same French press (rinse step added); milk amount unknown, default 100 ml per cup; Android friends get an APK.
Also answered: grinder is a Ceving; AP uses both tap and filtered water, so a per-brew water type (tap / filtered) is a simple optional field on the brew and shown in the log (no dial-in logic in v1).
Still open: the dial marking AP uses for French press and Moka (to be noted at the next brew and recorded as baselines).
