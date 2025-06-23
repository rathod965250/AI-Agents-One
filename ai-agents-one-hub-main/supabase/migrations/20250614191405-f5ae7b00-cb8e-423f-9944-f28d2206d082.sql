
-- Remove 'subscription' from pricing_type enum and update existing data
-- First, update any existing agents that use 'subscription' to use 'paid' instead
UPDATE public.ai_agents 
SET pricing_type = 'paid' 
WHERE pricing_type = 'subscription';

-- Create a new enum without 'subscription'
CREATE TYPE public.pricing_type_new AS ENUM ('free', 'freemium', 'paid');

-- Update the table to use the new enum
ALTER TABLE public.ai_agents 
ALTER COLUMN pricing_type TYPE pricing_type_new 
USING pricing_type::text::pricing_type_new;

-- Drop the old enum and rename the new one
DROP TYPE public.pricing_type;
ALTER TYPE public.pricing_type_new RENAME TO pricing_type;

-- Update agent_submissions table as well
UPDATE public.agent_submissions 
SET pricing_type = 'paid' 
WHERE pricing_type = 'subscription';

-- Since agent_submissions.pricing_type is text, we just need to ensure no 'subscription' values exist
-- The enum constraint will be enforced when data is moved to ai_agents table
