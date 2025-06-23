
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, Database } from '@/integrations/supabase/types';
import AgentCardLine from './AgentCardLine';
import { Skeleton } from '@/components/ui/skeleton';

type Agent = Tables<'ai_agents'>;
type AgentCategory = Database['public']['Enums']['agent_category'];
type PricingType = Database['public']['Enums']['pricing_type'];

const AgentGrid = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [pricingFilter, setPricingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('upvotes');
  const [agents, setAgents] = useState<Agent[]>([]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_name', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const {
    data,
    isLoading,
    error
  } = useQuery({
    queryKey: ['agents', searchQuery, categoryFilter, pricingFilter, sortBy],
    queryFn: async () => {
      let query = supabase.from('ai_agents').select('*').in('status', ['approved', 'featured']);
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,tagline.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter as AgentCategory);
      }
      if (pricingFilter !== 'all') {
        query = query.eq('pricing_type', pricingFilter as PricingType);
      }
      switch (sortBy) {
        case 'upvotes':
          query = query.order('total_upvotes', {
            ascending: false
          });
          break;
        case 'rating':
          query = query.order('average_rating', {
            ascending: false
          });
          break;
        case 'newest':
          query = query.order('created_at', {
            ascending: false
          });
          break;
        case 'name':
          query = query.order('name', {
            ascending: true
          });
          break;
      }
      const {
        data,
        error
      } = await query;
      if (error) throw error;
      return data;
    }
  });

  useEffect(() => {
    if (data) {
      setAgents(data);
    }
  }, [data]);

  const handleUpvote = (agentId: string, newCount: number) => {
    setAgents(prev => prev.map(agent => agent.id === agentId ? {
      ...agent,
      total_upvotes: newCount
    } : agent));
  };

  if (error) {
    return <div className="text-center py-12">
        <p className="text-gray-500">Error loading agents. Please try again.</p>
      </div>;
  }

  return <div id="agents-section" className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recently Added</h2>
          <p className="text-gray-600">Discover the latest AI agents added to our platform</p>
        </div>
        {/* Results */}
        {isLoading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({
          length: 6
        }).map((_, i) => <div key={i} className="space-y-4">
                <Skeleton className="h-28 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>)}
          </div> : agents.length === 0 ? <div className="text-center py-12">
            <p className="text-gray-500">No agents found matching your criteria.</p>
          </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.slice(0, 6).map(agent => (
              <AgentCardLine key={agent.id} agent={agent} />
            ))}
          </div>}
      </div>
    </div>;
};

export default AgentGrid;
