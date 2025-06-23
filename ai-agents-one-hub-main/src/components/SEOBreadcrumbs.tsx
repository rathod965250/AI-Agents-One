
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface SEOBreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const SEOBreadcrumbs = ({ items, className = "" }: SEOBreadcrumbsProps) => {
  const location = useLocation();

  // Generate breadcrumbs from URL if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Convert segment to readable label
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);
      if (segment === 'browse') label = 'Browse AI Agents';
      if (segment === 'submit') label = 'Submit Agent';
      if (segment === 'dashboard') label = 'Dashboard';
      
      breadcrumbs.push({
        label,
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Generate structured data for breadcrumbs
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": `https://ai-agents-hub.com${item.href}`
      }))
    };

    let breadcrumbScript = document.querySelector('#breadcrumb-structured-data') as HTMLScriptElement;
    if (breadcrumbScript) {
      breadcrumbScript.textContent = JSON.stringify(structuredData);
    } else {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = 'breadcrumb-structured-data';
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(breadcrumbScript);
    }

    return () => {
      // Cleanup on unmount
      const script = document.querySelector('#breadcrumb-structured-data');
      if (script) script.remove();
    };
  }, [breadcrumbs]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className={`flex items-center space-x-2 text-sm text-gray-600 mb-4 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index === 0 && <Home className="h-4 w-4 mr-1" />}
            {index < breadcrumbs.length - 1 ? (
              <>
                <Link 
                  to={item.href} 
                  className="hover:text-blue-600 transition-colors"
                  aria-label={`Go to ${item.label}`}
                >
                  {item.label}
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              </>
            ) : (
              <span className="text-gray-900 font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default SEOBreadcrumbs;
