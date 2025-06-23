
-- Add review helpfulness tracking table
CREATE TABLE public.review_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.agent_reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Add review flags table for moderation
CREATE TABLE public.review_flags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.agent_reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Enable RLS on new tables
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_flags ENABLE ROW LEVEL SECURITY;

-- RLS policies for review_votes
CREATE POLICY "Anyone can view review votes" ON public.review_votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote on reviews" ON public.review_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes" ON public.review_votes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes" ON public.review_votes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for review_flags
CREATE POLICY "Authenticated users can flag reviews" ON public.review_flags
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own flags" ON public.review_flags
  FOR SELECT USING (auth.uid() = user_id);

-- Update the update_agent_stats function to include helpful_count
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
  ELSIF TG_TABLE_NAME = 'review_votes' THEN
    UPDATE public.agent_reviews
    SET helpful_count = (
      SELECT COUNT(*) FROM public.review_votes 
      WHERE review_id = COALESCE(NEW.review_id, OLD.review_id) AND is_helpful = true
    )
    WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for review votes
CREATE TRIGGER trigger_update_review_helpful_stats
  AFTER INSERT OR UPDATE OR DELETE ON public.review_votes
  FOR EACH ROW EXECUTE FUNCTION update_agent_stats();

-- Create indexes for performance
CREATE INDEX idx_review_votes_review_id ON public.review_votes(review_id);
CREATE INDEX idx_review_votes_user_id ON public.review_votes(user_id);
CREATE INDEX idx_review_flags_review_id ON public.review_flags(review_id);
CREATE INDEX idx_agent_reviews_rating ON public.agent_reviews(rating);
CREATE INDEX idx_agent_reviews_helpful_count ON public.agent_reviews(helpful_count DESC);
