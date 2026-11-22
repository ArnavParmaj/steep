/** Numbered migrations. Never edit a shipped migration: add a new one. */
export const migrations: { version: number; sql: string }[] = [
  {
    version: 1,
    sql: `
      CREATE TABLE brewer (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL,
        capacity_ml REAL NOT NULL, min_ml REAL NOT NULL, max_ml REAL NOT NULL,
        default_ml REAL NOT NULL, notes TEXT NOT NULL DEFAULT '',
        grinder_baseline TEXT
      );
      CREATE TABLE recipe (
        id TEXT PRIMARY KEY, brewer_id TEXT NOT NULL REFERENCES brewer(id),
        name TEXT NOT NULL, version INTEGER NOT NULL,
        source TEXT NOT NULL CHECK (source IN ('builtin','user','imported')),
        definition TEXT NOT NULL, created_at INTEGER NOT NULL
      );
      CREATE TABLE grinder_profile (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, clicks_total INTEGER NOT NULL,
        capacity_g REAL NOT NULL, convention TEXT, baseline_overrides TEXT
      );
      CREATE TABLE bean (
        id TEXT PRIMARY KEY, name TEXT NOT NULL,
        roast_level TEXT CHECK (roast_level IN ('light','medium','dark')),
        roast_date TEXT, origin TEXT, archived INTEGER NOT NULL DEFAULT 0
      );
      CREATE TABLE brew (
        id TEXT PRIMARY KEY, recipe_id TEXT NOT NULL REFERENCES recipe(id),
        recipe_version INTEGER NOT NULL, bean_id TEXT REFERENCES bean(id),
        mode TEXT NOT NULL CHECK (mode IN ('black','milk')), water_type TEXT,
        strength TEXT, planned TEXT NOT NULL, actual TEXT,
        started_at INTEGER NOT NULL, duration_s INTEGER, applied_adjustment TEXT
      );
      CREATE TABLE brew_rating (
        brew_id TEXT PRIMARY KEY REFERENCES brew(id), stars INTEGER,
        sliders TEXT, tags TEXT, symptom TEXT, note TEXT
      );
      CREATE TABLE favourite (
        id TEXT PRIMARY KEY, recipe_id TEXT NOT NULL REFERENCES recipe(id), settings TEXT NOT NULL
      );
      CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
      CREATE INDEX idx_brew_started ON brew(started_at);
    `,
  },
];
