-- Fix overly permissive RLS policy for contact_messages
DROP POLICY IF EXISTS "Anyone can submit contact messages" ON public.contact_messages;

-- Create a more restrictive policy with validation
CREATE POLICY "Anyone can submit contact messages with valid data"
ON public.contact_messages
FOR INSERT
WITH CHECK (
  email IS NOT NULL 
  AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND name IS NOT NULL 
  AND length(name) > 0
  AND message IS NOT NULL
  AND length(message) > 0
);