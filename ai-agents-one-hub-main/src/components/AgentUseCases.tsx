import type { Agent } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface AgentUseCasesProps {
  agent: Agent;
}

const AgentUseCases = ({ agent }: AgentUseCasesProps) => {
  // Generate use cases based on category
  const generateUseCases = (category: string) => {
    const useCaseMap: Record<string, string[]> = {
      conversational_ai: [
        'Customer support and service',
        'Virtual assistants for businesses',
        'Interactive chatbots for websites',
        'Voice-enabled applications',
        'Multilingual communication support'
      ],
      productivity: [
        'Task automation and scheduling',
        'Document analysis and summarization',
        'Workflow optimization',
        'Team collaboration enhancement',
        'Project management assistance'
      ],
      customer_service: [
        'Automated customer inquiries',
        'Ticket routing and prioritization',
        'FAQ automation',
        'Escalation management',
        'Customer satisfaction tracking'
      ],
      content_creation: [
        'Blog post and article writing',
        'Social media content generation',
        'Marketing copy creation',
        'Video script writing',
        'Creative storytelling'
      ],
      data_analysis: [
        'Business intelligence reporting',
        'Predictive analytics',
        'Data visualization',
        'Trend analysis',
        'Performance metrics tracking'
      ]
    };

    return useCaseMap[category] || [
      'Business process automation',
      'Decision support systems',
      'User experience enhancement',
      'Operational efficiency improvement',
      'Strategic planning assistance'
    ];
  };

  const useCases = generateUseCases(agent.category);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Use Cases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {useCases.map((useCase, index) => (
            <div key={index} className="flex items-start gap-3">
              <Target className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{useCase}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentUseCases;
