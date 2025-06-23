
import { Check, X, Star } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type Agent = Tables<'ai_agents'>;

interface ComparisonFeature {
  name: string;
  description: string;
}

interface AIToolComparisonProps {
  agents: Agent[];
  features: ComparisonFeature[];
  title?: string;
  className?: string;
}

const AIToolComparison = ({ 
  agents, 
  features, 
  title = "AI Tool Comparison", 
  className = "" 
}: AIToolComparisonProps) => {
  // Mock feature availability for demonstration
  const getFeatureAvailability = (agentId: string, featureIndex: number): boolean => {
    // This would typically come from your database
    return Math.random() > 0.3; // Random for demo purposes
  };

  return (
    <section className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2">Compare features and capabilities across AI tools</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left font-semibold text-gray-900 min-w-[200px]">
                Features
              </th>
              {agents.slice(0, 3).map((agent) => (
                <th key={agent.id} className="px-6 py-4 text-center font-semibold text-gray-900 min-w-[150px]">
                  <div className="space-y-2">
                    <div className="font-bold">{agent.name}</div>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">
                        {agent.average_rating || 'N/A'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {agent.pricing_type}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {features.map((feature, featureIndex) => (
              <tr key={featureIndex} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-gray-900">{feature.name}</div>
                    <div className="text-sm text-gray-600">{feature.description}</div>
                  </div>
                </td>
                {agents.slice(0, 3).map((agent) => (
                  <td key={agent.id} className="px-6 py-4 text-center">
                    {getFeatureAvailability(agent.id, featureIndex) ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-400 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="flex gap-4 justify-center">
          {agents.slice(0, 3).map((agent) => (
            <a
              key={agent.id}
              href={`/agent/${agent.slug}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Learn More About {agent.name}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIToolComparison;
