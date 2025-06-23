
-- Add new categories to the agent_category enum
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'ai_agent_builders';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'coding';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'personal_assistant';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'general_purpose';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'digital_workers';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'design';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'sales';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'business_intelligence';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'hr';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'science';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'other';

-- Verify the enum values were added by checking the enum
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'agent_category') ORDER BY enumlabel;
