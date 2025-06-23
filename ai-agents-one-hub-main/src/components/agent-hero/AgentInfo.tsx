import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Eye, Calendar } from 'lucide-react';
import type { Agent } from '@/integrations/supabase/types';

interface AgentInfoProps {
  agent: Agent;
}

export const AgentInfo = ({ agent }: AgentInfoProps) => {
  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'freemium': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
      case 'subscription': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Generate a tagline based on the agent's category and pricing
  const generateTagline = (agent: Agent): string => {
    const categoryName = formatCategory(agent.category);
    const pricingText = agent.pricing_type.charAt(0).toUpperCase() + agent.pricing_type.slice(1);
    return `${categoryName} • ${pricingText} Solution`;
  };

  return (
    <div className="flex-1">
      <div className="flex items-start gap-4 mb-6">
        <Avatar className="h-20 w-20 border-2 border-gray-200">
          <AvatarFallback className="bg-gray-100 text-gray-600 font-bold text-xl">
            {agent.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{agent.name}</h1>
            {agent.status === 'featured' && (
              <Badge className="bg-orange-100 text-orange-800">
                Featured
              </Badge>
            )}
          </div>
          {agent.developer && (
            <div className="flex items-center gap-2 mb-2 text-gray-600 text-base">
              <span className="font-medium">by {agent.developer}</span>
            </div>
          )}
          
          <h2 className="text-xl text-gray-600 mb-4">{generateTagline(agent)}</h2>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="outline" className="border-gray-300 text-gray-700">
              {formatCategory(agent.category)}
            </Badge>
            <Badge className={getPricingColor(agent.pricing_type)}>
              {agent.pricing_type.charAt(0).toUpperCase() + agent.pricing_type.slice(1)}
            </Badge>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{agent.average_rating || '0.0'}</span>
              <span>({agent.total_reviews || 0} reviews)</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{agent.view_count || 0} views</span>
            </div>
            
            {agent.launch_date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Launched {new Date(agent.launch_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
