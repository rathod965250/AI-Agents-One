-- Add use_cases column to the ai_agents table
ALTER TABLE public.ai_agents 
ADD COLUMN use_cases TEXT[] DEFAULT '{}';

-- Add a comment to describe the column
COMMENT ON COLUMN public.ai_agents.use_cases IS 'Array of use cases for the AI agent'; 