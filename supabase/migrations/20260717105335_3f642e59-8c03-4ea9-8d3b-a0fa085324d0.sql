
CREATE POLICY "Media bucket: authed read"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'media');

CREATE POLICY "Media bucket: staff upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media' AND (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(), 'media_manager')
    OR public.has_role(auth.uid(), 'content_manager')
    OR public.has_role(auth.uid(), 'editor')
  )
);

CREATE POLICY "Media bucket: staff update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media' AND (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(), 'media_manager')
    OR public.has_role(auth.uid(), 'content_manager')
  )
);

CREATE POLICY "Media bucket: staff delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'media' AND (
    public.is_admin(auth.uid())
    OR public.has_role(auth.uid(), 'media_manager')
  )
);
