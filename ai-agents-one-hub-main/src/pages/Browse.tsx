import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEOBreadcrumbs from "@/components/SEOBreadcrumbs";
import AdvancedSEO from '@/components/seo/AdvancedSEO';
import EnhancedMetaTags from '@/components/seo/EnhancedMetaTags';
import BrowsePageHeader from '@/components/browse/BrowsePageHeader';
import BrowsePageLayout from '@/components/browse/BrowsePageLayout';
import { useBrowseAgents } from '@/hooks/useBrowseAgents';
import { useBrowseSEO } from '@/hooks/useBrowseSEO';
import { memo } from 'react';

const MemoBrowsePageHeader = memo(BrowsePageHeader);
const MemoBrowsePageLayout = memo(BrowsePageLayout);

const Browse = memo(() => {
  const {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    pricingFilter,
    setPricingFilter,
    ratingFilter,
    setRatingFilter,
    agents,
    isLoading,
    error
  } = useBrowseAgents();

  const { title, description, keywords } = useBrowseSEO(agents || []);

  const ratingFilterStr = String(ratingFilter);
  const handleSetRatingFilter = (value: string) => setRatingFilter(Number(value));

  if (error) {
    return (
      <>
        <EnhancedMetaTags
          title="Error - Browse AI Agents | AI Hub"
          description="An error occurred while loading AI agents. Please try again."
          keywords="AI agents error, browse AI tools"
          canonicalUrl="https://ai-agents-hub.com/browse"
        />
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/20">
          <Navigation />
          <SEOBreadcrumbs />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <p className="text-gray-500">Error loading agents. Please try again.</p>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <EnhancedMetaTags
        title={title}
        description={description}
        keywords={keywords}
        canonicalUrl={`https://ai-agents-hub.com/browse${window.location.search}`}
      />

      <AdvancedSEO
        type="browse"
        data={agents}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/20">
        <Navigation />
        <SEOBreadcrumbs />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MemoBrowsePageHeader 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <MemoBrowsePageLayout
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            pricingFilter={pricingFilter}
            setPricingFilter={setPricingFilter}
            ratingFilter={ratingFilterStr}
            setRatingFilter={handleSetRatingFilter}
            agents={agents}
            isLoading={isLoading}
          />
        </div>
        <Footer />
      </div>
    </>
  );
});

export default Browse;
