-- Create category_groups table for managing category groups
CREATE TABLE public.category_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.category_groups ENABLE ROW LEVEL SECURITY;

-- Public can view active groups
CREATE POLICY "Anyone can view active category groups"
ON public.category_groups
FOR SELECT
USING (is_active = true);

-- Admins can manage groups
CREATE POLICY "Admins can manage category groups"
ON public.category_groups
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create advertisements table
CREATE TABLE public.advertisements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  link_url TEXT,
  placement VARCHAR(50) NOT NULL DEFAULT 'sidebar', -- sidebar, banner, sponsored
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  priority INT DEFAULT 0,
  clicks INT DEFAULT 0,
  impressions INT DEFAULT 0,
  advertiser_name VARCHAR(255),
  advertiser_email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Public can view active ads
CREATE POLICY "Anyone can view active advertisements"
ON public.advertisements
FOR SELECT
USING (
  is_active = true 
  AND (start_date IS NULL OR start_date <= now())
  AND (end_date IS NULL OR end_date >= now())
);

-- Admins can manage ads
CREATE POLICY "Admins can manage advertisements"
ON public.advertisements
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create ad_requests table for user ad submissions
CREATE TABLE public.ad_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  plan VARCHAR(50), -- basic, premium, enterprise
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ad_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert ad requests
CREATE POLICY "Anyone can submit ad requests"
ON public.ad_requests
FOR INSERT
WITH CHECK (true);

-- Admins can view and manage ad requests
CREATE POLICY "Admins can manage ad requests"
ON public.ad_requests
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Insert existing category groups from categories
INSERT INTO public.category_groups (name, display_order)
SELECT DISTINCT category_group, ROW_NUMBER() OVER (ORDER BY category_group)
FROM public.categories
WHERE category_group IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Add trigger for updated_at
CREATE TRIGGER update_category_groups_updated_at
BEFORE UPDATE ON public.category_groups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advertisements_updated_at
BEFORE UPDATE ON public.advertisements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ad_requests_updated_at
BEFORE UPDATE ON public.ad_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();