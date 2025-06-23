
import { useEffect } from 'react';

interface EnhancedMetaTagsProps {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  locale?: string;
  alternateUrls?: { hreflang: string; href: string }[];
}

const EnhancedMetaTags = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "https://ai-agents-hub.com/og-image.jpg",
  ogType = "website",
  twitterCard = "summary_large_image",
  author = "AI Agents Hub",
  publishedTime,
  modifiedTime,
  articleSection,
  locale = "en_US",
  alternateUrls = []
}: EnhancedMetaTagsProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Function to update or create meta tags
    const updateMetaTag = (selector: string, content: string, property = false) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', selector.replace('meta[property="', '').replace('"]', ''));
        } else {
          element.setAttribute('name', selector.replace('meta[name="', '').replace('"]', ''));
        }
        element.content = content;
        document.head.appendChild(element);
      }
    };

    // Basic SEO meta tags
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords);
    updateMetaTag('meta[name="author"]', author);
    updateMetaTag('meta[name="robots"]', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    updateMetaTag('meta[name="googlebot"]', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    
    // Open Graph meta tags
    updateMetaTag('meta[property="og:title"]', title, true);
    updateMetaTag('meta[property="og:description"]', description, true);
    updateMetaTag('meta[property="og:image"]', ogImage, true);
    updateMetaTag('meta[property="og:url"]', canonicalUrl, true);
    updateMetaTag('meta[property="og:type"]', ogType, true);
    updateMetaTag('meta[property="og:locale"]', locale, true);
    updateMetaTag('meta[property="og:site_name"]', 'AI Agents Hub', true);
    
    // Twitter Card meta tags
    updateMetaTag('meta[name="twitter:card"]', twitterCard);
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', ogImage);
    updateMetaTag('meta[name="twitter:site"]', '@aiagentshub');
    updateMetaTag('meta[name="twitter:creator"]', '@aiagentshub');
    
    // Article specific tags (if applicable)
    if (publishedTime) {
      updateMetaTag('meta[property="article:published_time"]', publishedTime, true);
    }
    if (modifiedTime) {
      updateMetaTag('meta[property="article:modified_time"]', modifiedTime, true);
    }
    if (articleSection) {
      updateMetaTag('meta[property="article:section"]', articleSection, true);
    }

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = canonicalUrl;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = canonicalUrl;
      document.head.appendChild(canonicalLink);
    }

    // Alternate language links (hreflang)
    // Remove existing hreflang links
    const existingHreflangLinks = document.querySelectorAll('link[hreflang]');
    existingHreflangLinks.forEach(link => link.remove());

    // Add new hreflang links
    alternateUrls.forEach(({ hreflang, href }) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = hreflang;
      link.href = href;
      document.head.appendChild(link);
    });

    // Add JSON-LD for Article/WebPage
    const pageSchema = {
      "@context": "https://schema.org",
      "@type": ogType === "article" ? "Article" : "WebPage",
      "headline": title,
      "description": description,
      "url": canonicalUrl,
      "image": ogImage,
      "author": {
        "@type": "Organization",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "AI Agents Hub",
        "logo": {
          "@type": "ImageObject",
          "url": "https://ai-agents-hub.com/logo.png"
        }
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      }
    };

    let pageSchemaScript = document.querySelector('#page-schema') as HTMLScriptElement;
    if (pageSchemaScript) {
      pageSchemaScript.textContent = JSON.stringify(pageSchema);
    } else {
      pageSchemaScript = document.createElement('script');
      pageSchemaScript.id = 'page-schema';
      pageSchemaScript.type = 'application/ld+json';
      pageSchemaScript.textContent = JSON.stringify(pageSchema);
      document.head.appendChild(pageSchemaScript);
    }

  }, [title, description, keywords, canonicalUrl, ogImage, ogType, twitterCard, author, publishedTime, modifiedTime, articleSection, locale, alternateUrls]);

  return null;
};

export default EnhancedMetaTags;
