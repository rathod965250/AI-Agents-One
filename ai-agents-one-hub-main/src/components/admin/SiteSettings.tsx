import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const SiteSettings = () => {
  const { isAdmin, logAdminAction } = useAdminAuth();
  const [supportEmail, setSupportEmail] = useState('hello@aiagentsone.in');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .eq('key', 'support_email')
          .single();

        if (data && !error) {
          setSupportEmail(data.value);
        } else if (error && error.code === 'PGRST116') {
          // Setting doesn't exist yet, use default
          setSupportEmail('hello@aiagentsone.in');
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchSettings();
    }
  }, [isAdmin]);

  const handleSave = async () => {
    if (!isAdmin) {
      toast.error('You do not have permission to update settings');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          key: 'support_email',
          value: supportEmail,
          description: 'Support email address displayed in footer'
        });

      if (error) throw error;

      await logAdminAction('update_site_setting', 'site_settings', 'support_email', null, { value: supportEmail });
      
      toast.success('Support email updated successfully');
    } catch (error) {
      console.error('Error updating site settings:', error);
      toast.error('Failed to update support email');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage global site configuration and settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Settings
          </CardTitle>
          <CardDescription>
            Configure contact information displayed throughout the site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="supportEmail">Support Email Address</Label>
            <Input
              id="supportEmail"
              type="email"
              placeholder="support@example.com"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              This email will be displayed in the footer and used for contact purposes
            </p>
          </div>
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving || isLoading}
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;
