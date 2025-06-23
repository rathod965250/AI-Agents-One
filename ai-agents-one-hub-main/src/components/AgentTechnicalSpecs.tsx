import type { Agent } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

interface AgentTechnicalSpecsProps {
  agent: Agent;
}

const AgentTechnicalSpecs = ({ agent }: AgentTechnicalSpecsProps) => {
  const technicalSpecs = agent.technical_specs && agent.technical_specs.length > 0 ? agent.technical_specs : [];

  if (technicalSpecs.length === 0) {
    return null; // Don't render the card if there are no specs
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Technical Specifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {technicalSpecs.map((spec, index) => (
            <div key={index} className="flex items-start gap-3">
              <Settings className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{spec}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentTechnicalSpecs;
