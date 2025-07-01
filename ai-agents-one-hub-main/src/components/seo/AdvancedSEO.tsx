import { useEffect } from 'react';

interface AgentData {
  name: string;
  category: string;
  slug: string;
  homepage_image_url?: string;
  website_url: string;
  pricing_type: string;
  average_rating?: number;
  total_reviews?: number;
}

interface AdvancedSEOProps {
  type: 'homepage' | 'agent' | 'browse' | 'category' | 'categories' | 'submit' | 'compare' | 'dashboard' | 'notfound';
  data?: any;
  faqData?: Array<{ question: string; answer: string }>;
  howToData?: Array<{ step: string; description: string }>;
}

const AdvancedSEO = ({ type, data, faqData, howToData }: AdvancedSEOProps) => {
  useEffect(() => {
    // Clean up existing structured data
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach(schema => {
      if (schema.id?.startsWith('advanced-')) {
        schema.remove();
      }
    });

    const schemas: Record<string, unknown>[] = [];

    // Organization Schema (always include)
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "AI Agents Hub",
      "url": "https://ai-agents-hub.com",
      "logo": "https://ai-agents-hub.com/logo.png",
      "description": "The largest directory of AI agents and tools, helping users discover and compare artificial intelligence solutions.",
      "foundingDate": "2024",
      "areaServed": "Worldwide",
      "knowsAbout": [
        "Artificial Intelligence",
        "Machine Learning", 
        "AI Agents",
        "Automation",
        "Productivity Tools",
        "Chatbots",
        "Content Creation AI",
        "Code Assistants"
      ],
      "sameAs": [
        "https://twitter.com/aiagentshub",
        "https://linkedin.com/company/aiagentshub"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "support@ai-agents-hub.com"
      }
    });

    // Website Schema with search action
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "AI Agents Hub",
      "url": "https://ai-agents-hub.com",
      "description": "Discover and compare the best AI agents and tools for productivity, creativity, and automation.",
      "inLanguage": "en-US",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://ai-agents-hub.com/browse?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });

    // Type-specific schemas
    if (type === 'agent' && data && typeof data === 'object' && 'name' in data) {
      const agentData = data as AgentData;
      // Enhanced Product Schema for AI Agents
      schemas.push({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": agentData.name,
        "description": `${agentData.name} is an innovative AI agent in the ${agentData.category.replace('_', ' ')} category. This AI tool helps users enhance their workflow with artificial intelligence capabilities.`,
        "url": `https://ai-agents-hub.com/agent/${agentData.slug}`,
        "image": agentData.homepage_image_url || "https://ai-agents-hub.com/og-image.jpg",
        "applicationCategory": "AI Software",
        "operatingSystem": "Web",
        "downloadUrl": agentData.website_url,
        "creator": {
          "@type": "Organization",
          "name": "AI Agents Hub"
        },
        "offers": {
          "@type": "Offer",
          "price": agentData.pricing_type === 'free' ? "0" : "varies",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock",
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        "aggregateRating": agentData.average_rating ? {
          "@type": "AggregateRating",
          "ratingValue": agentData.average_rating,
          "ratingCount": agentData.total_reviews || 1,
          "bestRating": 5,
          "worstRating": 1
        } : undefined,
        "review": agentData.total_reviews && agentData.total_reviews > 0 ? {
          "@type": "Review",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": agentData.average_rating,
            "bestRating": 5
          },
          "author": {
            "@type": "Organization",
            "name": "AI Agents Hub Users"
          }
        } : undefined,
        "category": agentData.category,
        "keywords": `${agentData.name}, ${agentData.category} AI, artificial intelligence ${agentData.category.replace('_', ' ')}, AI agent, ${agentData.pricing_type} AI tool`,
        "mainEntity": {
          "@type": "Thing",
          "name": agentData.name,
          "description": `${agentData.name} - Advanced AI agent for ${agentData.category.replace('_', ' ')}`,
          "url": agentData.website_url
        }
      });
    }

    if (type === 'browse') {
      // CollectionPage Schema for Browse page
      schemas.push({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Browse AI Agents Directory",
        "description": "Comprehensive directory of AI agents and tools. Find chatbots, content creators, code assistants, and productivity tools.",
        "url": "https://ai-agents-hub.com/browse",
        "mainEntity": {
          "@type": "ItemList",
          "name": "AI Agents Directory",
          "description": "Complete list of AI agents and tools",
          "numberOfItems": Array.isArray(data) ? data.length : 0
        }
      });
    }

    if (type === 'category' && data && typeof data === 'object' && 'display_name' in data) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": data.display_name,
        "description": data.description || '',
        "url": `https://ai-agents-hub.com/categories/${data.slug}`
      });
    }

    if (type === 'categories' && Array.isArray(data)) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "AI Agent Categories",
        "description": "Explore all AI agent categories.",
        "url": "https://ai-agents-hub.com/categories",
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": data.map((cat: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "Service",
              "name": cat.display_name,
              "description": cat.description
            }
          }))
        }
      });
    }

    if (type === 'submit') {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Submit Your AI Agent - List Your AI Tool | AI Hub",
        "description": "Submit your AI agent or tool to our directory. Get discovered by thousands of users looking for AI solutions. Quick submission process with fast review.",
        "url": "https://ai-agents-hub.com/submit"
      });
    }

    if (type === 'compare') {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Compare AI Agents - Side-by-Side AI Tool Comparison | AI Hub",
        "description": "Compare features, pricing, technical specs, and reviews of top AI agents. Find the best AI tool for your needs with our side-by-side comparison.",
        "url": "https://ai-agents-hub.com/compare"
      });
    }

    if (type === 'dashboard') {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "User Dashboard | AI Hub",
        "description": "Your personal dashboard for managing AI agent submissions, reviews, favorites, and profile settings.",
        "url": "https://ai-agents-hub.com/dashboard"
      });
    }

    if (type === 'notfound') {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "404 - Page Not Found | AI Hub",
        "description": "The page you're looking for doesn't exist or has been moved.",
        "url": "https://ai-agents-hub.com/404"
      });
    }

    // FAQ Schema
    if (faqData && faqData.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }

    // HowTo Schema
    if (howToData && howToData.length > 0) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to use ${data?.name || 'AI agents'} effectively`,
        "description": `Step-by-step guide on using ${data?.name || 'AI agents'} for maximum productivity`,
        "step": howToData.map((step, index) => ({
          "@type": "HowToStep",
          "position": index + 1,
          "name": step.step,
          "text": step.description
        }))
      });
    }

    // Add all schemas to the document
    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.id = `advanced-schema-${index}`;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });

    return () => {
      // Cleanup on unmount
      schemas.forEach((_, index) => {
        const script = document.querySelector(`#advanced-schema-${index}`);
        if (script) script.remove();
      });
    };
  }, [type, data, faqData, howToData]);

  return null;
};

export default AdvancedSEO;
