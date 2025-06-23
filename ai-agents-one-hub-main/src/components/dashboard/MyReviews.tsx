import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

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
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      src={(review as any).ai_agents?.logo_url || '/placeholder.svg'}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      alt={(review as any).ai_agents?.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      <h3 className="font-semibold">{(review as any).ai_agents?.name}</h3>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-1">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(review.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">{review.title}</h4>
                  <p className="text-gray-700">{review.content}</p>
                </div>

                {review.pros && review.pros.length > 0 && (
                  <div className="mb-3">
                    <h5 className="font-medium text-green-700 mb-1">Pros:</h5>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {review.pros.map((pro, index) => (
                        <li key={index}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {review.cons && review.cons.length > 0 && (
                  <div className="mb-3">
                    <h5 className="font-medium text-red-700 mb-1">Cons:</h5>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {review.cons.map((con, index) => (
                        <li key={index}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{review.helpful_count || 0} helpful</span>
                    </div>
                    {review.is_verified_purchase && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <span>{new Date(review.created_at || '').toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No reviews written yet</p>
            <Button className="mt-4" asChild>
              <a href="/browse">Browse Agents to Review</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyReviews;
