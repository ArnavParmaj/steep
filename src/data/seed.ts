import type { Brewer, Recipe } from '../content/schema';
import type { Db } from './types';

/**
 * Loads built-in brewers and recipes. A built-in recipe is replaced only when the bundled
 * version is newer, so user duplicates (source 'user') are never touched.
 */
export async function seedBuiltins(db: Db, content: { brewers: Brewer[]; recipes: Recipe[] }, now = Date.now()) {
  await db.withTransactionAsync(async () => {
    for (const b of content.brewers) {
      await db.runAsync(
        `INSERT INTO brewer (id, name, kind, capacity_ml, min_ml, max_ml, default_ml, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET name=excluded.name, kind=excluded.kind,
           capacity_ml=excluded.capacity_ml, min_ml=excluded.min_ml, max_ml=excluded.max_ml,
           default_ml=excluded.default_ml, notes=excluded.notes`,
        b.id, b.name, b.kind, b.capacityMl, b.minMl, b.maxMl, b.defaultMl, b.notes,
      );
    }
    for (const r of content.recipes) {
      const existing = await db.getFirstAsync<{ version: number; source: string }>(
        'SELECT version, source FROM recipe WHERE id = ?', r.id,
      );
      if (existing && (existing.source !== 'builtin' || existing.version >= r.version)) continue;
      await db.runAsync(
        `INSERT OR REPLACE INTO recipe (id, brewer_id, name, version, source, definition, created_at)
         VALUES (?, ?, ?, ?, 'builtin', ?, ?)`,
        r.id, r.brewerId, r.name, r.version, JSON.stringify(r), now,
      );
    }
  });
}
