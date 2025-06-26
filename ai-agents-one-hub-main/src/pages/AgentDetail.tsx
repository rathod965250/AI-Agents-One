import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import EnhancedMetaTags from '@/components/seo/EnhancedMetaTags';
import { 
  Star, Clock, ExternalLink, MessageSquare, Zap, Code, BarChart, 
  Settings, Mail, Globe, Github, Twitter, Linkedin, Facebook, Copy, 
  BookText, PlugZap, ChevronDown, Check, Share2, MessageCircle, AlertCircle,
  Award, Code2, Cpu, Database, FileText, GitBranch, GitPullRequest, HardDrive, 
  Layers, LayoutDashboard, Lock, PanelLeft, Server, Shield, Terminal, 
  User, Users, Workflow, X, Eye, Play, Plus, Minus, Heart, Bookmark, 
  ChevronUp, ArrowUpRight, Download, Image as ImageIcon, CheckCircle2
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  slug: string;
  short_description?: string;
  description: string;
  category: string;
  pricing_type: string;
  logo_url?: string;
  website_url?: string;
  github_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  created_at: string;
  updated_at: string;
  features?: string[];
  use_cases?: string[];
  integrations?: string[];
  gallery?: Array<{ type: 'image' | 'video'; url: string; thumbnail?: string }>;
  tags?: string[];
  rating?: number;
  review_count?: number;
  last_updated?: string;
  pricing?: {
    plan: string;
    price: string;
    period: string;
    features: string[];
  }[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
  agent_id: string;
}

interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

interface RelatedAgent {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  category: string;
  logo_url?: string;
  rating?: number;
  review_count?: number;
}

const AgentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});

  const { data: agent, isLoading, error } = useQuery({
    queryKey: ['agent', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No slug provided');
      
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!slug
  });

  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [faqLoading, setFaqLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      if (!agent?.id) return;
      setFaqLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('agent_id', agent.id)
        .order('created_at', { ascending: true });
      if (!error && data) setFaqs(data);
      setFaqLoading(false);
    };
    if (agent?.id) fetchFaqs();
  }, [agent?.id]);

  const toggleFaq = (index: number) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Generate comprehensive SEO data for the agent
  const generateAgentSEO = (agent: Agent) => {
    const title = `${agent.name} - AI Agent | Features, Reviews & Pricing | AI Hub`;
    const description = `Discover ${agent.name}, an innovative AI agent in the ${agent.category} category. Read reviews, compare features, and learn how this AI tool can enhance your workflow.`;
    const keywords = `${agent.name}, ${agent.category} AI, artificial intelligence ${agent.category?.replace(/_/g, ' ') || ''}, AI agent, ${agent.pricing_type || 'AI tool'}, AI assistant`;
    
    return { title, description, keywords };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead
          title="Loading AI Agent Details | AI Hub"
          description="Loading AI agent information..."
          noIndex={true}
        />
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading agent details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EnhancedMetaTags
          title="AI Agent Not Found | AI Hub"
          description="The AI agent you're looking for doesn't exist or has been removed."
          keywords="AI agent not found, 404, AI Hub"
          canonicalUrl="https://ai-agents-hub.com/404"
        />
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-md bg-white p-8 rounded-xl shadow-sm">
            <h1 className="text-2xl font-bold mb-3 text-gray-800">Agent Not Found</h1>
            <p className="text-gray-600 mb-6">The AI agent you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/browse" className="inline-flex items-center gap-2">
                Browse AI Agents <ChevronRight className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { title, description, keywords } = generateAgentSEO(agent);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/browse' },
    { label: agent.name, href: `/agent/${agent.slug}` }
  ];
  
  // Mock data for demonstration
  const features = agent.features || [
    'Advanced natural language processing',
    'Multi-language support',
    'Real-time data analysis',
    'Customizable workflows',
    'API integration',
    'Secure data handling'
  ];
  
  const useCases = agent.use_cases || [
    'Customer support automation',
    'Content generation',
    'Data analysis and reporting',
    'Process automation',
    'Knowledge management'
  ];
  
  const integrations = agent.integrations || [
    'Slack',
    'Microsoft Teams',
    'Google Workspace',
    'Zapier',
    'API Access'
  ];
  
  const faqData = faqs.length > 0 ? faqs : [
    {
      question: 'How do I get started with this AI agent?',
      answer: 'You can get started by signing up for an account and following our quick start guide.'
    },
    {
      question: 'What programming languages does it support?',
      answer: 'Our AI agent supports multiple programming languages including Python, JavaScript, and more.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial with full access to all features.'
    }
  ];

  return (
    <>
      <EnhancedMetaTags
        title={title}
        description={description}
        keywords={keywords}
        canonicalUrl={`https://ai-agents-hub.com/agent/${agent.slug}`}
        ogImage={agent.homepage_image_url}
        ogType="article"
      />
      
      <AdvancedSEO type="agent" data={agent} />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation />
        <SEOBreadcrumbs items={breadcrumbItems} />
        
        {/* Main Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Hero Section with Image */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {agent.homepage_image_url && (
                  <div className="relative h-64 md:h-80 lg:h-96 w-full">
                    <img
                      src={agent.homepage_image_url}
                      alt={agent.name}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <AgentHeroSection agent={agent} />
                    </div>
                  </div>
                )}
                
                {/* Quick Stats Bar */}
                <div className="bg-white p-4 border-t border-gray-100">
                  <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
                    {agent.average_rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{agent.average_rating.toFixed(1)}</span>
                        <span className="text-gray-400">({agent.total_reviews || 0} reviews)</span>
                      </div>
                    )}
                    {agent.category && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-4 h-4 text-blue-500" />
                        <span>{agent.category}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span>{(Math.random() * 1000).toFixed(0)} views</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Gallery Section */}
              <AgentGallery agent={agent} />
              
              {/* Main Content Sections */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <AgentOverview agent={agent} />
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <AgentKeyFeatures agent={agent} />
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <AgentUseCases agent={agent} />
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <AgentTechnicalSpecs agent={agent} />
                </div>
                
                {/* Contact & Links Section */}
                {(agent.website_url || agent.documentation_url || agent.repository_url || agent.contact_email || agent.linkedin_url || agent.twitter_url) && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                      <Globe className="h-5 w-5 text-blue-500" />
                      Contact & Links
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {agent.website_url && (
                        <a 
                          href={agent.website_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        >
                          <Globe className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-700">Website</span>
                        </a>
                      )}
                      {agent.documentation_url && (
                        <a 
                          href={agent.documentation_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        >
                          <BookText className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-700">Documentation</span>
                        </a>
                      )}
                      {agent.repository_url && (
                        <a 
                          href={agent.repository_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        >
                          <Github className="h-5 w-5 text-gray-800" />
                          <span className="font-medium text-gray-700">GitHub Repository</span>
                        </a>
                      )}
                      {agent.contact_email && (
                        <a 
                          href={`mailto:${agent.contact_email}`} 
                          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        >
                          <Mail className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-700">Contact Email</span>
                        </a>
                      )}
                      {agent.linkedin_url && (
                        <a 
                          href={agent.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        >
                          <Linkedin className="h-5 w-5 text-blue-700" />
                          <span className="font-medium text-gray-700">LinkedIn</span>
                        </a>
                      )}
                      {agent.twitter_url && (
                        <a 
                          href={agent.twitter_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        >
                          <Twitter className="h-5 w-5 text-blue-400" />
                          <span className="font-medium text-gray-700">Twitter</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
                {agent.integrations && agent.integrations.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                      <PlugZap className="h-5 w-5 text-green-500" />
                      Integrations
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.integrations.map((integration, idx) => (
                        <span key={idx} className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100 hover:bg-green-100 transition-colors">
                          {integration}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Tags Section */}
                {agent.tags && agent.tags.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                      <Tag className="h-5 w-5 text-purple-500" />
                      Tags & Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {agent.tags.map((tag, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Reviews Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">User Reviews</h3>
                  <AgentReviews agent={agent} />
                </div>
                
                {/* FAQ Section */}
                {faqs.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <FAQSection 
                      faqData={faqs.map(faq => ({
                        question: faq.question || '',
                        answer: faq.answer || ''
                      }))} 
                      title="Frequently Asked Questions"
                    />
                  </div>
                )}
                
                {/* Related Agents */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">You May Also Like</h3>
                  <RelatedAgents 
                    currentAgentId={agent.id} 
                    currentAgentCategory={agent.category || ''} 
                  />
                </div>
                
                {/* Social Share */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <SocialShare agent={agent} />
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <AgentSidebarInfo agent={agent} />
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <Footer />
        </div>
      </div>
    </>
  );
};

export default AgentDetail;
