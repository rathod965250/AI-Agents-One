import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Agent, FAQ } from '@/integrations/supabase/types';
import AgentHeroSection from '@/components/AgentHeroSection';
import AgentOverview from '@/components/AgentOverview';
import AgentKeyFeatures from '@/components/AgentKeyFeatures';
import AgentUseCases from '@/components/AgentUseCases';
import AgentTechnicalSpecs from '@/components/AgentTechnicalSpecs';
import AgentGallery from '@/components/AgentGallery';
import AgentReviews from '@/components/AgentReviews';
import RelatedAgents from '@/components/RelatedAgents';
import SocialShare from '@/components/SocialShare';
import Navigation from '@/components/Navigation';
import SEOBreadcrumbs from '@/components/SEOBreadcrumbs';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import AdvancedSEO from '@/components/seo/AdvancedSEO';
import FAQSection from '@/components/seo/FAQSection';
import EnhancedMetaTags from '@/components/seo/EnhancedMetaTags';
import CaseStudies from '@/components/CaseStudies';
import AgentSidebarInfo from '@/components/AgentSidebarInfo';
import { Mail, Globe, Github, BookText, Linkedin, Twitter, PlugZap, User as UserIcon, Tag, Star, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

const AgentDetail = () => {
  const { slug } = useParams<{ slug: string }>();

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

  // Generate comprehensive SEO data for the agent
  const generateAgentSEO = (agent: Agent) => {
    const title = `${agent.name} - AI Agent | Features, Reviews & Pricing | AI Hub`;
    const description = `Discover ${agent.name}, an innovative AI agent in the ${agent.category} category. Read reviews, compare features, and learn how this AI tool can enhance your workflow.`;
    const keywords = `${agent.name}, ${agent.category} AI, artificial intelligence ${agent.category.replace(/_/g, ' ')}, AI agent, ${agent.pricing_type} AI tool, AI assistant`;
    
    return { title, description, keywords };
  };

  if (isLoading) {
    return (
      <>
        <SEOHead
          title="Loading AI Agent Details | AI Hub"
          description="Loading AI agent information..."
          noIndex={true}
        />
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading agent details...</p>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  if (error || !agent) {
    return (
      <>
        <EnhancedMetaTags
          title="AI Agent Not Found | AI Hub"
          description="The AI agent you're looking for doesn't exist or has been removed."
          keywords="AI agent not found, 404, AI Hub"
          canonicalUrl="https://ai-agents-hub.com/404"
        />
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
              <p className="text-muted-foreground">The agent you're looking for doesn't exist.</p>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  const { title, description, keywords } = generateAgentSEO(agent);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Browse', href: '/browse' },
    { label: agent.name, href: `/agent/${agent.slug}` }
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
      
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <SEOBreadcrumbs items={breadcrumbItems} />
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Header */}
          <AgentHeroSection agent={agent} />
          {/* Main Screenshot/Hero Image */}
          {agent.homepage_image_url && (
            <img
              src={agent.homepage_image_url}
              alt={agent.name}
              className="w-full rounded-2xl mb-6 object-cover max-h-72 border border-gray-200"
              style={{ background: '#f8fafc' }}
            />
          )}
          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 mt-6">
            <AgentGallery agent={agent} />
            <AgentOverview agent={agent} />
            <AgentKeyFeatures agent={agent} />
            <AgentUseCases agent={agent} />
            <AgentTechnicalSpecs agent={agent} />
            {(agent.website_url || agent.documentation_url || agent.repository_url || agent.contact_email || agent.linkedin_url || agent.twitter_url) && (
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Globe className="h-5 w-5 text-blue-500" />Contact & Links</h3>
                <div className="flex flex-wrap gap-4">
                  {agent.website_url && (
                    <a href={agent.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-700 hover:underline"><Globe />Website</a>
                  )}
                  {agent.documentation_url && (
                    <a href={agent.documentation_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-700 hover:underline"><BookText />Docs</a>
                  )}
                  {agent.repository_url && (
                    <a href={agent.repository_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-700 hover:underline"><Github />Repository</a>
                  )}
                  {agent.contact_email && (
                    <a href={`mailto:${agent.contact_email}`} className="inline-flex items-center gap-2 text-blue-700 hover:underline"><Mail />Contact</a>
                  )}
                  {agent.linkedin_url && (
                    <a href={agent.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-700 hover:underline"><Linkedin />LinkedIn</a>
                  )}
                  {agent.twitter_url && (
                    <a href={agent.twitter_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-700 hover:underline"><Twitter />Twitter</a>
                  )}
                </div>
              </div>
            )}
            {agent.integrations && agent.integrations.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><PlugZap className="h-5 w-5 text-green-500" />Integrations</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.integrations.map((integration, idx) => (
                    <span key={idx} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200">{integration}</span>
                  ))}
                </div>
              </div>
            )}
            {agent.tags && agent.tags.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2"><Tag className="h-5 w-5 text-gray-500" />Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.tags.map((tag, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm border border-gray-200">{tag}</span>
                  ))}
                </div>
              </div>
            )}
            <CaseStudies agent={agent} />
            <AgentReviews agent={agent} />
            {/* FAQ Section */}
            <div className="mt-8">
              <FAQSection 
                faqData={faqs.map(faq => ({ question: faq.question, answer: faq.answer }))}
                title={`Frequently Asked Questions about ${agent.name}`}
              />
            </div>
          </div>
        </div>
        {/* Sidebar Info (optional, can be removed if not needed) */}
        <div className="hidden lg:block fixed right-0 top-32 w-80 pr-8">
          <AgentSidebarInfo agent={agent} />
          <RelatedAgents currentAgentId={agent.id} currentAgentCategory={agent.category} />
          <SocialShare agent={agent} />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AgentDetail;
