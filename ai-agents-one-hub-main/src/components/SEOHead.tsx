import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: Record<string, unknown>;
  noIndex?: boolean;
}

const SEOHead = ({
  title = "AI Agents Directory - Discover the Best AI Tools & Assistants | AI Hub",
  description = "Discover 3,500+ AI agents and tools. Find chatbots, content creators, code assistants, and productivity tools. Compare features, read reviews, and boost your workflow with AI.",
  keywords = "AI agents, artificial intelligence tools, AI directory, chatbots, AI assistants, machine learning tools, productivity AI, AI marketplace",
  image = "https://ai-agents-hub.com/og-image.jpg",
  url = "https://ai-agents-hub.com/",
  type = "website",
  structuredData,
  noIndex = false
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        element.content = content;
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Update robots meta tag
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);

    // Update Twitter Card tags
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);
    updateMetaTag('twitter:url', url, true);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = url;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = url;
      document.head.appendChild(canonicalLink);
    }

    // Add structured data if provided
    if (structuredData) {
      let structuredDataScript = document.querySelector('#dynamic-structured-data') as HTMLScriptElement;
      if (structuredDataScript) {
        structuredDataScript.textContent = JSON.stringify(structuredData);
      } else {
        structuredDataScript = document.createElement('script');
        structuredDataScript.id = 'dynamic-structured-data';
        structuredDataScript.type = 'application/ld+json';
        structuredDataScript.textContent = JSON.stringify(structuredData);
        document.head.appendChild(structuredDataScript);
      }
    }
  }, [title, description, keywords, image, url, type, structuredData, noIndex]);

  return null;
};

export default SEOHead;
