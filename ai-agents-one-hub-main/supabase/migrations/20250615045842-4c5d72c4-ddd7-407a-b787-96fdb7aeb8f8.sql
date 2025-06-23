
-- Add affiliate_url column to ai_agents table to store admin-managed affiliate links
ALTER TABLE public.ai_agents 
ADD COLUMN IF NOT EXISTS affiliate_url TEXT;

-- Create a table to track affiliate link changes for audit purposes
CREATE TABLE IF NOT EXISTS public.affiliate_link_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  affiliate_url TEXT,
  changed_by UUID NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT
);

-- Add Row Level Security (RLS) to the affiliate_link_changes table
ALTER TABLE public.affiliate_link_changes ENABLE ROW LEVEL SECURITY;

-- Create policy that allows only admins to view affiliate link changes
CREATE POLICY "Only admins can view affiliate link changes" 
  ON public.affiliate_link_changes 
  FOR SELECT 
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Create policy that allows only admins to insert affiliate link changes
CREATE POLICY "Only admins can create affiliate link changes" 
  ON public.affiliate_link_changes 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));
