import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type Agent = Tables<'ai_agents'>;
type User = Tables<'profiles'>;

interface FavoriteButtonProps {
  agent: Agent;
  user: User | null;
  isFavorited: boolean;
  refetchFavorite: () => void;
}

export const FavoriteButton = ({ agent, user, isFavorited, refetchFavorite }: FavoriteButtonProps) => {
  const handleFavorite = async () => {
    if (!user) return;

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('agent_id', agent.id);

        if (error) throw error;
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            agent_id: agent.id,
          });

        if (error) throw error;
        toast.success('Added to favorites');
      }

      refetchFavorite();
    } catch (error: unknown) {
      toast.error('Failed to update favorites');
      console.error('Favorite error:', error);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleFavorite}
      className={isFavorited ? 'bg-red-50 border-red-200 text-red-600' : ''}
    >
      <Bookmark className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
    </Button>
  );
};
