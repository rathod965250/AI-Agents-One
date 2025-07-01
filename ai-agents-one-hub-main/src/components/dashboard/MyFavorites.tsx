import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Star, Eye, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import AgentCard from '@/components/AgentCard';

const MyFavorites = () => {
  const { user } = useAuth();

  const { data: favorites, isLoading, refetch } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          created_at,
          ai_agents (
            id,
            name,
            slug,
            category,
            pricing_type,
            average_rating,
            total_reviews,
            view_count,
            website_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      toast.success('Removed from favorites');
      refetch();
    } catch (error) {
      toast.error('Failed to remove favorite');
      console.error('Remove favorite error:', error);
    }
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'freemium': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
      case 'subscription': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div>Loading favorites...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Favorites</h2>
        <Badge variant="outline">
          {favorites?.length || 0} agents
        </Badge>
      </div>

      {favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const agent = (favorite as any).ai_agents;
            if (!agent) return null;
            return <AgentCard key={favorite.id} agent={agent} />;
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No favorites yet</p>
            <Button asChild>
              <a href="/browse">Discover AI Agents</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyFavorites;
