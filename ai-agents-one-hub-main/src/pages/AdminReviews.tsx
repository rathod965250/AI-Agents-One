import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ReviewListView } from '@/components/admin/reviews/ReviewListView';
import { ReviewModerationModal } from '@/components/admin/reviews/ReviewModerationModal';
import { ReviewFilters } from '@/components/admin/reviews/ReviewFilters';
import { BulkReviewActions } from '@/components/admin/reviews/BulkReviewActions';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useToast } from '@/hooks/use-toast';

// Use consistent Review type that matches the component expectations
interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  created_at: string | null;
  helpful_count: number | null;
  pros: string[] | null;
  cons: string[] | null;
  use_case: string | null;
  updated_at: string | null;
  status: 'pending' | 'approved' | 'rejected' | null;
  moderation_reason: string | null;
  profiles?: { username: string; full_name: string; avatar_url: string };
  ai_agents?: { name: string; slug: string; logo_url: string };
  content_flags?: { reason: string; status: string }[];
}

export default function AdminReviews() {
  const { isAdmin, logAdminAction } = useAdminAuth();
  const { toast } = useToast();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'flagged'>('all');
  const [ratingFilter, setRatingFilter] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');

  const { data: reviews, isLoading, refetch } = useQuery({
    queryKey: ['admin-reviews', searchTerm, statusFilter, ratingFilter],
    queryFn: async () => {
      let query = supabase
        .from('agent_reviews')
        .select(`
          *,
          profiles(username, full_name, avatar_url),
          ai_agents(name, slug)
        `);

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%, content.ilike.%${searchTerm}%`);
      }

      if (ratingFilter !== 'all') {
        query = query.eq('rating', parseInt(ratingFilter));
      }

      let reviewData = [];
      if (statusFilter === 'flagged') {
        // Get all flagged review IDs from content_flags
        const { data: flags, error: flagError } = await supabase
          .from('content_flags')
          .select('content_id, reason, status')
          .eq('content_type', 'review')
          .in('status', ['pending', 'reviewed']);
        if (flagError) throw flagError;
        const flaggedIds = (flags || []).map(f => f.content_id);
        if (flaggedIds.length === 0) return [];
        query = query.in('id', flaggedIds);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        // Attach flags to reviews
        reviewData = (data || []).map(review => ({
          ...review,
          content_flags: (flags || []).filter(f => f.content_id === review.id)
        }));
      } else {
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        reviewData = (data || []).map(review => ({
          ...review,
          content_flags: []
        }));
      }
      // Transform data to match Review interface
      return (reviewData || []).map(review => ({
        id: review.id,
        title: review.title,
        content: review.content,
        rating: review.rating,
        created_at: review.created_at,
        helpful_count: review.helpful_count,
        pros: review.pros,
        cons: review.cons,
        use_case: review.use_case,
        updated_at: review.updated_at,
        status: review.status,
        moderation_reason: review.moderation_reason,
        profiles: review.profiles ? {
          username: review.profiles.username,
          full_name: review.profiles.full_name,
          avatar_url: review.profiles.avatar_url
        } : undefined,
        ai_agents: review.ai_agents ? {
          name: review.ai_agents.name,
          slug: review.ai_agents.slug,
          logo_url: ''
        } : undefined,
        content_flags: review.content_flags || []
      })) as Review[];
    }
  });

  const handleReviewUpdate = async (reviewId: string, updates: Partial<Review>) => {
    if (!isAdmin) return;

    try {
      const { error } = await supabase
        .from('agent_reviews')
        .update(updates)
        .eq('id', reviewId);

      if (error) throw error;

      await logAdminAction('update_review', 'agent_reviews', reviewId, null, updates);

      toast({
        title: "Review Updated",
        description: "Review has been updated successfully"
      });

      refetch();
      setSelectedReview(null);
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive"
      });
    }
  };

  const handleBulkAction = async (action: 'approve' | 'reject' | 'delete', reason?: string) => {
    if (!isAdmin) return;

    try {
      if (action === 'delete') {
        const { error } = await supabase
          .from('agent_reviews')
          .delete()
          .in('id', selectedReviews);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('agent_reviews')
          .update({
            status: action === 'approve' ? 'approved' : 'rejected',
            moderation_reason: action === 'reject' ? reason : null,
            updated_at: new Date().toISOString(),
          })
          .in('id', selectedReviews);
        if (error) throw error;
      }

      await logAdminAction('bulk_update_reviews', 'agent_reviews', null, null, { reviewIds: selectedReviews, action, reason });

      toast({
        title: "Reviews Updated",
        description: `${action === 'delete' ? 'Deleted' : 'Updated'} ${selectedReviews.length} reviews`
      });

      refetch();
      setSelectedReviews([]);
    } catch (error) {
      console.error('Error updating reviews:', error);
      toast({
        title: "Error",
        description: "Failed to update reviews",
        variant: "destructive"
      });
    }
  };

  const handleSelectReview = (review: { id: string }) => {
    const fullReview = reviews?.find(r => r.id === review.id);
    setSelectedReview(fullReview || null);
  };

  // Handler to feature/unfeature a review
  const handleFeature = async (reviewId: string, feature: boolean) => {
    if (!isAdmin) return;
    try {
      const { error } = await supabase
        .from('agent_reviews')
        .update({ is_featured: feature })
        .eq('id', reviewId);
      if (error) throw error;
      await logAdminAction(feature ? 'feature_review' : 'unfeature_review', 'agent_reviews', reviewId, null, { is_featured: feature });
      toast({ title: feature ? 'Review Featured' : 'Review Unfeatured' });
      refetch();
      setSelectedReview(null);
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  };

  // Handler to delete a review
  const handleDelete = async (reviewId: string) => {
    if (!isAdmin) return;
    try {
      const { error } = await supabase
        .from('agent_reviews')
        .delete()
        .eq('id', reviewId);
      if (error) throw error;
      await logAdminAction('delete_review', 'agent_reviews', reviewId, null, null);
      toast({ title: 'Review Deleted' });
      refetch();
      setSelectedReview(null);
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  };

  // Handler to edit review content
  const handleEdit = async (reviewId: string, updates: Partial<Review>) => {
    if (!isAdmin) return;
    try {
      const { error } = await supabase
        .from('agent_reviews')
        .update(updates)
        .eq('id', reviewId);
      if (error) throw error;
      await logAdminAction('edit_review', 'agent_reviews', reviewId, null, updates);
      toast({ title: 'Review Edited' });
      refetch();
      setSelectedReview(null);
    } catch (error) {
      toast({ title: 'Error', description: String(error), variant: 'destructive' });
    }
  };

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Review Management</h1>
      </div>

      <ReviewFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        ratingFilter={ratingFilter}
        onRatingFilterChange={setRatingFilter}
      />

      {selectedReviews.length > 0 && (
        <BulkReviewActions
          selectedCount={selectedReviews.length}
          onBulkAction={handleBulkAction}
          onBulkFeature={async () => {
            await Promise.all(selectedReviews.map(id => handleFeature(id, true)));
            toast({ title: 'Reviews featured' });
            setSelectedReviews([]); refetch();
          }}
          onBulkUnfeature={async () => {
            await Promise.all(selectedReviews.map(id => handleFeature(id, false)));
            toast({ title: 'Reviews unfeatured' });
            setSelectedReviews([]); refetch();
          }}
          onClearSelection={() => setSelectedReviews([])}
        />
      )}

      <ReviewListView
        reviews={reviews || []}
        isLoading={isLoading}
        selectedReviews={selectedReviews}
        onSelectionChange={setSelectedReviews}
        onReviewClick={handleSelectReview}
      />

      {selectedReview && (
        <ReviewModerationModal
          review={selectedReview}
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          onUpdate={handleReviewUpdate}
          onFeature={handleFeature}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
