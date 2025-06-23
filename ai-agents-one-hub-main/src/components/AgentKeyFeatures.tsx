import type { Agent } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface AgentKeyFeaturesProps {
  agent: Agent;
}

const AgentKeyFeatures = ({ agent }: AgentKeyFeaturesProps) => {
  const features = agent.features && agent.features.length > 0 ? agent.features : [];

  if (features.length === 0) {
    return null; // Don't render the card if there are no features
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Key Features</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentKeyFeatures;
