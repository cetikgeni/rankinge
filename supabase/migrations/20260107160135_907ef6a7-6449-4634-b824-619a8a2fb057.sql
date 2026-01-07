-- Add slug column to categories table for SEO-friendly URLs
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- Function to generate slug from name
CREATE OR REPLACE FUNCTION public.generate_category_slug(name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    RETURN lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));
END;
$$;

-- Populate slugs for existing categories
UPDATE public.categories 
SET slug = public.generate_category_slug(name) || '-' || LEFT(id::TEXT, 8)
WHERE slug IS NULL;

-- Trigger to auto-generate slug on insert
CREATE OR REPLACE FUNCTION public.set_category_slug()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := public.generate_category_slug(NEW.name) || '-' || LEFT(NEW.id::TEXT, 8);
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_set_category_slug ON public.categories;
CREATE TRIGGER trigger_set_category_slug
BEFORE INSERT ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.set_category_slug();