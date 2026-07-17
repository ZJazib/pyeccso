
DROP POLICY IF EXISTS "Media: public read" ON public.media_assets;
CREATE POLICY "Media: staff read" ON public.media_assets
  FOR SELECT TO authenticated
  USING (
    is_admin(auth.uid())
    OR has_role(auth.uid(), 'media_manager'::app_role)
    OR has_role(auth.uid(), 'content_manager'::app_role)
    OR has_role(auth.uid(), 'editor'::app_role)
  );

DROP POLICY IF EXISTS "Media bucket: authed read" ON storage.objects;
CREATE POLICY "Media bucket: staff read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'media'
    AND (
      is_admin(auth.uid())
      OR has_role(auth.uid(), 'media_manager'::app_role)
      OR has_role(auth.uid(), 'content_manager'::app_role)
      OR has_role(auth.uid(), 'editor'::app_role)
    )
  );
