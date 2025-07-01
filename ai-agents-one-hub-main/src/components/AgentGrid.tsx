import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Agent as AgentType } from '@/integrations/supabase/types';
import AgentCard from './AgentCard';
import { Skeleton } from '@/components/ui/skeleton';

type Agent = AgentType;

const AgentGrid = () => {
  const { data: agents = [], isLoading } = useQuery<Agent[]>({
    queryKey: ['homepage-agents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .in('status', ['approved', 'featured'])
        .order('created_at', { ascending: false })
        .limit(6);
      if (error) throw error;
      return data as Agent[];
    },
  });

  return (
    <div id="agents-section" className="py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Recently Added</h2>
          <p className="text-gray-600">Discover the latest AI agents added to our platform</p>
        </div>
        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-40 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No agents found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentGrid;
