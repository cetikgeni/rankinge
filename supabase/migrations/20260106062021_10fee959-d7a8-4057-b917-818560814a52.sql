-- Remove the permissive INSERT policy that allows anyone to insert
-- Ranking snapshots should only be created by SECURITY DEFINER trigger functions
DROP POLICY IF EXISTS "System can insert ranking snapshots" ON public.ranking_snapshots;

-- Note: The create_ranking_snapshot() and trigger_ranking_snapshot() functions
-- use SECURITY DEFINER which bypasses RLS, so they can still insert records.
-- No direct client INSERT should be allowed.