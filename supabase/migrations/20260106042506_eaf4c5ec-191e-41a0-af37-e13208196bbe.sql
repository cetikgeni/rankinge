-- Bulk AI Content Generator support

-- 1) Logs table
CREATE TABLE IF NOT EXISTS public.bulk_generation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid,
  run_id uuid NOT NULL DEFAULT gen_random_uuid(),
  step text NOT NULL,
  status text NOT NULL CHECK (status IN ('success','failure','info')),
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bulk_generation_logs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='bulk_generation_logs' AND policyname='Admins can view logs'
  ) THEN
    CREATE POLICY "Admins can view logs"
    ON public.bulk_generation_logs
    FOR SELECT
    USING (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname='public' AND tablename='bulk_generation_logs' AND policyname='Admins can insert logs'
  ) THEN
    CREATE POLICY "Admins can insert logs"
    ON public.bulk_generation_logs
    FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bulk_generation_logs_run_id_created_at
  ON public.bulk_generation_logs (run_id, created_at DESC);

-- 2) Mark generated content + store seed weights + image source
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS is_seed_content boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS image_source text;

ALTER TABLE public.items
  ADD COLUMN IF NOT EXISTS is_seed_content boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS seed_weight integer,
  ADD COLUMN IF NOT EXISTS image_source text;

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS is_seed_content boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS image_source text;