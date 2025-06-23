
-- Create enum types for better data consistency
CREATE TYPE public.agent_status AS ENUM ('pending', 'approved', 'rejected', 'featured');
CREATE TYPE public.pricing_type AS ENUM ('free', 'freemium', 'paid', 'subscription');
CREATE TYPE public.agent_category AS ENUM (
  'conversational_ai', 'image_generation', 'content_creation', 
  'data_analysis', 'code_assistant', 'voice_ai', 'automation',
  'research', 'translation', 'customer_support', 'marketing',
  'productivity', 'education', 'healthcare', 'finance', 'gaming'
);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  twitter_handle TEXT,
  github_handle TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI agents table
CREATE TABLE public.ai_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  tagline TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT NOT NULL,
  category agent_category NOT NULL,
  pricing_type pricing_type NOT NULL,
  pricing_details TEXT,
  features TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  status agent_status DEFAULT 'pending',
  submitted_by UUID REFERENCES public.profiles(id) NOT NULL,
  total_upvotes INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating DECIMAL(2,1) DEFAULT 0.0,
  view_count INTEGER DEFAULT 0,
  launch_date DATE,
  featured_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create upvotes table for Product Hunt-style voting
CREATE TABLE public.agent_upvotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agent_id, user_id)
);

-- Create reviews table for G2-style reviews
CREATE TABLE public.agent_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  pros TEXT[] DEFAULT '{}',
  cons TEXT[] DEFAULT '{}',
  use_case TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(agent_id, user_id)
);

-- Create comments table for discussions
CREATE TABLE public.agent_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.agent_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for ai_agents
CREATE POLICY "Approved agents are viewable by everyone" ON public.ai_agents
  FOR SELECT USING (status = 'approved' OR status = 'featured');

CREATE POLICY "Authenticated users can submit agents" ON public.ai_agents
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their own agents" ON public.ai_agents
  FOR UPDATE USING (auth.uid() = submitted_by);

-- RLS Policies for upvotes
CREATE POLICY "Anyone can view upvotes" ON public.agent_upvotes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can upvote" ON public.agent_upvotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own upvotes" ON public.agent_upvotes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.agent_reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.agent_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON public.agent_reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments" ON public.agent_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON public.agent_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.agent_comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_ai_agents_category ON public.ai_agents(category);
CREATE INDEX idx_ai_agents_status ON public.ai_agents(status);
CREATE INDEX idx_ai_agents_total_upvotes ON public.ai_agents(total_upvotes DESC);
CREATE INDEX idx_ai_agents_average_rating ON public.ai_agents(average_rating DESC);
CREATE INDEX idx_ai_agents_created_at ON public.ai_agents(created_at DESC);
CREATE INDEX idx_ai_agents_slug ON public.ai_agents(slug);
CREATE INDEX idx_agent_upvotes_agent_id ON public.agent_upvotes(agent_id);
CREATE INDEX idx_agent_reviews_agent_id ON public.agent_reviews(agent_id);
CREATE INDEX idx_agent_comments_agent_id ON public.agent_comments(agent_id);

-- Create function to update agent stats
CREATE OR REPLACE FUNCTION update_agent_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'agent_upvotes' THEN
    UPDATE public.ai_agents 
    SET total_upvotes = (
      SELECT COUNT(*) FROM public.agent_upvotes 
      WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id)
    )
    WHERE id = COALESCE(NEW.agent_id, OLD.agent_id);
  ELSIF TG_TABLE_NAME = 'agent_reviews' THEN
    UPDATE public.ai_agents 
    SET 
      total_reviews = (
        SELECT COUNT(*) FROM public.agent_reviews 
        WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id)
      ),
      average_rating = (
        SELECT ROUND(AVG(rating), 1) FROM public.agent_reviews 
        WHERE agent_id = COALESCE(NEW.agent_id, OLD.agent_id)
      )
    WHERE id = COALESCE(NEW.agent_id, OLD.agent_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update stats
CREATE TRIGGER trigger_update_upvote_stats
  AFTER INSERT OR DELETE ON public.agent_upvotes
  FOR EACH ROW EXECUTE FUNCTION update_agent_stats();

CREATE TRIGGER trigger_update_review_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.agent_reviews
  FOR EACH ROW EXECUTE FUNCTION update_agent_stats();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
