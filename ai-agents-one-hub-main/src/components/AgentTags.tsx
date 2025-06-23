
import { Tables } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type Agent = Tables<'ai_agents'>;

interface AgentTagsProps {
  agent: Agent;
}

const AgentTags = ({ agent }: AgentTagsProps) => {
  // Generate tags based on category and pricing type since tags field was removed
  const generateTags = (category: string, pricingType: string) => {
    const categoryTags: Record<string, string[]> = {
      conversational_ai: ['chatbot', 'nlp', 'voice-ai', 'conversation'],
      productivity: ['automation', 'workflow', 'efficiency', 'task-management'],
      customer_service: ['support', 'helpdesk', 'customer-care', 'ticketing'],
      content_creation: ['writing', 'content', 'copywriting', 'creative'],
      data_analysis: ['analytics', 'insights', 'reporting', 'visualization'],
      gaming: ['game-ai', 'interactive', 'entertainment', 'simulation'],
      healthcare: ['medical', 'health-tech', 'diagnosis', 'patient-care'],
      education: ['learning', 'teaching', 'e-learning', 'training']
    };

    const pricingTags = {
      free: ['free'],
      freemium: ['freemium', 'free-tier'],
      paid: ['premium'],
      subscription: ['subscription', 'saas']
    };

    const generalTags = ['ai-agent', 'artificial-intelligence', 'machine-learning'];

    return [
      ...generalTags,
      ...(categoryTags[category] || []),
      ...(pricingTags[pricingType] || [])
    ];
  };

  const tags = generateTags(agent.category, agent.pricing_type);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-sm border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentTags;
