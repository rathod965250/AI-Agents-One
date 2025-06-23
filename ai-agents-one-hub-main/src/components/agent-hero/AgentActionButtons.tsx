import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Twitter, Linkedin, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { UpvoteButton } from './UpvoteButton';
import { FavoriteButton } from './FavoriteButton';
import AuthModal from '@/components/AuthModal';
import { ChevronUp, Bookmark } from 'lucide-react';

type Agent = Tables<'ai_agents'>;
type User = Tables<'profiles'>;

interface AgentActionButtonsProps {
  agent: Agent;
  user: User | null;
  isUpvoted: boolean;
  setIsUpvoted: (value: boolean) => void;
  upvoteCount: number;
  setUpvoteCount: (value: number | ((prev: number) => number)) => void;
  isFavorited: boolean;
  refetchFavorite: () => void;
}

export const AgentActionButtons = ({
  agent,
  user,
  isUpvoted,
  setIsUpvoted,
  upvoteCount,
  setUpvoteCount,
  isFavorited,
  refetchFavorite
}: AgentActionButtonsProps) => {
  // Increment click count when visiting website
  const handleWebsiteClick = async () => {
    try {
      await supabase.rpc('increment_agent_clicks', { agent_id: agent.id });
    } catch (error) {
      console.error('Failed to increment click count:', error);
    }
  };

  // Use affiliate URL if available, otherwise use original website URL
  const getWebsiteUrl = () => {
    return agent.affiliate_url || agent.website_url;
  };

  return (
    <div className="flex flex-col gap-3 lg:w-64">
      {/* Primary Website Button */}
      <Button asChild size="lg" className="w-full" onClick={handleWebsiteClick}>
        <a href={getWebsiteUrl()} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="h-4 w-4 mr-2" />
          Visit Website
        </a>
      </Button>
      
      {/* Optional Links from Submit Form - Only show if they exist */}
      <div className="grid grid-cols-2 gap-2">
        {agent.repository_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={agent.repository_url} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4 mr-1" />
              Repository
            </a>
          </Button>
        )}
        
        {agent.additional_resources_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={agent.additional_resources_url} target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4 mr-1" />
              Documentation
            </a>
          </Button>
        )}
        
        {agent.linkedin_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={agent.linkedin_url} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4 mr-1" />
              LinkedIn
            </a>
          </Button>
        )}
        
        {agent.twitter_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={agent.twitter_url} target="_blank" rel="noopener noreferrer">
              <Twitter className="h-4 w-4 mr-1" />
              Twitter
            </a>
          </Button>
        )}
      </div>
      
      {/* Upvote and Favorite */}
      <div className="flex gap-2">
        {user ? (
          <UpvoteButton
            agent={agent}
            user={user}
            isUpvoted={isUpvoted}
            setIsUpvoted={setIsUpvoted}
            upvoteCount={upvoteCount}
            setUpvoteCount={setUpvoteCount}
          />
        ) : (
          <AuthModal>
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronUp className="h-4 w-4" />
              Upvote ({upvoteCount})
            </Button>
          </AuthModal>
        )}
        
        {user ? (
          <FavoriteButton
            agent={agent}
            user={user}
            isFavorited={isFavorited}
            refetchFavorite={refetchFavorite}
          />
        ) : (
          <AuthModal>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4" />
            </Button>
          </AuthModal>
        )}
      </div>
    </div>
  );
};
