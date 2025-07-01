import { Agent as AgentType } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Scale, ExternalLink, Plus, Minus, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import mixpanel from 'mixpanel-browser';

type Agent = AgentType;

const categoryDisplay: Record<string, string> = {
  conversational_ai: "Conversational AI",
  image_generation: "Image Generation",
  content_creation: "Content Creation",
  data_analysis: "Data Analysis",
  code_assistant: "Code Assistant",
  voice_ai: "Voice AI",
  automation: "Automation",
  research: "Research",
  translation: "Translation",
  customer_support: "Customer Support",
  marketing: "Marketing",
  productivity: "Productivity",
  education: "Education",
  healthcare: "Healthcare",
  finance: "Finance",
  gaming: "Gaming",
  ai_agent_builders: "AI Agent Builders",
  coding: "Coding",
  personal_assistant: "Personal Assistant",
  general_purpose: "General Purpose",
  digital_workers: "Digital Workers",
  design: "Design",
  sales: "Sales",
  business_intelligence: "Business Intelligence",
  hr: "HR",
  science: "Science",
  other: "Other",
};

function getPricingColor(pricing: string) {
  switch (pricing) {
    case "free":
      return "bg-green-100 text-green-800 border-green-200";
    case "freemium":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "paid":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "subscription":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

function getPricingBadgeText(pricing: string) {
  switch (pricing) {
    case "free":
      return "Free";
    case "freemium":
      return "Freemium";
    case "paid":
      return "Paid";
    case "subscription":
      return "Subscription";
    default:
      return pricing;
  }
}

function formatCategory(category: string) {
  return (
    categoryDisplay[category] ||
    category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

// Generate a tagline from the agent's category and pricing if no specific tagline exists
function generateTagline(agent: Agent): string {
  const categoryName = formatCategory(agent.category as string);
  const pricingText = getPricingBadgeText(agent.pricing_type as string);
  return `${categoryName} • ${pricingText} Solution`;
}

export default function AgentCardLine({
  agent,
}: {
  agent: Agent;
}) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isInCompare, setIsInCompare] = useState(false);

  useEffect(() => {
    // Track Agents Card Impression
    mixpanel.track('Agents Card Impression', {
      'agent name': agent.name,
      'component name': 'AgentCardLine',
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
      tabIndex={0}
      className="flex flex-col gap-3 p-4 bg-white border border-gray-200 shadow hover:shadow-lg transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-300 relative"
      role="button"
      aria-label={`View details for ${agent.name}`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
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
      
      <div className="flex items-start gap-3">
        {/* Logo - Feature 1: Logo with name to the right */}
        {agent.logo_url ? (
          <img
            src={agent.logo_url}
            alt={agent.name + ' logo'}
            className="w-14 h-14 object-cover rounded-xl border border-gray-200 bg-white flex-shrink-0 shadow-sm"
          />
        ) : (
          <Avatar className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl text-lg flex-shrink-0 shadow-sm">
            <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-100 text-indigo-700 font-bold text-xl rounded-xl">
              {agent.name ? agent.name.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Agent Name - Feature 1: Moved to right of logo */}
          <h3 className="font-semibold text-lg text-gray-900 truncate mb-1">
            {agent.name}
          </h3>
          
          {/* Tagline */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {generateTagline(agent)}
          </p>
          
          {/* Category and Pricing Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Category Badge - Feature 4: Flexible for one line */}
            <Badge
              variant="outline"
              className="text-xs border-gray-300 text-gray-700 bg-gray-50/80 font-medium whitespace-nowrap max-w-full overflow-hidden text-ellipsis"
              style={{ maxWidth: '150px' }}
            >
              {formatCategory(agent.category as string)}
            </Badge>
            {/* Pricing Badge - Feature 3: Color doesn't change on hover */}
            <Badge
              className={`text-xs font-medium ${getPricingColor(agent.pricing_type as string)} hover:${getPricingColor(agent.pricing_type as string)}`}
            >
              {getPricingBadgeText(agent.pricing_type as string)}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Add to Compare Button - Feature 5 */}
            <Button
              size="sm"
              variant={isInCompare ? "default" : "outline"}
              onClick={handleToggleCompare}
              className="text-xs"
            >
              {isInCompare ? <Minus className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
              {isInCompare ? "Remove" : "Add to Compare"}
            </Button>
            {/* View Details Button - Feature 2: Goes to agent details instead of website */}
            <Button
              size="sm"
              variant="outline"
              onClick={handleViewDetails}
              className="text-xs"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
