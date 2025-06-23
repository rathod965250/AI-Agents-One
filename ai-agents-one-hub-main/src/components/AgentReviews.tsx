import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Agent, Review } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import StarRating from './StarRating';
import SimpleReviewForm from './SimpleReviewForm';
import ReviewStats from './reviews/ReviewStats';
import ReviewControls from './reviews/ReviewControls';
import ReviewsList from './reviews/ReviewsList';
import ReviewsEmptyState from './reviews/ReviewsEmptyState';

interface AgentReviewsProps {
  agent: Agent;
}

const AgentReviews = ({ agent }: AgentReviewsProps) => {
  const { user } = useAuth();
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const { data: userReview, refetch: refetchUserReview } = useQuery({
    queryKey: ['user-review', agent.id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('agent_reviews')
        .select('*')
        .eq('agent_id', agent.id)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user
  });

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingReview(null);
    refetchUserReview();
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleEditUserReview = () => {
    setEditingReview(userReview as Review);
    setShowForm(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center justify-between">
          Reviews
          <div className="flex items-center gap-2">
            <div className="flex">
              <StarRating rating={agent.average_rating || 0} readonly />
            </div>
            <span className="text-lg font-semibold">{agent.average_rating || '0.0'}</span>
            <span className="text-sm text-gray-500">({agent.total_reviews || 0} reviews)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews">All Reviews</TabsTrigger>
            <TabsTrigger value="overview">Rating Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <ReviewStats agent={agent} />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6 mt-6">
            <ReviewControls
              agent={agent}
              sortBy={sortBy}
              setSortBy={setSortBy}
              user={user}
              userReview={userReview}
              showForm={showForm}
              setShowForm={setShowForm}
              onEditReview={handleEditUserReview}
            />

            {showForm && (
              <SimpleReviewForm
                agent={agent}
                existingReview={editingReview}
                onSubmitSuccess={handleFormSuccess}
              />
            )}

            {(agent.total_reviews || 0) > 0 ? (
              <ReviewsList
                agent={agent}
                sortBy={sortBy}
                onEdit={handleEdit}
                onRefetch={refetchUserReview}
              />
            ) : (
              <ReviewsEmptyState
                user={user}
                showForm={showForm}
                onWriteReview={() => setShowForm(true)}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AgentReviews;
