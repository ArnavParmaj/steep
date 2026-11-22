# Brewing and Recipe Logic Spec (DRAFT v0.1)

All numbers are starting heuristics, to be validated by brewing and the calibration loop. Items marked CONFIRM need AP input.

## 1. Inputs and outputs
Inputs: brewer, batch water (ml), strength, mode (black / milk), bean (roast level, roast date, origin), recipe variant, grinder baseline.
Outputs: dose (g), water (ml), water temperature (°C), grind (click number), step list with timings and pour weights.

## 2. Scaling
- Volume brewers (French press): water_ml = batch. dose_g = water_ml / ratio, rounded to 0.5 g. Steps scale by percentage of water or multiple of dose. Time does not scale with size (steep times are fixed).
- Fixed-capacity brewers (Moka): water and basket dose are set by the pot (6 cup ≈ 300 ml). No scaling; for a smaller drink use a different pot or dilute.
- Limits: French press 250 to 800 ml practical (carafe is 900 ml; leave headspace for foam and stirring). Dose max 60 g (grinder). The app warns and clamps.
- "Cup" is a display unit only. AP's cup is 250 to 300 ml; default 250 ml, adjustable in settings.

## 3. Strength
| Setting | French press ratio (water:coffee) |
|---|---|
| Mild | 17 |
| Standard | 15 |
| Strong | 13 |
Milk mode uses Strong by default so the coffee still tastes of coffee once milk is added. Moka strength is fixed by basket; milk mode just dilutes less.

## 4. French press recipes
**A. Classic 4-minute (default)**
Ratio 15, 94 °C (96 light, 90 dark), grind coarse.
1. Rinse and preheat press. Add coffee. (why: warm vessel holds temperature.)
2. Bloom: pour 2x dose of water, stir lightly, wait 0:30. (why: releases CO2 so water contacts the coffee evenly.)
3. Pour the rest of the water gently. Lid on, plunger up. Steep to 4:00 total.
4. At 4:00 stir the crust once, skim foam and floating grounds. (why: these cause bitterness and silt.)
5. Plunge slowly, only to just below the liquid. Pour all coffee out immediately into a carafe or mug. (why: coffee left on grounds keeps extracting and turns bitter.)

**B. Long steep, no plunge (cleaner cup)**
Ratio 16, 96 to 100 °C, grind medium-coarse.
1. Pour all water over coffee, steep 4:00.
2. Stir crust, skim.
3. Rest 5 to 8 minutes more without plunging, so fines settle.
4. Pour gently, leave last bit of sludge behind.

## 5. Moka pot recipe (6 cup, gas, hot-water start)
- Water: hot (just off the boil), fill to just below the valve. Coffee: fill basket level, do not tamp. Starting dose about 20 g (AP: basket holds around 20 g leveled); the app stores the pot's "basket dose" after the first brew.
- Grind: finer than French press, coarser than espresso.
1. Heat the pot base's water, add coffee to basket, level it. (why: leveling keeps flow even.)
2. Screw on top with a cloth (base is hot). Gas on medium-low, lid open.
3. Watch for first coffee, usually 1 to 2 minutes. Keep heat low. (why: high heat scorches coffee and gives a metallic bitterness.)
4. When flow turns pale yellow or starts to sputter (cue, not strict time), remove from heat.
5. Cool the base on a wet cloth or under cold water for a few seconds. (why: stops extraction and the bitter tail.)
6. Stir and serve. Option: dilute with hot water.
Typical total: 3 to 5 minutes.

## 6. Grind and clicks
- Grinder: Ceving manual grinder (confirmed), 40 clicks, 60 g capacity, with markings on the dial. The app will use the dial markings as the click scale; AP to note the marking at which a first French press and Moka brew tastes right, and we record it as the baseline.
- Each recipe stores a baseline click for the brewer; the user overrides it once ("my clicks") and the app treats that as truth.
- One click is about 2.5% of the range, a big step for Moka and a moderate one for French press. Standard adjustment: 1 click (small) or 2 clicks (large). Roast and freshness adjust grind as listed in section 8.
- Placeholder baselines until AP confirms: French press 28 to 32, Moka 12 to 15 (of 40).

## 7. Milk
Used in milk mode, after brewing.
- Whole milk, heated to 55 to 65 °C (never above 70 °C; it turns flat and loses sweetness).
- **Handheld frother:** froth near the surface for 15 to 20 s to add air, then submerge for 10 to 15 s to make it smooth. Tap and swirl.
- **French press froth:** fill milk to at most one third (it doubles), pump 20 to 30 strokes until doubled, tap to pop big bubbles, swirl.
- Timer steps with the "why" for each. AP froths in the same French press used for brewing, so the milk step starts with a "pour out coffee, rinse the press" step before frothing. Default milk amount is 100 ml per 250 ml cup (adjustable; AP unsure, to be tuned by use).

## 8. Bean adjustments
| Factor | Adjustment |
|---|---|
| Light roast | grind 1 click finer, +2 °C |
| Dark roast | grind 1 to 2 clicks coarser, -3 to -4 °C |
| Fresh (0 to 5 days off roast) | longer bloom (+15 s), expect foam |
| Peak (6 to 30 days) | no change |
| Stale (over 45 days) | grind 1 click finer, +1 °C, note flatter cup |
| Dense, high-grown origins (e.g. Ethiopia, Kenya) | 1 click finer or +1 °C |
Origin hint is advisory only. Adjustments are shown with the reason and can be switched off.

## 9. Dial-in rules (fix-it)
Principle: change one variable per brew, small steps, and remember the last change so the next suggestion builds on it. Order: grind, then time, then ratio, then temperature.

| Symptom (user picks) | Likely cause | French press | Moka |
|---|---|---|---|
| Sour, sharp, salty, thin | under-extracted | 1 to 2 clicks finer; else +30 s steep; else +2 °C | 1 click finer; check heat not too low |
| Bitter, dry, harsh | over-extracted | 1 to 2 clicks coarser; else -30 s; else -3 °C | 1 click coarser; lower heat; pull off sooner and cool the base |
| Weak, watery but pleasant | ratio too loose | ratio one step stronger (17 to 15 to 13) | basket full and level; slightly finer |
| Too strong, heavy | ratio too tight | ratio one step milder | dilute with hot water |
| Muddy, silty | too many fines or stirring | 1 click coarser, skim, longer settle, leave dregs | do not tamp, check basket is clean |
| Hollow, flat | uneven or stale | stir after pour, fresher beans, +1 °C | even leveling, hotter water start |
If the same symptom persists after two suggested changes, the app says to try fresher beans or a different grind quality and does not keep pushing the same direction.

## 10. Source of truth
Recipes live as data (see 03-data-model). This spec is the human-readable version for review; it should be converted into data files and unit tests for the recipe engine before release.
