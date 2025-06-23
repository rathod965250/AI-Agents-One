
-- Add missing columns to agent_submissions table for proper form functionality
ALTER TABLE public.agent_submissions 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS requires_account BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_free_trial BOOLEAN DEFAULT false;

-- Ensure the table has all necessary columns for the submission form
-- These columns should match what the form expects to submit
