import { useEffect } from 'react';

// Utility functions for SEO optimization
export const generateSitemap = async () => {
  // This would typically be done server-side, but here's the structure
  const baseUrl = 'https://ai-agents-hub.com';
  
  const staticPages = [
    { url: '/', priority: 1.0, changeFreq: 'daily' },
    { url: '/browse', priority: 0.9, changeFreq: 'daily' },
    { url: '/submit', priority: 0.8, changeFreq: 'weekly' },
  ];
  
  // In a real implementation, you'd fetch this from your database
  const dynamicPages = [
    // Agent pages would be added here
    // { url: '/agent/chatgpt', priority: 0.8, changeFreq: 'weekly' },
  ];
  
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticPages, ...dynamicPages].map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('')}
</urlset>`;
  
  return sitemapXml;
};

// Performance optimization for Core Web Vitals - converted to custom hook
export const usePerformanceOptimization = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadLinks = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    ];
    
    preloadLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });
    
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    return () => {
      images.forEach(img => imageObserver.unobserve(img));
    };
  }, []);
};

// Legacy function for backward compatibility
export const optimizePerformance = () => {
  console.warn('optimizePerformance is deprecated. Use usePerformanceOptimization hook instead.');
};

// Schema markup generators
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AI Agents Hub",
  "url": "https://ai-agents-hub.com",
  "logo": "https://ai-agents-hub.com/logo.png",
  "description": "The largest directory of AI agents and tools, helping users discover and compare artificial intelligence solutions.",
  "foundingDate": "2024",
  "areaServed": "Worldwide",
  "knowsAbout": ["Artificial Intelligence", "Machine Learning", "AI Agents", "Automation", "Productivity Tools"]
});

export const generateWebsiteSchema = () => ({
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

// Analytics and tracking setup (preparation for Google Analytics)
export const setupAnalytics = () => {
  // This would be where you'd add Google Analytics, Google Tag Manager, etc.
  console.log('Analytics setup ready for Google Analytics implementation');
};

export default { generateSitemap, optimizePerformance, generateOrganizationSchema, generateWebsiteSchema, setupAnalytics };
