import type { Agent } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AgentOverviewProps {
  agent: Agent;
}

const AgentOverview = ({ agent }: AgentOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line text-base">
          {agent.description || 'No overview provided.'}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentOverview;
