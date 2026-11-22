import type { Recipe } from '../content/schema';
import { recipeSchema } from '../content/schema';
import type { Db } from './types';

export type BrewerRow = { id: string; name: string; kind: 'volume' | 'fixed'; default_ml: number };

export async function listBrewers(db: Db): Promise<BrewerRow[]> {
  return db.getAllAsync<BrewerRow>('SELECT id, name, kind, default_ml FROM brewer ORDER BY name');
}

export async function listRecipes(db: Db, brewerId: string): Promise<Recipe[]> {
  const rows = await db.getAllAsync<{ definition: string }>(
    'SELECT definition FROM recipe WHERE brewer_id = ? ORDER BY name', brewerId,
  );
  return rows.map((r) => recipeSchema.parse(JSON.parse(r.definition)));
}
