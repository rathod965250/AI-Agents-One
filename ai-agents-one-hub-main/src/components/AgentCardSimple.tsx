import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Agent as AgentType } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ExternalLink, Plus, Minus, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import mixpanel from 'mixpanel-browser';

type DemoAgent = {
  id?: string | number;
  name: string;
  slug?: string;
  tagline?: string;
  website_url?: string;
  category: string;
  pricing_type: string;
  icon?: string;
  status?: string;
  logo_url?: string;
  average_rating?: number;
  total_reviews?: number;
};
// Allow both (merge) but support missing fields
type Agent = AgentType | DemoAgent;

const categoryDisplay: Record<string, string> = {
  conversational_ai: "Conversational AI",
  data_analysis: "Data Analysis",
  development: "Development",
  automation: "Automation",
  creative: "Creative",
  security: "Security"
};

function getPricingColor(pricing: string) {
  switch (pricing) {
    case 'free': return 'bg-green-100 text-green-800';
    case 'freemium': return 'bg-blue-100 text-blue-800';
    case 'paid': return 'bg-purple-100 text-purple-800';
    case 'subscription': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function getPricingBadgeText(pricing: string) {
  switch (pricing) {
    case 'free': return 'Free';
    case 'freemium': return 'Freemium';
    case 'paid': return 'Paid';
    case 'subscription': return 'Subscription';
    default: return pricing;
  }
}

function formatCategory(category: string) {
  return (
    categoryDisplay[category] ||
    category.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  );
}

interface AgentCardSimpleProps {
  agent: Agent;
  onClick?: () => void;
  tabIndex?: number;
}

const AgentCardSimple = ({ agent, onClick, tabIndex = 0 }: AgentCardSimpleProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isInCompare, setIsInCompare] = useState(false);
  
  // Handle both DB and demo agents
  const href = 'slug' in agent && agent.slug ? `/agent/${agent.slug}` : undefined;

  // Use icon only if it's present; otherwise fallback
  const avatarText = ('icon' in agent && agent.icon)
    ? agent.icon
    : (agent.name ? agent.name.charAt(0) : '?');

  // Tagline: if present (demo), if not, use website_url, if not, use dash
  const tagline = ('tagline' in agent && agent.tagline)
    ? agent.tagline
    : (agent.website_url || '—');

  useEffect(() => {
    // Track Agents Card Impression
    mixpanel.track('Agents Card Impression', {
      'agent name': agent.name,
      'component name': 'AgentCardSimple',
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
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (href) {
      navigate(href);
    }
  };

  return (
    <Card
      tabIndex={tabIndex}
      className="p-3 flex flex-col gap-2 bg-white border border-gray-200 transition-shadow cursor-pointer outline-none hover:shadow-lg focus:ring-2 focus:ring-blue-400 animate-fade-in relative"
      role="button"
      aria-label={`View details for ${agent.name}`}
      onClick={handleCardClick}
      onKeyDown={e => {
        if ((e.key === "Enter" || e.key === " ") && (onClick || href)) {
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
              background: 'linear-gradient(90deg, #6366f1 0%, #a21caf 100%)',
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
      
      <CardContent className="p-0">
        <div className="flex items-start gap-3">
          {/* LOGO ICON */}
          {agent.logo_url ? (
            <img
              src={agent.logo_url}
              alt={agent.name + ' logo'}
              className="w-12 h-12 object-cover rounded-lg border border-gray-200 bg-white flex-shrink-0"
            />
          ) : (
            <Avatar className="w-12 h-12 bg-gray-100 rounded-lg text-lg flex-shrink-0">
              <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold text-xl">
                {avatarText}
              </AvatarFallback>
            </Avatar>
          )}
          
          {/* NAME + TAGLINE - Feature 1: Name moved to right of logo */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base text-gray-900 truncate">{agent.name}</div>
            <div className="text-gray-600 text-xs mt-0.5 truncate">{tagline}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Category Badge - Feature 4: Flexible for one line */}
              <Badge
                variant="outline"
                className="text-xs border-gray-300 text-gray-700 bg-gray-50 whitespace-nowrap max-w-full overflow-hidden text-ellipsis"
                style={{ maxWidth: '100px' }}
              >
                {formatCategory(agent.category)}
              </Badge>
              {/* Pricing Badge - Feature 3: Color doesn't change on hover */}
              <Badge
                className={`text-xs font-medium border ${getPricingColor(agent.pricing_type)} hover:${getPricingColor(agent.pricing_type)}`}
              >
                {getPricingBadgeText(agent.pricing_type)}
              </Badge>
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
            {isInCompare ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>
        
        {/* Bottom: Rating and View Details - Feature 2: Changed to View Details */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-yellow-600 font-semibold text-sm">
            <span className="text-sm font-bold">{agent.average_rating?.toFixed(1) || '--'}</span>
            <span className="text-gray-500 text-xs font-normal ml-1">({agent.total_reviews || 0})</span>
          </div>
          
          {/* View Details Button - Feature 2: Goes to agent details instead of website */}
          <Button
            size="sm"
            variant="ghost"
            className="text-blue-600 hover:text-blue-800 p-1"
            onClick={handleViewDetails}
            aria-label="View agent details"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCardSimple;
