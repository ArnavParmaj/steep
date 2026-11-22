import { migrations } from './migrations';
import type { Db } from './types';

/** Applies pending migrations in order, each in a transaction, tracked by PRAGMA user_version. */
export async function migrate(db: Db): Promise<number> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let current = row?.user_version ?? 0;
  for (const m of [...migrations].sort((a, b) => a.version - b.version)) {
    if (m.version <= current) continue;
    await db.withTransactionAsync(async () => {
      await db.execAsync(m.sql);
    });
    await db.execAsync(`PRAGMA user_version = ${m.version}`);
    current = m.version;
  }
  return current;
}
