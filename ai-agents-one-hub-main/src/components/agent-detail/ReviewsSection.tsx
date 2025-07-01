import { useState, useRef, memo, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Star, ThumbsUp, PlusSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ReviewsSectionProps {
  agent: any;
  reviews: any[];
}

const ReviewsSection = memo(({ agent, reviews }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [existingUserReview, setExistingUserReview] = useState<any | null>(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [lastTap, setLastTap] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (user && reviews && reviews.length > 0) {
      const found = reviews.find((r: any) => r.user_id === user.id);
      setExistingUserReview(found || null);
      if (found) {
        setReviewTitle(found.title || '');
        setReviewText(found.comment || '');
        setReviewRating(Number(found.rating) || 5);
      } else {
        setReviewTitle('');
        setReviewText('');
        setReviewRating(5);
      }
    }
  }, [user, reviews, showReviewForm]);

  // Memoized review calculations
  const { averageRating, totalReviews, starCounts, sortedReviews } = useMemo(() => {
    const total = reviews.length;
    const sumRatings = reviews.reduce((sum: number, r: any) => sum + (typeof r.rating === 'number' ? r.rating : Number(r.rating)), 0);
    const average = total ? (Number(sumRatings) / total).toFixed(1) : '—';
    const counts = [5,4,3,2,1].map(star => reviews.filter(r => Number(r.rating) === star).length);
    
    const sorted = [...reviews].sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'highest') return Number(b.rating) - Number(a.rating);
      if (sortBy === 'lowest') return Number(a.rating) - Number(b.rating);
      return 0;
    });

    return { averageRating: average, totalReviews: total, starCounts: counts, sortedReviews: sorted };
  }, [reviews, sortBy]);

  // Review submission mutation
  const submitReviewMutation = useMutation({
    mutationFn: async () => {
      if (existingUserReview) {
        const { error } = await supabase.from('agent_reviews')
          .update({
            rating: Number(reviewRating),
            title: reviewTitle,
            comment: reviewText,
            is_verified: !!user,
          })
          .eq('id', existingUserReview.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('agent_reviews').insert({
          agent_id: agent.id,
          rating: Number(reviewRating),
          title: reviewTitle,
          comment: reviewText,
          user_id: user?.id || null,
          is_verified: !!user,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(existingUserReview ? 'Review updated!' : 'Thank you for your feedback!');
      setReviewText('');
      setReviewTitle('');
      setReviewRating(5);
      setShowReviewForm(false);
      queryClient.invalidateQueries({ queryKey: ['reviews', agent.id] });
    },
    onError: (error: any) => {
      console.error('Review submission error:', error);
      toast.error('Failed to submit review: ' + error.message);
    }
  });

  // Helpful vote mutation
  const helpfulVoteMutation = useMutation({
    mutationFn: async ({ reviewId, increment }: { reviewId: string; increment: boolean }) => {
      const { data: reviewData } = await supabase
        .from('agent_reviews')
        .select('helpful_count')
        .eq('id', reviewId)
        .single();
      
      const currentCount = reviewData?.helpful_count || 0;
      const newCount = increment ? currentCount + 1 : Math.max(currentCount - 1, 0);
      
      const { error } = await supabase
        .from('agent_reviews')
        .update({ helpful_count: newCount })
        .eq('id', reviewId);
      
      if (error) throw error;
      return newCount;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', agent.id] });
    }
  });

  // Memoized star rendering
  const renderStars = useCallback((rating: number, size = 'w-8 h-8') => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<Star key={i} className={`${size} text-yellow-400 fill-yellow-400`} />);
      } else if (rating >= i - 0.5) {
        stars.push(
          <span key={i} className="relative inline-block">
            <Star className={`${size} text-yellow-400 fill-yellow-400 absolute left-0 top-0 z-10`} style={{clipPath: 'inset(0 50% 0 0)'}} />
            <Star className={`${size} text-gray-300`} />
          </span>
        );
      } else {
        stars.push(<Star key={i} className={`${size} text-gray-300`} />);
      }
    }
    return stars;
  }, []);

  const handleReviewSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !reviewTitle.trim()) return;
    submitReviewMutation.mutate();
  }, [reviewText, reviewTitle, submitReviewMutation]);

  const handleHelpful = useCallback((reviewId: string, currentHelpfulCount: number) => {
    helpfulVoteMutation.mutate({ reviewId, increment: true });
  }, [helpfulVoteMutation]);

  const handleStarClick = useCallback((star: number) => {
    const now = Date.now();
    if (lastTap && now - lastTap < 300) {
      setReviewRating(star - 0.5);
      setLastTap(null);
    } else {
      setReviewRating(star);
      setLastTap(now);
    }
  }, [lastTap]);

  return (
    <section className="bg-white rounded-2xl shadow p-6 md:p-10 mb-10">
      <h2 className="font-bold text-2xl mb-8 text-gray-900">User Reviews</h2>
      
      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center justify-center bg-blue-50 rounded-xl p-8 shadow-sm min-w-[220px] max-w-xs w-full">
          <span className="text-6xl font-bold text-blue-700 leading-none">{averageRating}</span>
          <div className="flex items-center gap-1 mt-2 mb-2">
            {renderStars(Number(averageRating), 'w-5 h-5')}
          </div>
          <span className="text-gray-500 text-base">Based on {totalReviews} reviews</span>
        </div>
        
        {/* Star Breakdown */}
        <div className="flex-1 flex flex-col justify-center gap-3 min-w-[200px]">
          {[5,4,3,2,1].map((star, i) => {
            const count = starCounts[5-star];
            const percent = totalReviews ? (count/totalReviews)*100 : 0;
            return (
              <div key={star} className="flex items-center gap-3 w-full">
                <span className="w-8 text-base text-gray-700 font-medium">{star}</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-4 bg-blue-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-6 text-right text-base text-gray-700">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Review Button */}
      <div className="flex justify-end mt-6 mb-2">
        <button
          onClick={() => {
            if (!user) {
              toast.error('You must be logged in to write a review.');
              return;
            }
            setShowReviewForm(true);
          }}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-900 transition"
        >
          <PlusSquare className="w-5 h-5" /> Write a Review
        </button>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-2xl mx-auto relative">
            <button 
              onClick={() => setShowReviewForm(false)} 
              className="absolute -top-14 right-0 bg-black text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow hover:bg-gray-900 transition"
            >
              <PlusSquare className="w-5 h-5 rotate-45" /> Cancel Review
            </button>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Write Your Review</h3>
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-lg">Your Rating</label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="focus:outline-none"
                      >
                        <span className="relative">
                          <Star className={`w-10 h-10 ${((hoverRating ?? reviewRating) >= star) ? 'text-yellow-400 fill-yellow-400' : (reviewRating === star - 0.5 ? 'text-yellow-400 fill-yellow-400 opacity-50' : 'text-gray-300')}`} />
                          {reviewRating === star - 0.5 && <span className="absolute left-0 top-0 w-1/2 h-full bg-white opacity-50 pointer-events-none" />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-2">Review Title</label>
                  <input
                    type="text"
                    className="w-full border rounded px-4 py-2 text-base"
                    placeholder="e.g., A Game Changer for Productivity!"
                    value={reviewTitle}
                    onChange={e => setReviewTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2">Your Review</label>
                  <textarea
                    className="w-full border rounded px-4 py-2 min-h-[100px] text-base"
                    placeholder="Tell us about your experience..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={submitReviewMutation.isPending || !reviewText.trim() || !reviewTitle.trim()} 
                    className="bg-black text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-gray-900 transition"
                  >
                    {submitReviewMutation.isPending ? (existingUserReview ? 'Updating...' : 'Submitting...') : (existingUserReview ? 'Update Review' : 'Submit Review')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {sortedReviews.length === 0 ? (
        <div className="text-gray-400 text-center mt-16 text-lg">No reviews yet. Be the first to share your thoughts!</div>
      ) : (
        <div className="mt-8 space-y-6">
          {sortedReviews.map((review: any) => (
            <div key={review.id} className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row gap-4 border border-gray-100">
              <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-2 min-w-[60px]">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {review.profiles?.full_name ? review.profiles.full_name[0] : (review.profiles?.username ? review.profiles.username[0] : 'U')}
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-gray-900 text-base">
                    {review.profiles?.full_name ? review.profiles.full_name : (review.profiles?.username ? review.profiles.username : 'User')}
                  </span>
                  <span className="text-gray-400 text-sm">
                    {new Date(review.created_at).toLocaleDateString(undefined, { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex flex-row md:justify-end mb-2">
                  {renderStars(Number(review.rating), 'w-5 h-5')}
                </div>
                <div className="text-lg font-medium text-gray-900 mb-1">{review.title}</div>
                <div className="text-gray-700 mb-4 whitespace-pre-line">{review.comment}</div>
                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mt-auto">
                  <button
                    className="flex items-center gap-1 hover:text-blue-700 px-2 py-1 rounded transition text-gray-500 font-medium"
                    onClick={() => handleHelpful(review.id, review.helpful_count || 0)}
                    disabled={helpfulVoteMutation.isPending}
                  >
                    <ThumbsUp className="w-4 h-4" /> Helpful ({review.helpful_count || 0})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
});

export default ReviewsSection; 