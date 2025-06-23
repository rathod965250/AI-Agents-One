
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import SimpleReviewCard from '../SimpleReviewCard';

type Agent = Tables<'ai_agents'>;
type Review = Tables<'agent_reviews'> & {
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    is_verified: boolean | null;
  };
};

interface ReviewsListProps {
  agent: Agent;
  sortBy: string;
  onEdit: (review: Review) => void;
  onRefetch: () => void;
}

const REVIEWS_PER_PAGE = 6;

const ReviewsList = ({ agent, sortBy, onEdit, onRefetch }: ReviewsListProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ['agent-reviews', agent.id, sortBy, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('agent_reviews')
        .select(`
          *,
          profiles:user_id (
            username,
            full_name,
            avatar_url,
            is_verified
          )
        `)
        .eq('agent_id', agent.id)
        .range((currentPage - 1) * REVIEWS_PER_PAGE, currentPage * REVIEWS_PER_PAGE - 1);

      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'highest':
          query = query.order('rating', { ascending: false });
          break;
        case 'lowest':
          query = query.order('rating', { ascending: true });
          break;
        case 'helpful':
          query = query.order('helpful_count', { ascending: false });
          break;
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Review[];
    }
  });

  const totalPages = Math.ceil((agent.total_reviews || 0) / REVIEWS_PER_PAGE);
  const showPagination = (agent.total_reviews || 0) > REVIEWS_PER_PAGE && reviews && reviews.length >= REVIEWS_PER_PAGE;

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleRefetch = () => {
    refetch();
    onRefetch();
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet</p>
        <p className="text-sm mb-4">Be the first to review this agent</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <SimpleReviewCard
          key={review.id}
          review={review}
          onEdit={() => onEdit(review)}
          onDelete={handleRefetch}
          onVoteUpdate={handleRefetch}
        />
      ))}

      {showPagination && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={currentPage >= totalPages}
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
