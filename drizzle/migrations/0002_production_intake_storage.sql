INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lampros-assessment-files',
  'lampros-assessment-files',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    public = false,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Anonymous assessment file uploads only" ON storage.objects;
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

CREATE POLICY "Anonymous cleanup of assessment uploads"
ON storage.objects
FOR DELETE
TO anon
USING (
  bucket_id = 'lampros-assessment-files'
  AND name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|png|jpe?g|webp)$'
);

ALTER TABLE public.lampros_inquiries
  ADD COLUMN IF NOT EXISTS notification_status text NOT NULL DEFAULT 'not_configured'
  CHECK (notification_status IN ('not_configured', 'pending', 'sent', 'failed'));

ALTER TABLE public.lampros_inquiries
  ADD COLUMN IF NOT EXISTS notification_sent_at timestamptz;

CREATE INDEX IF NOT EXISTS lampros_inquiries_notification_status_idx
  ON public.lampros_inquiries (notification_status, created_at)
  WHERE notification_status IN ('pending', 'failed');
