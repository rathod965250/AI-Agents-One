
-- Create a table for site settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the default support email setting
INSERT INTO public.site_settings (key, value, description) 
VALUES ('support_email', 'hello@aiagentsone.in', 'Support email address displayed in footer');

-- Add Row Level Security (RLS) to ensure only admins can modify settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows everyone to read site settings
CREATE POLICY "Anyone can view site settings" 
  ON public.site_settings 
  FOR SELECT 
  TO public
  USING (true);

-- Create policy that allows only admins to insert/update/delete site settings
CREATE POLICY "Only admins can modify site settings" 
  ON public.site_settings 
  FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
