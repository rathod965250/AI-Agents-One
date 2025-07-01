-- Add logo_url column to ai_agents table for storing agent logos from Supabase storage
ALTER TABLE public.ai_agents 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add comment to explain the column purpose
COMMENT ON COLUMN public.ai_agents.logo_url IS 'URL to the agent logo stored in Supabase storage bucket "agent-logos"';

-- Create an index on logo_url for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_agents_logo_url ON public.ai_agents(logo_url);

-- Update RLS policies to allow access to logo_url
-- This ensures the logo_url is accessible in public queries
ALTER POLICY "Enable read access for all users" ON public.ai_agents 
USING (true);

-- Example of how to use this column:
-- UPDATE ai_agents SET logo_url = 'https://uilnynmclpohscpsequg.supabase.co/storage/v1/object/public/agent-logos/agent-name-logo.png' 
-- WHERE slug = 'agent-slug'; 