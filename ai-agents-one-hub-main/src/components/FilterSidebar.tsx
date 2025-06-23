
import CategoryFilter from './filters/CategoryFilter';
import PricingFilter from './filters/PricingFilter';
import RatingFilter from './filters/RatingFilter';

interface FilterSidebarProps {
  categoryFilter: string[];
  setCategoryFilter: (value: string[]) => void;
  pricingFilter: string[];
  setPricingFilter: (value: string[]) => void;
  ratingFilter: string;
  setRatingFilter: (value: string) => void;
}

const FilterSidebar = ({
  categoryFilter,
  setCategoryFilter,
  pricingFilter,
  setPricingFilter,
  ratingFilter,
  setRatingFilter,
}: FilterSidebarProps) => {
  return (
    <div className="space-y-6">
      <CategoryFilter
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />
      <PricingFilter
        pricingFilter={pricingFilter}
        setPricingFilter={setPricingFilter}
      />
      <RatingFilter
        ratingFilter={ratingFilter}
        setRatingFilter={setRatingFilter}
      />
    </div>
  );
};

export default FilterSidebar;
