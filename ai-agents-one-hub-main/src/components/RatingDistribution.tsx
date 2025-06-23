
import { Progress } from '@/components/ui/progress';
import StarRating from './StarRating';

interface RatingDistributionProps {
  ratings: { [key: number]: number };
  totalReviews: number;
}

const RatingDistribution = ({ ratings, totalReviews }: RatingDistributionProps) => {
  if (totalReviews === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No ratings yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {[5, 4, 3, 2, 1].map((rating) => {
        const count = ratings[rating] || 0;
        const percentage = (count / totalReviews) * 100;

        return (
          <div key={rating} className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16">
              <span className="text-sm">{rating}</span>
              <StarRating rating={1} readonly size="sm" />
            </div>
            <Progress value={percentage} className="flex-1 h-2" />
            <span className="text-sm text-gray-600 w-8 text-right">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default RatingDistribution;
