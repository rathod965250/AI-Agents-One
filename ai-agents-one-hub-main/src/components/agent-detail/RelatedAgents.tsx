import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface RelatedAgentsProps {
  agents: any[];
}

const RelatedAgents = memo(({ agents }: RelatedAgentsProps) => {
  const placeholderLogo = '/placeholder.svg';

  return (
    <section className="bg-white rounded-2xl shadow p-6">
      <h3 className="font-bold text-lg mb-4">Related Agents</h3>
      <div className="space-y-3">
        {agents.length === 0 ? (
          <div className="text-gray-400">No related agents found.</div>
        ) : (
          agents.map((agent) => (
            <div key={agent.id} className="flex items-center gap-3">
              <img 
                src={agent.logo_url || placeholderLogo} 
                alt={agent.name} 
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = placeholderLogo;
                }}
              />
              <div>
                <div className="font-medium text-gray-800">{agent.name}</div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>{agent.average_rating?.toFixed(1) || '—'}</span>
                  <span className="ml-2">{agent.category}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Button variant="outline" className="w-full mt-4">View All Agents</Button>
    </section>
  );
});

export default RelatedAgents; 