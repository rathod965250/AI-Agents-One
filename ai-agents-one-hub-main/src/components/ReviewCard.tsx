
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

interface ReviewCardProps {
  review: Review;
  onEdit?: () => void;
  onDelete?: () => void;
  onVoteUpdate?: () => void;
}

const ReviewCard = ({ review, onEdit, onDelete, onVoteUpdate }: ReviewCardProps) => {
  const { user } = useAuth();
  const [isVoting, setIsVoting] = useState(false);
  const [isFlagging, setIsFlagging] = useState(false);
  const [userVote, setUserVote] = useState<boolean | null>(null);

  const isOwnReview = user?.id === review.user_id;
  const displayName = review.profiles?.full_name || review.profiles?.username || 'Anonymous';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleVote = async (isHelpful: boolean) => {
    if (!user) return;

    setIsVoting(true);
    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('review_votes')
        .select('*')
        .eq('review_id', review.id)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.is_helpful === isHelpful) {
          // Remove vote if clicking same button
          await supabase
            .from('review_votes')
            .delete()
            .eq('id', existingVote.id);
          setUserVote(null);
        } else {
          // Update vote
          await supabase
            .from('review_votes')
            .update({ is_helpful: isHelpful })
            .eq('id', existingVote.id);
          setUserVote(isHelpful);
        }
      } else {
        // Create new vote
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

  const handleFlag = async () => {
    if (!user) return;

    setIsFlagging(true);
    try {
      await supabase
        .from('review_flags')
        .insert({
          review_id: review.id,
          user_id: user.id,
          reason: 'inappropriate_content',
        });

      toast.success('Review flagged for moderation');
    } catch (error) {
      toast.error('Failed to flag review');
      console.error('Flag error:', error);
    } finally {
      setIsFlagging(false);
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
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.profiles?.avatar_url || ''} alt={displayName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{displayName}</span>
                {review.profiles?.is_verified && (
                  <Shield className="h-4 w-4 text-blue-600" />
                )}
                {review.is_verified_purchase && (
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    Verified User
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} readonly size="sm" />
                <span className="text-sm text-gray-500">
                  {new Date(review.created_at || '').toLocaleDateString()}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">{review.title}</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>
            </div>

            {review.use_case && (
              <div>
                <span className="text-sm font-medium text-gray-600">Use Case: </span>
                <span className="text-sm text-gray-700">{review.use_case}</span>
              </div>
            )}

            {(review.pros && review.pros.length > 0) && (
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Pros:</span>
                <div className="flex flex-wrap gap-1">
                  {review.pros.map((pro, index) => (
                    <Badge key={index} variant="outline" className="text-green-700 border-green-300">
                      {pro}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(review.cons && review.cons.length > 0) && (
              <div>
                <span className="text-sm font-medium text-gray-600 block mb-1">Cons:</span>
                <div className="flex flex-wrap gap-1">
                  {review.cons.map((con, index) => (
                    <Badge key={index} variant="outline" className="text-red-700 border-red-300">
                      {con}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(true)}
                      disabled={isVoting}
                      className={userVote === true ? 'text-green-600' : ''}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful_count || 0})
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(false)}
                      disabled={isVoting}
                      className={userVote === false ? 'text-red-600' : ''}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      Not Helpful
                    </Button>
                  </>
                ) : (
                  <AuthModal>
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Helpful ({review.helpful_count || 0})
                    </Button>
                  </AuthModal>
                )}
              </div>

              <div className="flex items-center gap-1">
                {isOwnReview ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={onEdit}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleDelete}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : user ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleFlag}
                    disabled={isFlagging}
                  >
                    <Flag className="h-4 w-4" />
                  </Button>
                ) : (
                  <AuthModal>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
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

export default ReviewCard;
