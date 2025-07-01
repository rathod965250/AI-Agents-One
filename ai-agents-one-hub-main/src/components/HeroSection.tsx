import { useState, useEffect, useRef, Suspense, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Agent as AgentType } from '@/integrations/supabase/types';
import HeroBadge from './hero/HeroBadge';
import SearchBar from './hero/SearchBar';
import HeroStats from './hero/HeroStats';
import { Skeleton } from '@/components/ui/skeleton';

type Agent = AgentType;

interface HeroSectionProps {
  onSearchResults?: (results: Agent[], query: string) => void;
}

const MemoHeroStats = memo(HeroStats);
const MemoHeroBadge = memo(HeroBadge);
const MemoSearchBar = memo(SearchBar);

const HeroSection = ({ onSearchResults }: HeroSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceTimeout = useRef<number | null>(null);

  // Debounce search input for efficient querying
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = window.setTimeout(
      () => setDebouncedQuery(searchQuery.trim()),
      400
    );
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchQuery]);

  // Fetch real-time agent count
  const { data: agentCount, isLoading: isAgentCountLoading } = useQuery({
    queryKey: ['agentCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('ai_agents')
        .select('*', { count: 'exact', head: true })
        .in('status', ['approved', 'featured']);
      if (error) {
        console.error('Error fetching agent count:', error);
        return 3500; // fallback
      }
      return count || 0;
    },
  });

  // Fetch real-time category count
  const { data: categoryCount, isLoading: isCategoryCountLoading } = useQuery({
    queryKey: ['categoryCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      if (error) {
        console.error('Error fetching category count:', error);
        return 50; // fallback
      }
      return count || 0;
    },
  });

  // Generate keywords based on category and other attributes
  const generateKeywords = (agent: Agent): string[] => {
    const categoryKeywords: Record<string, string[]> = {
      conversational_ai: ['chatbot', 'nlp', 'voice', 'conversation', 'chat', 'assistant'],
      image_generation: ['image', 'art', 'creative', 'visual', 'design', 'picture'],
      content_creation: ['writing', 'content', 'copywriting', 'creative', 'blog'],
      data_analysis: ['analytics', 'insights', 'reporting', 'visualization', 'data'],
      code_assistant: ['coding', 'programming', 'development', 'code', 'developer'],
      voice_ai: ['voice', 'speech', 'audio', 'sound', 'vocal'],
      automation: ['workflow', 'efficiency', 'task', 'auto', 'process'],
      research: ['analysis', 'study', 'investigation', 'academic'],
      translation: ['language', 'translate', 'multilingual', 'localization'],
      customer_support: ['support', 'helpdesk', 'customer', 'service'],
      marketing: ['promotion', 'advertising', 'campaigns', 'social'],
      productivity: ['efficiency', 'organization', 'management', 'workflow'],
      education: ['learning', 'teaching', 'training', 'educational'],
      healthcare: ['medical', 'health', 'diagnosis', 'patient'],
      finance: ['financial', 'money', 'banking', 'investment'],
      gaming: ['game', 'entertainment', 'interactive', 'fun'],
      ai_agent_builders: ['builder', 'creator', 'development', 'platform'],
      coding: ['programming', 'development', 'software', 'code'],
      personal_assistant: ['assistant', 'helper', 'personal', 'organizer'],
      general_purpose: ['versatile', 'multi', 'general', 'universal'],
      digital_workers: ['worker', 'employee', 'automation', 'digital'],
      design: ['creative', 'visual', 'graphics', 'ui', 'ux'],
      sales: ['selling', 'revenue', 'leads', 'crm'],
      business_intelligence: ['bi', 'analytics', 'insights', 'business'],
      hr: ['human resources', 'recruitment', 'hiring', 'employee'],
      science: ['research', 'scientific', 'laboratory', 'analysis'],
      other: ['miscellaneous', 'various', 'different']
    };

    const pricingKeywords = {
      free: ['free', 'no-cost', 'gratis'],
      freemium: ['freemium', 'free-tier', 'limited-free'],
      paid: ['premium', 'paid', 'subscription']
    };

    return [
      ...(categoryKeywords[agent.category] || []),
      ...(pricingKeywords[agent.pricing_type] || []),
      'ai', 'artificial-intelligence', 'agent'
    ];
  };

  // Enhanced search functionality
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['search-agents', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];

      console.log('[SEARCH] Starting search for:', debouncedQuery);

      const searchTerms = debouncedQuery.toLowerCase().split(/\s+/).filter(term => term.length > 0);
      console.log('[SEARCH] Search terms:', searchTerms);

      // First, get all approved/featured agents
      const { data: allAgents, error } = await supabase
        .from('ai_agents')
        .select('*')
        .in('status', ['approved', 'featured']);

      if (error) {
        console.error('[SEARCH] Error:', error);
        return [];
      }

      console.log('[SEARCH] Total agents retrieved:', allAgents?.length || 0);

      if (!allAgents) return [];

      // Filter agents based on search terms
      const filteredAgents = allAgents.filter(agent => {
        const keywords = generateKeywords(agent);
        const searchableText = [
          agent.name,
          agent.category,
          ...keywords
        ].join(' ').toLowerCase();

        // Check if any search term matches
        return searchTerms.some(term => 
          searchableText.includes(term) ||
          agent.name.toLowerCase().includes(term) ||
          agent.category.toLowerCase().includes(term)
        );
      });

      // Sort by relevance (exact name matches first, then by upvotes)
      const sortedResults = filteredAgents.sort((a, b) => {
        const aNameMatch = searchTerms.some(term => a.name.toLowerCase().includes(term));
        const bNameMatch = searchTerms.some(term => b.name.toLowerCase().includes(term));
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        return (b.total_upvotes || 0) - (a.total_upvotes || 0);
      });

      console.log('[SEARCH] Found agents:', sortedResults.length);
      console.log('[SEARCH] Results sample:', sortedResults.slice(0, 3).map(a => a.name));

      return sortedResults.slice(0, 100); // Limit to 100 results
    },
    enabled: !!debouncedQuery,
  });

  // Update parent on search results change
  useEffect(() => {
    if (debouncedQuery) {
      onSearchResults?.(searchResults || [], debouncedQuery);
    } else {
      onSearchResults?.([], '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults, debouncedQuery]);

  // --- HANDLERS ---
  const handleSearch = () => {
    if (debouncedQuery) {
      const agentsSection = document.querySelector('#agents-section');
      agentsSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const displayCount = agentCount ? agentCount.toLocaleString() : '3,500';
  const displayCategoryCount = categoryCount ? categoryCount.toLocaleString() : '50';

  return (
    <section className="bg-gradient-to-br from-blue-50 via-purple-50/30 to-indigo-50/20 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-100/30 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      <div className="absolute top-8 left-8 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-8 right-8 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center">
          <MemoHeroBadge agentCount={displayCount} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 mt-2 leading-tight">
            Discover the Best <span className="text-blue-600">AI Agents</span> for Every Need
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl">
            Explore, compare, and find the perfect AI tools for productivity, creativity, automation, and more. Over <span className="font-bold text-blue-700">{isAgentCountLoading ? <span className="inline-block align-middle"><Skeleton className='h-5 w-16' /></span> : displayCount}</span> agents across <span className="font-bold text-blue-700">{isCategoryCountLoading ? <span className="inline-block align-middle"><Skeleton className='h-5 w-10' /></span> : displayCategoryCount}</span> categories.
          </p>
          <div className="w-full max-w-2xl mb-8">
            <Suspense fallback={<Skeleton className="h-12 w-full rounded-lg" />}>
              <MemoSearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearch={handleSearch}
                onKeyDown={handleKeyDown}
                isSearching={isSearching}
                agentCount={displayCount}
              />
            </Suspense>
          </div>
          <MemoHeroStats agentCount={displayCount} categoryCount={displayCategoryCount} />
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);
