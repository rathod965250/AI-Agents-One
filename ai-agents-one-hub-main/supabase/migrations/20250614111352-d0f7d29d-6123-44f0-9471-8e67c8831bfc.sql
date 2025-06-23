
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

-- Note: The following categories already exist in the enum:
-- 'productivity', 'finance', 'research', 'data_analysis', 'marketing', 
-- 'content_creation', 'customer_support', 'voice_ai', 'conversational_ai',
-- 'image_generation', 'automation', 'translation', 'education', 'healthcare', 'gaming'
