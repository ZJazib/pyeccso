
-- =========================================================
-- ENUMS
-- =========================================================
CREATE TYPE public.app_role AS ENUM (
  'super_admin',
  'admin',
  'content_manager',
  'media_manager',
  'hr_manager',
  'finance_manager',
  'project_manager',
  'communications',
  'editor',
  'viewer'
);

-- =========================================================
-- PROFILES
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  mfa_enabled BOOLEAN NOT NULL DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- USER ROLES
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security-definer role check (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- "Is any kind of admin" helper for RLS
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin', 'admin')
  );
$$;

-- =========================================================
-- updated_at trigger fn
-- =========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_profiles_updated
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- PROFILES policies
-- =========================================================
CREATE POLICY "Profiles: view own or admin"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "Profiles: insert own"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles: update own or admin"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.is_admin(auth.uid()));

CREATE POLICY "Profiles: admin delete"
ON public.profiles FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- =========================================================
-- USER_ROLES policies (admin only writes; users see own)
-- =========================================================
CREATE POLICY "Roles: view own or admin"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Roles: admin insert"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Roles: admin update"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Roles: admin delete"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

-- =========================================================
-- AUDIT LOGS
-- =========================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  before JSONB,
  after JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit: admin read"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Audit: authenticated write"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = actor_id);

CREATE INDEX idx_audit_logs_created ON public.audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs (entity_type, entity_id);

-- =========================================================
-- ACTIVITY LOG (logins, session events)
-- =========================================================
CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activity: view own or admin"
ON public.activity_log FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Activity: insert own"
ON public.activity_log FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_activity_user ON public.activity_log (user_id, created_at DESC);

-- =========================================================
-- SITE SETTINGS (key/value)
-- =========================================================
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings: public read"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Settings: admin write"
ON public.site_settings FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Settings: admin update"
ON public.site_settings FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Settings: admin delete"
ON public.site_settings FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE TRIGGER trg_settings_updated
BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed defaults
INSERT INTO public.site_settings (key, value) VALUES
  ('general', '{"site_name":"PYECSO","tagline":"Patriotic Youths Education Culture and Social Organization","email":"info@pyecso.org.af","phone":"","logo_url":"/pyecso-logo.png","favicon_url":"/favicon.ico"}'::jsonb),
  ('social', '{"facebook":"","twitter":"","linkedin":"","instagram":"","youtube":""}'::jsonb),
  ('footer', '{"copyright":"© PYECSO. All rights reserved.","description":""}'::jsonb),
  ('maintenance', '{"enabled":false,"message":"We''ll be back soon."}'::jsonb);

-- =========================================================
-- MEDIA ASSETS
-- =========================================================
CREATE TABLE public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_bucket TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  width INT,
  height INT,
  folder TEXT DEFAULT '/',
  tags TEXT[] DEFAULT '{}',
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (storage_bucket, storage_path)
);
GRANT SELECT ON public.media_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media_assets TO authenticated;
GRANT ALL ON public.media_assets TO service_role;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media: public read"
ON public.media_assets FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Media: authed insert"
ON public.media_assets FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin(auth.uid())
  OR public.has_role(auth.uid(), 'media_manager')
  OR public.has_role(auth.uid(), 'content_manager')
  OR public.has_role(auth.uid(), 'editor')
);

CREATE POLICY "Media: authed update"
ON public.media_assets FOR UPDATE
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR public.has_role(auth.uid(), 'media_manager')
  OR public.has_role(auth.uid(), 'content_manager')
);

CREATE POLICY "Media: admin delete"
ON public.media_assets FOR DELETE
TO authenticated
USING (
  public.is_admin(auth.uid())
  OR public.has_role(auth.uid(), 'media_manager')
);

CREATE TRIGGER trg_media_updated
BEFORE UPDATE ON public.media_assets
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_media_folder ON public.media_assets (folder);
CREATE INDEX idx_media_tags ON public.media_assets USING GIN (tags);

-- =========================================================
-- VISITOR EVENTS (analytics)
-- =========================================================
CREATE TABLE public.visitor_events (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT,
  path TEXT NOT NULL,
  referrer TEXT,
  country TEXT,
  language TEXT,
  user_agent TEXT,
  is_new_session BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.visitor_events TO anon, authenticated;
GRANT USAGE ON SEQUENCE public.visitor_events_id_seq TO anon, authenticated;
GRANT SELECT ON public.visitor_events TO authenticated;
GRANT ALL ON public.visitor_events TO service_role;
ALTER TABLE public.visitor_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitor: anon insert"
ON public.visitor_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Visitor: admin read"
ON public.visitor_events FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

CREATE INDEX idx_visitor_created ON public.visitor_events (created_at DESC);
CREATE INDEX idx_visitor_path ON public.visitor_events (path);

-- =========================================================
-- Auto-create profile on new user signup
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
