import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Agent } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AgentCardSimple from './AgentCardSimple';

interface RelatedAgentsProps {
  currentAgentId: string;
  currentAgentCategory: string;
}

const RelatedAgents = ({ currentAgentId, currentAgentCategory }: RelatedAgentsProps) => {
  const navigate = useNavigate();
  
  const { data: relatedAgents, isLoading } = useQuery({
    queryKey: ['related-agents', currentAgentCategory, currentAgentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('category', currentAgentCategory)
        .neq('id', currentAgentId)
        .limit(3);
      
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!currentAgentCategory && !!currentAgentId,
  });

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (isLoading || !relatedAgents || relatedAgents.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {relatedAgents.map((agent) => (
        <AgentCardSimple
          key={agent.id}
          agent={agent}
          onClick={() => navigate(`/agent/${agent.slug}`)}
          tabIndex={0}
        />
      ))}
    </div>
  );
};

export default RelatedAgents;
