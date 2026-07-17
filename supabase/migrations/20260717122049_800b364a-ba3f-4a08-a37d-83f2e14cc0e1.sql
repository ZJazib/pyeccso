
-- =========================================================
-- Phase A foundation: soft delete, versions, taxonomies,
-- redirects, SEO, full-text search
-- =========================================================

-- 1) Soft delete columns on user-facing tables
ALTER TABLE public.content_items    ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.media_assets     ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.applications     ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

CREATE INDEX IF NOT EXISTS content_items_not_deleted_idx    ON public.content_items(type, status)    WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS media_assets_not_deleted_idx     ON public.media_assets(created_at DESC)  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS applications_not_deleted_idx     ON public.applications(created_at DESC)  WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS contact_messages_not_deleted_idx ON public.contact_messages(created_at DESC) WHERE deleted_at IS NULL;

-- Public policy already exists; add filter for deleted rows via a stricter check.
-- We keep the existing policy but rely on the app to filter deleted_at. To also
-- protect the public API, replace the public read policy so it excludes soft-deleted rows.
DROP POLICY IF EXISTS "Public can view published content" ON public.content_items;
CREATE POLICY "Public can view published content"
  ON public.content_items FOR SELECT
  USING (status = 'published'::content_status AND deleted_at IS NULL);

-- 2) Content versions (snapshot on save)
CREATE TABLE IF NOT EXISTS public.content_versions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id   uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  version_no   integer NOT NULL,
  data         jsonb NOT NULL,
  status       content_status NOT NULL,
  slug         text,
  cover_url    text,
  note         text,
  edited_by    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (content_id, version_no)
);
CREATE INDEX IF NOT EXISTS content_versions_content_idx ON public.content_versions(content_id, version_no DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_versions TO authenticated;
GRANT ALL ON public.content_versions TO service_role;
ALTER TABLE public.content_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Editors read versions"
  ON public.content_versions FOR SELECT TO authenticated
  USING (
    has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role)
    OR has_role(auth.uid(),'content_manager'::app_role) OR has_role(auth.uid(),'editor'::app_role)
    OR has_role(auth.uid(),'communications'::app_role) OR has_role(auth.uid(),'media_manager'::app_role)
    OR has_role(auth.uid(),'hr_manager'::app_role) OR has_role(auth.uid(),'project_manager'::app_role)
    OR has_role(auth.uid(),'viewer'::app_role)
  );
CREATE POLICY "Editors write versions"
  ON public.content_versions FOR INSERT TO authenticated
  WITH CHECK (
    has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role)
    OR has_role(auth.uid(),'content_manager'::app_role) OR has_role(auth.uid(),'editor'::app_role)
    OR has_role(auth.uid(),'communications'::app_role) OR has_role(auth.uid(),'media_manager'::app_role)
    OR has_role(auth.uid(),'hr_manager'::app_role) OR has_role(auth.uid(),'project_manager'::app_role)
  );
CREATE POLICY "Admins delete versions"
  ON public.content_versions FOR DELETE TO authenticated
  USING (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role));

-- 3) Taxonomies (categories + tags per content type)
DO $$ BEGIN
  CREATE TYPE taxonomy_kind AS ENUM ('category','tag');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.taxonomy_terms (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind       taxonomy_kind NOT NULL,
  type       content_type,        -- null = applies to all types
  slug       text NOT NULL,
  name       jsonb NOT NULL DEFAULT '{}'::jsonb,   -- {en, dr, ps, ar, fr}
  parent_id  uuid REFERENCES public.taxonomy_terms(id) ON DELETE SET NULL,
  color      text,
  position   integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, type, slug)
);
CREATE TRIGGER taxonomy_terms_updated_at BEFORE UPDATE ON public.taxonomy_terms
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.content_taxonomies (
  content_id uuid NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,
  term_id    uuid NOT NULL REFERENCES public.taxonomy_terms(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, term_id)
);
CREATE INDEX IF NOT EXISTS content_taxonomies_term_idx ON public.content_taxonomies(term_id);

GRANT SELECT ON public.taxonomy_terms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.taxonomy_terms TO authenticated;
GRANT ALL ON public.taxonomy_terms TO service_role;
ALTER TABLE public.taxonomy_terms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read taxonomy_terms" ON public.taxonomy_terms FOR SELECT USING (true);
CREATE POLICY "Editors manage taxonomy_terms" ON public.taxonomy_terms FOR ALL TO authenticated
  USING (
    has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role)
    OR has_role(auth.uid(),'content_manager'::app_role) OR has_role(auth.uid(),'editor'::app_role)
  ) WITH CHECK (
    has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role)
    OR has_role(auth.uid(),'content_manager'::app_role) OR has_role(auth.uid(),'editor'::app_role)
  );

