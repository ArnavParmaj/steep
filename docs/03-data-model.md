# Data Model and Brewer Schema (DRAFT v0.1)

Local SQLite only. Recipes and brewers are data; the app contains a generic engine that reads them. No code is written yet.

## 1. Entities
- **brewer**: id, name, kind (`volume` | `fixed`), capacity_ml, min_ml, max_ml, default_ml, notes, grinder_baseline JSON.
- **recipe**: id, brewer_id, name, version, source (`builtin` | `user` | `imported`), definition JSON (see 2), created_at.
- **grinder_profile**: id, name, clicks_total (40), capacity_g (60), counting convention, per-brewer baseline overrides.
- **bean**: id, name, roast_level (light | medium | dark), roast_date, origin, archived.
- **brew**: id, recipe_id, recipe_version, bean_id (nullable), mode (black | milk), water_type (tap | filtered, optional), strength, planned JSON (dose, water, temp, clicks), actual JSON (dose, water, clicks), started_at, duration, applied_adjustment JSON (the one change from last suggestion).
- **brew_rating**: brew_id, stars, sliders JSON, tags JSON, symptom, note.
- **favourite**: id, recipe_id, settings JSON (size, strength, mode, bean).
- **settings**: key/value (units fixed, sound, haptics).

## 2. Recipe definition (declarative, no code)
```json
{
  "schema": 1,
  "id": "fp-classic-4min",
  "brewerId": "french-press-900",
  "name": "Classic 4-minute",
  "ratio": { "mild": 17, "standard": 15, "strong": 13 },
  "tempC": { "light": 96, "medium": 94, "dark": 90 },
  "grind": { "baselineClick": 30 },
  "scale": { "mode": "volume", "minMl": 250, "maxMl": 800, "defaultMl": 500 },
  "steps": [
    { "id": "bloom", "type": "pour", "title": "Bloom",
      "pour": { "multDose": 2 }, "durationS": 30,
      "instruction": "Pour twice the coffee weight and stir lightly.",
      "why": "Releases CO2 so water contacts all the coffee evenly.",
      "alert": ["sound", "haptic"] },
    { "id": "steep", "type": "timer", "durationS": 210, "pour": { "restOfWater": true } },
    { "id": "skim", "type": "action", "title": "Stir crust and skim", "why": "..." },
    { "id": "plunge", "type": "action", "title": "Plunge slowly and pour out", "why": "..." }
  ],
  "milk": { "enabled": true, "methods": ["handheld", "press"] }
}
```
Rules in the format: pour amounts are expressed as multiples of dose, a percent of water, or "rest of water"; step types are `pour`, `timer`, `action`; `longRunning` marks steps needing notification and Live Activity. A tiny interpreter handles these; no arbitrary expressions.

## 3. Adding a brewer or recipe later
1. New brewer: add a brewer record (kind, capacity, limits) and recipes pointing at it. No app change if it fits `volume` or `fixed`.
2. New recipe: in-app duplicate and edit, or import a recipe file (the JSON above).
3. Recipe versioning: edits bump `version`; logs keep the version they used so history stays accurate.
4. If a new brewer needs a new kind of behaviour (e.g. espresso pressure profile), extend the schema with a new `schema` version and a migration.

## 4. Migrations and export
SQLite schema is versioned with numbered migrations. Export writes one JSON file containing beans, brews, favourites, user recipes; import merges by id.
