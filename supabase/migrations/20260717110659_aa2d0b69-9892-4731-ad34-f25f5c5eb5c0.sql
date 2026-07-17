
-- =============================================
-- CONTENT ITEMS: universal CMS table
-- =============================================
CREATE TYPE public.content_type AS ENUM (
  'page','program','project','news','event','team','partner',
  'testimonial','publication','career','donation','media','learn'
);

CREATE TYPE public.content_status AS ENUM ('draft','published','archived');

CREATE TABLE public.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type public.content_type NOT NULL,
  slug text,
  status public.content_status NOT NULL DEFAULT 'draft',
  position integer NOT NULL DEFAULT 0,
  cover_url text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (type, slug)
);

CREATE INDEX content_items_type_status_idx ON public.content_items (type, status, position);
CREATE INDEX content_items_published_idx ON public.content_items (type, published_at DESC) WHERE status = 'published';

GRANT SELECT ON public.content_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_items TO authenticated;
GRANT ALL ON public.content_items TO service_role;

ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;

-- Public sees published only
CREATE POLICY "Public can view published content"
  ON public.content_items FOR SELECT
  USING (status = 'published');

-- Editors/admins see everything
CREATE POLICY "Editors can view all content"
  ON public.content_items FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'content_manager') OR
    public.has_role(auth.uid(), 'editor') OR
    public.has_role(auth.uid(), 'communications') OR
    public.has_role(auth.uid(), 'media_manager') OR
    public.has_role(auth.uid(), 'hr_manager') OR
    public.has_role(auth.uid(), 'finance_manager') OR
    public.has_role(auth.uid(), 'project_manager') OR
    public.has_role(auth.uid(), 'viewer')
  );

CREATE POLICY "Editors can insert content"
  ON public.content_items FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'content_manager') OR
    public.has_role(auth.uid(), 'editor') OR
    public.has_role(auth.uid(), 'communications') OR
    public.has_role(auth.uid(), 'media_manager') OR
    public.has_role(auth.uid(), 'hr_manager') OR
    public.has_role(auth.uid(), 'project_manager')
  );

CREATE POLICY "Editors can update content"
  ON public.content_items FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'content_manager') OR
    public.has_role(auth.uid(), 'editor') OR
    public.has_role(auth.uid(), 'communications') OR
    public.has_role(auth.uid(), 'media_manager') OR
    public.has_role(auth.uid(), 'hr_manager') OR
    public.has_role(auth.uid(), 'project_manager')
  );

CREATE POLICY "Admins can delete content"
  ON public.content_items FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'content_manager')
  );

CREATE TRIGGER content_items_updated_at
  BEFORE UPDATE ON public.content_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- CONTACT MESSAGES: inbound form submissions
-- =============================================
CREATE TYPE public.message_status AS ENUM ('new','read','replied','archived','spam');

CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status public.message_status NOT NULL DEFAULT 'new',
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  handled_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  handled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX contact_messages_status_idx ON public.contact_messages (status, created_at DESC);

GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send a message"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'communications')
  );

CREATE POLICY "Admins can update messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'communications')
  );

CREATE POLICY "Admins can delete messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================
-- APPLICATIONS: training/job applications
-- =============================================
CREATE TYPE public.application_kind AS ENUM ('training','job','volunteer','internship');
CREATE TYPE public.application_status AS ENUM ('pending','reviewing','accepted','rejected','waitlist');

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.application_kind NOT NULL,
  reference_id uuid REFERENCES public.content_items(id) ON DELETE SET NULL,
  applicant_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  province text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.application_status NOT NULL DEFAULT 'pending',
  notes text,
  reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX applications_status_idx ON public.applications (kind, status, created_at DESC);
CREATE INDEX applications_ref_idx ON public.applications (reference_id);

GRANT INSERT ON public.applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
  ON public.applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Applicant can view own"
  ON public.applications FOR SELECT
  TO authenticated
  USING (applicant_user_id = auth.uid());

CREATE POLICY "Admins can view applications"
  ON public.applications FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr_manager') OR
    public.has_role(auth.uid(), 'project_manager')
  );

CREATE POLICY "Admins can update applications"
  ON public.applications FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr_manager') OR
    public.has_role(auth.uid(), 'project_manager')
  );

CREATE POLICY "Admins can delete applications"
  ON public.applications FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
