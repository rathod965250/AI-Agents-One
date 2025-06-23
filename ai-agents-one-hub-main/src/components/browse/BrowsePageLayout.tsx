import FilterSidebar from '@/components/FilterSidebar';
import BrowsePageContent from './BrowsePageContent';
import type { Agent } from '@/integrations/supabase/types';

interface BrowsePageLayoutProps {
  categoryFilter: string[];
  setCategoryFilter: (value: string[]) => void;
  pricingFilter: string[];
  setPricingFilter: (value: string[]) => void;
  ratingFilter: string;
  setRatingFilter: (value: string) => void;
  agents: Agent[] | undefined;
  isLoading: boolean;
}

const BrowsePageLayout = ({
  categoryFilter,
  setCategoryFilter,
  pricingFilter,
  setPricingFilter,
  ratingFilter,
  setRatingFilter,
  agents,
  isLoading
}: BrowsePageLayoutProps) => {
  return (
    <div className="flex gap-8">
      <div className="w-64 flex-shrink-0">
        <FilterSidebar
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          pricingFilter={pricingFilter}
          setPricingFilter={setPricingFilter}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
        />
      </div>
      
      <div className="flex-1">
        <BrowsePageContent agents={agents} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default BrowsePageLayout;
