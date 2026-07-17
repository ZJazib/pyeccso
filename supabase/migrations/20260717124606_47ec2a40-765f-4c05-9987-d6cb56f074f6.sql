
-- Tighten public INSERT policies to prevent tampering with internal fields

-- applications: only allow inserting rows tied to self (or anon) with default state
DROP POLICY IF EXISTS "Anyone can submit an application" ON public.applications;
CREATE POLICY "Anyone can submit an application"
  ON public.applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (applicant_user_id IS NULL OR applicant_user_id = auth.uid())
    AND status = 'pending'::application_status
    AND reviewed_at IS NULL
    AND reviewed_by IS NULL
    AND notes IS NULL
    AND deleted_at IS NULL
  );

-- contact_messages: prevent setting handled_*/status via public insert
DROP POLICY IF EXISTS "Anyone can send a message" ON public.contact_messages;
CREATE POLICY "Anyone can send a message"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    status = 'new'::message_status
    AND handled_at IS NULL
    AND handled_by IS NULL
    AND deleted_at IS NULL
  );

-- Lock down SECURITY DEFINER functions: revoke from public/anon
-- Keep EXECUTE for authenticated where RLS policies rely on them
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.apply_content_schedule() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION public.apply_content_schedule() TO service_role;
