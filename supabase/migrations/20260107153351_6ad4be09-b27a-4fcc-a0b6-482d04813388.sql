-- Harden function execution privileges
-- Ensure SECURITY DEFINER helper cannot be called anonymously

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Optional: allow service_role if needed for backend jobs
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO service_role;
