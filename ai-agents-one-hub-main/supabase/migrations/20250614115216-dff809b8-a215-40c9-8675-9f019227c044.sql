
-- Create user favorites table
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  agent_id UUID REFERENCES public.ai_agents(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, agent_id)
);

-- Enable RLS on user_favorites
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_favorites
CREATE POLICY "Users can view their own favorites" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own favorites" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_agent_id ON public.user_favorites(agent_id);

-- Update ai_agents table to track submission analytics
ALTER TABLE public.ai_agents 
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;

-- Create function to increment click count
CREATE OR REPLACE FUNCTION increment_agent_clicks(agent_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.ai_agents 
  SET click_count = click_count + 1 
  WHERE id = agent_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
