
ALTER TABLE public.agent_submissions
  DROP COLUMN IF EXISTS tagline,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS features,
  DROP COLUMN IF EXISTS tags,
  DROP COLUMN IF EXISTS logo_url,
  DROP COLUMN IF EXISTS screenshots,
  DROP COLUMN IF EXISTS pricing_details;

ALTER TABLE public.agent_submissions
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS repository_url TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS twitter_url TEXT,
  ADD COLUMN IF NOT EXISTS additional_resources_url TEXT;

ALTER TABLE public.ai_agents
  DROP COLUMN IF EXISTS tagline,
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS features,
  DROP COLUMN IF EXISTS tags,
  DROP COLUMN IF EXISTS logo_url,
  DROP COLUMN IF EXISTS pricing_details;

ALTER TABLE public.ai_agents
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS repository_url TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS twitter_url TEXT,
  ADD COLUMN IF NOT EXISTS additional_resources_url TEXT;
