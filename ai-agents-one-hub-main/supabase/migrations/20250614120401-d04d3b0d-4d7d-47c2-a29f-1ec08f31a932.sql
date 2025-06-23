
-- Create agent_submissions table for draft saving
CREATE TABLE public.agent_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT,
  slug TEXT,
  tagline TEXT,
  description TEXT,
  website_url TEXT,
  category TEXT,
  pricing_type TEXT,
  pricing_details TEXT,
  features TEXT[],
  tags TEXT[],
  logo_url TEXT,
  screenshots TEXT[],
  is_draft BOOLEAN DEFAULT true,
  submitted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on agent_submissions
ALTER TABLE public.agent_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for agent_submissions
CREATE POLICY "Users can view their own submissions" ON public.agent_submissions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own submissions" ON public.agent_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" ON public.agent_submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions" ON public.agent_submissions
  FOR DELETE USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_agent_submissions_user_id ON public.agent_submissions(user_id);
CREATE INDEX idx_agent_submissions_is_draft ON public.agent_submissions(is_draft);

-- Create storage bucket for agent assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('agent-assets', 'agent-assets', true);

-- Create storage policies for agent assets
CREATE POLICY "Allow authenticated users to upload agent assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'agent-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to agent assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'agent-assets');

CREATE POLICY "Allow users to update their own agent assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'agent-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own agent assets" ON storage.objects
  FOR DELETE USING (bucket_id = 'agent-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
