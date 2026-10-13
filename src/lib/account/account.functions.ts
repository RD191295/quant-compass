import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { addItemSchema, createWatchlistSchema, idSchema, preferencesSchema, profileSchema, saveResearchSchema } from './schemas';

function fail(error: { code?: string } | null, message: string) {
  if (!error) return;
  if (error.code === '23505') throw new Error('That already exists in your workspace.');
  console.error(message, error.code);
  throw new Error(message);
}

export const getWorkspace = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;
    const [profile, prefs, lists, research] = await Promise.all([
      supabase.from('profiles').select('full_name, avatar_url').eq('id', userId).maybeSingle(),
      supabase.from('user_preferences').select('theme, timezone, email_notifications, research_digest').eq('user_id', userId).maybeSingle(),
      supabase.from('watchlists').select('id, name, description, created_at, watchlist_items(id, symbol, exchange, notes, created_at)').order('created_at'),
      supabase.from('saved_research').select('id, title, research_type, configuration, created_at, updated_at').order('created_at', { ascending: false }),
    ]);
    for (const r of [profile, prefs, lists, research]) fail(r.error, 'Could not load your workspace.');
    return {
      email: typeof claims?.email === 'string' ? claims.email : '',
      fullName: profile.data?.full_name ?? '',
      preferences: {
        theme: (prefs.data?.theme ?? 'dark') as 'dark' | 'light',
        timezone: prefs.data?.timezone ?? 'Asia/Kolkata',
        emailNotifications: prefs.data?.email_notifications ?? true,
        researchDigest: prefs.data?.research_digest ?? false,
      },
      watchlists: (lists.data ?? []).map((w) => ({
        id: w.id, name: w.name, description: w.description, createdAt: w.created_at,
        items: (w.watchlist_items ?? []).map((i) => ({ id: i.id, symbol: i.symbol, exchange: i.exchange, notes: i.notes })),
      })),
      research: (research.data ?? []).map((r) => ({
        id: r.id, title: r.title, researchType: r.research_type, createdAt: r.created_at,
        configuration: (r.configuration ?? {}) as Record<string, string | number | boolean | null>,
      })),
    };
  });

export type Workspace = Awaited<ReturnType<typeof getWorkspace>>;

export const createWatchlist = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => createWatchlistSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase.from('watchlists')
      .insert({ user_id: context.userId, name: data.name, description: data.description || null }).select('id').single();
    fail(error, 'Could not create the watchlist.');
    return { id: row!.id };
  });

export const deleteWatchlist = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => idSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('watchlists').delete().eq('id', data.id);
    fail(error, 'Could not delete the watchlist.');
    return { ok: true };
  });

export const addWatchlistItem = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => addItemSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('watchlist_items')
      .insert({ watchlist_id: data.watchlistId, symbol: data.symbol, exchange: data.exchange, notes: data.notes || null });
    fail(error, 'Could not add the stock.');
    return { ok: true };
  });

export const removeWatchlistItem = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => idSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('watchlist_items').delete().eq('id', data.id);
    fail(error, 'Could not remove the stock.');
    return { ok: true };
  });

export const saveResearch = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => saveResearchSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('saved_research')
      .insert({ user_id: context.userId, title: data.title, research_type: data.researchType, configuration: data.configuration });
    fail(error, 'Could not save the research.');
    return { ok: true };
  });

export const deleteResearch = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => idSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('saved_research').delete().eq('id', data.id);
    fail(error, 'Could not delete the research.');
    return { ok: true };
  });

export const updateProfile = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => profileSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('profiles').update({ full_name: data.fullName }).eq('id', context.userId);
    fail(error, 'Could not update your profile.');
    return { ok: true };
  });

export const updatePreferences = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => preferencesSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('user_preferences').update({
      theme: data.theme, timezone: data.timezone, email_notifications: data.emailNotifications, research_digest: data.researchDigest,
    }).eq('user_id', context.userId);
    fail(error, 'Could not save your preferences.');
    return { ok: true };
  });
