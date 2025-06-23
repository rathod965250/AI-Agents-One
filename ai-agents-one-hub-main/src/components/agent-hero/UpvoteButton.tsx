import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type Agent = Tables<'ai_agents'>;
type User = Tables<'profiles'>;

interface UpvoteButtonProps {
  agent: Agent;
  user: User | null;
  isUpvoted: boolean;
  setIsUpvoted: (value: boolean) => void;
  upvoteCount: number;
  setUpvoteCount: (value: number | ((prev: number) => number)) => void;
}

export const UpvoteButton = ({ 
  agent, 
  user, 
  isUpvoted, 
  setIsUpvoted, 
  upvoteCount, 
  setUpvoteCount 
}: UpvoteButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleUpvote = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (isUpvoted) {
        const { error } = await supabase
          .from('agent_upvotes')
          .delete()
          .eq('agent_id', agent.id)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        setIsUpvoted(false);
        setUpvoteCount(prev => prev - 1);
      } else {
        const { error } = await supabase
          .from('agent_upvotes')
          .insert({
            agent_id: agent.id,
            user_id: user.id,
          });
        
        if (error) throw error;
        
        setIsUpvoted(true);
        setUpvoteCount(prev => prev + 1);
      }
    } catch (error: unknown) {
      toast.error('Failed to update upvote');
      console.error('Upvote error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleUpvote}
      disabled={loading}
      className={`flex items-center gap-2 ${isUpvoted ? 'bg-primary/10 border-primary' : ''}`}
    >
      <ChevronUp className={`h-4 w-4 ${isUpvoted ? 'text-primary' : ''}`} />
      Upvote ({upvoteCount})
    </Button>
  );
};
