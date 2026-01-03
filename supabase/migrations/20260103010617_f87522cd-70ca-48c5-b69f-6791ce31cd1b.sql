-- Add parent_id column to categories for hierarchical structure
ALTER TABLE public.categories 
ADD COLUMN parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL;

-- Create index for faster parent-child queries
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);

-- Create app_settings table for global settings
CREATE TABLE public.app_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    key text UNIQUE NOT NULL,
    value jsonb NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on app_settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read app settings
CREATE POLICY "Anyone can view app settings"
ON public.app_settings
FOR SELECT
USING (true);

-- Only admins can manage app settings
CREATE POLICY "Admins can manage app settings"
ON public.app_settings
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at on app_settings
CREATE TRIGGER update_app_settings_updated_at
BEFORE UPDATE ON public.app_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default vote display setting
INSERT INTO public.app_settings (key, value)
VALUES ('vote_display', '{"mode": "percentage"}');

-- Add vote display override column to categories (for category-specific settings)
ALTER TABLE public.categories
ADD COLUMN vote_display_mode text DEFAULT 'default' CHECK (vote_display_mode IN ('default', 'percentage', 'count', 'both'));

-- Create trigger for vote count updates on items (if not exists)
DROP TRIGGER IF EXISTS trigger_update_vote_count ON public.votes;
CREATE TRIGGER trigger_update_vote_count
AFTER INSERT OR DELETE OR UPDATE ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.update_vote_count();