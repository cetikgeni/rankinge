-- Fix SECRETS_EXPOSED: Restrict app_settings SELECT policy to hide sensitive keys from non-admins

-- Drop the existing permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view app settings" ON public.app_settings;

-- Create policy that allows everyone to view only safe settings (not ai_config)
CREATE POLICY "Users can view safe settings"
ON public.app_settings
FOR SELECT
USING (key != 'ai_config');

-- Create policy that allows admins to view all settings including ai_config
CREATE POLICY "Admins can view all settings"
ON public.app_settings
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));