import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tables } from '@/integrations/supabase/types';

type Agent = Tables<'ai_agents'>;
type User = Tables<'profiles'>;
type Review = Tables<'agent_reviews'>;

interface ReviewControlsProps {
  agent: Agent;
  sortBy: string;
  setSortBy: (value: string) => void;
  user: User | null;
  userReview: Review | null;
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  onEditReview: () => void;
}

const ReviewControls = ({ 
  sortBy, 
  setSortBy, 
  user, 
  userReview, 
  showForm, 
  setShowForm, 
  onEditReview 
}: ReviewControlsProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="highest">Highest Rated</SelectItem>
            <SelectItem value="lowest">Lowest Rated</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {user && !userReview && !showForm && (
        <Button onClick={() => setShowForm(true)}>
          Write a Review
        </Button>
      )}
      {userReview && !showForm && (
        <Button variant="outline" onClick={onEditReview}>
          Edit Your Review
        </Button>
      )}
    </div>
  );
};

export default ReviewControls;
