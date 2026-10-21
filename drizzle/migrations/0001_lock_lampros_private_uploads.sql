CREATE POLICY "Anonymous assessment file uploads only"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'lampros-assessment-files'
  AND name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|png|jpe?g|webp)$'
  AND (
    (lower(name) ~ '\.pdf$' AND lower(coalesce(metadata->>'mimetype', '')) = 'application/pdf')
    OR (lower(name) ~ '\.png$' AND lower(coalesce(metadata->>'mimetype', '')) = 'image/png')
    OR (lower(name) ~ '\.jpe?g$' AND lower(coalesce(metadata->>'mimetype', '')) = 'image/jpeg')
    OR (lower(name) ~ '\.webp$' AND lower(coalesce(metadata->>'mimetype', '')) = 'image/webp')
  )
);