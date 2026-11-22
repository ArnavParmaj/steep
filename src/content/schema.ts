import { z } from 'zod';

/** Recipe and brewer data format, schema version 1. See docs/03-data-model.md. */

export const RECIPE_SCHEMA_VERSION = 1;

const roast = z.enum(['light', 'medium', 'dark']);

export const brewerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(['volume', 'fixed']),
  capacityMl: z.number().positive(),
  minMl: z.number().positive(),
  maxMl: z.number().positive(),
  defaultMl: z.number().positive(),
  notes: z.string().default(''),
});

const pourAmount = z.union([
  z.object({ multDose: z.number().positive() }),
  z.object({ percentWater: z.number().positive().max(100) }),
  z.object({ restOfWater: z.literal(true) }),
]);

const stepBase = {
  id: z.string().min(1),
  title: z.string().min(1),
  instruction: z.string().min(1),
  why: z.string().min(1),
  alert: z.array(z.enum(['sound', 'haptic'])).default([]),
  longRunning: z.boolean().default(false),
};

export const stepSchema = z.discriminatedUnion('type', [
  z.object({ ...stepBase, type: z.literal('pour'), pour: pourAmount, durationS: z.number().int().nonnegative() }),
  z.object({ ...stepBase, type: z.literal('timer'), durationS: z.number().int().positive(), pour: pourAmount.optional() }),
  z.object({ ...stepBase, type: z.literal('action') }),
]);

export const recipeSchema = z
  .object({
    schema: z.literal(RECIPE_SCHEMA_VERSION),
    id: z.string().min(1),
    brewerId: z.string().min(1),
    name: z.string().min(1),
    version: z.number().int().positive(),
    summary: z.string().min(1),
    /** Water per gram of coffee, by strength. Fixed brewers may omit it. */
    ratio: z.object({ mild: z.number(), standard: z.number(), strong: z.number() }).optional(),
    tempC: z.record(roast, z.number().min(80).max(100)),
    grind: z.object({
      description: z.string().min(1),
      /** Click on the Ceving 60g grinder. Placeholder until AP calibrates by brewing. */
      baselineClick: z.number().int().positive(),
      placeholder: z.boolean().default(true),
    }),
    scale: z.object({
      mode: z.enum(['volume', 'fixed']),
      minMl: z.number().positive(),
      maxMl: z.number().positive(),
      defaultMl: z.number().positive(),
      /** For fixed brewers: the dose that fills the basket. */
      fixedDoseG: z.number().positive().optional(),
    }),
    steps: z.array(stepSchema).min(1),
    milk: z.object({ enabled: z.boolean(), methods: z.array(z.enum(['handheld', 'press'])) }),
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
    /** Details that came from general knowledge, not a cited page, and need real-brew confirmation. */
    toConfirm: z.array(z.string()).default([]),
  })
  .superRefine((r, ctx) => {
    if (r.scale.minMl > r.scale.defaultMl || r.scale.defaultMl > r.scale.maxMl) {
      ctx.addIssue({ code: 'custom', message: 'scale must satisfy min <= default <= max' });
    }
    if (r.scale.mode === 'volume' && !r.ratio) {
      ctx.addIssue({ code: 'custom', message: 'volume recipes need a ratio' });
    }
    if (r.scale.mode === 'fixed' && !r.scale.fixedDoseG) {
      ctx.addIssue({ code: 'custom', message: 'fixed recipes need fixedDoseG' });
    }
    const ids = r.steps.map((s) => s.id);
    if (new Set(ids).size !== ids.length) {
      ctx.addIssue({ code: 'custom', message: 'step ids must be unique' });
    }
  });

export type Brewer = z.infer<typeof brewerSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type Step = z.infer<typeof stepSchema>;
