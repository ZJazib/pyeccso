
-- Anyone (including anonymous applicants) can upload to cv-uploads
CREATE POLICY "Anyone can upload CVs"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'cv-uploads');

-- Admins / HR / project managers can read CVs
CREATE POLICY "Admins can view CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'cv-uploads' AND (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
    OR public.has_role(auth.uid(), 'hr_manager'::app_role)
    OR public.has_role(auth.uid(), 'project_manager'::app_role)
  )
);

-- Admins can delete
CREATE POLICY "Admins can delete CVs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cv-uploads' AND (
    public.has_role(auth.uid(), 'super_admin'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  )
);
