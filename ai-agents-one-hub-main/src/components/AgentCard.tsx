import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUpRight, Heart, Star, ExternalLink, ChevronUp, BookmarkIcon } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AuthModal from './AuthModal';
import { Link } from 'react-router-dom';

type Agent = Tables<'ai_agents'>;

interface AgentCardProps {
  agent: Agent;
  onUpvote?: (agentId: string, newCount: number) => void;
  viewMode?: 'grid' | 'list';
}

const AgentCard = ({ agent, onUpvote, viewMode = 'grid' }: AgentCardProps) => {
  const { user } = useAuth();
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(agent.total_upvotes || 0);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (isUpvoted) {
        const { error } = await supabase
          .from('agent_upvotes')
          .delete()
          .eq('agent_id', agent.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setIsUpvoted(false);
        setUpvoteCount(prev => prev - 1);
        onUpvote?.(agent.id, upvoteCount - 1);
      } else {
        const { error } = await supabase
          .from('agent_upvotes')
          .insert({
            agent_id: agent.id,
            user_id: user.id,
          });
        
        if (error) throw error;
        
        setIsUpvoted(true);
        setUpvoteCount(prev => prev + 1);
        onUpvote?.(agent.id, upvoteCount + 1);
      }
    } catch (error: unknown) {
      toast.error('Failed to update upvote');
      console.error('Upvote error:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getPricingBadgeText = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'Free';
      case 'freemium': return 'Freemium';
      case 'paid': return 'Paid';
      case 'subscription': return 'Paid';
      default: return pricing;
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-gray-300 transition-all duration-200 group">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {agent.logo_url ? (
              <img
                src={agent.logo_url}
                alt={agent.name + ' logo'}
                className="h-16 w-16 object-cover rounded-full border border-gray-200 flex-shrink-0"
              />
            ) : (
              <Avatar className="h-16 w-16 border border-gray-200 flex-shrink-0">
                <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                  {agent.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <Link to={`/agent/${agent.slug}`} className="hover:text-blue-600">
                    <h3 className="font-semibold text-lg text-gray-900 truncate hover:underline">
                      {agent.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">AI Agent</p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    size="sm" 
                    asChild
                    className="text-xs px-3 py-1 bg-gray-900 text-white hover:bg-gray-800"
                  >
                    <a href={agent.website_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                    </a>
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                Discover this AI agent and explore its capabilities.
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-gray-50">
                    {formatCategory(agent.category)}
                  </Badge>
                  <Badge className={`text-xs font-medium border ${getPricingColor(agent.pricing_type)}`}>
                    {getPricingBadgeText(agent.pricing_type)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 hover:border-gray-300 transition-all duration-200 group">
      <CardContent className="p-6">
        {/* Logo at top left */}
        <div className="flex items-start mb-4">
          {agent.logo_url ? (
            <img
              src={agent.logo_url}
              alt={agent.name + ' logo'}
              className="h-16 w-16 object-cover rounded-full border border-gray-200"
            />
          ) : (
            <Avatar className="h-16 w-16 border border-gray-200">
              <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold text-xl">
                {agent.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        
        {/* Agent name - left aligned */}
        <div className="mb-2">
          <Link to={`/agent/${agent.slug}`} className="hover:text-blue-600">
            <h3 className="font-semibold text-lg text-gray-900 hover:underline">
              {agent.name}
            </h3>
          </Link>
        </div>

        {/* Description - left aligned */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            AI Agent
          </p>
        </div>

        {/* Category - left aligned */}
        <div className="mb-2">
          <Badge variant="outline" className="text-xs border-gray-300 text-gray-700 bg-gray-50">
            {formatCategory(agent.category)}
          </Badge>
        </div>

        {/* Pricing - left aligned */}
        <div>
          <Badge className={`text-xs font-medium border ${getPricingColor(agent.pricing_type)}`}>
            {getPricingBadgeText(agent.pricing_type)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
