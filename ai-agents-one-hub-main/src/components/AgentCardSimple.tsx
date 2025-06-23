
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tables } from '@/integrations/supabase/types';
import { useNavigate } from 'react-router-dom';

type DB_Agent = Tables<'ai_agents'>;
type DemoAgent = {
  id?: string | number;
  name: string;
  slug?: string;
  tagline?: string;
  website_url?: string;
  category: string;
  pricing_type: string;
  icon?: string;
};
// Allow both (merge) but support missing fields
type Agent = DB_Agent | DemoAgent;

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

  return (
    <Card
      tabIndex={tabIndex}
      className="p-3 flex flex-col gap-2 bg-white border border-gray-200 transition-shadow cursor-pointer outline-none hover:shadow-lg focus:ring-2 focus:ring-blue-400 animate-fade-in"
      role="button"
      aria-label={`View details for ${agent.name}`}
      onClick={onClick ? onClick : () => { if (href) navigate(href); }}
      onKeyDown={e => {
        if ((e.key === "Enter" || e.key === " ") && (onClick || href)) {
          if (onClick) onClick();
          else if (href) navigate(href);
        }
      }}
    >
      <CardContent className="p-0">
        <div className="flex items-start gap-3">
          {/* LOGO ICON */}
          <Avatar className="w-12 h-12 bg-gray-100 rounded-lg text-lg">
            <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold text-xl">
              {avatarText}
            </AvatarFallback>
          </Avatar>
          {/* NAME + TAGLINE */}
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base text-gray-900 truncate">{agent.name}</div>
            <div className="text-gray-600 text-xs mt-0.5 truncate">{tagline}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge
                variant="outline"
                className="text-xs border-gray-300 text-gray-700 bg-gray-50"
              >
                {formatCategory(agent.category)}
              </Badge>
              <Badge
                className={`text-xs font-medium border ${getPricingColor(agent.pricing_type)}`}
              >
                {getPricingBadgeText(agent.pricing_type)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentCardSimple;
