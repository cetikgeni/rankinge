-- Create ranking_snapshots table for tracking ranking history
CREATE TABLE public.ranking_snapshots (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  rank_position integer NOT NULL,
  vote_count integer NOT NULL DEFAULT 0,
  snapshot_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX idx_ranking_snapshots_category ON public.ranking_snapshots(category_id, snapshot_at DESC);
CREATE INDEX idx_ranking_snapshots_item ON public.ranking_snapshots(item_id, snapshot_at DESC);

-- Enable RLS
ALTER TABLE public.ranking_snapshots ENABLE ROW LEVEL SECURITY;

-- Anyone can view ranking history
CREATE POLICY "Anyone can view ranking snapshots" 
ON public.ranking_snapshots 
FOR SELECT 
USING (true);

-- Only system can insert (via trigger/function)
CREATE POLICY "System can insert ranking snapshots" 
ON public.ranking_snapshots 
FOR INSERT 
WITH CHECK (true);

-- Add multilingual fields to blog_posts
ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS title_id text,
ADD COLUMN IF NOT EXISTS content_id text,
ADD COLUMN IF NOT EXISTS excerpt_id text,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text,
ADD COLUMN IF NOT EXISTS og_title text,
ADD COLUMN IF NOT EXISTS og_description text,
ADD COLUMN IF NOT EXISTS category text;

-- Enable realtime for items table (for live ranking)
ALTER PUBLICATION supabase_realtime ADD TABLE public.items;

-- Function to create ranking snapshot
CREATE OR REPLACE FUNCTION public.create_ranking_snapshot(p_category_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item RECORD;
  v_rank integer := 0;
BEGIN
  FOR v_item IN 
    SELECT id, vote_count 
    FROM public.items 
    WHERE category_id = p_category_id 
    ORDER BY vote_count DESC
  LOOP
    v_rank := v_rank + 1;
    INSERT INTO public.ranking_snapshots (category_id, item_id, rank_position, vote_count)
    VALUES (p_category_id, v_item.id, v_rank, v_item.vote_count);
  END LOOP;
END;
$$;

-- Trigger function to create snapshot on vote
CREATE OR REPLACE FUNCTION public.trigger_ranking_snapshot()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_category_id uuid;
  v_last_snapshot timestamp with time zone;
BEGIN
  -- Get category_id from the vote
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    v_category_id := NEW.category_id;
  ELSE
    v_category_id := OLD.category_id;
  END IF;
  
  -- Check if we have a recent snapshot (within 5 minutes)
  SELECT MAX(snapshot_at) INTO v_last_snapshot
  FROM public.ranking_snapshots
  WHERE category_id = v_category_id;
  
  -- Only create snapshot if more than 5 minutes since last one
  IF v_last_snapshot IS NULL OR v_last_snapshot < now() - interval '5 minutes' THEN
    PERFORM public.create_ranking_snapshot(v_category_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on votes table
DROP TRIGGER IF EXISTS on_vote_create_snapshot ON public.votes;
CREATE TRIGGER on_vote_create_snapshot
AFTER INSERT OR UPDATE OR DELETE ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.trigger_ranking_snapshot();