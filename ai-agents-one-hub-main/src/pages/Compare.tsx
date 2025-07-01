import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Globe, Github, Linkedin, Twitter, ExternalLink, Check, X, Plus, Minus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import EnhancedMetaTags from '@/components/seo/EnhancedMetaTags';
import AdvancedSEO from '@/components/seo/AdvancedSEO';
import TrackedLink from '@/components/ui/TrackedLink';

const MAX_COMPARE = 3;

const SECTIONS = [
  { key: 'tagline', label: 'Tagline', type: 'text' },
  { key: 'description', label: 'Overview', type: 'text' },
  { key: 'Use Cases', label: 'Use Cases', type: 'array' },
  { key: 'features', label: 'Key Features', type: 'array' },
  { key: 'pricing_details', label: 'Pricing', type: 'text' },
  { key: 'technical_specs', label: 'Technical Specs', type: 'array' },
  { key: 'tags', label: 'Tags', type: 'array' },
  { key: 'integrations', label: 'Integrations', type: 'array' },
  { key: 'category', label: 'Category', type: 'text' },
  { key: 'pricing_type', label: 'Pricing Model', type: 'text' },
  { key: 'rating', label: 'Rating & Reviews', type: 'rating' },
  { key: 'external_links', label: 'External Links', type: 'links' },
];

const getPersistedAgentSlugs = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('compare_agents') || '[]');
  } catch {
    return [];
  }
};

