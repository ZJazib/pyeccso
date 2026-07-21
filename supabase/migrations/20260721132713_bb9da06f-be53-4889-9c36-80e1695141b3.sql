
DROP POLICY IF EXISTS "Anyone can upload CVs" ON storage.objects;

CREATE POLICY "Public can upload CVs to applications folder"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (
  bucket_id = 'cv-uploads'
  AND (storage.foldername(name))[1] = 'applications'
  AND length(name) < 300
  AND lower(name) ~ '\.(pdf|doc|docx|png|jpg|jpeg)$'
);
