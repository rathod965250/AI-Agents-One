
import { Tables } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Check } from 'lucide-react';

type Agent = Tables<'ai_agents'>;

interface AgentPricingProps {
  agent: Agent;
}

const AgentPricing = ({ agent }: AgentPricingProps) => {
  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'freemium': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPricingTitle = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'Free to Use';
      case 'freemium': return 'Freemium Model';
      case 'paid': return 'One-time Payment';
      default: return 'Pricing Available';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <Badge className={`text-sm font-medium mb-3 ${getPricingColor(agent.pricing_type)}`}>
            {getPricingTitle(agent.pricing_type)}
          </Badge>
          
          <p className="text-sm text-gray-600 mb-4">
            Visit the website to learn more about pricing details.
          </p>
        </div>

        <div className="space-y-2">
          {agent.pricing_type === 'free' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500" />
              <span>No cost to get started</span>
            </div>
          )}
          
          {agent.pricing_type === 'freemium' && (
            <>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500" />
                <span>Free tier available</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="h-4 w-4 text-green-500" />
                <span>Premium features available</span>
              </div>
            </>
          )}
          
          {agent.pricing_type === 'paid' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500" />
              <span>One-time purchase</span>
            </div>
          )}
        </div>

        <Button asChild className="w-full" size="lg">
          <a href={agent.website_url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Started
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgentPricing;
