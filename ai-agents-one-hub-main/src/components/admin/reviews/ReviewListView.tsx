import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Star, Flag, ThumbsUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Review } from '@/integrations/supabase/types';

interface ReviewListViewProps {
  reviews: Review[];
  isLoading: boolean;
  selectedReviews: string[];
  onSelectionChange: (reviews: string[]) => void;
  onReviewClick: (review: Review) => void;
}

export function ReviewListView({
  reviews,
  isLoading,
  selectedReviews,
  onSelectionChange,
  onReviewClick
}: ReviewListViewProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(reviews.map(review => review.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectReview = (reviewId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedReviews, reviewId]);
    } else {
      onSelectionChange(selectedReviews.filter(id => id !== reviewId));
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getReviewStatus = (review: Review) => {
    if (review.content_flags && review.content_flags.length > 0) {
      return 'flagged';
    }
    return review.status || 'pending';
  };

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
      case 'flagged':
        return 'destructive';
      case 'pending':
        return 'outline';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={selectedReviews.length === reviews.length && reviews.length > 0}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Review</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Helpful</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>
                <Checkbox
                  checked={selectedReviews.includes(review.id)}
                  onCheckedChange={(checked) => handleSelectReview(review.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="max-w-xs">
                <div>
                  <div className="font-medium truncate">{review.title}</div>
                  <div className="text-sm text-gray-500 truncate">{review.content}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">{review.ai_agents?.name}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {review.profiles?.full_name || review.profiles?.username || 'Anonymous'}
                </div>
              </TableCell>
              <TableCell>
                {renderStars(review.rating)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={getStatusVariant(getReviewStatus(review))}
                  >
                    {getReviewStatus(review)}
                  </Badge>
                  {review.content_flags && review.content_flags.length > 0 && (
                    <Flag className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-gray-400" />
                  <span>{review.helpful_count || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                {review.created_at && new Date(review.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReviewClick(review)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
