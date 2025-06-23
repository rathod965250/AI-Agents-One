
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import StarRating from '../StarRating';
import RatingDistribution from '../RatingDistribution';

type Agent = Tables<'ai_agents'>;

interface ReviewStatsProps {
  agent: Agent;
}

const ReviewStats = ({ agent }: ReviewStatsProps) => {
  const { data: reviewStats } = useQuery({
    queryKey: ['review-stats', agent.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_reviews')
        .select('rating')
        .eq('agent_id', agent.id);
      
      if (error) throw error;
      
      const ratings = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      data.forEach(review => {
        ratings[review.rating as keyof typeof ratings]++;
      });
      
      return { ratings, totalReviews: data.length };
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-semibold mb-3">Rating Distribution</h4>
        {reviewStats && (
          <RatingDistribution 
            ratings={reviewStats.ratings} 
            totalReviews={reviewStats.totalReviews} 
          />
        )}
      </div>
      <div className="space-y-4">
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {agent.average_rating || '0.0'}
          </div>
          <StarRating rating={agent.average_rating || 0} readonly size="lg" />
          <p className="text-sm text-gray-600 mt-2">
            Based on {agent.total_reviews || 0} reviews
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;
