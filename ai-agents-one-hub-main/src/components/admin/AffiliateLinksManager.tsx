import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, Save, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Tables } from '@/integrations/supabase/types';

type Agent = Tables<'ai_agents'>;

interface AffiliateLinksManagerProps {
  agent: Agent;
  onUpdate: (agentId: string, updates: Partial<Agent>) => void;
}

const AffiliateLinksManager = ({ agent, onUpdate }: AffiliateLinksManagerProps) => {
  const { isAdmin, logAdminAction } = useAdminAuth();
  const [affiliateUrl, setAffiliateUrl] = useState(agent.affiliate_url || '');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAffiliateLink = async () => {
    if (!isAdmin) {
      toast.error('You do not have permission to update affiliate links');
      return;
    }

    setIsSaving(true);
    try {
      // Log the change for audit purposes
      if (affiliateUrl !== agent.affiliate_url) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error('User not authenticated');
          return;
        }

        const { error: logError } = await supabase
          .from('affiliate_link_changes')
          .insert({
            agent_id: agent.id,
            original_url: agent.website_url,
            affiliate_url: affiliateUrl || null,
            changed_by: user.id,
            notes: notes || null
          });

        if (logError) {
          console.error('Error logging affiliate link change:', logError);
        }
      }

      // Update the agent with the new affiliate URL
      const updates = { affiliate_url: affiliateUrl || null };
      await onUpdate(agent.id, updates);
      
      await logAdminAction('update_affiliate_link', 'ai_agents', agent.id, 
        { affiliate_url: agent.affiliate_url }, 
        { affiliate_url: affiliateUrl }
      );

      setNotes('');
      toast.success('Affiliate link updated successfully');
    } catch (error) {
      console.error('Error updating affiliate link:', error);
      toast.error('Failed to update affiliate link');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveAffiliateLink = async () => {
    if (!isAdmin) {
      toast.error('You do not have permission to remove affiliate links');
      return;
    }

    setIsSaving(true);
    try {
      // Log the removal for audit purposes
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not authenticated');
        return;
      }

      const { error: logError } = await supabase
        .from('affiliate_link_changes')
        .insert({
          agent_id: agent.id,
          original_url: agent.website_url,
          affiliate_url: null,
          changed_by: user.id,
          notes: 'Affiliate link removed'
        });

      if (logError) {
        console.error('Error logging affiliate link removal:', logError);
      }

      // Remove the affiliate URL
      const updates = { affiliate_url: null };
      await onUpdate(agent.id, updates);
      
      await logAdminAction('remove_affiliate_link', 'ai_agents', agent.id, 
        { affiliate_url: agent.affiliate_url }, 
        { affiliate_url: null }
      );

      setAffiliateUrl('');
      setNotes('');
      toast.success('Affiliate link removed successfully');
    } catch (error) {
      console.error('Error removing affiliate link:', error);
      toast.error('Failed to remove affiliate link');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ExternalLink className="h-5 w-5" />
          Affiliate Link Management
        </CardTitle>
        <CardDescription>
          Replace the original website URL with an affiliate link for monetization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="originalUrl">Original Website URL</Label>
          <Input
            id="originalUrl"
            value={agent.website_url}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="affiliateUrl">Affiliate URL (Optional)</Label>
          <Input
            id="affiliateUrl"
            placeholder="https://affiliate.example.com/..."
            value={affiliateUrl}
            onChange={(e) => setAffiliateUrl(e.target.value)}
            disabled={isSaving}
          />
          {agent.affiliate_url && (
            <p className="text-sm text-green-600">
              ✓ Affiliate link is active and will be used instead of the original URL
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add notes about this affiliate link change..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSaving}
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={handleSaveAffiliateLink} 
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Affiliate Link
              </>
            )}
          </Button>
          
          {agent.affiliate_url && (
            <Button 
              variant="outline" 
              onClick={handleRemoveAffiliateLink}
              disabled={isSaving}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AffiliateLinksManager;
