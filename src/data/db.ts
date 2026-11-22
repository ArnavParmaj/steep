import * as SQLite from 'expo-sqlite';
import { loadBuiltinContent } from '../content';
import { migrate } from './migrate';
import { seedBuiltins } from './seed';
import type { Db } from './types';

let ready: Promise<SQLite.SQLiteDatabase> | null = null;

/** Opens the database once, migrates it and loads built-in content. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  ready ??= (async () => {
    const db = await SQLite.openDatabaseAsync('steep.db');
    await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
    await migrate(db as unknown as Db);
    await seedBuiltins(db as unknown as Db, loadBuiltinContent());
    return db;
  })();
  return ready;
}
