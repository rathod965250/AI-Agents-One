import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import StarRating from './StarRating';
import AuthModal from './AuthModal';

type Agent = Tables<'ai_agents'>;

const reviewSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  content: z.string().min(20, 'Review must be at least 20 characters').max(2000, 'Review too long'),
  rating: z.number().min(1, 'Please select a rating').max(5),
  useCase: z.string().max(200, 'Use case too long').optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  agent: Agent;
  onSubmitSuccess: () => void;
  existingReview?: Tables<'agent_reviews'>;
}

const ReviewForm = ({ agent, onSubmitSuccess, existingReview }: ReviewFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: existingReview?.title || '',
      content: existingReview?.content || '',
      rating: existingReview?.rating || 0,
      useCase: existingReview?.use_case || '',
      pros: existingReview?.pros || [],
      cons: existingReview?.cons || [],
    },
  });

  const pros = form.watch('pros') || [];
  const cons = form.watch('cons') || [];
  const content = form.watch('content') || '';

  const addPro = () => {
    if (newPro.trim() && pros.length < 5) {
      form.setValue('pros', [...pros, newPro.trim()]);
      setNewPro('');
    }
  };

  const removePro = (index: number) => {
    form.setValue('pros', pros.filter((_, i) => i !== index));
  };

  const addCon = () => {
    if (newCon.trim() && cons.length < 5) {
      form.setValue('cons', [...cons, newCon.trim()]);
      setNewCon('');
    }
  };

  const removeCon = (index: number) => {
    form.setValue('cons', cons.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const reviewData = {
        agent_id: agent.id,
        user_id: user.id,
        title: data.title,
        content: data.content,
        rating: data.rating,
        use_case: data.useCase || null,
        pros: data.pros || [],
        cons: data.cons || [],
      };

      if (existingReview) {
        const { error } = await supabase
          .from('agent_reviews')
          .update(reviewData)
          .eq('id', existingReview.id);
        
        if (error) throw error;
        toast.success('Review updated successfully!');
      } else {
        const { error } = await supabase
          .from('agent_reviews')
          .insert(reviewData);
        
        if (error) throw error;
        toast.success('Review submitted successfully!');
      }

      onSubmitSuccess();
    } catch (error: unknown) {
      toast.error('Failed to submit review');
      console.error('Review submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Sign in to write a review</p>
            <AuthModal>
              <Button>Sign In to Review</Button>
            </AuthModal>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {existingReview ? 'Edit Review' : 'Write a Review'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating *</FormLabel>
                  <FormControl>
                    <StarRating
                      rating={field.value}
                      onRatingChange={field.onChange}
                      size="lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Summarize your experience..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Review *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your detailed experience with this AI agent..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage />
                    <span className="text-xs text-gray-500">
                      {content.length}/2000
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useCase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Use Case (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="How did you use this agent?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FormLabel>Pros (Optional)</FormLabel>
                <div className="space-y-2 mt-2">
                  {pros.map((pro, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        {pro}
                        <X
                          className="h-3 w-3 ml-1 cursor-pointer"
                          onClick={() => removePro(index)}
                        />
                      </Badge>
                    </div>
                  ))}
                  {pros.length < 5 && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a pro..."
                        value={newPro}
                        onChange={(e) => setNewPro(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                        className="flex-1"
                      />
                      <Button type="button" size="sm" onClick={addPro}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <FormLabel>Cons (Optional)</FormLabel>
                <div className="space-y-2 mt-2">
                  {cons.map((con, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline" className="text-red-700 border-red-300">
                        {con}
                        <X
                          className="h-3 w-3 ml-1 cursor-pointer"
                          onClick={() => removeCon(index)}
                        />
                      </Badge>
                    </div>
                  ))}
                  {cons.length < 5 && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a con..."
                        value={newCon}
                        onChange={(e) => setNewCon(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                        className="flex-1"
                      />
                      <Button type="button" size="sm" onClick={addCon}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
