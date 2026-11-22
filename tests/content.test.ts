import { loadBuiltinContent } from '../src/content';
import { recipeSchema } from '../src/content/schema';

describe('built-in content', () => {
  const { brewers, recipes } = loadBuiltinContent();

  it('loads French press and Moka', () => {
    expect(brewers.map((b) => b.id).sort()).toEqual(['french-press-900', 'moka-6cup']);
    expect(recipes).toHaveLength(3);
  });

  it('every recipe has a why for every step and a source', () => {
    for (const r of recipes) {
      expect(r.sources.length).toBeGreaterThan(0);
      for (const s of r.steps) expect(s.why.length).toBeGreaterThan(10);
    }
  });

  it('rejects a volume recipe without a ratio', () => {
    const bad = { ...recipes[0], ratio: undefined };
    expect(() => recipeSchema.parse(bad)).toThrow();
  });

  it('rejects duplicate step ids', () => {
    const r = recipes[0];
    const bad = { ...r, steps: [r.steps[0], r.steps[0]] };
    expect(() => recipeSchema.parse(bad)).toThrow();
  });
});
