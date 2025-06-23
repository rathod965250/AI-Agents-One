
-- Create a categories table to replace the enum approach
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  agent_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert all the categories from your frontend components
INSERT INTO public.categories (name, slug, display_name, description, icon_name) VALUES
  ('ai_agent_builders', 'ai-agent-builders', 'AI Agent Builders', 'Tools for building and creating AI agents', 'Bot'),
  ('coding', 'coding', 'Coding', 'Programming and development assistance', 'Code'),
  ('productivity', 'productivity', 'Productivity', 'Tools to enhance workflow and efficiency', 'Wrench'),
  ('personal_assistant', 'personal-assistant', 'Personal Assistant', 'AI assistants for personal tasks', 'User'),
  ('finance', 'finance', 'Finance', 'Financial analysis and management tools', 'DollarSign'),
  ('general_purpose', 'general-purpose', 'General Purpose', 'Multi-purpose AI agents', 'Settings'),
  ('research', 'research', 'Research', 'Research and information gathering tools', 'Search'),
  ('data_analysis', 'data-analysis', 'Data Analysis', 'Data processing and analytics tools', 'BarChart3'),
  ('marketing', 'marketing', 'Marketing', 'Marketing and growth tools', 'TrendingUp'),
  ('content_creation', 'content-creation', 'Content Creation', 'Content writing and creative tools', 'PenTool'),
  ('digital_workers', 'digital-workers', 'Digital Workers', 'Automated digital workforce solutions', 'Users'),
  ('design', 'design', 'Design', 'Design and creative tools', 'Palette'),
  ('sales', 'sales', 'Sales', 'Sales and customer acquisition tools', 'TrendingUp'),
  ('customer_support', 'customer-support', 'Customer Support', 'Customer service and support tools', 'Headphones'),
  ('voice_ai', 'voice-ai', 'Voice AI', 'Voice and speech processing agents', 'Mic'),
  ('business_intelligence', 'business-intelligence', 'Business Intelligence', 'Business analytics and intelligence', 'Briefcase'),
  ('hr', 'hr', 'HR', 'Human resources and recruitment tools', 'Users'),
  ('science', 'science', 'Science', 'Scientific research and analysis tools', 'Search'),
  ('conversational_ai', 'conversational-ai', 'Conversational AI', 'Chat and conversation agents', 'MessageCircle'),
  ('image_generation', 'image-generation', 'Image Generation', 'AI image creation and editing tools', 'Palette'),
  ('automation', 'automation', 'Automation', 'Process automation and workflow tools', 'Zap'),
  ('translation', 'translation', 'Translation', 'Language translation and localization', 'Languages'),
  ('education', 'education', 'Education', 'Learning and educational tools', 'GraduationCap'),
  ('healthcare', 'healthcare', 'Healthcare', 'Healthcare and medical assistance tools', 'Heart'),
  ('gaming', 'gaming', 'Gaming', 'Gaming and entertainment AI', 'Gamepad2'),
  ('other', 'other', 'Other', 'Miscellaneous AI agents', 'MoreHorizontal');

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_is_active ON public.categories(is_active);
CREATE INDEX idx_categories_sort_order ON public.categories(sort_order);

-- Create function to update category agent counts
CREATE OR REPLACE FUNCTION update_category_agent_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update agent count for the affected category
  UPDATE public.categories 
  SET agent_count = (
    SELECT COUNT(*) 
    FROM public.ai_agents 
    WHERE category::text = categories.name 
    AND status IN ('approved', 'featured')
  )
  WHERE name = COALESCE(NEW.category::text, OLD.category::text);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update category counts
CREATE TRIGGER trigger_update_category_counts
  AFTER INSERT OR UPDATE OR DELETE ON public.ai_agents
  FOR EACH ROW EXECUTE FUNCTION update_category_agent_counts();
