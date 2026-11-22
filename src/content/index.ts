import { brewerSchema, recipeSchema, type Brewer, type Recipe } from './schema';

import frenchPress from './brewers/french-press-900.json';
import moka from './brewers/moka-6cup.json';
import fpClassic from './recipes/fp-classic-4min.json';
import fpClean from './recipes/fp-clean-long.json';
import mokaHot from './recipes/moka-hot-start.json';

/** Parses and validates every built-in file. Throws with a clear message on bad data. */
export function loadBuiltinContent(): { brewers: Brewer[]; recipes: Recipe[] } {
  const brewers = [frenchPress, moka].map((b) => brewerSchema.parse(b));
  const recipes = [fpClassic, fpClean, mokaHot].map((r) => recipeSchema.parse(r));
  const ids = new Set(brewers.map((b) => b.id));
  for (const r of recipes) {
    if (!ids.has(r.brewerId)) throw new Error(`Recipe ${r.id} points at unknown brewer ${r.brewerId}`);
  }
  return { brewers, recipes };
}
