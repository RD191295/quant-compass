CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text CHECK (char_length(full_name) <= 120),
  avatar_url text CHECK (char_length(avatar_url) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_preferences (
  user_id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme text NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark','light')),
  timezone text NOT NULL DEFAULT 'Asia/Kolkata' CHECK (char_length(timezone) <= 64),
  email_notifications boolean NOT NULL DEFAULT true,
  research_digest boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.user_preferences TO authenticated;
GRANT ALL ON public.user_preferences TO service_role;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own prefs read" ON public.user_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own prefs update" ON public.user_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER prefs_updated BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  description text CHECK (char_length(description) <= 300),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, name)
);
CREATE INDEX watchlists_user_idx ON public.watchlists(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.watchlists TO authenticated;
GRANT ALL ON public.watchlists TO service_role;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own watchlists all" ON public.watchlists FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER watchlists_updated BEFORE UPDATE ON public.watchlists FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.watchlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id uuid NOT NULL REFERENCES public.watchlists(id) ON DELETE CASCADE,
  symbol text NOT NULL CHECK (symbol ~ '^[A-Z0-9&\-]{1,20}$'),
  exchange text NOT NULL DEFAULT 'NSE' CHECK (exchange IN ('NSE','BSE')),
  notes text CHECK (char_length(notes) <= 500),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (watchlist_id, symbol, exchange)
);
CREATE INDEX watchlist_items_list_idx ON public.watchlist_items(watchlist_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.watchlist_items TO authenticated;
GRANT ALL ON public.watchlist_items TO service_role;
ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own items all" ON public.watchlist_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.watchlists w WHERE w.id = watchlist_id AND w.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.watchlists w WHERE w.id = watchlist_id AND w.user_id = auth.uid()));

CREATE TABLE public.saved_research (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 120),
  research_type text NOT NULL CHECK (research_type IN ('stock','screener','factor','options','note')),
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb CHECK (jsonb_typeof(configuration) = 'object' AND pg_column_size(configuration) <= 16000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX saved_research_user_idx ON public.saved_research(user_id, created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_research TO authenticated;
GRANT ALL ON public.saved_research TO service_role;
ALTER TABLE public.saved_research ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own research all" ON public.saved_research FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER research_updated BEFORE UPDATE ON public.saved_research FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name) VALUES (NEW.id, left(coalesce(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'), 120)) ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_preferences (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();