GRANT SELECT ON public.content_taxonomies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_taxonomies TO authenticated;
GRANT ALL ON public.content_taxonomies TO service_role;
ALTER TABLE public.content_taxonomies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read content_taxonomies" ON public.content_taxonomies FOR SELECT USING (true);
CREATE POLICY "Editors manage content_taxonomies" ON public.content_taxonomies FOR ALL TO authenticated
  USING (
    has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role)
    OR has_role(auth.uid(),'content_manager'::app_role) OR has_role(auth.uid(),'editor'::app_role)
  ) WITH CHECK (
    has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role)
    OR has_role(auth.uid(),'content_manager'::app_role) OR has_role(auth.uid(),'editor'::app_role)
  );

-- 4) Redirect manager
CREATE TABLE IF NOT EXISTS public.redirects (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path   text NOT NULL UNIQUE,   -- e.g. /old-page
  to_path     text NOT NULL,          -- e.g. /new-page  or full URL
  status_code integer NOT NULL DEFAULT 301 CHECK (status_code IN (301,302,307,308)),
  is_active   boolean NOT NULL DEFAULT true,
  hits        bigint NOT NULL DEFAULT 0,
  last_hit_at timestamptz,
  note        text,
  created_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER redirects_updated_at BEFORE UPDATE ON public.redirects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT ON public.redirects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.redirects TO authenticated;
GRANT ALL ON public.redirects TO service_role;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read active redirects" ON public.redirects FOR SELECT USING (is_active);
CREATE POLICY "Admins manage redirects" ON public.redirects FOR ALL TO authenticated
  USING (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'content_manager'::app_role))
  WITH CHECK (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'content_manager'::app_role));

-- 5) Full-text search on content_items
ALTER TABLE public.content_items ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (
    to_tsvector('simple',
      coalesce(slug,'') || ' ' ||
      coalesce(jsonb_path_query_first(data, '$.title.en')::text, '') || ' ' ||
      coalesce(jsonb_path_query_first(data, '$.name.en')::text, '')  || ' ' ||
      coalesce(jsonb_path_query_first(data, '$.summary.en')::text, '') || ' ' ||
      coalesce(jsonb_path_query_first(data, '$.description.en')::text, '') || ' ' ||
      coalesce(jsonb_path_query_first(data, '$.body.en')::text, '')
    )
  ) STORED;
CREATE INDEX IF NOT EXISTS content_items_search_idx ON public.content_items USING GIN(search_tsv);

-- 6) Menu Builder foundation (empty until Phase D UI ships)
CREATE TABLE IF NOT EXISTS public.menus (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location   text NOT NULL UNIQUE,   -- header, footer, sidebar, mobile, mega
  label      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER menus_updated_at BEFORE UPDATE ON public.menus
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.menu_items (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id    uuid NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
  parent_id  uuid REFERENCES public.menu_items(id) ON DELETE CASCADE,
  label      jsonb NOT NULL DEFAULT '{}'::jsonb,   -- {en, dr, ps, ar, fr}
  url        text NOT NULL,
  icon       text,
  target     text NOT NULL DEFAULT '_self',
  position   integer NOT NULL DEFAULT 0,
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS menu_items_menu_idx ON public.menu_items(menu_id, parent_id, position);
CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

GRANT SELECT ON public.menus TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menus TO authenticated;
GRANT ALL ON public.menus TO service_role;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read menus" ON public.menus FOR SELECT USING (true);
CREATE POLICY "Admins manage menus" ON public.menus FOR ALL TO authenticated
  USING (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'content_manager'::app_role))
  WITH CHECK (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'content_manager'::app_role));

GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone read active menu items" ON public.menu_items FOR SELECT USING (is_active);
CREATE POLICY "Admins manage menu items" ON public.menu_items FOR ALL TO authenticated
  USING (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'content_manager'::app_role))
  WITH CHECK (has_role(auth.uid(),'super_admin'::app_role) OR has_role(auth.uid(),'admin'::app_role) OR has_role(auth.uid(),'content_manager'::app_role));

-- 7) Update scheduler to respect deleted_at
CREATE OR REPLACE FUNCTION public.apply_content_schedule()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.content_items
     SET status = 'published',
         published_at = COALESCE(published_at, publish_at, now()),
         updated_at = now()
   WHERE status = 'draft'
     AND deleted_at IS NULL
     AND publish_at IS NOT NULL
     AND publish_at <= now()
     AND (unpublish_at IS NULL OR unpublish_at > now());

  UPDATE public.content_items
     SET status = 'archived',
         updated_at = now()
   WHERE status = 'published'
     AND deleted_at IS NULL
     AND unpublish_at IS NOT NULL
     AND unpublish_at <= now();
END;
$function$;