const setPersistedAgentSlugs = (slugs: string[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('compare_agents', JSON.stringify(slugs));
};

const Compare = () => {
  const { user } = useAuth();
  const [agentSlugs, setAgentSlugs] = useState<string[]>(getPersistedAgentSlugs());
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const [visibleSections, setVisibleSections] = useState(SECTIONS.map(s => s.key));

  useEffect(() => {
    setPersistedAgentSlugs(agentSlugs);
    if (agentSlugs.length === 0) {
      setAgents([]);
      return;
    }
    setLoading(true);
    supabase
      .from('ai_agents')
      .select(`
        id, name, slug, tagline, description, website_url, category, pricing_type, 
        pricing_details, features, technical_specs, tags, integrations, 
        average_rating, total_reviews, total_upvotes, view_count, launch_date,
        contact_email, repository_url, linkedin_url, twitter_url, additional_resources_url,
        homepage_image_url, developer, "Use Cases"
      `)
      .in('slug', agentSlugs)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching agents:', error);
        }
        // Process the data to handle array fields properly
        const processedAgents = (data || []).map(agent => {
          // Parse array fields if they're strings
          if (typeof agent.features === 'string') {
            try { agent.features = JSON.parse(agent.features); } catch {}
          }
          if (!Array.isArray(agent.features)) agent.features = [];

          if (typeof agent.technical_specs === 'string') {
            try { agent.technical_specs = JSON.parse(agent.technical_specs); } catch {}
          }
          if (!Array.isArray(agent.technical_specs)) agent.technical_specs = [];

          if (typeof agent.tags === 'string') {
            try { agent.tags = JSON.parse(agent.tags); } catch {}
          }
          if (!Array.isArray(agent.tags)) agent.tags = [];

          if (typeof agent.integrations === 'string') {
            try { agent.integrations = JSON.parse(agent.integrations); } catch {}
          }
          if (!Array.isArray(agent.integrations)) agent.integrations = [];

          // Handle Use Cases (column name is 'Use Cases')
          let useCases = agent['Use Cases'];
          if (typeof useCases === 'string') {
            try { useCases = JSON.parse(useCases); } catch {}
          }
          if (!Array.isArray(useCases)) useCases = [];
          agent.use_cases = useCases;

          return agent;
        });
        setAgents(processedAgents);
        setLoading(false);
      });
  }, [agentSlugs]);

  const removeAgent = (slug: string) => {
    setRemoving(slug);
    setTimeout(() => {
      setAgentSlugs(agentSlugs.filter(s => s !== slug));
      setRemoving(null);
      
      // Dispatch custom event to update navigation badges
      window.dispatchEvent(new Event('compareAgentsChanged'));
    }, 300);
  };

  // Helper: highlight unique values
  const isUnique = (field: string, value: any) => {
    if (agents.length < 2) return false;
    const values = agents.map(a => {
      const val = a[field];
      return Array.isArray(val) ? JSON.stringify(val.sort()) : JSON.stringify(val);
    });
    return values.filter(v => v === JSON.stringify(value)).length === 1;
  };

  // Section toggle controls
  const toggleSection = (key: string) => {
    setVisibleSections(v => v.includes(key) ? v.filter(k => k !== key) : [...v, key]);
  };

  const renderSectionContent = (agent: any, section: any) => {
    const value = agent[section.key];
    const highlight = isUnique(section.key, value);

    switch (section.type) {
      case 'array':
        const arrayValue = Array.isArray(value) ? value : [];
        if (arrayValue.length === 0) {
          return <span className="text-gray-400 italic">Not specified</span>;
        }
        return (
          <ul className="space-y-1">
            {arrayValue.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className={highlight ? 'bg-green-50 px-1 rounded font-medium' : ''}>
                  {item}
                </span>
              </li>
            ))}
          </ul>
        );

      case 'rating':
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold ml-1">{agent.average_rating?.toFixed(1) || '—'}</span>
            </div>
            <span className="text-gray-500 text-sm">({agent.total_reviews || 0})</span>
          </div>
        );

      case 'links':
        return (
          <div className="space-y-1">
            {agent.website_url && (
              <TrackedLink href={agent.website_url} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-1 text-blue-600 hover:underline text-sm" componentName="Compare">
                <Globe className="w-3 h-3" /> Website
              </TrackedLink>
            )}
            {agent.repository_url && (
              <TrackedLink href={agent.repository_url} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-1 text-blue-600 hover:underline text-sm" componentName="Compare">
                <Github className="w-3 h-3" /> GitHub
              </TrackedLink>
            )}
            {agent.linkedin_url && (
              <TrackedLink href={agent.linkedin_url} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-1 text-blue-600 hover:underline text-sm" componentName="Compare">
                <Linkedin className="w-3 h-3" /> LinkedIn
              </TrackedLink>
            )}
            {agent.twitter_url && (
              <TrackedLink href={agent.twitter_url} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-1 text-blue-600 hover:underline text-sm" componentName="Compare">
                <Twitter className="w-3 h-3" /> Twitter
              </TrackedLink>
            )}
            {!agent.website_url && !agent.repository_url && !agent.linkedin_url && !agent.twitter_url && (
              <span className="text-gray-400 italic text-sm">No links available</span>
            )}
          </div>
        );

      default:
        if (!value || value === '') {
          return <span className="text-gray-400 italic">Not specified</span>;
        }
        return (
          <span className={`text-sm ${highlight ? 'bg-green-50 px-1 rounded font-medium' : ''}`}>
            {value}
          </span>
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center text-xl text-gray-500">
          Please sign in to compare agents.
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <EnhancedMetaTags
        title="Compare AI Agents - Side-by-Side AI Tool Comparison | AI Hub"
        description="Compare features, pricing, technical specs, and reviews of top AI agents. Find the best AI tool for your needs with our side-by-side comparison."
        keywords="compare AI agents, AI tool comparison, AI features, AI pricing, AI reviews"
        canonicalUrl="https://ai-agents-hub.com/compare"
        ogType="website"
      />
      <AdvancedSEO
        type="compare"
        data={agents}
      />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Compare AI Agents</h1>
            <p className="text-gray-600">Compare up to 3 AI agents side by side</p>
          </div>

          {/* Section Controls */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Compare Sections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {SECTIONS.map(section => (
                  <Button
                    key={section.key}
                    size="sm"
                    variant={visibleSections.includes(section.key) ? 'default' : 'outline'}
                    onClick={() => toggleSection(section.key)}
                    className="text-xs"
                  >
                    {visibleSections.includes(section.key) ? <Minus className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                    {section.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-gray-500">Loading comparison...</div>
            </div>
          ) : agents.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-2xl font-semibold mb-4 text-gray-700">No agents to compare</div>
                <div className="text-gray-500 mb-6">Add agents from the browse page to start comparing</div>
                <TrackedLink href="/browse" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition" componentName="Compare">
                  Browse Agents
                </TrackedLink>
              </CardContent>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[1200px] bg-white rounded-lg shadow-lg border">
                {/* Header Row */}
                <div className="grid grid-cols-[250px_repeat(3,1fr)] border-b bg-gray-50">
                  <div className="p-4 font-semibold text-gray-700 border-r">
                    Features
                  </div>
                  {agents.map((agent, idx) => (
                    <div key={agent.id} className={`p-4 border-r last:border-r-0 ${idx % 2 === 1 ? 'bg-gray-100' : ''}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={agent.homepage_image_url || agent.logo_url || '/placeholder.svg'} 
                          alt={agent.name} 
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate" title={agent.name}>
                            {agent.name}
                          </h3>
                          <p className="text-sm text-gray-500 truncate" title={agent.tagline}>
                            {agent.tagline}
                          </p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => removeAgent(agent.slug)}
                        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Section Rows */}
                {SECTIONS.filter(s => visibleSections.includes(s.key)).map(section => (
                  <div key={section.key} className="grid grid-cols-[250px_repeat(3,1fr)] border-b last:border-b-0">
                    <div className="p-4 font-semibold text-gray-700 border-r bg-gray-50">
                      {section.label}
                    </div>
                    {agents.map((agent, idx) => (
                      <div key={`${agent.id}-${section.key}`} className={`p-4 border-r last:border-r-0 ${idx % 2 === 1 ? 'bg-gray-50' : ''}`}>
                        {renderSectionContent(agent, section)}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add More Agents */}
          {agents.length > 0 && agents.length < MAX_COMPARE && (
            <Card className="mt-6">
              <CardContent className="text-center py-6">
                <p className="text-gray-600 mb-4">Add more agents to compare</p>
                <TrackedLink href="/browse" className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition" componentName="Compare">
                  <Plus className="w-4 h-4" />
                  Browse More Agents
                </TrackedLink>
              </CardContent>
            </Card>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Compare; 