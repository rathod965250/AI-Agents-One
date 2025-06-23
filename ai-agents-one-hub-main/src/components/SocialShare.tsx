
import { Tables } from '@/integrations/supabase/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Linkedin, Link2 } from 'lucide-react';
import { toast } from 'sonner';

type Agent = Tables<'ai_agents'>;

interface SocialShareProps {
  agent: Agent;
}

const SocialShare = ({ agent }: SocialShareProps) => {
  const currentUrl = window.location.href;
  const shareText = `Check out ${agent.name} - AI Agent`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success('Link copied to clipboard!');
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank');
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share This Agent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleCopyLink}
        >
          <Link2 className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleTwitterShare}
        >
          <Twitter className="h-4 w-4 mr-2" />
          Share on Twitter
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleFacebookShare}
        >
          <Facebook className="h-4 w-4 mr-2" />
          Share on Facebook
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLinkedInShare}
        >
          <Linkedin className="h-4 w-4 mr-2" />
          Share on LinkedIn
        </Button>
      </CardContent>
    </Card>
  );
};

export default SocialShare;
