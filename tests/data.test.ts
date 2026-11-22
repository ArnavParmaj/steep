import { migrate } from '../src/data/migrate';
import { seedBuiltins } from '../src/data/seed';
import { loadBuiltinContent } from '../src/content';
import type { Db } from '../src/data/types';

/** Records calls; enough to check ordering and idempotence without a real SQLite. */
function fakeDb(userVersion = 0) {
  const log: string[] = [];
  const recipes = new Map<string, { version: number; source: string }>();
  const db: Db = {
    execAsync: async (sql) => { log.push(sql.trim().split('\n')[0]); },
    runAsync: async (sql, ...p) => {
      if (sql.includes('INSERT OR REPLACE INTO recipe')) recipes.set(p[0] as string, { version: p[3] as number, source: 'builtin' });
    },
    getAllAsync: async () => [],
    getFirstAsync: async (sql, ...p) => {
      if (sql.includes('user_version')) return { user_version: userVersion } as never;
      if (sql.includes('FROM recipe')) return (recipes.get(p[0] as string) ?? null) as never;
      return null;
    },
    withTransactionAsync: async (t) => t(),
  };
  return { db, log, recipes };
}

describe('data layer', () => {
  it('applies migrations from a fresh database', async () => {
    const { db, log } = fakeDb(0);
    expect(await migrate(db)).toBe(1);
    expect(log.some((l) => l.includes('user_version = 1'))).toBe(true);
  });

  it('skips migrations already applied', async () => {
    const { db, log } = fakeDb(1);
    await migrate(db);
    expect(log).toHaveLength(0);
  });

  it('does not overwrite a built-in recipe of equal version or a user recipe', async () => {
    const { db, recipes } = fakeDb();
    const content = loadBuiltinContent();
    await seedBuiltins(db, content);
    expect(recipes.size).toBe(3);
    recipes.set('fp-classic-4min', { version: 1, source: 'user' });
    await seedBuiltins(db, content);
    expect(recipes.get('fp-classic-4min')?.source).toBe('user');
  });
});
