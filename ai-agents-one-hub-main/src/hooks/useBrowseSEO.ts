
import { useSearchParams } from "react-router-dom";
import { Tables } from "@/integrations/supabase/types";

type Agent = Tables<'ai_agents'>;

export const useBrowseSEO = (agents: Agent[] | undefined) => {
  const [searchParams] = useSearchParams();

  const generateSEOContent = () => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('q');
    
    let title = "Browse AI Agents - Discover the Best AI Tools & Assistants";
    let description = "Browse our comprehensive directory of AI agents and tools. Find chatbots, content creators, code assistants, and productivity tools. Compare features and read reviews.";
    let keywords = "browse AI agents, AI tools directory, artificial intelligence marketplace, AI assistants, productivity tools";

    if (categoryParam) {
      const categoryLabels: Record<string, string> = {
        'conversational_ai': 'Conversational AI & Chatbots',
        'productivity': 'Productivity AI Tools',
        'customer_service': 'Customer Service AI',
        'content_creation': 'Content Creation AI',
        'code_assistant': 'Code Assistant AI',
        'analytics': 'Analytics AI Tools',
        'marketing': 'Marketing AI Tools',
        'education': 'Education AI Tools'
      };
      
      const categoryLabel = categoryLabels[categoryParam] || categoryParam;
      title = `${categoryLabel} - Browse AI Agents & Tools | AI Hub`;
      description = `Discover the best ${categoryLabel.toLowerCase()} tools. Compare features, read reviews, and find the perfect AI solution for your ${categoryParam.replace('_', ' ')} needs.`;
      keywords = `${categoryParam} AI tools, ${categoryLabel.toLowerCase()}, AI ${categoryParam.replace('_', ' ')}, artificial intelligence ${categoryParam.replace('_', ' ')}`;
    }

    if (searchParam) {
      title = `"${searchParam}" AI Agents - Search Results | AI Hub`;
      description = `Search results for "${searchParam}" AI agents and tools. Find relevant AI solutions, compare features, and read user reviews.`;
      keywords = `${searchParam} AI tools, ${searchParam} artificial intelligence, ${searchParam} AI agents`;
    }

    return { title, description, keywords };
  };

  const { title, description, keywords } = generateSEOContent();

  // Generate structured data for the browse page
  const browseStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": `https://ai-agents-hub.com/browse${window.location.search}`,
    "mainEntity": {
      "@type": "ItemList",
      "name": "AI Agents Directory Results",
      "numberOfItems": agents?.length || 0,
      "itemListElement": agents?.slice(0, 10).map((agent, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "SoftwareApplication",
          "name": agent.name,
          "description": `${agent.name} - ${agent.category} AI tool`,
          "url": `https://ai-agents-hub.com/agent/${agent.slug}`,
          "category": agent.category,
          "offers": agent.pricing_type === 'free' ? {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          } : undefined
        }
      })) || []
    }
  };

  return {
    title,
    description,
    keywords,
    browseStructuredData
  };
};
