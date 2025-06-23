
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Star } from 'lucide-react';

interface RatingFilterProps {
  ratingFilter: string;
  setRatingFilter: (value: string) => void;
}

const RatingFilter = ({ ratingFilter, setRatingFilter }: RatingFilterProps) => {
  const ratings = [
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' },
    { value: '1', label: '1+ Stars' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Rating</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="all-ratings"
            checked={ratingFilter === 'all'}
            onCheckedChange={() => setRatingFilter('all')}
          />
          <label htmlFor="all-ratings" className="text-sm font-medium cursor-pointer">
            All Ratings
          </label>
        </div>
        {ratings.map((rating) => (
          <div key={rating.value} className="flex items-center space-x-2">
            <Checkbox
              id={`rating-${rating.value}`}
              checked={ratingFilter === rating.value}
              onCheckedChange={() => setRatingFilter(ratingFilter === rating.value ? 'all' : rating.value)}
            />
            <label htmlFor={`rating-${rating.value}`} className="text-sm cursor-pointer flex items-center">
              <div className="flex mr-2">
                {Array.from({ length: parseInt(rating.value) }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              {rating.label}
            </label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RatingFilter;
