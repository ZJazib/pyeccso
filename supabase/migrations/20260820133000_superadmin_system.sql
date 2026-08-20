-- =========================================================
-- SUPERADMIN & RBAC SECURITY ARCHITECTURE MIGRATION
-- Patriotic Youths Education, Cultural and Social Organization (PYECSO)
-- =========================================================

-- Ensure role enum includes all required roles
DO $$
BEGIN
  -- Add new role values if they do not exist
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'admin'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content_manager'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'media_manager'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'learn_manager'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'teacher'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hr_manager'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'finance_manager'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'project_manager'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'communications'; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'viewer'; EXCEPTION WHEN duplicate_object THEN NULL; END;
END
$$;

-- Security Definer Functions to avoid recursive RLS checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('super_admin', 'admin', 'content_manager', 'editor', 'media_manager', 'learn_manager')
  );
$$;

-- =========================================================
-- AUDIT LOGS TABLE & AUTOMATED TRIGGER
-- =========================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  actor_email TEXT,
  action TEXT NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
  target_table TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  old_data JSONB,
  new_data JSONB,
  diff JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON public.audit_logs(target_table);

GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Automated Audit Logging Trigger Function
CREATE OR REPLACE FUNCTION public.audit_log_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _actor_id UUID;
  _actor_email TEXT;
  _entity_id TEXT;
  _entity_type TEXT;
  _old JSONB := NULL;
  _new JSONB := NULL;
  _diff JSONB := NULL;
BEGIN
  _actor_id := auth.uid();
  
  IF _actor_id IS NOT NULL THEN
    SELECT email INTO _actor_email FROM auth.users WHERE id = _actor_id;
  END IF;

  IF TG_OP = 'INSERT' THEN
    _new := to_jsonb(NEW);
    _entity_id := COALESCE(_new->>'id', _new->>'key', 'unknown');
    _entity_type := _new->>'type';
  ELSIF TG_OP = 'UPDATE' THEN
    _old := to_jsonb(OLD);
    _new := to_jsonb(NEW);
    _entity_id := COALESCE(_new->>'id', _new->>'key', 'unknown');
    _entity_type := _new->>'type';
    _diff := jsonb_strip_nulls(_new - _old);
  ELSIF TG_OP = 'DELETE' THEN
    _old := to_jsonb(OLD);
    _entity_id := COALESCE(_old->>'id', _old->>'key', 'unknown');
    _entity_type := _old->>'type';
  END IF;

  INSERT INTO public.audit_logs (
    actor_id,
    actor_email,
    action,
    target_table,
    entity_type,
    entity_id,
    old_data,
    new_data,
    diff,
    created_at
  ) VALUES (
    _actor_id,
    _actor_email,
    TG_OP,
    TG_TABLE_NAME,
    _entity_type,
    _entity_id,
    _old,
    _new,
    _diff,
    now()
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Attach Audit Triggers to core tables
DROP TRIGGER IF EXISTS trg_audit_content_items ON public.content_items;
CREATE TRIGGER trg_audit_content_items
AFTER INSERT OR UPDATE OR DELETE ON public.content_items
FOR EACH ROW EXECUTE FUNCTION public.audit_log_mutation();

DROP TRIGGER IF EXISTS trg_audit_user_roles ON public.user_roles;
CREATE TRIGGER trg_audit_user_roles
AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.audit_log_mutation();

DROP TRIGGER IF EXISTS trg_audit_media_assets ON public.media_assets;
CREATE TRIGGER trg_audit_media_assets
AFTER INSERT OR UPDATE OR DELETE ON public.media_assets
FOR EACH ROW EXECUTE FUNCTION public.audit_log_mutation();

DROP TRIGGER IF EXISTS trg_audit_site_settings ON public.site_settings;
CREATE TRIGGER trg_audit_site_settings
AFTER INSERT OR UPDATE OR DELETE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.audit_log_mutation();

-- =========================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- 1. USER_ROLES Policies (Strict: Only Superadmin can insert/update/delete)
DROP POLICY IF EXISTS "user_roles_select" ON public.user_roles;
DROP POLICY IF EXISTS "user_roles_superadmin_manage" ON public.user_roles;
CREATE POLICY "user_roles_select" ON public.user_roles
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "user_roles_superadmin_insert" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "user_roles_superadmin_update" ON public.user_roles
  FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "user_roles_superadmin_delete" ON public.user_roles
  FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()));

-- 2. AUDIT_LOGS Policies (Read by Superadmin & Admins, Write only via trigger)
DROP POLICY IF EXISTS "audit_logs_superadmin_select" ON public.audit_logs;
CREATE POLICY "audit_logs_superadmin_select" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- 3. CONTENT_ITEMS Policies
DROP POLICY IF EXISTS "content_items_public_select" ON public.content_items;
DROP POLICY IF EXISTS "content_items_admin_all" ON public.content_items;
CREATE POLICY "content_items_public_select" ON public.content_items
  FOR SELECT
  USING (deleted_at IS NULL AND status = 'published');

CREATE POLICY "content_items_admin_select" ON public.content_items
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "content_items_admin_insert" ON public.content_items
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "content_items_admin_update" ON public.content_items
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "content_items_admin_delete" ON public.content_items
  FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_admin(auth.uid()));

-- 4. MEDIA_ASSETS Policies
DROP POLICY IF EXISTS "media_assets_public_select" ON public.media_assets;
DROP POLICY IF EXISTS "media_assets_admin_all" ON public.media_assets;
CREATE POLICY "media_assets_public_select" ON public.media_assets
  FOR SELECT
  USING (true);

CREATE POLICY "media_assets_admin_insert" ON public.media_assets
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "media_assets_admin_update" ON public.media_assets
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "media_assets_admin_delete" ON public.media_assets
  FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- 5. SITE_SETTINGS Policies
DROP POLICY IF EXISTS "site_settings_public_select" ON public.site_settings;
DROP POLICY IF EXISTS "site_settings_admin_all" ON public.site_settings;
CREATE POLICY "site_settings_public_select" ON public.site_settings
  FOR SELECT
  USING (true);

CREATE POLICY "site_settings_admin_manage" ON public.site_settings
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- 6. CONTACT_MESSAGES Policies
DROP POLICY IF EXISTS "contact_messages_public_insert" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages_admin_select" ON public.contact_messages;
CREATE POLICY "contact_messages_public_insert" ON public.contact_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "contact_messages_admin_select" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "contact_messages_admin_update" ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "contact_messages_admin_delete" ON public.contact_messages
  FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()) OR public.is_admin(auth.uid()));

-- 7. APPLICATIONS Policies
DROP POLICY IF EXISTS "applications_public_insert" ON public.applications;
DROP POLICY IF EXISTS "applications_admin_manage" ON public.applications;
CREATE POLICY "applications_public_insert" ON public.applications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "applications_admin_manage" ON public.applications
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
