DROP POLICY IF EXISTS "Visitor: anon insert" ON public.visitor_events;
CREATE POLICY "Visitor: anon insert" ON public.visitor_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    path IS NOT NULL
    AND length(path) BETWEEN 1 AND 2048
    AND (referrer IS NULL OR length(referrer) <= 2048)
    AND (user_agent IS NULL OR length(user_agent) <= 1024)
    AND (session_id IS NULL OR length(session_id) <= 256)
    AND (country IS NULL OR length(country) <= 8)
    AND (language IS NULL OR length(language) <= 16)
  );