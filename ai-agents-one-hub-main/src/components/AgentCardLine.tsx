
import { Tables } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

type Agent = Tables<'ai_agents'>;

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

  return (
    <Card
      tabIndex={0}
      className="flex flex-col gap-3 p-4 bg-white border border-gray-200 shadow hover:shadow-lg transition-all duration-200 cursor-pointer outline-none focus:ring-2 focus:ring-blue-400 hover:border-blue-300"
      role="button"
      aria-label={`View details for ${agent.name}`}
      onClick={() => navigate(`/agent/${agent.slug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          navigate(`/agent/${agent.slug}`);
        }
      }}
    >
      <div className="flex items-start gap-3">
        {/* Logo */}
        <Avatar className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl text-lg flex-shrink-0 shadow-sm">
          <AvatarFallback className="bg-gradient-to-br from-blue-50 to-indigo-100 text-indigo-700 font-bold text-xl rounded-xl">
            {agent.name ? agent.name.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Agent Name */}
          <h3 className="font-semibold text-lg text-gray-900 truncate mb-1">
            {agent.name}
          </h3>
          
          {/* Tagline */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {generateTagline(agent)}
          </p>
          
          {/* Category and Pricing Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="text-xs border-gray-300 text-gray-700 bg-gray-50/80 font-medium"
            >
              {formatCategory(agent.category as string)}
            </Badge>
            <Badge
              className={`text-xs font-medium ${getPricingColor(agent.pricing_type as string)}`}
            >
              {getPricingBadgeText(agent.pricing_type as string)}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
