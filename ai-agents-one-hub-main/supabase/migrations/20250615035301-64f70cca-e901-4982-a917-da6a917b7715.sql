
-- Add homepage_image_url column to the ai_agents table
ALTER TABLE public.ai_agents 
ADD COLUMN homepage_image_url TEXT;

-- Add a comment to describe the column
COMMENT ON COLUMN public.ai_agents.homepage_image_url IS 'URL of the homepage screenshot or main image for the agent';
