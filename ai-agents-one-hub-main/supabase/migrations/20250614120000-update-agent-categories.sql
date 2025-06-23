
-- Add new categories to the agent_category enum
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'ai_agent_builders';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'coding';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'personal_assistant';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'general_purpose';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'digital_workers';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'design';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'sales';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'voice_ai';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'business_intelligence';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'hr';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'science';
ALTER TYPE public.agent_category ADD VALUE IF NOT EXISTS 'other';

-- Note: The following categories already exist and will be mapped:
-- 'productivity' (already exists)
-- 'finance' (already exists) 
-- 'research' (already exists)
-- 'data_analysis' (already exists)
-- 'marketing' (already exists)
-- 'content_creation' (already exists)
-- 'customer_support' (maps to existing 'customer_support')
-- 'voice_ai' (maps to existing 'voice_ai')
