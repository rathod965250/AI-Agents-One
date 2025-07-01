export type Agent = {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  description?: string;
  category: string;
  website_url?: string;
  pricing_type: string;
  contact_email?: string;
  repository_url?: string;
  documentation_url?: string;
  additional_resources_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  homepage_image_url?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  developer?: string;
  features?: string[];
  integrations?: string[];
  gallery?: string[];
  case_studies?: string[];
  technical_specs?: string[];
  average_rating?: number;
  total_reviews?: number;
  total_upvotes?: number;
  view_count?: number;
  launch_date?: string;
  cass?: string;
  profiles?: { username: string; full_name: string } | null;
  content_flags?: any[];
  [key: string]: any;
};

export type Submission = {
  id: string;
  name?: string | null;
  tagline?: string | null;
  is_draft?: boolean | null;
  status?: 'pending' | 'approved' | 'rejected' | 'featured' | null;
  [key: string]: any;
};

export type User = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  twitter_handle: string | null;
  github_handle: string | null;
  created_at: string | null;
  is_verified: boolean | null;
  status: 'active' | 'suspended' | 'banned' | null;
  user_roles?: { role: string }[];
  agent_submissions?: { id: string }[];
  agent_reviews?: { id: string }[];
  support_tickets?: { id: string; status: string }[];
  content_flags?: { id: string; reason: string; status: string }[];
};

export type Category = {
  id: string;
  name: string;
  display_name: string;
  description?: string | null;
  [key: string]: any;
};

export type Review = {
  id: string;
  agent_id: string;
  user_id?: string | null;
  title: string;
  comment: string;
  rating: number;
  pros?: string | null;
  cons?: string | null;
  is_verified?: boolean | null;
  created_at: string | null;
  helpful_count?: number | null;
  status?: 'pending' | 'approved' | 'rejected' | null;
  profiles?: { username: string; full_name: string; avatar_url: string };
  ai_agents?: { name:string; slug: string; logo_url: string };
  content_flags?: { reason: string; status: string }[];
};

export type FAQ = {
  id: string;
  agent_id: string;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
};
