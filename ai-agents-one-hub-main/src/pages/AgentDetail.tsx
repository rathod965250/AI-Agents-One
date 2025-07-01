import { useParams } from 'react-router-dom';
import { useQuery, useQueries } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Star, Check, Share2, Flag, Globe, BookText, Github, Linkedin, Twitter, ThumbsUp, ThumbsDown, User as UserIcon, PlusSquare, Heart, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef, memo, useMemo, useCallback, Suspense, lazy } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import EnhancedMetaTags from '@/components/seo/EnhancedMetaTags';
import AdvancedSEO from '@/components/seo/AdvancedSEO';
import mixpanel from 'mixpanel-browser';
import TrackedLink from '@/components/ui/TrackedLink';

const placeholderLogo = '/placeholder.svg';

// Import components directly instead of lazy loading for debugging
import ReviewsSection from '@/components/agent-detail/ReviewsSection';
import RelatedAgents from '@/components/agent-detail/RelatedAgents';

// Memoized sub-components for better performance
const AgentHero = memo(({ agent, isFavorite, isInCompare, onFavoriteClick, onAddToCompare }: any) => (
  <section className="bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row items-center gap-8 mb-8 relative">
    <img 
      src={agent.logo_url || placeholderLogo} 
      alt={agent.name} 
      className="w-24 h-24 rounded-xl object-cover border border-gray-200"
      loading="eager"
      onError={(e) => {
        e.currentTarget.src = placeholderLogo;
      }}
    />
    <div className="flex-1 w-full">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
        <Badge className="bg-green-100 text-green-700 font-medium">Verified</Badge>
      </div>
      <p className="text-gray-600 text-lg mb-2">{agent.short_description || agent.tagline || 'No tagline provided.'}</p>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>by <span className="font-medium text-blue-700">{agent.developer || 'Unknown'}</span></span>
        <span className="mx-2">·</span>
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 inline" />
        <span className="font-semibold text-gray-700">{agent.average_rating?.toFixed(1) || '—'}</span>
        <span>({agent.total_reviews || 0} reviews)</span>
        <span className="mx-2">·</span>
        <span className="capitalize">{agent.category || 'Uncategorized'}</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {agent.website_url && <TrackedLink href={agent.website_url} componentName="AgentDetail">Visit Website</TrackedLink>}
        {!isInCompare ? (
          <Button variant="outline" onClick={onAddToCompare}>Add to Compare</Button>
        ) : (
          <Button variant="default" asChild>
            <a href="/compare">Go to Compare</a>
          </Button>
        )}
        <Button
          variant={isFavorite ? "default" : "outline"}
          onClick={onFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={isFavorite ? "text-red-600" : "text-gray-500 hover:text-red-600"}
        >
          <Heart className={isFavorite ? "w-5 h-5 fill-current" : "w-5 h-5"} fill={isFavorite ? "currentColor" : "none"} />
          {isFavorite ? "Favorited" : "Add to Favorites"}
        </Button>
      </div>
    </div>
  </section>
));

const AgentSection = memo(({ title, children, color = "text-gray-800" }: any) => (
  <section className="bg-white rounded-2xl shadow p-6">
    <h2 className={`font-bold text-lg mb-2 ${color}`}>{title}</h2>
    {children}
  </section>
));

const AgentDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  
  console.log('🎯 AgentDetail component rendered with slug:', slug);
  console.log('👤 User:', user);
  
  // Main agent query - optimized to fetch only essential data first
  const { data: agent, isLoading, error } = useQuery({
    queryKey: ['agent', slug],
    queryFn: async () => {
      console.log('🔍 Fetching agent with slug:', slug);
      if (!slug) throw new Error('No slug provided');
      
      const { data, error } = await supabase
        .from('ai_agents')
        .select('id, name, slug, website_url, repository_url, linkedin_url, twitter_url, documentation_url, additional_resources_url, category, pricing_type, status, total_upvotes, total_reviews, average_rating, view_count, developer, description, tagline, logo_url, homepage_image_url, pricing_details, features, integrations, technical_specs, tags, "Use Cases"')
        .eq('slug', slug)
        .single();
      
      console.log('📊 Supabase response:', { data, error });
      console.log('🔍 Raw data from database:', data);
      console.log('📋 All available columns:', Object.keys(data || {}));
      
      if (error) {
        console.error('❌ Supabase error:', error);
        throw error;
      }
      if (!data) {
        console.log('⚠️ No agent found with slug:', slug);
        return null;
      }
      
      console.log('✅ Agent found:', data.name);
      console.log('📋 Use cases from DB:', data["Use Cases"]);
      console.log('📋 Use cases type:', typeof data["Use Cases"]);
      
      // Parse JSON fields efficiently
      const parsedData = {
        ...data,
        tags: typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags || [],
        features: typeof data.features === 'string' ? JSON.parse(data.features) : data.features || [],
        integrations: typeof data.integrations === 'string' ? JSON.parse(data.integrations) : data.integrations || [],
        technical_specs: typeof data.technical_specs === 'string' ? JSON.parse(data.technical_specs) : data.technical_specs || [],
        use_cases: data["Use Cases"] || [],
      };
      
      console.log('🔄 Parsed use cases:', parsedData.use_cases);
      
      return parsedData;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once
  });

  // Parallel queries for related data
  const [favoriteQuery, reviewsQuery, relatedQuery] = useQueries({
    queries: [
      {
        queryKey: ['favorite', agent?.id, user?.id],
        queryFn: async () => {
          if (!user?.id || !agent?.id) return false;
          const { data } = await supabase
            .from('user_favorites')
            .select('id')
            .eq('user_id', user.id)
            .eq('agent_id', agent.id)
            .single();
          return !!data;
        },
        enabled: !!user?.id && !!agent?.id,
        staleTime: 2 * 60 * 1000,
      },
      {
        queryKey: ['reviews', agent?.id],
        queryFn: async () => {
          if (!agent?.id) return [];
          const { data } = await supabase
            .from('agent_reviews')
            .select('*, profiles:profiles!agent_reviews_user_id_fkey(full_name,username)')
            .eq('agent_id', agent.id)
            .order('created_at', { ascending: false })
            .limit(10);
          return data || [];
        },
        enabled: !!agent?.id,
        staleTime: 2 * 60 * 1000,
      },
      {
        queryKey: ['related-agents', agent?.category, agent?.id],
        queryFn: async () => {
          if (!agent?.category || !agent?.id) return [];
          const { data } = await supabase
            .from('ai_agents')
            .select('id, name, slug, logo_url, category, average_rating')
            .eq('category', agent.category)
            .neq('id', agent.id)
            .limit(3);
          return data || [];
        },
        enabled: !!agent?.category && !!agent?.id,
        staleTime: 10 * 60 * 1000,
      }
    ]
  });

  const isFavorite = favoriteQuery.data || false;
  const reviews = reviewsQuery.data || [];
  const relatedAgents = relatedQuery.data || [];

  // Memoized handlers
  const handleFavoriteClick = useCallback(async () => {
    if (!user) {
      toast.error('You must be logged in to favorite agents.');
      return;
    }
    if (!agent?.id) return;
    
    try {
      if (isFavorite) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('agent_id', agent.id);
        toast.success('Removed from favorites');
      } else {
        await supabase
          .from('user_favorites')
          .insert({ user_id: user.id, agent_id: agent.id });
        toast.success('Added to favorites!');
      }
      favoriteQuery.refetch();
    } catch (error) {
      toast.error(isFavorite ? 'Failed to remove favorite' : 'Failed to add favorite');
    }
  }, [user, agent?.id, isFavorite, favoriteQuery]);

  const handleAddToCompare = useCallback(() => {
    if (!agent?.slug) return;
    let compare = [];
    try {
      compare = JSON.parse(localStorage.getItem('compare_agents') || '[]');
    } catch { compare = []; }
    
    if (compare.includes(agent.slug)) {
      toast.info('Agent already in comparison list.');
      return;
    }
    if (compare.length >= 3) {
      toast.error('You can only compare up to 3 agents.');
      return;
    }
    
    compare.push(agent.slug);
    localStorage.setItem('compare_agents', JSON.stringify(compare));
    window.dispatchEvent(new Event('compareAgentsChanged'));
    toast.success('Agent added to comparison!');
  }, [agent?.slug]);

  // Check if agent is in compare list
  const isInCompare = useMemo(() => {
    if (!agent?.slug) return false;
    try {
      const compare = JSON.parse(localStorage.getItem('compare_agents') || '[]');
      return compare.includes(agent.slug);
    } catch {
      return false;
    }
  }, [agent?.slug]);

  // Mixpanel tracking for Agent Viewed
  useEffect(() => {
    if (agent && agent.name) {
      mixpanel.track('Agent Viewed', {
        'agent name': agent.name,
        'page url': window.location.href,
        'session_id': window.sessionStorage.getItem('session_id') || 'unknown',
        'timestamp': new Date().toISOString(),
        'Referee': document.referrer,
      });
    }
  }, [agent]);

  // Optimized skeleton loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/20">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-8 animate-pulse">
            <div className="flex-1 space-y-6">
              <Skeleton className="h-10 w-2/3 mb-2" />
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-40 w-full rounded-lg mb-4" />
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-24 w-full rounded-lg mb-4" />
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-24 w-full rounded-lg mb-4" />
            </div>
            <div className="w-full md:w-80 flex-shrink-0">
              <Skeleton className="h-80 w-full rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !agent) {
    console.log('🚨 Error state:', { error, agent, slug, isLoading });
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agent Not Found</h2>
            <p className="text-gray-600 mb-2">We couldn't find an agent with the slug: <code className="bg-gray-100 px-2 py-1 rounded">{slug}</code></p>
            {error && (
              <p className="text-red-600 text-sm mt-2">
                Error: {error.message || 'Unknown error occurred'}
              </p>
            )}
            <div className="mt-6">
              <a href="/browse" className="text-blue-600 hover:text-blue-800 underline">
                ← Back to Browse
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <EnhancedMetaTags
        title={agent?.name ? `${agent.name} - ${agent.tagline || agent.short_description || 'AI Agent Details'} | AI Hub` : 'AI Agent Details | AI Hub'}
        description={agent?.description || agent?.short_description || 'Discover details, features, and reviews for this AI agent.'}
        keywords={agent?.tags?.join(', ') || 'AI agent, artificial intelligence, AI tool'}
        canonicalUrl={`https://ai-agents-hub.com/agent/${agent?.slug || slug}`}
        ogImage={agent?.logo_url || 'https://ai-agents-hub.com/og-image.jpg'}
        ogType="product"
      />
      <AdvancedSEO
        type="agent"
        data={agent}
      />
      <div className="min-h-screen bg-[#f7fafd]">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
          <AgentHero 
            agent={agent}
            isFavorite={isFavorite}
            isInCompare={isInCompare}
            onFavoriteClick={handleFavoriteClick}
            onAddToCompare={handleAddToCompare}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <main className="lg:col-span-2 space-y-6">
              {/* Homepage Screenshot - moved to left half, above Overview, no section title */}
              {agent.homepage_image_url && (
                <div className="bg-white rounded-2xl shadow p-4">
                  <img
                    src={agent.homepage_image_url}
                    alt={`${agent.name} homepage screenshot`}
                    className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Failed to load homepage screenshot:', agent.homepage_image_url);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <AgentSection title="Overview">
                <p className="text-gray-700">{agent.description || 'No overview provided.'}</p>
              </AgentSection>
              <AgentSection title="Use Cases" color="text-purple-700">
                <ul className="space-y-2">
                  {(agent.use_cases && agent.use_cases.length > 0
                    ? agent.use_cases
                    : ['No use cases listed.']
                  ).map((uc: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-green-700">
                      <Check className="w-5 h-5" />{uc}
                    </li>
                  ))}
                </ul>
              </AgentSection>
              
              <AgentSection title="Key Features" color="text-yellow-700">
                <ul className="space-y-2">
                  {(agent.features && agent.features.length > 0 ? agent.features : ['No features listed.']).map((f: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-green-700"><Check className="w-5 h-5" />{f}</li>
                  ))}
                </ul>
              </AgentSection>
              
              <AgentSection title="Pricing" color="text-blue-700">
                <p className="text-gray-700">{agent.pricing_details || 'No pricing information provided.'}</p>
                <div className="text-xs text-gray-500 mt-2 italic">{agent.pricing_type ? `Pricing Model: ${agent.pricing_type}` : ''}</div>
              </AgentSection>
              
              <AgentSection title="Technical Specifications">
                {agent.technical_specs && agent.technical_specs.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {agent.technical_specs.map((spec: string, i: number) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700">No technical specifications provided.</p>
                )}
              </AgentSection>
              
              {/* Lazy loaded reviews section */}
              <ReviewsSection agent={agent} reviews={reviews} />
            </main>
            
            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Explore More Section */}
              <section className="bg-white rounded-2xl shadow p-6">
                <div className="font-bold text-blue-700 text-sm mb-2 flex items-center gap-2">🌐 Explore More</div>
                <div className="flex flex-col gap-2">
                  {agent.website_url && (
                    <TrackedLink href={agent.website_url} componentName="AgentDetail">Visit Website</TrackedLink>
                  )}
                  {agent.repository_url && (
                    <TrackedLink href={agent.repository_url} componentName="AgentDetail">Repository</TrackedLink>
                  )}
                  {agent.linkedin_url && (
                    <TrackedLink href={agent.linkedin_url} componentName="AgentDetail">LinkedIn</TrackedLink>
                  )}
                  {agent.twitter_url && (
                    <TrackedLink href={agent.twitter_url} componentName="AgentDetail">Twitter/X</TrackedLink>
                  )}
                  {/* Show only one of Documentation or Resources if both are present and identical */}
                  {agent.documentation_url && agent.additional_resources_url && agent.documentation_url === agent.additional_resources_url ? (
                    <TrackedLink href={agent.documentation_url} componentName="AgentDetail">Documentation</TrackedLink>
                  ) : <>
                    {agent.documentation_url && (
                      <TrackedLink href={agent.documentation_url} componentName="AgentDetail">Documentation</TrackedLink>
                    )}
                    {agent.additional_resources_url && (!agent.documentation_url || agent.documentation_url !== agent.additional_resources_url) && (
                      <TrackedLink href={agent.additional_resources_url} componentName="AgentDetail">Resources</TrackedLink>
                    )}
                  </>}
                </div>
              </section>
              {/* Agent Information Section */}
              <section className="bg-white rounded-2xl shadow p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-blue-500" />Agent Information
                </h3>
                <div className="mb-3">
                  <div className="font-semibold text-sm mb-1">Integrations</div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(agent.integrations && agent.integrations.length > 0 ? agent.integrations : ['None']).map((int: string, i: number) => (
                      <Badge key={i} className="bg-purple-50 text-purple-700 border border-purple-100">{int}</Badge>
                    ))}
                  </div>
                  <div className="font-semibold text-sm mb-1">Tags</div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {(agent.tags && agent.tags.length > 0 ? agent.tags : ['None']).map((tag: string, i: number) => (
                      <Badge key={i} className="bg-green-100 text-green-800 border border-green-200 font-mono">#{tag}</Badge>
                    ))}
                  </div>
                  <div className="font-semibold text-sm mb-1">Category</div>
                  <div className="mb-2"><Badge className="bg-blue-50 text-blue-700 border border-blue-100">{agent.category || 'Uncategorized'}</Badge></div>
                  <div className="font-semibold text-sm mb-1">Pricing Model</div>
                  <div className="mb-2"><Badge className="bg-gray-50 text-gray-700 border border-gray-100">{agent.pricing_type || 'N/A'}</Badge></div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm"><Share2 className="w-4 h-4 mr-1" />Share</Button>
                  <Button variant="outline" size="sm"><Flag className="w-4 h-4 mr-1 text-red-500" />Report</Button>
                </div>
              </section>
              
              {/* Lazy loaded related agents */}
              <RelatedAgents agents={relatedAgents} />
            </aside>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default memo(AgentDetail);
