
import { useState } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Flag, Edit, Trash2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import StarRating from './StarRating';
import AuthModal from './AuthModal';

type Review = Tables<'agent_reviews'> & {
  profiles?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    is_verified: boolean | null;
  };
};

interface SimpleReviewCardProps {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
  onVoteUpdate?: () => void;
}

const SimpleReviewCard = ({ review, onEdit, onDelete, onVoteUpdate }: SimpleReviewCardProps) => {
  const { user } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [userVote, setUserVote] = useState<boolean | null>(null);

  const isOwnReview = user?.id === review.user_id;
  const displayName = review.profiles?.full_name || review.profiles?.username || 'Anonymous';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleVote = async (isHelpful: boolean) => {
    if (!user) return;

    setIsVoting(true);
    try {
      const { data: existingVote } = await supabase
        .from('review_votes')
        .select('*')
        .eq('review_id', review.id)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.is_helpful === isHelpful) {
          await supabase
            .from('review_votes')
            .delete()
            .eq('id', existingVote.id);
          setUserVote(null);
        } else {
          await supabase
            .from('review_votes')
            .update({ is_helpful: isHelpful })
            .eq('id', existingVote.id);
          setUserVote(isHelpful);
        }
      } else {
        await supabase
          .from('review_votes')
          .insert({
            review_id: review.id,
            user_id: user.id,
            is_helpful: isHelpful,
          });
        setUserVote(isHelpful);
      }

      onVoteUpdate?.();
      toast.success('Vote recorded');
    } catch (error) {
      toast.error('Failed to record vote');
      console.error('Vote error:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !isOwnReview) return;

    try {
      await supabase
        .from('agent_reviews')
        .delete()
        .eq('id', review.id);

      toast.success('Review deleted');
      onDelete?.();
    } catch (error) {
      toast.error('Failed to delete review');
      console.error('Delete error:', error);
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={review.profiles?.avatar_url || ''} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-sm">{displayName}</span>
              {review.profiles?.is_verified && (
                <Shield className="h-4 w-4 text-blue-600" />
              )}
              {review.is_verified_purchase && (
                <Badge variant="outline" className="text-xs text-green-700 border-green-300">
                  Verified User
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <StarRating rating={review.rating} readonly size="sm" />
              <span className="text-sm font-semibold">{review.title}</span>
            </div>

            <p className="text-gray-700 text-sm mb-3 leading-relaxed">{review.content}</p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{new Date(review.created_at || '').toLocaleDateString()}</span>
              
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(true)}
                      disabled={isVoting}
                      className={`text-xs h-8 ${userVote === true ? 'text-green-600' : ''}`}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpful_count || 0})
                    </Button>
                    {isOwnReview && (
                      <>
                        <Button variant="ghost" size="sm" onClick={onEdit} className="text-xs h-8">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleDelete} className="text-xs h-8">
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <AuthModal>
                    <Button variant="ghost" size="sm" className="text-xs h-8">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpful_count || 0})
                    </Button>
                  </AuthModal>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleReviewCard;
