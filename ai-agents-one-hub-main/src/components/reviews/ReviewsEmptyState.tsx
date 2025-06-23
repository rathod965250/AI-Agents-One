import { Button } from '@/components/ui/button';
import { Tables } from '@/integrations/supabase/types';

type User = Tables<'profiles'>;

interface ReviewsEmptyStateProps {
  user: User | null;
  showForm: boolean;
  onWriteReview: () => void;
}

const ReviewsEmptyState = ({ user, showForm, onWriteReview }: ReviewsEmptyStateProps) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>No reviews yet</p>
      <p className="text-sm mb-4">Be the first to review this agent</p>
      {user && !showForm && (
        <Button onClick={onWriteReview}>
          Write the First Review
        </Button>
      )}
    </div>
  );
};

export default ReviewsEmptyState;
