
-- Create user_status enum type
CREATE TYPE public.user_status AS ENUM ('active', 'suspended', 'banned');

-- Add status to profiles table
ALTER TABLE public.profiles
ADD COLUMN status public.user_status NOT NULL DEFAULT 'active';

-- Create review_status enum type
CREATE TYPE public.review_status AS ENUM ('pending', 'approved', 'rejected');

-- Add status and moderation_reason to agent_reviews table
ALTER TABLE public.agent_reviews
ADD COLUMN status public.review_status NOT NULL DEFAULT 'pending',
ADD COLUMN moderation_reason TEXT;
