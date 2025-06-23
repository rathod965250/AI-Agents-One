-- First, ensure the agent_status enum type exists
-- This is idempotent and will not error if the type already exists.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'agent_status') THEN
        CREATE TYPE public.agent_status AS ENUM (
            'pending',
            'approved',
            'rejected',
            'featured'
        );
    END IF;
END$$;

-- Add the status column to the agent_submissions table
ALTER TABLE public.agent_submissions
ADD COLUMN status public.agent_status NOT NULL DEFAULT 'pending';

-- Add an index on the new status column for faster querying
CREATE INDEX IF NOT EXISTS idx_agent_submissions_status ON public.agent_submissions(status);

-- Optionally, you might want to update existing non-draft submissions to 'pending'
-- This handles any submissions that were made before the status column was added.
UPDATE public.agent_submissions
SET status = 'pending'
WHERE is_draft = false AND status IS NULL; 