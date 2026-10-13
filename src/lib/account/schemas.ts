import { z } from 'zod';

export const symbolSchema = z.string().trim().toUpperCase().regex(/^[A-Z0-9&-]{1,20}$/, 'Use a valid NSE/BSE symbol');
export const idSchema = z.object({ id: z.string().uuid() });
export const createWatchlistSchema = z.object({
  name: z.string().trim().min(1, 'Name your watchlist').max(80, 'Use at most 80 characters'),
  description: z.string().trim().max(300).optional(),
});
export const addItemSchema = z.object({
  watchlistId: z.string().uuid(),
  symbol: symbolSchema,
  exchange: z.enum(['NSE', 'BSE']).default('NSE'),
  notes: z.string().trim().max(500).optional(),
});
export const researchTypes = ['stock', 'screener', 'factor', 'options', 'note'] as const;
export const researchConfigSchema = z
  .record(z.union([z.string().max(2000), z.number(), z.boolean(), z.null()]))
  .refine((o) => Object.keys(o).length <= 30, 'Too many configuration fields');
export const saveResearchSchema = z.object({
  title: z.string().trim().min(1, 'Add a title').max(120),
  researchType: z.enum(researchTypes),
  configuration: researchConfigSchema.default({}),
});
export const profileSchema = z.object({ fullName: z.string().trim().min(1, 'Enter your name').max(120) });
export const preferencesSchema = z.object({
  theme: z.enum(['dark', 'light']),
  timezone: z.string().trim().min(1).max(64),
  emailNotifications: z.boolean(),
  researchDigest: z.boolean(),
});
