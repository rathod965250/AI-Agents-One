import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export const useNewsletterSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitEmail = async (email: string) => {
    setIsSubmitting(true);

    try {
      const { error: supabaseError } = await supabase
        .from('newsletter_subscriptions')
        .insert([
          {
            email: email.toLowerCase().trim(),
            source: 'website'
          }
        ]);

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          throw new Error("This email is already subscribed to our newsletter.");
        } else {
          throw supabaseError;
        }
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });

      return { success: true };
    } catch (err: unknown) {
      console.error('Newsletter subscription error:', err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again.";
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitEmail
  };
};
