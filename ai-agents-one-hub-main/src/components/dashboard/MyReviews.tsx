import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AgentCard from '@/components/AgentCard';

const MyReviews = () => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ['user-reviews', user?.id, sortBy],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('agent_reviews')
        .select(`
          *,
          ai_agents (
            id,
            name,
            slug,
            logo_url
          )
        `)
        .eq('user_id', user.id);

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
      return data;
    },
    enabled: !!user
  });

  const handleEdit = (reviewId: string) => {
    // TODO: Implement edit review functionality
    console.log('Edit review:', reviewId);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('agent_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast.success('Review deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to delete review');
      console.error('Delete error:', error);
    }
  };

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Reviews</h2>
        <div className="flex gap-2">
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' },
            { value: 'highest', label: 'Highest' },
            { value: 'lowest', label: 'Lowest' },
            { value: 'helpful', label: 'Most Helpful' }
          ].map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const agent = (review as any).ai_agents;
            if (!agent) return null;
            return (
              <div key={review.id} className="flex flex-col gap-2">
                <AgentCard agent={agent} />
                <div className="bg-white rounded-lg shadow p-4 mt-2">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">{review.rating}/5</span>
                  </div>
                  <h4 className="font-medium mb-1">{review.title}</h4>
                  <p className="text-gray-700 mb-2">{review.content}</p>
                  {review.pros && review.pros.length > 0 && (
                    <div className="mb-1">
                      <span className="font-medium text-green-700">Pros: </span>
                      <span className="text-gray-600">{review.pros.join(', ')}</span>
                    </div>
                  )}
                  {review.cons && review.cons.length > 0 && (
                    <div className="mb-1">
                      <span className="font-medium text-red-700">Cons: </span>
                      <span className="text-gray-600">{review.cons.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                    <span>{review.helpful_count || 0} helpful</span>
                    {review.is_verified_purchase && (
                      <Badge className="bg-blue-100 text-blue-800">Verified Purchase</Badge>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(review.id)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(review.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No reviews yet</p>
            <Button asChild>
              <a href="/browse">Write a Review</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyReviews;
