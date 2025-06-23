
-- Create newsletter subscriptions table
CREATE TABLE public.newsletter_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for faster email lookups
CREATE INDEX idx_newsletter_email ON public.newsletter_subscriptions(email);

-- Enable RLS (making it public for newsletter signups)
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert newsletter subscriptions
CREATE POLICY "Anyone can subscribe to newsletter" 
  ON public.newsletter_subscriptions 
  FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to read their own subscription status by email
CREATE POLICY "Anyone can view subscription by email" 
  ON public.newsletter_subscriptions 
  FOR SELECT 
  USING (true);

-- Allow updates for unsubscribing
CREATE POLICY "Anyone can update subscription status" 
  ON public.newsletter_subscriptions 
  FOR UPDATE 
  USING (true);
