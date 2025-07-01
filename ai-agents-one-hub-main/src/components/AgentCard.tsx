import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ExternalLink, Plus, Minus, Sparkles } from 'lucide-react';
import { Agent as AgentType } from '@/integrations/supabase/types';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import mixpanel from 'mixpanel-browser';

type Agent = AgentType;

interface AgentCardProps {
  agent: Agent;
}

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

const AgentCard = ({ agent }: AgentCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isInCompare, setIsInCompare] = useState(false);

  useEffect(() => {
    // Track Agents Card Impression
    mixpanel.track('Agents Card Impression', {
      'agent name': agent.name,
      'component name': 'AgentCard',
      'page url': window.location.href,
      'session id': window.sessionStorage.getItem('session_id') || 'unknown',
      'Timestamp': new Date().toISOString(),
    });
    if (!agent?.slug) return;
    let compare = [];
    try {
      compare = JSON.parse(localStorage.getItem('compare_agents') || '[]');
    } catch { compare = []; }
    setIsInCompare(compare.includes(agent.slug));
  }, [agent]);

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!agent?.slug) return;
    let compare = [];
    try {
      compare = JSON.parse(localStorage.getItem('compare_agents') || '[]');
    } catch { compare = []; }
    if (compare.includes(agent.slug)) {
      // Remove from compare
      compare = compare.filter((slug: string) => slug !== agent.slug);
      localStorage.setItem('compare_agents', JSON.stringify(compare));
      setIsInCompare(false);
      window.dispatchEvent(new Event('compareAgentsChanged'));
      toast({
        title: 'Removed from comparison',
        description: `${agent.name} has been removed from your comparison list.`,
        variant: 'default',
      });
      return;
    }
    if (compare.length >= 3) {
      toast({
        title: 'Comparison limit reached',
        description: 'You can only compare up to 3 agents at a time.',
        variant: 'destructive',
      });
      return;
    }
    compare.push(agent.slug);
    localStorage.setItem('compare_agents', JSON.stringify(compare));
    setIsInCompare(true);
    window.dispatchEvent(new Event('compareAgentsChanged'));
    toast({
      title: 'Added to comparison',
      description: `${agent.name} has been added to your comparison list.`,
      variant: 'default',
    });
  };

  const handleCardClick = () => {
    // Track Agent Card Click
    mixpanel.track('Agent Card Click', {
      'agent name': agent.name,
      'page url': window.location.href,
      'session id': window.sessionStorage.getItem('session_id') || 'unknown',
      'Timestamp': new Date().toISOString(),
      'Referrer': document.referrer,
    });
    navigate(`/agent/${agent.slug}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/agent/${agent.slug}`);
  };

  return (
    <Card 
      className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl flex flex-col h-full relative cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      {/* Featured Badge - Enhanced */}
      {agent.status === 'featured' && (
        <div className="absolute top-0 right-0 z-10">
          <span
            className="inline-block px-4 py-1 text-xs font-bold uppercase tracking-wider shadow-md select-none"
            style={{
              background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 100%)', // directory color palette
              color: '#fff',
              borderRadius: '0 12px 0 12px',
              letterSpacing: '0.08em',
              borderTopRightRadius: '12px',
              borderBottomLeftRadius: '12px',
              borderTopLeftRadius: 0,
              borderBottomRightRadius: 0,
              boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)',
              transition: 'box-shadow 0.2s, transform 0.2s',
              animation: 'pulse-badge 1.5s infinite',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 4px 16px 0 rgba(99,102,241,0.18)';
              e.currentTarget.style.transform = 'scale(1.04)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(99,102,241,0.10)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            FEATURED
          </span>
          <style>{`
            @keyframes pulse-badge {
              0% { box-shadow: 0 2px 8px 0 rgba(99,102,241,0.10); }
              50% { box-shadow: 0 4px 16px 0 rgba(99,102,241,0.18); }
              100% { box-shadow: 0 2px 8px 0 rgba(99,102,241,0.10); }
            }
          `}</style>
        </div>
      )}
      
      <CardContent className="p-5 flex flex-col h-full">
        {/* Top Row: Logo + Name, Add to Compare */}
        <div className="flex items-start justify-between mb-2">
          {/* Logo and Name - Feature 1 */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {agent.logo_url ? (
              <img
                src={agent.logo_url}
                alt={agent.name + ' logo'}
                className="h-10 w-10 object-cover rounded border border-gray-200 bg-white flex-shrink-0"
              />
            ) : (
              <Avatar className="h-10 w-10 border border-gray-200 flex-shrink-0">
                <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold text-lg">
                  {agent.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg text-gray-900 hover:underline truncate">
                {agent.name}
              </h3>
            </div>
          </div>
          
          {/* Add to Compare Button - Feature 5 */}
          <Button
            size="icon"
            variant="outline"
            className="rounded-full border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex-shrink-0"
            onClick={handleToggleCompare}
            aria-label={isInCompare ? 'Remove from Compare' : 'Add to Compare'}
            tabIndex={0}
          >
            {isInCompare ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          </Button>
        </div>

        {/* Tagline */}
        {agent.tagline && (
          <div className="mb-2 min-h-[20px]">
            <p className="text-gray-700 text-sm break-words leading-snug" style={{wordBreak:'break-word'}}>{agent.tagline}</p>
          </div>
        )}

        {/* Category and Pricing Badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {/* Category Badge - Feature 4: Flexible for one line */}
          <Badge 
            variant="outline" 
            className="text-xs border-gray-300 text-gray-700 bg-gray-50 whitespace-nowrap max-w-full overflow-hidden text-ellipsis"
            style={{ maxWidth: '120px' }}
          >
            {formatCategory(agent.category)}
          </Badge>
          
          {/* Pricing Badge - Feature 3: Color doesn't change on hover */}
          <Badge 
            className={`text-xs font-medium ${getPricingColor(agent.pricing_type)} hover:${getPricingColor(agent.pricing_type)}`}
          >
            {getPricingBadgeText(agent.pricing_type)}
          </Badge>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3" />

        {/* Bottom: Rating and View Details - Feature 2: Changed to View Details */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-yellow-600 font-semibold text-base">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
            <span className="text-base font-bold">{agent.average_rating?.toFixed(1) || '--'}</span>
            <span className="text-gray-500 text-sm font-normal ml-1">({agent.total_reviews || 0})</span>
          </div>
          
          {/* View Details Button - Feature 2: Goes to agent details instead of website */}
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-600 hover:text-blue-800 p-2"
            onClick={handleViewDetails}
            aria-label="View agent details"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCard;
