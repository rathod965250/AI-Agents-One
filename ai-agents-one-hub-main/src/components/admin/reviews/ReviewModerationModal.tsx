import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Flag, ThumbsUp, Check, X, AlertTriangle } from 'lucide-react';

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  pros: string[] | null;
  cons: string[] | null;
  use_case: string | null;
  created_at: string | null;
  helpful_count: number | null;
  status: 'pending' | 'approved' | 'rejected' | null;
  moderation_reason: string | null;
  is_featured?: boolean;
  profiles?: { username: string; full_name: string };
  ai_agents?: { name: string; slug: string };
  content_flags?: { reason: string; status: string }[];
}

interface ReviewModerationModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (reviewId: string, updates: Partial<Review>) => void;
  onFeature: (reviewId: string, feature: boolean) => void;
  onDelete: (reviewId: string) => void;
  onEdit: (reviewId: string, updates: Partial<Review>) => void;
}

export function ReviewModerationModal({
  review,
  isOpen,
  onClose,
  onUpdate,
  onFeature,
  onDelete,
  onEdit
}: ReviewModerationModalProps) {
  const [moderationNotes, setModerationNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(review.content);
  const isFeatured = !!review.is_featured;

  useEffect(() => {
    if (review) {
      setModerationNotes(review.moderation_reason || '');
    }
  }, [review]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleApprove = () => {
    onUpdate(review.id, { status: 'approved', moderation_reason: moderationNotes });
  };

  const handleReject = () => {
    onUpdate(review.id, { status: 'rejected', moderation_reason: moderationNotes });
  };

  const handleFeature = () => onFeature(review.id, !isFeatured);

  const handleDelete = () => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    onDelete(review.id);
    onClose();
  };

  const handleEdit = () => {
    onEdit(review.id, { content: editContent });
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Review Moderation
            <Badge 
              variant={review.status === 'approved' ? 'default' : review.status === 'rejected' ? 'destructive' : 'outline'}
            >
              {review.status || 'pending'}
            </Badge>
            {review.content_flags && review.content_flags.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <Flag className="h-3 w-3" />
                Flagged
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="review" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="review">Review Details</TabsTrigger>
            <TabsTrigger value="context">Context</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
          </TabsList>

          <TabsContent value="review" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{review.title}</CardTitle>
                  {renderStars(review.rating)}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>By {review.profiles?.full_name || review.profiles?.username || 'Anonymous'}</span>
                  <span>•</span>
                  <span>For {review.ai_agents?.name}</span>
                  <span>•</span>
                  <span>{review.created_at && new Date(review.created_at).toLocaleDateString()}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.helpful_count || 0} helpful</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Review Content</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{review.content}</p>
                </div>

                {review.pros && review.pros.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-green-700">Pros</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="text-gray-700">{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {review.cons && review.cons.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-red-700">Cons</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {review.cons.map((con, index) => (
                        <li key={index} className="text-gray-700">{con}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {review.use_case && (
                  <div>
                    <h4 className="font-medium mb-2">Use Case</h4>
                    <p className="text-gray-700">{review.use_case}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="context" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Agent Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div><strong>Name:</strong> {review.ai_agents?.name}</div>
                  <div><strong>Slug:</strong> {review.ai_agents?.slug}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Author Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div><strong>Name:</strong> {review.profiles?.full_name || 'Not provided'}</div>
                  <div><strong>Username:</strong> {review.profiles?.username || 'Not provided'}</div>
                </div>
              </CardContent>
            </Card>

            {review.content_flags && review.content_flags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Content Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {review.content_flags.map((flag, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="destructive">{flag.reason}</Badge>
                          <Badge variant="outline">{flag.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="moderation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Moderation Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label htmlFor="moderation_notes">Moderation Notes</Label>
                <Textarea
                  id="moderation_notes"
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                  placeholder="Add notes for moderation (optional)"
                />
                <div className="flex gap-2 mt-2">
                  <Button variant="default" onClick={handleApprove}>
                    <Check className="h-4 w-4 mr-2" /> Approve
                  </Button>
                  <Button variant="destructive" onClick={handleReject}>
                    <X className="h-4 w-4 mr-2" /> Reject
                  </Button>
                  <Button variant="outline" onClick={handleFeature}>
                    {isFeatured ? 'Unfeature' : 'Feature'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel Edit' : 'Edit Content'}
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
                {isEditing && (
                  <div className="mt-4">
                    <Label>Edit Review Content</Label>
                    <Textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows={4}
                    />
                    <Button className="mt-2" onClick={handleEdit}>
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
