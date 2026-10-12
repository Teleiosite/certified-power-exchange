CREATE POLICY "Anonymous assessment file uploads only"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'lampros-assessment-files'
  AND name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|png|jpe?g|webp)$'
  AND lower(coalesce(metadata->>'mimetype', '')) IN ('application/pdf', 'image/png', 'image/jpeg', 'image/webp')
);