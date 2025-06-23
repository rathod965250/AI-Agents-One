
-- Create user notifications table
CREATE TABLE public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, warning, success, error
  is_read BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create support tickets table
CREATE TABLE public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
  priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, urgent
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create email templates table
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create content flags table
CREATE TABLE public.content_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL, -- review, agent, comment
  content_id UUID NOT NULL,
  flagged_by UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, reviewed, resolved, dismissed
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_flags ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_notifications
CREATE POLICY "Users can view their own notifications"
  ON public.user_notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications"
  ON public.user_notifications
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS policies for support_tickets
CREATE POLICY "Users can view their own tickets"
  ON public.support_tickets
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create tickets"
  ON public.support_tickets
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all tickets"
  ON public.support_tickets
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS policies for email_templates
CREATE POLICY "Admins can manage email templates"
  ON public.email_templates
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS policies for content_flags
CREATE POLICY "Users can view their own flags"
  ON public.content_flags
  FOR SELECT
  USING (flagged_by = auth.uid());

CREATE POLICY "Users can create flags"
  ON public.content_flags
  FOR INSERT
  WITH CHECK (flagged_by = auth.uid());

CREATE POLICY "Admins can manage all flags"
  ON public.content_flags
  FOR ALL
  USING (public.is_admin(auth.uid()));

-- Update admin_audit_logs to track user management actions
INSERT INTO public.email_templates (name, subject, body, variables) VALUES
('user_welcome', 'Welcome to AI Agents Directory', 'Hello {{username}}, welcome to our platform!', '{"username": "string"}'),
('account_suspended', 'Account Suspended', 'Your account has been suspended. Reason: {{reason}}', '{"reason": "string"}'),
('review_approved', 'Review Approved', 'Your review for {{agent_name}} has been approved.', '{"agent_name": "string"}'),
('review_rejected', 'Review Rejected', 'Your review for {{agent_name}} has been rejected. Reason: {{reason}}', '{"agent_name": "string", "reason": "string"}');
