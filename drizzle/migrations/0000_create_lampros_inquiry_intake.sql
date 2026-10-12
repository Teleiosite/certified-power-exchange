CREATE TABLE public.lampros_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_type text NOT NULL CHECK (inquiry_type IN ('quote', 'audit', 'loan', 'trade-in')),
  name text NOT NULL,
  organization text NOT NULL DEFAULT '',
  email text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  energy_load_kw numeric(12,2) NOT NULL CHECK (energy_load_kw > 0),
  monthly_power_cost numeric(14,2),
  outage_frequency text,
  sector text,
  details text NOT NULL DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  documents jsonb NOT NULL DEFAULT '[]'::jsonb,
  ip_fingerprint text NOT NULL CHECK (ip_fingerprint ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.lampros_inquiries TO service_role;
ALTER TABLE public.lampros_inquiries ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.lampros_submission_limits (
  ip_fingerprint text PRIMARY KEY CHECK (ip_fingerprint ~ '^[a-f0-9]{64}$'),
  window_started_at timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 1 CHECK (request_count > 0)
);
GRANT ALL ON public.lampros_submission_limits TO service_role;
ALTER TABLE public.lampros_submission_limits ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.claim_lampros_submission_slot(p_fingerprint text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claimed_count integer;
BEGIN
  IF p_fingerprint !~ '^[a-f0-9]{64}$' THEN
    RETURN false;
  END IF;

  INSERT INTO public.lampros_submission_limits (ip_fingerprint, window_started_at, request_count)
  VALUES (p_fingerprint, now(), 1)
  ON CONFLICT (ip_fingerprint) DO UPDATE
  SET window_started_at = CASE
        WHEN public.lampros_submission_limits.window_started_at <= now() - interval '10 minutes' THEN now()
        ELSE public.lampros_submission_limits.window_started_at
      END,
      request_count = CASE
        WHEN public.lampros_submission_limits.window_started_at <= now() - interval '10 minutes' THEN 1
        ELSE public.lampros_submission_limits.request_count + 1
      END
  RETURNING request_count INTO claimed_count;

  RETURN claimed_count <= 8;
END;
$$;
REVOKE ALL ON FUNCTION public.claim_lampros_submission_slot(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_lampros_submission_slot(text) TO service_role;