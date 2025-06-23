
import AgentCardLine from '@/components/AgentCardLine';
import { Skeleton } from '@/components/ui/skeleton';
import { Tables } from '@/integrations/supabase/types';

type Agent = Tables<'ai_agents'>;

interface BrowsePageContentProps {
  agents: Agent[] | undefined;
  isLoading: boolean;
}

const BrowsePageContent = ({ agents, isLoading }: BrowsePageContentProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (agents && agents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No agents found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents?.map(agent => (
        <AgentCardLine key={agent.id} agent={agent} />
      ))}
    </div>
  );
};

export default BrowsePageContent;
