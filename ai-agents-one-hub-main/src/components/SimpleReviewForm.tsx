import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tables } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import StarRating from './StarRating';
import AuthModal from './AuthModal';

type Agent = Tables<'ai_agents'>;

const reviewSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100, 'Title too long'),
  content: z.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review too long'),
  rating: z.number().min(1, 'Please select a rating').max(5),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface SimpleReviewFormProps {
  agent: Agent;
  onSubmitSuccess: () => void;
  existingReview?: Tables<'agent_reviews'>;
}

const SimpleReviewForm = ({ agent, onSubmitSuccess, existingReview }: SimpleReviewFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: existingReview?.title || '',
      content: existingReview?.content || '',
      rating: existingReview?.rating || 0,
    },
  });

  const content = form.watch('content') || '';

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>
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
                  <FormLabel>Add a headline</FormLabel>
                  <FormControl>
                    <Input placeholder="What's most important to know?" {...field} />
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
                  <FormLabel>Add a written review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What did you like or dislike? What did you use this product for?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <div className="flex justify-between items-center">
                    <FormMessage />
                    <span className="text-xs text-gray-500">
                      {content.length}/1000
                    </span>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SimpleReviewForm;
