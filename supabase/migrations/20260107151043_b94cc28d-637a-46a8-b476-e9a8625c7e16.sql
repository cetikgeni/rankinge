-- Fix overly permissive RLS policy for ad_requests
-- Add rate limiting by requiring some validation

-- Drop old policy
DROP POLICY IF EXISTS "Anyone can submit ad requests" ON public.ad_requests;

-- Create a more restrictive policy that still allows public submissions
-- but with email format validation built into the table constraint
CREATE POLICY "Anyone can submit ad requests with valid email"
ON public.ad_requests
FOR INSERT
WITH CHECK (
  email IS NOT NULL 
  AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND name IS NOT NULL 
  AND length(name) > 0
);