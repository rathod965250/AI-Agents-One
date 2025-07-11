
-- Make submitted_by nullable temporarily to allow dummy data
ALTER TABLE public.ai_agents ALTER COLUMN submitted_by DROP NOT NULL;

-- Insert dummy AI agents data without submitted_by
INSERT INTO public.ai_agents (
  name, slug, tagline, description, category, pricing_type, pricing_details, 
  features, tags, status, total_upvotes, total_reviews, 
  average_rating, website_url, logo_url
) VALUES 
(
  'ChatGPT Assistant Pro',
  'chatgpt-assistant-pro',
  'Advanced conversational AI for business automation',
  'A powerful conversational AI that helps businesses automate customer support, content creation, and workflow management. Built with advanced language models and customizable for any industry.',
  'conversational_ai',
  'subscription',
  'Starting at $20/month for basic plan, $50/month for pro features',
  ARRAY['24/7 Customer Support', 'Multi-language Support', 'Custom Training', 'API Integration', 'Analytics Dashboard'],
  ARRAY['chatbot', 'customer-service', 'automation', 'nlp'],
  'featured',
  156,
  23,
  4.8,
  'https://chatgpt.com',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop'
),
(
  'DALL-E Creative Studio',
  'dalle-creative-studio',
  'AI-powered image generation for creative professionals',
  'Transform your ideas into stunning visuals with advanced AI image generation. Perfect for designers, marketers, and content creators who need high-quality images on demand.',
  'image_generation',
  'freemium',
  'Free tier with 5 images/month, Pro at $15/month for unlimited',
  ARRAY['High-resolution outputs', 'Style customization', 'Batch processing', 'Commercial licensing', 'API access'],
  ARRAY['design', 'art', 'marketing', 'creative'],
  'approved',
  89,
  15,
  4.6,
  'https://openai.com/dall-e-2',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop'
),
(
  'CodeMentor AI',
  'codementor-ai',
  'Your intelligent coding companion and code reviewer',
  'An advanced AI assistant that helps developers write better code, debug issues, and learn new programming concepts. Supports 50+ programming languages with real-time suggestions.',
  'code_assistant',
  'paid',
  'One-time purchase: $99 for individual license',
  ARRAY['Multi-language support', 'Real-time debugging', 'Code optimization', 'Learning modules', 'Team collaboration'],
  ARRAY['programming', 'development', 'debugging', 'learning'],
  'approved',
  134,
  31,
  4.7,
  'https://codementor.io',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop'
),
(
  'VoiceClone Pro',
  'voiceclone-pro',
  'Professional voice synthesis and cloning technology',
  'Create realistic voice clones for audiobooks, podcasts, and video content. Advanced neural networks ensure natural-sounding speech with emotional nuances.',
  'voice_ai',
  'subscription',
  'Basic: $29/month, Professional: $99/month',
  ARRAY['Voice cloning', 'Multi-accent support', 'Emotional tone control', 'Background noise removal', 'Bulk processing'],
  ARRAY['voice', 'audio', 'podcasting', 'content-creation'],
  'approved',
  67,
  12,
  4.4,
  'https://voiceclone.ai',
  'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop'
),
(
  'DataInsight Analytics',
  'datainsight-analytics',
  'Transform raw data into actionable business insights',
  'Advanced analytics platform that uses AI to analyze complex datasets, identify trends, and generate comprehensive reports. Perfect for data scientists and business analysts.',
  'data_analysis',
  'freemium',
  'Free for basic analytics, Pro at $79/month for advanced features',
  ARRAY['Automated reporting', 'Predictive analytics', 'Data visualization', 'Machine learning models', 'Export capabilities'],
  ARRAY['analytics', 'business-intelligence', 'data-science', 'reporting'],
  'featured',
  201,
  45,
  4.9,
  'https://datainsight.com',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop'
),
(
  'ContentCraft Writer',
  'contentcraft-writer',
  'AI-powered content creation for marketers and writers',
  'Generate high-quality blog posts, social media content, and marketing copy with AI assistance. Supports multiple writing styles and tones for different audiences.',
  'content_creation',
  'subscription',
  'Starter: $19/month, Pro: $49/month, Agency: $129/month',
  ARRAY['SEO optimization', 'Plagiarism detection', 'Multi-format export', 'Brand voice training', 'Collaboration tools'],
  ARRAY['writing', 'marketing', 'seo', 'blogging'],
  'approved',
  78,
  19,
  4.3,
  'https://contentcraft.ai',
  'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=100&h=100&fit=crop'
),
(
  'AutoFlow Bot',
  'autoflow-bot',
  'Workflow automation and task management assistant',
  'Streamline your business processes with intelligent automation. Connect apps, automate repetitive tasks, and create custom workflows without coding.',
  'automation',
  'freemium',
  'Free plan available, Premium at $25/month per user',
  ARRAY['No-code automation', 'App integrations', 'Trigger conditions', 'Task scheduling', 'Performance monitoring'],
  ARRAY['automation', 'productivity', 'workflow', 'integration'],
  'approved',
  112,
  27,
  4.5,
  'https://autoflow.com',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop'
),
(
  'LinguaTranslate AI',
  'linguatranslate-ai',
  'Real-time translation with context awareness',
  'Advanced translation service that understands context, idioms, and cultural nuances. Perfect for global businesses and international communication.',
  'translation',
  'paid',
  'Pay-per-use: $0.02 per word, Monthly plans from $39',
  ARRAY['100+ languages', 'Context awareness', 'Industry-specific models', 'Real-time translation', 'Quality scoring'],
  ARRAY['translation', 'languages', 'communication', 'global'],
  'approved',
  45,
  8,
  4.2,
  'https://linguatranslate.ai',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop'
),
(
  'StudyBuddy AI',
  'studybuddy-ai',
  'Personalized learning assistant for students',
  'Adaptive learning platform that creates personalized study plans, generates practice questions, and provides instant feedback to help students excel in their studies.',
  'education',
  'freemium',
  'Free for basic features, Student Pro: $9.99/month',
  ARRAY['Personalized learning paths', 'Progress tracking', 'Interactive quizzes', 'Study reminders', 'Performance analytics'],
  ARRAY['education', 'learning', 'students', 'academic'],
  'approved',
  189,
  52,
  4.8,
  'https://studybuddy.ai',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop'
),
(
  'HealthMonitor Pro',
  'healthmonitor-pro',
  'AI-powered health tracking and wellness insights',
  'Comprehensive health monitoring platform that tracks vital signs, analyzes health patterns, and provides personalized wellness recommendations.',
  'healthcare',
  'subscription',
  'Basic: $14.99/month, Family: $29.99/month, Clinical: $99/month',
  ARRAY['Vital sign monitoring', 'Health predictions', 'Medication reminders', 'Emergency alerts', 'Doctor integration'],
  ARRAY['health', 'wellness', 'monitoring', 'medical'],
  'approved',
  93,
  16,
  4.6,
  'https://healthmonitor.ai',
  'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100&h=100&fit=crop'
);
